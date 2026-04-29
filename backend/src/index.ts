import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";
import OpenAI from "openai";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5174" }));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.get("/api/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT 1");
    res.json({ status: "ok", db: result.rowCount === 1 });
  } catch (err) {
    res.status(500).json({ status: "error", db: false });
  }
});

app.get("/api/ministries", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT ministry FROM ab.ab_contracts ORDER BY ministry"
    );
    res.json({ ministries: result.rows.map((r) => r.ministry) });
  } catch (err) {
    console.error("Error fetching ministries:", err);
    res.status(500).json({ error: "Failed to fetch ministries" });
  }
});

async function getRecipientsData(ministry: string) {
  const [topRecipients, soleTotals] = await Promise.all([
    pool.query(
      `SELECT recipient, SUM(amount) AS total_spend
       FROM ab.ab_contracts
       WHERE ministry = $1
       GROUP BY recipient
       ORDER BY total_spend DESC
       LIMIT 10`,
      [ministry]
    ),
    pool.query(
      `SELECT vendor AS recipient, SUM(amount) AS sole_source_total
       FROM ab.ab_sole_source
       WHERE ministry = $1
       GROUP BY vendor`,
      [ministry]
    ),
  ]);

  const soleMap = new Map(
    soleTotals.rows.map((r) => [r.recipient, Number(r.sole_source_total)])
  );

  const ministryTotal = topRecipients.rows.reduce(
    (sum, r) => sum + Number(r.total_spend),
    0
  );

  const recipients = topRecipients.rows.map((r) => ({
    recipient: r.recipient,
    total_spend: Number(r.total_spend),
    sole_source_spend: soleMap.get(r.recipient) ?? 0,
    share: ministryTotal > 0 ? Number(r.total_spend) / ministryTotal : 0,
  }));

  return { recipients, ministry_total: ministryTotal };
}

app.get("/api/recipients", async (req, res) => {
  const ministry = req.query.ministry as string;
  if (!ministry) {
    res.status(400).json({ error: "ministry query param is required" });
    return;
  }

  try {
    const data = await getRecipientsData(ministry);
    res.json(data);
  } catch (err) {
    console.error("Error fetching recipients:", err);
    res.status(500).json({ error: "Failed to fetch recipients" });
  }
});

app.get("/api/summary", async (req, res) => {
  const ministry = req.query.ministry as string;
  if (!ministry) {
    res.status(400).json({ error: "ministry query param is required" });
    return;
  }

  try {
    const { recipients, ministry_total } = await getRecipientsData(ministry);

    const topVendor = recipients[0];
    const totalSoleSource = recipients.reduce((s, r) => s + r.sole_source_spend, 0);

    const prompt = `You are a government procurement analyst. Summarize the following data in 2-4 neutral, factual sentences. Focus on vendor concentration risk and sole-source reliance. Do not speculate beyond the data.

Ministry: ${ministry}
Top 10 vendors total spend: $${ministry_total.toLocaleString()}
Top vendor: ${topVendor?.recipient ?? "N/A"} at ${((topVendor?.share ?? 0) * 100).toFixed(1)}% of top-10 spend ($${(topVendor?.total_spend ?? 0).toLocaleString()})
Total sole-source spend among top 10: $${totalSoleSource.toLocaleString()}
Number of vendors with sole-source contracts: ${recipients.filter((r) => r.sole_source_spend > 0).length} of ${recipients.length}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content?.trim() ?? "";
    res.json({ summary });
  } catch (err) {
    console.error("Error generating summary:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
