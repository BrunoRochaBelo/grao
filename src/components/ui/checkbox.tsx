"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "./utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-1.5 border-border/60 bg-card data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary/35 aria-invalid:ring-destructive/15 dark:aria-invalid:ring-destructive/20 aria-invalid:border-destructive/50 h-5 w-5 shrink-0 rounded-md shadow-sm transition-all duration-300 cubic-bezier(0.25, 0.1, 0.25, 1) outline-none disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation hover:border-border/80 hover:shadow-md",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-transform duration-300 cubic-bezier(0.25, 0.1, 0.25, 1)"
      >
        <CheckIcon className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
