import { useEffect, useRef, useState, type RefObject } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Step1Archetype } from "@/steps/Step1Archetype";
import { Step2Trip } from "@/steps/Step2/Step2Trip";
import { Step3Usage } from "@/steps/Step3Usage";
import { Step4Results } from "@/steps/Step4/Step4Results";
import {
  mergeWizardFormValues,
  toRecommendationRequest,
} from "@/lib/wizard-form-utils";
import { hasAnyActivityHours, isStepValid } from "@/lib/wizard-validation";
import { apiUrl } from "@/lib/api-base";
import type { RecommendationResponseDto } from "@/lib/recommendation-api";
import {
  WIZARD_FORM_DEFAULTS,
  WIZARD_STEP_COUNT,
  type WizardFormValues,
  type WizardResultsState,
} from "@/types/wizard-form";
import { WizardNavigation } from "./WizardNavigation";

type TravelWizardProps = {
  goHomeRef?: RefObject<() => void>;
};

export function TravelWizard({ goHomeRef }: TravelWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const previousStepRef = useRef(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<WizardResultsState>({ status: "idle" });

  const form = useForm<WizardFormValues>({
    defaultValues: WIZARD_FORM_DEFAULTS,
    mode: "onChange",
  });

  const formValues = mergeWizardFormValues(form.watch());
  const isCurrentStepValid = isStepValid(currentStep, formValues);

  function goToStep(step: number) {
    setCurrentStep(Math.min(Math.max(step, 1), WIZARD_STEP_COUNT));
  }

  function handlePrevious() {
    if (currentStep <= 1) return;
    goToStep(currentStep - 1);
  }

  function handleNext() {
    const values = mergeWizardFormValues(form.getValues());
    if (!isStepValid(currentStep, values) || currentStep >= 3) return;
    goToStep(currentStep + 1);
  }

  function handleRestart() {
    form.reset(WIZARD_FORM_DEFAULTS);
    setResults({ status: "idle" });
    setIsSubmitting(false);
    goToStep(1);
  }

  useEffect(() => {
    if (currentStep > previousStepRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    previousStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    if (goHomeRef) {
      goHomeRef.current = handleRestart;
    }
  });

  async function handleShowResults() {
    if (
      isSubmitting ||
      !isStepValid(1, formValues) ||
      !isStepValid(2, formValues) ||
      !hasAnyActivityHours(formValues)
    ) {
      return;
    }

    setIsSubmitting(true);
    setResults({ status: "idle" });

    try {
      const res = await fetch(apiUrl("/api/recommendation"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toRecommendationRequest(form.getValues())),
      });

      const text = await res.text();
      let body: unknown;
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }

      if (!res.ok) {
        const message =
          typeof body === "object" &&
          body !== null &&
          "message" in body &&
          typeof (body as { message: unknown }).message === "string"
            ? (body as { message: string }).message
            : `Request failed (${res.status})`;
        setResults({ status: "error", error: message });
        goToStep(4);
        return;
      }

      setResults({
        status: "success",
        data: body as RecommendationResponseDto,
      });
      goToStep(4);
    } catch (e) {
      setResults({
        status: "error",
        error: e instanceof Error ? e.message : "Something went wrong",
      });
      goToStep(4);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full text-center"
      >
        {currentStep === 1 ? <Step1Archetype /> : null}
        {currentStep === 2 ? <Step2Trip /> : null}
        {currentStep === 3 ? <Step3Usage /> : null}
        {currentStep === 4 ? (
          <Step4Results results={results} onRestart={handleRestart} />
        ) : null}

        <WizardNavigation
          currentStep={currentStep}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoNext={isCurrentStepValid}
          onShowResults={() => void handleShowResults()}
          canShowResults={hasAnyActivityHours(formValues)}
          isSubmitting={isSubmitting}
        />
      </form>
    </FormProvider>
  );
}
