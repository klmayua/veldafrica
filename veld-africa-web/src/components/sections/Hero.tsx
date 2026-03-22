"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Home, Leaf, MapPin, TrendingUp } from "lucide-react";
import Image from "next/image";

const stats = [
  { value: "₦5B+", label: "Property Value Managed" },
  { value: "500+", label: "Happy Investors" },
  { value: "12+", label: "Cities Covered" },
  { value: "98%", label: "Client Satisfaction" },
];

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold"
            >
              <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
              <span className="text-[#C9A227] text-sm font-medium">Africa&apos;s Premier Property Gateway</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
            >
              Building
              <span className="block text-[#C9A227]">Generational Wealth</span>
              Through Property
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-[#D4C5B0] max-w-xl leading-relaxed"
            >
              VELD AFRICA bridges the gap between you and premium African real estate.
              From Lagos to Dubai, invest in verified properties that appreciate for generations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="group">
                Explore Properties
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                Watch Our Story
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-[#D4C5B0]">{stat.label}</div>
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
                className="glass rounded-3xl p-6 max-w-md mx-auto"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                    alt="Luxury Property"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full glass-light">
                    <MapPin className="w-4 h-4 text-[#1B4D3E]" />
                    <span className="text-sm font-medium text-[#1B4D3E]">Lekki, Lagos</span>
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#C9A227]">
                    <span className="text-sm font-bold text-white">Featured</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">Smart Luxury Villa</h3>
                  <div className="flex items-center gap-4 text-[#D4C5B0]">
                    <span className="flex items-center gap-1">
                      <Home className="w-4 h-4" /> 5 Beds
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" /> 4 Baths
                    </span>
                    <span className="flex items-center gap-1">
                      <Leaf className="w-4 h-4" /> Smart Home
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div>
                      <span className="text-sm text-[#D4C5B0]">Starting from</span>
                      <div className="text-2xl font-bold text-[#C9A227]">₦150M</div>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">+12%</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-8 -left-8 glass-light rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1B4D3E]/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#1B4D3E]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#1A1A1A]">Market Growth</div>
                    <div className="text-lg font-bold text-[#1B4D3E]">+23% YoY</div>
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
