import { db } from "../db.js";

/**
 * POST /api/belepes
 * body: { oktatasiazonosito, szuletesidatum }
 *
 * Fontos: a te régi kódodban volt:
 * - változónév elgépelés (oktatasiAzonosito)
 * - rossz WHERE feltétel (jelszo = ?)
 *
 * Itt javítva: szuletesidatum = ?
 */
export async function belepesRoute(req, res) {
  try {
    const { oktatasiazonosito, szuletesidatum } = req.body || {};

    if (!oktatasiazonosito || !szuletesidatum) {
      return res.status(400).json({
        hiba: "Oktatási azonosító és születési dátum kötelező"
      });
    }

    const conn = await db.getConnection();
    try {
      const [sorok] = await conn.execute(
        `SELECT id, nev, oktatasiazonosito, anyjaneve, szuletesidatum
         FROM diakok
         WHERE oktatasiazonosito = ? AND szuletesidatum = ?
         LIMIT 1`,
        [oktatasiazonosito, szuletesidatum]
      );

      if (!Array.isArray(sorok) || sorok.length === 0) {
        return res.status(401).json({
          hiba: "Hibás azonosító vagy születési dátum"
        });
      }

      return res.json({
        sikeres: true,
        diak: sorok[0]
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("[API] Belépés hiba:", {
      message: error?.message,
      code: error?.code,
      errno: error?.errno
    });
    return res.status(500).json({ hiba: "Szerver hiba belépéskor" });
  }
}