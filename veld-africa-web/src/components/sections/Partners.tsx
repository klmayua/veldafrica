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
  { name: "Partner 1", src: "/partners/IMG_5309.png" },
  { name: "Partner 2", src: "/partners/IMG_5312.png" },
  { name: "Partner 3", src: "/partners/IMG_5313.png" },
  { name: "Partner 4", src: "/partners/IMG_5314.png" },
  { name: "Partner 5", src: "/partners/IMG_5315.png" },
  { name: "Partner 6", src: "/partners/IMG_5320.png" },
  { name: "Partner 7", src: "/partners/IMG_5327.png" },
];

const scrollingLogos = [...partnerLogos, ...partnerLogos];

export function Partners() {
  return (
    <section className="py-10 sm:py-12 bg-[#FAF9F6]" aria-labelledby="partners-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] text-sm font-medium mb-3">
            Trusted Collaborations
          </span>
          <h2
            id="partners-heading"
            className="font-display text-3xl sm:text-4xl font-bold text-[#1A1A1A]"
          >
            Our<span className="text-[#C9A227]"> Partners</span>
          </h2>
          <p className="mt-3 text-base text-[#4A5568] max-w-2xl mx-auto">
            Collaborating with industry leaders to deliver exceptional real estate investment opportunities
          </p>
        </motion.div>

        {/* Partner Logos - Infinite Scrolling Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 overflow-hidden"
        >
          <div className="relative rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 py-6 overflow-hidden">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee whitespace-nowrap">
              {scrollingLogos.map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="inline-flex items-center justify-center mx-6 flex-shrink-0"
                >
                  <div className="relative w-36 h-16 rounded-xl flex items-center justify-center hover:scale-105 transition-transform duration-300 group p-3">
                    <Image
                      src={partner.src}
                      alt={`${partner.name} logo`}
                      width={130}
                      height={60}
                      className="object-contain mix-blend-multiply opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `<span class="text-lg font-bold text-[#1B4D3E]/40">${partner.name}</span>`;
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <style jsx global>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* Trust Indicators */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 p-5 text-center group hover:border-[#C9A227]/30 hover:shadow-lg hover:shadow-[#C9A227]/5 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#1B4D3E]/5 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#1B4D3E]/10 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 text-[#1B4D3E]" />
                  </div>
                  <h3 className="font-display text-base font-bold text-[#1A1A1A] mb-1.5">{indicator.name}</h3>
                  <p className="text-sm text-[#4A5568] leading-relaxed">
                    {indicator.description}
                  </p>
                </div>
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
          className="mt-8 text-center"
        >
          <p className="text-[#4A5568] mb-3 text-sm">
            Interested in partnering with VELD AFRICA?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1B4D3E] text-white text-sm font-medium hover:bg-[#2D6A4F] transition-colors"
          >
            Become a Partner
          </a>
        </motion.div>
      </div>
    </section>
  );
}
