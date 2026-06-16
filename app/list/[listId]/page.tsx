"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, List, Plus, Filter, SortAsc, ChevronDown, X, Search, Calendar, User, Flag, MoreHorizontal, CheckCircle2, Circle, Clock, AlertCircle, Tag, Paperclip, MessageSquare, ArrowUp, ArrowDown, GripVertical, Sparkles, ChevronRight } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import {
  Priority,
  TaskStatus,
  PRIORITY_CONFIG,
  STATUS_CONFIG,
} from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MockUser {
  id: string;
  name: string;
  initials: string;
  color: string;
}

interface MockTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  assigneeId: string;
  tags: string[];
  subtaskCount: number;
  subtaskDone: number;
  commentCount: number;
  attachmentCount: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS: MockUser[] = [
  { id: "u1", name: "Alex Rivera", initials: "AR", color: "#7B68EE" },
  { id: "u2", name: "Sam Chen", initials: "SC", color: "#FF6B6B" },
  { id: "u3", name: "Jordan Lee", initials: "JL", color: "#6BCB77" },
  { id: "u4", name: "Morgan Kim", initials: "MK", color: "#FFD93D" },
  { id: "u5", name: "Taylor Patel", initials: "TP", color: "#FF9F43" },
];

const INITIAL_TASKS: MockTask[] = [
  {
    id: "t1",
    title: "Design new onboarding flow",
    description: "Revamp the user onboarding experience with interactive steps",
    status: "todo",
    priority: "high",
    dueDate: "2024-02-15",
    assigneeId: "u1",
    tags: ["design", "ux"],
    subtaskCount: 4,
    subtaskDone: 0,
    commentCount: 3,
    attachmentCount: 2,
  },
  {
    id: "t2",
    title: "Implement authentication system",
    description: "OAuth2 + JWT token management with refresh logic",
    status: "in_progress",
    priority: "urgent",
    dueDate: "2024-02-10",
    assigneeId: "u2",
    tags: ["backend", "security"],
    subtaskCount: 6,
    subtaskDone: 3,
    commentCount: 8,
    attachmentCount: 1,
  },
  {
    id: "t3",
    title: "Write API documentation",
    description: "Document all REST endpoints with examples and error codes",
    status: "review",
    priority: "normal",
    dueDate: "2024-02-20",
    assigneeId: "u3",
    tags: ["docs"],
    subtaskCount: 3,
    subtaskDone: 3,
    commentCount: 2,
    attachmentCount: 0,
  },
  {
    id: "t4",
    title: "Set up CI/CD pipeline",
    description: "GitHub Actions workflow for automated testing and deployment",
    status: "done",
    priority: "high",
    dueDate: "2024-02-05",
    assigneeId: "u4",
    tags: ["devops"],
    subtaskCount: 5,
    subtaskDone: 5,
    commentCount: 4,
    attachmentCount: 3,
  },
  {
    id: "t5",
    title: "Performance audit & optimization",
    description: "Lighthouse audit, bundle analysis, lazy loading improvements",
    status: "todo",
    priority: "normal",
    dueDate: "2024-02-25",
    assigneeId: "u5",
    tags: ["performance"],
    subtaskCount: 3,
    subtaskDone: 0,
    commentCount: 1,
    attachmentCount: 0,
  },
  {
    id: "t6",
    title: "Mobile responsive fixes",
    description: "Fix layout issues on small screens across all pages",
    status: "in_progress",
    priority: "high",
    dueDate: "2024-02-12",
    assigneeId: "u1",
    tags: ["frontend", "mobile"],
    subtaskCount: 7,
    subtaskDone: 4,
    commentCount: 5,
    attachmentCount: 2,
  },
  {
    id: "t7",
    title: "Database schema migration",
    description: "Migrate legacy schema to new normalized structure",
    status: "review",
    priority: "urgent",
    dueDate: "2024-02-08",
    assigneeId: "u2",
    tags: ["backend", "database"],
    subtaskCount: 4,
    subtaskDone: 4,
    commentCount: 6,
    attachmentCount: 1,
  },
  {
    id: "t8",
    title: "User analytics dashboard",
    description: "Build real-time analytics with charts and export functionality",
    status: "todo",
    priority: "low",
    dueDate: "2024-03-01",
    assigneeId: "u3",
    tags: ["analytics", "frontend"],
    subtaskCount: 8,
    subtaskDone: 0,
    commentCount: 2,
    attachmentCount: 0,
  },
  {
    id: "t9",
    title: "Email notification system",
    description: "Transactional emails for task assignments and mentions",
    status: "in_progress",
    priority: "normal",
    dueDate: "2024-02-18",
    assigneeId: "u4",
    tags: ["backend", "notifications"],
    subtaskCount: 3,
    subtaskDone: 1,
    commentCount: 3,
    attachmentCount: 0,
  },
  {
    id: "t10",
    title: "Accessibility compliance audit",
    description: "WCAG 2.1 AA compliance check and remediation",
    status: "done",
    priority: "high",
    dueDate: "2024-02-03",
    assigneeId: "u5",
    tags: ["a11y", "frontend"],
    subtaskCount: 6,
    subtaskDone: 6,
    commentCount: 7,
    attachmentCount: 4,
  },
  {
    id: "t11",
    title: "Integrate payment gateway",
    description: "Stripe integration with webhook handling and retry logic",
    status: "todo",
    priority: "urgent",
    dueDate: "2024-02-22",
    assigneeId: "u2",
    tags: ["backend", "payments"],
    subtaskCount: 5,
    subtaskDone: 0,
    commentCount: 4,
    attachmentCount: 1,
  },
  {
    id: "t12",
    title: "Dark mode implementation",
    description: "System-aware dark mode with manual toggle and persistence",
    status: "review",
    priority: "low",
    dueDate: "2024-02-28",
    assigneeId: "u1",
    tags: ["frontend", "design"],
    subtaskCount: 2,
    subtaskDone: 2,
    commentCount: 5,
    attachmentCount: 0,
  },
];

