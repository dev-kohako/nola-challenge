import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DB_MAX_CONNECTIONS || 10),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  allowExitOnIdle: false,
  keepAlive: true,
});

if (process.env.NODE_ENV === "development") {
  pool.on("connect", (client) => console.log("✅ PostgreSQL connected."));
  pool.on("error", (err) => console.error("❌ PostgreSQL pool error:", err));
}

process.on("SIGINT", async () => {
  console.log("🛑 Closing PostgreSQL pool...");
  await pool.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Closing PostgreSQL pool...");
  await pool.end();
  process.exit(0);
});
