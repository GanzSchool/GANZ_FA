import { db } from "../db.js";

export const azonnalLathatoAdatok = async (req, res) => {
  try {
    const { diakid } = req.params;
    
    const [sorok] = await db.query(
      `SELECT 
        het_irodalom, het_magyarnyelv, het_matematika, het_tortenelem, 
        het_idegennyelv, het_fizika, het_technika,
        nyolc_irodalom, nyolc_magyarnyelv, nyolc_matematika, nyolc_tortenelem, 
        nyolc_idegennyelv, nyolc_fizika, nyolc_technika,
        kozponti_pontok, magyar_pontok, matematika_pontok, 
        nyelvi_szintfelmeres, ganziskola_ismerkedesi_pontok, osszespont 
       FROM diakok WHERE id = ?`,
      [diakid]
    );

    if (!sorok.length) {
      return res.status(404).json({ hiba: "Diák nem található" });
    }

    res.json(sorok[0]);
  } catch (error) {
    console.error("Adatok lekérdezés hiba:", error);
    res.status(500).json({ hiba: "Szerver hiba adatok lekérdezésénél" });
  }
};

export const kesobbiAdatok = async (req, res) => {
  try {
    const { diakid } = req.params;
    
    const [sorok] = await db.query(
      `SELECT megjelolt_kepzes_1, megjelolt_kepzes_2, megjelolt_kepzes_3,
              rangsor_kepzes_1, rangsor_helyezes_1, rangsor_kepzes_2, rangsor_helyezes_2,
              felvett_kepzes, nem_felvett_kepzes 
       FROM diakok WHERE id = ?`,
      [diakid]
    );

    if (!sorok.length) {
      return res.status(404).json({ hiba: "Diák nem található" });
    }

    res.json(sorok[0]);
  } catch (error) {
    console.error("Későbbi adatok hiba:", error);
    res.status(500).json({ hiba: "Szerver hiba későbbi adatoknál" });
  }
};
