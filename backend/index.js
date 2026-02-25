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

// ------------------------------
// SEGÉD: dátum jellegű jelszó normalizálása
//  - "2011. 9. 5." / "2011.09.05" / "2011-09-05" -> "2011-09-05"
//  - ha nem dátum, akkor trimelt string marad
// ------------------------------
function normalizePassword(input) {
  const s = String(input ?? "").trim();
  if (!s) return "";

  // 1) YYYY-MM-DD
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    return `${String(y).padStart(4, "0")}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  // 2) YYYY. M. D. (ponttal, szóközökkel)
  m = s.match(/^(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\.?$/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    return `${String(y).padStart(4, "0")}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  // 3) Ha esetleg valamiért DATETIME-szerűt kapnál (nem kellene, de legyen stabil):
  // "2011-09-05 00:00:00" -> "2011-09-05"
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})\s+\d{2}:\d{2}:\d{2}$/);
  if (m) {
    return `${m[1]}-${m[2]}-${m[3]}`;
  }

  // egyéb: marad sima string
  return s;
}

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
    const jelszoInput = String(req.body?.jelszo ?? "").trim();

    if (!oktatasiAzonosito || !jelszoInput) {
      return res
        .status(400)
        .json({ hiba: "Oktatási azonosító és jelszó kötelező" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM diakok WHERE oktatasiazonosito = ? LIMIT 1",
      [oktatasiAzonosito]
    );

    if (rows.length === 0) {
      return res.status(401).json({ hiba: "Hibás azonosító vagy jelszó" });
    }

    const diak = rows[0];

    // NORMALIZÁLT összehasonlítás
    const dbJelszoNorm = normalizePassword(diak.jelszo);
    const inputJelszoNorm = normalizePassword(jelszoInput);

    if (!dbJelszoNorm || dbJelszoNorm !== inputJelszoNorm) {
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