const LIST_NAMES: Record<string, string> = {
  "sprint-1": "Sprint 1 — Core Features",
  "sprint-2": "Sprint 2 — Polish & Performance",
  "backlog": "Product Backlog",
  "bugs": "Bug Tracker",
  "design": "Design Tasks",
  default: "Task List",
};

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "review", "done"];

// ─── Utility ──────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

function getUserById(id: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = months[parseInt(parts[1] ?? "1", 10) - 1] ?? "";
  const day = parseInt(parts[2] ?? "1", 10);
  return `${month} ${day}`;
}

function isOverdue(dateStr: string): boolean {
  if (!dateStr) return false;
  return dateStr < "2024-02-10";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = PRIORITY_CONFIG[priority];
  if (!cfg) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <Flag className="w-2.5 h-2.5" />
      {cfg.label}
    </span>
  );
}

function StatusChip({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  const icons: Record<TaskStatus, React.ReactNode> = {
    todo: <Circle className="w-3 h-3" />,
    in_progress: <Clock className="w-3 h-3" />,
    review: <AlertCircle className="w-3 h-3" />,
    done: <CheckCircle2 className="w-3 h-3" />,
  };
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      {icons[status]}
      {cfg.label}
    </span>
  );
}

function AssigneeAvatar({ userId, size = "sm" }: { userId: string; size?: "sm" | "md" }) {
  const user = getUserById(userId);
  const dim = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm";
  if (!user) {
    return (
      <div className={cn(dim, "rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold")}>
        ?
      </div>
    );
  }
  return (
    <div
      className={cn(dim, "rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0")}
      style={{ backgroundColor: user.color }}
      title={user.name}
    >
      {user.initials}
    </div>
  );
}

// ─── Create Task Modal ────────────────────────────────────────────────────────
interface CreateTaskModalProps {
  onClose: () => void;
  onAdd: (task: MockTask) => void;
  defaultStatus?: TaskStatus;
}

