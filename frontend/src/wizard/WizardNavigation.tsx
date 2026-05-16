import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type WizardNavigationProps = {
  currentStep: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
  onShowResults?: () => void;
  canShowResults?: boolean;
  isSubmitting?: boolean;
};

export function WizardNavigation({
  currentStep,
  onPrevious,
  onNext,
  canGoNext,
  onShowResults,
  canShowResults = false,
  isSubmitting = false,
}: WizardNavigationProps) {
  if (currentStep >= 4) {
    return null;
  }

  const showPrevious = currentStep > 1;
  const showNext = currentStep < 3;
  const showResults = currentStep === 3;

  if (!showPrevious && !showNext && !showResults) {
    return null;
  }

  return (
    <nav
      aria-label="Wizard steps"
      className="mt-4 flex items-center justify-center gap-3"
    >
      {showPrevious ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Previous step"
          onClick={onPrevious}
        >
          <ChevronLeft />
        </Button>
      ) : null}
      {showResults ? (
        <Button
          type="button"
          variant="default"
          className="grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1"
          onClick={onShowResults}
          disabled={!canShowResults || isSubmitting}
          aria-busy={isSubmitting}
          aria-label={isSubmitting ? "Loading recommendation" : undefined}
        >
          <span className={cn(isSubmitting && "invisible")} aria-hidden={isSubmitting}>
            Recommend plan
          </span>
          {isSubmitting ? <Spinner /> : null}
        </Button>
      ) : null}
      {showNext ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Next step"
          onClick={onNext}
          disabled={!canGoNext}
        >
          <ChevronRight />
        </Button>
      ) : null}
    </nav>
  );
}
