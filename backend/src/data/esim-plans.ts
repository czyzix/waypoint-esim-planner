/**
 * Saily-style plan catalog for the countries and regions supported by the app.
 *
 * Fixed data prices were taken from Saily destination pages where available. Per-duration
 * unlimited prices are listed as separate SKUs so the recommendation engine can compare
 * validity windows directly.
 */

export type PlanType = "local" | "regional" | "global";
export type PlanRegion = "Europe" | "Asia" | "North America" | "Global";

export interface ESimPlan {
  id: string;
  name: string;
  type: PlanType;
  region: PlanRegion;
  countries: string[];
  /** Fixed GB cap; not used for capacity rules when `unlimitedData` is true. */
  gb: number;
  validity: number;
  price: number;
  /** Fair-use unlimited data; priced by validity window. */
  unlimitedData?: boolean;
}

interface FixedOffer {
  gb: number;
  validity: number;
  price: number;
}

interface UnlimitedOffer {
  validity: number;
  price: number;
}

interface CountryPlanConfig {
  code: string;
  name: string;
  region: Exclude<PlanRegion, "Global">;
  fixed: FixedOffer[];
  unlimited: UnlimitedOffer[];
}

interface BundlePlanConfig {
  slug: string;
  name: string;
  type: Exclude<PlanType, "local">;
  region: PlanRegion;
  countries: string[];
  fixed: FixedOffer[];
  unlimited: UnlimitedOffer[];
}

