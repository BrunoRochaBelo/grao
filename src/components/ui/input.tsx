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
        "file:text-foreground placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground",
        "flex h-11 w-full min-w-0 rounded-lg border-1.5 border-border/60 bg-input-background px-4 py-3 text-base transition-all duration-250 cubic-bezier(0.25, 0.1, 0.25, 1)",
        "file:inline-flex file:h-9 file:border-0 file:bg-primary file:px-3 file:text-sm file:font-semibold file:text-primary-foreground file:cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary/35 focus-visible:border-primary/40",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        "aria-invalid:border-destructive/50 aria-invalid:ring-destructive/15 dark:aria-invalid:ring-destructive/20",
        "dark:bg-input-background dark:border-border/50 dark:placeholder:text-muted-foreground/60",
        "hover:border-border/80 transition-colors",
        className
      )}
      {...props}
    />
  );
}

export { Input };
