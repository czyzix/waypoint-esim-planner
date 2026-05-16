import { COUNTRIES } from "../data/countries";
import { ESIM_PLANS, type ESimPlan } from "../data/esim-plans";
import type {
  ActivityUsageBreakdownItem,
  DevicesNumber,
  PlanRegion,
  PlanType,
  RecommendationRequest,
  RecommendationResponseDto,
  TravelerType,
} from "../types";
import { SHARING_MULTIPLIER } from "../dto/recommendation.dto";
import { computeTripDays } from "../utils/trip-duration";

// ─── Shared numeric helpers ───────────────────────────────────────────────────

const GB_IN_MB = 1024;

function roundGb(value: number, decimals = 2): number {
  const p = 10 ** decimals;
  return Math.round(value * p) / p;
}

// ─── Activity usage breakdown ─────────────────────────────────────────────────

type ActivityHourKey = Extract<keyof RecommendationRequest, `${string}Hours`>;

type ActivityConfig = {
  activity: ActivityUsageBreakdownItem["activity"];
  requestField: ActivityHourKey;
  mbPerHour: number;
};

const ACTIVITIES: readonly ActivityConfig[] = [
  { activity: "socialMedia", requestField: "socialHours", mbPerHour: 150 },
  { activity: "streaming", requestField: "streamingHours", mbPerHour: 1024 },
  { activity: "workCalls", requestField: "workHours", mbPerHour: 1024 },
  { activity: "navigation", requestField: "navigationHours", mbPerHour: 10 },
  { activity: "surfing", requestField: "surfingHours", mbPerHour: 50 },
];

function buildActivityBreakdown(
  request: RecommendationRequest,
  tripDays: number,
): ActivityUsageBreakdownItem[] {
  return ACTIVITIES.map((config) => {
    const hoursPerDay = request[config.requestField];
    const tripUsageGb = roundGb(
      (hoursPerDay * config.mbPerHour * tripDays) / GB_IN_MB,
      4,
    );
    return {
      activity: config.activity,
      hoursPerDay,
      mbPerHour: config.mbPerHour,
      tripUsageGb,
    };
  });
}

// ─── Total GB estimate ────────────────────────────────────────────────────────

const ARCHETYPE_MULTIPLIER: Record<TravelerType, number> = {
  casual: 0.8,
  explorer: 1.0,
  adventure: 1.3,
};

function estimateTotalGb(
  breakdown: ActivityUsageBreakdownItem[],
  travelerType: TravelerType,
  devicesNumber: DevicesNumber,
): number {
  const baseGb = roundGb(
    breakdown.reduce((sum, row) => sum + row.tripUsageGb, 0),
    4,
  );
  const afterArchetype = roundGb(baseGb * ARCHETYPE_MULTIPLIER[travelerType]);
  return roundGb(afterArchetype * SHARING_MULTIPLIER[devicesNumber]);
}

// ─── Plan scope: local, regional, or global ───────────────────────────────────

const GLOBAL_REGION: PlanRegion = "Global";

function getCountryRegions(countryCodes: string[]): PlanRegion[] {
  return countryCodes.map((code) => {
    const country = COUNTRIES[code];
    if (!country) throw new RangeError(`Unsupported country code: ${code}`);
    return country.region;
  });
}

function resolvePlanScope(countryCodes: string[]): {
  planType: PlanType;
  planRegion: PlanRegion;
} {
  if (countryCodes.length === 1) {
    return { planType: "local", planRegion: getCountryRegions(countryCodes)[0] };
  }
  const regions = getCountryRegions(countryCodes);
  const uniqueRegions = new Set(regions);
  if (uniqueRegions.size === 1) {
    return { planType: "regional", planRegion: regions[0] };
  }
  return { planType: "global", planRegion: GLOBAL_REGION };
}

// ─── Eligible plans ───────────────────────────────────────────────────────────

function planCoversCountries(plan: ESimPlan, countryCodes: string[]): boolean {
  if (plan.countries.includes("ALL")) return true;
  return countryCodes.every((code) => plan.countries.includes(code));
}

function getMatchingPlans(
  request: RecommendationRequest,
  planType: PlanType,
  planRegion: PlanRegion,
): ESimPlan[] {
  return ESIM_PLANS.filter(
    (plan) =>
      plan.type === planType &&
      plan.region === planRegion &&
      planCoversCountries(plan, request.countries),
  );
}

// ─── Recommended plan ─────────────────────────────────────────────────────────

type PlanSelection = {
  recommendedPlan: ESimPlan;
  planCoversFullTrip: boolean;
};

function satisfiesDataNeed(plan: ESimPlan, estimatedGb: number): boolean {
  return Boolean(plan.unlimitedData) || plan.gb >= estimatedGb;
}

