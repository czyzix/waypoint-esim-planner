import { WIZARD_FORM_DEFAULTS } from "@/types/wizard-form";
import {
  isStepValid,
  isValidIsoDate,
  normalizeCountries,
  normalizeDevicesNumber,
  tripDaysInputValueAs,
} from "./wizard-validation";

describe("normalizeCountries", () => {
  it("returns an array unchanged", () => {
    expect(normalizeCountries(["PL", "DE"])).toEqual(["PL", "DE"]);
  });

  it("wraps a single string from RHF", () => {
    expect(normalizeCountries("PL")).toEqual(["PL"]);
  });

  it("returns empty array for missing values", () => {
    expect(normalizeCountries(undefined)).toEqual([]);
    expect(normalizeCountries("")).toEqual([]);
  });
});

describe("normalizeDevicesNumber", () => {
  it("accepts numbers and numeric strings", () => {
    expect(normalizeDevicesNumber(2)).toBe(2);
    expect(normalizeDevicesNumber("3")).toBe(3);
  });

  it("rejects invalid values", () => {
    expect(normalizeDevicesNumber("")).toBeNull();
    expect(normalizeDevicesNumber(4)).toBeNull();
  });
});

describe("isValidIsoDate", () => {
  it("accepts real calendar dates", () => {
    expect(isValidIsoDate("2026-05-17")).toBe(true);
  });

  it("rejects invalid dates and formats", () => {
    expect(isValidIsoDate("17-05-2026")).toBe(false);
    expect(isValidIsoDate("2026-02-30")).toBe(false);
  });
});

describe("tripDaysInputValueAs", () => {
  it("clamps trip days to 1–30", () => {
    expect(tripDaysInputValueAs(0)).toBe("");
    expect(tripDaysInputValueAs(45)).toBe(30);
    expect(tripDaysInputValueAs(7)).toBe(7);
  });
});

describe("isStepValid", () => {
  it("requires traveler type on step 1", () => {
    expect(isStepValid(1, WIZARD_FORM_DEFAULTS)).toBe(false);
    expect(
      isStepValid(1, { ...WIZARD_FORM_DEFAULTS, travelerType: "explorer" }),
    ).toBe(true);
  });

  it("requires countries, trip days, and devices on step 2", () => {
    const partial = {
      ...WIZARD_FORM_DEFAULTS,
      countries: ["PL"],
      tripDays: 5,
    };
    expect(isStepValid(2, partial)).toBe(false);
    expect(
      isStepValid(2, { ...partial, devicesNumber: 1 }),
    ).toBe(true);
  });
});
