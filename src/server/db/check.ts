import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error("DATABASE_URL is not set. Check .env.local");
    process.exit(1);
  }

  const sql = neon(url);
  const rows = await sql`select 1 as ok, current_database() as database`;
  console.log("connected:", rows);
}

main().catch((error) => {
  console.error("connection failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
