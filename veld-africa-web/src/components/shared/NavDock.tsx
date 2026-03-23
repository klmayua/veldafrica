"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Building2, Users, Headphones, Mail, Menu, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";

const navLinks = [
  { name: "Home", href: "#home", icon: Home },
  { name: "Properties", href: "#properties", icon: Building2 },
  { name: "About", href: "#about", icon: Users },
  { name: "Podcast", href: "#podcast", icon: Headphones },
  { name: "Newsletter", href: "#newsletter", icon: Mail },
];

export function NavDock() {
  const [isOpen, setIsOpen] = React.useState(false);
  const dockRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={dockRef} className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      {/* Expanded Nav Items - fans out above the button */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-16 flex flex-col gap-1.5"
          >
            {navLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 20, y: 10 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 pl-4 pr-5 py-2 rounded-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg shadow-[#1B4D3E]/10 hover:bg-white hover:shadow-xl hover:border-[#C9A227]/30 transition-all duration-200 group whitespace-nowrap"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#1B4D3E]/8 flex items-center justify-center group-hover:bg-[#C9A227]/15 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-[#1B4D3E] group-hover:text-[#C9A227] transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-[#1A1A1A]">{link.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock Toggle Button - sits to the LEFT of the chat icon */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className={cn(
          "w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300",
          "backdrop-blur-xl border",
          isOpen
            ? "bg-[#C9A227] text-white border-[#C9A227]/50 shadow-[#C9A227]/30"
            : "bg-white/80 text-[#1B4D3E] border-white/60 hover:bg-white hover:shadow-xl"
        )}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Menu className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
