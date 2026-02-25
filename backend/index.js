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

    // jelszo eltávolítása minden sorból
    const safe = rows.map((r) => {
      const row = { ...r };
      delete row.jelszo;
      return row;
    });

    res.json(safe);
  } catch (err) {
    console.error("DIÁKOK HIBA:", err);
    res.status(500).json({ hiba: "Adatbázis hiba" });
  }
});

app.post("/api/belepes", async (req, res) => {
  try {
    const oktatasiAzonosito = String(req.body?.oktatasiAzonosito ?? "").trim();
    const jelszo = String(req.body?.jelszo ?? "").trim();

    if (!oktatasiAzonosito || !jelszo) {
      return res
        .status(400)
        .json({ hiba: "Oktatási azonosító és jelszó kötelező" });
    }

    // csak OM alapján kérjük le -> nem hasal el oszlophiányon
    const [rows] = await pool.query(
      "SELECT * FROM diakok WHERE oktatasiazonosito = ? LIMIT 1",
      [oktatasiAzonosito]
    );

    if (rows.length === 0) {
      return res.status(401).json({ hiba: "Hibás azonosító vagy jelszó" });
    }

    const diak = rows[0];
    const dbJelszo = String(diak.jelszo ?? "").trim();

    if (dbJelszo !== jelszo) {
      return res.status(401).json({ hiba: "Hibás azonosító vagy jelszó" });
    }

    // jelszo soha ne menjen vissza
    delete diak.jelszo;

    return res.json(diak);
  } catch (err) {
    console.error("BELEPÉS HIBA:", err);
    return res.status(500).json({ hiba: "Adatbázis hiba" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Szerver fut...");
});