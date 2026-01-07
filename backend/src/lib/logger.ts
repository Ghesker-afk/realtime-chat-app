// transport -> a storage device for logs. Each winston logger
// can have multiple transports configured at different 
// levels.

import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `${info.timestamp} -> [${info.level.toUpperCase()}] ${info.message}`;
    })
  ),
  transports: [new winston.transports.Console()],
})