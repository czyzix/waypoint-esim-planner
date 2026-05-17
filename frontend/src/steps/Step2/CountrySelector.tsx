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

function CountryLabel({
  code,
  name,
  flagClassName,
}: {
  code: string;
  name: string;
  flagClassName?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 max-md:gap-2">
      <CountryFlag code={code} className={flagClassName} />
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

  const handleCountriesChange = (value: string[]) => {
    setValue("countries", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="countries"
        className="grid grid-cols-[auto_1fr] items-start gap-x-2 gap-y-0.5"
      >
        <MapPin
          className="size-5 shrink-0 self-center text-current md:size-4"
          aria-hidden
        />
        <p className="text-base font-medium md:text-sm">What places do you want to see?</p>
        <p className="col-start-2 text-sm text-muted-foreground md:text-xs">
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
          onValueChange={handleCountriesChange}
        >
          <ComboboxChips ref={anchor} id="countries" className="w-full max-md:gap-1.5">
            <ComboboxValue>
              {(values) => (
                <Fragment>
                  {values.map((code: string) => (
                    <ComboboxChip key={code}>
                      <CountryLabel
                        code={code}
                        name={countryNameByCode[code] ?? code}
                        flagClassName="max-md:size-4"
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
          <ComboboxContent
            anchor={anchor}
            side="bottom"
            collisionAvoidance={{ side: "none", fallbackAxisSide: "none" }}
          >
            <ComboboxEmpty>No countries found.</ComboboxEmpty>
            <ComboboxList
              className="touch-pan-y [-webkit-overflow-scrolling:touch] max-md:flex max-md:!max-h-[min(14rem,var(--available-height,50dvh))] max-md:flex-col max-md:gap-0.5 max-md:p-1.5 max-md:[overscroll-behavior-y:auto] md:!max-h-48"
            >
              {(code: string) => (
                <ComboboxItem
                  key={code}
                  value={code}
                  className="max-md:min-h-11 max-md:gap-2.5 max-md:py-2.5 max-md:pr-10 max-md:pl-2.5 max-md:text-base"
                >
                  <CountryLabel
                    code={code}
                    name={countryNameByCode[code] ?? code}
                    flagClassName="max-md:size-6"
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
