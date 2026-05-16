import { CalendarDays } from "lucide-react";
import { type ChangeEvent, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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

  const tripDaysUnitLabel =
    typeof tripDays === "number" ? formatTripDaysUnit(tripDays) : null;

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
          className="row-span-2 size-4 shrink-0 text-current"
          aria-hidden
        />
        <p id="trip-days-label" className="text-sm font-medium">
          How many days is your trip?
        </p>
        <p className="col-start-2 text-xs text-muted-foreground">
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
        <div className="relative col-span-2 min-w-0 sm:col-span-1 sm:w-[8.5rem] sm:shrink-0 sm:flex-none">
          <Input
            ref={customTripDaysRef}
            id="tripDays"
            type="number"
            min={1}
            max={MAX_TRIP_DAYS}
            step={1}
            inputMode="numeric"
            aria-labelledby="trip-days-label"
            placeholder="0 days"
            className={cn(
              "w-full",
              tripDaysUnitLabel === "day" && "pr-10",
              tripDaysUnitLabel === "days" && "pr-12",
            )}
            value={tripDays === "" ? "" : tripDays}
            onChange={handleTripDaysChange}
          />
          {tripDaysUnitLabel ? (
            <span
              className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-sm text-muted-foreground"
              aria-hidden
            >
              {tripDaysUnitLabel}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
