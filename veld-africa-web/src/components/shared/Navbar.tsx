"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Mail, Menu, Newspaper, Phone, Users, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

const navLinks = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Properties", href: "#properties", icon: Home },
  { name: "About", href: "#about", icon: Users },
  { name: "Podcast", href: "#podcast", icon: Phone },
  { name: "Newsletter", href: "#newsletter", icon: Newspaper },
  { name: "Contact", href: "#contact", icon: Mail },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-[#FAF9F6]/90 backdrop-blur-xl shadow-lg"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="#home" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B4D3E] to-[#2D6A4F] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <div className={cn(
                "transition-colors duration-300",
                isScrolled ? "text-[#1B4D3E]" : "text-white"
              )}>
                <span className="font-display text-2xl font-bold">VELD</span>
                <span className="font-display text-2xl font-bold text-[#C9A227]">AFRICA</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "font-medium transition-colors relative group",
                    isScrolled
                      ? "text-[#1A1A1A] hover:text-[#1B4D3E]"
                      : "text-white/90 hover:text-white"
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                    isScrolled ? "bg-[#C9A227]" : "bg-white"
                  )} />
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <Button size="sm">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
                isScrolled
                  ? "text-[#1A1A1A] hover:bg-[#1B4D3E]/10"
                  : "text-white hover:bg-white/10"
              )}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-2xl focus:outline-none"
              tabIndex={-1}
            >
              <!-- Close Button -->
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-[#4A5568] hover:text-[#1A1A1A] hover:bg-[#1B4D3E]/10 rounded-lg transition-colors z-10"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>

              <div className="p-6 pt-20">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1B4D3E]/5 transition-colors"
                        >
                          <Icon className="w-5 h-5 text-[#1B4D3E]" />
                          <span className="font-medium text-[#1A1A1A]">{link.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-8">
                  <Button className="w-full">Get Started</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
