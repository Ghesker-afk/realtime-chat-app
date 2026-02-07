import { Pool, QueryResult, QueryResultRow } from 'pg';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';


/**
 * Manages multiple reusable database connections.
 * Prevents opening a new connection per query, improving
 * performance and avoiding database connection limits.
 */
export const PostgrePool = new Pool({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD
})


/**
 * Executes a SQL query using the shared connection pool.
 *
 * T represents the shape of one row returned by the SQL query.
 *
 * - `text` is the SQL query string.
 * - PostgreSQL uses $1, $2, etc. as placeholders.
 * - `params` contains the values for those placeholders.
 *
 * `unknown[]` is used instead of `any[]` to preserve type safety,
 * since the values are only passed through to the database driver.
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {

  return await PostgrePool.query<T>(text, params as any[]);
}

/**
 * Verifies database connectivity at application startup.
 * Executes a minimal query and throws if the database is unreachable.
 */
export async function assertDatabaseConnection() : Promise<void> {
  try {

    await PostgrePool.query("SELECT 1;");
    logger.info("Connected to PostgreSQL!");
  } catch (error: any) {
    logger.error(error, "Failed to connect to PostgreSQL");
    throw error;
  }
}