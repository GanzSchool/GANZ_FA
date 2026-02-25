import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

app.get("/api/diakok", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM diakok");

    const safe = rows.map((r) => {
      const row = { ...r };
      // ha van jelszo oszlopod, sose menjen vissza
      if ("jelszo" in row) delete row.jelszo;
      return row;
    });

    res.json(safe);
  } catch (err) {
    console.error("DIÁKOK HIBA:", err);
    res.status(500).json({ hiba: "Adatbázis hiba" });
  }
});

/**
 * Belépés: OM azonosító + születési dátum
 * Frontend body:
 * { oktatasiAzonosito: "7300...", szuletesiDatum: "2011-09-05" }
 */
app.post("/api/belepes", async (req, res) => {
  try {
    const oktatasiAzonosito = String(req.body?.oktatasiAzonosito ?? "").trim();
    const szuletesiDatum = String(req.body?.szuletesiDatum ?? "").trim(); // YYYY-MM-DD

    if (!oktatasiAzonosito || !szuletesiDatum) {
      return res
        .status(400)
        .json({ hiba: "OM azonosító és születési dátum kötelező" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM diakok WHERE oktatasiazonosito = ? AND szuletesidatum = ? LIMIT 1",
      [oktatasiAzonosito, szuletesiDatum]
    );

    if (!rows.length) {
      return res
        .status(401)
        .json({ hiba: "Hibás azonosító vagy születési dátum" });
    }

    const diak = rows[0];

    // jelszo soha ne menjen vissza
    if (diak && typeof diak === "object" && "jelszo" in diak) delete diak.jelszo;

    return res.json(diak);
  } catch (err) {
    console.error("BELEPÉS HIBA:", err);
    return res.status(500).json({ hiba: "Adatbázis hiba" });
  }
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Szerver fut: ${PORT}`);
});