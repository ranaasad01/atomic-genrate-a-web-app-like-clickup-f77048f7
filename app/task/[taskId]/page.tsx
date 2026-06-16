"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, Check, Plus, Trash2, ChevronDown, Calendar, Tag, User, AlertCircle, Clock, MessageSquare, Activity, Edit, X, Star, Flag, Circle, CheckCircle } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import {
  Priority,
  TaskStatus,
  PRIORITY_CONFIG,
  STATUS_CONFIG,
} from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface MockUser {
  id: string;
  name: string;
  initials: string;
  color: string;
}

interface MockSubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface MockComment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

interface MockActivityEvent {
  id: string;
  userId: string;
  action: string;
  detail: string;
  createdAt: string;
  icon: "status" | "priority" | "assign" | "comment" | "due" | "create" | "tag";
}

const MOCK_USERS: MockUser[] = [
  { id: "u1", name: "Alex Rivera", initials: "AR", color: "#7B68EE" },
  { id: "u2", name: "Jordan Kim", initials: "JK", color: "#FF6B6B" },
  { id: "u3", name: "Sam Patel", initials: "SP", color: "#6BCB77" },
  { id: "u4", name: "Morgan Lee", initials: "ML", color: "#FFD93D" },
];

const INITIAL_SUBTASKS: MockSubTask[] = [
  { id: "st1", title: "Design wireframes for new dashboard layout", completed: true },
  { id: "st2", title: "Set up API endpoints for task filtering", completed: true },
  { id: "st3", title: "Implement drag-and-drop for Kanban columns", completed: false },
  { id: "st4", title: "Write unit tests for task state management", completed: false },
  { id: "st5", title: "QA review and cross-browser testing", completed: false },
];

const INITIAL_COMMENTS: MockComment[] = [
  {
    id: "c1",
    userId: "u2",
    content:
      "I've finished the wireframes — they're in the shared Figma file. Let me know if you want any adjustments before we move to implementation.",
    createdAt: "2024-06-10T09:15:00Z",
  },
  {
    id: "c2",
    userId: "u3",
    content:
      "API endpoints are live in staging. I added pagination support as well since we'll need it for large workspaces. Docs are in Notion.",
    createdAt: "2024-06-11T14:32:00Z",
  },
  {
    id: "c3",
    userId: "u1",
    content:
      "Great work everyone! @Jordan can you double-check the mobile breakpoints on the wireframes? The sidebar might need to collapse differently on tablet.",
    createdAt: "2024-06-12T10:05:00Z",
  },
];

const ACTIVITY_LOG: MockActivityEvent[] = [
  {
    id: "a1",
    userId: "u1",
    action: "created this task",
    detail: "",
    createdAt: "2024-06-08T08:00:00Z",
    icon: "create",
  },
  {
    id: "a2",
    userId: "u1",
    action: "set priority to",
    detail: "High",
    createdAt: "2024-06-08T08:02:00Z",
    icon: "priority",
  },
  {
    id: "a3",
    userId: "u1",
    action: "assigned to",
    detail: "Alex Rivera",
    createdAt: "2024-06-08T08:05:00Z",
    icon: "assign",
  },
  {
    id: "a4",
    userId: "u2",
    action: "changed status to",
    detail: "In Progress",
    createdAt: "2024-06-09T11:20:00Z",
    icon: "status",
  },
  {
    id: "a5",
    userId: "u3",
    action: "added a comment",
    detail: "",
    createdAt: "2024-06-11T14:32:00Z",
    icon: "comment",
  },
  {
    id: "a6",
    userId: "u4",
    action: "set due date to",
    detail: "June 20, 2024",
    createdAt: "2024-06-11T16:00:00Z",
    icon: "due",
  },
  {
    id: "a7",
    userId: "u1",
    action: "added tags",
    detail: "frontend, sprint-3",
    createdAt: "2024-06-12T09:00:00Z",
    icon: "tag",
  },
];

