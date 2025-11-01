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
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:data-[state=unchecked]:bg-input/60 inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block h-5 w-5 rounded-full shadow-md transition-transform duration-200 data-[state=checked]:translate-x-[21px] data-[state=unchecked]:translate-x-[2px]"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
