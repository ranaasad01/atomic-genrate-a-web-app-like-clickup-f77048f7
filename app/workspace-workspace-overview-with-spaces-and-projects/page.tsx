"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
} from "@/lib/motion";
import { Folder, FolderOpen, Plus, Search, Settings, Users, ChevronDown, ChevronRight, Star, MoreHorizontal, Layout, CheckSquare, Target, Zap, Globe, Lock, ArrowRight, Activity, Clock, Check, Circle, AlertCircle, Sparkles, Edit, Trash2, Eye } from 'lucide-react';
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/lib/data";
import type { Priority, TaskStatus } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const WORKSPACE = {
  id: "ws-1",
  name: "Acme Corp",
  description: "Main workspace for all product and engineering work",
  plan: "Business",
  memberCount: 24,
  taskCount: 312,
  completedCount: 187,
};

interface SpaceData {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  memberCount: number;
  taskCount: number;
  completedCount: number;
  isPrivate: boolean;
  isFavorite: boolean;
  lists: ListData[];
}

interface ListData {
  id: string;
  name: string;
  color: string;
  taskCount: number;
  completedCount: number;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  assignees: string[];
}

const SPACES: SpaceData[] = [
  {
    id: "sp-1",
    name: "Product Design",
    color: "#7B68EE",
    icon: "🎨",
    description: "UI/UX design, prototypes, and design system",
    memberCount: 6,
    taskCount: 84,
    completedCount: 52,
    isPrivate: false,
    isFavorite: true,
    lists: [
      {
        id: "l-1",
        name: "Q2 Design Sprint",
        color: "#7B68EE",
        taskCount: 18,
        completedCount: 12,
        dueDate: "Jun 30",
        priority: "high",
        status: "in_progress",
        assignees: ["AK", "MR", "JS"],
      },
      {
        id: "l-2",
        name: "Design System v2",
        color: "#9B8FFF",
        taskCount: 24,
        completedCount: 8,
        dueDate: "Jul 15",
        priority: "normal",
        status: "in_progress",
        assignees: ["AK", "TL"],
      },
      {
        id: "l-3",
        name: "User Research",
        color: "#C4B5FD",
        taskCount: 12,
        completedCount: 12,
        dueDate: "Jun 10",
        priority: "low",
        status: "done",
        assignees: ["MR"],
      },
    ],
  },
  {
    id: "sp-2",
    name: "Engineering",
    color: "#6BCB77",
    icon: "⚙️",
    description: "Backend, frontend, and infrastructure development",
    memberCount: 10,
    taskCount: 142,
    completedCount: 89,
    isPrivate: false,
    isFavorite: true,
    lists: [
      {
        id: "l-4",
        name: "API v3 Migration",
        color: "#6BCB77",
        taskCount: 32,
        completedCount: 20,
        dueDate: "Jul 1",
        priority: "urgent",
        status: "in_progress",
        assignees: ["DK", "PL", "SN", "RW"],
      },
      {
        id: "l-5",
        name: "Performance Optimization",
        color: "#4ADE80",
        taskCount: 15,
        completedCount: 5,
        dueDate: "Jul 20",
        priority: "high",
        status: "todo",
        assignees: ["DK", "SN"],
      },
      {
        id: "l-6",
        name: "Bug Fixes — June",
        color: "#86EFAC",
        taskCount: 28,
        completedCount: 28,
        dueDate: "Jun 15",
        priority: "normal",
        status: "done",
        assignees: ["PL", "RW"],
      },
    ],
  },
  {
    id: "sp-3",
    name: "Marketing",
    color: "#FF9F43",
    icon: "📣",
    description: "Campaigns, content, and growth initiatives",
    memberCount: 5,
    taskCount: 56,
    completedCount: 31,
    isPrivate: false,
    isFavorite: false,
    lists: [
      {
        id: "l-7",
        name: "Summer Campaign",
        color: "#FF9F43",
        taskCount: 20,
        completedCount: 8,
        dueDate: "Jul 5",
        priority: "high",
        status: "in_progress",
        assignees: ["LC", "BM"],
      },
      {
        id: "l-8",
        name: "Blog Content Q3",
        color: "#FBBF24",
        taskCount: 16,
        completedCount: 10,
        dueDate: "Sep 30",
        priority: "normal",
        status: "in_progress",
        assignees: ["BM"],
      },
    ],
  },
  {
    id: "sp-4",
    name: "Operations",
    color: "#FF6B6B",
    icon: "🔧",
    description: "Internal processes, HR, and company operations",
    memberCount: 4,
    taskCount: 30,
    completedCount: 15,
    isPrivate: true,
    isFavorite: false,
    lists: [
      {
        id: "l-9",
        name: "Onboarding Process",
        color: "#FF6B6B",
        taskCount: 14,
        completedCount: 7,
        dueDate: "Ongoing",
        priority: "normal",
        status: "in_progress",
        assignees: ["HR", "OPS"],
      },
      {
        id: "l-10",
        name: "Q2 OKRs",
        color: "#FCA5A5",
        taskCount: 16,
        completedCount: 8,
        dueDate: "Jun 30",
        priority: "high",
        status: "review",
        assignees: ["HR"],
      },
    ],
  },
];

