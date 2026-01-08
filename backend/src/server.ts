// our main entry point for where our server will be running

import { env } from "node:process";
import { createApp } from "./app.js";
import { assertDatabaseConnection } from "./db/db.js";
import { logger } from "./lib/logger.js";
import http from 'node:http';

async function bootstrap(){
  try {
    await assertDatabaseConnection();
    
    const app = createApp();
    const server = http.createServer(app);

    const port = Number(env.PORT) || 5000;

    server.listen(port, () => {
      logger.info(`Server is now listening to port: http://localhost:${port}`);
    });
  } catch (error) {
    logger.error("Failed to start the server", `${(error as Error).message}`);
    process.exit(1);
  }
}