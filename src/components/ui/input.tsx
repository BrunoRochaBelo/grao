import * as React from "react";

import { cn } from "./utils";

function Input({
  className,
  type,
  disabled,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      disabled={disabled}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "flex h-11 w-full min-w-0 rounded-lg border-2 border-border bg-input-background px-3.5 py-2.5 text-base transition-all duration-200",
        "file:inline-flex file:h-9 file:border-0 file:bg-primary file:px-3 file:text-sm file:font-semibold file:text-primary-foreground file:cursor-pointer file:rounded-md file:hover:bg-primary-light",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary hover:border-primary/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30 dark:aria-invalid:ring-destructive/50 aria-invalid:focus-visible:ring-destructive/50",
        "dark:bg-input-background dark:border-border dark:placeholder:text-muted-foreground",
        "min-h-[44px]", // WCAG AAA touch target
        className
      )}
      {...props}
    />
  );
}

export { Input };
