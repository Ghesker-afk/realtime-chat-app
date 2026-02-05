import path from "node:path";
import fs from "node:fs";
import { logger } from "../utils/logger.js";
import { query } from "./db.js";

// This will give the directory from where we need 
// to pick all the migrations!
const migrationsDir = path.resolve(process.cwd(), "src", "migrations");

async function runMigrations() {
  logger.info(
    `Looking for migrations in ${migrationsDir}`
  );

  // The reason behind the numbers in the name of the .sql
  // files (0001, 0002, etc) is the .sort() method that we
  // are using here.
  const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith(".sql")).sort();

  if (files.length === 0) {
    logger.info("No migrations found!");
    return;
  }

  for (const file of files) {
    const fullPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(fullPath, "utf8");

    logger.info("Running migrations");

    await query(sql);

    logger.info("Finished migration");
  }
}

runMigrations().then(() => {
  logger.info("All migrations run successfully!");
  process.exit(0);
}).catch(err => {
  logger.error(`Migration failed ${(err as Error).message}`);
  process.exit(1);
});