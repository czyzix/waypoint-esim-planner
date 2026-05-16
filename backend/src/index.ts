import cors from "cors";
import express from "express";
import { apiRouter } from "./routes/recommendation.route";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: "512kb" }));

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`[backend] listening on http://localhost:${PORT}`);
});
