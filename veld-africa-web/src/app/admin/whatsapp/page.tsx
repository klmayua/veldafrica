import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function WhatsAppPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">WhatsApp Business</h1>
        <p className="text-[#4A5568] mt-2">Manage WhatsApp automation, contacts, and broadcasts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { name: "Total Contacts", value: "0", icon: "👥" },
          { name: "Active Leads", value: "0", icon: "🎯" },
          { name: "Messages (24h)", value: "0", icon: "💬" },
          { name: "Delivery Rate", value: "0%", icon: "✅" },
        ].map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-2xl p-6 shadow-sm border border-[#1B4D3E]/5"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-sm text-[#4A5568]">{stat.name}</div>
            <div className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-[#1B4D3E]/5">
            <div className="p-6 border-b border-[#1B4D3E]/5">
              <h2 className="text-lg font-bold text-[#1A1A1A]">Recent Activity</h2>
            </div>
            <div className="p-6">
              <p className="text-[#4A5568]">WhatsApp integration is configured. Webhook endpoint: /api/whatsapp/webhook</p>
              <div className="mt-4 p-4 bg-[#1B4D3E]/5 rounded-xl">
                <h3 className="font-medium text-[#1A1A1A] mb-2">Setup Required:</h3>
                <ul className="text-sm text-[#4A5568] space-y-1">
                  <li>1. Configure Meta Developer Account</li>
                  <li>2. Add WhatsApp Business Phone Number</li>
                  <li>3. Set webhook URL in Meta Dashboard</li>
                  <li>4. Verify webhook and subscribe to events</li>
                  <li>5. Create message templates for approval</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-[#1B4D3E]/5">
            <div className="p-6 border-b border-[#1B4D3E]/5">
              <h2 className="text-lg font-bold text-[#1A1A1A]">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#1B4D3E]/5 hover:bg-[#1B4D3E]/10 transition-colors text-left">
                <span className="text-xl">📤</span>
                <span className="font-medium text-[#1A1A1A]">Send Broadcast</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#1B4D3E]/5 hover:bg-[#1B4D3E]/10 transition-colors text-left">
                <span className="text-xl">👤</span>
                <span className="font-medium text-[#1A1A1A]">Add Contact</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#1B4D3E]/5 hover:bg-[#1B4D3E]/10 transition-colors text-left">
                <span className="text-xl">📝</span>
                <span className="font-medium text-[#1A1A1A]">Create Template</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#1B4D3E]/5 hover:bg-[#1B4D3E]/10 transition-colors text-left">
                <span className="text-xl">🤖</span>
                <span className="font-medium text-[#1A1A1A]">Automation Flows</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
