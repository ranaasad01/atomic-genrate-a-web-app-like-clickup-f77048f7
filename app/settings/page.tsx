"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { User, Settings, Bell, Palette, Building2, Camera, Save, Check, X, ChevronDown, Mail, Lock, Globe, Users, Shield, Trash2, Plus, Moon, Sun, Monitor } from 'lucide-react';
import { fadeInUp, fadeIn, staggerContainer, scaleIn } from "@/lib/motion";
import { BRAND_COLORS, APP_NAME } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PROFILE = {
  name: "Alex Johnson",
  email: "alex.johnson@flowtask.io",
  role: "Product Manager",
  bio: "Building great products one sprint at a time. Passionate about design systems and developer experience.",
  timezone: "America/New_York",
  language: "English",
  avatarInitials: "AJ",
  avatarColor: "#7B68EE",
};

const MOCK_WORKSPACE = {
  name: "FlowTask HQ",
  description: "Main workspace for the product team.",
  iconColor: "#7B68EE",
  plan: "Pro",
  membersCount: 12,
};

const MOCK_MEMBERS = [
  { id: "1", name: "Alex Johnson", email: "alex.johnson@flowtask.io", role: "Owner", avatarInitials: "AJ", color: "#7B68EE" },
  { id: "2", name: "Sarah Chen", email: "sarah.chen@flowtask.io", role: "Admin", avatarInitials: "SC", color: "#FF6B6B" },
  { id: "3", name: "Marcus Williams", email: "marcus.w@flowtask.io", role: "Member", avatarInitials: "MW", color: "#6BCB77" },
  { id: "4", name: "Priya Patel", email: "priya.p@flowtask.io", role: "Member", avatarInitials: "PP", color: "#FFD93D" },
  { id: "5", name: "Jordan Lee", email: "jordan.l@flowtask.io", role: "Viewer", avatarInitials: "JL", color: "#FF9F43" },
];

const ACCENT_COLORS = [
  { name: "Violet", value: "#7B68EE" },
  { name: "Rose", value: "#FF6B6B" },
  { name: "Emerald", value: "#6BCB77" },
  { name: "Amber", value: "#FFD93D" },
  { name: "Orange", value: "#FF9F43" },
  { name: "Sky", value: "#38BDF8" },
  { name: "Pink", value: "#F472B6" },
  { name: "Teal", value: "#2DD4BF" },
];

const WORKSPACE_ICON_COLORS = [
  "#7B68EE", "#FF6B6B", "#6BCB77", "#FFD93D",
  "#FF9F43", "#38BDF8", "#F472B6", "#2DD4BF",
];

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
];

const LANGUAGES = ["English", "Spanish", "French", "German", "Japanese", "Portuguese"];

type TabId = "profile" | "workspace" | "appearance" | "notifications";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
];

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  Owner: { bg: "#F0EEFF", text: "#7B68EE" },
  Admin: { bg: "#FFF0F0", text: "#FF6B6B" },
  Member: { bg: "#F0FFF2", text: "#4CAF50" },
  Viewer: { bg: "#F1F5F9", text: "#64748B" },
};

