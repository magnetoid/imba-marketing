import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  sender: 'visitor' | 'agent' | 'system'
  sender_name: string | null
  body: string
  created_at: string
}

function getVisitorId(): string {
  let id = localStorage.getItem('imba_chat_visitor')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('imba_chat_visitor', id)
  }
  return id
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [visitorName, setVisitorName] = useState('')
  const [visitorEmail, setVisitorEmail] = useState('')
  const [started, setStarted] = useState(false)
  const [unread, setUnread] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const visitorId = useRef(getVisitorId())

  // Load existing conversation
  useEffect(() => {
    async function loadExisting() {
      try {
        const { data: conv } = await supabase
          .from('chat_conversations')
          .select('id, visitor_name, visitor_email')
          .eq('visitor_id', visitorId.current)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (conv) {
          setConversationId(conv.id)
          setVisitorName(conv.visitor_name || '')
          setVisitorEmail(conv.visitor_email || '')
          setStarted(true)
          setShowIntro(false)

          const { data: msgs } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true })

          if (msgs) setMessages(msgs as Message[])
        }
      } catch { /* tables may not exist */ }
    }
    loadExisting()
  }, [])

  // Real-time subscription for new messages
  useEffect(() => {
    if (!conversationId) return

    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const msg = payload.new as Message
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev
            return [...prev, msg]
          })
          // If widget is closed and message is from agent, bump unread
          if (msg.sender === 'agent' && !open) {
            setUnread(prev => prev + 1)
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversationId, open])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (open && started && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open, started])

  const startConversation = useCallback(async () => {
    if (!visitorName.trim()) return
    try {
      const { data } = await supabase
        .from('chat_conversations')
        .insert({
          visitor_id: visitorId.current,
          visitor_name: visitorName.trim(),
          visitor_email: visitorEmail.trim() || null,
        })
        .select('id')
        .single()

      if (data) {
        setConversationId(data.id)
        setStarted(true)
        setShowIntro(false)

        // System welcome message
        await supabase.from('chat_messages').insert({
          conversation_id: data.id,
          sender: 'system',
          sender_name: 'Imba Marketing',
          body: `Hi ${visitorName.trim()}! 👋 Thanks for reaching out. How can we help you today?`,
        })
      }
    } catch { /* table may not exist */ }
  }, [visitorName, visitorEmail])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !conversationId || sending) return
    const body = input.trim()
    setInput('')
    setSending(true)

    try {
      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        sender: 'visitor',
        sender_name: visitorName || 'Visitor',
        body,
      })

      // Update conversation timestamp and unread count
      await supabase
        .from('chat_conversations')
        .update({
          last_message_at: new Date().toISOString(),
          unread_count: messages.filter(m => m.sender === 'visitor').length + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId)
    } catch { /* ignore */ }

    setSending(false)
  }, [input, conversationId, sending, visitorName, messages])

  function toggleOpen() {
    setOpen(prev => !prev)
    if (!open) setUnread(0)
  }

  return (
    <>
      {/* ═══ Chat bubble button ═══ */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
        style={{
          background: 'rgb(var(--c-accent))',
          boxShadow: '0 4px 20px rgb(var(--c-accent) / 0.4)',
        }}
        aria-label="Chat with us"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#09090B" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#09090B">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-ink text-smoke text-[10px] font-bold rounded-full flex items-center justify-center shadow">
            {unread}
          </span>
        )}
      </button>

      {/* ═══ Chat window ═══ */}
      <div
        className={`fixed bottom-24 right-6 z-[89] w-[380px] max-w-[calc(100vw-2rem)] transition-all duration-300 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="rounded-none overflow-hidden shadow-2xl shadow-black/40 border border-line flex flex-col" style={{ background: 'rgb(var(--c-surface))', maxHeight: '520px' }}>

          {/* Header */}
          <div className="px-5 py-4 flex items-center gap-3" style={{ background: 'rgb(var(--c-accent))' }}>
            <div className="w-9 h-9 rounded-full bg-black/15 flex items-center justify-center">
              <span className="text-brand-on text-sm font-bold">IM</span>
            </div>
            <div className="flex-1">
              <p className="text-brand-on font-semibold text-sm">Imba Marketing</p>
              <p className="text-brand-on/75 text-xs">Usually replies within minutes</p>
            </div>
            <button onClick={toggleOpen} className="text-brand-on/70 hover:text-brand-on transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          {/* Intro form (before conversation starts) */}
          {showIntro && !started && (
            <div className="p-5 flex flex-col gap-3">
              <p className="text-sm text-smoke leading-relaxed">
                Hi there! Leave your name and we'll connect you with our team.
              </p>
              <input
                value={visitorName}
                onChange={e => setVisitorName(e.target.value)}
                placeholder="Your name *"
                className="w-full bg-ink border border-line rounded-none px-3 py-2.5 text-sm text-smoke placeholder:text-smoke-faint outline-none focus:border-brand-text"
                onKeyDown={e => { if (e.key === 'Enter') startConversation() }}
              />
              <input
                value={visitorEmail}
                onChange={e => setVisitorEmail(e.target.value)}
                placeholder="Email (optional)"
                className="w-full bg-ink border border-line rounded-none px-3 py-2.5 text-sm text-smoke placeholder:text-smoke-faint outline-none focus:border-brand-text"
                onKeyDown={e => { if (e.key === 'Enter') startConversation() }}
              />
              <button
                onClick={startConversation}
                disabled={!visitorName.trim()}
                className="w-full py-2.5 rounded-none text-sm font-semibold text-brand-on transition-all disabled:opacity-40"
                style={{ background: 'rgb(var(--c-accent))' }}
              >
                Start Chat
              </button>
            </div>
          )}

          {/* Messages */}
          {started && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ minHeight: '280px', maxHeight: '340px' }}>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                        msg.sender === 'visitor'
                          ? 'bg-brand text-brand-on rounded-none rounded-br-md'
                          : msg.sender === 'system'
                          ? 'bg-ink-3 text-smoke rounded-none rounded-bl-md'
                          : 'bg-ink-3 text-smoke rounded-none rounded-bl-md'
                      }`}
                    >
                      {msg.sender === 'agent' && msg.sender_name && (
                        <p className="text-[10px] font-semibold text-smoke-dim mb-1">{msg.sender_name}</p>
                      )}
                      {msg.body}
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <p className="text-center text-zinc-600 text-xs py-8">Send a message to start the conversation</p>
                )}
              </div>

              {/* Input */}
              <div className="px-4 pb-4 pt-2 border-t border-line/60">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                    placeholder="Type a message..."
                    className="flex-1 bg-ink border border-line rounded-none px-4 py-2.5 text-sm text-smoke placeholder:text-smoke-faint outline-none focus:border-brand-text transition-colors"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || sending}
                    className="w-10 h-10 rounded-none flex items-center justify-center transition-all disabled:opacity-30"
                    style={{ background: 'rgb(var(--c-accent))' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#09090B">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
