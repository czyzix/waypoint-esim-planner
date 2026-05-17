import { WIZARD_FORM_DEFAULTS } from "@/types/wizard-form";
import {
  calculateTripUsage,
  formatUsageRatePerHour,
  getUsageAdjustmentNotes,
} from "./usage-calculations";

describe("formatUsageRatePerHour", () => {
  it("shows whole GB when rate divides evenly", () => {
    expect(formatUsageRatePerHour(1024)).toBe("1 GB / h");
  });

  it("shows MB for smaller rates", () => {
    expect(formatUsageRatePerHour(150)).toBe("150 MB / h");
  });
});

describe("calculateTripUsage", () => {
  it("returns null without valid trip days", () => {
    expect(calculateTripUsage(WIZARD_FORM_DEFAULTS)).toBeNull();
  });

  it("estimates usage from activity hours", () => {
    const summary = calculateTripUsage({
      ...WIZARD_FORM_DEFAULTS,
      travelerType: "explorer",
      tripDays: 7,
      devicesNumber: 1,
      socialHours: 1,
    });

    expect(summary).not.toBeNull();
    expect(summary?.totalEstimatedGb).toBeGreaterThan(0);
    expect(summary?.breakdown[0]).toMatchObject({
      label: "Social media",
      hoursPerDay: 1,
    });
  });
});

describe("getUsageAdjustmentNotes", () => {
  const baseSummary = calculateTripUsage({
    ...WIZARD_FORM_DEFAULTS,
    travelerType: "explorer",
    tripDays: 3,
    devicesNumber: 1,
    navigationHours: 1,
  });

  it("has no notes for default explorer + solo", () => {
    expect(getUsageAdjustmentNotes(baseSummary!)).toEqual([]);
  });

  it("mentions travel style when not explorer", () => {
    const casual = calculateTripUsage({
      ...WIZARD_FORM_DEFAULTS,
      travelerType: "casual",
      tripDays: 3,
      devicesNumber: 1,
      navigationHours: 1,
    });
    expect(getUsageAdjustmentNotes(casual!)).toContain(
      "Includes Casual travel style adjustment",
    );
  });
});
