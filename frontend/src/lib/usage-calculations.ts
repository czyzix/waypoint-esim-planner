import {
  SHARING_MULTIPLIER,
  type ActivityUsageBreakdownItem,
  type DevicesNumber,
  type TravelerType,
} from "@backend/dto/recommendation.dto";
import { normalizeDevicesNumber } from "@/lib/wizard-validation";
import type { WizardFormValues } from "@/types/wizard-form";

const GB_IN_MB = 1024;

export function formatUsageRatePerHour(mbPerHour: number): string {
  if (mbPerHour >= GB_IN_MB && mbPerHour % GB_IN_MB === 0) {
    return `${mbPerHour / GB_IN_MB} GB / h`;
  }
  return `${mbPerHour.toLocaleString()} MB / h`;
}

export const ARCHETYPE_MULTIPLIER: Record<TravelerType, number> = {
  casual: 0.8,
  explorer: 1.0,
  adventure: 1.3,
};

/** Baseline traveler style — no usage adjustment note shown. */
export const DEFAULT_TRAVELER_TYPE: TravelerType = "explorer";

/** Solo trip — no sharing-factor note shown. */
export const DEFAULT_DEVICES_NUMBER: DevicesNumber = 1;

export const TRAVELER_TYPE_LABEL: Record<TravelerType, string> = {
  casual: "Casual",
  explorer: "Explorer",
  adventure: "Adventurer",
};

export const SHARING_FACTOR_LABEL: Record<DevicesNumber, string> = {
  1: "1 person (solo)",
  2: "2 people on one plan",
  3: "3+ people on one plan",
};

type ActivityField = Extract<
  keyof WizardFormValues,
  `${string}Hours`
>;

type ActivityConfig = {
  activity: ActivityUsageBreakdownItem["activity"];
  field: ActivityField;
  label: string;
  mbPerHour: number;
};

export const ACTIVITY_USAGE_RATES: readonly ActivityConfig[] = [
  {
    activity: "socialMedia",
    field: "socialHours",
    label: "Social media",
    mbPerHour: 150,
  },
  {
    activity: "streaming",
    field: "streamingHours",
    label: "Streaming",
    mbPerHour: 1024,
  },
  {
    activity: "workCalls",
    field: "workHours",
    label: "Work calls",
    mbPerHour: 1024,
  },
  {
    activity: "navigation",
    field: "navigationHours",
    label: "Navigation",
    mbPerHour: 10,
  },
  {
    activity: "surfing",
    field: "surfingHours",
    label: "Surfing",
    mbPerHour: 50,
  },
];

function roundGb(value: number, decimals = 2): number {
  const p = 10 ** decimals;
  return Math.round(value * p) / p;
}

function hourValue(value: WizardFormValues[ActivityField]): number {
  if (value === "" || typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }
  return value;
}

export type TripUsageBreakdownItem = ActivityUsageBreakdownItem & {
  label: string;
  /** Base usage before travel style and sharing adjustments. */
  tripUsageGb: number;
  /** Same activity usage with multipliers applied (matches chart slices). */
  adjustedTripUsageGb: number;
};

export type TripUsageSummary = {
  tripDays: number;
  travelerType: TravelerType;
  breakdown: TripUsageBreakdownItem[];
  baseGb: number;
  archetypeMultiplier: number;
  afterArchetypeGb: number;
  devicesNumber: DevicesNumber;
  usageMultiplier: number;
  totalEstimatedGb: number;
};

/** Notes only when usage differs from Explorer + solo defaults. */
export function getUsageAdjustmentNotes(summary: TripUsageSummary): string[] {
  const notes: string[] = [];

  if (summary.travelerType !== DEFAULT_TRAVELER_TYPE) {
    notes.push(
      `Includes ${TRAVELER_TYPE_LABEL[summary.travelerType]} travel style adjustment`,
    );
  }

  if (summary.devicesNumber > DEFAULT_DEVICES_NUMBER) {
    notes.push(
      summary.devicesNumber === 2
        ? "Includes sharing factor for 2 people on one plan"
        : "Includes sharing factor for 3+ people on one plan",
    );
  }

  return notes;
}

export function calculateTripUsage(
  values: WizardFormValues,
): TripUsageSummary | null {
  if (typeof values.tripDays !== "number" || values.tripDays < 1) {
    return null;
  }

  const tripDays = values.tripDays;
  const devicesNumber = normalizeDevicesNumber(values.devicesNumber) ?? 1;
  const travelerType: TravelerType =
    values.travelerType === "casual" ||
    values.travelerType === "explorer" ||
    values.travelerType === "adventure"
      ? values.travelerType
      : "explorer";

  const archetypeMultiplier = ARCHETYPE_MULTIPLIER[travelerType];
  const sharingMultiplier = SHARING_MULTIPLIER[devicesNumber];
  const usageMultiplier = archetypeMultiplier * sharingMultiplier;

  const breakdown = ACTIVITY_USAGE_RATES.map((config) => {
    const hoursPerDay = hourValue(values[config.field]);
    const tripUsageGb = roundGb(
      (hoursPerDay * config.mbPerHour * tripDays) / GB_IN_MB,
      4,
    );
    return {
      activity: config.activity,
      label: config.label,
      hoursPerDay,
      mbPerHour: config.mbPerHour,
      tripUsageGb,
      adjustedTripUsageGb: roundGb(tripUsageGb * usageMultiplier, 4),
    };
  });

  const baseGb = roundGb(
    breakdown.reduce((sum, row) => sum + row.tripUsageGb, 0),
    4,
  );
  const afterArchetypeGb = roundGb(baseGb * archetypeMultiplier);
  const totalEstimatedGb = roundGb(afterArchetypeGb * sharingMultiplier);

  return {
    tripDays,
    travelerType,
    breakdown,
    baseGb,
    archetypeMultiplier,
    afterArchetypeGb,
    devicesNumber,
    usageMultiplier,
    totalEstimatedGb,
  };
}
