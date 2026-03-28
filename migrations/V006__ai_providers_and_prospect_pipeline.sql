-- ═══════════════════════════════════════════════════════════
--  V006: AI Providers + Prospect Pipeline + Email Approval
--  Adds multi-provider AI support, prospect automation,
--  email approval queue, and tracking
-- ═══════════════════════════════════════════════════════════

-- ── AI Provider Keys (persistent, DB-stored) ──────────────
CREATE TABLE IF NOT EXISTS public.ai_providers (
  id          TEXT PRIMARY KEY,                  -- anthropic, openai, perplexity, ollama
  name        TEXT NOT NULL,
  api_key     TEXT NOT NULL DEFAULT '',
  base_url    TEXT,                              -- for Ollama Cloud or custom endpoints
  default_model TEXT,
  available_models JSONB DEFAULT '[]'::jsonb,    -- cached model list
  enabled     BOOLEAN NOT NULL DEFAULT false,
  last_models_fetch TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manage_ai_providers" ON public.ai_providers
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT ALL ON public.ai_providers TO authenticated, service_role;

-- Seed default providers
INSERT INTO public.ai_providers (id, name) VALUES
  ('anthropic', 'Anthropic (Claude)'),
  ('openai', 'OpenAI (GPT)'),
  ('perplexity', 'Perplexity'),
  ('ollama', 'Ollama Cloud')
ON CONFLICT (id) DO NOTHING;

-- ── Prospect Searches (automated ICP matching) ────────────
CREATE TABLE IF NOT EXISTS public.crm_prospect_searches (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query       JSONB NOT NULL,                    -- {industry, location, company_size, keywords, icp_description}
  ai_provider TEXT DEFAULT 'anthropic',
  ai_model    TEXT,
  results_count INTEGER DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'pending',    -- pending, running, completed, failed
  error       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.crm_prospect_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manage_prospect_searches" ON public.crm_prospect_searches
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT ALL ON public.crm_prospect_searches TO authenticated, service_role;

-- ── Email Approval Queue ──────────────────────────────────
-- Extends crm_outreach_emails with approval workflow fields
ALTER TABLE public.crm_outreach_emails
  ADD COLUMN IF NOT EXISTS from_email TEXT DEFAULT 'hello@imbamarketing.com',
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS follow_up_of UUID REFERENCES public.crm_outreach_emails(id),
  ADD COLUMN IF NOT EXISTS follow_up_number INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_provider TEXT DEFAULT 'anthropic',
  ADD COLUMN IF NOT EXISTS ai_model TEXT,
  ADD COLUMN IF NOT EXISTS opened_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS bounced_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tracking_id TEXT UNIQUE;

-- ── Email Tracking Events ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_email_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_id    UUID NOT NULL REFERENCES public.crm_outreach_emails(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,                     -- sent, delivered, opened, clicked, replied, bounced, unsubscribed
  metadata    JSONB DEFAULT '{}'::jsonb,         -- {ip, user_agent, link_url, bounce_reason, etc.}
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_events_email_id ON public.crm_email_events(email_id);
CREATE INDEX IF NOT EXISTS idx_email_events_type ON public.crm_email_events(event_type);

ALTER TABLE public.crm_email_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manage_email_events" ON public.crm_email_events
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT ALL ON public.crm_email_events TO authenticated, service_role;

-- ── Follow-up Suggestions ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crm_follow_up_suggestions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id     UUID NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  email_id    UUID REFERENCES public.crm_outreach_emails(id) ON DELETE SET NULL,
  suggested_date TIMESTAMPTZ NOT NULL,
  suggested_subject TEXT,
  suggested_body TEXT,
  reason      TEXT,                               -- e.g. "No reply after 3 days", "Opened but didn't reply"
  status      TEXT NOT NULL DEFAULT 'pending',    -- pending, accepted, dismissed
  ai_provider TEXT DEFAULT 'anthropic',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.crm_follow_up_suggestions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_manage_follow_up_suggestions" ON public.crm_follow_up_suggestions
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT ALL ON public.crm_follow_up_suggestions TO authenticated, service_role;

-- ── Indexes for performance ───────────────────────────────
CREATE INDEX IF NOT EXISTS idx_outreach_emails_status ON public.crm_outreach_emails(status);
CREATE INDEX IF NOT EXISTS idx_outreach_emails_lead ON public.crm_outreach_emails(lead_id);
CREATE INDEX IF NOT EXISTS idx_outreach_emails_from ON public.crm_outreach_emails(from_email);
CREATE INDEX IF NOT EXISTS idx_follow_up_suggestions_lead ON public.crm_follow_up_suggestions(lead_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_suggestions_status ON public.crm_follow_up_suggestions(status);

-- Mark migration as applied
INSERT INTO public.schema_migrations (version) VALUES ('V006__ai_providers_and_prospect_pipeline')
ON CONFLICT (version) DO NOTHING;
