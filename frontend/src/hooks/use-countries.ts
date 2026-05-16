import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchCountries, type CountryOption } from "@/lib/recommendation-api";

type CountriesContextValue = {
  countries: CountryOption[];
  countriesError: string | null;
  countriesLoading: boolean;
  countryCodes: string[];
  countryNameByCode: Record<string, string>;
};

const CountriesContext = createContext<CountriesContextValue | null>(null);

type CountriesProviderProps = {
  children: ReactNode;
};

export function CountriesProvider({ children }: CountriesProviderProps) {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchCountries()
      .then((data) => {
        if (!cancelled) setCountries(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setCountriesError(
            err instanceof Error ? err.message : "Failed to load countries",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setCountriesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const countryCodes = useMemo(
    () => countries.map(({ code }) => code),
    [countries],
  );

  const countryNameByCode = useMemo(
    () => Object.fromEntries(countries.map(({ code, name }) => [code, name])),
    [countries],
  );

  const value = useMemo(
    () => ({
      countries,
      countriesError,
      countriesLoading,
      countryCodes,
      countryNameByCode,
    }),
    [countries, countriesError, countriesLoading, countryCodes, countryNameByCode],
  );

  return createElement(CountriesContext.Provider, { value }, children);
}

export function useCountries() {
  const context = useContext(CountriesContext);

  if (!context) {
    throw new Error("useCountries must be used within CountriesProvider");
  }

  return context;
}
