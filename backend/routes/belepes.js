import { db } from "../db.js";

export const belepesRoute = async (req, res) => {
  try {
    const { oktatasiazonosito, szuletesidatum } = req.body;
    
    if (!oktatasiAzonosito || !szuletesidatum) {
      return res.status(400).json({ hiba: "Oktatási azonosító és születési dátum kötelező" });
    }

    const [sorok] = await db.query(
      "SELECT id, nev, oktatasiazonosito, anyjaneve, szuletesidatum FROM diakok WHERE oktatasiazonosito = ? AND jelszo = ?",
      [oktatasiAzonosito, szuletesidatum]
    );

    if (!sorok.length) {
      return res.status(401).json({ hiba: "Hibás azonosító vagy születési dátum" });
    }

    res.json({
      sikeres: true,
      diak: sorok[0]
    });
  } catch (error) {
    console.error("Belépés hiba:", error);
    res.status(500).json({ hiba: "Szerver hiba belépéskor" });
  }
};
