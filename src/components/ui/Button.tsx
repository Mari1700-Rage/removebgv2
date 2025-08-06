'use client'

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { Variants } from "framer-motion";
import { MotionProps, motion } from "framer-motion";
import React, { ForwardedRef, useState } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps &
  VariantProps<typeof buttonVariants> & {
    onStart?: () => void;
    className?: string;
  };

const pushButton: Variants = {
  unpressed: {
    scale: [null, 0.85, 1],
    opacity: 1,
  },
  pressed: {
    scale: 0.85,
    opacity: 0.7,
    transition: {
      type: "spring",
      duration: 0.3,
      bounce: 0.5,
    },
  },
};
const buttonVariants = cva(
  "inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        outline:
          "rounded-md border border-accent bg-foreground px-2 py-1 text-sm text-primary disabled:bg-foreground/50 disabled:text-primary/50",
        focus:
          "rounded-md border border-accent bg-accent px-2 py-1 text-sm text-primary disabled:bg-accent/50 disabled:text-primary/50",
        danger:
          "rounded-md border border-danger/20 bg-dangerForeground px-2 py-1 text-sm text-danger disabled:bg-dangerForeground/50 disabled:text-danger/50",
        warning:
          "rounded-md border border-warning/20 bg-warningForeground px-2 py-1 text-sm text-warning disabled:bg-warningForeground/50 disabled:text-warning/50",
        success:
          "rounded-md border border-success/20 bg-successForeground px-2 py-1 text-sm text-success disabled:bg-successForeground/50 disabled:text-success/50",
        action:
          "rounded-md border border-action/20 bg-actionForeground px-2 py-1 text-sm text-action disabled:bg-actionForeground/50 disabled:text-action/50",
      },
    },
  }
);

export const Button = React.forwardRef(
  (
    { className, variant, onStart, ...props }: Props,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const [pressing, setPressing] = useState(false);

    return (
      <motion.button
        ref={ref}
        variants={pushButton}
        initial={false}
        animate={pressing ? "pressed" : "unpressed"}
        transition={{ type: "spring", duration: 0.3, bounce: 0.5 }}
        onTapStart={() => {
          setPressing(true);
          onStart;
        }}
        onTap={() => {
          setPressing(false);
        }}
        onTapCancel={() => {
          setPressing(false);
        }}
        className={cn(buttonVariants({ variant, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button"

