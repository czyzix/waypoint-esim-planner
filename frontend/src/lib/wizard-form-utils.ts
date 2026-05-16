import { addDays, startOfToday } from "date-fns";
import type { RecommendationRequest } from "@/lib/recommendation-api";
import {
  MAX_ACTIVITY_HOURS_PER_DAY,
  normalizeActivityHours,
  normalizeCountries,
  normalizeDevicesNumber,
  toIsoDate,
} from "@/lib/wizard-validation";
import {
  WIZARD_FORM_DEFAULTS,
  type WizardFormValues,
} from "@/types/wizard-form";

/** Merge partial RHF values without `undefined` wiping defaults. */
export function mergeWizardFormValues(
  partial?: Partial<WizardFormValues>,
): WizardFormValues {
  if (!partial) return { ...WIZARD_FORM_DEFAULTS };

  return {
    ...WIZARD_FORM_DEFAULTS,
    ...(partial.travelerType !== undefined
      ? { travelerType: partial.travelerType }
      : {}),
    ...(partial.countries !== undefined ? { countries: partial.countries } : {}),
    ...(partial.tripDays !== undefined ? { tripDays: partial.tripDays } : {}),
    ...(partial.devicesNumber !== undefined
      ? { devicesNumber: partial.devicesNumber }
      : {}),
    ...(partial.socialHours !== undefined ? { socialHours: partial.socialHours } : {}),
    ...(partial.streamingHours !== undefined
      ? { streamingHours: partial.streamingHours }
      : {}),
    ...(partial.workHours !== undefined ? { workHours: partial.workHours } : {}),
    ...(partial.navigationHours !== undefined
      ? { navigationHours: partial.navigationHours }
      : {}),
    ...(partial.surfingHours !== undefined ? { surfingHours: partial.surfingHours } : {}),
  };
}

function tripDaysToDateRange(tripDays: number): {
  startDate: string;
  endDate: string;
} {
  const start = startOfToday();
  const end = addDays(start, tripDays - 1);
  return {
    startDate: toIsoDate(start),
    endDate: toIsoDate(end),
  };
}

export function toRecommendationRequest(
  values: WizardFormValues,
): RecommendationRequest {
  const devicesNumber = normalizeDevicesNumber(values.devicesNumber);
  if (devicesNumber === null) {
    throw new Error("devicesNumber is required");
  }

  if (typeof values.tripDays !== "number" || values.tripDays < 1) {
    throw new Error("tripDays is required");
  }

  const { startDate, endDate } = tripDaysToDateRange(values.tripDays);

  return {
    countries: normalizeCountries(values.countries),
    startDate,
    endDate,
    travelerType: values.travelerType as RecommendationRequest["travelerType"],
    devicesNumber,
    socialHours: normalizeActivityHours(values.socialHours),
    streamingHours: normalizeActivityHours(values.streamingHours),
    workHours: normalizeActivityHours(values.workHours),
    navigationHours: normalizeActivityHours(values.navigationHours),
    surfingHours: normalizeActivityHours(values.surfingHours),
  };
}

/** Coerce hour inputs; empty or invalid values stay empty. */
export function hourInputValueAs(value: string | number): number | "" {
  if (value === "" || value === null || value === undefined) return "";
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(n)) return "";
  if (n < 0) return 0;
  if (n > MAX_ACTIVITY_HOURS_PER_DAY) return MAX_ACTIVITY_HOURS_PER_DAY;
  return n;
}

export function formatTripDaysUnit(tripDays: number): "day" | "days" {
  return tripDays === 1 ? "day" : "days";
}
