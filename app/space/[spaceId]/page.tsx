"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronRight, Plus, Folder, FolderOpen, List, LayoutGrid, ArrowLeft, MoreHorizontal, CheckCircle, Clock, AlertCircle, Star, Users, Settings, Search } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface MockList {
  id: string;
  name: string;
  color: string;
  folderId: string | null;
  taskCount: number;
  completedCount: number;
  dueDate?: string;
  members: { id: string; name: string; color: string }[];
  tags: string[];
  updatedAt: string;
}

interface MockFolder {
  id: string;
  name: string;
  color: string;
  listIds: string[];
}

interface MockSpace {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  memberCount: number;
  folders: MockFolder[];
  lists: MockList[];
}

const MOCK_SPACES: Record<string, MockSpace> = {
  "space-1": {
    id: "space-1",
    name: "Product Development",
    description: "All product planning, design, and engineering tasks",
    color: "#7B68EE",
    icon: "🚀",
    memberCount: 8,
    folders: [
      {
        id: "folder-1",
        name: "Q1 2025 Roadmap",
        color: "#7B68EE",
        listIds: ["list-1", "list-2", "list-3"],
      },
      {
        id: "folder-2",
        name: "Design System",
        color: "#FF6B6B",
        listIds: ["list-4", "list-5"],
      },
    ],
    lists: [
      {
        id: "list-1",
        name: "Feature Planning",
        color: "#7B68EE",
        folderId: "folder-1",
        taskCount: 24,
        completedCount: 18,
        dueDate: "2025-03-31",
        members: [
          { id: "u1", name: "Alice Chen", color: "#7B68EE" },
          { id: "u2", name: "Bob Smith", color: "#FF6B6B" },
          { id: "u3", name: "Carol White", color: "#6BCB77" },
        ],
        tags: ["planning", "roadmap"],
        updatedAt: "2 hours ago",
      },
      {
        id: "list-2",
        name: "Sprint Backlog",
        color: "#FF9F43",
        folderId: "folder-1",
        taskCount: 31,
        completedCount: 12,
        dueDate: "2025-02-28",
        members: [
          { id: "u2", name: "Bob Smith", color: "#FF6B6B" },
          { id: "u4", name: "Dan Lee", color: "#FFD93D" },
        ],
        tags: ["sprint", "engineering"],
        updatedAt: "30 minutes ago",
      },
      {
        id: "list-3",
        name: "Bug Tracker",
        color: "#FF6B6B",
        folderId: "folder-1",
        taskCount: 15,
        completedCount: 9,
        dueDate: "2025-02-15",
        members: [
          { id: "u1", name: "Alice Chen", color: "#7B68EE" },
          { id: "u5", name: "Eva Park", color: "#9B8FFF" },
        ],
        tags: ["bugs", "qa"],
        updatedAt: "1 day ago",
      },
      {
        id: "list-4",
        name: "Component Library",
        color: "#6BCB77",
        folderId: "folder-2",
        taskCount: 42,
        completedCount: 38,
        dueDate: "2025-04-30",
        members: [
          { id: "u3", name: "Carol White", color: "#6BCB77" },
          { id: "u6", name: "Frank Zhao", color: "#FF9F43" },
        ],
        tags: ["design", "components"],
        updatedAt: "3 hours ago",
      },
      {
        id: "list-5",
        name: "Brand Guidelines",
        color: "#FFD93D",
        folderId: "folder-2",
        taskCount: 10,
        completedCount: 10,
        dueDate: "2025-01-31",
        members: [{ id: "u3", name: "Carol White", color: "#6BCB77" }],
        tags: ["brand", "design"],
        updatedAt: "1 week ago",
      },
      {
        id: "list-6",
        name: "API Documentation",
        color: "#9B8FFF",
        folderId: null,
        taskCount: 18,
        completedCount: 7,
        dueDate: "2025-03-15",
        members: [
          { id: "u4", name: "Dan Lee", color: "#FFD93D" },
          { id: "u7", name: "Grace Kim", color: "#FF6B6B" },
        ],
        tags: ["docs", "api"],
        updatedAt: "5 hours ago",
      },
      {
        id: "list-7",
        name: "Release Notes",
        color: "#FF9F43",
        folderId: null,
        taskCount: 8,
        completedCount: 5,
        dueDate: "2025-02-20",
        members: [{ id: "u1", name: "Alice Chen", color: "#7B68EE" }],
        tags: ["release", "docs"],
        updatedAt: "2 days ago",
      },
    ],
  },
  "space-2": {
    id: "space-2",
    name: "Marketing",
    description: "Campaigns, content, and growth initiatives",
    color: "#FF6B6B",
    icon: "📣",
    memberCount: 5,
    folders: [
      {
        id: "folder-3",
        name: "Q1 Campaigns",
        color: "#FF6B6B",
        listIds: ["list-8", "list-9"],
      },
    ],
    lists: [
      {
        id: "list-8",
        name: "Social Media",
        color: "#FF6B6B",
        folderId: "folder-3",
        taskCount: 20,
        completedCount: 14,
        dueDate: "2025-03-31",
        members: [
          { id: "u8", name: "Hana Mori", color: "#FF6B6B" },
          { id: "u9", name: "Ivan Cruz", color: "#7B68EE" },
        ],
        tags: ["social", "content"],
        updatedAt: "1 hour ago",
      },
      {
        id: "list-9",
        name: "Email Campaigns",
        color: "#FFD93D",
        folderId: "folder-3",
        taskCount: 12,
        completedCount: 6,
        dueDate: "2025-02-28",
        members: [{ id: "u8", name: "Hana Mori", color: "#FF6B6B" }],
        tags: ["email", "campaigns"],
        updatedAt: "4 hours ago",
      },
      {
        id: "list-10",
        name: "SEO & Content",
        color: "#6BCB77",
        folderId: null,
        taskCount: 25,
        completedCount: 11,
        dueDate: "2025-04-15",
        members: [
          { id: "u9", name: "Ivan Cruz", color: "#7B68EE" },
          { id: "u10", name: "Julia Tan", color: "#6BCB77" },
        ],
        tags: ["seo", "content"],
        updatedAt: "6 hours ago",
      },
    ],
  },
};

