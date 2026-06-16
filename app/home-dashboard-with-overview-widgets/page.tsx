"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
} from "@/lib/motion";
import { CheckCircle, Clock, AlertCircle, TrendingUp, Users, Folder, Bell, ArrowRight, ArrowUp, ArrowDown, Star, Calendar, Activity, Circle, Check, ChevronRight } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const statCards = [
  {
    id: "total-tasks",
    label: "Total Tasks",
    value: 248,
    change: +12,
    changeLabel: "vs last week",
    icon: CheckCircle,
    color: "#7B68EE",
    bg: "from-[#7B68EE]/20 to-[#7B68EE]/5",
    iconBg: "bg-[#7B68EE]/20",
  },
  {
    id: "in-progress",
    label: "In Progress",
    value: 43,
    change: +5,
    changeLabel: "vs last week",
    icon: Clock,
    color: "#FFD93D",
    bg: "from-[#FFD93D]/20 to-[#FFD93D]/5",
    iconBg: "bg-[#FFD93D]/20",
  },
  {
    id: "overdue",
    label: "Overdue",
    value: 7,
    change: -3,
    changeLabel: "vs last week",
    icon: AlertCircle,
    color: "#FF6B6B",
    bg: "from-[#FF6B6B]/20 to-[#FF6B6B]/5",
    iconBg: "bg-[#FF6B6B]/20",
  },
  {
    id: "team-members",
    label: "Team Members",
    value: 18,
    change: +2,
    changeLabel: "this month",
    icon: Users,
    color: "#6BCB77",
    bg: "from-[#6BCB77]/20 to-[#6BCB77]/5",
    iconBg: "bg-[#6BCB77]/20",
  },
];

const activityData = [
  { day: "Mon", completed: 12, created: 18 },
  { day: "Tue", completed: 19, created: 22 },
  { day: "Wed", completed: 15, created: 14 },
  { day: "Thu", completed: 27, created: 30 },
  { day: "Fri", completed: 22, created: 19 },
  { day: "Sat", completed: 8, created: 6 },
  { day: "Sun", completed: 5, created: 4 },
];

const progressData = [
  { month: "Jan", done: 65, total: 90 },
  { month: "Feb", done: 78, total: 95 },
  { month: "Mar", done: 90, total: 110 },
  { month: "Apr", done: 55, total: 80 },
  { month: "May", done: 102, total: 120 },
  { month: "Jun", done: 88, total: 100 },
];

const recentTasks = [
  {
    id: "t1",
    title: "Redesign onboarding flow for mobile users",
    status: "in_progress",
    priority: "high",
    assignee: "Alex Kim",
    avatarColor: "#7B68EE",
    initials: "AK",
    dueDate: "Dec 28",
    project: "Mobile App",
  },
  {
    id: "t2",
    title: "Fix authentication bug on Safari",
    status: "todo",
    priority: "urgent",
    assignee: "Sam Rivera",
    avatarColor: "#FF6B6B",
    initials: "SR",
    dueDate: "Dec 26",
    project: "Web Platform",
  },
  {
    id: "t3",
    title: "Write API documentation for v2 endpoints",
    status: "review",
    priority: "normal",
    assignee: "Jordan Lee",
    avatarColor: "#6BCB77",
    initials: "JL",
    dueDate: "Dec 30",
    project: "Backend",
  },
  {
    id: "t4",
    title: "Set up CI/CD pipeline for staging environment",
    status: "done",
    priority: "high",
    assignee: "Morgan Chen",
    avatarColor: "#FFD93D",
    initials: "MC",
    dueDate: "Dec 24",
    project: "DevOps",
  },
  {
    id: "t5",
    title: "Conduct user interviews for Q1 roadmap",
    status: "in_progress",
    priority: "normal",
    assignee: "Taylor Brooks",
    avatarColor: "#FF9F43",
    initials: "TB",
    dueDate: "Jan 3",
    project: "Research",
  },
];

const projects = [
  {
    id: "p1",
    name: "Mobile App Redesign",
    color: "#7B68EE",
    progress: 68,
    tasks: 34,
    done: 23,
    members: ["AK", "SR", "JL"],
    memberColors: ["#7B68EE", "#FF6B6B", "#6BCB77"],
    dueDate: "Jan 15",
    starred: true,
  },
  {
    id: "p2",
    name: "Web Platform v2",
    color: "#FF6B6B",
    progress: 42,
    tasks: 58,
    done: 24,
    members: ["MC", "TB"],
    memberColors: ["#FFD93D", "#FF9F43"],
    dueDate: "Feb 1",
    starred: false,
  },
  {
    id: "p3",
    name: "Backend API Overhaul",
    color: "#6BCB77",
    progress: 85,
    tasks: 27,
    done: 23,
    members: ["JL", "AK"],
    memberColors: ["#6BCB77", "#7B68EE"],
    dueDate: "Dec 31",
    starred: true,
  },
  {
    id: "p4",
    name: "DevOps Infrastructure",
    color: "#FFD93D",
    progress: 55,
    tasks: 19,
    done: 10,
    members: ["MC"],
    memberColors: ["#FFD93D"],
    dueDate: "Jan 20",
    starred: false,
  },
];

