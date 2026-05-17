import {
  Globe,
  MapPin,
  MessageCircle,
  Phone,
  Tv,
  type LucideIcon,
} from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { NumberInputWithSuffix } from "@/components/ui/number-input-with-suffix";
import { Label } from "@/components/ui/label";
import { UsageDonutChart } from "@/components/usage/UsageDonutChart";
import { UsageEstimateInfoDialog } from "@/components/usage/UsageEstimateInfoDialog";
import {
  hourInputValueAs,
  mergeWizardFormValues,
} from "@/lib/wizard-form-utils";
import { MAX_ACTIVITY_HOURS_PER_DAY } from "@/lib/wizard-validation";
import { calculateTripUsage } from "@/lib/usage-calculations";
import type { WizardFormValues } from "@/types/wizard-form";

type UsageFieldName = Extract<keyof WizardFormValues, `${string}Hours`>;

const USAGE_FIELDS = [
  {
    name: "streamingHours",
    label: "Streaming",
    icon: Tv,
    example: "Netflix, Disney+",
  },
  {
    name: "workHours",
    label: "Work calls",
    icon: Phone,
    example: "Zoom, Google Meet",
  },
  {
    name: "surfingHours",
    label: "Surfing",
    icon: Globe,
    example: "news, shopping",
  },
  {
    name: "navigationHours",
    label: "Navigation",
    icon: MapPin,
    example: "Google Maps, Waze",
  },
  {
    name: "socialHours",
    label: "Social media",
    icon: MessageCircle,
    example: "Instagram, TikTok",
  },
] as const satisfies readonly {
  name: UsageFieldName;
  label: string;
  icon: LucideIcon;
  example: string;
}[];

type UsageHourFieldProps = {
  name: UsageFieldName;
  label: string;
  icon: LucideIcon;
  example: string;
};

function UsageHourField({
  name,
  label,
  icon: Icon,
  example,
}: UsageHourFieldProps) {
  const { control, register } = useFormContext<WizardFormValues>();
  const value = useWatch({ control, name });
  const hours = typeof value === "number" && !Number.isNaN(value) ? value : "";
  const { onChange, onBlur, ref, name: fieldName } = register(name, {
    setValueAs: hourInputValueAs,
  });

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
      <div className="min-w-0 flex-1">
        <Label htmlFor={name} className="inline-flex items-center gap-1.5">
          <Icon className="size-4 shrink-0" aria-hidden />
          {label}
        </Label>
        <p className="mt-0.5 text-sm text-muted-foreground md:text-xs">{example}</p>
      </div>
      <NumberInputWithSuffix
        containerClassName="w-full shrink-0 sm:w-[6.5rem]"
        id={name}
        name={fieldName}
        ref={ref}
        suffix="h/day"
        min={0}
        max={MAX_ACTIVITY_HOURS_PER_DAY}
        step={0.5}
        inputMode="decimal"
        placeholder="0"
        value={hours}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
}

export function Step3Usage() {
  const { control } = useFormContext<WizardFormValues>();
  const values = mergeWizardFormValues(useWatch({ control }));
  const summary = calculateTripUsage(values);

  return (
    <section className="text-left">
      <header className="mb-5 text-center">
        <h2 className="text-2xl font-semibold md:text-xl">Daily usage</h2>
        <p className="mt-2 text-base text-pretty text-muted-foreground md:text-sm">
          Set how much time you spend online each day. We&apos;ll estimate data
          for your whole trip.
        </p>
      </header>

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 sm:gap-8">
            <div className="flex flex-col gap-4">
              {USAGE_FIELDS.map(({ name, label, icon, example }) => (
                <UsageHourField
                  key={name}
                  name={name}
                  label={label}
                  icon={icon}
                  example={example}
                />
              ))}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-base font-medium md:text-sm">Trip usage estimate</p>
                <UsageEstimateInfoDialog />
              </div>
              {summary ? (
                <UsageDonutChart summary={summary} />
              ) : (
                <p className="rounded-lg border border-dashed p-4 text-base text-muted-foreground md:text-sm">
                  Complete your trip details to see the usage estimate.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
