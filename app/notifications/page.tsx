"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Bell, Check, CheckCheck, AtSign, ClipboardList, RefreshCw, Calendar, MessageSquare, Filter, Trash2, ChevronRight } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Types ────────────────────────────────────────────────────────────────────
type NotifType = "mention" | "assignment" | "comment" | "status_change" | "due_date";
type FilterTab = "all" | "mentions" | "tasks" | "updates";

interface MockNotification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  taskId?: string;
  userId?: string;
  avatarInitials: string;
  avatarColor: string;
  taskTitle?: string;
  spaceName?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_NOTIFICATIONS: MockNotification[] = [
  {
    id: "n1",
    type: "mention",
    title: "Alex mentioned you",
    message: "Hey @you, can you review the new landing page designs before EOD?",
    read: false,
    createdAt: "2024-01-15T09:23:00Z",
    taskId: "task-101",
    userId: "u1",
    avatarInitials: "AJ",
    avatarColor: "#7B68EE",
    taskTitle: "Landing Page Redesign",
    spaceName: "Marketing",
  },
  {
    id: "n2",
    type: "assignment",
    title: "Task assigned to you",
    message: "Sarah assigned you to 'Implement OAuth2 login flow' in the Backend space.",
    read: false,
    createdAt: "2024-01-15T08:45:00Z",
    taskId: "task-102",
    userId: "u2",
    avatarInitials: "SC",
    avatarColor: "#FF6B6B",
    taskTitle: "Implement OAuth2 Login Flow",
    spaceName: "Backend",
  },
  {
    id: "n3",
    type: "comment",
    title: "New comment on your task",
    message: "Marcus left a comment: 'The API integration looks good, but we need to handle edge cases for expired tokens.'",
    read: false,
    createdAt: "2024-01-15T07:30:00Z",
    taskId: "task-103",
    userId: "u3",
    avatarInitials: "ML",
    avatarColor: "#6BCB77",
    taskTitle: "API Integration Testing",
    spaceName: "Engineering",
  },
  {
    id: "n4",
    type: "status_change",
    title: "Task status updated",
    message: "Priya moved 'User Dashboard Analytics' from In Progress to Review.",
    read: false,
    createdAt: "2024-01-14T16:55:00Z",
    taskId: "task-104",
    userId: "u4",
    avatarInitials: "PK",
    avatarColor: "#FFD93D",
    taskTitle: "User Dashboard Analytics",
    spaceName: "Product",
  },
  {
    id: "n5",
    type: "due_date",
    title: "Task due tomorrow",
    message: "'Mobile App Onboarding Flow' is due tomorrow. Make sure to complete it on time.",
    read: true,
    createdAt: "2024-01-14T14:00:00Z",
    taskId: "task-105",
    userId: "u5",
    avatarInitials: "FT",
    avatarColor: "#7B68EE",
    taskTitle: "Mobile App Onboarding Flow",
    spaceName: "Design",
  },
  {
    id: "n6",
    type: "mention",
    title: "Jordan mentioned you",
    message: "@you what do you think about switching to a microservices architecture for the new module?",
    read: true,
    createdAt: "2024-01-14T11:20:00Z",
    taskId: "task-106",
    userId: "u6",
    avatarInitials: "JR",
    avatarColor: "#FF9F43",
    taskTitle: "Architecture Planning Q1",
    spaceName: "Engineering",
  },
  {
    id: "n7",
    type: "comment",
    title: "Reply to your comment",
    message: "Lena replied: 'Agreed! I'll update the Figma file with the revised color tokens by tomorrow morning.'",
    read: true,
    createdAt: "2024-01-14T10:05:00Z",
    taskId: "task-107",
    userId: "u7",
    avatarInitials: "LW",
    avatarColor: "#6BCB77",
    taskTitle: "Design System Tokens",
    spaceName: "Design",
  },
  {
    id: "n8",
    type: "assignment",
    title: "New task assigned",
    message: "You've been assigned to 'Write Q1 Performance Report' by the team lead.",
    read: true,
    createdAt: "2024-01-13T15:30:00Z",
    taskId: "task-108",
    userId: "u8",
    avatarInitials: "TM",
    avatarColor: "#7B68EE",
    taskTitle: "Write Q1 Performance Report",
    spaceName: "Operations",
  },
  {
    id: "n9",
    type: "status_change",
    title: "Task completed",
    message: "Chris marked 'Set up CI/CD Pipeline' as Done. Great work team!",
    read: true,
    createdAt: "2024-01-13T13:00:00Z",
    taskId: "task-109",
    userId: "u9",
    avatarInitials: "CK",
    avatarColor: "#FF6B6B",
    taskTitle: "Set up CI/CD Pipeline",
    spaceName: "DevOps",
  },
  {
    id: "n10",
    type: "due_date",
    title: "Overdue task alert",
    message: "'Competitor Analysis Report' was due 2 days ago and is still in progress.",
    read: true,
    createdAt: "2024-01-13T09:00:00Z",
    taskId: "task-110",
    userId: "u10",
    avatarInitials: "FT",
    avatarColor: "#7B68EE",
    taskTitle: "Competitor Analysis Report",
    spaceName: "Marketing",
  },
  {
    id: "n11",
    type: "mention",
    title: "Nina mentioned you",
    message: "@you can you double-check the payment gateway integration? There's a discrepancy in the test logs.",
    read: false,
    createdAt: "2024-01-12T17:45:00Z",
    taskId: "task-111",
    userId: "u11",
    avatarInitials: "NP",
    avatarColor: "#9B8FFF",
    taskTitle: "Payment Gateway Integration",
    spaceName: "Backend",
  },
  {
    id: "n12",
    type: "comment",
    title: "Comment on shared task",
    message: "David added: 'I've pushed the hotfix to staging. Please verify before we deploy to production.'",
    read: false,
    createdAt: "2024-01-12T14:20:00Z",
    taskId: "task-112",
    userId: "u12",
    avatarInitials: "DH",
    avatarColor: "#FFD93D",
    taskTitle: "Production Hotfix v2.3.1",
    spaceName: "Engineering",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatRelativeTime(isoString: string): string {
  const now = new Date("2024-01-15T12:00:00Z");
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  return `${diffDays}d ago`;
}

function formatFullDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TYPE_CONFIG: Record<
  NotifType,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  mention: { icon: AtSign, color: "#7B68EE", bg: "#F0EEFF", label: "Mention" },
  assignment: { icon: ClipboardList, color: "#FF9F43", bg: "#FFF5EC", label: "Assignment" },
  comment: { icon: MessageSquare, color: "#6BCB77", bg: "#F0FFF2", label: "Comment" },
  status_change: { icon: RefreshCw, color: "#FFD93D", bg: "#FFFBEB", label: "Status" },
  due_date: { icon: Calendar, color: "#FF6B6B", bg: "#FFF0F0", label: "Due Date" },
};

const FILTER_TABS: { id: FilterTab; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Bell },
  { id: "mentions", label: "Mentions", icon: AtSign },
  { id: "tasks", label: "Tasks", icon: ClipboardList },
  { id: "updates", label: "Updates", icon: RefreshCw },
];