const DEFAULT_SPACE: MockSpace = {
  id: "default",
  name: "My Workspace",
  description: "Personal tasks and projects",
  color: "#7B68EE",
  icon: "✨",
  memberCount: 1,
  folders: [],
  lists: [
    {
      id: "list-default-1",
      name: "Personal Tasks",
      color: "#7B68EE",
      folderId: null,
      taskCount: 10,
      completedCount: 4,
      members: [{ id: "u1", name: "You", color: "#7B68EE" }],
      tags: ["personal"],
      updatedAt: "just now",
    },
  ],
};

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

function MemberAvatars({
  members,
}: {
  members: { id: string; name: string; color: string }[];
}) {
  const visible = (members ?? []).slice(0, 3);
  const extra = (members ?? []).length - 3;
  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((m) => (
        <div
          key={m.id}
          title={m.name}
          className="w-6 h-6 rounded-full border-2 border-[#1E1E2E] flex items-center justify-center text-[9px] font-bold text-white"
          style={{ backgroundColor: m.color }}
        >
          {(m.name ?? "?").charAt(0)}
        </div>
      ))}
      {extra > 0 && (
        <div className="w-6 h-6 rounded-full border-2 border-[#1E1E2E] bg-white/20 flex items-center justify-center text-[9px] font-bold text-white">
          +{extra}
        </div>
      )}
    </div>
  );
}

