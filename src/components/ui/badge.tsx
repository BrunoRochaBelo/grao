import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3.5 gap-1.5 [&>svg]:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary/40 aria-invalid:ring-destructive/15 dark:aria-invalid:ring-destructive/20 aria-invalid:border-destructive/50 transition-all duration-250 cubic-bezier(0.25, 0.1, 0.25, 1) overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90 shadow-sm hover:shadow-md",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 shadow-sm hover:shadow-md",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/30 dark:focus-visible:ring-destructive/35 shadow-sm",
        outline:
          "border-1.5 border-border/60 bg-card text-foreground [a&]:hover:bg-muted/40 [a&]:hover:text-foreground hover:border-border/80",
        success:
          "border-1.5 bg-success/12 text-success border-success/30 [a&]:hover:bg-success/15",
        warning:
          "border-1.5 bg-warning/12 text-warning border-warning/30 [a&]:hover:bg-warning/15",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