// ─── Toast Component ──────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1E1E2E] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-white/10"
    >
      <span className="w-6 h-6 rounded-full bg-[#6BCB77] flex items-center justify-center flex-shrink-0">
        <Check className="w-3.5 h-3.5 text-white" />
      </span>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-white/40 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7B68EE] focus:ring-offset-2 ${
        checked ? "bg-[#7B68EE]" : "bg-gray-200"
      }`}
    >
      <motion.span
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      variants={shouldReduceMotion ? {} : fadeInUp}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-semibold text-[#1E1E2E]">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </motion.div>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#1E1E2E]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1E1E2E] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] transition-all placeholder:text-gray-400"
      />
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab({ onSave }: { onSave: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const [name, setName] = useState(MOCK_PROFILE.name);
  const [email, setEmail] = useState(MOCK_PROFILE.email);
  const [role, setRole] = useState(MOCK_PROFILE.role);
  const [bio, setBio] = useState(MOCK_PROFILE.bio);
  const [timezone, setTimezone] = useState(MOCK_PROFILE.timezone);
  const [language, setLanguage] = useState(MOCK_PROFILE.language);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Avatar */}
      <Section title="Profile Photo" description="Your avatar is visible to all workspace members.">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md"
              style={{ backgroundColor: MOCK_PROFILE.avatarColor }}
            >
              {MOCK_PROFILE.avatarInitials}
            </div>
            <motion.button
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#7B68EE] rounded-xl flex items-center justify-center shadow-md hover:bg-[#6A5ACD] transition-colors"
            >
              <Camera className="w-4 h-4 text-white" />
            </motion.button>
          </div>
          <div>
            <p className="text-sm font-medium text-[#1E1E2E]">Upload a new photo</p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
            <div className="flex gap-2 mt-3">
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className="px-3 py-1.5 text-xs font-medium bg-[#7B68EE] text-white rounded-lg hover:bg-[#6A5ACD] transition-colors"
              >
                Upload Photo
              </motion.button>
              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Remove
              </motion.button>
            </div>
          </div>
        </div>
      </Section>

      {/* Personal Info */}
      <Section title="Personal Information" description="Update your name, email, and role.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Full Name" value={name} onChange={setName} placeholder="Your full name" />
          <InputField label="Job Title / Role" value={role} onChange={setRole} placeholder="e.g. Product Manager" />
          <div className="sm:col-span-2">
            <InputField label="Email Address" value={email} onChange={setEmail} type="email" placeholder="you@example.com" hint="Changing your email requires verification." />
          </div>
          <div className="sm:col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1E1E2E]">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell your team a bit about yourself..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1E1E2E] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] transition-all placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>
      </Section>

      {/* Locale */}
      <Section title="Locale & Language" description="Set your timezone and preferred language.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1E1E2E]">Timezone</label>
            <div className="relative">
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1E1E2E] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] transition-all appearance-none pr-9"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz.replace("_", " ")}</option>
                ))}
              </select>
              <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1E1E2E]">Language</label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1E1E2E] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] transition-all appearance-none pr-9"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </Section>

      {/* Password */}
      <Section title="Change Password" description="Use a strong password with at least 8 characters.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <InputField label="Current Password" value={currentPassword} onChange={setCurrentPassword} type="password" placeholder="••••••••" />
          </div>
          <InputField label="New Password" value={newPassword} onChange={setNewPassword} type="password" placeholder="••••••••" />
          <InputField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} type="password" placeholder="••••••••" />
        </div>
      </Section>

      {/* Save */}
      <div className="flex justify-end">
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#7B68EE] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#7B68EE]/30 hover:bg-[#6A5ACD] transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Workspace Tab ────────────────────────────────────────────────────────────

function WorkspaceTab({ onSave }: { onSave: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const [wsName, setWsName] = useState(MOCK_WORKSPACE.name);
  const [wsDescription, setWsDescription] = useState(MOCK_WORKSPACE.description);
  const [iconColor, setIconColor] = useState(MOCK_WORKSPACE.iconColor);
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleRoleChange = (id: string, newRole: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Workspace Identity */}
      <Section title="Workspace Identity" description="Customize how your workspace appears to members.">
        <div className="flex items-start gap-5 mb-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0 transition-colors duration-300"
            style={{ backgroundColor: iconColor }}
          >
            {wsName.charAt(0) ?? "W"}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#1E1E2E] mb-2">Icon Color</p>
            <div className="flex flex-wrap gap-2">
              {WORKSPACE_ICON_COLORS.map((color) => (
                <motion.button
                  key={color}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.15 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                  onClick={() => setIconColor(color)}
                  className="w-7 h-7 rounded-lg transition-all"
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                >
                  {iconColor === color && (
                    <Check className="w-3.5 h-3.5 text-white mx-auto" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <InputField label="Workspace Name" value={wsName} onChange={setWsName} placeholder="e.g. Acme Corp" />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1E1E2E]">Description</label>
            <textarea
              value={wsDescription}
              onChange={(e) => setWsDescription(e.target.value)}
              rows={2}
              placeholder="What does this workspace do?"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1E1E2E] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] transition-all placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 p-3 bg-[#F0EEFF] rounded-xl">
          <Shield className="w-4 h-4 text-[#7B68EE] flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#7B68EE]">Pro Plan</p>
            <p className="text-xs text-[#7B68EE]/70">Unlimited members, advanced permissions, and priority support.</p>
          </div>
        </div>
      </Section>

      {/* Members */}
      <Section title="Team Members" description={`${members.length} members in this workspace.`}>
        {/* Invite */}
        <div className="flex gap-2 mb-5">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Invite by email address..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1E1E2E] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] transition-all placeholder:text-gray-400"
          />
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#7B68EE] text-white text-sm font-medium rounded-xl hover:bg-[#6A5ACD] transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Invite
          </motion.button>
        </div>

        {/* Member List */}
        <div className="space-y-2">
          {members.map((member) => {
            const roleStyle = ROLE_COLORS[member.role] ?? { bg: "#F1F5F9", text: "#64748B" };
            return (
              <motion.div
                key={member.id}
                variants={shouldReduceMotion ? {} : fadeInUp}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: member.color }}
                >
                  {member.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1E1E2E] truncate">{member.name}</p>
                  <p className="text-xs text-gray-400 truncate">{member.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{ backgroundColor: roleStyle.bg, color: roleStyle.text }}
                  >
                    {member.role}
                  </span>
                  {member.role !== "Owner" && (
                    <div className="relative">
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        className="text-xs text-gray-500 bg-transparent border-none focus:outline-none cursor-pointer opacity-0 absolute inset-0 w-full"
                        aria-label={`Change role for ${member.name}`}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  )}
                  {member.role !== "Owner" && (
                    <motion.button
                      whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
                      onClick={() => handleRemoveMember(member.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
                      aria-label={`Remove ${member.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Danger Zone */}
      <Section title="Danger Zone" description="Irreversible actions for this workspace.">
        <div className="flex items-center justify-between p-4 border border-red-100 rounded-xl bg-red-50/50">
          <div>
            <p className="text-sm font-semibold text-red-600">Delete Workspace</p>
            <p className="text-xs text-red-400 mt-0.5">Permanently delete this workspace and all its data.</p>
          </div>
          <motion.button
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="px-4 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
          >
            Delete
          </motion.button>
        </div>
      </Section>

      <div className="flex justify-end">
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#7B68EE] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#7B68EE]/30 hover:bg-[#6A5ACD] transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Appearance Tab ───────────────────────────────────────────────────────────

