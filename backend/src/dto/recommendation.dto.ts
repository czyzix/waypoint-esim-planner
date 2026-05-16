import { z } from "zod";
import {
  computeTripDays,
  MAX_RECOMMENDATION_DAYS,
} from "../utils/trip-duration";

export const TravelerTypeSchema = z.enum(["casual", "explorer", "adventure"]);

/** 1, 2, or 3 meaning 3+ people sharing one plan (not headcount as a straight multiplier). */
export const DevicesNumberSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
]);

/**
 * Shared-plan load on one eSIM (hotspot / shared data).
 * Not ×people — e.g. 2 travelers ≈ ×1.8 usage, not ×2.
 */
export const SHARING_MULTIPLIER: Record<
  z.infer<typeof DevicesNumberSchema>,
  number
> = {
  1: 1.0,
  2: 1.8,
  3: 2.4,
};

export const PlanTypeSchema = z.enum(["local", "regional", "global"]);

export const PlanRegionSchema = z.enum([
  "Europe",
  "Asia",
  "North America",
  "Global",
]);

export const ActivityKindSchema = z.enum([
  "socialMedia",
  "streaming",
  "workCalls",
  "navigation",
  "surfing",
]);

export const ActivityUsageBreakdownItemSchema = z.object({
  activity: ActivityKindSchema,
  hoursPerDay: z.number().nonnegative(),
  mbPerHour: z.number().nonnegative(),
  tripUsageGb: z.number().nonnegative(),
});

/** Matches `ESimPlan` in `data/esim-plans.ts` for API responses. */
export const ESimPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: PlanTypeSchema,
  region: PlanRegionSchema,
  countries: z.array(z.string()),
  gb: z.number(),
  validity: z.number(),
  price: z.number(),
  unlimitedData: z.boolean().optional(),
});

export const RecommendationResponseSchema = z.object({
  tripDays: z.number().int().min(1),
  totalEstimatedGb: z.number().nonnegative(),
  activityBreakdown: z.array(ActivityUsageBreakdownItemSchema),
  planType: PlanTypeSchema,
  recommendedPlan: ESimPlanSchema,
  reasons: z.array(z.string()),
  confidence: z.number().min(0).max(100),
});

export type ESimPlanDto = z.infer<typeof ESimPlanSchema>;
export type RecommendationResponseDto = z.infer<typeof RecommendationResponseSchema>;
export type ActivityKind = z.infer<typeof ActivityKindSchema>;
export type ActivityUsageBreakdownItem = z.infer<typeof ActivityUsageBreakdownItemSchema>;

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoCalendarDate(value: string): boolean {
  if (!ISO_DATE_RE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.toISOString().slice(0, 10) === value;
}

/** `YYYY-MM-DD` only (no time); validated as a real calendar day in UTC. */
export const IsoDateStringSchema = z
  .string()
  .regex(ISO_DATE_RE, "Use YYYY-MM-DD")
  .refine(isValidIsoCalendarDate, { message: "Invalid calendar date" });

export const RecommendationRequestSchema = z
  .object({
    countries: z.array(z.string().length(2)).min(1).max(10),
    startDate: IsoDateStringSchema,
    endDate: IsoDateStringSchema,
    travelerType: TravelerTypeSchema,
    devicesNumber: DevicesNumberSchema,
    socialHours: z.number().min(0).max(24),
    streamingHours: z.number().min(0).max(24),
    workHours: z.number().min(0).max(24),
    navigationHours: z.number().min(0).max(24),
    surfingHours: z.number().min(0).max(24),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "endDate must be on or after startDate",
    path: ["endDate"],
  })
  .refine((data) => computeTripDays(data.startDate, data.endDate) <= MAX_RECOMMENDATION_DAYS, {
    message: `Trip length must be ${MAX_RECOMMENDATION_DAYS} days or less`,
    path: ["endDate"],
  });

export type TravelerType = z.infer<typeof TravelerTypeSchema>;
export type DevicesNumber = z.infer<typeof DevicesNumberSchema>;
export type PlanType = z.infer<typeof PlanTypeSchema>;
export type PlanRegion = z.infer<typeof PlanRegionSchema>;
export type RecommendationRequest = z.infer<typeof RecommendationRequestSchema>;
