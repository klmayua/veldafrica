"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Home, Leaf, MapPin, TrendingUp } from "lucide-react";
import Image from "next/image";
import * as React from "react";

// Property card image component with loading state
function PropertyImage({ src, alt }: { src: string; alt: string }) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  return (
    <>
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-[#1B4D3E]/5 animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#1B4D3E]/10 flex items-center justify-center">
            <Home className="w-6 h-6 text-[#1B4D3E]/30" />
          </div>
        </div>
      )}
      {hasError ? (
        <div className="absolute inset-0 bg-[#1B4D3E]/5 flex items-center justify-center">
          <div className="text-center">
            <Home className="w-12 h-12 text-[#1B4D3E]/30 mx-auto mb-2" />
            <span className="text-sm text-[#4A5568]/60">Image unavailable</span>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn(
            "object-cover transition-all duration-500 group-hover:scale-110",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </>
  );
}

const categories = [
  { id: "all", name: "All Properties", icon: Building2 },
  { id: "residential", name: "Residential", icon: Home },
  { id: "commercial", name: "Commercial", icon: Building2 },
  { id: "agro", name: "Agro Real Estate", icon: Leaf },
  { id: "offplan", name: "Off-Plan", icon: TrendingUp },
];

const properties = [
  {
    id: 1,
    title: "Palm Grove Estate",
    category: "agro",
    location: "Epe, Lagos",
    price: "₦5M",
    roi: "18%",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600",
    beds: null,
    baths: null,
    area: "1 hectare",
    tag: "Agro Investment",
    description: "Premium palm oil plantation with guaranteed returns",
  },
  {
    id: 2,
    title: "The Azure Collection",
    category: "offplan",
    location: "Lekki Phase 1, Lagos",
    price: "₦85M",
    roi: "25%",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600",
    beds: 3,
    baths: 3,
    area: "240 sqm",
    tag: "Off-Plan",
    description: "Modern waterfront apartments with smart home features",
  },
  {
    id: 3,
    title: "Dubai Marina Heights",
    category: "residential",
    location: "Dubai Marina, UAE",
    price: "$450K",
    roi: "8%",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",
    beds: 2,
    baths: 2,
    area: "120 sqm",
    tag: "International",
    description: "Luxury apartments with panoramic marina views",
  },
  {
    id: 4,
    title: "FarmVille Estates",
    category: "agro",
    location: "Ibeju-Lekki, Lagos",
    price: "₦3M",
    roi: "15%",
    image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600",
    beds: null,
    baths: null,
    area: "5 plots",
    tag: "We Farm, You Earn",
    description: "Managed farmland with quarterly dividend payouts",
  },
  {
    id: 5,
    title: "Victoria Island Towers",
    category: "commercial",
    location: "Victoria Island, Lagos",
    price: "₦450M",
    roi: "12%",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
    beds: null,
    baths: null,
    area: "2,000 sqm",
    tag: "Commercial",
    description: "Prime office space in Lagos business district",
  },
  {
    id: 6,
    title: "Mabushi Smart Homes",
    category: "residential",
    location: "Mabushi, Abuja",
    price: "₦120M",
    roi: "20%",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    beds: 5,
    baths: 4,
    area: "500 sqm",
    tag: "Smart Living",
    description: "Fully automated luxury duplex with IoT integration",
  },
];

export function Properties() {
  const [activeCategory, setActiveCategory] = React.useState("all");

  const filteredProperties =
    activeCategory === "all"
      ? properties
      : properties.filter((p) => p.category === activeCategory);

  return (
    <section id="properties" className="py-24 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] text-sm font-medium mb-4">
            Our Portfolio
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-[#1A1A1A] mb-4">
            Investment<span className="text-[#C9A227]"> Opportunities</span>
          </h2>
          <p className="text-lg text-[#4A5568] max-w-2xl mx-auto">
            Explore our curated selection of premium properties across Africa and beyond.
            From smart homes to agro-investments, find your perfect asset.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                aria-pressed={activeCategory === category.id}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2",
                  activeCategory === category.id
                    ? "bg-[#1B4D3E] text-white shadow-lg shadow-[#1B4D3E]/25"
                    : "bg-white text-[#4A5568] hover:bg-[#1B4D3E]/5 border border-[#1B4D3E]/10"
                )}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </motion.div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard
                variant="light"
                className="h-full group cursor-pointer focus-within:ring-2 focus-within:ring-[#C9A227] focus-within:ring-offset-2 rounded-2xl"
                role="article"
                aria-label={`${property.title} in ${property.location}`}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <PropertyImage src={property.image} alt={property.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#C9A227] text-white text-xs font-bold">
                      {property.tag}
                    </span>
                  </div>

                  {/* ROI Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full glass text-white">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs font-bold">{property.roi} ROI</span>
                  </div>

                  {/* Location */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#1B4D3E] transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-sm text-[#4A5568] mb-4">{property.description}</p>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-sm text-[#4A5568] mb-4">
                    {property.beds && (
                      <span className="flex items-center gap-1">
                        <Home className="w-4 h-4" /> {property.beds} Beds
                      </span>
                    )}
                    {property.baths && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" /> {property.baths} Baths
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Leaf className="w-4 h-4" /> {property.area}
                    </span>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#1B4D3E]/10">
                    <div>
                      <span className="text-xs text-[#4A5568]">Starting from</span>
                      <div className="text-2xl font-bold text-[#1B4D3E]">{property.price}</div>
                    </div>
                    <button
                      className="flex items-center gap-1 text-sm font-medium text-[#1B4D3E] hover:text-[#C9A227] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 rounded-lg px-2 py-1"
                      aria-label={`View details for ${property.title}`}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1B4D3E] text-white font-medium hover:bg-[#2D6A4F] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-4 hover:shadow-lg hover:shadow-[#1B4D3E]/25 hover:-translate-y-0.5"
            aria-label="View all properties"
          >
            View All Properties
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
