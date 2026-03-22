"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  properties: [
    { name: "Off-Plan Projects", href: "#" },
    { name: "Smart Apartments", href: "#" },
    { name: "Luxury Homes", href: "#" },
    { name: "Agro Real Estate", href: "#" },
    { name: "Commercial Spaces", href: "#" },
    { name: "Land Banking", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#about" },
    { name: "Our Team", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press & Media", href: "#" },
    { name: "Partners", href: "#" },
  ],
  resources: [
    { name: "The VELD Sessions", href: "#podcast" },
    { name: "The Gateway", href: "#newsletter" },
    { name: "Investment Guides", href: "#" },
    { name: "Market Reports", href: "#" },
    { name: "FAQ", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Disclaimer", href: "#" },
  ],
};

const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/ismail-abidemi-bethany-507064198" },
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/light_realtyofficial" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/@bethanythedesigningrealtor" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-[#1A1A1A] text-white">
      {/* CTA Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ready to Build Your
              <span className="text-[#C9A227]"> Legacy?</span>
            </h2>
            <p className="text-[#D4C5B0] mb-8">
              Let us guide you through your property investment journey.
              Schedule a consultation with our experts today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:hello@veldafrica.com"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C9A227] text-white font-medium hover:bg-[#B8941F] hover:shadow-lg hover:shadow-[#C9A227]/25 focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Schedule Consultation
              </a>
              <a
                href="tel:+2348000000000"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#1A1A1A] transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                Call Us Now
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="#home" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B4D3E] to-[#2D6A4F] flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="font-display text-2xl font-bold">VELD</span>
              <span className="font-display text-2xl font-bold text-[#C9A227]">AFRICA</span>
            </Link>
            <p className="text-[#D4C5B0] mb-6 max-w-xs">
              Building bridges between ambitious investors and Africa's most promising property opportunities.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] transition-all duration-300"
                    aria-label={`Visit ${social.name} profile`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Properties Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Properties</h3>
            <ul className="space-y-3">
              {footerLinks.properties.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#D4C5B0] hover:text-[#C9A227] focus:outline-none focus:text-[#C9A227] focus:underline transition-all text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#D4C5B0] hover:text-[#C9A227] focus:outline-none focus:text-[#C9A227] focus:underline transition-all text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[#D4C5B0] hover:text-[#C9A227] focus:outline-none focus:text-[#C9A227] focus:underline transition-all text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C9A227] flex-shrink-0 mt-0.5" />
                <span className="text-[#D4C5B0] text-sm">
                  123 Victoria Island, Lagos, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
                <a href="tel:+2348000000000" className="text-[#D4C5B0] text-sm hover:text-[#C9A227]">
                  +234 800 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
                <a href="mailto:hello@veldafrica.com" className="text-[#D4C5B0] text-sm hover:text-[#C9A227]">
                  hello@veldafrica.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#D4C5B0] text-sm">
              © {new Date().getFullYear()} VELD AFRICA. All rights reserved.
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[#D4C5B0] hover:text-[#C9A227] transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