function ListCard({ list }: { list: MockList }) {
  const shouldReduceMotion = useReducedMotion();
  const progress =
    list.taskCount > 0
      ? Math.round((list.completedCount / list.taskCount) * 100)
      : 0;
  const remaining = list.taskCount - list.completedCount;

  return (
    <motion.div
      variants={scaleIn}
      whileHover={
        shouldReduceMotion ? {} : { y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }
      }
      transition={{ duration: 0.2 }}
      className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors cursor-pointer"
    >
      <Link href={`/list/${list.id}`} className="block">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: list.color }}
            />
            <h3 className="text-white font-semibold text-sm leading-tight">
              {list.name}
            </h3>
          </div>
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
            onClick={(e) => e.preventDefault()}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-all"
          >
            <MoreHorizontal className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <CheckCircle className="w-3.5 h-3.5 text-[#6BCB77]" />
            <span>{list.completedCount} done</span>
          </div>
          {remaining > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-white/50">
              <Clock className="w-3.5 h-3.5 text-[#FFD93D]" />
              <span>{remaining} left</span>
            </div>
          )}
          {list.dueDate && (
            <div className="flex items-center gap-1.5 text-xs text-white/40 ml-auto">
              <AlertCircle className="w-3 h-3" />
              <span>{list.dueDate}</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/40">Progress</span>
            <span className="text-xs font-semibold" style={{ color: list.color }}>
              {progress}%
            </span>
          </div>
          <ProgressBar value={progress} color={list.color} />
        </div>

        {/* Tags */}
        {(list.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(list.tags ?? []).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/8 text-white/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/8">
          <MemberAvatars members={list.members ?? []} />
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <Clock className="w-3 h-3" />
            <span>{list.updatedAt}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FolderSection({
  folder,
  lists,
}: {
  folder: MockFolder;
  lists: MockList[];
}) {
  const [isOpen, setIsOpen] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const folderLists = lists.filter((l) => l.folderId === folder.id);
  const totalTasks = folderLists.reduce((s, l) => s + l.taskCount, 0);
  const completedTasks = folderLists.reduce((s, l) => s + l.completedCount, 0);
  const folderProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <motion.div variants={fadeInUp} className="mb-6">
      {/* Folder Header */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileHover={shouldReduceMotion ? {} : { backgroundColor: "rgba(255,255,255,0.05)" }}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group"
      >
        <motion.div
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-white/40" />
        </motion.div>

        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${folder.color}22` }}
        >
          {isOpen ? (
            <FolderOpen className="w-4 h-4" style={{ color: folder.color }} />
          ) : (
            <Folder className="w-4 h-4" style={{ color: folder.color }} />
          )}
        </div>

        <span className="text-white font-semibold text-sm flex-1 text-left">
          {folder.name}
        </span>

        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-white/40">
            {folderLists.length} lists · {folderProgress}% complete
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${folderProgress}%`,
                backgroundColor: folder.color,
              }}
            />
          </div>
          <span className="text-xs text-white/40 w-8 text-right">
            {folderProgress}%
          </span>
        </div>
      </motion.button>

      {/* Folder Lists */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-3 pl-4"
            >
              {folderLists.map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
              <motion.div variants={scaleIn}>
                <button className="w-full h-full min-h-[160px] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/60 hover:border-white/25 transition-all group">
                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">New List</span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SpacePage() {
  const params = useParams();
  const spaceId = typeof params?.spaceId === "string" ? params.spaceId : "space-1";
  const shouldReduceMotion = useReducedMotion();

  const space = MOCK_SPACES[spaceId] ?? DEFAULT_SPACE;

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListColor, setNewListColor] = useState("#7B68EE");

  const standaloneListsRaw = (space.lists ?? []).filter((l) => l.folderId === null);
  const standaloneListsFiltered =
    searchQuery.trim() === ""
      ? standaloneListsRaw
      : standaloneListsRaw.filter((l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  const filteredFolders =
    searchQuery.trim() === ""
      ? space.folders ?? []
      : (space.folders ?? []).filter(
          (f) =>
            f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (space.lists ?? [])
              .filter((l) => l.folderId === f.id)
              .some((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );

  const totalTasks = (space.lists ?? []).reduce((s, l) => s + l.taskCount, 0);
  const completedTasks = (space.lists ?? []).reduce((s, l) => s + l.completedCount, 0);
  const overallProgress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const colorOptions = [
    "#7B68EE",
    "#FF6B6B",
    "#FF9F43",
    "#FFD93D",
    "#6BCB77",
    "#9B8FFF",
    "#4ECDC4",
    "#45B7D1",
  ];

  return (
    <div className="min-h-screen bg-[#13131F]">
      {/* Breadcrumb */}
      <motion.div
        variants={shouldReduceMotion ? {} : fadeIn}
        initial="hidden"
        animate="visible"
        className="border-b border-white/8 bg-[#1E1E2E]/60 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/workspace"
              className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/20" />
            <span className="text-white/60">Spaces</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/20" />
            <span className="text-white font-medium">{space.name}</span>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Space Header */}
        <motion.div
          variants={shouldReduceMotion ? {} : fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0"
                style={{ backgroundColor: `${space.color}22`, border: `1px solid ${space.color}44` }}
              >
                {space.icon}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {space.name}
                </h1>
                <p className="text-white/50 text-sm mb-3">{space.description}</p>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{space.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <List className="w-3.5 h-3.5" />
                    <span>{(space.lists ?? []).length} lists</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#6BCB77]" />
                    <span>{overallProgress}% complete</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <Star className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <Settings className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg transition-all"
                style={{
                  background: `linear-gradient(135deg, ${space.color}, ${space.color}cc)`,
                  boxShadow: `0 4px 20px ${space.color}44`,
                }}
              >
                <Plus className="w-4 h-4" />
                <span>New List</span>
              </motion.button>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="mt-6 p-4 bg-white/4 border border-white/8 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white/60">Overall Space Progress</span>
              <span className="text-xs font-bold text-white">
                {completedTasks} / {totalTasks} tasks complete
              </span>
            </div>
            <ProgressBar value={overallProgress} color={space.color} />
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          variants={shouldReduceMotion ? {} : fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6"
        >
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search lists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/25 focus:bg-white/8 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white/15 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white/15 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Folders Section */}
        {filteredFolders.length > 0 && (
          <motion.section
            variants={shouldReduceMotion ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <motion.div
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="flex items-center gap-2 mb-4"
            >
              <Folder className="w-4 h-4 text-white/40" />
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                Folders
              </h2>
              <span className="text-xs text-white/30 bg-white/8 px-2 py-0.5 rounded-full">
                {filteredFolders.length}
              </span>
            </motion.div>

            <div className="space-y-2">
              {filteredFolders.map((folder) => (
                <FolderSection
                  key={folder.id}
                  folder={folder}
                  lists={space.lists ?? []}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Standalone Lists */}
        {standaloneListsFiltered.length > 0 && (
          <motion.section
            variants={shouldReduceMotion ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={shouldReduceMotion ? {} : fadeInUp}
              className="flex items-center gap-2 mb-4"
            >
              <List className="w-4 h-4 text-white/40" />
              <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
                Lists
              </h2>
              <span className="text-xs text-white/30 bg-white/8 px-2 py-0.5 rounded-full">
                {standaloneListsFiltered.length}
              </span>
            </motion.div>

            <motion.div
              variants={shouldReduceMotion ? {} : staggerContainer}
              initial="hidden"
              animate="visible"
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "flex flex-col gap-3"
              }
            >
              {standaloneListsFiltered.map((list) => (
                <ListCard key={list.id} list={list} />
              ))}
              <motion.div variants={scaleIn}>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full h-full min-h-[160px] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 text-white/30 hover:text-white/60 hover:border-white/25 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium">New List</span>
                </button>
              </motion.div>
            </motion.div>
          </motion.section>
        )}

        {/* Empty State */}
        {filteredFolders.length === 0 && standaloneListsFiltered.length === 0 && (
          <motion.div
            variants={shouldReduceMotion ? {} : scaleIn}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Search className="w-7 h-7 text-white/20" />
            </div>
            <h3 className="text-white/60 font-semibold mb-2">No lists found</h3>
            <p className="text-white/30 text-sm mb-6">
              {searchQuery
                ? `No lists match "${searchQuery}"`
                : "This space has no lists yet"}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: `linear-gradient(135deg, ${space.color}, ${space.color}cc)`,
              }}
            >
              <Plus className="w-4 h-4" />
              Create First List
            </button>
          </motion.div>
        )}
      </div>

      {/* Create List Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowCreateModal(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#1E1E2E] border border-white/15 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg">Create New List</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
                >
                  <ChevronDown className="w-5 h-5 rotate-180" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                    List Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sprint 12, Design Tasks..."
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all text-sm"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                    Color
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {colorOptions.map((c) => (
                      <button
                        key={c}
                        onClick={() => setNewListColor(c)}
                        className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          outline: newListColor === c ? `2px solid white` : "none",
                          outlineOffset: "2px",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewListName("");
                      setNewListColor("#7B68EE");
                    }}
                    disabled={newListName.trim() === ""}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background:
                        newListName.trim() !== ""
                          ? `linear-gradient(135deg, ${newListColor}, ${newListColor}cc)`
                          : "#ffffff22",
                    }}
                  >
                    Create List
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}