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
        "resize-none placeholder:text-muted-foreground/70 selection:bg-primary selection:text-primary-foreground",
        "flex field-sizing-content min-h-24 w-full rounded-lg border-1.5 border-border/60 bg-input-background px-4 py-3 text-base transition-all duration-250 cubic-bezier(0.25, 0.1, 0.25, 1)",
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

export { Textarea };
