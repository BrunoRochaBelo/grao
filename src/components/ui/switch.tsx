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
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:data-[state=unchecked]:bg-muted/80 inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-all duration-200 ease-out outline-none disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md active:scale-95 cursor-pointer min-w-[44px] min-h-[44px] p-2",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-white dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block h-5 w-5 rounded-full shadow-lg transition-all duration-200 ease-out data-[state=checked]:translate-x-[21px] data-[state=unchecked]:translate-x-[2px] data-[state=checked]:scale-110"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
