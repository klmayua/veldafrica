"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as React from "react";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "gold" | "dark" | "light";
  hover?: boolean;
  children: React.ReactNode;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = true, children, ...props }, ref) => {
    const variants = {
      default: "bg-white/5 backdrop-blur-xl border border-white/10",
      gold: "bg-[#C9A227]/8 backdrop-blur-xl border border-[#C9A227]/20",
      dark: "bg-[#1B4D3E]/80 backdrop-blur-xl border border-[#2D6A4F]/30",
      light: "bg-white/90 backdrop-blur-xl border border-white/50",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-2xl overflow-hidden",
          variants[variant],
          className
        )}
        whileHover={
          hover
            ? {
                y: -4,
                boxShadow: "0 20px 40px rgba(27, 77, 62, 0.15)",
              }
            : undefined
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
