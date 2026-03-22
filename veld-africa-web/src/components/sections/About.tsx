"use client";

import { motion } from "framer-motion";
import { Building2, Globe2, Shield, Users } from "lucide-react";
import Image from "next/image";

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "Every property verified, every transaction recorded. We build relationships on the foundation of honesty.",
  },
  {
    icon: Globe2,
    title: "Global Access",
    description: "Invest in African real estate from anywhere in the world. Distance is no longer a barrier to ownership.",
  },
  {
    icon: Building2,
    title: "Quality Assets",
    description: "We curate only premium properties with high appreciation potential and strong rental yields.",
  },
  {
    icon: Users,
    title: "Community Building",
    description: "We don't just sell properties; we build communities of investors shaping Africa's future.",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-gradient-to-br from-[#1B4D3E] to-[#1B4332] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full glass-gold text-[#C9A227] text-sm font-medium mb-4">
                About VELD
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
                Building Bridges to
                <span className="block text-[#C9A227]">Generational Wealth</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-[#D4C5B0] leading-relaxed"
            >
              VELD AFRICA is more than a real estate company. We are the bridge between ambitious investors
              and Africa's most promising property opportunities. From the diaspora to the continent,
              we enable borderless investment in verified, high-yield assets.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-[#D4C5B0] leading-relaxed"
            >
              Our portfolio spans smart residential developments, commercial properties, agro-real estate,
              and international opportunities in Dubai. Every project is selected for its potential
              to deliver exceptional returns and lasting value.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-6 pt-8"
            >
              {[
                { value: "2019", label: "Founded" },
                { value: "₦5B+", label: "Assets Managed" },
                { value: "500+", label: "Investors" },
                { value: "12", label: "Cities" },
              ].map((stat, index) => (
                <div key={stat.label} className="glass rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-[#D4C5B0]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Values Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="glass rounded-2xl p-6 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#C9A227]/20 flex items-center justify-center mb-4 group-hover:bg-[#C9A227]/30 transition-colors">
                    <Icon className="w-6 h-6 text-[#C9A227]" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-[#D4C5B0] leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
