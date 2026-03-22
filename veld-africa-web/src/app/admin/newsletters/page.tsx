import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function NewslettersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">Newsletters</h1>
      <p className="text-[#4A5568]">Create, edit, and send newsletters to subscribers.</p>
    </div>
  )
}
