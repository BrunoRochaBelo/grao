"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "./utils";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-muted relative h-2.5 w-full overflow-hidden rounded-full shadow-inner",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-gradient-to-r from-primary via-primary-light to-primary h-full w-full flex-1 transition-all duration-700 ease-out rounded-full shadow-lg"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          boxShadow: "0 0 8px rgba(80, 66, 216, 0.4)",
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
