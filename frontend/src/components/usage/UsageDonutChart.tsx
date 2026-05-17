import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import type { ActivityKind } from "@backend/dto/recommendation.dto";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { TripUsageSummary } from "@/lib/usage-calculations";
import { formatTripDaysUnit } from "@/lib/wizard-form-utils";

const ACTIVITY_CHART_COLORS: Record<ActivityKind, string> = {
  socialMedia: "var(--chart-1)",
  streaming: "var(--chart-2)",
  workCalls: "var(--chart-3)",
  navigation: "var(--chart-4)",
  surfing: "var(--chart-5)",
};

const chartConfig = {
  usageGb: {
    label: "Data",
  },
  socialMedia: {
    label: "Social media",
    color: ACTIVITY_CHART_COLORS.socialMedia,
  },
  streaming: {
    label: "Streaming",
    color: ACTIVITY_CHART_COLORS.streaming,
  },
  workCalls: {
    label: "Work calls",
    color: ACTIVITY_CHART_COLORS.workCalls,
  },
  navigation: {
    label: "Navigation",
    color: ACTIVITY_CHART_COLORS.navigation,
  },
  surfing: {
    label: "Surfing",
    color: ACTIVITY_CHART_COLORS.surfing,
  },
} satisfies ChartConfig;

function formatCenterGb(gb: number): string {
  const rounded = Math.round(gb * 10) / 10;
  const value = Number.isInteger(rounded)
    ? String(rounded)
    : rounded.toFixed(1);
  return `${value} GB`;
}

type LabelCenterViewBox =
  | { cx: number; cy: number }
  | { x: number; y: number; width: number; height: number };

function getLabelCenter(
  viewBox: LabelCenterViewBox | undefined,
): { cx: number; cy: number } | null {
  if (!viewBox) {
    return null;
  }

  if ("cx" in viewBox) {
    return { cx: viewBox.cx, cy: viewBox.cy };
  }

  return {
    cx: viewBox.x + viewBox.width / 2,
    cy: viewBox.y + viewBox.height / 2,
  };
}

type UsageDonutChartProps = {
  summary: TripUsageSummary;
};

function UsageChartLegend({
  items,
  className,
}: {
  items: { activity: ActivityKind; label: string }[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "m-0 flex w-full flex-wrap justify-center gap-x-3 gap-y-1.5 list-none p-0",
        className,
      )}
      aria-label="Usage by activity"
    >
      {items.map(({ activity, label }) => (
        <li
          key={activity}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs"
        >
          <span
            className="size-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: ACTIVITY_CHART_COLORS[activity] }}
            aria-hidden
          />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}

export function UsageDonutChart({ summary }: UsageDonutChartProps) {
  const chartData = useMemo(
    () =>
      summary.breakdown
        .filter((row) => row.adjustedTripUsageGb > 0)
        .map((row) => ({
          activity: row.activity,
          usageGb: row.adjustedTripUsageGb,
          label: row.label,
          fill: `var(--color-${row.activity})`,
        })),
    [summary.breakdown],
  );

  const hasUsage = chartData.length > 0;

  const centerLabel = (viewBox: LabelCenterViewBox | undefined) => {
    const center = getLabelCenter(viewBox);
    if (!center) {
      return null;
    }

    const { cx, cy } = center;

    return (
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
        <tspan
          x={cx}
          y={cy - 7}
          className="fill-foreground text-xl font-semibold tabular-nums"
        >
          {formatCenterGb(summary.totalEstimatedGb)}
        </tspan>
        <tspan
          x={cx}
          y={cy + 11}
          className="fill-muted-foreground text-xs tabular-nums"
        >
          {summary.tripDays} {formatTripDaysUnit(summary.tripDays)}
        </tspan>
      </text>
    );
  };

  return (
    <div className="flex flex-col">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-auto h-[200px] w-full max-w-[220px] [&_.recharts-responsive-container]:!h-[200px]"
      >
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          {hasUsage ? (
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  nameKey="activity"
                  formatter={(value) => `${Number(value).toFixed(2)} GB`}
                />
              }
            />
          ) : null}
          <Pie
            data={
              hasUsage
                ? chartData
                : [{ activity: "empty", usageGb: 1, fill: "var(--muted)" }]
            }
            dataKey="usageGb"
            nameKey="activity"
            innerRadius={56}
            outerRadius={80}
            strokeWidth={4}
            isAnimationActive={hasUsage}
            cx="50%"
            cy="50%"
          >
            <Label content={({ viewBox }) => centerLabel(viewBox)} />
          </Pie>
        </PieChart>
      </ChartContainer>

      {hasUsage ? (
        <UsageChartLegend items={chartData} className="mt-2" />
      ) : null}
    </div>
  );
}
