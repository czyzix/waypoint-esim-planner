import { Router } from "express";
import { COUNTRIES } from "../data/countries";
import { RecommendationRequestSchema } from "../types";
import { withValidatedBody } from "../middleware/validate";
import { RecommendationService } from "../services/recommendation.service";

const recommendationService = new RecommendationService();

export const apiRouter = Router();

apiRouter.get("/health", (_req, res): void => {
  res.json({ status: "ok" });
});

apiRouter.get("/countries", (_req, res): void => {
  const countries = Object.entries(COUNTRIES)
    .map(([code, { name, region }]) => ({ code, name, region }))
    .sort((a, b) => a.name.localeCompare(b.name));
  res.json(countries);
});

apiRouter.post(
  "/recommendation",
  ...withValidatedBody(RecommendationRequestSchema, (req, res): void => {
    try {
      const result = recommendationService.recommend(req.validatedBody);
      res.json(result);
    } catch (err) {
      if (err instanceof RangeError) {
        res.status(422).json({ error: err.message });
        return;
      }
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }),
);
