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
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }
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

app.listen(process.env.PORT || 3000, () => {
  console.log("Szerver fut...");
});