"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { Award, Building2, Shield, Users } from "lucide-react";
import Image from "next/image";

const trustIndicators = [
  { name: "Land Bureau", icon: Building2, description: "Government verified land titles" },
  { name: "Investment Partners", icon: Users, description: "Trusted by leading investors" },
  { name: "Legal Alliance", icon: Shield, description: "Comprehensive legal protection" },
  { name: "Quality Assured", icon: Award, description: "Premium property standards" },
];

const partnerLogos = [
  { name: "Partner 1", src: "/partners/Assets/IMG_5309.PNG" },
  { name: "Partner 2", src: "/partners/Assets/IMG_5312.PNG" },
  { name: "Partner 3", src: "/partners/Assets/IMG_5313.PNG" },
  { name: "Partner 4", src: "/partners/Assets/IMG_5314.PNG" },
  { name: "Partner 5", src: "/partners/Assets/IMG_5315.PNG" },
  { name: "Partner 6", src: "/partners/Assets/IMG_5320.PNG" },
];

export function Partners() {
  return (
    <section className="py-20 bg-[#FAF9F6]" aria-labelledby="partners-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] text-sm font-medium mb-4">
            Trusted Collaborations
          </span>
          <h2
            id="partners-heading"
            className="font-display text-3xl sm:text-4xl font-bold text-[#1A1A1A]"
          >
            Our<span className="text-[#C9A227]"> Partners</span>
          </h2>
          <p className="mt-4 text-lg text-[#4A5568] max-w-2xl mx-auto">
            Collaborating with industry leaders to deliver exceptional real estate investment opportunities
          </p>
        </motion.div>

        {/* Partner Logos - Marquee Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 overflow-hidden"
        >
          <GlassCard variant="light" className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {partnerLogos.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-center"
                >
                  <div className="relative w-full h-20 rounded-xl bg-white border border-[#1B4D3E]/10 flex items-center justify-center hover:border-[#C9A227]/50 hover:shadow-lg transition-all duration-300 group p-4">
                    <Image
                      src={partner.src}
                      alt={`${partner.name} logo`}
                      width={120}
                      height={60}
                      className="object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => {
                        // Fallback if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `<span class="text-lg font-bold text-[#1B4D3E]/40">${partner.name}</span>`;
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Trust Indicators */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustIndicators.map((indicator, index) => {
            const Icon = indicator.icon;
            return (
              <motion.div
                key={indicator.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <GlassCard
                  variant="light"
                  className="p-6 text-center group hover:border-[#C9A227]/30 hover:shadow-lg transition-all duration-300 h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#1B4D3E]/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#1B4D3E]/10 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7 text-[#1B4D3E]" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#1A1A1A] mb-2">{indicator.name}</h3>
                  <p className="text-sm text-[#4A5568]">
                    {indicator.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-[#4A5568] mb-4">
            Interested in partnering with VELD AFRICA?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1B4D3E] text-white font-medium hover:bg-[#2D6A4F] transition-colors"
          >
            Become a Partner
          </a>
        </motion.div>
      </div>
    </section>
  );
}
