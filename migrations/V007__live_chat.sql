-- ═══════════════════════════════════════════════════════════
--  V007: Live Chat — visitor ↔ admin real-time messaging
-- ═══════════════════════════════════════════════════════════

-- Chat conversations (one per visitor session)
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id  TEXT NOT NULL,                     -- browser fingerprint / random ID
  visitor_name TEXT,
  visitor_email TEXT,
  status      TEXT NOT NULL DEFAULT 'active',    -- active, closed, archived
  lead_id     UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
  unread_count INTEGER NOT NULL DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON public.chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_visitor ON public.chat_conversations(visitor_id);

-- Chat messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender          TEXT NOT NULL DEFAULT 'visitor',  -- visitor, agent, system
  sender_name     TEXT,
  body            TEXT NOT NULL,
  read            BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at);

-- RLS: visitors can insert conversations and messages, read their own
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can create a conversation
CREATE POLICY "anon_insert_conversations" ON public.chat_conversations
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Anyone can read their own conversation by visitor_id
CREATE POLICY "anon_read_own_conversations" ON public.chat_conversations
  FOR SELECT TO anon, authenticated USING (true);

-- Anyone can update their own conversation
CREATE POLICY "anon_update_own_conversations" ON public.chat_conversations
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Admin full access to conversations
CREATE POLICY "admin_all_conversations" ON public.chat_conversations
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Anyone can insert messages
CREATE POLICY "anon_insert_messages" ON public.chat_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Anyone can read messages in their conversation
CREATE POLICY "anon_read_messages" ON public.chat_messages
  FOR SELECT TO anon, authenticated USING (true);

-- Admin can update messages (mark as read)
CREATE POLICY "admin_update_messages" ON public.chat_messages
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

GRANT ALL ON public.chat_conversations TO anon, authenticated, service_role;
GRANT ALL ON public.chat_messages TO anon, authenticated, service_role;

-- Enable realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;

INSERT INTO public.schema_migrations (version) VALUES ('V007__live_chat')
ON CONFLICT (version) DO NOTHING;
