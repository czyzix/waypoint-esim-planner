import { Controller, useFormContext } from "react-hook-form";
import { Backpack, Coffee, Earth, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { TravelerType } from "@/lib/recommendation-api";
import type { WizardFormValues } from "@/types/wizard-form";

const ARCHETYPES: {
  value: TravelerType;
  label: string;
  icon: LucideIcon;
  description: string;
}[] = [
  {
    value: "casual",
    label: "Casual",
    icon: Coffee,
    description:
      "Relaxed trips with light browsing and maps. We add a little headroom so you are not paying for unused data.",
  },
  {
    value: "explorer",
    label: "Explorer",
    icon: Backpack,
    description:
      "Navigation, social, and streaming on the go. Sized for steady, everyday use.",
  },
  {
    value: "adventure",
    label: "Adventurer",
    icon: Earth,
    description:
      "Heavy maps, calls, and uploads on the move. Extra buffer so you are less likely to run out mid-trip.",
  },
];

export function Step1Archetype() {
  const { control } = useFormContext<WizardFormValues>();

  return (
    <section className="text-left">
      <header className="mb-5 text-center">
        <h2 id="traveler-type-label" className="text-2xl font-semibold md:text-xl">
          Let&apos;s start your journey together!
        </h2>
        <p className="mt-2 text-base text-pretty text-muted-foreground md:text-sm">
          Every trip begins with how you like to travel. Pick the style that
          feels most like you.
        </p>
      </header>

      <Card>
        <CardContent>
          <Controller
            name="travelerType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                aria-labelledby="traveler-type-label"
                value={field.value}
                onValueChange={(value) => field.onChange(value as TravelerType)}
                className="flex w-full flex-col gap-3"
              >
                {ARCHETYPES.map(({ value, label, icon: Icon, description }) => (
                  <FieldLabel
                    key={value}
                    htmlFor={`traveler-type-${value}`}
                    className="w-full cursor-pointer"
                  >
                    <Field orientation="horizontal" className="py-3">
                      <FieldContent>
                        <FieldTitle>
                          <Icon
                            className="size-4 shrink-0 text-current"
                            aria-hidden
                          />
                          <span>{label}</span>
                        </FieldTitle>
                        <FieldDescription className="text-pretty leading-relaxed">
                          {description}
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value={value}
                        id={`traveler-type-${value}`}
                      />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
            )}
          />
        </CardContent>
      </Card>
    </section>
  );
}