const ALL_TAGS = ["frontend", "backend", "design", "sprint-3", "bug", "feature", "docs", "testing"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function getUserById(id: string): MockUser {
  return MOCK_USERS.find((u) => u.id === id) ?? MOCK_USERS[0];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ user, size = "md" }: { user: MockUser; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-11 h-11 text-base" };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ backgroundColor: user.color }}
    >
      {user.initials}
    </div>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <Circle className="w-2 h-2 fill-current" />
      {cfg.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <Flag className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function ActivityIcon({ type }: { type: MockActivityEvent["icon"] }) {
  const map: Record<MockActivityEvent["icon"], { icon: React.ReactNode; bg: string }> = {
    create: { icon: <Plus className="w-3 h-3 text-white" />, bg: "#7B68EE" },
    status: { icon: <Circle className="w-3 h-3 text-white" />, bg: "#7B68EE" },
    priority: { icon: <Flag className="w-3 h-3 text-white" />, bg: "#FF9F43" },
    assign: { icon: <User className="w-3 h-3 text-white" />, bg: "#6BCB77" },
    comment: { icon: <MessageSquare className="w-3 h-3 text-white" />, bg: "#94A3B8" },
    due: { icon: <Calendar className="w-3 h-3 text-white" />, bg: "#FF6B6B" },
    tag: { icon: <Tag className="w-3 h-3 text-white" />, bg: "#FFD93D" },
  };
  const { icon, bg } = map[type] ?? map.create;
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: bg }}
    >
      {icon}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TaskDetailPage() {
  const shouldReduceMotion = useReducedMotion();

  // ── Title editing ──
  const [title, setTitle] = useState("Redesign FlowTask Dashboard & Kanban Board");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(title);

  // ── Description ──
  const [description, setDescription] = useState(
    "Overhaul the main dashboard to improve information density and usability. This includes a new Kanban board with drag-and-drop support, updated stat cards with sparkline charts, and a redesigned task detail panel.\n\nThe goal is to reduce the number of clicks needed to complete common workflows and improve the overall visual hierarchy."
  );

  // ── Subtasks ──
  const [subtasks, setSubtasks] = useState<MockSubTask[]>(INITIAL_SUBTASKS);
  const [newSubtask, setNewSubtask] = useState("");

  // ── Comments ──
  const [comments, setComments] = useState<MockComment[]>(INITIAL_COMMENTS);
  const [commentDraft, setCommentDraft] = useState("");

  // ── Metadata ──
  const [status, setStatus] = useState<TaskStatus>("in_progress");
  const [priority, setPriority] = useState<Priority>("high");
  const [assigneeId, setAssigneeId] = useState<string>("u1");
  const [dueDate, setDueDate] = useState("2024-06-20");
  const [tags, setTags] = useState<string[]>(["frontend", "sprint-3"]);
  const [tagInput, setTagInput] = useState("");

  // ── Dropdown open states ──
  const [statusOpen, setStatusOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [assigneeOpen, setAssigneeOpen] = useState(false);

  // ── Handlers ──

  const commitTitle = useCallback(() => {
    if (titleDraft.trim()) setTitle(titleDraft.trim());
    else setTitleDraft(title);
    setEditingTitle(false);
  }, [titleDraft, title]);

  const toggleSubtask = useCallback((id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  }, []);

  const deleteSubtask = useCallback((id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addSubtask = useCallback(() => {
    const trimmed = newSubtask.trim();
    if (!trimmed) return;
    setSubtasks((prev) => [
      ...prev,
      { id: `st-${Date.now()}`, title: trimmed, completed: false },
    ]);
    setNewSubtask("");
  }, [newSubtask]);

  const addComment = useCallback(() => {
    const trimmed = commentDraft.trim();
    if (!trimmed) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        userId: "u1",
        content: trimmed,
        createdAt: new Date().toISOString(),
      },
    ]);
    setCommentDraft("");
  }, [commentDraft]);

  const addTag = useCallback(
    (tag: string) => {
      const t = tag.trim().toLowerCase();
      if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
      setTagInput("");
    },
    [tags]
  );

  const removeTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const completedCount = subtasks.filter((s) => s.completed).length;
  const progressPct = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  const motionProps = (variants: object) =>
    shouldReduceMotion ? {} : { variants, initial: "hidden", animate: "visible" };

  return (
    <div className="min-h-screen bg-[#F4F4F8]">
      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-3">
          <Link
            href="/workspace"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#7B68EE] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Workspace
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-400">Sprint 3</span>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-700 font-medium truncate max-w-xs">{title}</span>
          <div className="ml-auto flex items-center gap-2">
            <StatusBadge status={status} />
            <PriorityBadge priority={priority} />
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ════════════════════════════════════════
              LEFT PANEL
          ════════════════════════════════════════ */}
          <motion.div
            className="flex-1 min-w-0 space-y-6"
            {...(shouldReduceMotion ? {} : { variants: fadeInUp, initial: "hidden", animate: "visible" })}
          >
            {/* ── Title ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              {editingTitle ? (
                <div className="flex items-start gap-2">
                  <textarea
                    className="flex-1 text-2xl font-bold text-gray-900 resize-none border-2 border-[#7B68EE] rounded-xl p-2 focus:outline-none leading-snug"
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    rows={2}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        commitTitle();
                      }
                      if (e.key === "Escape") {
                        setTitleDraft(title);
                        setEditingTitle(false);
                      }
                    }}
                  />
                  <div className="flex flex-col gap-1 mt-1">
                    <motion.button
                      whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                      onClick={commitTitle}
                      className="p-1.5 rounded-lg bg-[#7B68EE] text-white hover:bg-[#6a58d6] transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                      onClick={() => { setTitleDraft(title); setEditingTitle(false); }}
                      className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 group">
                  <h1 className="flex-1 text-2xl font-bold text-gray-900 leading-snug">{title}</h1>
                  <motion.button
                    whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    onClick={() => { setTitleDraft(title); setEditingTitle(true); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-[#7B68EE] hover:bg-[#F0EEFF] transition-all"
                    aria-label="Edit title"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </div>

            {/* ── Description ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Description
              </h2>
              <textarea
                className="w-full text-gray-700 text-sm leading-relaxed resize-none border border-transparent rounded-xl p-2 focus:outline-none focus:border-[#7B68EE] focus:bg-[#F0EEFF]/30 transition-all min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description…"
                rows={6}
              />
            </div>

            {/* ── Subtasks ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Subtasks
                </h2>
                <span className="text-xs font-semibold text-[#7B68EE] bg-[#F0EEFF] px-2.5 py-1 rounded-full">
                  {completedCount}/{subtasks.length}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#7B68EE] to-[#9B8FFF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>

              <motion.ul
                variants={shouldReduceMotion ? {} : staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-2 mb-4"
              >
                <AnimatePresence initial={false}>
                  {subtasks.map((st) => (
                    <motion.li
                      key={st.id}
                      variants={shouldReduceMotion ? {} : fadeInUp}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                      className="flex items-center gap-3 group p-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <button
                        onClick={() => toggleSubtask(st.id)}
                        className="flex-shrink-0 transition-transform hover:scale-110"
                        aria-label={st.completed ? "Mark incomplete" : "Mark complete"}
                      >
                        {st.completed ? (
                          <CheckCircle className="w-5 h-5 text-[#7B68EE]" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 hover:text-[#7B68EE] transition-colors" />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-sm transition-colors ${
                          st.completed ? "line-through text-gray-400" : "text-gray-700"
                        }`}
                      >
                        {st.title}
                      </span>
                      <button
                        onClick={() => deleteSubtask(st.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        aria-label="Delete subtask"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>

              {/* Add subtask */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addSubtask(); }}
                  placeholder="Add a subtask…"
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7B68EE] focus:ring-2 focus:ring-[#7B68EE]/20 transition-all"
                />
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  onClick={addSubtask}
                  className="p-2 rounded-xl bg-[#7B68EE] text-white hover:bg-[#6a58d6] transition-colors"
                  aria-label="Add subtask"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* ── Comments ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Comments
                </h2>
                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {comments.length}
                </span>
              </div>

              <motion.div
                variants={shouldReduceMotion ? {} : staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-5 mb-6"
              >
                {comments.map((comment) => {
                  const user = getUserById(comment.userId);
                  return (
                    <motion.div
                      key={comment.id}
                      variants={shouldReduceMotion ? {} : fadeInUp}
                      className="flex gap-3"
                    >
                      <Avatar user={user} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                          <span className="text-xs text-gray-400">
                            {formatDate(comment.createdAt)} at {formatTime(comment.createdAt)}
                          </span>
                        </div>
                        <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 leading-relaxed">
                          {comment.content}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Reply input */}
              <div className="flex gap-3">
                <Avatar user={getUserById("u1")} size="sm" />
                <div className="flex-1">
                  <textarea
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addComment();
                    }}
                    placeholder="Write a comment… (⌘+Enter to send)"
                    rows={3}
                    className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#7B68EE] focus:ring-2 focus:ring-[#7B68EE]/20 transition-all resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <motion.button
                      whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                      onClick={addComment}
                      disabled={!commentDraft.trim()}
                      className="px-4 py-2 rounded-xl bg-[#7B68EE] text-white text-sm font-semibold hover:bg-[#6a58d6] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      Send Comment
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Activity Log ── */}
            <motion.div
              variants={shouldReduceMotion ? {} : fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Activity Log
                </h2>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-3 top-3 bottom-3 w-px bg-gray-100" />

                <motion.ul
                  variants={shouldReduceMotion ? {} : staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  {ACTIVITY_LOG.map((event) => {
                    const user = getUserById(event.userId);
                    return (
                      <motion.li
                        key={event.id}
                        variants={shouldReduceMotion ? {} : fadeInUp}
                        className="flex items-start gap-3 pl-1"
                      >
                        <div className="relative z-10">
                          <ActivityIcon type={event.icon} />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-800">{user.name}</span>{" "}
                            {event.action}
                            {event.detail && (
                              <span className="font-semibold text-[#7B68EE]"> {event.detail}</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDate(event.createdAt)} · {formatTime(event.createdAt)}
                          </p>
                        </div>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </div>
            </motion.div>
          </motion.div>

          {/* ════════════════════════════════════════
              RIGHT PANEL — Metadata
          ════════════════════════════════════════ */}
          <motion.aside
            className="w-full lg:w-80 flex-shrink-0 space-y-4"
            {...(shouldReduceMotion
              ? {}
              : { variants: fadeInUp, initial: "hidden", animate: "visible", transition: { delay: 0.15 } })}
          >
            {/* ── Status ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Status
              </label>
              <div className="relative">
                <button
                  onClick={() => { setStatusOpen((o) => !o); setPriorityOpen(false); setAssigneeOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200 hover:border-[#7B68EE] transition-colors text-sm font-medium text-gray-700"
                >
                  <StatusBadge status={status} />
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {statusOpen && (
                    <motion.div
                      variants={shouldReduceMotion ? {} : scaleIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20"
                    >
                      {(["todo", "in_progress", "review", "done"] as TaskStatus[]).map((s) => (
                        <button
                          key={s}
                          onClick={() => { setStatus(s); setStatusOpen(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left ${status === s ? "bg-[#F0EEFF]" : ""}`}
                        >
                          <StatusBadge status={s} />
                          {status === s && <Check className="w-3.5 h-3.5 text-[#7B68EE] ml-auto" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Priority ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Priority
              </label>
              <div className="relative">
                <button
                  onClick={() => { setPriorityOpen((o) => !o); setStatusOpen(false); setAssigneeOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200 hover:border-[#7B68EE] transition-colors text-sm font-medium text-gray-700"
                >
                  <PriorityBadge priority={priority} />
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${priorityOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {priorityOpen && (
                    <motion.div
                      variants={shouldReduceMotion ? {} : scaleIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20"
                    >
                      {(["urgent", "high", "normal", "low"] as Priority[]).map((p) => (
                        <button
                          key={p}
                          onClick={() => { setPriority(p); setPriorityOpen(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left ${priority === p ? "bg-[#F0EEFF]" : ""}`}
                        >
                          <PriorityBadge priority={p} />
                          {priority === p && <Check className="w-3.5 h-3.5 text-[#7B68EE] ml-auto" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Assignee ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Assignee
              </label>
              <div className="relative">
                <button
                  onClick={() => { setAssigneeOpen((o) => !o); setStatusOpen(false); setPriorityOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 hover:border-[#7B68EE] transition-colors"
                >
                  {assigneeId ? (
                    <>
                      <Avatar user={getUserById(assigneeId)} size="sm" />
                      <span className="flex-1 text-sm font-medium text-gray-700 text-left">
                        {getUserById(assigneeId).name}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="flex-1 text-sm text-gray-400 text-left">Unassigned</span>
                    </>
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${assigneeOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {assigneeOpen && (
                    <motion.div
                      variants={shouldReduceMotion ? {} : scaleIn}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20"
                    >
                      {MOCK_USERS.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => { setAssigneeId(u.id); setAssigneeOpen(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors ${assigneeId === u.id ? "bg-[#F0EEFF]" : ""}`}
                        >
                          <Avatar user={u} size="sm" />
                          <span className="flex-1 text-sm text-gray-700 text-left">{u.name}</span>
                          {assigneeId === u.id && <Check className="w-3.5 h-3.5 text-[#7B68EE]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Due Date ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Due Date
              </label>
              <div className="relative flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-[#7B68EE] focus:ring-2 focus:ring-[#7B68EE]/20 transition-all"
                />
              </div>
              {dueDate && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Due {new Date(dueDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
              )}
            </div>

            {/* ── Tags ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                <AnimatePresence>
                  {tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F0EEFF] text-[#7B68EE] text-xs font-semibold"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 hover:text-red-500 transition-colors"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addTag(tagInput); }}
                  placeholder="Add tag…"
                  list="tag-suggestions"
                  className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#7B68EE] focus:ring-2 focus:ring-[#7B68EE]/20 transition-all"
                />
                <datalist id="tag-suggestions">
                  {ALL_TAGS.filter((t) => !tags.includes(t)).map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  onClick={() => addTag(tagInput)}
                  className="p-2 rounded-xl bg-[#7B68EE] text-white hover:bg-[#6a58d6] transition-colors"
                  aria-label="Add tag"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
              {/* Suggested tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {ALL_TAGS.filter((t) => !tags.includes(t))
                  .slice(0, 5)
                  .map((t) => (
                    <button
                      key={t}
                      onClick={() => addTag(t)}
                      className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 hover:border-[#7B68EE] hover:text-[#7B68EE] hover:bg-[#F0EEFF] transition-all"
                    >
                      + {t}
                    </button>
                  ))}
              </div>
            </div>

            {/* ── Task Info ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Task Info
              </h3>
              <dl className="space-y-2.5">
                {[
                  { label: "Created", value: "Jun 8, 2024" },
                  { label: "Updated", value: "Jun 12, 2024" },
                  { label: "List", value: "Sprint 3" },
                  { label: "Space", value: "Engineering" },
                  { label: "Task ID", value: "#TASK-2847" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <dt className="text-xs text-gray-400">{label}</dt>
                    <dd className="text-xs font-medium text-gray-600">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* ── Quick Actions ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Mark as Done", icon: CheckCircle, color: "text-[#6BCB77]", bg: "hover:bg-green-50" },
                  { label: "Set as Urgent", icon: AlertCircle, color: "text-[#FF6B6B]", bg: "hover:bg-red-50" },
                  { label: "Add to Favorites", icon: Star, color: "text-[#FFD93D]", bg: "hover:bg-yellow-50" },
                ].map(({ label, icon: Icon, color, bg }) => (
                  <motion.button
                    key={label}
                    whileHover={shouldReduceMotion ? {} : { x: 3 }}
                    whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 font-medium transition-colors ${bg}`}
                  >
                    <Icon className={`w-4 h-4 ${color}`} />
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}