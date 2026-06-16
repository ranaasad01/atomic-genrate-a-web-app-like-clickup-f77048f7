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
import { CheckCircle, Clock, AlertCircle, ListTodo, Plus, ChevronRight, User, Calendar, ArrowUp, ArrowDown, Activity, Folder, Star, Bell, TrendingUp, X, Check } from 'lucide-react';
import { PRIORITY_CONFIG, STATUS_CONFIG, type Priority, type TaskStatus } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const currentUser = {
  id: "u1",
  name: "Alex Rivera",
  avatar: "AR",
  color: "#7B68EE",
};

const statCards = [
  {
    id: "total",
    label: "Total Tasks",
    value: 48,
    change: +6,
    icon: ListTodo,
    color: "#7B68EE",
    bg: "from-[#7B68EE]/20 to-[#7B68EE]/5",
    border: "border-[#7B68EE]/30",
  },
  {
    id: "completed",
    label: "Completed",
    value: 31,
    change: +4,
    icon: CheckCircle,
    color: "#6BCB77",
    bg: "from-[#6BCB77]/20 to-[#6BCB77]/5",
    border: "border-[#6BCB77]/30",
  },
  {
    id: "in_progress",
    label: "In Progress",
    value: 11,
    change: +2,
    icon: Clock,
    color: "#FFD93D",
    bg: "from-[#FFD93D]/20 to-[#FFD93D]/5",
    border: "border-[#FFD93D]/30",
  },
  {
    id: "overdue",
    label: "Overdue",
    value: 6,
    change: -1,
    icon: AlertCircle,
    color: "#FF6B6B",
    bg: "from-[#FF6B6B]/20 to-[#FF6B6B]/5",
    border: "border-[#FF6B6B]/30",
  },
];

interface MyTask {
  id: string;
  title: string;
  project: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  overdue: boolean;
}

const myTasks: MyTask[] = [
  {
    id: "t1",
    title: "Design new onboarding flow for mobile",
    project: "Mobile App",
    priority: "urgent",
    status: "in_progress",
    dueDate: "Dec 18",
    overdue: false,
  },
  {
    id: "t2",
    title: "Fix authentication bug in staging",
    project: "Backend API",
    priority: "high",
    status: "todo",
    dueDate: "Dec 15",
    overdue: true,
  },
  {
    id: "t3",
    title: "Write unit tests for payment module",
    project: "Backend API",
    priority: "normal",
    status: "in_progress",
    dueDate: "Dec 20",
    overdue: false,
  },
  {
    id: "t4",
    title: "Update brand guidelines document",
    project: "Marketing",
    priority: "low",
    status: "review",
    dueDate: "Dec 22",
    overdue: false,
  },
  {
    id: "t5",
    title: "Integrate Stripe webhook endpoints",
    project: "Backend API",
    priority: "high",
    status: "todo",
    dueDate: "Dec 19",
    overdue: false,
  },
  {
    id: "t6",
    title: "Conduct user interviews for Q1 roadmap",
    project: "Product",
    priority: "normal",
    status: "done",
    dueDate: "Dec 14",
    overdue: false,
  },
];

interface ActivityItem {
  id: string;
  user: string;
  userInitials: string;
  userColor: string;
  action: string;
  target: string;
  project: string;
  time: string;
  type: "comment" | "status" | "assignment" | "created" | "completed";
}

const recentActivity: ActivityItem[] = [
  {
    id: "a1",
    user: "Jordan Lee",
    userInitials: "JL",
    userColor: "#FF9F43",
    action: "completed",
    target: "API rate limiting implementation",
    project: "Backend API",
    time: "2 min ago",
    type: "completed",
  },
  {
    id: "a2",
    user: "Sam Chen",
    userInitials: "SC",
    userColor: "#6BCB77",
    action: "commented on",
    target: "Design new onboarding flow",
    project: "Mobile App",
    time: "14 min ago",
    type: "comment",
  },
  {
    id: "a3",
    user: "Alex Rivera",
    userInitials: "AR",
    userColor: "#7B68EE",
    action: "moved to In Progress",
    target: "Write unit tests for payment module",
    project: "Backend API",
    time: "1 hr ago",
    type: "status",
  },
  {
    id: "a4",
    user: "Morgan Kim",
    userInitials: "MK",
    userColor: "#FF6B6B",
    action: "assigned you to",
    target: "Integrate Stripe webhook endpoints",
    project: "Backend API",
    time: "3 hr ago",
    type: "assignment",
  },
  {
    id: "a5",
    user: "Taylor Nguyen",
    userInitials: "TN",
    userColor: "#9B8FFF",
    action: "created",
    target: "Q1 2025 Marketing Campaign",
    project: "Marketing",
    time: "5 hr ago",
    type: "created",
  },
  {
    id: "a6",
    user: "Jordan Lee",
    userInitials: "JL",
    userColor: "#FF9F43",
    action: "updated priority on",
    target: "Fix authentication bug in staging",
    project: "Backend API",
    time: "Yesterday",
    type: "status",
  },
];

