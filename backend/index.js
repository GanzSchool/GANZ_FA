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
  database: process.env.DB_NAME, // pl. ganz
  ssl: { rejectUnauthorized: false },
});

app.get("/api/diakok", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM diakok");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ hiba: "Adatbázis hiba" });
  }
});

app.post("/api/belepes", async (req, res) => {
  try {
    const { oktatasiAzonosito, jelszo } = req.body;

    if (!oktatasiAzonosito || !jelszo) {
      return res.status(400).json({ hiba: "Oktatási azonosító és jelszó kötelező" });
    }

    const [rows] = await pool.query(
      `SELECT 
         id, nev, oktatasiazonosito, anyjaneve, szuletesidatum,

         het_irodalom, het_magyarnyelv, het_matematika, het_tortenelem, het_idegennyelv, het_fizika, het_technika,
         nyolc_irodalom, nyolc_magyarnyelv, nyolc_matematika, nyolc_tortenelem, nyolc_idegennyelv, nyolc_fizika, nyolc_technika,

         kozponti_pontok, magyar_pontok, matematika_pontok, hozott_pontok,
         nyelvi_szintfelmeres, nyelvi_szintfelmeres_idopont,
         ganziskola_ismerkedesi_pontok, ganz_idopont,
         osszespont,

         megjelolt_kepzes_1, megjelolt_kepzes_2, megjelolt_kepzes_3, megjelolt_kepzes_4,

         jelolt_0101, jelolt_0102, jelolt_0103, jelolt_0104,

         -- ELŐZETES RANGSOR: már 4 mező (ÚJ)
         rangsor_kepzes_1, rangsor_helyezes_1,
         rangsor_kepzes_2, rangsor_helyezes_2,
         rangsor_kepzes_3, rangsor_helyezes_3,
         rangsor_kepzes_4, rangsor_helyezes_4,

         felvett_0101, felvett_0102, felvett_0103, felvett_0104,
         felveteli_statusz, felvett_hova_kod,

         felvett_kepzes, nem_felvett_kepzes,

         letrehozva, modositva
       FROM diakok
       WHERE oktatasiazonosito = ? AND jelszo = ?
       LIMIT 1`,
      [oktatasiAzonosito, jelszo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ hiba: "Hibás azonosító vagy jelszó" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ hiba: "Adatbázis hiba" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Szerver fut...");
});