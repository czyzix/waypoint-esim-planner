import { MapPin } from "lucide-react";
import { Fragment } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { CountryFlag } from "@/components/country-flag";
import { normalizeCountries } from "@/lib/wizard-validation";
import type { WizardFormValues } from "@/types/wizard-form";
import { useCountries } from "@/hooks/use-countries";

function CountryLabel({ code, name }: { code: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <CountryFlag code={code} />
      <span>{name}</span>
    </span>
  );
}

export function CountrySelector() {
  const anchor = useComboboxAnchor();
  const { control, setValue } = useFormContext<WizardFormValues>();
  const selectedCountries = normalizeCountries(
    useWatch({ control, name: "countries" }),
  );
  const {
    countriesError,
    countriesLoading,
    countryCodes,
    countryNameByCode,
  } = useCountries();

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="countries"
        className="grid grid-cols-[auto_1fr] items-start gap-x-2 gap-y-0.5"
      >
        <MapPin className="row-span-2 size-4 shrink-0 text-current" aria-hidden />
        <p className="text-sm font-medium">What places do you want to see?</p>
        <p className="col-start-2 text-xs text-muted-foreground">
          You can select multiple countries across
        </p>
      </label>
      {countriesError ? (
        <p className="text-sm text-destructive" role="alert">
          {countriesError}
        </p>
      ) : (
        <Combobox
          multiple
          autoHighlight
          items={countryCodes}
          value={selectedCountries}
          onValueChange={(value) => {
            setValue("countries", value, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        >
          <ComboboxChips ref={anchor} id="countries" className="w-full">
            <ComboboxValue>
              {(values) => (
                <Fragment>
                  {values.map((code: string) => (
                    <ComboboxChip key={code}>
                      <CountryLabel
                        code={code}
                        name={countryNameByCode[code] ?? code}
                      />
                    </ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    placeholder={
                      countriesLoading ? "Loading countries…" : "Search countries…"
                    }
                    disabled={countriesLoading}
                  />
                </Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>No countries found.</ComboboxEmpty>
            <ComboboxList className="max-h-48">
              {(code: string) => (
                <ComboboxItem key={code} value={code}>
                  <CountryLabel
                    code={code}
                    name={countryNameByCode[code] ?? code}
                  />
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      )}
    </div>
  );
}