function filterNotifications(
  notifications: MockNotification[],
  tab: FilterTab
): MockNotification[] {
  if (tab === "all") return notifications;
  if (tab === "mentions") return notifications.filter((n) => n.type === "mention");
  if (tab === "tasks")
    return notifications.filter(
      (n) => n.type === "assignment" || n.type === "due_date"
    );
  if (tab === "updates")
    return notifications.filter(
      (n) => n.type === "status_change" || n.type === "comment"
    );
  return notifications;
}

// ─── Notification Card ────────────────────────────────────────────────────────
interface NotifCardProps {
  notif: MockNotification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotifCard({ notif, onMarkRead, onDelete }: NotifCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const config = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.comment;
  const Icon = config.icon;

  const handleClick = useCallback(() => {
    if (!notif.read) onMarkRead(notif.id);
    if (notif.taskId) {
      router.push(`/workspace`);
    }
  }, [notif, onMarkRead, router]);

  return (
    <motion.div
      layout
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      whileHover={shouldReduceMotion ? {} : { y: -1, scale: 1.005 }}
      className={`group relative flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
        notif.read
          ? "bg-white border-gray-100 hover:border-[#7B68EE]/30 hover:shadow-sm"
          : "bg-[#F8F7FF] border-[#7B68EE]/20 hover:border-[#7B68EE]/40 hover:shadow-md shadow-sm"
      }`}
      onClick={handleClick}
    >
      {/* Unread dot */}
      {!notif.read && (
        <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-[#7B68EE] shadow-sm shadow-[#7B68EE]/40" />
      )}

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
          style={{ backgroundColor: notif.avatarColor }}
        >
          {notif.avatarInitials}
        </div>
        <div
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
          style={{ backgroundColor: config.bg, border: `1.5px solid ${config.color}20` }}
        >
          <Icon className="w-2.5 h-2.5" style={{ color: config.color }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span
            className={`text-sm font-semibold ${
              notif.read ? "text-gray-700" : "text-[#1E1E2E]"
            }`}
          >
            {notif.title}
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded-full font-medium"
            style={{ color: config.color, backgroundColor: config.bg }}
          >
            {config.label}
          </span>
        </div>

        <p
          className={`text-sm leading-relaxed mb-2 line-clamp-2 ${
            notif.read ? "text-gray-500" : "text-gray-700"
          }`}
        >
          {notif.message}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          {notif.taskTitle && (
            <span className="flex items-center gap-1 text-xs text-[#7B68EE] bg-[#F0EEFF] px-2 py-0.5 rounded-full font-medium">
              <ClipboardList className="w-3 h-3" />
              {notif.taskTitle}
            </span>
          )}
          {notif.spaceName && (
            <span className="text-xs text-gray-400 font-medium">
              {notif.spaceName}
            </span>
          )}
          <span
            className="text-xs text-gray-400 ml-auto"
            title={formatFullDate(notif.createdAt)}
          >
            {formatRelativeTime(notif.createdAt)}
          </span>
        </div>
      </div>

      {/* Actions (visible on hover) */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1">
        {!notif.read && (
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead(notif.id);
            }}
            className="p-1.5 rounded-lg bg-white border border-gray-200 text-[#7B68EE] hover:bg-[#F0EEFF] transition-colors shadow-sm"
            title="Mark as read"
          >
            <Check className="w-3.5 h-3.5" />
          </motion.button>
        )}
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notif.id);
          }}
          className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
          title="Delete notification"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-0.5" />
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ tab }: { tab: FilterTab }) {
  const messages: Record<FilterTab, { title: string; desc: string }> = {
    all: { title: "You're all caught up!", desc: "No notifications to show right now." },
    mentions: { title: "No mentions yet", desc: "When someone mentions you, it'll appear here." },
    tasks: { title: "No task notifications", desc: "Task assignments and due dates will show here." },
    updates: { title: "No updates", desc: "Status changes and comments will appear here." },
  };
  const msg = messages[tab] ?? messages.all;

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#F0EEFF] flex items-center justify-center mb-4">
        <Bell className="w-8 h-8 text-[#7B68EE]" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{msg.title}</h3>
      <p className="text-sm text-gray-500 max-w-xs">{msg.desc}</p>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const shouldReduceMotion = useReducedMotion();
  const [notifications, setNotifications] =
    useState<MockNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const handleClearAll = useCallback(() => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  }, []);

  const filtered = filterNotifications(notifications, activeTab);
  const displayed = showOnlyUnread ? filtered.filter((n) => !n.read) : filtered;

  const tabUnreadCounts: Record<FilterTab, number> = {
    all: notifications.filter((n) => !n.read).length,
    mentions: notifications.filter((n) => !n.read && n.type === "mention").length,
    tasks: notifications.filter(
      (n) => !n.read && (n.type === "assignment" || n.type === "due_date")
    ).length,
    updates: notifications.filter(
      (n) => !n.read && (n.type === "status_change" || n.type === "comment")
    ).length,
  };

  return (
    <main className="min-h-screen bg-[#F4F4F8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ── */}
        <motion.div
          variants={shouldReduceMotion ? {} : fadeInUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7B68EE] to-[#9B8FFF] flex items-center justify-center shadow-md">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#1E1E2E] tracking-tight">
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <motion.span
                    key={unreadCount}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-[#7B68EE] text-white text-xs font-bold shadow-sm"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </div>
              <p className="text-sm text-gray-500 ml-13 pl-[52px]">
                Stay on top of your team's activity and updates.
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {unreadCount > 0 && (
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-[#7B68EE]/40 hover:text-[#7B68EE] hover:bg-[#F0EEFF] transition-all shadow-sm"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </motion.button>
              )}
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear read
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Stats Bar ── */}
        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          {(
            [
              { label: "Total", value: notifications.length, color: "#7B68EE", bg: "#F0EEFF" },
              { label: "Unread", value: unreadCount, color: "#FF6B6B", bg: "#FFF0F0" },
              {
                label: "Mentions",
                value: notifications.filter((n) => n.type === "mention").length,
                color: "#7B68EE",
                bg: "#F0EEFF",
              },
              {
                label: "Tasks",
                value: notifications.filter(
                  (n) => n.type === "assignment" || n.type === "due_date"
                ).length,
                color: "#FF9F43",
                bg: "#FFF5EC",
              },
            ] as const
          ).map((stat) => (
            <motion.div
              key={stat.label}
              variants={shouldReduceMotion ? {} : scaleIn}
              className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 shadow-sm"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: stat.bg, color: stat.color }}
              >
                {stat.value}
              </div>
              <span className="text-xs font-medium text-gray-500">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Filter Tabs + Unread Toggle ── */}
        <motion.div
          variants={shouldReduceMotion ? {} : fadeIn}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between gap-3 mb-4 flex-wrap"
        >
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
            {FILTER_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = tabUnreadCounts[tab.id];
              return (
                <motion.button
                  key={tab.id}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#7B68EE] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {count > 0 && (
                    <span
                      className={`inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-white/25 text-white"
                          : "bg-[#7B68EE] text-white"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Unread filter toggle */}
          <button
            onClick={() => setShowOnlyUnread((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              showOnlyUnread
                ? "bg-[#F0EEFF] border-[#7B68EE]/30 text-[#7B68EE]"
                : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {showOnlyUnread ? "Showing unread" : "Show unread only"}
          </button>
        </motion.div>

        {/* ── Notification List ── */}
        <motion.div
          variants={shouldReduceMotion ? {} : staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          <AnimatePresence mode="popLayout">
            {displayed.length === 0 ? (
              <EmptyState tab={activeTab} />
            ) : (
              displayed.map((notif) => (
                <NotifCard
                  key={notif.id}
                  notif={notif}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Footer hint ── */}
        {displayed.length > 0 && (
          <motion.p
            variants={shouldReduceMotion ? {} : fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center text-xs text-gray-400 mt-8"
          >
            Showing {displayed.length} of {notifications.length} notifications
            {showOnlyUnread && " (unread only)"}
          </motion.p>
        )}
      </div>
    </main>
  );
}