"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-[#1B4D3E] text-white hover:bg-[#2D6A4F] hover:shadow-lg hover:shadow-[#1B4D3E]/25 focus:ring-[#1B4D3E]",
      secondary:
        "bg-[#C9A227] text-white hover:bg-[#B8941F] hover:shadow-lg hover:shadow-[#C9A227]/25 focus:ring-[#C9A227]",
      outline:
        "border-2 border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white focus:ring-[#1B4D3E]",
      ghost:
        "text-[#1B4D3E] hover:bg-[#1B4D3E]/10 focus:ring-[#1B4D3E]",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...(props as any)}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
