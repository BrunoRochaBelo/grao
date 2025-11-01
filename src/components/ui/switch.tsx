"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary/35 dark:data-[state=unchecked]:bg-input/70 inline-flex h-7 w-12 shrink-0 items-center rounded-full border-1.5 border-transparent transition-all duration-300 cubic-bezier(0.25, 0.1, 0.25, 1) outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md touch-manipulation",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block h-6 w-6 rounded-full shadow-soft transition-all duration-300 cubic-bezier(0.25, 0.1, 0.25, 1) data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-[2px]"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