/** GB ascending; unlimited last; cheaper first on tie. */
function rankPlans(plans: ESimPlan[]): ESimPlan[] {
  return [...plans].sort((a, b) => {
    const aGb = a.unlimitedData ? Number.POSITIVE_INFINITY : a.gb;
    const bGb = b.unlimitedData ? Number.POSITIVE_INFINITY : b.gb;
    return aGb - bGb || a.price - b.price;
  });
}

function pickRecommendedPlan(
  eligiblePlans: ESimPlan[],
  estimatedGb: number,
): ESimPlan {
  const fittingPlans = rankPlans(
    eligiblePlans.filter((plan) => satisfiesDataNeed(plan, estimatedGb)),
  );

  if (fittingPlans.length > 0) {
    return fittingPlans[0]!;
  }

  return rankPlans(eligiblePlans).at(-1)!;
}

function getClosestValidityPlans(plans: ESimPlan[]): ESimPlan[] {
  const longestValidity = Math.max(...plans.map((plan) => plan.validity));
  return plans.filter((plan) => plan.validity === longestValidity);
}

function selectPlans(
  matchingPlans: ESimPlan[],
  tripDays: number,
  estimatedGb: number,
): PlanSelection {
  const plansCoveringFullTrip = matchingPlans.filter(
    (plan) => plan.validity >= tripDays,
  );
  const planCoversFullTrip = plansCoveringFullTrip.length > 0;
  const recommendationPool = planCoversFullTrip
    ? plansCoveringFullTrip
    : getClosestValidityPlans(matchingPlans);
  return {
    recommendedPlan: pickRecommendedPlan(recommendationPool, estimatedGb),
    planCoversFullTrip,
  };
}

// ─── Response details ─────────────────────────────────────────────────────────

function calculateConfidence(plan: ESimPlan, estimatedGb: number): number {
  if (plan.unlimitedData) return 90;
  const ratio = estimatedGb / plan.gb;
  if (ratio >= 0.7) return 92;
  if (ratio >= 0.5) return 76;
  if (ratio >= 0.3) return 60;
  return 45;
}

function hasDataShortfall(plan: ESimPlan, estimatedGb: number): boolean {
  return !plan.unlimitedData && estimatedGb > plan.gb;
}

function buildReasons(
  request: RecommendationRequest,
  planType: PlanType,
  recommendedPlan: ESimPlan,
  estimatedGb: number,
  tripDays: number,
  planCoversFullTrip: boolean,
): string[] {
  const count = request.countries.length;

  let planTypeReason =
    "One destination selected, so a local plan is the best fit.";
  if (count > 1 && planType === "regional") {
    planTypeReason = `${count} destinations in one region, so a regional plan is the best fit.`;
  }
  if (count > 1 && planType === "global") {
    planTypeReason = `${count} destinations across regions, so a global plan is the best fit.`;
  }

  const reasons = [
    planTypeReason,
    planCoversFullTrip
      ? `Recommended plan covers your selected destinations and your full ${tripDays}-day trip.`
      : `Recommended plan covers your selected destinations, but only for ${recommendedPlan.validity} of your ${tripDays} days. Consider buying multiple plans to cover the full trip.`,
  ];

  if (hasDataShortfall(recommendedPlan, estimatedGb)) {
    reasons.push(
      `Recommended plan includes ${recommendedPlan.gb} GB, but your estimated usage is ${estimatedGb} GB. Consider a larger plan or reducing usage.`,
    );
  }

  return reasons;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class RecommendationService {
  recommend(request: RecommendationRequest): RecommendationResponseDto {
    const tripDays = computeTripDays(request.startDate, request.endDate);
    const breakdown = buildActivityBreakdown(request, tripDays);
    const estimatedGb = estimateTotalGb(
      breakdown,
      request.travelerType,
      request.devicesNumber,
    );
    const { planType, planRegion } = resolvePlanScope(request.countries);

    const matchingPlans = getMatchingPlans(
      request,
      planType,
      planRegion,
    );

    // In case if I would like to add new countries/regions etc...
    if (matchingPlans.length === 0) {
      throw new RangeError(
        "No eSIM plan is available for the selected destinations.",
      );
    }

    const { recommendedPlan, planCoversFullTrip } = selectPlans(
      matchingPlans,
      tripDays,
      estimatedGb,
    );

    return {
      tripDays,
      totalEstimatedGb: estimatedGb,
      activityBreakdown: breakdown,
      planType,
      recommendedPlan,
      reasons: buildReasons(
        request,
        planType,
        recommendedPlan,
        estimatedGb,
        tripDays,
        planCoversFullTrip,
      ),
      confidence: calculateConfidence(recommendedPlan, estimatedGb),
    };
  }
}
