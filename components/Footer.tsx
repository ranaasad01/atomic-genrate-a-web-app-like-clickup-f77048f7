"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { footerLinks, APP_NAME, APP_TAGLINE } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { Sparkles, Code2 as Github, MessageCircle as Twitter, Briefcase as Linkedin } from 'lucide-react';

const socialLinks = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer className="bg-[#1E1E2E] text-white/70 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12"
        >
          {/* Brand Column */}
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            className="lg:col-span-2"
          >
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                {APP_NAME}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs mb-6">
              {APP_TAGLINE} — The modern project management platform that brings
              your team's work into one place.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.12, y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-white/60 hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <motion.div
              key={section.section}
              variants={shouldReduceMotion ? {} : fadeInUp}
            >
              <h3 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
                {section.section}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={shouldReduceMotion ? {} : fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-white/30">
            <span>Built with</span>
            <span className="text-[#FF6B6B] mx-0.5">♥</span>
            <span>for productive teams everywhere</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}