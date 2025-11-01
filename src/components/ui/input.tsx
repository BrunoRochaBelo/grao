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
        "flex h-11 w-full min-w-0 rounded-lg border border-border bg-input-background px-4 py-2.5 text-base transition-all duration-150",
        "file:inline-flex file:h-9 file:border-0 file:bg-primary file:px-3 file:text-sm file:font-semibold file:text-primary-foreground file:cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "dark:bg-input-background dark:border-border/60 dark:placeholder:text-muted-foreground/70",
        className
      )}
      {...props}
    />
  );
}

export { Input };