const RECENT_ACTIVITY = [
  {
    id: "a-1",
    user: "AK",
    userColor: "#7B68EE",
    userName: "Alex Kim",
    action: "completed task",
    target: "Finalize color tokens for Design System v2",
    space: "Product Design",
    time: "2 min ago",
  },
  {
    id: "a-2",
    user: "DK",
    userColor: "#6BCB77",
    userName: "David Kim",
    action: "moved task to In Progress",
    target: "Migrate auth endpoints to v3 API",
    space: "Engineering",
    time: "15 min ago",
  },
  {
    id: "a-3",
    user: "LC",
    userColor: "#FF9F43",
    userName: "Laura Chen",
    action: "created task",
    target: "Draft summer campaign landing page copy",
    space: "Marketing",
    time: "1 hr ago",
  },
  {
    id: "a-4",
    user: "MR",
    userColor: "#C4B5FD",
    userName: "Maya Rao",
    action: "commented on",
    target: "User interview synthesis — Round 3",
    space: "Product Design",
    time: "2 hr ago",
  },
  {
    id: "a-5",
    user: "PL",
    userColor: "#4ADE80",
    userName: "Paul Lee",
    action: "closed task",
    target: "Fix memory leak in WebSocket handler",
    space: "Engineering",
    time: "3 hr ago",
  },
];

