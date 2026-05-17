import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { SHARING_MULTIPLIER } from "@/lib/api-contract/recommendation.dto";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ACTIVITY_USAGE_RATES,
  ARCHETYPE_MULTIPLIER,
  formatUsageRatePerHour,
  SHARING_FACTOR_LABEL,
  TRAVELER_TYPE_LABEL,
} from "@/lib/usage-calculations";
import type { DevicesNumber, TravelerType } from "@/lib/recommendation-api";

const TRAVELER_TYPES: TravelerType[] = ["casual", "explorer", "adventure"];
const DEVICES_NUMBERS: DevicesNumber[] = [1, 2, 3];

function formatMultiplier(value: number): string {
  return `×${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}`;
}

function EstimateTable({
  caption,
  footnote,
  children,
}: {
  caption: string;
  footnote?: string;
  children: ReactNode;
}) {
  return (
    <figure className="space-y-2">
      <figcaption className="text-sm font-medium">{caption}</figcaption>
      <div className="overflow-x-auto rounded-lg ring-1 ring-foreground/10">
        <table className="w-full text-left text-xs">{children}</table>
      </div>
      {footnote ? (
        <p className="text-xs text-muted-foreground">{footnote}</p>
      ) : null}
    </figure>
  );
}

export function UsageEstimateInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="How we estimate data usage"
          />
        }
      >
        <Info className="size-4" aria-hidden />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How we estimate your data</DialogTitle>
          <DialogDescription>
            For each activity we estimate data from your daily hours and the
            rates below, then apply your travel style and sharing factor.
          </DialogDescription>
        </DialogHeader>

        <div className="scrollbar-slim -mx-4 max-h-[50vh] space-y-5 overflow-y-auto overscroll-contain px-4">
          <EstimateTable
            caption="Data per activity (per hour)"
            footnote="Hourly usage rates are based on data published on the Saily website."
          >
            <thead>
              <tr className="border-b border-foreground/10 bg-muted/40">
                <th className="px-3 py-2 font-medium">Activity</th>
                <th className="px-3 py-2 font-medium">Usage</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITY_USAGE_RATES.map(({ label, mbPerHour }) => (
                <tr
                  key={label}
                  className="border-b border-foreground/10 last:border-0"
                >
                  <td className="px-3 py-2">{label}</td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">
                    {formatUsageRatePerHour(mbPerHour)}
                  </td>
                </tr>
              ))}
            </tbody>
          </EstimateTable>

          <EstimateTable
            caption="Travel style multiplier"
            footnote="Applied to each activity's trip usage"
          >
            <thead>
              <tr className="border-b border-foreground/10 bg-muted/40">
                <th className="px-3 py-2 font-medium">Style</th>
                <th className="px-3 py-2 font-medium">Multiplier</th>
              </tr>
            </thead>
            <tbody>
              {TRAVELER_TYPES.map((type) => (
                <tr
                  key={type}
                  className="border-b border-foreground/10 last:border-0"
                >
                  <td className="px-3 py-2">{TRAVELER_TYPE_LABEL[type]}</td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">
                    {formatMultiplier(ARCHETYPE_MULTIPLIER[type])}
                  </td>
                </tr>
              ))}
            </tbody>
          </EstimateTable>

          <EstimateTable
            caption="Sharing factor (people on one plan)"
            footnote="Applied on top of travel style for each activity."
          >
            <thead>
              <tr className="border-b border-foreground/10 bg-muted/40">
                <th className="px-3 py-2 font-medium">Travelers</th>
                <th className="px-3 py-2 font-medium">Multiplier</th>
              </tr>
            </thead>
            <tbody>
              {DEVICES_NUMBERS.map((devices) => (
                <tr
                  key={devices}
                  className="border-b border-foreground/10 last:border-0"
                >
                  <td className="px-3 py-2">{SHARING_FACTOR_LABEL[devices]}</td>
                  <td className="px-3 py-2 tabular-nums text-muted-foreground">
                    {formatMultiplier(SHARING_MULTIPLIER[devices])}
                  </td>
                </tr>
              ))}
            </tbody>
          </EstimateTable>

          <p className="text-xs text-muted-foreground">
            Empty activity fields count as 0 hours. Per activity: (hours per day
            × data rate × trip days) × travel style × sharing factor. Trip total
            (GB) = sum of all adjusted activities shown in the chart.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
