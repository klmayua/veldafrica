"use client"

import { Button } from "@/components/ui/Button"
import { GlassCard } from "@/components/ui/GlassCard"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bot,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Send,
  User,
  X,
} from "lucide-react"
import * as React from "react"

interface ChatMessage {
  id: string
  text: string
  isFromBot: boolean
  actions?: { label: string; url?: string; action?: string }[]
}

export function Chatbot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMinimized, setIsMinimized] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "Hello! Welcome to VELD AFRICA. I'm here to help you explore our property investment opportunities. How can I assist you today?",
      isFromBot: true,
      actions: [
        { label: "View Properties", action: "navigate_properties" },
        { label: "Get Investment Guide", action: "show_guide" },
        { label: "Contact Sales", action: "show_contact" },
      ],
    },
  ])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [sessionId, setSessionId] = React.useState<string>("")
  const [showLeadForm, setShowLeadForm] = React.useState(false)
  const [leadData, setLeadData] = React.useState({
    name: "",
    email: "",
    phone: "",
  })

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  React.useEffect(() => {
    if (!sessionId && typeof window !== "undefined") {
      setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    }
  }, [sessionId])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      text: input,
      isFromBot: false,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          sessionId,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      })

      const data = await response.json()

      if (data.messages) {
        data.messages.forEach((msg: ChatMessage) => {
          if (msg.isFromBot) {
            setMessages((prev) => [
              ...prev,
              {
                id: msg.id,
                text: msg.text,
                isFromBot: true,
                actions: msg.actions,
              },
            ])
          }
        })
      }

      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId)
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          text: "Sorry, I'm having trouble connecting. Please try again or contact us directly at hello@veldafrica.com",
          isFromBot: true,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = (action: { label: string; url?: string; action?: string }) => {
    if (action.url) {
      window.open(action.url, "_blank")
    } else if (action.action) {
      switch (action.action) {
        case "navigate_properties":
          document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" })
          break
        case "show_contact":
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
          break
        case "schedule_consultation":
          setShowLeadForm(true)
          break
        case "show_guide":
          document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" })
          break
        default:
          handleCustomMessage(action.label)
      }
    }
  }

  const handleCustomMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      text,
      isFromBot: false,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId,
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      })

      const data = await response.json()

      if (data.messages) {
        data.messages.forEach((msg: ChatMessage) => {
          if (msg.isFromBot) {
            setMessages((prev) => [
              ...prev,
              {
                id: msg.id,
                text: msg.text,
                isFromBot: true,
                actions: msg.actions,
              },
            ])
          }
        })
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault()

    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Lead form submitted",
        sessionId,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
      }),
    })

    setShowLeadForm(false)
    setMessages((prev) => [
      ...prev,
      {
        id: `lead_${Date.now()}`,
        text: `Thank you ${leadData.name}! Our team will contact you shortly at ${leadData.email} or ${leadData.phone}.`,
        isFromBot: true,
      },
    ])
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#1B4D3E] text-white shadow-2xl flex items-center justify-center hover:bg-[#2D6A4F] transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
          >
            <GlassCard variant="light" className="flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between p-4 bg-[#1B4D3E] text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">VELD Assistant</h3>
                    <span className="text-xs text-[#D4C5B0]">Online now</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                    {showLeadForm ? (
                      <form onSubmit={submitLead} className="space-y-3 p-3 bg-[#1B4D3E]/5 rounded-xl">
                        <p className="text-sm font-medium text-[#1A1A1A]">Get a call from our team:</p>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={leadData.name}
                          onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#1B4D3E]/20 text-sm"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email address"
                          value={leadData.email}
                          onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#1B4D3E]/20 text-sm"
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Phone number"
                          value={leadData.phone}
                          onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-[#1B4D3E]/20 text-sm"
                          required
                        />
                        <div className="flex gap-2">
                          <Button type="submit" size="sm" className="flex-1">
                            Submit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowLeadForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        {messages.map((msg) => (
                          <div key={msg.id} className={`flex gap-3 ${msg.isFromBot ? "" : "flex-row-reverse"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              msg.isFromBot ? "bg-[#1B4D3E] text-white" : "bg-[#C9A227] text-white"
                            }`}>
                              {msg.isFromBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div className="space-y-2 max-w-[80%]">
                              <div className={`p-3 rounded-2xl text-sm ${
                                msg.isFromBot
                                  ? "bg-[#1B4D3E]/10 text-[#1A1A1A] rounded-tl-none"
                                  : "bg-[#1B4D3E] text-white rounded-tr-none"
                              }`}
                              >
                                {msg.text}
                              </div>
                              {msg.actions && msg.actions.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {msg.actions.map((action, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => handleAction(action)}
                                      className="px-3 py-1.5 bg-white border border-[#1B4D3E]/20 rounded-full text-xs font-medium text-[#1B4D3E] hover:bg-[#1B4D3E]/5 transition-colors"
                                    >
                                      {action.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#1B4D3E] flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex gap-1 items-center p-3 bg-[#1B4D3E]/10 rounded-2xl rounded-tl-none">
                              <span className="w-2 h-2 bg-[#1B4D3E] rounded-full animate-bounce" />
                              <span className="w-2 h-2 bg-[#1B4D3E] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                              <span className="w-2 h-2 bg-[#1B4D3E] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  <div className="p-4 border-t border-[#1B4D3E]/10">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSend()
                          }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 rounded-full border border-[#1B4D3E]/20 focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20 outline-none text-sm"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="w-10 h-10 rounded-full bg-[#1B4D3E] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2D6A4F] transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
