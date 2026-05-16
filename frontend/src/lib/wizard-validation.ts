import type { DevicesNumber } from "@/lib/recommendation-api";
import type { WizardFormValues } from "@/types/wizard-form";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE_RE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.toISOString().slice(0, 10) === value;
}

export function parseIsoDate(value: string): Date | undefined {
  if (!isValidIsoDate(value)) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toIsoDate(date: Date | undefined): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** RHF may store a lone multi-select value as a string instead of `string[]`. */
export function normalizeCountries(
  countries: WizardFormValues["countries"] | string | undefined,
): string[] {
  if (Array.isArray(countries)) return countries;
  if (typeof countries === "string" && countries.length > 0) return [countries];
  return [];
}

/** API expects numeric literals; RHF radios often store strings. */
export function normalizeDevicesNumber(
  value: WizardFormValues["devicesNumber"] | string | number | undefined,
): DevicesNumber | null {
  const n = Number(value);
  if (n === 1 || n === 2 || n === 3) return n as DevicesNumber;
  return null;
}

function isHourFilled(value: WizardFormValues["socialHours"]): boolean {
  if (value === "") return false;
  if (typeof value !== "number" || Number.isNaN(value)) return false;
  return value >= 0 && value <= MAX_ACTIVITY_HOURS_PER_DAY;
}

export function hasAnyActivityHours(values: WizardFormValues): boolean {
  return WIZARD_STEP_FIELDS[3].some((field) => isHourFilled(values[field]));
}

/** Empty or invalid activity hours → 0 for API payload and estimates. */
export function normalizeActivityHours(
  value: WizardFormValues["socialHours"],
): number {
  if (value === "" || typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }
  if (value < 0) return 0;
  if (value > MAX_ACTIVITY_HOURS_PER_DAY) return MAX_ACTIVITY_HOURS_PER_DAY;
  return value;
}

export const MAX_TRIP_DAYS = 30;
export const MAX_ACTIVITY_HOURS_PER_DAY = 24;

/** Coerce trip-days input; clamps to 1–{MAX_TRIP_DAYS} (HTML `max` does not block typing). */
export function tripDaysInputValueAs(
  value: string | number,
): number | "" {
  if (value === "" || value === null || value === undefined) return "";
  const raw = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(raw)) return "";
  const n = Math.trunc(raw);
  if (n < 1) return "";
  if (n > MAX_TRIP_DAYS) return MAX_TRIP_DAYS;
  return n;
}

function isTripDaysFilled(value: WizardFormValues["tripDays"]): boolean {
  if (value === "") return false;
  if (typeof value !== "number" || Number.isNaN(value)) return false;
  return Number.isInteger(value) && value >= 1 && value <= MAX_TRIP_DAYS;
}

export const WIZARD_STEP_FIELDS = {
  1: ["travelerType"] as const,
  2: ["countries", "tripDays", "devicesNumber"] as const,
  3: [
    "socialHours",
    "streamingHours",
    "workHours",
    "navigationHours",
    "surfingHours",
  ] as const,
} as const;

export function isStepValid(
  step: number,
  values: WizardFormValues,
): boolean {
  switch (step) {
    case 1:
      return (
        values.travelerType === "casual" ||
        values.travelerType === "explorer" ||
        values.travelerType === "adventure"
      );
    case 2:
      return (
        normalizeCountries(values.countries).length >= 1 &&
        isTripDaysFilled(values.tripDays) &&
        normalizeDevicesNumber(values.devicesNumber) !== null
      );
    case 3:
      return (
        hasAnyActivityHours(values) &&
        WIZARD_STEP_FIELDS[3].every((field) => {
          const value = values[field];
          return value === "" || isHourFilled(value);
        })
      );
    default:
      return false;
  }
}