const notifications = [
  {
    id: "n1",
    type: "mention",
    message: "Alex Kim mentioned you in Mobile App Redesign",
    time: "2m ago",
    read: false,
    color: "#7B68EE",
  },
  {
    id: "n2",
    type: "assignment",
    message: "You were assigned to 'Fix Safari auth bug'",
    time: "1h ago",
    read: false,
    color: "#FF6B6B",
  },
  {
    id: "n3",
    type: "comment",
    message: "Jordan Lee commented on API Documentation",
    time: "3h ago",
    read: true,
    color: "#6BCB77",
  },
  {
    id: "n4",
    type: "due_date",
    message: "Task 'CI/CD Pipeline' is due tomorrow",
    time: "5h ago",
    read: true,
    color: "#FFD93D",
  },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  todo: { label: "To Do", color: "#94A3B8", bg: "#F1F5F9" },
  in_progress: { label: "In Progress", color: "#7B68EE", bg: "#F0EEFF" },
  review: { label: "Review", color: "#FFD93D", bg: "#FFFBEB" },
  done: { label: "Done", color: "#6BCB77", bg: "#F0FFF2" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  urgent: { label: "Urgent", color: "#FF6B6B" },
  high: { label: "High", color: "#FF9F43" },
  normal: { label: "Normal", color: "#7B68EE" },
  low: { label: "Low", color: "#6BCB77" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  card,
  index,
  shouldReduceMotion,
}: {
  card: (typeof statCards)[0];
  index: number;
  shouldReduceMotion: boolean | null;
}) {
  const Icon = card.icon;
  const isPositive = card.change >= 0;

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : scaleIn}
      custom={index}
      whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bg} border border-white/60 p-6 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center`}>
          <Icon className="w-5 h-5" style={{ color: card.color }} />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isPositive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isPositive ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )}
          {Math.abs(card.change)}
        </span>
      </div>
      <p className="text-3xl font-bold text-[#1E1E2E] mb-1">
        {(card.value ?? 0).toLocaleString()}
      </p>
      <p className="text-sm font-medium text-slate-600">{card.label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{card.changeLabel}</p>
    </motion.div>
  );
}

function TaskRow({ task }: { task: (typeof recentTasks)[0] }) {
  const status = statusConfig[task.status] ?? statusConfig["todo"];
  const priority = priorityConfig[task.priority] ?? priorityConfig["normal"];

  return (
    <motion.tr
      whileHover={{ backgroundColor: "rgba(123,104,238,0.04)" }}
      className="border-b border-slate-100 last:border-0 transition-colors cursor-pointer"
    >
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: priority.color }}
          />
          <span className="text-sm font-medium text-slate-700 line-clamp-1">
            {task.title}
          </span>
        </div>
      </td>
      <td className="py-3.5 px-4 hidden md:table-cell">
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
          {task.project}
        </span>
      </td>
      <td className="py-3.5 px-4 hidden lg:table-cell">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ color: status.color, backgroundColor: status.bg }}
        >
          {status.label}
        </span>
      </td>
      <td className="py-3.5 px-4 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: task.avatarColor }}
          >
            {task.initials}
          </div>
          <span className="text-xs text-slate-500">{task.assignee}</span>
        </div>
      </td>
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Calendar className="w-3 h-3" />
          {task.dueDate}
        </div>
      </td>
    </motion.tr>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: project.color }}
          />
          <h3 className="text-sm font-semibold text-slate-800 leading-tight">
            {project.name}
          </h3>
        </div>
        {project.starred && (
          <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
        )}
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-400">Progress</span>
          <span className="text-xs font-semibold text-slate-600">
            {project.progress}%
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${project.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="h-full rounded-full"
            style={{ backgroundColor: project.color }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1.5">
            {(project.members ?? []).slice(0, 3).map((m, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: project.memberColors?.[i] ?? "#7B68EE" }}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3 text-green-500" />
            {project.done}/{project.tasks}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {project.dueDate}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomeDashboardPage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<"week" | "month">("week");

  const chartData = activeTab === "week" ? activityData : progressData;

  return (
    <main className="min-h-screen bg-[#F4F4F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page Header ── */}
        <motion.div
          variants={shouldReduceMotion ? {} : fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1E1E2E] tracking-tight">
                Good morning, Jordan 👋
              </h1>
              <p className="text-slate-500 mt-1 text-sm">
                Here's what's happening across your workspace today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/notifications">
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  className="relative p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm cursor-pointer hover:border-[#7B68EE]/40 transition-colors"
                >
                  <Bell className="w-5 h-5 text-slate-500" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B6B] rounded-full" />
                </motion.div>
              </Link>
              <Link href="/workspace">
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#7B68EE] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#7B68EE]/30 hover:bg-[#6A57DD] transition-colors"
                >
                  <Folder className="w-4 h-4" />
                  Open Workspace
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map((card, i) => (
            <StatCard
              key={card.id}
              card={card}
              index={i}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </motion.div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Activity Chart */}
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-[#1E1E2E]">Task Activity</h2>
                <p className="text-xs text-slate-400 mt-0.5">Tasks created vs completed</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                {(["week", "month"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      activeTab === tab
                        ? "bg-white text-[#7B68EE] shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab === "week" ? "This Week" : "This Month"}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              {activeTab === "week" ? (
                <AreaChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7B68EE" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#7B68EE" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6BCB77" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6BCB77" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }}
                    cursor={{ stroke: "#7B68EE", strokeWidth: 1, strokeDasharray: "4 4" }}
                  />
                  <Area type="monotone" dataKey="completed" stroke="#7B68EE" strokeWidth={2.5} fill="url(#colorCompleted)" name="Completed" dot={false} />
                  <Area type="monotone" dataKey="created" stroke="#6BCB77" strokeWidth={2.5} fill="url(#colorCreated)" name="Created" dot={false} />
                </AreaChart>
              ) : (
                <BarChart data={progressData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #E2E8F0", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="done" fill="#7B68EE" radius={[4, 4, 0, 0]} name="Completed" />
                  <Bar dataKey="total" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="Total" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </motion.div>

          {/* Notifications Panel */}
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#1E1E2E]">Recent Activity</h2>
              <Link href="/notifications">
                <span className="text-xs font-semibold text-[#7B68EE] hover:underline cursor-pointer">
                  View all
                </span>
              </Link>
            </div>
            <div className="space-y-3">
              {notifications.map((n) => (
                <motion.div
                  key={n.id}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.15 }}
                  className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    n.read ? "bg-slate-50 hover:bg-slate-100" : "bg-[#7B68EE]/5 hover:bg-[#7B68EE]/10"
                  }`}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: n.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed ${n.read ? "text-slate-500" : "text-slate-700 font-medium"}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7B68EE] flex-shrink-0 mt-1.5" />
                  )}
                </motion.div>
              ))}
            </div>
            <Link href="/notifications">
              <motion.div
                whileHover={shouldReduceMotion ? {} : { x: 4 }}
                className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#7B68EE] cursor-pointer"
              >
                See all notifications
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* ── Projects + Tasks Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

          {/* Projects */}
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#1E1E2E]">Active Projects</h2>
              <Link href="/workspace">
                <span className="text-xs font-semibold text-[#7B68EE] hover:underline cursor-pointer flex items-center gap-1">
                  All projects <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
            <motion.div
              variants={shouldReduceMotion ? {} : staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-3"
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={shouldReduceMotion ? {} : fadeInUp}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Recent Tasks Table */}
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#1E1E2E]">Recent Tasks</h2>
              <Link href="/workspace">
                <motion.span
                  whileHover={shouldReduceMotion ? {} : { x: 2 }}
                  className="text-xs font-semibold text-[#7B68EE] hover:underline cursor-pointer flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </motion.span>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3 px-4">
                      Task
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3 px-4 hidden md:table-cell">
                      Project
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3 px-4 hidden lg:table-cell">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3 px-4 hidden lg:table-cell">
                      Assignee
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-3 px-4">
                      Due
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTasks.map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* ── Quick Stats Footer ── */}
        <motion.div
          variants={shouldReduceMotion ? {} : fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Completion Rate", value: "87%", icon: TrendingUp, color: "#6BCB77", desc: "This week" },
            { label: "Avg. Task Time", value: "2.4d", icon: Clock, color: "#7B68EE", desc: "Per task" },
            { label: "Active Sprints", value: "3", icon: Activity, color: "#FFD93D", desc: "Across spaces" },
            { label: "Open Blockers", value: "2", icon: Circle, color: "#FF6B6B", desc: "Need attention" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-[#1E1E2E]">{item.value}</p>
                  <p className="text-xs font-medium text-slate-600">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </main>
  );
}