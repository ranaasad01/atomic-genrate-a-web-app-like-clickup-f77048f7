"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  fadeInUp,
  fadeIn,
  staggerContainer,
  scaleIn,
} from "@/lib/motion";
import { Folder, FolderOpen, ChevronDown, ChevronRight, Plus, MoreHorizontal, List, Star, Users, Calendar, CheckCircle, Circle, Search, Filter, Grid, LayoutList, Rocket, Palette, Code, Megaphone, Settings, Eye, Edit, Trash2, ArrowRight, Activity, Clock } from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface ListItem {
  id: string;
  name: string;
  taskCount: number;
  completedCount: number;
  color: string;
  dueDate: string;
  members: string[];
  status: "active" | "on_hold" | "completed";
}

interface FolderItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  lists: ListItem[];
  starred: boolean;
}

const SPACE = {
  id: "space-001",
  name: "Product Development",
  description: "All product planning, design, and engineering work lives here.",
  color: "#7B68EE",
  memberCount: 12,
  totalTasks: 148,
  completedTasks: 89,
};

const FOLDERS: FolderItem[] = [
  {
    id: "folder-1",
    name: "Design System",
    icon: "palette",
    color: "#FF6B9D",
    description: "UI components, tokens, and brand guidelines",
    starred: true,
    lists: [
      {
        id: "list-1-1",
        name: "Component Library",
        taskCount: 24,
        completedCount: 18,
        color: "#FF6B9D",
        dueDate: "Dec 20",
        members: ["A", "B", "C"],
        status: "active",
      },
      {
        id: "list-1-2",
        name: "Design Tokens",
        taskCount: 12,
        completedCount: 12,
        color: "#FF9F43",
        dueDate: "Dec 15",
        members: ["A", "D"],
        status: "completed",
      },
      {
        id: "list-1-3",
        name: "Accessibility Audit",
        taskCount: 8,
        completedCount: 3,
        color: "#7B68EE",
        dueDate: "Jan 5",
        members: ["B", "E"],
        status: "active",
      },
    ],
  },
  {
    id: "folder-2",
    name: "Engineering",
    icon: "code",
    color: "#7B68EE",
    description: "Backend services, APIs, and infrastructure tasks",
    starred: false,
    lists: [
      {
        id: "list-2-1",
        name: "API v2 Migration",
        taskCount: 31,
        completedCount: 14,
        color: "#7B68EE",
        dueDate: "Jan 10",
        members: ["C", "F", "G"],
        status: "active",
      },
      {
        id: "list-2-2",
        name: "Performance Optimization",
        taskCount: 15,
        completedCount: 7,
        color: "#6BCB77",
        dueDate: "Jan 20",
        members: ["F", "H"],
        status: "active",
      },
      {
        id: "list-2-3",
        name: "Security Hardening",
        taskCount: 10,
        completedCount: 2,
        color: "#FF6B6B",
        dueDate: "Feb 1",
        members: ["G", "I"],
        status: "on_hold",
      },
      {
        id: "list-2-4",
        name: "CI/CD Pipeline",
        taskCount: 7,
        completedCount: 7,
        color: "#6BCB77",
        dueDate: "Dec 10",
        members: ["C"],
        status: "completed",
      },
    ],
  },
  {
    id: "folder-3",
    name: "Marketing",
    icon: "megaphone",
    color: "#FFD93D",
    description: "Campaigns, content, and growth initiatives",
    starred: true,
    lists: [
      {
        id: "list-3-1",
        name: "Q1 Launch Campaign",
        taskCount: 19,
        completedCount: 5,
        color: "#FFD93D",
        dueDate: "Jan 15",
        members: ["J", "K"],
        status: "active",
      },
      {
        id: "list-3-2",
        name: "Blog Content Calendar",
        taskCount: 22,
        completedCount: 11,
        color: "#FF9F43",
        dueDate: "Ongoing",
        members: ["K", "L"],
        status: "active",
      },
    ],
  },
  {
    id: "folder-4",
    name: "Product Roadmap",
    icon: "rocket",
    color: "#6BCB77",
    description: "Feature planning, prioritization, and milestones",
    starred: false,
    lists: [
      {
        id: "list-4-1",
        name: "Q1 2025 Features",
        taskCount: 18,
        completedCount: 6,
        color: "#6BCB77",
        dueDate: "Mar 31",
        members: ["A", "C", "F"],
        status: "active",
      },
      {
        id: "list-4-2",
        name: "Backlog",
        taskCount: 45,
        completedCount: 0,
        color: "#94A3B8",
        dueDate: "—",
        members: ["A"],
        status: "on_hold",
      },
    ],
  },
];

