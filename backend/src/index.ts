import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5174" }));
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