type ThemeMode = "light" | "dark" | "system";

function AppearanceTab({ onSave }: { onSave: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [accentColor, setAccentColor] = useState("#7B68EE");
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [fontSize, setFontSize] = useState("medium");

  const THEME_OPTIONS: { id: ThemeMode; label: string; icon: React.ElementType; desc: string }[] = [
    { id: "light", label: "Light", icon: Sun, desc: "Clean and bright interface" },
    { id: "dark", label: "Dark", icon: Moon, desc: "Easy on the eyes at night" },
    { id: "system", label: "System", icon: Monitor, desc: "Follows your OS preference" },
  ];

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Theme */}
      <Section title="Theme" description="Choose how FlowTask looks for you.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {THEME_OPTIONS.map(({ id, label, icon: Icon, desc }) => (
            <motion.button
              key={id}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              onClick={() => setThemeMode(id)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                themeMode === id
                  ? "border-[#7B68EE] bg-[#F0EEFF]"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              {themeMode === id && (
                <span className="absolute top-3 right-3 w-5 h-5 bg-[#7B68EE] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </span>
              )}
              <Icon className={`w-5 h-5 mb-2 ${themeMode === id ? "text-[#7B68EE]" : "text-gray-400"}`} />
              <p className={`text-sm font-semibold ${themeMode === id ? "text-[#7B68EE]" : "text-[#1E1E2E]"}`}>{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </motion.button>
          ))}
        </div>
      </Section>

      {/* Accent Color */}
      <Section title="Accent Color" description="Personalize your interface with a custom accent color.">
        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map(({ name, value }) => (
            <motion.button
              key={value}
              whileHover={shouldReduceMotion ? {} : { scale: 1.12, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
              onClick={() => setAccentColor(value)}
              title={name}
              className="relative w-10 h-10 rounded-xl shadow-sm transition-all"
              style={{ backgroundColor: value }}
              aria-label={`Select ${name} accent color`}
            >
              {accentColor === value && (
                <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
              )}
            </motion.button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
          <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: accentColor }} />
          <div>
            <p className="text-sm font-medium text-[#1E1E2E]">
              {ACCENT_COLORS.find((c) => c.value === accentColor)?.name ?? "Custom"} accent
            </p>
            <p className="text-xs text-gray-400">{accentColor}</p>
          </div>
        </div>
      </Section>

      {/* Layout & Display */}
      <Section title="Layout & Display" description="Adjust density, sidebar, and font size.">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[#1E1E2E]">Compact Mode</p>
              <p className="text-xs text-gray-400">Reduce spacing for a denser layout</p>
            </div>
            <Toggle checked={compactMode} onChange={setCompactMode} />
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[#1E1E2E]">Collapse Sidebar by Default</p>
              <p className="text-xs text-gray-400">Start with the sidebar minimized</p>
            </div>
            <Toggle checked={sidebarCollapsed} onChange={setSidebarCollapsed} />
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[#1E1E2E]">Enable Animations</p>
              <p className="text-xs text-gray-400">Smooth transitions and micro-interactions</p>
            </div>
            <Toggle checked={animationsEnabled} onChange={setAnimationsEnabled} />
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[#1E1E2E]">Font Size</p>
              <p className="text-xs text-gray-400">Adjust the base text size</p>
            </div>
            <div className="flex gap-1">
              {["small", "medium", "large"].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                    fontSize === size
                      ? "bg-[#7B68EE] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <div className="flex justify-end">
        <motion.button
          whileHover={shouldReduceMotion ? {} : { scale: 1.02, y: -1 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          onClick={onSave}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#7B68EE] text-white text-sm font-semibold rounded-xl shadow-md shadow-[#7B68EE]/30 hover:bg-[#6A5ACD] transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Preferences
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

interface NotifSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

const INITIAL_NOTIF_SETTINGS: NotifSetting[] = [
  { id: "task_assigned", label: "Task Assigned to Me", description: "When someone assigns a task to you", email: true, push: true, inApp: true },
  { id: "task_mentioned", label: "Mentioned in a Comment", description: "When someone @mentions you", email: true, push: true, inApp: true },
  { id: "task_comment", label: "New Comment on My Task", description: "When someone comments on your task", email: false, push: true, inApp: true },
  { id: "status_change", label: "Task Status Changed", description: "When a task you follow changes status", email: false, push: false, inApp: true },
  { id: "due_date", label: "Due Date Reminders", description: "Reminders before tasks are due", email: true, push: true, inApp: true },
  { id: "task_completed", label: "Task Completed", description: "When a task you assigned is completed", email: false, push: false, inApp: true },
  { id: "member_joined", label: "New Member Joined", description: "When someone joins your workspace", email: true, push: false, inApp: true },
  { id: "goal_update", label: "Goal Progress Update", description: "Weekly summary of goal progress", email: true, push: false, inApp: false },
];

function NotificationsTab({ onSave }: { onSave: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const [settings, setSettings] = useState<NotifSetting[]>(INITIAL_NOTIF_SETTINGS);
  const [digestFrequency, setDigestFrequency] = useState("daily");
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("08:00");

  const toggleChannel = (id: string, channel: "email" | "push" | "inApp") => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [channel]: !s[channel] } : s))
    );
  };

  return (
    <motion.div
      variants={shouldReduceMotion ? {} : staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Channel Headers */}
      <Section title="Notification Preferences" description="Choose how and when you receive notifications.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr>
                <th className="text-left pb-3 pr-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Event</span>
                </th>
                <th className="pb-3 px-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</span>
                  </div>
                </th>
                <th className="pb-3 px-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Push</span>
                  </div>
                </th>
                <th className="pb-3 px-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Monitor className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">In-App</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {settings.map((setting) => (
                <motion.tr
                  key={setting.id}
                  variants={shouldReduceMotion ? {} : fadeInUp}
                  className="group hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3.5 pr-4">
                    <p className="text-sm font-medium text-[#1E1E2E]">{setting.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{setting.description}</p>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex justify-center">
                      <Toggle checked={setting.email} onChange={() => toggleChannel(setting.id, "email")} />
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex justify-center">
                      <Toggle checked={setting.push} onChange={() => toggleChannel(setting.id, "push")} />
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="flex justify-center">
                      <Toggle checked={setting.inApp} onChange={() => toggleChannel(setting.id, "inApp")} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Email Digest */}
      <Section title="Email Digest" description="Receive a summary of activity instead of individual emails.">
        <div className="flex flex-wrap gap-2">
          {["realtime", "daily", "weekly", "never"].map((freq) => (
            <button
              key={freq}
              onClick={() => setDigestFrequency(freq)}
              className={`px-4 py-2 text-sm font-medium rounded-xl capitalize transition-all ${
                digestFrequency === freq
                  ? "bg-[#7B68EE] text-white shadow-md shadow-[#7B68EE]/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {freq === "realtime" ? "Real-time" : freq.charAt(0).toUpperCase() + freq.slice(1)}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          {digestFrequency === "realtime" && "You'll receive an email for every notification event."}
          {digestFrequency === "daily" && "You'll receive a daily digest at 8:00 AM in your timezone."}
          {digestFrequency === "weekly" && "You'll receive a weekly digest every Monday morning."}
          {digestFrequency === "never" && "No email digests will be sent."}
        </p>
      </Section>

      {/* Quiet Hours */}
      <Section title="Quiet Hours" description="Pause push notifications during specific hours.">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-[#1E1E2E]">Enable Quiet Hours</p>
            <p className="text-xs text-gray-400">Suppress push notifications during this window</p>
          </div>
          <Toggle checked={quietHoursEnabled} onChange={setQuietHoursEnabled} />
        </div>
        {quietHoursEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 gap-4 pt-2"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1E1E2E]">Start Time</label>
              <input
                type="time"
                value={quietStart}
                onChange={(e) => setQuietStart(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1E1E2E] bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B68EE]/30 focus:border-[#7B68EE] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1E1E2E]">End Time</label>