import express from "express";
import cors from "cors";
import { belepesRoute } from "./routes/belepes.js";
import { azonnalLathatoAdatok, kesobbiAdatok } from "./routes/diak-adatok.js";
import { db } from "./db.js";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ uzenet: "GANZ_FA backend fut" });
});

// Próba endpoint
app.get("/api/proba", async (req, res) => {
  try {
    const [sorok] = await db.query(
      "SELECT nev, oktatasiazonosito FROM diakok LIMIT 5"
    );
    res.json(sorok);
  } catch (error) {
    console.error("Adatbázis hiba:", error);
    res.status(500).json({ hiba: "Adatbázis kapcsolat hiba" });
  }
});

// Belépés
app.post("/api/belepes", belepesRoute);

// Azonnal látható adatok
app.get("/api/azonnal-lathato/:diakid", azonnalLathatoAdatok);

// Későbbi adatok (képzések, rangsor, eredmények)
app.get("/api/kesobbi-adatok/:diakid", kesobbiAdatok);

// Diák keresése oktatási azonosító alapján
app.get("/api/diak/:oktatasiAzonosito", async (req, res) => {
  try {
    const { oktatasiAzonosito } = req.params;
    
    const [sorok] = await db.query(
      "SELECT id, nev, oktatasiazonosito FROM diakok WHERE oktatasiazonosito = ?",
      [oktatasiAzonosito]
    );

    if (!sorok.length) {
      return res.status(404).json({ hiba: "Diák nem található" });
    }

    res.json(sorok[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ hiba: "Szerver hiba" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Szerver fut a ${port} porton`);
});
