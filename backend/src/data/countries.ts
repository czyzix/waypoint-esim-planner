export type CountryRegion = "Europe" | "Asia" | "North America";

export interface Country {
  name: string;
  region: CountryRegion;
}

/** ISO 3166-1 alpha-2 → country (10 destinations from product plan). */
export const COUNTRIES: Record<string, Country> = {
  GB: { name: "United Kingdom", region: "Europe" },
  PL: { name: "Poland", region: "Europe" },
  TR: { name: "Turkey", region: "Europe" },
  ME: { name: "Montenegro", region: "Europe" },
  AL: { name: "Albania", region: "Europe" },
  CH: { name: "Switzerland", region: "Europe" },
  JP: { name: "Japan", region: "Asia" },
  CN: { name: "China", region: "Asia" },
  KR: { name: "South Korea", region: "Asia" },
  US: { name: "United States", region: "North America" },
};