const countryPlans = [
  {
    code: "GB",
    name: "United Kingdom",
    region: "Europe",
    fixed: [
      { gb: 1, validity: 7, price: 4.49 },
      { gb: 3, validity: 30, price: 8.99 },
      { gb: 5, validity: 30, price: 12.99 },
      { gb: 10, validity: 30, price: 18.99 },
      { gb: 20, validity: 30, price: 30.99 },
    ],
    unlimited: [
      { validity: 5, price: 18.99 },
      { validity: 7, price: 28.99 },
      { validity: 10, price: 34.99 },
      { validity: 15, price: 48.99 },
      { validity: 20, price: 59.99 },
      { validity: 25, price: 65.99 },
      { validity: 30, price: 71.99 },
    ],
  },
  {
    code: "PL",
    name: "Poland",
    region: "Europe",
    fixed: [
      { gb: 1, validity: 7, price: 4.49 },
      { gb: 3, validity: 30, price: 5.99 },
      { gb: 5, validity: 30, price: 8.99 },
      { gb: 10, validity: 30, price: 12.99 },
      { gb: 20, validity: 30, price: 20.99 },
    ],
    unlimited: [
      { validity: 5, price: 18.99 },
      { validity: 10, price: 34.99 },
      { validity: 15, price: 48.99 },
      { validity: 20, price: 59.99 },
      { validity: 25, price: 65.99 },
      { validity: 30, price: 71.99 },
    ],
  },
  {
    code: "TR",
    name: "Turkey",
    region: "Europe",
    fixed: [
      { gb: 1, validity: 7, price: 3.99 },
      { gb: 3, validity: 30, price: 6.99 },
      { gb: 5, validity: 30, price: 9.99 },
      { gb: 10, validity: 30, price: 15.99 },
      { gb: 20, validity: 30, price: 22.99 },
    ],
    unlimited: [
      { validity: 5, price: 18.99 },
      { validity: 10, price: 34.99 },
      { validity: 15, price: 48.99 },
      { validity: 20, price: 59.99 },
      { validity: 25, price: 65.99 },
      { validity: 30, price: 71.99 },
    ],
  },
  {
    code: "ME",
    name: "Montenegro",
    region: "Europe",
    fixed: [
      { gb: 1, validity: 7, price: 3.99 },
      { gb: 3, validity: 30, price: 8.99 },
      { gb: 5, validity: 30, price: 12.99 },
      { gb: 10, validity: 30, price: 21.99 },
      { gb: 20, validity: 30, price: 35.99 },
    ],
    unlimited: [
      { validity: 5, price: 27.99 },
      { validity: 10, price: 36.99 },
      { validity: 15, price: 48.99 },
      { validity: 20, price: 63.99 },
      { validity: 25, price: 79.99 },
      { validity: 30, price: 95.99 },
    ],
  },
  {
    code: "AL",
    name: "Albania",
    region: "Europe",
    fixed: [
      { gb: 1, validity: 7, price: 3.99 },
      { gb: 3, validity: 30, price: 8.99 },
      { gb: 5, validity: 30, price: 12.99 },
      { gb: 10, validity: 30, price: 21.99 },
      { gb: 20, validity: 30, price: 35.99 },
    ],
    unlimited: [
      { validity: 5, price: 25.99 },
      { validity: 10, price: 38.99 },
      { validity: 15, price: 57.99 },
      { validity: 20, price: 72.99 },
      { validity: 25, price: 86.99 },
      { validity: 30, price: 98.99 },
    ],
  },
  {
    code: "CH",
    name: "Switzerland",
    region: "Europe",
    fixed: [
      { gb: 1, validity: 7, price: 3.99 },
      { gb: 3, validity: 30, price: 9.99 },
      { gb: 5, validity: 30, price: 13.99 },
      { gb: 10, validity: 30, price: 22.99 },
      { gb: 20, validity: 30, price: 36.99 },
    ],
    unlimited: [
      { validity: 10, price: 34.99 },
      { validity: 15, price: 49.99 },
      { validity: 20, price: 59.99 }, 
      { validity: 25, price: 65.99 },
      { validity: 30, price: 71.99 },
    ],
  },
  {
    code: "JP",
    name: "Japan",
    region: "Asia",
    fixed: [
      { gb: 1, validity: 7, price: 3.99 },
      { gb: 3, validity: 30, price: 7.99 },
      { gb: 5, validity: 30, price: 10.99 },
      { gb: 10, validity: 30, price: 17.99 },
      { gb: 20, validity: 30, price: 24.99 },
    ],
    unlimited: [
      { validity: 5, price: 18.99 },
      { validity: 7, price: 28.99 },
      { validity: 10, price: 34.99 },
      { validity: 15, price: 48.99 },
      { validity: 20, price: 59.99 },
      { validity: 25, price: 65.99 },
      { validity: 30, price: 71.99 },
    ],
  },
  {
    code: "CN",
    name: "China",
    region: "Asia",
    fixed: [
      { gb: 1, validity: 7, price: 4.49 },
      { gb: 3, validity: 30, price: 10.99 },
      { gb: 5, validity: 30, price: 15.99 },
      { gb: 10, validity: 30, price: 26.99 },
      { gb: 20, validity: 30, price: 45.99 },
    ],
    unlimited: [
      { validity: 5, price: 22.99 },
      { validity: 7, price: 29.99 },
      { validity: 10, price: 35.99 },
      { validity: 15, price: 49.99 },
      { validity: 20, price: 60.99 },
      { validity: 25, price: 66.99 },
      { validity: 30, price: 72.99 },
    ],
  },
  {
    code: "KR",
    name: "South Korea",
    region: "Asia",
    fixed: [
      { gb: 1, validity: 7, price: 3.99 },
      { gb: 3, validity: 30, price: 8.99 },
      { gb: 5, validity: 30, price: 10.99 },
      { gb: 10, validity: 30, price: 18.99 },
      { gb: 20, validity: 30, price: 29.99 },
    ],
    unlimited: [
      { validity: 5, price: 18.99 },
      { validity: 10, price: 34.99 },
      { validity: 15, price: 48.99 },
      { validity: 20, price: 59.99 },
      { validity: 25, price: 65.99 },
      { validity: 30, price: 71.99 },
    ],
  },
  {
    code: "US",
    name: "United States",
    region: "North America",
    fixed: [
      { gb: 1, validity: 7, price: 3.99 },
      { gb: 3, validity: 30, price: 8.99 },
      { gb: 5, validity: 30, price: 13.99 },
      { gb: 10, validity: 30, price: 22.99 },
      { gb: 20, validity: 30, price: 36.99 },
    ],
    unlimited: [
      { validity: 5, price: 18.99 },
      { validity: 7, price: 28.99 },
      { validity: 10, price: 34.99 },
      { validity: 15, price: 48.99 },
      { validity: 20, price: 59.99 },
      { validity: 25, price: 65.99 },
      { validity: 30, price: 71.99 },
    ],
  },
] satisfies CountryPlanConfig[];