const STANDALONE_LISTS: ListItem[] = [
  {
    id: "sl-1",
    name: "Team Onboarding",
    taskCount: 9,
    completedCount: 9,
    color: "#6BCB77",
    dueDate: "Dec 1",
    members: ["A", "B"],
    status: "completed",
  },
  {
    id: "sl-2",
    name: "Bug Tracker",
    taskCount: 33,
    completedCount: 21,
    color: "#FF6B6B",
    dueDate: "Ongoing",
    members: ["C", "F", "G", "H"],
    status: "active",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  palette: Palette,
  code: Code,
  megaphone: Megaphone,
  rocket: Rocket,
};

const MEMBER_COLORS = [
  "bg-purple-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-rose-500",
  "bg-emerald-500",
];

function getMemberColor(letter: string): string {
  const idx = letter.charCodeAt(0) - 65;
  return MEMBER_COLORS[idx % MEMBER_COLORS.length] ?? "bg-purple-500";
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: ListItem["status"] }) {
  const cfg = {
    active: { label: "Active", cls: "bg-purple-500/20 text-purple-300" },
    on_hold: { label: "On Hold", cls: "bg-yellow-500/20 text-yellow-300" },
    completed: { label: "Done", cls: "bg-green-500/20 text-green-300" },
  };
  const { label, cls } = cfg[status] ?? cfg.active;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  );
}

