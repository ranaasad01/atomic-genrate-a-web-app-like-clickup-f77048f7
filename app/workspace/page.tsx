"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { Plus, X, Users, ChevronRight, Folder, FolderOpen, CheckCircle, Circle, MoreHorizontal, Search, Sparkles, Layout, Star, Activity, Clock } from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const WORKSPACE = {
  id: "ws-1",
  name: "Acme Corp",
  description: "Main product development workspace",
  members: [
    { id: "u1", name: "Alex Rivera", color: "#7B68EE", initials: "AR" },
    { id: "u2", name: "Sam Chen", color: "#FF6B6B", initials: "SC" },
    { id: "u3", name: "Jordan Lee", color: "#6BCB77", initials: "JL" },
    { id: "u4", name: "Morgan Kim", color: "#FFD93D", initials: "MK" },
    { id: "u5", name: "Taylor Patel", color: "#FF9F43", initials: "TP" },
    { id: "u6", name: "Casey Wu", color: "#54A0FF", initials: "CW" },
  ],
};

const SPACES = [
  {
    id: "sp-1",
    name: "Product Design",
    color: "#7B68EE",
    icon: "🎨",
    taskCount: 24,
    completedCount: 14,
    memberCount: 4,
    lists: ["UI Components", "User Research", "Prototypes"],
    starred: true,
  },
  {
    id: "sp-2",
    name: "Engineering",
    color: "#54A0FF",
    icon: "⚙️",
    taskCount: 41,
    completedCount: 28,
    memberCount: 6,
    lists: ["Backend API", "Frontend", "DevOps", "QA"],
    starred: false,
  },
  {
    id: "sp-3",
    name: "Marketing",
    color: "#FF6B6B",
    icon: "📣",
    taskCount: 18,
    completedCount: 9,
    memberCount: 3,
    lists: ["Campaigns", "Content", "Analytics"],
    starred: false,
  },
  {
    id: "sp-4",
    name: "Growth & Sales",
    color: "#6BCB77",
    icon: "📈",
    taskCount: 32,
    completedCount: 20,
    memberCount: 5,
    lists: ["Pipeline", "Outreach", "Partnerships"],
    starred: true,
  },
  {
    id: "sp-5",
    name: "Customer Success",
    color: "#FFD93D",
    icon: "💬",
    taskCount: 15,
    completedCount: 11,
    memberCount: 3,
    lists: ["Support Tickets", "Onboarding", "Feedback"],
    starred: false,
  },
  {
    id: "sp-6",
    name: "Operations",
    color: "#FF9F43",
    icon: "🏗️",
    taskCount: 22,
    completedCount: 16,
    memberCount: 4,
    lists: ["HR", "Finance", "Legal", "IT"],
    starred: false,
  },
];

const FOLDERS = [
  {
    id: "f-1",
    name: "Q1 2025 Roadmap",
    spaceId: "sp-1",
    spaceName: "Product Design",
    spaceColor: "#7B68EE",
    listCount: 5,
    taskCount: 38,
  },
  {
    id: "f-2",
    name: "Launch Checklist",
    spaceId: "sp-2",
    spaceName: "Engineering",
    spaceColor: "#54A0FF",
    listCount: 3,
    taskCount: 21,
  },
  {
    id: "f-3",
    name: "Brand Refresh",
    spaceId: "sp-3",
    spaceName: "Marketing",
    spaceColor: "#FF6B6B",
    listCount: 4,
    taskCount: 17,
  },
];

const RECENT_TASKS = [
  {
    id: "t1",
    title: "Finalize onboarding flow wireframes",
    status: "in_progress",
    priority: "high",
    spaceName: "Product Design",
    spaceColor: "#7B68EE",
    dueDate: "Jan 28",
  },
  {
    id: "t2",
    title: "Set up CI/CD pipeline for staging",
    status: "review",
    priority: "urgent",
    spaceName: "Engineering",
    spaceColor: "#54A0FF",
    dueDate: "Jan 25",
  },
  {
    id: "t3",
    title: "Write Q1 newsletter copy",
    status: "todo",
    priority: "normal",
    spaceName: "Marketing",
    spaceColor: "#FF6B6B",
    dueDate: "Feb 1",
  },
  {
    id: "t4",
    title: "Update sales deck with new pricing",
    status: "done",
    priority: "high",
    spaceName: "Growth & Sales",
    spaceColor: "#6BCB77",
    dueDate: "Jan 22",
  },
];

