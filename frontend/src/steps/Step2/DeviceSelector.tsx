import { Users } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { DevicesNumber } from "@/lib/recommendation-api";
import type { WizardFormValues } from "@/types/wizard-form";

const DEVICE_OPTIONS: {
  value: DevicesNumber;
  title: string;
  detail: string;
}[] = [
  { value: 1, title: "Only me", detail: "1 person" },
  { value: 2, title: 'My "partner in crime"', detail: "2 people" },
  { value: 3, title: "The whole gang", detail: "3+ people" },
];

export function DeviceSelector() {
  const { control, setValue } = useFormContext<WizardFormValues>();
  const devicesNumber = useWatch({ control, name: "devicesNumber" });

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-[auto_1fr] items-start gap-x-2 gap-y-0.5">
        <Users
          className="size-5 shrink-0 self-center text-current md:size-4"
          aria-hidden
        />
        <p id="devices-label" className="text-base font-medium md:text-sm">
          Who&apos;s traveling with you?
        </p>
        <p className="col-start-2 text-sm text-muted-foreground md:text-xs">
          Flying solo? Just pick &ldquo;Only me&rdquo;.
        </p>
      </div>
      <RadioGroup
        aria-labelledby="devices-label"
        value={devicesNumber === "" ? "" : String(devicesNumber)}
        onValueChange={(value) => {
          setValue("devicesNumber", Number(value) as DevicesNumber, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
        className="flex w-full flex-col gap-3"
      >
        {DEVICE_OPTIONS.map(({ value, title, detail }) => (
          <FieldLabel
            key={value}
            htmlFor={`devices-number-${value}`}
            className="w-full cursor-pointer"
          >
            <Field orientation="horizontal" className="py-3">
              <FieldContent className="flex-row flex-wrap items-baseline gap-x-1.5 gap-y-0">
                <FieldTitle className="w-auto shrink-0">{title}</FieldTitle>
                <FieldDescription className="mt-0 w-auto text-pretty leading-relaxed">
                  - {detail}
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem
                value={String(value)}
                id={`devices-number-${value}`}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </div>
  );
}
