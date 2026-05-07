import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import { apiLimiter } from "./middlewares/security.js";
import personRoutes from "./routes/personRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();

const normalizeOrigin = (value) => value.replace(/\/$/, "");

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map(normalizeOrigin);

// Add Vercel deployment domain if not already present
if (allowedOrigins.length === 0 || !allowedOrigins.some(o => o.includes("vercel.app"))) {
  allowedOrigins.push("https://frontend-ivory-ten-72.vercel.app");
}

app.use(
  cors({
    origin: (origin, callback) => {
      const normalizedOrigin = origin ? normalizeOrigin(origin) : origin;

      if (!normalizedOrigin || allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for this origin"));
    },
    credentials: true
  })
);
app.use(helmet());
app.use(apiLimiter);
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

app.use("/auth", authRoutes);
app.use("/persons", personRoutes);
app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
