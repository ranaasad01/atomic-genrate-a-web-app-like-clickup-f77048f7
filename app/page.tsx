"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
  slideInLeft,
  slideInRight,
} from "@/lib/motion";
import { CheckCircle, Zap, Users, BarChart2, Bell, Layout, Star, ArrowRight, Check, Sparkles, Clock, Target, Shield, Globe, ChevronRight } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from "@/lib/data";

// ─── Inline Data ──────────────────────────────────────────────────────────────

const features = [
  {
    icon: Layout,
    title: "Kanban & List Views",
    description:
      "Visualize your work exactly how your team thinks. Switch between Kanban boards, list views, and calendar layouts in one click.",
    color: "#7B68EE",
    bg: "#F0EEFF",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    description:
      "Assign tasks, leave comments, and @mention teammates. Everyone stays in sync without endless status meetings.",
    color: "#6BCB77",
    bg: "#F0FFF2",
  },
  {
    icon: Zap,
    title: "Automation Engine",
    description:
      "Set triggers and actions to automate repetitive workflows. When a task moves to Review, notify the lead — automatically.",
    color: "#FFD93D",
    bg: "#FFFBEB",
  },
  {
    icon: BarChart2,
    title: "Goals & Reporting",
    description:
      "Track OKRs, sprint velocity, and team throughput with beautiful dashboards. Know exactly where your project stands.",
    color: "#FF9F43",
    bg: "#FFF5EC",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get notified about what matters. FlowTask filters noise so you only see updates that need your attention.",
    color: "#FF6B6B",
    bg: "#FFF0F0",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC 2 Type II certified, SSO, 2FA, and granular permissions. Your data is protected at every layer.",
    color: "#4ECDC4",
    bg: "#F0FFFE",
  },
];

const stats = [
  { value: "50K+", label: "Teams worldwide" },
  { value: "2.4M", label: "Tasks completed" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.9★", label: "Average rating" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Engineering Lead",
    company: "Vercel",
    avatar: "/images/sarah-chen-avatar.jpg",
    quote:
      "FlowTask replaced three tools for us. Our sprint planning went from 2 hours to 20 minutes. The automation alone saved us 8 hours a week.",
    rating: 5,
  },
  {
    name: "Marcus Rivera",
    role: "Product Manager",
    company: "Stripe",
    avatar: "/images/marcus-rivera-avatar.jpg",
    quote:
      "The best part? My engineers actually use it. The interface is clean enough that adoption was instant — no training needed.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Head of Design",
    company: "Figma",
    avatar: "/images/priya-nair-avatar.jpg",
    quote:
      "We manage 12 concurrent product launches in FlowTask. The goal tracking keeps every team aligned without micromanagement.",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for individuals and small teams getting started.",
    features: [
      "Up to 5 members",
      "Unlimited tasks",
      "3 active spaces",
      "Basic reporting",
      "Mobile apps",
    ],
    cta: "Get started free",
    href: "/dashboard",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per member / month",
    description: "For growing teams that need more power and automation.",
    features: [
      "Unlimited members",
      "Unlimited spaces",
      "Automation engine",
      "Advanced reporting",
      "Priority support",
      "Custom fields",
      "Time tracking",
    ],
    cta: "Start free trial",
    href: "/dashboard",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored pricing",
    description: "For large organizations with advanced security and compliance needs.",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "SOC 2 compliance",
      "Dedicated CSM",
      "SLA guarantee",
      "Custom integrations",
      "Audit logs",
    ],
    cta: "Contact sales",
    href: "/settings",
    highlighted: false,
  },
];

const workflowSteps = [
  {
    step: "01",
    icon: Target,
    title: "Create your workspace",
    description:
      "Set up spaces for each team or project. Invite members and define your workflow stages in minutes.",
  },
  {
    step: "02",
    icon: Layout,
    title: "Organize with lists & tasks",
    description:
      "Break projects into lists, add tasks with priorities, due dates, and assignees. Attach files and docs inline.",
  },
  {
    step: "03",
    icon: Zap,
    title: "Automate the repetitive",
    description:
      "Build automation rules that move tasks, send alerts, and update statuses — so your team focuses on real work.",
  },
  {
    step: "04",
    icon: BarChart2,
    title: "Track progress & ship",
    description:
      "Monitor velocity, spot blockers early, and celebrate milestones. Ship faster with full visibility.",
  },
];

