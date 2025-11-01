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
        "flex field-sizing-content min-h-24 w-full rounded-lg border-2 border-border bg-input-background px-3.5 py-2.5 text-base transition-all duration-200 leading-relaxed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary hover:border-primary/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/30 dark:aria-invalid:ring-destructive/50 aria-invalid:focus-visible:ring-destructive/50",
        "dark:bg-input-background dark:border-border dark:placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
