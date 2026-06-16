// ─── Brand Constants ──────────────────────────────────────────────────────────
export const APP_NAME = "FlowTask";
export const APP_TAGLINE = "Work smarter. Ship faster. Together.";
export const APP_DESCRIPTION =
  "The modern project management platform that brings your team's work into one place — tasks, docs, goals, and more.";

// ─── Color Palette ────────────────────────────────────────────────────────────
export const BRAND_COLORS = {
  primary: "#7B68EE",
  dark: "#1E1E2E",
  white: "#FFFFFF",
  surface: "#F4F4F8",
  danger: "#FF6B6B",
  warning: "#FFD93D",
  success: "#6BCB77",
} as const;

// ─── Navigation Links (single source of truth) ───────────────────────────────
export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Workspace", href: "/workspace" },
  { label: "Notifications", href: "/notifications" },
  { label: "Settings", href: "/settings" },
];

export const footerLinks: { section: string; links: NavLink[] }[] = [
  {
    section: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Workspace", href: "/workspace" },
      { label: "Settings", href: "/settings" },
    ],
  },
  {
    section: "Features",
    links: [
      { label: "Kanban Boards", href: "/workspace" },
      { label: "Task Management", href: "/workspace" },
      { label: "Notifications", href: "/notifications" },
    ],
  },
  {
    section: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
    ],
  },
];

// ─── Shared Types ─────────────────────────────────────────────────────────────
export type Priority = "urgent" | "high" | "normal" | "low";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  assigneeId?: string;
  listId: string;
  subtasks?: SubTask[];
  comments?: Comment[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface TaskList {
  id: string;
  name: string;
  spaceId: string;
  color: string;
  taskIds: string[];
  progress?: number;
}

export interface Space {
  id: string;
  name: string;
  color: string;
  icon: string;
  listIds: string[];
  workspaceId: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  spaceIds: string[];
  memberIds: string[];
}

export interface Notification {
  id: string;
  type: "mention" | "assignment" | "comment" | "status_change" | "due_date";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  taskId?: string;
  userId?: string;
}

// ─── Priority Config ──────────────────────────────────────────────────────────
export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bg: string }
> = {
  urgent: { label: "Urgent", color: "#FF6B6B", bg: "#FFF0F0" },
  high: { label: "High", color: "#FF9F43", bg: "#FFF5EC" },
  normal: { label: "Normal", color: "#7B68EE", bg: "#F0EEFF" },
  low: { label: "Low", color: "#6BCB77", bg: "#F0FFF2" },
};

// ─── Status Config ────────────────────────────────────────────────────────────
export const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; bg: string }
> = {
  todo: { label: "To Do", color: "#94A3B8", bg: "#F1F5F9" },
  in_progress: { label: "In Progress", color: "#7B68EE", bg: "#F0EEFF" },
  review: { label: "Review", color: "#FFD93D", bg: "#FFFBEB" },
  done: { label: "Done", color: "#6BCB77", bg: "#F0FFF2" },
};