const bundlePlans = [
  {
    slug: "north-america",
    name: "North America",
    type: "regional",
    region: "North America",
    countries: ["US"],
    fixed: [
      { gb: 1, validity: 7, price: 5.99 },
      { gb: 2, validity: 15, price: 11.49 },
      { gb: 3, validity: 30, price: 15.99 },
      { gb: 5, validity: 30, price: 23.99 },
      { gb: 10, validity: 30, price: 43.99 },
      { gb: 20, validity: 30, price: 54.99 },
    ],
    unlimited: [],
  },
  {
    slug: "europe",
    name: "Europe",
    type: "regional",
    region: "Europe",
    countries: ["GB", "PL", "TR", "ME", "AL", "CH"],
    fixed: [
      { gb: 1, validity: 7, price: 4.99 },
      { gb: 3, validity: 30, price: 12.49 },
      { gb: 5, validity: 30, price: 19.49 },
      { gb: 10, validity: 30, price: 35.99 },
      { gb: 50, validity: 90, price: 95.99 },
    ],
    unlimited: [
      { validity: 7, price: 28.99 },
      { validity: 10, price: 35.99 },
      { validity: 15, price: 49.99 },
      { validity: 20, price: 59.99 },
      { validity: 25, price: 65.99 },
      { validity: 30, price: 71.99 },
    ],
  },
  {
    slug: "asia-and-oceania",
    name: "Asia and Oceania",
    type: "regional",
    region: "Asia",
    countries: ["JP", "CN", "KR"],
    fixed: [
      { gb: 1, validity: 7, price: 4.99 },
      { gb: 3, validity: 30, price: 12.49 },
      { gb: 5, validity: 30, price: 19.49 },
      { gb: 10, validity: 30, price: 35.99 },
      { gb: 25, validity: 60, price: 48.99 },
    ],
    unlimited: [
      { validity: 5, price: 21.99 },
      { validity: 10, price: 38.99 },
      { validity: 15, price: 54.99 },
      { validity: 20, price: 68.99 },
      { validity: 25, price: 78.99 },
      { validity: 30, price: 86.99 },
    ],
  },
  {
    slug: "global",
    name: "Global",
    type: "global",
    region: "Global",
    countries: ["ALL"],
    fixed: [
      { gb: 1, validity: 7, price: 8.99 },
      { gb: 2, validity: 15, price: 16.49 },
      { gb: 5, validity: 60, price: 33.99 },
      { gb: 10, validity: 180, price: 56.99 },
      { gb: 20, validity: 365, price: 66.99 },
      { gb: 50, validity: 365, price: 129.99 },
    ],
    unlimited: [],
  },
] satisfies BundlePlanConfig[];

function createFixedPlan(
  country: CountryPlanConfig,
  offer: FixedOffer,
): ESimPlan {
  return {
    id: `saily-${country.code.toLowerCase()}-${offer.gb}gb-${offer.validity}d`,
    name: `${country.name} - ${offer.gb} GB`,
    type: "local",
    region: country.region,
    countries: [country.code],
    gb: offer.gb,
    validity: offer.validity,
    price: offer.price,
  };
}

function createUnlimitedPlan(
  country: CountryPlanConfig,
  offer: UnlimitedOffer,
): ESimPlan {
  return {
    id: `saily-${country.code.toLowerCase()}-unlimited`,
    name: `${country.name} - Unlimited data`,
    type: "local",
    region: country.region,
    countries: [country.code],
    gb: 0,
    validity: offer.validity,
    price: offer.price,
    unlimitedData: true,
  };
}

function createBundleFixedPlan(
  bundle: BundlePlanConfig,
  offer: FixedOffer,
): ESimPlan {
  return {
    id: `saily-${bundle.slug}-${offer.gb}gb-${offer.validity}d`,
    name: `${bundle.name} - ${offer.gb} GB`,
    type: bundle.type,
    region: bundle.region,
    countries: bundle.countries,
    gb: offer.gb,
    validity: offer.validity,
    price: offer.price,
  };
}

function createBundleUnlimitedPlan(
  bundle: BundlePlanConfig,
  offer: UnlimitedOffer,
): ESimPlan {
  return {
    id: `saily-${bundle.slug}-unlimited-${offer.validity}d`,
    name: `${bundle.name} - Unlimited`,
    type: bundle.type,
    region: bundle.region,
    countries: bundle.countries,
    gb: 0,
    validity: offer.validity,
    price: offer.price,
    unlimitedData: true,
  };
}

export const ESIM_PLANS: ESimPlan[] = countryPlans.flatMap((country) => [
  ...country.fixed.map((offer) => createFixedPlan(country, offer)),
  ...country.unlimited.map((offer) => createUnlimitedPlan(country, offer)),
]).concat(
  bundlePlans.flatMap((bundle) => [
    ...bundle.fixed.map((offer) => createBundleFixedPlan(bundle, offer)),
    ...bundle.unlimited.map((offer) => createBundleUnlimitedPlan(bundle, offer)),
  ]),
);
