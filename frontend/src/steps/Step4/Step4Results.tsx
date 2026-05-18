import { RecommendationPlanCard } from "./RecommendationPlanCard";
import { Button } from "@/components/ui/button";
import type { WizardResultsState } from "@/types/wizard-form";

type Step4ResultsProps = {
  results: WizardResultsState;
  onRestart: () => void;
};

const RECOMMENDATION_ERROR_MESSAGE =
  "Sorry, something went wrong. Please try again later.";

const RESULTS_COPY = {
  success: {
    title: "Your recommended plan",
    description:
      "Based on your trip and daily usage, here is the eSIM we suggest.",
  },
  error: {
    title: "Something went wrong",
    description: RECOMMENDATION_ERROR_MESSAGE,
  },
} as const;

type ResultsStepHeaderProps = {
  title: string;
  description: string;
  isError?: boolean;
};

function ResultsStepHeader({
  title,
  description,
  isError = false,
}: ResultsStepHeaderProps) {
  return (
    <header className="mb-5 text-center">
      <h2 className="text-2xl font-semibold md:text-xl">{title}</h2>
      <p
        className="mt-2 text-base text-pretty text-muted-foreground md:text-sm"
        {...(isError ? { role: "alert" } : {})}
      >
        {description}
      </p>
    </header>
  );
}

export function Step4Results({ results, onRestart }: Step4ResultsProps) {
  if (results.status === "idle") {
    return null;
  }

  const copy = RESULTS_COPY[results.status];
  const isError = results.status === "error";

  return (
    <section className="mx-auto w-full max-w-md text-left">
      <ResultsStepHeader
        title={copy.title}
        description={copy.description}
        isError={isError}
      />

      {results.status === "success" ? (
        <RecommendationPlanCard recommendation={results.data} />
      ) : null}

      <div className="mt-1.5">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onRestart}
        >
          Restart
        </Button>
      </div>
    </section>
  );
}
