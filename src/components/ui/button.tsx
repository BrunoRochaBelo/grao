import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import "./button.css";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-150 cubic-bezier(0.4, 0, 0.2, 1) disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive touch-manipulation active:scale-95",
  {
    variants: {
      variant: {
        default: "btn-default",
        destructive: "btn-destructive",
        outline:
          "border-2 border-current text-foreground bg-transparent hover:bg-foreground/5 active:bg-foreground/10",
        secondary: "btn-secondary",
        ghost:
          "text-foreground hover:bg-foreground/10 active:bg-foreground/20 dark:text-foreground dark:hover:bg-foreground/5",
        link: "text-primary underline-offset-4 hover:underline active:opacity-75 text-base",
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
