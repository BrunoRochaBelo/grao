import * as React from "react";

import { cn } from "./utils";

function Textarea({
  className,
  disabled,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      disabled={disabled}
      data-slot="textarea"
      className={cn(
        "resize-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "flex field-sizing-content min-h-24 w-full rounded-lg border border-border bg-input-background px-4 py-2.5 text-base transition-all duration-150",
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

export { Textarea };
