import express from "express";
import cors from "cors";
import { belepesRoute } from "./routes/belepes.js";
import { azonnalLathatoAdatok, kesobbiAdatok } from "./routes/diak-adatok.js";
import { db, runDbStartupChecks } from "./db.js";

const app = express();
app.use(express.json());

// CORS: ha fix frontend domained van, szűkítheted. Most enged mindent.
app.use(cors());

app.get("/", (req, res) => {
  res.json({ uzenet: "GANZ_FA backend fut" });
});

// Health: szerver él-e
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "ganz-fa-backend" });
});

// DB teszt endpoint: azonnal látod működik-e a DB
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS ok");
    res.json({ ok: true, rows });
  } catch (err) {
    console.error("[API] DB test FAILED:", {
      message: err?.message,
      code: err?.code,
      errno: err?.errno,
      address: err?.address,
      port: err?.port
    });
    res.status(500).json({ ok: false, hiba: "Adatbázis kapcsolat hiba" });
  }
});

// Próba endpoint
app.get("/api/proba", async (req, res) => {
  try {
    const [sorok] = await db.query(
      "SELECT nev, oktatasiazonosito FROM diakok LIMIT 5"
    );
    res.json(sorok);
  } catch (error) {
    console.error("[API] Próba DB hiba:", {
      message: error?.message,
      code: error?.code,
      errno: error?.errno
    });
    res.status(500).json({ hiba: "Adatbázis kapcsolat hiba" });
  }
});

// Belépés
app.post("/api/belepes", belepesRoute);

// Azonnal látható adatok
app.get("/api/azonnal-lathato/:diakid", azonnalLathatoAdatok);

// Későbbi adatok
app.get("/api/kesobbi-adatok/:diakid", kesobbiAdatok);

// Diák keresése oktatási azonosító alapján
app.get("/api/diak/:oktatasiAzonosito", async (req, res) => {
  try {
    const { oktatasiAzonosito } = req.params;

    const [sorok] = await db.query(
      "SELECT id, nev, oktatasiazonosito FROM diakok WHERE oktatasiazonosito = ? LIMIT 1",
      [oktatasiAzonosito]
    );

    if (!Array.isArray(sorok) || sorok.length === 0) {
      return res.status(404).json({ hiba: "Diák nem található" });
    }

    res.json(sorok[0]);
  } catch (error) {
    console.error("[API] Diák keresés hiba:", {
      message: error?.message,
      code: error?.code,
      errno: error?.errno
    });
    res.status(500).json({ hiba: "Szerver hiba" });
  }
});

const port = Number(process.env.PORT || 3001);

app.listen(port, async () => {
  console.log(`[APP] Server started on port ${port}`);
  await runDbStartupChecks();
});