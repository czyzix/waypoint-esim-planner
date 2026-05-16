import type {
  DevicesNumber,
  RecommendationResponseDto,
  TravelerType,
} from "@/lib/recommendation-api";

/** Form values aligned with `POST /api/recommendation` body. */
export type WizardFormValues = {
  travelerType: TravelerType | "";
  countries: string[];
  tripDays: number | "";
  devicesNumber: DevicesNumber | "";
  socialHours: number | "";
  streamingHours: number | "";
  workHours: number | "";
  navigationHours: number | "";
  surfingHours: number | "";
};

export const WIZARD_FORM_DEFAULTS: WizardFormValues = {
  travelerType: "",
  countries: [],
  tripDays: "",
  devicesNumber: "",
  socialHours: "",
  streamingHours: "",
  workHours: "",
  navigationHours: "",
  surfingHours: "",
};

export const WIZARD_STEP_COUNT = 4;

export type WizardResultsState =
  | { status: "idle" }
  | { status: "success"; data: RecommendationResponseDto }
  | { status: "error"; error: string };
