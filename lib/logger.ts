import pino from "pino";

// Use basic logging to avoid worker thread issues in Next.js
export const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  // Disable pino-pretty to avoid worker thread crashes
  browser: {
    asObject: false,
  },
});
