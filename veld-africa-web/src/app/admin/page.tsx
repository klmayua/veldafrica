"use client"

import { motion } from "framer-motion"
import {
  Building2,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircle,
  Settings,
  Users,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import * as React from "react"

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: Building2 },
  { name: "Properties", href: "/admin/properties", icon: Home },
  { name: "Newsletters", href: "/admin/newsletters", icon: FileText },
  { name: "Subscribers", href: "/admin/subscribers", icon: Mail },
  { name: "WhatsApp", href: "/admin/whatsapp", icon: MessageCircle },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

const stats = [
  { name: "Total Projects", value: "12", change: "+2 this month", icon: Building2 },
  { name: "Active Properties", value: "48", change: "+5 this week", icon: Home },
  { name: "Newsletter Subscribers", value: "1,234", change: "+89 this week", icon: Mail },
  { name: "Total Users", value: "8", change: "+1 this month", icon: Users },
]

export default function AdminDashboard() {
  const { data: session } = useSession()
  const userRole = session?.user?.role || "VIEWER"

  const filteredNavItems = navItems.filter((item) => {
    if (userRole === "VIEWER") {
      return ["Dashboard", "Projects", "Properties"].includes(item.name)
    }
    return true
  })

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#1B4D3E]/10 flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B4D3E] to-[#2D6A4F] flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <div>
              <span className="font-display text-lg font-bold text-[#1B4D3E]">VELD</span>
              <span className="font-display text-lg font-bold text-[#C9A227]">AFRICA</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#4A5568] hover:bg-[#1B4D3E]/5 hover:text-[#1B4D3E] transition-colors"
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#1B4D3E]/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-[#1B4D3E]/10 flex items-center justify-center">
              <span className="font-semibold text-[#1B4D3E]">{session?.user?.name?.[0] || "U"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A1A1A] truncate">{session?.user?.name || "User"}</p>
              <p className="text-xs text-[#4A5568]">{userRole}</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-[#1B4D3E]/10 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Dashboard</h1>
              <p className="text-[#4A5568]">Welcome back, {session?.user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 rounded-full bg-[#C9A227]/10 text-[#C9A227] text-sm font-medium">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-[#1B4D3E]/5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-[#4A5568]">{stat.name}</p>
                      <p className="text-3xl font-bold text-[#1A1A1A] mt-1">{stat.value}</p>
                      <p className="text-sm text-emerald-600 mt-2">{stat.change}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-[#1B4D3E]/5 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#1B4D3E]" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#1B4D3E]/5"
            >
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/admin/projects/new"
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#1B4D3E]/5 hover:bg-[#1B4D3E]/10 transition-colors"
                >
                  <Building2 className="w-8 h-8 text-[#1B4D3E]" />
                  <span className="font-medium text-[#1A1A1A]">New Project</span>
                </Link>
                <Link
                  href="/admin/properties/new"
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#1B4D3E]/5 hover:bg-[#1B4D3E]/10 transition-colors"
                >
                  <Home className="w-8 h-8 text-[#1B4D3E]" />
                  <span className="font-medium text-[#1A1A1A]">Add Property</span>
                </Link>
                <Link
                  href="/admin/newsletters/new"
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#C9A227]/10 hover:bg-[#C9A227]/20 transition-colors"
                >
                  <FileText className="w-8 h-8 text-[#C9A227]" />
                  <span className="font-medium text-[#1A1A1A]">Write Newsletter</span>
                </Link>
                <Link
                  href="/admin/subscribers"
                  className="flex flex-col items-center gap-3 p-4 rounded-xl bg-[#C9A227]/10 hover:bg-[#C9A227]/20 transition-colors"
                >
                  <Mail className="w-8 h-8 text-[#C9A227]" />
                  <span className="font-medium text-[#1A1A1A]">View Subscribers</span>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#1B4D3E]/5"
            >
              <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: "New project created", item: "Azure Collection", time: "2 hours ago", user: "Admin" },
                  { action: "Property listed", item: "Luxury Villa - Lekki", time: "5 hours ago", user: "Editor" },
                  { action: "Newsletter sent", item: "Market Update March", time: "1 day ago", user: "Admin" },
                  { action: "New subscriber", item: "john@example.com", time: "2 days ago", user: "System" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-[#1B4D3E]/5 last:border-0">
                    <div className="w-2 h-2 rounded-full bg-[#1B4D3E] mt-2" />
                    <div>
                      <p className="text-sm text-[#1A1A1A]">
                        <span className="font-medium">{activity.action}</span>: {activity.item}
                      </p>
                      <p className="text-xs text-[#4A5568]">
                        {activity.time} by {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