const MEMBERS = [
  { initials: "AK", name: "Alex Kim", role: "Designer", color: "#7B68EE" },
  { initials: "DK", name: "David Kim", role: "Engineer", color: "#6BCB77" },
  { initials: "MR", name: "Maya Rao", role: "Designer", color: "#C4B5FD" },
  { initials: "LC", name: "Laura Chen", role: "Marketer", color: "#FF9F43" },
  { initials: "PL", name: "Paul Lee", role: "Engineer", color: "#4ADE80" },
  { initials: "SN", name: "Sara Ngo", role: "Engineer", color: "#60A5FA" },
  { initials: "BM", name: "Ben Marsh", role: "Content", color: "#FBBF24" },
  { initials: "RW", name: "Ryan Wu", role: "DevOps", color: "#F472B6" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ value, color }: { value: number; color: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function AvatarStack({ initials, colors }: { initials: string[]; colors?: string[] }) {
  return (
    <div className="flex -space-x-1.5">
      {(initials ?? []).slice(0, 4).map((init, i) => (
        <div
          key={i}
          className="w-6 h-6 rounded-full border-2 border-[#1E1E2E] flex items-center justify-center text-[9px] font-bold text-white"
          style={{ backgroundColor: colors?.[i] ?? "#7B68EE" }}
          title={init}
        >
          {init.charAt(0)}
        </div>
      ))}
      {initials.length > 4 && (
        <div className="w-6 h-6 rounded-full border-2 border-[#1E1E2E] bg-white/10 flex items-center justify-center text-[9px] font-bold text-white/60">
          +{initials.length - 4}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ color: cfg?.color ?? "#94A3B8", backgroundColor: cfg?.bg ?? "#F1F5F9" }}
    >
      {cfg?.label ?? status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ color: cfg?.color ?? "#7B68EE", backgroundColor: cfg?.bg ?? "#F0EEFF" }}
    >
      {cfg?.label ?? priority}
    </span>
  );
}

// ─── Space Card ───────────────────────────────────────────────────────────────

function SpaceCard({
  space,
  isExpanded,
  onToggle,
}: {
  space: SpaceData;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const pct = space.taskCount > 0 ? Math.round((space.completedCount / space.taskCount) * 100) : 0;

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : scaleIn}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
    >
      {/* Space Header */}
      <div
        className="flex items-center gap-4 p-5 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-md"
          style={{ backgroundColor: `${space.color}22`, border: `1.5px solid ${space.color}44` }}
        >
          {space.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-white font-semibold text-base truncate">{space.name}</h3>
            {space.isPrivate ? (
              <Lock className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
            ) : (
              <Globe className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
            )}
            {space.isFavorite && <Star className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 fill-yellow-400" />}
          </div>
          <p className="text-white/50 text-xs truncate">{space.description}</p>
        </div>
        <div className="hidden sm:flex items-center gap-5 mr-2">
          <div className="text-center">
            <div className="text-white font-semibold text-sm">{space.taskCount}</div>
            <div className="text-white/40 text-xs">Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-white font-semibold text-sm">{space.memberCount}</div>
            <div className="text-white/40 text-xs">Members</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-sm" style={{ color: space.color }}>{pct}%</div>
            <div className="text-white/40 text-xs">Done</div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/40"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-3">
        <ProgressBar value={pct} color={space.color} />
      </div>

      {/* Expanded Lists */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/8 px-5 py-3 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/50 text-xs font-medium uppercase tracking-wider">Lists</span>
                <button className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Add List
                </button>
              </div>
              {(space.lists ?? []).map((list) => (
                <motion.div
                  key={list.id}
                  whileHover={shouldReduceMotion ? {} : { x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/4 hover:bg-white/8 transition-colors cursor-pointer group"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: list.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/90 text-sm font-medium truncate">{list.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={list.status} />
                      <PriorityBadge priority={list.priority} />
                      <span className="text-white/30 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {list.dueDate}
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <AvatarStack initials={list.assignees} />
                    <span className="text-white/40 text-xs whitespace-nowrap">
                      {list.completedCount}/{list.taskCount}
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WorkspaceOverviewPage() {
  const shouldReduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSpaces, setExpandedSpaces] = useState<Set<string>>(new Set(["sp-1", "sp-2"]));
  const [activeTab, setActiveTab] = useState<"spaces" | "members" | "activity">("spaces");
  const [filterPrivate, setFilterPrivate] = useState<"all" | "public" | "private">("all");

  const toggleSpace = (id: string) => {
    setExpandedSpaces((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredSpaces = (SPACES ?? []).filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterPrivate === "all" ||
      (filterPrivate === "private" && s.isPrivate) ||
      (filterPrivate === "public" && !s.isPrivate);
    return matchesSearch && matchesFilter;
  });

  const totalTasks = SPACES.reduce((sum, s) => sum + s.taskCount, 0);
  const totalCompleted = SPACES.reduce((sum, s) => sum + s.completedCount, 0);
  const overallPct = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#13131F] text-white">
      {/* ── Hero / Header ── */}
      <section className="bg-gradient-to-br from-[#1E1E2E] via-[#1a1a2e] to-[#13131F] border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            variants={shouldReduceMotion ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            <motion.div variants={shouldReduceMotion ? {} : fadeInUp}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center shadow-lg">
                  <Layout className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{WORKSPACE.name}</h1>
                  <p className="text-white/50 text-sm">{WORKSPACE.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7B68EE]/20 text-[#9B8FFF] text-xs font-medium border border-[#7B68EE]/30">
                  <Sparkles className="w-3 h-3" />
                  {WORKSPACE.plan} Plan
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 text-white/60 text-xs font-medium">
                  <Users className="w-3 h-3" />
                  {WORKSPACE.memberCount} members
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/8 text-white/60 text-xs font-medium">
                  <CheckSquare className="w-3 h-3" />
                  {WORKSPACE.taskCount} tasks
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="flex items-center gap-3 flex-wrap"
            >
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/8 hover:bg-white/12 text-white/70 hover:text-white text-sm font-medium transition-colors border border-white/10"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] text-white text-sm font-semibold shadow-lg shadow-[#7B68EE]/25 hover:shadow-[#7B68EE]/40 transition-shadow"
              >
                <Plus className="w-4 h-4" />
                New Space
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stat Cards */}
          <motion.div
            variants={shouldReduceMotion ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8"
          >
            {[
              { label: "Total Spaces", value: SPACES.length, icon: FolderOpen, color: "#7B68EE" },
              { label: "Total Tasks", value: totalTasks, icon: CheckSquare, color: "#6BCB77" },
              { label: "Completed", value: totalCompleted, icon: Check, color: "#4ADE80" },
              { label: "Overall Progress", value: `${overallPct}%`, icon: Target, color: "#FF9F43" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={shouldReduceMotion ? {} : scaleIn}
                whileHover={shouldReduceMotion ? {} : { y: -2 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/50 text-xs font-medium">{stat.label}</span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}22` }}
                  >
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 border-b border-white/8 mt-6">
          {(["spaces", "members", "activity"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium capitalize transition-colors relative ${
                activeTab === tab ? "text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7B68EE] rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ── Spaces Tab ── */}
        {activeTab === "spaces" && (
          <motion.div
            variants={shouldReduceMotion ? {} : fadeIn}
            initial="hidden"
            animate="visible"
            className="py-6"
          >
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search spaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white/6 border border-white/10 rounded-xl text-white/80 placeholder-white/30 text-sm focus:outline-none focus:border-[#7B68EE]/60 focus:bg-white/8 transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                {(["all", "public", "private"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterPrivate(f)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                      filterPrivate === f
                        ? "bg-[#7B68EE]/20 text-[#9B8FFF] border border-[#7B68EE]/30"
                        : "bg-white/6 text-white/50 hover:text-white/80 border border-white/8"
                    }`}
                  >
                    {f === "all" ? "All Spaces" : f === "public" ? (
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" />Public</span>
                    ) : (
                      <span className="flex items-center gap-1"><Lock className="w-3 h-3" />Private</span>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setExpandedSpaces(new Set(SPACES.map((s) => s.id)))}
                className="ml-auto text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
              >
                <ChevronDown className="w-3.5 h-3.5" />
                Expand All
              </button>
            </div>

            {/* Space Cards */}
            <motion.div
              variants={shouldReduceMotion ? {} : staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredSpaces.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                  <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No spaces match your search.</p>
                </div>
              ) : (
                filteredSpaces.map((space) => (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    isExpanded={expandedSpaces.has(space.id)}
                    onToggle={() => toggleSpace(space.id)}
                  />
                ))
              )}
            </motion.div>

            {/* Add Space CTA */}
            <motion.button
              variants={shouldReduceMotion ? {} : fadeInUp}
              initial="hidden"
              animate="visible"
              whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.99 }}
              className="mt-4 w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-white/10 hover:border-[#7B68EE]/40 text-white/40 hover:text-[#9B8FFF] transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Create a new space
            </motion.button>
          </motion.div>
        )}

        {/* ── Members Tab ── */}
        {activeTab === "members" && (
          <motion.div
            variants={shouldReduceMotion ? {} : fadeIn}
            initial="hidden"
            animate="visible"
            className="py-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">
                Team Members <span className="text-white/40 font-normal text-base ml-1">({MEMBERS.length})</span>
              </h2>
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7B68EE]/20 text-[#9B8FFF] text-sm font-medium border border-[#7B68EE]/30 hover:bg-[#7B68EE]/30 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Invite Member
              </motion.button>
            </div>
            <motion.div
              variants={shouldReduceMotion ? {} : staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {MEMBERS.map((member) => (
                <motion.div
                  key={member.initials}
                  variants={shouldReduceMotion ? {} : scaleIn}
                  whileHover={shouldReduceMotion ? {} : { y: -3 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors text-center"
                >
                  <div
                    className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-xl font-bold text-white shadow-lg"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.initials}
                  </div>
                  <div className="text-white font-semibold text-sm mb-0.5">{member.name}</div>
                  <div className="text-white/40 text-xs mb-3">{member.role}</div>
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1.5 rounded-lg bg-white/8 hover:bg-white/14 text-white/50 hover:text-white transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg bg-white/8 hover:bg-white/14 text-white/50 hover:text-white transition-colors">
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ── Activity Tab ── */}
        {activeTab === "activity" && (
          <motion.div
            variants={shouldReduceMotion ? {} : fadeIn}
            initial="hidden"
            animate="visible"
            className="py-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-semibold text-lg">Recent Activity</h2>
              <span className="text-white/40 text-xs">Last 24 hours</span>
            </div>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map((item, i) => (
                <motion.div
                  key={item.id}
                  variants={shouldReduceMotion ? {} : fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-4 p-4 bg-white/4 border border-white/8 rounded-2xl hover:bg-white/6 transition-colors"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: item.userColor }}
                  >
                    {item.user}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm">
                      <span className="text-white font-medium">{item.userName}</span>{" "}
                      <span className="text-white/50">{item.action}</span>{" "}
                      <span className="text-white/80 font-medium">"{item.target}"</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${SPACES.find((s) => s.name === item.space)?.color ?? "#7B68EE"}22`,
                          color: SPACES.find((s) => s.name === item.space)?.color ?? "#9B8FFF",
                        }}
                      >
                        {item.space}
                      </span>
                      <span className="text-white/30 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            <motion.div
              variants={shouldReduceMotion ? {} : staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
            >
              {[
                { label: "Tasks completed today", value: "12", icon: Check, color: "#6BCB77" },
                { label: "Active members", value: "8", icon: Activity, color: "#7B68EE" },
                { label: "Overdue tasks", value: "3", icon: AlertCircle, color: "#FF6B6B" },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  variants={shouldReduceMotion ? {} : scaleIn}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${s.color}22` }}
                  >
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-white/50 text-xs">{s.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ── Quick Links ── */}
        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8 border-t border-white/8 mt-2"
        >
          {[
            {
              href: "/dashboard",
              icon: Activity,
              label: "Go to Dashboard",
              desc: "View stats, charts, and task overview",
              color: "#7B68EE",
            },
            {
              href: "/workspace",
              icon: Layout,
              label: "Kanban Board",
              desc: "Drag-and-drop task management",
              color: "#6BCB77",
            },
            {
              href: "/notifications",
              icon: Zap,
              label: "Notifications",
              desc: "Stay up to date with your team",
              color: "#FF9F43",
            },
          ].map((item) => (
            <motion.div key={item.href} variants={shouldReduceMotion ? {} : fadeInUp}>
              <Link
                href={item.href}
                className="flex items-center gap-4 p-4 bg-white/4 border border-white/8 rounded-2xl hover:bg-white/8 hover:border-white/16 transition-colors group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${item.color}22` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm">{item.label}</div>
                  <div className="text-white/40 text-xs truncate">{item.desc}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}

// ─── Missing icon import fix ──────────────────────────────────────────────────
function Mail({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}