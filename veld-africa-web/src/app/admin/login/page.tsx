"use client"

import { Button } from "@/components/ui/Button"
import { GlassCard } from "@/components/ui/GlassCard"
import { motion } from "framer-motion"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1B4D3E] to-[#0D2820] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard variant="light" className="p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1B4D3E] to-[#2D6A4F] flex items-center justify-center">
                <span className="text-white font-bold text-2xl">V</span>
              </div>
              <span className="font-display text-2xl font-bold text-[#1B4D3E]">VELD</span>
              <span className="font-display text-2xl font-bold text-[#C9A227]">AFRICA</span>
            </Link>
            <h1 className="font-display text-2xl font-bold text-[#1A1A1A]">Admin Portal</h1>
            <p className="text-[#4A5568] mt-2">Sign in to manage properties, newsletters, and more.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#1B4D3E]/20 focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 outline-none"
                placeholder="admin@veldafrica.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#1B4D3E]/20 focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-[#1B4D3E] hover:text-[#C9A227] transition-colors">
              ← Back to website
            </Link>
          </div>
        </GlassCard>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#D4C5B0]">
            Demo: admin@veldafrica.com / password
          </p>
        </div>
      </motion.div>
    </div>
  )
}
