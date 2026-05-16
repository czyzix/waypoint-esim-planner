import * as Flags from "country-flag-icons/react/1x1";
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

type FlagComponent = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

const flagsByCode = Flags as Record<string, FlagComponent | undefined>;

export function CountryFlag({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const Flag = flagsByCode[code.toUpperCase()];
  if (!Flag) return null;

  return (
    <span
      className={cn(
        "inline-flex size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-border/50",
        className,
      )}
      aria-hidden
    >
      <Flag className="size-full" />
    </span>
  );
}