const integrations = [
  { name: "GitHub", logo: "/images/github-integration-logo.jpg" },
  { name: "Slack", logo: "/images/slack-integration-logo.jpg" },
  { name: "Figma", logo: "/images/figma-integration-logo.jpg" },
  { name: "Google Drive", logo: "/images/google-drive-integration-logo.jpg" },
  { name: "Notion", logo: "/images/notion-integration-logo.jpg" },
  { name: "Zoom", logo: "/images/zoom-integration-logo.jpg" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-[#FFD93D] text-[#FFD93D]" />
      ))}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();

  const motionProps = (variants: object) =>
    shouldReduceMotion
      ? {}
      : { variants, initial: "hidden", whileInView: "visible", viewport: { once: true, margin: "-80px" } };

  return (
    <main className="bg-[#F4F4F8] overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#1E1E2E] overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#7B68EE]/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#9B8FFF]/15 blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28">
          <motion.div
            variants={shouldReduceMotion ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="inline-flex items-center gap-2 bg-[#7B68EE]/20 border border-[#7B68EE]/30 rounded-full px-4 py-1.5 mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7B68EE]" />
              <span className="text-[#9B8FFF] text-sm font-medium">
                The all-in-one productivity platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6"
            >
              {APP_TAGLINE.split(". ").map((part, i) => (
                <span key={i} className={i === 1 ? "text-[#7B68EE]" : ""}>
                  {part}
                  {i < APP_TAGLINE.split(". ").length - 1 ? ". " : ""}
                </span>
              ))}
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {APP_DESCRIPTION}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/dashboard">
                <motion.span
                  whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-[#7B68EE] hover:bg-[#6A5AE0] text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-[#7B68EE]/30 transition-colors cursor-pointer"
                >
                  Get started free
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
              <Link href="/workspace">
                <motion.span
                  whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/15 transition-colors cursor-pointer"
                >
                  View workspace demo
                </motion.span>
              </Link>
            </motion.div>

            {/* Social proof micro */}
            <motion.p
              variants={shouldReduceMotion ? {} : fadeIn}
              className="mt-8 text-white/35 text-sm"
            >
              No credit card required · Free forever plan · 50,000+ teams trust FlowTask
            </motion.p>
          </motion.div>

          {/* Hero dashboard mockup */}
          <motion.div
            variants={shouldReduceMotion ? {} : scaleIn}
            initial="hidden"
            animate="visible"
            className="mt-16 relative max-w-5xl mx-auto"
          >
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-[#252535]">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#1E1E2E] border-b border-white/10">
                <span className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
                <span className="w-3 h-3 rounded-full bg-[#FFD93D]" />
                <span className="w-3 h-3 rounded-full bg-[#6BCB77]" />
                <span className="ml-4 text-white/30 text-xs font-mono">flowtask.app/workspace</span>
              </div>
              {/* Mock kanban */}
              <div className="p-6 grid grid-cols-4 gap-4 min-h-[280px]">
                {[
                  { label: "To Do", color: "#94A3B8", tasks: ["Design system audit", "API rate limiting", "Onboarding flow v2"] },
                  { label: "In Progress", color: "#7B68EE", tasks: ["Auth refactor", "Dashboard charts"] },
                  { label: "Review", color: "#FFD93D", tasks: ["Mobile nav", "Pricing page copy"] },
                  { label: "Done", color: "#6BCB77", tasks: ["CI/CD pipeline", "Dark mode", "Figma handoff"] },
                ].map((col) => (
                  <div key={col.label} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                      <span className="text-white/60 text-xs font-semibold uppercase tracking-wide">{col.label}</span>
                      <span className="ml-auto text-white/30 text-xs">{col.tasks.length}</span>
                    </div>
                    {col.tasks.map((task) => (
                      <div key={task} className="bg-[#1E1E2E] rounded-lg p-3 border border-white/8 hover:border-[#7B68EE]/40 transition-colors">
                        <p className="text-white/80 text-xs leading-snug">{task}</p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF]" />
                          <div className="h-1.5 flex-1 rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-[#7B68EE]/60" style={{ width: `${Math.floor(30 + (task.length % 5) * 14)}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {/* Glow under mockup */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-[#7B68EE]/20 blur-2xl rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <motion.div
            {...motionProps(staggerContainer)}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={shouldReduceMotion ? {} : fadeInUp}
                className="text-center"
              >
                <p className="text-4xl font-extrabold text-[#1E1E2E] tracking-tight">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#F4F4F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...motionProps(fadeInUp)} className="text-center mb-16">
            <span className="inline-block bg-[#7B68EE]/10 text-[#7B68EE] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Everything you need
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1E1E2E] tracking-tight mb-4">
              One platform. Zero chaos.
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              FlowTask replaces your scattered tools with a single, beautifully integrated workspace your whole team will love.
            </p>
          </motion.div>

          <motion.div
            {...motionProps(staggerContainer)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  variants={shouldReduceMotion ? {} : scaleIn}
                  whileHover={shouldReduceMotion ? {} : { y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                  className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm transition-shadow cursor-default"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: feat.bg }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feat.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-[#1E1E2E] mb-2">{feat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feat.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...motionProps(fadeInUp)} className="text-center mb-16">
            <span className="inline-block bg-[#6BCB77]/15 text-[#3aaa4a] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              How it works
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1E1E2E] tracking-tight mb-4">
              Up and running in minutes
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              No lengthy onboarding. No consultants required. Just sign up and start shipping.
            </p>
          </motion.div>

          <motion.div
            {...motionProps(staggerContainer)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  variants={shouldReduceMotion ? {} : fadeInUp}
                  className="relative flex flex-col items-start"
                >
                  {/* Connector line */}
                  {idx < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-[calc(100%_-_16px)] w-full h-px bg-gradient-to-r from-[#7B68EE]/30 to-transparent z-0" />
                  )}
                  <div className="relative z-10 w-12 h-12 rounded-xl bg-[#7B68EE]/10 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-[#7B68EE]" />
                  </div>
                  <span className="text-[#7B68EE] font-black text-xs tracking-widest mb-2">{step.step}</span>
                  <h3 className="text-lg font-bold text-[#1E1E2E] mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#1E1E2E] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#7B68EE]/10 blur-[100px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...motionProps(fadeInUp)} className="text-center mb-16">
            <span className="inline-block bg-[#7B68EE]/20 text-[#9B8FFF] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Loved by teams
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Don't take our word for it
            </h2>
            <p className="text-lg text-white/50 max-w-xl mx-auto">
              Thousands of teams have replaced their fragmented toolchains with FlowTask.
            </p>
          </motion.div>

          <motion.div
            {...motionProps(staggerContainer)}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={shouldReduceMotion ? {} : scaleIn}
                whileHover={shouldReduceMotion ? {} : { y: -4 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col gap-5 hover:bg-white/8 transition-colors"
              >
                <StarRating count={t.rating} />
                <p className="text-white/80 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {(t.name ?? "?").charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role} · {t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#F4F4F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...motionProps(fadeInUp)} className="text-center mb-16">
            <span className="inline-block bg-[#FF9F43]/15 text-[#e07b10] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Simple pricing
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#1E1E2E] tracking-tight mb-4">
              Start free. Scale as you grow.
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              No hidden fees. No per-feature paywalls. Pick the plan that fits your team.
            </p>
          </motion.div>

          <motion.div
            {...motionProps(staggerContainer)}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={shouldReduceMotion ? {} : fadeInUp}
                whileHover={shouldReduceMotion ? {} : { y: -4 }}
                className={`relative rounded-2xl p-8 flex flex-col border transition-shadow ${
                  plan.highlighted
                    ? "bg-[#7B68EE] border-[#7B68EE] shadow-2xl shadow-[#7B68EE]/30"
                    : "bg-white border-gray-100 shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFD93D] text-[#1E1E2E] text-xs font-bold px-4 py-1 rounded-full shadow">
                    Most popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-white" : "text-[#1E1E2E]"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-4 ${plan.highlighted ? "text-white/70" : "text-gray-500"}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-extrabold ${plan.highlighted ? "text-white" : "text-[#1E1E2E]"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm mb-1.5 ${plan.highlighted ? "text-white/60" : "text-gray-400"}`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2.5">
                      <Check
                        className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? "text-white" : "text-[#7B68EE]"}`}
                      />
                      <span className={`text-sm ${plan.highlighted ? "text-white/85" : "text-gray-600"}`}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <motion.span
                    whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                    className={`block text-center font-semibold py-3 rounded-xl transition-colors cursor-pointer ${
                      plan.highlighted
                        ? "bg-white text-[#7B68EE] hover:bg-white/90"
                        : "bg-[#7B68EE] text-white hover:bg-[#6A5AE0]"
                    }`}
                  >
                    {plan.cta}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Integrations ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...motionProps(fadeInUp)} className="text-center mb-12">
            <span className="inline-block bg-[#4ECDC4]/15 text-[#2aada4] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Integrations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1E2E] tracking-tight mb-3">
              Works with your existing stack
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Connect FlowTask to the tools your team already uses. 100+ integrations available.
            </p>
          </motion.div>

          <motion.div
            {...motionProps(staggerContainer)}
            className="flex flex-wrap justify-center gap-4"
          >
            {integrations.map((intg) => (
              <motion.div
                key={intg.name}
                variants={shouldReduceMotion ? {} : scaleIn}
                whileHover={shouldReduceMotion ? {} : { scale: 1.06, y: -2 }}
                className="flex items-center gap-3 bg-[#F4F4F8] hover:bg-[#EEEEF5] border border-gray-100 rounded-xl px-5 py-3 cursor-default transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center overflow-hidden">
                  <Globe className="w-4 h-4 text-[#7B68EE]" />
                </div>
                <span className="text-sm font-semibold text-[#1E1E2E]">{intg.name}</span>
              </motion.div>
            ))}
            <motion.div
              variants={shouldReduceMotion ? {} : scaleIn}
              className="flex items-center gap-2 bg-[#F4F4F8] border border-dashed border-gray-300 rounded-xl px-5 py-3 cursor-default"
            >
              <span className="text-sm text-gray-400 font-medium">+ 94 more</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-[#7B68EE] via-[#8B78FF] to-[#9B8FFF] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/10 blur-[80px]" />
          <div className="absolute bottom-[-20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#1E1E2E]/20 blur-[80px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            {...motionProps(staggerContainer)}
            className="flex flex-col items-center"
          >
            <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
              <Sparkles className="w-10 h-10 text-white/80 mb-6 mx-auto" />
            </motion.div>
            <motion.h2
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-5"
            >
              Your team deserves better tools.
            </motion.h2>
            <motion.p
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="text-lg text-white/75 max-w-xl mx-auto mb-10"
            >
              Join 50,000+ teams who've made the switch to FlowTask. Set up your workspace in under 5 minutes — no credit card required.
            </motion.p>
            <motion.div
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/dashboard">
                <motion.span
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white text-[#7B68EE] font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-white/95 transition-colors cursor-pointer"
                >
                  Start for free
                  <ChevronRight className="w-4 h-4" />
                </motion.span>
              </Link>
              <Link href="/workspace">
                <motion.span
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05, y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-8 py-3.5 rounded-xl border border-white/25 transition-colors cursor-pointer"
                >
                  Explore workspace
                </motion.span>
              </Link>
            </motion.div>
            <motion.div
              variants={shouldReduceMotion ? {} : fadeIn}
              className="mt-8 flex flex-wrap justify-center gap-6 text-white/60 text-sm"
            >
              {["Free forever plan", "No credit card", "Cancel anytime", "SOC 2 certified"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-white/70" />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}