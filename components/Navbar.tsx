"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { navLinks, APP_NAME } from "@/lib/data";
import { Menu, X, Sparkles, Bell, Search } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-[#1E1E2E]/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-[#1E1E2E]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={shouldReduceMotion ? {} : { rotate: 15, scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center shadow-md"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-white font-bold text-xl tracking-tight">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 block cursor-pointer ${
                      isActive
                        ? "text-white bg-white/10"
                        : "text-white/70 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-lg bg-white/10 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </motion.button>
            <Link href="/notifications">
              <motion.span
                whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                className="relative p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors block cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B6B] rounded-full ring-2 ring-[#1E1E2E]" />
              </motion.span>
            </Link>
            <Link href="/dashboard">
              <motion.span
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] text-white text-sm font-semibold shadow-md hover:shadow-[#7B68EE]/40 transition-shadow duration-200 block cursor-pointer"
              >
                Open App
              </motion.span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={shouldReduceMotion ? {} : { scale: 0.92 }}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden overflow-hidden border-t border-white/10"
          >
            <nav className="px-4 py-3 flex flex-col gap-1 bg-[#1E1E2E]">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-2 pb-1 flex gap-2">
                <Link
                  href="/notifications"
                  className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white border border-white/20 hover:bg-white/10 transition-colors"
                >
                  Notifications
                </Link>
                <Link
                  href="/dashboard"
                  className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] text-white transition-opacity hover:opacity-90"
                >
                  Open App
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}