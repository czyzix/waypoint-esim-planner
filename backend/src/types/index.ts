/**
 * Shared API and domain types inferred from Zod DTOs.
 * Prefer importing from here in services and routes to keep a single entry point.
 */

export {
  ActivityKindSchema,
  ActivityUsageBreakdownItemSchema,
  DevicesNumberSchema,
  ESimPlanSchema,
  IsoDateStringSchema,
  PlanRegionSchema,
  PlanTypeSchema,
  RecommendationRequestSchema,
  RecommendationResponseSchema,
  TravelerTypeSchema,
} from "../dto/recommendation.dto";

export type {
  ActivityKind,
  ActivityUsageBreakdownItem,
  DevicesNumber,
  ESimPlanDto,
  PlanRegion,
  PlanType,
  RecommendationRequest,
  RecommendationResponseDto,
  TravelerType,
} from "../dto/recommendation.dto";
