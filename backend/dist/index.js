import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";
import OpenAI from "openai";
const app = express();
const PORT = Number(process.env.PORT ?? 3001);
const defaultOrigins = ["http://localhost:5173", "http://localhost:5174"];
const configuredOrigins = process.env.CORS_ORIGIN
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
const allowedOrigins = configuredOrigins?.length
    ? configuredOrigins
    : defaultOrigins;
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Not allowed by CORS"));
    },
}));
app.use(express.json());
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});
function calculateRiskScore({ topVendorShare, top3Share, soleSourceShare, }) {
    return Number((topVendorShare * 0.45 +
        top3Share * 0.35 +
        soleSourceShare * 0.2).toFixed(4));
}
function formatPercent(value) {
    return `${(value * 100).toFixed(1)}%`;
}
function formatCurrency(value) {
    return `$${Math.round(value).toLocaleString()}`;
}
function normalizeText(value) {
    return value.toLowerCase();
}
function uniqueMinistries(ministries) {
    return Array.from(new Set(ministries));
}
function detectIntent(query, ministries, selectedMinistry) {
    const normalizedQuery = normalizeText(query);
    const matchedMinistries = uniqueMinistries(ministries.filter((ministry) => normalizedQuery.includes(normalizeText(ministry))));
    const explainPattern = /why|explain|risky|risk in|risk for|investigate|look risky|looks risky|risky|concentration|sole[- ]source|vendor concentration|exposure|concern/;
    const comparePattern = /compare|comparison|versus|vs\b|against|relative to|stack up|different|difference|better than|worse than/;
    const overallPattern = /riskiest|least risky|highest risk|lowest risk|overall risk|which ministry|rank|ranking|across ministries|across all ministries|most risky|who looks risky|top risk/;
    const referencesSelectedMinistry = /this ministry|selected ministry|current ministry|that ministry/.test(normalizedQuery);
    const normalizedSelectedMinistry = selectedMinistry?.trim();
    const selectedMinistryIsValid = normalizedSelectedMinistry &&
        ministries.includes(normalizedSelectedMinistry);
    if (matchedMinistries.length >= 2 && comparePattern.test(normalizedQuery)) {
        return {
            type: "compare_ministries",
            ministries: [matchedMinistries[0], matchedMinistries[1]],
        };
    }
    if (matchedMinistries.length >= 1 && explainPattern.test(normalizedQuery)) {
        return {
            type: "explain_ministry_risk",
            ministry: matchedMinistries[0],
        };
    }
    if (selectedMinistryIsValid &&
        explainPattern.test(normalizedQuery) &&
        (matchedMinistries.length === 0 || referencesSelectedMinistry)) {
        return {
            type: "explain_ministry_risk",
            ministry: normalizedSelectedMinistry,
        };
    }
    if (overallPattern.test(normalizedQuery)) {
        return { type: "overall_risk_ranking" };
    }
    if (selectedMinistryIsValid &&
        matchedMinistries.length >= 1 &&
        matchedMinistries[0] !== normalizedSelectedMinistry &&
        comparePattern.test(normalizedQuery)) {
        return {
            type: "compare_ministries",
            ministries: [normalizedSelectedMinistry, matchedMinistries[0]],
        };
    }
    if (selectedMinistryIsValid &&
        explainPattern.test(normalizedQuery) &&
        matchedMinistries.length === 0) {
        return {
            type: "explain_ministry_risk",
            ministry: normalizedSelectedMinistry,
        };
    }
    if (matchedMinistries.length === 1 &&
        !comparePattern.test(normalizedQuery) &&
        !overallPattern.test(normalizedQuery)) {
        return {
            type: "explain_ministry_risk",
            ministry: matchedMinistries[0],
        };
    }
    return null;
}
async function synthesizeInvestigationAnswer({ query, evidence, steps, nextSteps, }) {
    const prompt = `You are a government procurement risk analyst. Answer the user's investigation request in 2-4 neutral, factual sentences. Use only the evidence provided. Do not invent facts or recommendations beyond the supplied evidence.

User query: ${query}

Evidence:
- ${evidence.join("\n- ")}

Analysis steps taken:
- ${steps.join("\n- ")}

Suggested next steps:
- ${nextSteps.join("\n- ")}`;
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 220,
        temperature: 0.2,
    });
    return completion.choices[0]?.message?.content?.trim() ?? "";
}
async function buildOverallRiskRankingInvestigation(query, riskScan) {
    const topThree = riskScan.slice(0, 3);
    const highestConcentration = [...riskScan].sort((a, b) => b.top_vendor_share - a.top_vendor_share)[0];
    const highestSoleSource = [...riskScan].sort((a, b) => b.sole_source_share - a.sole_source_share)[0];
    const evidence = [
        `${topThree[0]?.ministry ?? "N/A"} has the highest composite risk score at ${topThree[0]?.risk_score.toFixed(2) ?? "0.00"}.`,
        `${highestConcentration?.ministry ?? "N/A"} has the highest top-vendor share at ${formatPercent(highestConcentration?.top_vendor_share ?? 0)}.`,
        `${highestSoleSource?.ministry ?? "N/A"} has the highest sole-source share at ${formatPercent(highestSoleSource?.sole_source_share ?? 0)}.`,
    ];
    const steps = [
        "Loaded the ministry risk scan across all ministries.",
        "Ranked ministries by the composite risk score.",
        "Cross-checked which ministries lead on concentration and sole-source reliance.",
    ];
    const nextSteps = topThree
        .slice(0, 2)
        .map((item) => `Inspect top recipients and sole-source exposure in ${item.ministry}.`);
    const answer = await synthesizeInvestigationAnswer({
        query,
        evidence,
        steps,
        nextSteps,
    });
    return { answer, evidence, steps, next_steps: nextSteps };
}
async function buildCompareMinistriesInvestigation(query, riskScan, ministries) {
    const [leftMinistry, rightMinistry] = ministries;
    const left = riskScan.find((item) => item.ministry === leftMinistry);
    const right = riskScan.find((item) => item.ministry === rightMinistry);
    if (!left || !right) {
        throw new Error("Could not find both ministries for comparison");
    }
    const evidence = [
        `${left.ministry} risk score: ${left.risk_score.toFixed(2)} versus ${right.risk_score.toFixed(2)} for ${right.ministry}.`,
        `${left.ministry} top-vendor share is ${formatPercent(left.top_vendor_share)} versus ${formatPercent(right.top_vendor_share)} for ${right.ministry}.`,
        `${left.ministry} sole-source share is ${formatPercent(left.sole_source_share)} versus ${formatPercent(right.sole_source_share)} for ${right.ministry}.`,
    ];
    const steps = [
        `Loaded risk metrics for ${left.ministry} and ${right.ministry}.`,
        "Compared composite risk, vendor concentration, and sole-source reliance.",
    ];
    const nextSteps = [
        `Open ${left.risk_score >= right.risk_score ? left.ministry : right.ministry} to inspect the top recipient table.`,
        `Review whether the higher-risk ministry's leading vendors account for most spending.`,
    ];
    const answer = await synthesizeInvestigationAnswer({
        query,
        evidence,
        steps,
        nextSteps,
    });
    return { answer, evidence, steps, next_steps: nextSteps };
}
async function buildExplainMinistryRiskInvestigation(query, riskScan, ministry) {
    const riskItem = riskScan.find((item) => item.ministry === ministry);
    if (!riskItem) {
        throw new Error("Could not find the ministry requested for explanation");
    }
    const { recipients } = await getRecipientsData(ministry);
    const topRecipient = recipients[0];
    const highSoleSourceRecipients = recipients.filter((recipient) => recipient.total_spend > 0 &&
        recipient.sole_source_spend / recipient.total_spend > 0.5);
    const evidence = [
        `${ministry} has a composite risk score of ${riskItem.risk_score.toFixed(2)}.`,
        `The top vendor share is ${formatPercent(riskItem.top_vendor_share)}, and the top 3 vendors account for ${formatPercent(riskItem.top_3_share)} of spending.`,
        `The ministry's sole-source share is ${formatPercent(riskItem.sole_source_share)} across ${formatCurrency(riskItem.total_spend)} in observed spend.`,
        topRecipient
            ? `${topRecipient.recipient} is the largest recipient at ${formatPercent(topRecipient.share)} of ministry spend.`
            : `No top recipient details were available for ${ministry}.`,
        highSoleSourceRecipients.length > 0
            ? `${highSoleSourceRecipients.length} of the top recipients have majority sole-source spend.`
            : `None of the top recipients have majority sole-source spend.`,
    ];
    const steps = [
        `Loaded the ministry risk scan entry for ${ministry}.`,
        `Retrieved the top recipients for ${ministry}.`,
        "Checked both concentration and sole-source signals.",
    ];
    const nextSteps = [
        `Review the top recipient table for ${ministry}.`,
        `Check whether ${topRecipient?.recipient ?? "the leading vendor"} appears across other ministries.`,
    ];
    const answer = await synthesizeInvestigationAnswer({
        query,
        evidence,
        steps,
        nextSteps,
    });
    return { answer, evidence, steps, next_steps: nextSteps };
}
app.get("/api/health", async (_req, res) => {
    try {
        const result = await pool.query("SELECT 1");
        res.json({ status: "ok", db: result.rowCount === 1 });
    }
    catch (err) {
        res.status(500).json({ status: "error", db: false });
    }
});
app.get("/api/ministries", async (_req, res) => {
    try {
        const result = await pool.query("SELECT DISTINCT ministry FROM ab.ab_contracts ORDER BY ministry");
        res.json({ ministries: result.rows.map((r) => r.ministry) });
    }
    catch (err) {
        console.error("Error fetching ministries:", err);
        res.status(500).json({ error: "Failed to fetch ministries" });
    }
});
async function getRecipientsData(ministry) {
    const [topRecipients, soleTotals] = await Promise.all([
        pool.query(`SELECT recipient, SUM(amount) AS total_spend
       FROM ab.ab_contracts
       WHERE ministry = $1
       GROUP BY recipient
       ORDER BY total_spend DESC
       LIMIT 10`, [ministry]),
        pool.query(`SELECT vendor AS recipient, SUM(amount) AS sole_source_total
       FROM ab.ab_sole_source
       WHERE ministry = $1
       GROUP BY vendor`, [ministry]),
    ]);
    const soleMap = new Map(soleTotals.rows.map((r) => [r.recipient, Number(r.sole_source_total)]));
    const ministryTotal = topRecipients.rows.reduce((sum, r) => sum + Number(r.total_spend), 0);
    const recipients = topRecipients.rows.map((r) => ({
        recipient: r.recipient,
        total_spend: Number(r.total_spend),
        sole_source_spend: soleMap.get(r.recipient) ?? 0,
        share: ministryTotal > 0 ? Number(r.total_spend) / ministryTotal : 0,
    }));
    return { recipients, ministry_total: ministryTotal };
}
async function getRiskScanData() {
    const [recipientTotals, soleSourceTotals] = await Promise.all([
        pool.query(`SELECT ministry, recipient, SUM(amount) AS total_spend
       FROM ab.ab_contracts
       WHERE ministry IS NOT NULL
         AND recipient IS NOT NULL
       GROUP BY ministry, recipient
       ORDER BY ministry ASC, total_spend DESC`),
        pool.query(`SELECT ministry, SUM(amount) AS sole_source_total
       FROM ab.ab_sole_source
       WHERE ministry IS NOT NULL
       GROUP BY ministry`),
    ]);
    const ministryRecipientTotals = new Map();
    const ministrySpendTotals = new Map();
    for (const row of recipientTotals.rows) {
        const ministry = row.ministry;
        const totalSpend = Number(row.total_spend);
        ministryRecipientTotals.set(ministry, [
            ...(ministryRecipientTotals.get(ministry) ?? []),
            totalSpend,
        ]);
        ministrySpendTotals.set(ministry, (ministrySpendTotals.get(ministry) ?? 0) + totalSpend);
    }
    const soleSourceByMinistry = new Map(soleSourceTotals.rows.map((row) => [
        row.ministry,
        Number(row.sole_source_total),
    ]));
    return Array.from(ministryRecipientTotals.entries())
        .map(([ministry, recipientValues]) => {
        const totalSpend = ministrySpendTotals.get(ministry) ?? 0;
        const topVendorSpend = recipientValues[0] ?? 0;
        const top3Spend = recipientValues
            .slice(0, 3)
            .reduce((sum, amount) => sum + amount, 0);
        const soleSourceSpend = soleSourceByMinistry.get(ministry) ?? 0;
        const topVendorShare = totalSpend > 0 ? topVendorSpend / totalSpend : 0;
        const top3Share = totalSpend > 0 ? top3Spend / totalSpend : 0;
        const soleSourceShare = totalSpend > 0 ? soleSourceSpend / totalSpend : 0;
        return {
            ministry,
            top_vendor_share: Number(topVendorShare.toFixed(4)),
            top_3_share: Number(top3Share.toFixed(4)),
            sole_source_share: Number(soleSourceShare.toFixed(4)),
            total_spend: Number(totalSpend.toFixed(2)),
            risk_score: calculateRiskScore({
                topVendorShare,
                top3Share,
                soleSourceShare,
            }),
        };
    })
        .sort((a, b) => b.risk_score - a.risk_score);
}
app.get("/api/recipients", async (req, res) => {
    const ministry = req.query.ministry;
    if (!ministry) {
        res.status(400).json({ error: "ministry query param is required" });
        return;
    }
    try {
        const data = await getRecipientsData(ministry);
        res.json(data);
    }
    catch (err) {
        console.error("Error fetching recipients:", err);
        res.status(500).json({ error: "Failed to fetch recipients" });
    }
});
app.get("/api/risk-scan", async (_req, res) => {
    try {
        const ministries = await getRiskScanData();
        res.json({ ministries });
    }
    catch (err) {
        console.error("Error running risk scan:", err);
        res.status(500).json({ error: "Failed to scan ministry risk" });
    }
});
app.get("/api/summary", async (req, res) => {
    const ministry = req.query.ministry;
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
    }
    catch (err) {
        console.error("Error generating summary:", err);
        res.status(500).json({ error: "Failed to generate summary" });
    }
});
app.post("/api/investigate", async (req, res) => {
    const body = req.body;
    const query = body?.query?.trim();
    const selectedMinistry = body?.ministry?.trim();
    if (!query) {
        res.status(400).json({ error: "query is required" });
        return;
    }
    try {
        const riskScan = await getRiskScanData();
        const ministries = riskScan.map((item) => item.ministry);
        const intent = detectIntent(query, ministries, selectedMinistry);
        if (!intent) {
            res.status(400).json({
                error: "Unsupported investigation query. Try asking which ministry looks riskiest, compare two ministries, or explain why the selected ministry looks risky.",
            });
            return;
        }
        let result;
        switch (intent.type) {
            case "overall_risk_ranking":
                result = await buildOverallRiskRankingInvestigation(query, riskScan);
                break;
            case "compare_ministries":
                result = await buildCompareMinistriesInvestigation(query, riskScan, intent.ministries);
                break;
            case "explain_ministry_risk":
                result = await buildExplainMinistryRiskInvestigation(query, riskScan, intent.ministry);
                break;
            default:
                res.status(400).json({ error: "Unsupported investigation query." });
                return;
        }
        res.json(result);
    }
    catch (err) {
        console.error("Error running investigation:", err);
        res.status(500).json({ error: "Failed to run investigation" });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