function CreateTaskModal({ onClose, onAdd, defaultStatus = "todo" }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<Priority>("normal");
  const [assigneeId, setAssigneeId] = useState("u1");
  const [dueDate, setDueDate] = useState("2024-02-28");

  const handleSubmit = () => {
    if (!title.trim()) return;
    const newTask: MockTask = {
      id: `t${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate,
      assigneeId,
      tags: [],
      subtaskCount: 0,
      subtaskDone: 0,
      commentCount: 0,
      attachmentCount: 0,
    };
    onAdd(newTask);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Create New Task</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/40 focus:border-[#7B68EE]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/40 focus:border-[#7B68EE] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/40 focus:border-[#7B68EE] bg-white"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/40 focus:border-[#7B68EE] bg-white"
              >
                {(["urgent", "high", "normal", "low"] as Priority[]).map((p) => (
                  <option key={p} value={p}>{PRIORITY_CONFIG[p]?.label ?? p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/40 focus:border-[#7B68EE] bg-white"
              >
                {MOCK_USERS.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/40 focus:border-[#7B68EE]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#7B68EE] hover:bg-[#6A57DD] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Task
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Kanban Card ──────────────────────────────────────────────────────────────
interface KanbanCardProps {
  task: MockTask;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

function KanbanCard({ task, onStatusChange, onDelete, isDragging }: KanbanCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const nextStatus: Record<TaskStatus, TaskStatus | null> = {
    todo: "in_progress",
    in_progress: "review",
    review: "done",
    done: null,
  };

  return (
    <motion.div
      layout
      variants={shouldReduceMotion ? {} : scaleIn}
      initial="hidden"
      animate="visible"
      whileHover={shouldReduceMotion ? {} : { y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
      className={cn(
        "bg-white rounded-xl border border-gray-100 p-4 cursor-grab active:cursor-grabbing group transition-shadow",
        isDragging && "shadow-2xl rotate-1 opacity-90"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap gap-1">
          {(task.tags ?? []).slice(0, 2).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 bg-[#F0EEFF] text-[#7B68EE] text-xs rounded font-medium">
              {tag}
            </span>
          ))}
        </div>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 rounded-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-6 z-20 bg-white border border-gray-100 rounded-xl shadow-xl py-1 w-40">
              {nextStatus[task.status] && (
                <button
                  onClick={() => { onStatusChange(task.id, nextStatus[task.status]!); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" />
                  Move to {STATUS_CONFIG[nextStatus[task.status]!]?.label}
                </button>
              )}
              <button
                onClick={() => { onDelete(task.id); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"
              >
                <X className="w-3 h-3" />
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-gray-900 mb-2 leading-snug">{task.title}</p>

      {/* Priority */}
      <div className="mb-3">
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400">
          {task.subtaskCount > 0 && (
            <span className="flex items-center gap-0.5 text-xs">
              <CheckCircle2 className="w-3 h-3" />
              {task.subtaskDone}/{task.subtaskCount}
            </span>
          )}
          {task.commentCount > 0 && (
            <span className="flex items-center gap-0.5 text-xs">
              <MessageSquare className="w-3 h-3" />
              {task.commentCount}
            </span>
          )}
          {task.attachmentCount > 0 && (
            <span className="flex items-center gap-0.5 text-xs">
              <Paperclip className="w-3 h-3" />
              {task.attachmentCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className={cn("text-xs flex items-center gap-0.5", isOverdue(task.dueDate) ? "text-red-500" : "text-gray-400")}>
              <Calendar className="w-3 h-3" />
              {formatDate(task.dueDate)}
            </span>
          )}
          <AssigneeAvatar userId={task.assigneeId} size="sm" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────
interface KanbanColumnProps {
  status: TaskStatus;
  tasks: MockTask[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
  dragOverColumn: string | null;
  onDragOver: (status: TaskStatus) => void;
  onDrop: (status: TaskStatus) => void;
  onDragStart: (taskId: string) => void;
}

function KanbanColumn({
  status,
  tasks,
  onStatusChange,
  onDelete,
  onAddTask,
  dragOverColumn,
  onDragOver,
  onDrop,
  onDragStart,
}: KanbanColumnProps) {
  const cfg = STATUS_CONFIG[status];
  const shouldReduceMotion = useReducedMotion();
  const isOver = dragOverColumn === status;

  const colColors: Record<TaskStatus, string> = {
    todo: "bg-gray-50 border-gray-200",
    in_progress: "bg-[#F0EEFF] border-[#C4BBFF]",
    review: "bg-[#FFFBEB] border-[#FFE082]",
    done: "bg-[#F0FFF2] border-[#A8E6B0]",
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : fadeInUp}
      className={cn(
        "flex flex-col rounded-2xl border-2 transition-all duration-200 min-w-[280px] w-[280px] flex-shrink-0",
        colColors[status],
        isOver && "ring-2 ring-[#7B68EE] ring-offset-2"
      )}
      onDragOver={(e) => { e.preventDefault(); onDragOver(status); }}
      onDrop={() => onDrop(status)}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/5">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: cfg?.color ?? "#94A3B8" }}
          />
          <span className="text-sm font-bold text-gray-800">{cfg?.label ?? status}</span>
          <span className="text-xs font-semibold text-gray-400 bg-white/70 px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="p-1 rounded-lg hover:bg-white/60 transition-colors text-gray-400 hover:text-gray-700"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)]">
        <AnimatePresence>
          {tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={() => onDragStart(task.id)}
            >
              <KanbanCard
                task={task}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            </div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center mb-2">
              <Plus className="w-5 h-5" />
            </div>
            <p className="text-xs">No tasks here</p>
          </div>
        )}
      </div>

      {/* Add Task Footer */}
      <button
        onClick={() => onAddTask(status)}
        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500 hover:text-gray-800 hover:bg-white/40 transition-colors rounded-b-2xl border-t border-black/5"
      >
        <Plus className="w-4 h-4" />
        Add task
      </button>
    </motion.div>
  );
}

// ─── List Row ─────────────────────────────────────────────────────────────────
interface ListRowProps {
  task: MockTask;
  index: number;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

function ListRow({ task, index, onStatusChange, onDelete }: ListRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.tr
      variants={shouldReduceMotion ? {} : fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.04 }}
      className="group hover:bg-[#F8F7FF] transition-colors border-b border-gray-100 last:border-0"
    >
      {/* Drag handle + title */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <GripVertical className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-xs">{task.title}</p>
            {task.description && (
              <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">{task.description}</p>
            )}
          </div>
        </div>
      </td>

      {/* Priority */}
      <td className="px-3 py-3 whitespace-nowrap">
        <PriorityBadge priority={task.priority} />
      </td>

      {/* Status */}
      <td className="px-3 py-3 whitespace-nowrap">
        <StatusChip status={task.status} />
      </td>

      {/* Assignee */}
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <AssigneeAvatar userId={task.assigneeId} size="sm" />
          <span className="text-xs text-gray-600 hidden lg:block">
            {getUserById(task.assigneeId)?.name ?? "—"}
          </span>
        </div>
      </td>

      {/* Due Date */}
      <td className="px-3 py-3 whitespace-nowrap">
        {task.dueDate ? (
          <span className={cn("text-xs flex items-center gap-1", isOverdue(task.dueDate) ? "text-red-500 font-semibold" : "text-gray-500")}>
            <Calendar className="w-3 h-3" />
            {formatDate(task.dueDate)}
          </span>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>

      {/* Tags */}
      <td className="px-3 py-3 hidden xl:table-cell">
        <div className="flex gap-1 flex-wrap">
          {(task.tags ?? []).slice(0, 2).map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 bg-[#F0EEFF] text-[#7B68EE] text-xs rounded font-medium">
              {tag}
            </span>
          ))}
        </div>
      </td>

      {/* Meta */}
      <td className="px-3 py-3 whitespace-nowrap hidden lg:table-cell">
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          {task.subtaskCount > 0 && (
            <span className="flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" />
              {task.subtaskDone}/{task.subtaskCount}
            </span>
          )}
          {task.commentCount > 0 && (
            <span className="flex items-center gap-0.5">
              <MessageSquare className="w-3 h-3" />
              {task.commentCount}
            </span>
          )}
        </div>
      </td>

      {/* Actions */}
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 z-20 bg-white border border-gray-100 rounded-xl shadow-xl py-1 w-44">
              {STATUS_ORDER.filter((s) => s !== task.status).map((s) => (
                <button
                  key={s}
                  onClick={() => { onStatusChange(task.id, s); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3" />
                  Move to {STATUS_CONFIG[s]?.label}
                </button>
              ))}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={() => { onDelete(task.id); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"
                >
                  <X className="w-3 h-3" />
                  Delete Task
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

// ─── STATUS_CONFIG guard (in case truncated in shared foundation) ─────────────
const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  todo: { label: "To Do", color: "#94A3B8", bg: "#F1F5F9" },
  in_progress: { label: "In Progress", color: "#7B68EE", bg: "#F0EEFF" },
  review: { label: "Review", color: "#FFD93D", bg: "#FFFBEB" },
  done: { label: "Done", color: "#6BCB77", bg: "#F0FFF2" },
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ListViewPage() {
  const params = useParams();
  const listId = (params?.listId as string) ?? "default";
  const listName = LIST_NAMES[listId] ?? LIST_NAMES["default"];

  const shouldReduceMotion = useReducedMotion();

  // ── State ──
  const [tasks, setTasks] = useState<MockTask[]>(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [sortField, setSortField] = useState<"dueDate" | "priority" | "title" | "status">("dueDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createDefaultStatus, setCreateDefaultStatus] = useState<TaskStatus>("todo");
  const [dragTaskId, setDragTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // ── Derived: filtered + sorted tasks ──
  const filteredTasks = (tasks ?? []).filter((t) => {
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterAssignee !== "all" && t.assigneeId !== filterAssignee) return false;
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !(t.description ?? "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const priorityOrder: Record<Priority, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
  const statusOrder: Record<TaskStatus, number> = { todo: 0, in_progress: 1, review: 2, done: 3 };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let cmp = 0;
    if (sortField === "dueDate") {
      cmp = (a.dueDate ?? "").localeCompare(b.dueDate ?? "");
    } else if (sortField === "priority") {
      cmp = (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
    } else if (sortField === "title") {
      cmp = a.title.localeCompare(b.title);
    } else if (sortField === "status") {
      cmp = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  // ── Handlers ──
  const handleStatusChange = useCallback((taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  }, []);

  const handleDelete = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const handleAddTask = useCallback((task: MockTask) => {
    setTasks((prev) => [task, ...prev]);
  }, []);

  const handleOpenCreate = (status: TaskStatus = "todo") => {
    setCreateDefaultStatus(status);
    setShowCreateModal(true);
  };

  const handleDragStart = (taskId: string) => setDragTaskId(taskId);
  const handleDragOver = (status: TaskStatus) => setDragOverColumn(status);
  const handleDrop = (status: TaskStatus) => {
    if (dragTaskId) {
      handleStatusChange(dragTaskId, status);
    }
    setDragTaskId(null);
    setDragOverColumn(null);
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const activeFiltersCount = [
    filterPriority !== "all",
    filterAssignee !== "all",
    filterStatus !== "all",
  ].filter(Boolean).length;

  const tasksByStatus = STATUS_ORDER.reduce<Record<TaskStatus, MockTask[]>>(
    (acc, s) => {
      acc[s] = sortedTasks.filter((t) => t.status === s);
      return acc;
    },
    { todo: [], in_progress: [], review: [], done: [] }
  );

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F4F4F8]">
      {/* Page Header */}
      <motion.div
        variants={shouldReduceMotion ? {} : fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-5"
      >
        <div className="max-w-screen-2xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/workspace" className="hover:text-[#7B68EE] transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/workspace" className="hover:text-[#7B68EE] transition-colors">Engineering</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 font-medium">{listName}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </span>
                {listName}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500">{totalTasks} tasks</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-[#7B68EE] to-[#6BCB77] rounded-full"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-500">{progressPct}% done</span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              onClick={() => handleOpenCreate("todo")}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#7B68EE] hover:bg-[#6A57DD] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#7B68EE]/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        variants={shouldReduceMotion ? {} : fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3"
      >
        <div className="max-w-screen-2xl mx-auto flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                viewMode === "kanban"
                  ? "bg-white text-[#7B68E