import cors from "cors";
import express from "express";
import { apiRouter } from "./routes/recommendation.route";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

/** Comma-separated origins. Default: local Vite. Set on the API host for production. */
const corsOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins,
    methods: ["GET", "POST", "OPTIONS"],
  }),
);

// No compressed request bodies needed — closes zlib/body-parser DoS paths.
app.use(express.json({ limit: "512kb", inflate: false }));

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`[backend] listening on http://localhost:${PORT}`);
});
