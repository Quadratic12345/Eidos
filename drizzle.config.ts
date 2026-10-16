import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  schema: ["./src/server/db/schema/auth.ts", "./src/server/db/schema/app.ts"],
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