interface ProjectProgress {
  id: string;
  name: string;
  color: string;
  icon: string;
  total: number;
  completed: number;
  inProgress: number;
  dueDate: string;
}

const projectsProgress: ProjectProgress[] = [
  {
    id: "p1",
    name: "Mobile App",
    color: "#7B68EE",
    icon: "📱",
    total: 18,
    completed: 12,
    inProgress: 4,
    dueDate: "Jan 15, 2025",
  },
  {
    id: "p2",
    name: "Backend API",
    color: "#FF9F43",
    icon: "⚙️",
    total: 14,
    completed: 8,
    inProgress: 4,
    dueDate: "Dec 31, 2024",
  },
  {
    id: "p3",
    name: "Marketing",
    color: "#6BCB77",
    icon: "📣",
    total: 10,
    completed: 7,
    inProgress: 2,
    dueDate: "Jan 5, 2025",
  },
  {
    id: "p4",
    name: "Product",
    color: "#FF6B6B",
    icon: "🎯",
    total: 6,
    completed: 4,
    inProgress: 1,
    dueDate: "Jan 20, 2025",
  },
];

// ─── Activity Icon Helper ─────────────────────────────────────────────────────

function activityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "completed":
      return <Check className="w-3 h-3 text-[#6BCB77]" />;
    case "comment":
      return <Bell className="w-3 h-3 text-[#7B68EE]" />;
    case "status":
      return <Activity className="w-3 h-3 text-[#FFD93D]" />;
    case "assignment":
      return <User className="w-3 h-3 text-[#FF9F43]" />;
    case "created":
      return <Plus className="w-3 h-3 text-[#9B8FFF]" />;
    default:
      return <Activity className="w-3 h-3 text-white/40" />;
  }
}

// ─── Quick Add Task Modal ─────────────────────────────────────────────────────

function QuickAddModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [project, setProject] = useState("Mobile App");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-[#1E1E2E] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">Quick Add Task</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7B68EE]/60 focus:ring-1 focus:ring-[#7B68EE]/30 transition-colors"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#7B68EE]/60 transition-colors appearance-none"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#7B68EE]/60 transition-colors appearance-none"
              >
                <option>Mobile App</option>
                <option>Backend API</option>
                <option>Marketing</option>
                <option>Product</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#7B68EE]/60 transition-colors"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#7B68EE]/25"
            >
              Add Task
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const shouldReduceMotion = useReducedMotion();
  const [showModal, setShowModal] = useState(false);
  const [taskFilter, setTaskFilter] = useState<"all" | TaskStatus>("all");

  const filteredTasks =
    taskFilter === "all"
      ? myTasks
      : myTasks.filter((t) => t.status === taskFilter);

  const motionProps = (variants: object) =>
    shouldReduceMotion
      ? {}
      : { variants, initial: "hidden", animate: "visible" };

  return (
    <div className="min-h-screen bg-[#F4F4F8]">
      {/* ── Header ── */}
      <div className="bg-[#1E1E2E] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            {...(shouldReduceMotion ? {} : { variants: fadeInUp, initial: "hidden", animate: "visible" })}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Good morning, {currentUser.name.split(" ")[0]} 👋
              </h1>
              <p className="text-white/50 text-sm mt-1">
                Here's what's happening with your projects today.
              </p>
            </div>
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.96 }}
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] text-white font-semibold text-sm shadow-lg shadow-[#7B68EE]/30 hover:opacity-90 transition-opacity self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Quick Add Task
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Stat Cards ── */}
        <motion.div
          variants={shouldReduceMotion ? undefined : staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {statCards.map((card) => {
            const Icon = card.icon;
            const isPositive = card.change >= 0;
            return (
              <motion.div
                key={card.id}
                variants={shouldReduceMotion ? undefined : scaleIn}
                whileHover={shouldReduceMotion ? {} : { y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`bg-white rounded-2xl p-5 border ${card.border} shadow-sm hover:shadow-md transition-shadow cursor-default`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.bg} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                      isPositive
                        ? "bg-[#6BCB77]/10 text-[#6BCB77]"
                        : "bg-[#FF6B6B]/10 text-[#FF6B6B]"
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
                <p className="text-3xl font-bold text-[#1E1E2E] mb-0.5">
                  {card.value}
                </p>
                <p className="text-sm text-[#1E1E2E]/50 font-medium">{card.label}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── My Tasks (2/3 width) ── */}
          <motion.div
            variants={shouldReduceMotion ? undefined : fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E5F0] shadow-sm overflow-hidden"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F8]">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-[#7B68EE]" />
                <h2 className="font-semibold text-[#1E1E2E] text-base">My Tasks</h2>
                <span className="text-xs bg-[#7B68EE]/10 text-[#7B68EE] font-semibold px-2 py-0.5 rounded-full">
                  {myTasks.length}
                </span>
              </div>
              <Link
                href="/workspace"
                className="text-xs text-[#7B68EE] font-medium hover:underline flex items-center gap-1"
              >
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 px-6 pt-3 pb-1">
              {(["all", "todo", "in_progress", "review", "done"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setTaskFilter(f)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    taskFilter === f
                      ? "bg-[#7B68EE] text-white"
                      : "text-[#1E1E2E]/50 hover:bg-[#F4F4F8] hover:text-[#1E1E2E]"
                  }`}
                >
                  {f === "all" ? "All" : STATUS_CONFIG[f]?.label ?? f}
                </button>
              ))}
            </div>

            {/* Task List */}
            <motion.ul
              variants={shouldReduceMotion ? undefined : staggerContainer}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[#F4F4F8]"
            >
              {filteredTasks.map((task) => {
                const pCfg = PRIORITY_CONFIG[task.priority];
                const sCfg = STATUS_CONFIG[task.status];
                return (
                  <motion.li
                    key={task.id}
                    variants={shouldReduceMotion ? undefined : fadeInUp}
                    whileHover={shouldReduceMotion ? {} : { backgroundColor: "#FAFAFA" }}
                    className="flex items-start gap-3 px-6 py-3.5 cursor-pointer transition-colors"
                  >
                    {/* Status dot */}
                    <div
                      className="mt-1 w-3 h-3 rounded-full flex-shrink-0 border-2"
                      style={{
                        borderColor: sCfg?.color ?? "#94A3B8",
                        backgroundColor:
                          task.status === "done" ? (sCfg?.color ?? "#94A3B8") : "transparent",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          task.status === "done"
                            ? "line-through text-[#1E1E2E]/40"
                            : "text-[#1E1E2E]"
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-[#1E1E2E]/40 flex items-center gap-1">
                          <Folder className="w-3 h-3" />
                          {task.project}
                        </span>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{
                            color: pCfg?.color ?? "#7B68EE",
                            backgroundColor: pCfg?.bg ?? "#F0EEFF",
                          }}
                        >
                          {pCfg?.label ?? task.priority}
                        </span>
                        <span
                          className={`text-xs flex items-center gap-1 ${
                            task.overdue ? "text-[#FF6B6B]" : "text-[#1E1E2E]/40"
                          }`}
                        >
                          <Calendar className="w-3 h-3" />
                          {task.dueDate}
                          {task.overdue && (
                            <span className="font-semibold">(Overdue)</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                      style={{
                        color: sCfg?.color ?? "#94A3B8",
                        backgroundColor: sCfg?.bg ?? "#F1F5F9",
                      }}
                    >
                      {sCfg?.label ?? task.status}
                    </span>
                  </motion.li>
                );
              })}
              {filteredTasks.length === 0 && (
                <li className="px-6 py-10 text-center text-sm text-[#1E1E2E]/40">
                  No tasks match this filter.
                </li>
              )}
            </motion.ul>
          </motion.div>

          {/* ── Recent Activity (1/3 width) ── */}
          <motion.div
            variants={shouldReduceMotion ? undefined : fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-white rounded-2xl border border-[#E5E5F0] shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F8]">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#7B68EE]" />
                <h2 className="font-semibold text-[#1E1E2E] text-base">Recent Activity</h2>
              </div>
            </div>
            <motion.ul
              variants={shouldReduceMotion ? undefined : staggerContainer}
              initial="hidden"
              animate="visible"
              className="divide-y divide-[#F4F4F8]"
            >
              {recentActivity.map((item) => (
                <motion.li
                  key={item.id}
                  variants={shouldReduceMotion ? undefined : fadeInUp}
                  className="flex gap-3 px-5 py-3.5"
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: item.userColor }}
                  >
                    {item.userInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#1E1E2E]/80 leading-relaxed">
                      <span className="font-semibold text-[#1E1E2E]">{item.user}</span>{" "}
                      {item.action}{" "}
                      <span className="font-medium text-[#7B68EE]">{item.target}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#1E1E2E]/35 flex items-center gap-1">
                        <Folder className="w-3 h-3" />
                        {item.project}
                      </span>
                      <span className="text-xs text-[#1E1E2E]/35 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#F4F4F8] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {activityIcon(item.type)}
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        {/* ── Projects Progress ── */}
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="bg-white rounded-2xl border border-[#E5E5F0] shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F8]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#7B68EE]" />
              <h2 className="font-semibold text-[#1E1E2E] text-base">Projects Progress</h2>
            </div>
            <Link
              href="/workspace"
              className="text-xs text-[#7B68EE] font-medium hover:underline flex items-center gap-1"
            >
              View workspace <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#F0F0F8]">
            {projectsProgress.map((proj, idx) => {
              const pct = proj.total > 0 ? Math.round((proj.completed / proj.total) * 100) : 0;
              return (
                <motion.div
                  key={proj.id}
                  variants={shouldReduceMotion ? undefined : fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={shouldReduceMotion ? {} : { backgroundColor: "#FAFAFA" }}
                  className="px-6 py-5 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{proj.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1E1E2E]">{proj.name}</p>
                      <p className="text-xs text-[#1E1E2E]/40 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {proj.dueDate}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-[#1E1E2E]/50">Progress</span>
                      <span className="text-xs font-bold" style={{ color: proj.color }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#F0F0F8] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 + idx * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: proj.color }}
                      />
                    </div>
                  </div>

                  {/* Task counts */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-[#6BCB77]">
                      <CheckCircle className="w-3 h-3" />
                      {proj.completed} done
                    </span>
                    <span className="flex items-center gap-1 text-[#FFD93D]">
                      <Clock className="w-3 h-3" />
                      {proj.inProgress} active
                    </span>
                    <span className="text-[#1E1E2E]/35">
                      {proj.total} total
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Bottom CTA Row ── */}
        <motion.div
          variants={shouldReduceMotion ? undefined : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            {
              icon: Star,
              label: "Starred Tasks",
              desc: "Quick access to your most important work",
              color: "#FFD93D",
              href: "/workspace",
            },
            {
              icon: User,
              label: "Team Members",
              desc: "5 active collaborators across 4 projects",
              color: "#7B68EE",
              href: "/workspace",
            },
            {
              icon: Bell,
              label: "Notifications",
              desc: "3 unread mentions and assignments",
              color: "#FF6B6B",
              href: "/notifications",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.label} variants={shouldReduceMotion ? undefined : scaleIn}>
                <Link href={item.href}>
                  <motion.div
                    whileHover={shouldReduceMotion ? {} : { y: -3, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl border border-[#E5E5F0] shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${item.color}18` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1E1E2E]">{item.label}</p>
                      <p className="text-xs text-[#1E1E2E]/45 mt-0.5 truncate">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#1E1E2E]/25 ml-auto flex-shrink-0" />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Quick Add Modal ── */}
      {showModal && <QuickAddModal onClose={() => setShowModal(false)} />}
    </div>
  );
}