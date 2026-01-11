// this is where our Express app will run, and it will
// be called on the 'server.ts' file.
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { clerkMiddleware } from "./config/clerk.js";

export function createApp() {
  const app = express();

  app.use(clerkMiddleware());
  
  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );

  app.use(express.json());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}