import { CalendarDays } from "lucide-react";
import { type ChangeEvent, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { NumberInputWithSuffix } from "@/components/ui/number-input-with-suffix";
import { formatTripDaysUnit } from "@/lib/wizard-form-utils";
import { MAX_TRIP_DAYS } from "@/lib/wizard-validation";
import type { WizardFormValues } from "@/types/wizard-form";

const TRIP_DAY_PRESETS = [7, 14, 20, 30] as const;

export function TripDaysSelector() {
  const customTripDaysRef = useRef<HTMLInputElement>(null);
  const { control, setValue } = useFormContext<WizardFormValues>();
  const tripDays = useWatch({ control, name: "tripDays" });

  const setTripDays = (days: number | "") => {
    setValue("tripDays", days, { shouldValidate: true, shouldDirty: true });
  };

  const isCustomTripDays =
    typeof tripDays === "number" &&
    !(TRIP_DAY_PRESETS as readonly number[]).includes(tripDays);

  const tripDaysSuffix =
    typeof tripDays === "number" ? formatTripDaysUnit(tripDays) : "days";

  const handleTripDaysChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (raw === "") {
      setTripDays("");
      return;
    }
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    setTripDays(Math.min(MAX_TRIP_DAYS, Math.max(1, Math.trunc(n))));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[auto_1fr] items-start gap-x-2 gap-y-0.5">
        <CalendarDays
          className="size-5 shrink-0 self-center text-current md:size-4"
          aria-hidden
        />
        <p id="trip-days-label" className="text-base font-medium md:text-sm">
          How many days is your trip?
        </p>
        <p className="col-start-2 text-sm text-muted-foreground md:text-xs">
          Saily plans cover max {MAX_TRIP_DAYS} days
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:w-full sm:items-center">
        {TRIP_DAY_PRESETS.map((days) => (
          <Button
            key={days}
            type="button"
            variant={tripDays === days ? "default" : "outline"}
            size="sm"
            className="min-w-0 sm:flex-1"
            aria-pressed={tripDays === days}
            onClick={() => setTripDays(days)}
          >
            {days}
          </Button>
        ))}
        <Button
          type="button"
          variant={isCustomTripDays ? "default" : "outline"}
          size="sm"
          className="col-span-2 min-w-0 sm:col-span-1 sm:flex-1"
          aria-pressed={isCustomTripDays}
          onClick={() => {
            if (!isCustomTripDays) {
              setTripDays(1);
            }
            customTripDaysRef.current?.focus();
          }}
        >
          Other
        </Button>
        <NumberInputWithSuffix
          ref={customTripDaysRef}
          id="tripDays"
          suffix={tripDaysSuffix}
          min={1}
          max={MAX_TRIP_DAYS}
          step={1}
          inputMode="numeric"
          aria-labelledby="trip-days-label"
          placeholder="0"
          containerClassName="col-span-2 min-w-0 sm:col-span-1 sm:w-[8.5rem] sm:shrink-0 sm:flex-none"
          value={tripDays === "" ? "" : tripDays}
          onChange={handleTripDaysChange}
        />
      </div>
    </div>
  );
}
