"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "bg-white/85 backdrop-blur-xl shadow-lg shadow-[#1B4D3E]/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-3 group">
            <Image
              src="/partners/VELD_Logo.png"
              alt="VELD AFRICA"
              width={600}
              height={150}
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="#contact"
              className={cn(
                "text-sm flex items-center gap-1.5 px-4 py-2 border rounded-full transition-all",
                isScrolled
                  ? "border-[#1B4D3E]/30 bg-[#1B4D3E]/5 text-[#1B4D3E] hover:bg-[#1B4D3E]/10"
                  : "border-white/40 bg-white/10 text-white hover:bg-white/20"
              )}
            >
              Contact Sales
            </Link>
            <Link
              href="#properties"
              className={cn(
                "text-sm font-semibold flex items-center gap-1.5 px-4 py-2 rounded-full transition-all",
                isScrolled
                  ? "bg-[#1B4D3E] text-white hover:bg-[#2D6A4F]"
                  : "bg-[#C9A227] text-white hover:bg-[#D4AF37]"
              )}
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </div>

      {/* Gradient separator — visible on scroll */}
      <div
        className={cn(
          "h-[1px] transition-opacity duration-300",
          isScrolled ? "opacity-100" : "opacity-0"
        )}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(27, 77, 62, 0.3) 30%, rgba(201, 162, 39, 0.2) 50%, rgba(27, 77, 62, 0.3) 70%, transparent)",
        }}
      />
    </header>
  );
}
