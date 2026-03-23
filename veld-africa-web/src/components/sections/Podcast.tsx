"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { Headphones, Play, Clock, Calendar, ArrowRight, Mic2, Users } from "lucide-react";
import Image from "next/image";

const episodes = [
  {
    id: 1,
    title: "The Diaspora Investment Playbook",
    description: "How to build a Nigerian property portfolio from abroad with confidence and security.",
    duration: "45 min",
    date: "Mar 15, 2024",
    host: "Ismail Abidemi Bethany",
    guest: "Dr. Amina Yusuf",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400",
    category: "Investment Strategy",
  },
  {
    id: 2,
    title: "Smart Homes: The Future of African Living",
    description: "Exploring IoT, automation, and sustainable architecture in modern African homes.",
    duration: "38 min",
    date: "Mar 8, 2024",
    host: "Ismail Abidemi Bethany",
    guest: "Engr. Chuka Okafor",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400",
    category: "Technology",
  },
  {
    id: 3,
    title: "Agro-Real Estate: Farm to Fortune",
    description: "Understanding the mechanics and returns of agricultural property investments.",
    duration: "52 min",
    date: "Mar 1, 2024",
    host: "Ismail Abidemi Bethany",
    guest: "Prof. Ibrahim Danjuma",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400",
    category: "Agro Investment",
  },
];

const platforms = [
  { name: "Spotify", color: "#1DB954" },
  { name: "Apple Podcasts", color: "#9933FF" },
  { name: "YouTube", color: "#FF0000" },
  { name: "Google Podcasts", color: "#4285F4" },
];

export function Podcast() {
  return (
    <section id="podcast" className="py-10 sm:py-14 bg-[#FAF9F6] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B4D3E]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#C9A227]/10 text-[#C9A227] text-sm font-medium mb-4">
              The VELD Sessions
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
              Listen.<span className="text-[#1B4D3E]">Learn.</span>Invest.
            </h2>
            <p className="text-lg text-[#4A5568] max-w-lg">
              Weekly conversations with industry experts, successful investors, and thought leaders
              in African real estate and wealth building.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-4 lg:justify-end"
          >
            {platforms.map((platform) => (
              <button
                key={platform.name}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow border border-[#1B4D3E]/10"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: platform.color }}
                />
                <span className="text-sm font-medium text-[#1A1A1A]">{platform.name}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Featured Episode */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <GlassCard variant="dark" className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square md:aspect-auto">
                <Image
                  src={episodes[0].image}
                  alt={episodes[0].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1B4D3E]/90 md:bg-gradient-to-r md:from-transparent md:to-[#1B4D3E]" />
                <button className="absolute inset-0 flex items-center justify-center group">
                  <div className="w-20 h-20 rounded-full bg-[#C9A227] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </button>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#C9A227]/20 text-[#C9A227] text-sm font-medium">
                    Latest Episode
                  </span>
                  <span className="px-3 py-1 rounded-full glass text-white text-sm">
                    {episodes[0].category}
                  </span>
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
                  {episodes[0].title}
                </h3>
                <p className="text-[#D4C5B0] mb-6 leading-relaxed">{episodes[0].description}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm text-[#D4C5B0] mb-8">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {episodes[0].duration}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {episodes[0].date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> {episodes[0].guest}
                  </span>
                </div>
                <button className="inline-flex items-center gap-2 text-[#C9A227] font-medium hover:gap-3 transition-all">
                  Listen Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Episode Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {episodes.slice(1).map((episode, index) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard variant="light" className="h-full group">
                <div className="flex gap-6 p-6">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={episode.image}
                      alt={episode.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white" fill="white" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-[#C9A227] uppercase tracking-wider">
                      {episode.category}
                    </span>
                    <h4 className="font-display text-lg font-bold text-[#1A1A1A] mt-1 mb-2 group-hover:text-[#1B4D3E] transition-colors">
                      {episode.title}
                    </h4>
                    <p className="text-sm text-[#4A5568] mb-3 line-clamp-2">{episode.description}</p>
                    <div className="flex items-center gap-4 text-xs text-[#4A5568]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {episode.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {episode.date}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Subscribe CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-[#4A5568] mb-4">
            Subscribe to get new episodes delivered to your inbox
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1B4D3E] text-white font-medium hover:bg-[#2D6A4F] transition-colors">
              <Mic2 className="w-5 h-5" />
              Subscribe on Spotify
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#1B4D3E] text-[#1B4D3E] font-medium hover:bg-[#1B4D3E] hover:text-white transition-colors">
              <Headphones className="w-5 h-5" />
              Apple Podcasts
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
