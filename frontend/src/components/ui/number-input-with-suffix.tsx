import * as React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type NumberInputWithSuffixProps = React.ComponentProps<typeof Input> & {
  suffix: string
  containerClassName?: string
}

const NumberInputWithSuffix = React.forwardRef<
  HTMLInputElement,
  NumberInputWithSuffixProps
>(function NumberInputWithSuffix(
  { suffix, className, containerClassName, ...props },
  ref,
) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Input
        ref={ref}
        type="number"
        className={cn(
          "w-full pr-[5.25rem] md:pr-11",
          className,
        )}
        {...props}
      />
      <span
        className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-base text-muted-foreground md:text-sm"
        aria-hidden
      >
        {suffix}
      </span>
    </div>
  )
})

export { NumberInputWithSuffix }