function MemberAvatars({ members }: { members: string[] }) {
  const shown = (members ?? []).slice(0, 4);
  return (
    <div className="flex -space-x-1.5">
      {shown.map((m) => (
        <div
          key={m}
          className={`w-6 h-6 rounded-full ${getMemberColor(m)} flex items-center justify-center text-white text-[10px] font-bold border-2 border-[#1E1E2E]`}
        >
          {m}
        </div>
      ))}
      {(members?.length ?? 0) > 4 && (
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-[10px] font-bold border-2 border-[#1E1E2E]">
          +{(members?.length ?? 0) - 4}
        </div>
      )}
    </div>
  );
}

// ─── List Row ─────────────────────────────────────────────────────────────────

function ListRow({ list }: { list: ListItem }) {
  const pct =
    list.taskCount > 0
      ? Math.round((list.completedCount / list.taskCount) * 100)
      : 0;

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.04)" }}
      className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors group"
    >
      {/* Color dot + name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: list.color }}
        />
        <List className="w-4 h-4 text-white/30 flex-shrink-0" />
        <span className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
          {list.name}
        </span>
      </div>

      {/* Progress */}
      <div className="hidden sm:flex items-center gap-2 w-28">
        <ProgressBar value={pct} color={list.color} />
        <span className="text-xs text-white/40 w-8 text-right">{pct}%</span>
      </div>

      {/* Tasks */}
      <div className="hidden md:flex items-center gap-1 text-xs text-white/50 w-20">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>
          {list.completedCount}/{list.taskCount}
        </span>
      </div>

      {/* Due date */}
      <div className="hidden lg:flex items-center gap-1 text-xs text-white/40 w-20">
        <Calendar className="w-3.5 h-3.5" />
        <span>{list.dueDate}</span>
      </div>

      {/* Members */}
      <div className="hidden md:block">
        <MemberAvatars members={list.members} />
      </div>

      {/* Status */}
      <div className="hidden sm:block">
        <StatusBadge status={list.status} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
          <Eye className="w-3.5 h-3.5" />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-red-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Folder Card ──────────────────────────────────────────────────────────────

function FolderCard({ folder }: { folder: FolderItem }) {
  const [open, setOpen] = useState(true);
  const [starred, setStarred] = useState(folder.starred);
  const [menuOpen, setMenuOpen] = useState(false);

  const IconComp = ICON_MAP[folder.icon] ?? Folder;
  const totalTasks = (folder.lists ?? []).reduce(
    (acc, l) => acc + (l.taskCount ?? 0),
    0
  );
  const completedTasks = (folder.lists ?? []).reduce(
    (acc, l) => acc + (l.completedCount ?? 0),
    0
  );
  const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <motion.div
      variants={scaleIn}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
    >
      {/* Folder Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${folder.color}22` }}
        >
          <IconComp className="w-5 h-5" style={{ color: folder.color }} />
        </div>

        {/* Name + desc */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm">
              {folder.name}
            </span>
            <span className="text-xs text-white/40 bg-white/8 px-2 py-0.5 rounded-full">
              {(folder.lists ?? []).length} lists
            </span>
          </div>
          <p className="text-xs text-white/40 truncate mt-0.5">
            {folder.description}
          </p>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4 mr-4">
          <div className="flex items-center gap-1.5 w-24">
            <ProgressBar value={pct} color={folder.color} />
            <span className="text-xs text-white/40">{pct}%</span>
          </div>
          <div className="text-xs text-white/40">
            {completedTasks}/{totalTasks} tasks
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setStarred((s) => !s)}
            className={`p-1.5 rounded-lg transition-colors ${
              starred
                ? "text-yellow-400 hover:bg-yellow-400/10"
                : "text-white/30 hover:text-white/60 hover:bg-white/10"
            }`}
          >
            <Star className={`w-4 h-4 ${starred ? "fill-yellow-400" : ""}`} />
          </motion.button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((m) => !m)}
              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 w-40 bg-[#2A2A3E] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden"
                >
                  {["Rename", "Duplicate", "Move", "Delete"].map((action) => (
                    <button
                      key={action}
                      onClick={() => setMenuOpen(false)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/8 ${
                        action === "Delete"
                          ? "text-red-400 hover:text-red-300"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {action}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/30"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.div>
      </div>

      {/* Lists */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/8 px-2 py-2">
              {/* Column headers */}
              <div className="flex items-center gap-4 px-4 py-1.5 mb-1">
                <span className="flex-1 text-xs text-white/30 font-medium uppercase tracking-wide">
                  List Name
                </span>
                <span className="hidden sm:block text-xs text-white/30 font-medium uppercase tracking-wide w-28 text-right">
                  Progress
                </span>
                <span className="hidden md:block text-xs text-white/30 font-medium uppercase tracking-wide w-20 text-right">
                  Tasks
                </span>
                <span className="hidden lg:block text-xs text-white/30 font-medium uppercase tracking-wide w-20 text-right">
                  Due
                </span>
                <span className="hidden md:block text-xs text-white/30 font-medium uppercase tracking-wide w-20 text-right">
                  Members
                </span>
                <span className="hidden sm:block text-xs text-white/30 font-medium uppercase tracking-wide w-16 text-right">
                  Status
                </span>
                <span className="w-20" />
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {(folder.lists ?? []).map((list) => (
                  <ListRow key={list.id} list={list} />
                ))}
              </motion.div>

              {/* Add list */}
              <motion.button
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/40 hover:text-white/70 transition-colors w-full"
              >
                <Plus className="w-4 h-4" />
                <span>Add list</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Standalone List Card ─────────────────────────────────────────────────────

function StandaloneListCard({ list }: { list: ListItem }) {
  const pct =
    list.taskCount > 0
      ? Math.round((list.completedCount / list.taskCount) * 100)
      : 0;

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(123,104,238,0.15)" }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 cursor-pointer group transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: list.color }}
          />
          <span className="font-semibold text-white text-sm">{list.name}</span>
        </div>
        <StatusBadge status={list.status} />
      </div>

      <div className="mb-3">
        <ProgressBar value={pct} color={list.color} />
      </div>

      <div className="flex items-center justify-between text-xs text-white/40">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>
            {list.completedCount}/{list.taskCount} tasks
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{list.dueDate}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <MemberAvatars members={list.members} />
        <motion.button
          whileHover={{ x: 2 }}
          className="flex items-center gap-1 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Open <ArrowRight className="w-3 h-3" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar() {
  const stats = [
    {
      label: "Total Tasks",
      value: SPACE.totalTasks,
      icon: Activity,
      color: "#7B68EE",
    },
    {
      label: "Completed",
      value: SPACE.completedTasks,
      icon: CheckCircle,
      color: "#6BCB77",
    },
    {
      label: "In Progress",
      value: SPACE.totalTasks - SPACE.completedTasks,
      icon: Clock,
      color: "#FFD93D",
    },
    {
      label: "Members",
      value: SPACE.memberCount,
      icon: Users,
      color: "#FF9F43",
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            variants={scaleIn}
            whileHover={{ y: -2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${s.color}22` }}
            >
              <Icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-white/40">{s.label}</div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SpaceViewPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed" | "on_hold">("all");

  const filteredFolders = FOLDERS.map((folder) => ({
    ...folder,
    lists: (folder.lists ?? []).filter((list) => {
      const matchesSearch = list.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        filterStatus === "all" || list.status === filterStatus;
      return matchesSearch && matchesFilter;
    }),
  })).filter(
    (folder) =>
      folder.lists.length > 0 ||
      folder.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStandalone = STANDALONE_LISTS.filter((list) => {
    const matchesSearch = list.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || list.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const overallPct =
    SPACE.totalTasks > 0
      ? Math.round((SPACE.completedTasks / SPACE.totalTasks) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#1E1E2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Space Header ── */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {SPACE.name}
                </h1>
                <p className="text-white/50 text-sm mt-0.5">
                  {SPACE.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-xs text-white/40">
                    <Users className="w-3.5 h-3.5" />
                    <span>{SPACE.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${overallPct}%` }}
                      />
                    </div>
                    <span>{overallPct}% complete</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/8 hover:bg-white/12 text-white/70 hover:text-white text-sm font-medium transition-colors border border-white/10"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] text-white text-sm font-semibold shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40"
              >
                <Plus className="w-4 h-4" />
                <span>New Folder</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <StatsBar />

        {/* ── Toolbar ── */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-3 mb-6 flex-wrap"
        >
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search folders and lists…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/8 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-1 bg-white/8 border border-white/10 rounded-xl p-1">
            {(["all", "active", "on_hold", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === f
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {f === "all"
                  ? "All"
                  : f === "on_hold"
                  ? "On Hold"
                  : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-white/8 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-purple-600 text-white"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-purple-600 text-white"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/8 border border-white/10 text-white/60 hover:text-white text-sm transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </motion.button>
        </motion.div>

        {/* ── Folders ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4 mb-8"
        >
          {filteredFolders.length > 0 ? (
            filteredFolders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))
          ) : (
            <motion.div
              variants={fadeIn}
              className="text-center py-16 text-white/30"
            >
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No folders match your search.</p>
            </motion.div>
          )}
        </motion.div>

        {/* ── Standalone Lists ── */}
        {filteredStandalone.length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white/80 flex items-center gap-2">
                <List className="w-4 h-4 text-purple-400" />
                Standalone Lists
              </h2>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add list
              </motion.button>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              }
            >
              {filteredStandalone.map((list) =>
                viewMode === "grid" ? (
                  <StandaloneListCard key={list.id} list={list} />
                ) : (
                  <motion.div
                    key={list.id}
                    variants={fadeInUp}
                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                  >
                    <div className="px-2 py-2">
                      <div className="flex items-center gap-4 px-4 py-1.5 mb-1">
                        <span className="flex-1 text-xs text-white/30 font-medium uppercase tracking-wide">
                          List Name
                        </span>
                        <span className="hidden sm:block text-xs text-white/30 font-medium uppercase tracking-wide w-28 text-right">
                          Progress
                        </span>
                        <span className="hidden md:block text-xs text-white/30 font-medium uppercase tracking-wide w-20 text-right">
                          Tasks
                        </span>
                        <span className="hidden lg:block text-xs text-white/30 font-medium uppercase tracking-wide w-20 text-right">
                          Due
                        </span>
                        <span className="hidden md:block text-xs text-white/30 font-medium uppercase tracking-wide w-20 text-right">
                          Members
                        </span>
                        <span className="hidden sm:block text-xs text-white/30 font-medium uppercase tracking-wide w-16 text-right">
                          Status
                        </span>
                        <span className="w-20" />
                      </div>
                      <ListRow list={list} />
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          </motion.div>
        )}

        {/* ── Empty state if nothing at all ── */}
        {filteredFolders.length === 0 && filteredStandalone.length === 0 && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center py-24"
          >
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-lg font-semibold text-white/50 mb-2">
              Nothing found
            </h3>
            <p className="text-sm text-white/30 mb-6">
              Try adjusting your search or filter.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setSearch("");
                setFilterStatus("all");
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
            >
              Clear filters
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}