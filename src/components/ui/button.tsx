import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-300 cubic-bezier(0.25, 0.1, 0.25, 1) disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive touch-manipulation active:scale-99 hover:scale-101",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-soft dark:bg-primary dark:hover:bg-primary/95 focus-visible:ring-primary/40",
        destructive:
          "bg-destructive hover:bg-destructive/90 text-destructive-foreground hover:shadow-soft dark:bg-destructive dark:hover:bg-destructive/95 focus-visible:ring-destructive/40",
        outline:
          "border-1.5 border-border text-foreground bg-transparent hover:bg-foreground/3 active:bg-foreground/6 focus-visible:ring-primary/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-soft dark:bg-secondary dark:hover:bg-secondary/95 focus-visible:ring-secondary/40",
        ghost:
          "text-foreground hover:bg-foreground/6 active:bg-foreground/12 dark:text-foreground dark:hover:bg-foreground/8 focus-visible:ring-primary/30",
        link: "text-primary underline-offset-4 hover:underline active:opacity-75 text-base dark:text-primary focus-visible:ring-primary/30",
      },
      size: {
        default: "h-11 px-6 py-3 text-sm min-h-11 min-w-11 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-4 py-2 text-xs has-[>svg]:px-3 min-h-9 min-w-9",
        lg: "h-12 rounded-xl px-8 py-3 text-base has-[>svg]:px-5 min-h-12 min-w-12",
        icon: "h-11 w-11 rounded-xl p-2.5 min-h-11 min-w-11",
        "icon-sm": "h-9 w-9 rounded-lg p-2 min-h-9 min-w-9",
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