const STATUS_COLORS: Record<string, { dot: string; label: string }> = {
  todo: { dot: "#94A3B8", label: "To Do" },
  in_progress: { dot: "#7B68EE", label: "In Progress" },
  review: { dot: "#FFD93D", label: "Review" },
  done: { dot: "#6BCB77", label: "Done" },
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "#FF6B6B",
  high: "#FF9F43",
  normal: "#7B68EE",
  low: "#6BCB77",
};

// ─── Progress Ring ─────────────────────────────────────────────────────────────

function ProgressRing({
  progress,
  color,
  size = 44,
}: {
  progress: number;
  color: string;
  size?: number;
}) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E2E8F0"
        strokeWidth={4}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

// ─── Create Space Modal ────────────────────────────────────────────────────────

const SPACE_COLORS = [
  "#7B68EE",
  "#54A0FF",
  "#FF6B6B",
  "#6BCB77",
  "#FFD93D",
  "#FF9F43",
  "#A29BFE",
  "#FD79A8",
];
const SPACE_ICONS = ["🚀", "🎨", "⚙️", "📣", "📈", "💬", "🏗️", "🔬", "📦", "🌟"];

function CreateSpaceModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(SPACE_COLORS[0] ?? "#7B68EE");
  const [selectedIcon, setSelectedIcon] = useState(SPACE_ICONS[0] ?? "🚀");
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Create New Space</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Preview */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
              style={{ backgroundColor: selectedColor + "22" }}
            >
              {selectedIcon}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {name.trim() || "Space Name"}
              </p>
              <p className="text-sm text-gray-400">0 tasks · 0 members</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Space Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Product Design"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/40 focus:border-[#7B68EE] text-gray-900 placeholder-gray-400 text-sm"
              autoFocus
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {SPACE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: c }}
                >
                  {selectedColor === c && (
                    <CheckCircle className="w-4 h-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <div className="flex gap-2 flex-wrap">
              {SPACE_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all hover:scale-110 ${
                    selectedIcon === icon
                      ? "bg-[#7B68EE]/15 ring-2 ring-[#7B68EE]"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#7B68EE] text-white text-sm font-medium hover:bg-[#6A58DD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Space
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Space Card ────────────────────────────────────────────────────────────────

function SpaceCard({
  space,
}: {
  space: (typeof SPACES)[number];
}) {
  const shouldReduceMotion = useReducedMotion();
  const progress = space.taskCount > 0
    ? Math.round((space.completedCount / space.taskCount) * 100)
    : 0;

  return (
    <Link href={`/space/${space.id}`}>
      <motion.div
        variants={scaleIn}
        whileHover={
          shouldReduceMotion
            ? {}
            : { y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }
        }
        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
        className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer group relative overflow-hidden"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
      >
        {/* Accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{ backgroundColor: space.color }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mt-1 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm"
              style={{ backgroundColor: space.color + "22" }}
            >
              {space.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-[#7B68EE] transition-colors">
                {space.name}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {space.memberCount} member{space.memberCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {space.starred && (
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            )}
            <button
              onClick={(e) => e.preventDefault()}
              className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">{space.taskCount}</p>
            <p className="text-xs text-gray-400">total tasks</p>
          </div>
          <div className="relative flex items-center justify-center">
            <ProgressRing progress={progress} color={space.color} size={44} />
            <span
              className="absolute text-[10px] font-bold"
              style={{ color: space.color }}
            >
              {progress}%
            </span>
          </div>
        </div>

        {/* Lists */}
        <div className="space-y-1.5">
          {(space.lists ?? []).slice(0, 3).map((list) => (
            <div key={list} className="flex items-center gap-2">
              <Circle className="w-3 h-3 text-gray-300 flex-shrink-0" />
              <span className="text-xs text-gray-500 truncate">{list}</span>
            </div>
          ))}
          {space.lists.length > 3 && (
            <p className="text-xs text-gray-400 pl-5">
              +{space.lists.length - 3} more
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-gray-400">
              {space.completedCount} done
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#7B68EE] group-hover:translate-x-0.5 transition-all" />
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function WorkspacePage() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"spaces" | "folders" | "recent">("spaces");
  const shouldReduceMotion = useReducedMotion();

  const filteredSpaces = SPACES.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTasks = SPACES.reduce((sum, s) => sum + s.taskCount, 0);
  const totalDone = SPACES.reduce((sum, s) => sum + s.completedCount, 0);
  const overallProgress = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  return (
    <>
      <main className="min-h-screen bg-[#F4F4F8]">
        {/* ── Page Header ── */}
        <motion.div
          variants={shouldReduceMotion ? {} : fadeIn}
          initial="hidden"
          animate="visible"
          className="bg-[#1E1E2E] text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              {/* Workspace Info */}
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={shouldReduceMotion ? {} : { rotate: 8, scale: 1.05 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center shadow-lg text-2xl"
                >
                  🏢
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {WORKSPACE.name}
                  </h1>
                  <p className="text-white/50 text-sm mt-0.5">
                    {WORKSPACE.description}
                  </p>
                </div>
              </div>

              {/* Members + Stats */}
              <div className="flex items-center gap-6">
                {/* Member Avatars */}
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {WORKSPACE.members.slice(0, 5).map((m) => (
                      <motion.div
                        key={m.id}
                        whileHover={shouldReduceMotion ? {} : { y: -3, zIndex: 10 }}
                        title={m.name}
                        className="w-8 h-8 rounded-full border-2 border-[#1E1E2E] flex items-center justify-center text-xs font-bold text-white shadow-sm cursor-pointer"
                        style={{ backgroundColor: m.color }}
                      >
                        {m.initials}
                      </motion.div>
                    ))}
                    {WORKSPACE.members.length > 5 && (
                      <div className="w-8 h-8 rounded-full border-2 border-[#1E1E2E] bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                        +{WORKSPACE.members.length - 5}
                      </div>
                    )}
                  </div>
                  <span className="ml-3 text-sm text-white/50">
                    {WORKSPACE.members.length} members
                  </span>
                </div>

                {/* Quick Stats */}
                <div className="hidden md:flex items-center gap-4 pl-6 border-l border-white/10">
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">{totalTasks}</p>
                    <p className="text-xs text-white/40">Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-[#6BCB77]">{totalDone}</p>
                    <p className="text-xs text-white/40">Done</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-[#7B68EE]">{overallProgress}%</p>
                    <p className="text-xs text-white/40">Progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Toolbar ── */}
        <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 py-3">
              {/* Tabs */}
              <div className="flex items-center gap-1">
                {(["spaces", "folders", "recent"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                      activeTab === tab
                        ? "bg-[#7B68EE]/10 text-[#7B68EE]"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {tab === "spaces" && <Layout className="w-3.5 h-3.5 inline mr-1.5" />}
                    {tab === "folders" && <Folder className="w-3.5 h-3.5 inline mr-1.5" />}
                    {tab === "recent" && <Clock className="w-3.5 h-3.5 inline mr-1.5" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search + Create */}
              <div className="flex items-center gap-2">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search spaces…"
                    className="pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] w-48 bg-gray-50"
                  />
                </div>
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7B68EE] text-white text-sm font-medium hover:bg-[#6A58DD] transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Space</span>
                  <span className="sm:hidden">New</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* SPACES TAB */}
          {activeTab === "spaces" && (
            <motion.div
              key="spaces"
              variants={shouldReduceMotion ? {} : fadeIn}
              initial="hidden"
              animate="visible"
            >
              {filteredSpaces.length === 0 ? (
                <div className="text-center py-20">
                  <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No spaces found</p>
                  <p className="text-gray-300 text-sm mt-1">Try a different search term</p>
                </div>
              ) : (
                <>
                  {/* Starred */}
                  {filteredSpaces.some((s) => s.starred) && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                          Starred
                        </h2>
                      </div>
                      <motion.div
                        variants={shouldReduceMotion ? {} : staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                      >
                        {filteredSpaces
                          .filter((s) => s.starred)
                          .map((space) => (
                            <SpaceCard key={space.id} space={space} />
                          ))}
                      </motion.div>
                    </div>
                  )}

                  {/* All Spaces */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Layout className="w-4 h-4 text-gray-400" />
                      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                        All Spaces
                      </h2>
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-500 font-medium">
                        {filteredSpaces.length}
                      </span>
                    </div>
                    <motion.div
                      variants={shouldReduceMotion ? {} : staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                      {filteredSpaces.map((space) => (
                        <SpaceCard key={space.id} space={space} />
                      ))}
                    </motion.div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* FOLDERS TAB */}
          {activeTab === "folders" && (
            <motion.div
              key="folders"
              variants={shouldReduceMotion ? {} : fadeIn}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-2 mb-6">
                <FolderOpen className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Folders
                </h2>
                <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-500 font-medium">
                  {FOLDERS.length}
                </span>
              </div>

              <motion.div
                variants={shouldReduceMotion ? {} : staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {FOLDERS.map((folder) => (
                  <motion.div
                    key={folder.id}
                    variants={shouldReduceMotion ? {} : fadeInUp}
                    whileHover={
                      shouldReduceMotion
                        ? {}
                        : { x: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }
                    }
                    className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between group cursor-pointer"
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: folder.spaceColor + "22" }}
                      >
                        <Folder
                          className="w-5 h-5"
                          style={{ color: folder.spaceColor }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {folder.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span
                            className="text-xs font-medium"
                            style={{ color: folder.spaceColor }}
                          >
                            {folder.spaceName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {folder.listCount} lists
                          </span>
                          <span className="text-xs text-gray-400">
                            {folder.taskCount} tasks
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#7B68EE] group-hover:translate-x-1 transition-all" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Add Folder */}
              <motion.button
                variants={shouldReduceMotion ? {} : fadeInUp}
                initial="hidden"
                animate="visible"
                whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
                className="mt-4 w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-[#7B68EE]/40 hover:text-[#7B68EE] transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Folder
              </motion.button>
            </motion.div>
          )}

          {/* RECENT TAB */}
          {activeTab === "recent" && (
            <motion.div
              key="recent"
              variants={shouldReduceMotion ? {} : fadeIn}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Recent Tasks
                </h2>
              </div>

              <motion.div
                variants={shouldReduceMotion ? {} : staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {RECENT_TASKS.map((task) => {
                  const statusInfo = STATUS_COLORS[task.status] ?? {
                    dot: "#94A3B8",
                    label: task.status,
                  };
                  const priorityColor =
                    PRIORITY_COLORS[task.priority] ?? "#94A3B8";

                  return (
                    <motion.div
                      key={task.id}
                      variants={shouldReduceMotion ? {} : fadeInUp}
                      whileHover={
                        shouldReduceMotion
                          ? {}
                          : { x: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }
                      }
                      className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between group cursor-pointer"
                      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: statusInfo.dot }}
                        />
                        <div>
                          <p
                            className={`font-medium text-sm ${
                              task.status === "done"
                                ? "line-through text-gray-400"
                                : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span
                              className="text-xs font-medium"
                              style={{ color: task.spaceColor }}
                            >
                              {task.spaceName}
                            </span>
                            <span className="text-xs text-gray-400">
                              Due {task.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: priorityColor + "18",
                            color: priorityColor,
                          }}
                        >
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}
                        </span>
                        <span
                          className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: statusInfo.dot + "18",
                            color: statusInfo.dot,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#7B68EE] transition-colors" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}

          {/* ── Overall Progress Banner ── */}
          <motion.div
            variants={shouldReduceMotion ? {} : fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-10 bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <h3 className="text-lg font-bold">Workspace Progress</h3>
              <p className="text-white/70 text-sm mt-0.5">
                {totalDone} of {totalTasks} tasks completed across all spaces
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48 bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${overallProgress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <span className="text-2xl font-bold">{overallProgress}%</span>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ── Create Space Modal ── */}
      <AnimatePresence>
        {showModal && (
          <CreateSpaceModal onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}