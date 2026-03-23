"use client";

import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";
import { ArrowRight, Check, Gift, Mail, Star, Zap } from "lucide-react";
import * as React from "react";

const benefits = [
  "Weekly market insights and exclusive property alerts",
  "First access to off-plan investment opportunities",
  "Diaspora investment guides and legal updates",
  "ROI calculators and investment tools",
  "Invitations to virtual and in-person events",
];

const testimonials = [
  {
    quote: "The VELD newsletter has been my go-to source for Nigerian real estate insights. I've made two investments based on their recommendations.",
    author: "Chidi Okonkwo",
    role: "Diaspora Investor, London",
  },
  {
    quote: "Finally, a newsletter that understands the diaspora perspective. The legal guides alone are worth the subscription.",
    author: "Amara Johnson",
    role: "First-time Investor, Atlanta",
  },
];

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section id="newsletter" className="py-10 sm:py-14 bg-gradient-to-br from-[#1B4D3E] to-[#0D2820] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#2D6A4F]/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A227]/10 backdrop-blur-xl border border-[#C9A227]/20 text-[#C9A227] text-sm font-medium mb-4">
                <Mail className="w-4 h-4" />
                The Gateway Newsletter
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
                Your Weekly
                <span className="text-[#C9A227]"> Investment Intelligence</span>
              </h2>
              <p className="text-lg text-[#D4C5B0] leading-relaxed">
                Join 5,000+ investors who receive exclusive market insights, property alerts,
                and diaspora investment guides delivered straight to their inbox every Tuesday.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-[#C9A227]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-[#C9A227]" />
                  </div>
                  <span className="text-[#D4C5B0]">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="grid sm:grid-cols-2 gap-4 pt-8 border-t border-white/10">
              {testimonials.map((testimonial, index) => (
                <GlassCard key={index} variant="default" className="p-4">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#C9A227]" fill="#C9A227" />
                    ))}
                  </div>
                  <p className="text-sm text-[#D4C5B0] mb-3 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="text-white font-medium text-sm">{testimonial.author}</div>
                    <div className="text-[#D4C5B0] text-xs">{testimonial.role}</div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard variant="light" className="p-6 sm:p-8">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-[#1B4D3E]/10 flex items-center justify-center mx-auto mb-4">
                      <Gift className="w-8 h-8 text-[#1B4D3E]" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-[#1A1A1A] mb-2">
                      Get Your Free Guide
                    </h3>
                    <p className="text-[#4A5568]">
                      Subscribe and receive our "Diaspora Investment Checklist" instantly
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-[#1B4D3E]/20 focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-[#1B4D3E]/20 focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Location
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-[#1B4D3E]/20 focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 outline-none transition-all bg-white"
                        required
                      >
                        <option value="">Select your location</option>
                        <option value="nigeria">Nigeria</option>
                        <option value="uk">United Kingdom</option>
                        <option value="us">United States</option>
                        <option value="uae">UAE</option>
                        <option value="canada">Canada</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isSubmitting}
                  >
                    Subscribe Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>

                  <p className="text-xs text-center text-[#4A5568]">
                    No spam, ever. Unsubscribe anytime. Read our{" "}
                    <a href="#" className="text-[#1B4D3E] underline hover:text-[#C9A227]">Privacy Policy</a>
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#1A1A1A] mb-4">
                    Welcome to VELD!
                  </h3>
                  <p className="text-[#4A5568] mb-6">
                    Check your inbox for your free Diaspora Investment Checklist and your first newsletter.
                  </p>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    Subscribe Another Email
                  </Button>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
