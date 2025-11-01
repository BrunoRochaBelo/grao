import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive touch-manipulation active:scale-[0.98] hover:scale-[1.02] active:brightness-95",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-primary-light text-primary-foreground hover:shadow-lg hover:shadow-primary/30 shadow-md dark:bg-primary dark:hover:bg-primary-light dark:hover:shadow-primary/20 focus-visible:ring-2 focus-visible:ring-primary/50",
        destructive:
          "bg-destructive hover:bg-destructive/90 text-destructive-foreground hover:shadow-lg hover:shadow-destructive/30 shadow-md focus-visible:outline-destructive/50 focus-visible:ring-2 focus-visible:ring-destructive/50 dark:bg-destructive dark:hover:bg-destructive/90",
        outline:
          "border-2 border-primary text-primary bg-transparent hover:bg-primary/5 active:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/50",
        secondary:
          "bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:shadow-lg hover:shadow-secondary/30 shadow-md focus-visible:ring-2 focus-visible:ring-secondary/50 dark:bg-secondary dark:hover:bg-secondary/90",
        ghost:
          "text-foreground hover:bg-muted active:bg-muted/80 dark:text-foreground dark:hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-primary/30",
        link: "text-primary underline-offset-4 hover:underline active:opacity-75 text-base dark:text-primary-light focus-visible:ring-2 focus-visible:ring-primary/30",
      },
      size: {
        default: "h-11 px-6 py-3 text-sm min-h-11 min-w-11 has-[>svg]:px-4",
        sm: "h-9 rounded-md gap-1.5 px-4 py-2 text-xs has-[>svg]:px-3 min-h-9 min-w-9",
        lg: "h-12 rounded-lg px-8 py-3 text-base has-[>svg]:px-5 min-h-12 min-w-12",
        icon: "h-11 w-11 rounded-lg p-2.5 min-h-11 min-w-11",
        "icon-sm": "h-9 w-9 rounded-md p-2 min-h-9 min-w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
