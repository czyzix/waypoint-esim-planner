import { Earth } from "lucide-react";
import { CountryFlag } from "@/components/country-flag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatEstimatedGb,
  formatPlanDataGb,
  formatPlanPrice,
  formatPlanTypeLabel,
  formatPlanValidityShort,
  SAILY_WEBSITE_URL,
} from "@/lib/recommendation-display";
import type {
  PlanType,
  RecommendationResponseDto,
} from "@/lib/recommendation-api";
import { formatTripDaysUnit } from "@/lib/wizard-form-utils";
import { cn } from "@/lib/utils";

const PLAN_SCOPE_ICON_CLASS = "size-10 shrink-0";

type RecommendationPlanCardProps = {
  recommendation: RecommendationResponseDto;
};

function PlanScopeIcon({
  planType,
  countryCode,
}: {
  planType: PlanType;
  countryCode?: string;
}) {
  if (planType === "local" && countryCode && countryCode !== "ALL") {
    return (
      <CountryFlag code={countryCode} className={PLAN_SCOPE_ICON_CLASS} />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-full bg-blue-100 ring-1 ring-border/50",
        PLAN_SCOPE_ICON_CLASS,
      )}
      aria-hidden
    >
      <Earth className="size-5 text-blue-600" />
    </span>
  );
}

export function RecommendationPlanCard({
  recommendation,
}: RecommendationPlanCardProps) {
  const { recommendedPlan, tripDays, totalEstimatedGb, reasons } =
    recommendation;
  const tripSummary = `${tripDays} ${formatTripDaysUnit(tripDays)} trip · ${formatEstimatedGb(totalEstimatedGb)} estimated`;
  const planDataLabel = formatPlanDataGb(
    recommendedPlan.gb,
    recommendedPlan.unlimitedData,
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-b pb-3">
          <div className="flex min-w-0 items-center gap-3 text-left">
            <PlanScopeIcon
              planType={recommendation.planType}
              countryCode={recommendedPlan.countries[0]}
            />
            <div className="min-w-0 flex-1 space-y-0">
              <CardTitle className="text-lg leading-tight">
                {recommendedPlan.name}
              </CardTitle>
              <CardDescription className="leading-tight">
                {formatPlanTypeLabel(recommendation.planType)} plan
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-border/60 bg-muted/35">
            <dl className="grid grid-cols-3 gap-x-3 gap-y-0.5 px-3 py-2.5">
              <dt className="text-center text-xs text-muted-foreground">
                Validity
              </dt>
              <dt className="text-center text-xs text-muted-foreground">Data</dt>
              <dt className="text-center text-xs text-muted-foreground">
                Price
              </dt>
              <dd className="flex min-w-0 items-center justify-center text-center text-base font-semibold leading-tight">
                {formatPlanValidityShort(recommendedPlan.validity)}
              </dd>
              <dd className="flex min-w-0 items-center justify-center text-center text-base font-semibold leading-tight">
                {planDataLabel}
              </dd>
              <dd className="flex min-w-0 items-center justify-center gap-1.5">
                <Badge variant="green" size="md">
                  {formatPlanPrice(recommendedPlan.price)}
                </Badge>
              </dd>
            </dl>

            <p className="border-t border-border/60 bg-background/40 px-3 py-2 text-center text-xs text-muted-foreground">
              {tripSummary}
            </p>
          </div>

          {reasons.length > 0 ? (
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Why this plan?</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {reasons.map((reason) => (
                  <li key={reason} className="text-pretty">
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Button
        className="w-full bg-[#FFF500] text-foreground hover:bg-[#FFF940] [a]:hover:bg-[#FFF940] [a]:hover:text-foreground focus-visible:ring-[#FFF500]/50"
        render={
          <a
            href={SAILY_WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        CTA
      </Button>
    </div>
  );
}
