-- ═══════════════════════════════════════════════════════════
--  V009: SEO audits + issues + redirects + AI suggestions
--  Safe to re-run (idempotent)
-- ═══════════════════════════════════════════════════════════

-- ── Redirect rules (for platform / edge config export) ─────
CREATE TABLE IF NOT EXISTS public.redirect_rules (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_path   TEXT UNIQUE NOT NULL,
  to_path     TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301,
  enabled     BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_redirect_rules_enabled ON public.redirect_rules(enabled);

DROP TRIGGER IF EXISTS set_redirect_rules_updated_at ON public.redirect_rules;
CREATE TRIGGER set_redirect_rules_updated_at
  BEFORE UPDATE ON public.redirect_rules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.redirect_rules ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='redirect_rules' AND policyname='public_read_redirect_rules') THEN
    CREATE POLICY "public_read_redirect_rules" ON public.redirect_rules FOR SELECT TO anon, authenticated USING (enabled = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='redirect_rules' AND policyname='admin_all_redirect_rules') THEN
    CREATE POLICY "admin_all_redirect_rules" ON public.redirect_rules TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END $$;

GRANT SELECT ON public.redirect_rules TO anon;
GRANT ALL    ON public.redirect_rules TO authenticated, service_role;


-- ── SEO audit runs + issues ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_runs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scope       TEXT NOT NULL DEFAULT 'all_published',
  totals      JSONB NOT NULL DEFAULT '{"critical":0,"warning":0,"info":0}'::jsonb,
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.seo_issues (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  run_id     UUID NOT NULL REFERENCES public.audit_runs(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  code       TEXT NOT NULL,
  severity   TEXT NOT NULL CHECK (severity IN ('critical','warning','info')),
  message    TEXT NOT NULL,
  data       JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_runs_started_at ON public.audit_runs(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_seo_issues_run_id ON public.seo_issues(run_id);
CREATE INDEX IF NOT EXISTS idx_seo_issues_severity ON public.seo_issues(severity);

ALTER TABLE public.audit_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_issues ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='audit_runs' AND policyname='admin_all_audit_runs') THEN
    CREATE POLICY "admin_all_audit_runs" ON public.audit_runs TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='seo_issues' AND policyname='admin_all_seo_issues') THEN
    CREATE POLICY "admin_all_seo_issues" ON public.seo_issues TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END $$;

GRANT ALL ON public.audit_runs TO authenticated, service_role;
GRANT ALL ON public.seo_issues TO authenticated, service_role;


-- ── AI suggestions log (provenance + diffs) ─────────────────
CREATE TABLE IF NOT EXISTS public.ai_suggestions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_type TEXT NOT NULL,
  source_id   UUID,
  kind        TEXT NOT NULL,
  input_hash  TEXT NOT NULL,
  suggestion  JSONB NOT NULL DEFAULT '{}'::jsonb,
  applied     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_suggestions_source ON public.ai_suggestions(source_type, source_id);

ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='ai_suggestions' AND policyname='admin_all_ai_suggestions') THEN
    CREATE POLICY "admin_all_ai_suggestions" ON public.ai_suggestions TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
  END IF;
END $$;

GRANT ALL ON public.ai_suggestions TO authenticated, service_role;


INSERT INTO public.schema_migrations (version) VALUES ('V009__seo_audits_redirects_ai_suggestions')
ON CONFLICT (version) DO NOTHING;

