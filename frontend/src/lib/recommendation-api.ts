/**
 * API contract: same Zod schemas and inferred types as the backend DTO module.
 * Use `RecommendationRequestSchema` for client-side validation; use `RecommendationRequest`
 * when building the JSON body for `POST /api/recommendation`.
 */
export {
  RecommendationRequestSchema,
  RecommendationResponseSchema,
  type DevicesNumber,
  type PlanType,
  type RecommendationRequest,
  type RecommendationResponseDto,
  type TravelerType,
} from "@/lib/api-contract/recommendation.dto";

import { apiUrl } from "@/lib/api-base";

export type CountryOption = {
  code: string;
  name: string;
  region: "Europe" | "Asia" | "North America";
};

export async function fetchCountries(): Promise<CountryOption[]> {
  const res = await fetch(apiUrl("/api/countries"));
  if (!res.ok) {
    throw new Error(`Failed to load countries (${res.status})`);
  }
  return res.json() as Promise<CountryOption[]>;
}
