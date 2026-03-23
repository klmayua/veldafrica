"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Home, Leaf, MapPin, TrendingUp } from "lucide-react";
import Image from "next/image";

const stats = [
  { value: "N5B+", label: "Property Value" },
  { value: "500+", label: "Investors" },
  { value: "12+", label: "Cities" },
  { value: "98%", label: "Satisfaction" },
];

export function Hero() {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4D3E]/95 via-[#1B4D3E]/80 to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#D4C5B0]/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9A227]/10 backdrop-blur-xl border border-[#C9A227]/20"
            >
              <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
              <span className="text-[#C9A227] text-xs sm:text-sm font-medium">Africa&apos;s Premier Property Gateway</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1]"
            >
              Building
              <span className="block text-[#C9A227]">Generational Wealth</span>
              Through Property
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-[#D4C5B0] max-w-xl leading-relaxed"
            >
              VELD AFRICA bridges the gap between you and premium African real estate.
              From Lagos to Dubai, invest in verified properties that appreciate for generations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Button size="md" className="group">
                Explore Properties
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="md" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                Watch Our Story
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-4 gap-4 pt-6 border-t border-white/10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-[#D4C5B0]">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Property Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-3xl p-5 max-w-md mx-auto bg-white/8 backdrop-blur-2xl border border-white/15 shadow-2xl"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                    alt="Luxury Property"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xl border border-white/50">
                    <MapPin className="w-3.5 h-3.5 text-[#1B4D3E]" />
                    <span className="text-xs font-medium text-[#1B4D3E]">Lekki, Lagos</span>
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#C9A227] shadow-lg">
                    <span className="text-xs font-bold text-white">Featured</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Smart Luxury Villa</h3>
                  <div className="flex items-center gap-3 text-sm text-[#D4C5B0]">
                    <span className="flex items-center gap-1">
                      <Home className="w-3.5 h-3.5" /> 5 Beds
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> 4 Baths
                    </span>
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5" /> Smart Home
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div>
                      <span className="text-xs text-[#D4C5B0]">Starting from</span>
                      <div className="text-xl font-bold text-[#C9A227]">N150M</div>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+12%</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 rounded-xl p-3 shadow-xl bg-white/90 backdrop-blur-xl border border-white/50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-[#1B4D3E]/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#1B4D3E]" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#4A5568]">Market Growth</div>
                    <div className="text-base font-bold text-[#1B4D3E]">+23% YoY</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
