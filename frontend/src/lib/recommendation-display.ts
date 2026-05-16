import type { RecommendationResponseDto } from "@/lib/recommendation-api";

export const SAILY_WEBSITE_URL = "https://www.saily.com/";
export const SAILY_FAVICON_URL = "/saily-favicon.ico";

/** Promotional discount applied to the displayed plan price. */
export const PLAN_PROMO_DISCOUNT = 0.15;

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPlanPrice(price: number): string {
  return priceFormatter.format(price);
}

export function formatPlanDataGb(
  gb: number,
  unlimitedData?: boolean,
): string {
  if (unlimitedData) return "Unlimited";
  return `${gb} GB`;
}

export function formatPlanValidityDays(validity: number): string {
  return `${validity} day${validity === 1 ? "" : "s"}`;
}

export function formatPlanValidityShort(validity: number): string {
  return `${validity} d`;
}

export function formatEstimatedGb(gb: number): string {
  const rounded = Math.round(gb * 10) / 10;
  return `${rounded} GB`;
}

export function formatPlanTypeLabel(
  planType: RecommendationResponseDto["planType"],
): string {
  return planType.charAt(0).toUpperCase() + planType.slice(1);
}
