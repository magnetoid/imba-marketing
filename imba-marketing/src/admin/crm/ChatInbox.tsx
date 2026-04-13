import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import toast from 'react-hot-toast'
import {
  MessageSquare, Loader2, Send, Archive, User, Mail, Clock,
  CheckCheck, Circle, UserPlus,
} from 'lucide-react'

interface Conversation {
  id: string
  visitor_id: string
  visitor_name: string | null
  visitor_email: string | null
  status: 'active' | 'closed' | 'archived'
  unread_count: number
  last_message_at: string | null
  created_at: string
}

interface Message {
  id: string
  conversation_id: string
  sender: 'visitor' | 'agent' | 'system'
  sender_name: string | null
  body: string
  read: boolean
  created_at: string
}

export default function ChatInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [filter, setFilter] = useState<'active' | 'all'>('active')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const loadConversations = useCallback(async () => {
    try {
      let q = supabase
        .from('chat_conversations')
        .select('*')
        .order('last_message_at', { ascending: false, nullsFirst: false })

      if (filter === 'active') q = q.eq('status', 'active')

      const { data } = await q
      setConversations((data as Conversation[]) || [])
    } catch { /* table may not exist */ }
    setLoading(false)
  }, [filter])

  useEffect(() => { loadConversations() }, [loadConversations])

  // Real-time: new conversations
  useEffect(() => {
    const channel = supabase
      .channel('chat-conversations-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_conversations' }, () => {
        loadConversations()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [loadConversations])

  // Load messages for selected conversation
  useEffect(() => {
    if (!selected) { setMessages([]); return }

    async function loadMessages() {
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', selected)
        .order('created_at', { ascending: true })

      if (data) setMessages(data as Message[])

      // Mark visitor messages as read
      await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('conversation_id', selected)
        .eq('sender', 'visitor')
        .eq('read', false)

      // Reset unread count
      await supabase
        .from('chat_conversations')
        .update({ unread_count: 0 })
        .eq('id', selected)
    }

    loadMessages()
  }, [selected])

  // Real-time: new messages in selected conversation
  useEffect(() => {
    if (!selected) return

    const channel = supabase
      .channel(`chat-messages-admin-${selected}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `conversation_id=eq.${selected}` },
        (payload) => {
          const msg = payload.new as Message
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) return prev
            return [...prev, msg]
          })
          // Mark as read if from visitor
          if (msg.sender === 'visitor') {
            supabase.from('chat_messages').update({ read: true }).eq('id', msg.id)
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selected])

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  // Focus input on conversation select
  useEffect(() => {
    if (selected && inputRef.current) inputRef.current.focus()
  }, [selected])

  async function sendReply() {
    if (!input.trim() || !selected || sending) return
    setSending(true)
    const body = input.trim()
    setInput('')

    try {
      await supabase.from('chat_messages').insert({
        conversation_id: selected,
        sender: 'agent',
        sender_name: 'Imba Team',
        body,
      })

      await supabase
        .from('chat_conversations')
        .update({ last_message_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', selected)
    } catch (e) {
      toast.error('Failed to send')
    }
    setSending(false)
  }

  async function archiveConversation(id: string) {
    await supabase.from('chat_conversations').update({ status: 'archived' }).eq('id', id)
    if (selected === id) { setSelected(null); setMessages([]) }
    loadConversations()
    toast.success('Conversation archived')
  }

  async function closeConversation(id: string) {
    await supabase.from('chat_conversations').update({ status: 'closed' }).eq('id', id)
    loadConversations()
    toast.success('Conversation closed')
  }

  async function convertToLead(conv: Conversation) {
    if (!conv.visitor_name) { toast.error('Visitor has no name — cannot create lead.'); return }

    // Check if lead already exists with this email
    if (conv.visitor_email) {
      const { data: existing } = await supabase
        .from('crm_leads')
        .select('id')
        .eq('email', conv.visitor_email)
        .limit(1)
      if (existing?.length) {
        // Link conversation to existing lead
        await supabase.from('chat_conversations').update({ lead_id: existing[0].id }).eq('id', conv.id)
        toast.success('Linked to existing CRM lead')
        loadConversations()
        return
      }
    }

    // Create new lead
    const { data: newLead, error } = await supabase.from('crm_leads').insert({
      name: conv.visitor_name,
      email: conv.visitor_email || null,
      source: 'live_chat',
      stage: 'new',
      notes: `Converted from live chat conversation on ${new Date(conv.created_at).toLocaleDateString()}`,
      probability: 40,
    }).select('id').single()

    if (error) { toast.error('Failed to create lead'); return }

    // Link conversation to the new lead
    if (newLead) {
      await supabase.from('chat_conversations').update({ lead_id: newLead.id }).eq('id', conv.id)
    }

    toast.success('Lead created in CRM!')
    loadConversations()
  }

  const selectedConv = conversations.find(c => c.id === selected)
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0)

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-0px)]">
      {/* ═══ Conversation list ═══ */}
      <div className="w-80 border-r border-border flex flex-col flex-shrink-0">
        {/* Header */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-500" />
              <h1 className="font-semibold text-foreground">Live Chat</h1>
              {totalUnread > 0 && (
                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">{totalUnread}</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant={filter === 'active' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs"
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              className="text-xs"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs opacity-60 mt-1">Chats from visitors will appear here</p>
            </div>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelected(conv.id)}
                className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${
                  selected === conv.id ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{conv.visitor_name || 'Anonymous'}</p>
                      {conv.visitor_email && (
                        <p className="text-[10px] text-muted-foreground">{conv.visitor_email}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {conv.unread_count > 0 && (
                      <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                    <Circle className={`h-2 w-2 ${conv.status === 'active' ? 'fill-green-500 text-green-500' : 'fill-zinc-600 text-zinc-600'}`} />
                  </div>
                </div>
                {conv.last_message_at && (
                  <p className="text-[10px] text-muted-foreground ml-10">
                    {new Date(conv.last_message_at).toLocaleString()}
                  </p>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* ═══ Chat area ═══ */}
      <div className="flex-1 flex flex-col">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Select a conversation</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{selectedConv?.visitor_name || 'Anonymous'}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    {selectedConv?.visitor_email && (
                      <span className="flex items-center gap-1"><Mail className="h-2.5 w-2.5" /> {selectedConv.visitor_email}</span>
                    )}
                    <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {new Date(selectedConv?.created_at || '').toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => convertToLead(selectedConv!)} title="Convert to CRM lead"
                  disabled={!selectedConv?.visitor_name}>
                  <UserPlus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => closeConversation(selected)} title="Close conversation">
                  <CheckCheck className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => archiveConversation(selected)} title="Archive">
                  <Archive className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
                    msg.sender === 'agent'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : msg.sender === 'system'
                      ? 'bg-muted text-muted-foreground rounded-bl-sm italic'
                      : 'bg-accent text-foreground rounded-bl-sm'
                  }`}>
                    {msg.sender === 'visitor' && msg.sender_name && (
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1">{msg.sender_name}</p>
                    )}
                    {msg.body}
                    <p className="text-[9px] opacity-50 mt-1 text-right">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply input */}
            <div className="px-5 py-3 border-t border-border">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                  placeholder="Type your reply..."
                  className="flex-1"
                />
                <Button onClick={sendReply} disabled={!input.trim() || sending} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
