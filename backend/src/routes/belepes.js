import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/**
 * Railway-kompatibilis env fallback:
 * - te: MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
 * - Railway template: MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE
 */
const host = process.env.MYSQL_HOST || process.env.MYSQLHOST;
const port = Number(process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306);
const user = process.env.MYSQL_USER || process.env.MYSQLUSER;
const password = process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD;
const database = process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE;

function mask(v) {
  return v ? "[SET]" : "[MISSING]";
}

console.log("[DB] Config:", {
  host: host || "[MISSING]",
  port,
  user: mask(user),
  password: mask(password),
  database: database || "[MISSING]"
});

export const db = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Induláskori DB tesztek (konzol visszajelzéssel)
 */
export async function runDbStartupChecks() {
  console.log("[DB] Startup check: connecting...");
  try {
    const conn = await db.getConnection();
    try {
      console.log("[DB] Connection acquired: OK");

      const [pingRows] = await conn.query("SELECT 1 AS ok");
      console.log("[DB] Ping query: OK", pingRows);

      // Ellenőrizzük, hogy létezik-e a 'diakok' tábla
      const [tables] = await conn.query(
        "SHOW TABLES LIKE 'diakok'"
      );

      if (Array.isArray(tables) && tables.length > 0) {
        console.log("[DB] Table check (diakok): OK");
      } else {
        console.log("[DB] Table check (diakok): NOT FOUND (figyelj: rossz DB? nincs migráció?)");
      }
    } finally {
      conn.release();
      console.log("[DB] Connection released: OK");
    }
  } catch (err) {
    console.error("[DB] Startup check FAILED:", {
      message: err?.message,
      code: err?.code,
      errno: err?.errno,
      syscall: err?.syscall,
      address: err?.address,
      port: err?.port
    });
  }
}