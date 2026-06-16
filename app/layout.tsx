import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlowTask — Modern Project Management",
  description:
    "Organize workspaces, manage projects, track tasks, and collaborate in real time with FlowTask — the modern ClickUp-inspired productivity platform.",
  keywords: ["project management", "tasks", "kanban", "productivity", "team collaboration"],
  authors: [{ name: "FlowTask Team" }],
  openGraph: {
    title: "FlowTask — Modern Project Management",
    description: "Organize workspaces, manage projects, and track tasks with FlowTask.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#F4F4F8] text-[#1E1E2E] font-sans antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}