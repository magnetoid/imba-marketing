-- ═══════════════════════════════════════════════════════════
--  Imba Marketing — Database Init
--  Runs on first Supabase PostgreSQL startup
-- ═══════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- ── Schemas ─────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS extensions;

-- ── Roles ───────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- ═══════════════════════════════════════════════════════════
--  TABLES
-- ═══════════════════════════════════════════════════════════

-- ── Team members ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.team_members (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  role        TEXT,
  bio         TEXT,
  photo_url   TEXT,
  social_links JSONB DEFAULT '{}',
  sort_order  INTEGER DEFAULT 0,
  published   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Portfolio items ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('brand','ai','product','social','drone','post','elearning')),
  client_name     TEXT,
  thumbnail_url   TEXT,
  video_url       TEXT,
  vimeo_id        TEXT,
  youtube_id      TEXT,
  description     TEXT,
  results         JSONB DEFAULT '{}',
  tags            TEXT[] DEFAULT '{}',
  featured        BOOLEAN DEFAULT false,
  published       BOOLEAN DEFAULT false,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Blog posts ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  excerpt           TEXT,
  body              TEXT,
  cover_image_url   TEXT,
  author_id         UUID REFERENCES public.team_members(id) ON DELETE SET NULL,
  category          TEXT,
  tags              TEXT[] DEFAULT '{}',
  seo_title         TEXT,
  seo_description   TEXT,
  read_time_minutes INTEGER,
  published         BOOLEAN DEFAULT false,
  published_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Services ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.services (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  tagline           TEXT,
  description       TEXT,
  long_description  TEXT,
  cover_image_url   TEXT,
  icon_key          TEXT,
  features          JSONB DEFAULT '[]',
  pricing_hint      TEXT,
  sort_order        INTEGER DEFAULT 0,
  published         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Testimonials ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.testimonials (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name       TEXT NOT NULL,
  client_role       TEXT,
  client_company    TEXT,
  client_avatar_url TEXT,
  text              TEXT NOT NULL,
  rating            INTEGER CHECK (rating BETWEEN 1 AND 5),
  portfolio_item_id UUID REFERENCES public.portfolio_items(id) ON DELETE SET NULL,
  featured          BOOLEAN DEFAULT false,
  published         BOOLEAN DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Quote requests ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  company       TEXT,
  service_type  TEXT,
  budget_range  TEXT,
  message       TEXT,
  status        TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','proposal_sent','closed_won','closed_lost')),
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Site settings ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
--  INDEXES
-- ═══════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_portfolio_published ON public.portfolio_items(published, sort_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON public.portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON public.portfolio_items(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_published ON public.blog_posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON public.testimonials(published);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quote_requests(status, created_at DESC);

-- ═══════════════════════════════════════════════════════════
--  UPDATED_AT TRIGGER
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_portfolio_updated_at
  BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_blog_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ═══════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    (COALESCE(NULLIF(current_setting('request.jwt.claims', true), ''), '{}')::jsonb -> 'app_metadata' ->> 'role') = 'admin'
    OR (COALESCE(NULLIF(current_setting('request.jwt.claims', true), ''), '{}')::jsonb -> 'user_metadata' ->> 'role') = 'admin',
    false
  );
$$;

ALTER TABLE public.portfolio_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings    ENABLE ROW LEVEL SECURITY;

-- Portfolio: public read published, admin full access
CREATE POLICY "public_read_portfolio" ON public.portfolio_items
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admin_all_portfolio" ON public.portfolio_items
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Blog: public read published
CREATE POLICY "public_read_blog" ON public.blog_posts
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admin_all_blog" ON public.blog_posts
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Services: public read published
CREATE POLICY "public_read_services" ON public.services
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admin_all_services" ON public.services
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Testimonials: public read published
CREATE POLICY "public_read_testimonials" ON public.testimonials
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admin_all_testimonials" ON public.testimonials
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Team: public read published
CREATE POLICY "public_read_team" ON public.team_members
  FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admin_all_team" ON public.team_members
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Quotes: anyone can insert, only admin reads
CREATE POLICY "public_insert_quotes" ON public.quote_requests
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin_all_quotes" ON public.quote_requests
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Site settings: public read, admin write
CREATE POLICY "public_read_settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_all_settings" ON public.site_settings
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Grant table access
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ═══════════════════════════════════════════════════════════
--  SEED DATA — Imba Marketing (AI Marketing Agency)
-- ═══════════════════════════════════════════════════════════

-- Site Settings
INSERT INTO public.site_settings (key, value) VALUES
  ('hero', '{"title":"Marketing that outperforms. Powered by AI.","subtitle":"We combine six proprietary AI systems with human strategy to help ambitious brands attract, convert, and retain customers.","cta_primary":"Book a Strategy Call","cta_secondary":"See Our Work"}'),
  ('stats', '[{"num":"3×","label":"Revenue Growth"},{"num":"4.8×","label":"ROAS"},{"num":"200+","label":"Clients"},{"num":"98%","label":"Retention"}]'),
  ('contact_info', '{"email":"hello@imbamarketing.com","phone":"+1 (650) 226-7172","address":"1007 N Orange St, 4th Floor, Suite #3601, Wilmington, Delaware 19801"}'),
  ('seo', '{"title":"Imba Marketing — AI-Powered Marketing Agency","description":"AI-powered marketing agency. Intelligent campaigns that drive revenue, lower costs, and scale faster than traditional marketing.","og_image":""}')
ON CONFLICT (key) DO NOTHING;

-- Services
INSERT INTO public.services (name, slug, tagline, description, icon_key, sort_order, published) VALUES
  ('AI Growth Marketing', 'growth', 'Automated campaigns that compound growth', 'End-to-end AI marketing automation — campaigns that optimize themselves, leads that get scored automatically, and revenue that grows month over month.', 'growth', 0, true),
  ('AI Performance Ads', 'ads', 'Every ad dollar optimized by AI', 'Cross-platform ad management across Google, Meta, TikTok, and LinkedIn with real-time ROAS optimization and creative testing.', 'ads', 1, true),
  ('AI Personalization', 'personalisation', 'Right message, right person, right moment', 'Dynamic content delivery, behavioral targeting, and individualized customer journeys across email, web, and ads.', 'personalisation', 2, true),
  ('AI Content Production', 'content', 'Brand content at scale', 'AI creates social posts, email campaigns, ad creatives, blog articles, and product descriptions — all in your brand voice.', 'content', 3, true),
  ('AI Analytics & Intelligence', 'intelligence', 'Data-driven decisions, not guesswork', 'Competitor tracking, market trend analysis, customer insights, and predictive analytics that inform every strategic decision.', 'intelligence', 4, true),
  ('AI Conversion Optimization', 'funnel', 'Turn more visitors into customers', 'Funnel analysis, multivariate A/B testing, landing page optimization, and checkout improvement powered by AI.', 'funnel', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Testimonials
INSERT INTO public.testimonials (client_name, client_role, client_company, text, rating, featured, published) VALUES
  ('Sarah Andersen', 'CMO', 'FoodCo International', 'Our monthly revenue was stuck at $40K. Imba deployed their AI systems and within 90 days we hit $120K/mo. The ads, email flows, everything just works now.', 5, true, true),
  ('David Chen', 'CEO', 'Ogitive SaaS', 'We needed a marketing partner who understood tech. Imba''s AI analytics uncovered segments we never knew existed — our pipeline tripled in one quarter.', 5, true, true),
  ('Nina Karlsson', 'Marketing Director', 'Prime Real Estate Group', 'Real estate marketing is competitive. Imba''s AI personalization delivers the right listings to the right buyers automatically. Our lead quality improved 4x.', 5, true, true),
  ('Marco Kessler', 'Growth Lead', 'NordShop', 'We were burning $8K/mo on ads with barely any return. Now every dollar brings back $4.80. Our ROAS tripled.', 5, false, true),
  ('Julia Larsson', 'Founder', 'Velour Boutique', 'Running a fashion brand is exhausting. Imba handles our product content, email campaigns, and ads with AI — I get a full month of content in a day.', 5, false, true),
  ('Predrag Kozica', NULL, 'Kozica Soaps', 'Imba completely turned around our advertising. We went from barely breaking even to getting $4.20 back for every $1 spent — in just 8 weeks.', 5, false, true)
ON CONFLICT DO NOTHING;

-- Team Members
INSERT INTO public.team_members (name, role, bio, sort_order, published) VALUES
  ('Ljubica Jevremovic', 'Partner & Creative Director', 'Ljubica has helped dozens of brands — from SaaS startups to global consumer brands — create AI-powered marketing that connects with people and drives real sales.', 0, true),
  ('Marko Tiosavljevic', 'Partner & Marketing Strategist', '20+ years helping businesses grow. Marko designs the AI marketing strategies that consistently turn ad spend into revenue across e-commerce, SaaS, and professional services.', 1, true)
ON CONFLICT DO NOTHING;

-- Portfolio Items
INSERT INTO public.portfolio_items (title, slug, category, client_name, description, results, featured, published, sort_order) VALUES
  ('AI Growth Engine for E-Commerce', 'foodco-growth', 'growth', 'FoodCo International', 'Built a full AI growth system — automated ads, email flows, and lead scoring — tripling monthly revenue from $40K to $120K in 90 days.', '{"revenue":"+200%","email_uplift":"+38%","cpa":"-52%"}', true, true, 0),
  ('Cross-Platform Ad ROAS Optimization', 'nordshop-ads', 'ads', 'NordShop', 'Rebuilt Google Shopping and Meta campaigns with AI creative testing. ROAS went from 1.2x to 4.8x while scaling spend 3x.', '{"roas":"4.8×","cpa":"$18.40","savings":"40%"}', true, true, 1),
  ('AI Content Engine for Fashion', 'velour-content', 'content', 'Velour Boutique', 'AI content system produces a full month of on-brand social posts, email campaigns, and ad creatives for 500+ SKUs in a single session.', '{"content_output":"30×","engagement":"+180%","time_saved":"95%"}', false, true, 2),
  ('SaaS Pipeline Growth', 'ogitive-saas', 'growth', 'Ogitive SaaS', 'AI analytics uncovered underserved market segments. Pipeline tripled through targeted campaigns and automated lead nurturing.', '{"pipeline":"3×","conversion":"+45%","leads":"2.4×"}', false, true, 3),
  ('Real Estate Lead Personalization', 'prime-realestate', 'personalisation', 'Prime Real Estate Group', 'AI personalization matches listings to buyer preferences automatically. Lead quality improved 4x with less manual effort.', '{"lead_quality":"4×","response_time":"-80%","conversions":"+62%"}', false, true, 4),
  ('Checkout Conversion Optimization', 'brandx-funnel', 'funnel', 'BrandX', 'AI funnel audit found 4 critical drop-off points. A/B testing and checkout improvements doubled qualified leads in 6 weeks.', '{"conversion":"+62%","cart_recovery":"2×","bounce":"-34%"}', false, true, 5)
ON CONFLICT (slug) DO NOTHING;

-- Blog Categories
INSERT INTO public.blog_categories (name, slug) VALUES
  ('AI Marketing', 'ai-marketing'),
  ('Growth Strategy', 'growth-strategy'),
  ('Performance Advertising', 'performance-advertising'),
  ('Content Strategy', 'content-strategy'),
  ('Conversion Optimization', 'conversion-optimization'),
  ('Industry Insights', 'industry-insights'),
  ('Case Studies', 'case-studies')
ON CONFLICT DO NOTHING;

-- Blog Posts
INSERT INTO public.blog_posts (title, slug, excerpt, body, category, tags, read_time_minutes, published, status, author_name, published_at) VALUES
  (
    'Why AI Marketing Outperforms Traditional Agencies in 2026',
    'why-ai-marketing-outperforms-2026',
    'Traditional marketing agencies are struggling to keep up. Here''s why AI-powered marketing delivers better results, faster, and at lower cost.',
    '<h2>The Shift Is Already Here</h2><p>Marketing has changed more in the last two years than in the previous twenty. AI isn''t replacing marketers — it''s giving them superpowers.</p><h2>What Makes AI Marketing Different</h2><p>Traditional agencies run campaigns based on experience and intuition. AI marketing agencies run campaigns based on data — millions of data points analyzed in real time.</p><ul><li><strong>Speed:</strong> AI tests hundreds of ad variations simultaneously</li><li><strong>Precision:</strong> Every customer gets personalized messaging</li><li><strong>Efficiency:</strong> Budget automatically shifts to what''s working</li><li><strong>Scale:</strong> One AI system does the work of an entire team, 24/7</li></ul><h2>The Numbers Don''t Lie</h2><p>Our clients see 3× revenue growth on average. Their ad returns improve by 300%. And they see results within 48 hours, not months.</p>',
    'AI Marketing', ARRAY['AI', 'marketing', 'strategy'], 5, true, 'published', 'Imba Marketing', NOW() - INTERVAL '7 days'
  ),
  (
    'How We Helped an E-Commerce Brand Triple Revenue in 90 Days',
    'ecommerce-triple-revenue-90-days',
    'A Shopify food brand was stuck at $40K/mo. Here''s exactly how our AI systems took them to $120K/mo.',
    '<h2>The Challenge</h2><p>FoodCo International had a quality product and decent traffic, but their marketing was scattered.</p><h2>What We Built</h2><ul><li><strong>AI Performance Ads:</strong> 200+ creative variations tested automatically</li><li><strong>AI Email Automation:</strong> Welcome, cart recovery, and post-purchase flows</li><li><strong>AI Analytics:</strong> Real-time revenue attribution dashboard</li></ul><h2>The Results</h2><p>Monthly revenue: $40K → $120K (+200%). Email revenue: +38%. CPA: -52%.</p>',
    'Case Studies', ARRAY['e-commerce', 'case study', 'revenue growth'], 6, true, 'published', 'Imba Marketing', NOW() - INTERVAL '14 days'
  ),
  (
    '5 AI Marketing Strategies Every Brand Should Use in 2026',
    '5-ai-marketing-strategies-2026',
    'From personalized email flows to predictive analytics, these five AI strategies are delivering real results right now.',
    '<h2>1. AI-Powered Ad Creative Testing</h2><p>AI tests hundreds of creative variations simultaneously and automatically scales winners.</p><h2>2. Behavioral Email Personalization</h2><p>Every customer receives emails tailored to their specific behavior.</p><h2>3. Predictive Customer Segmentation</h2><p>AI groups customers by intent, not just demographics.</p><h2>4. AI Content Production</h2><p>A month of on-brand content in a single day.</p><h2>5. Conversion Funnel Optimization</h2><p>AI finds where people drop off and tests improvements automatically.</p>',
    'AI Marketing', ARRAY['AI', 'strategy', 'tips'], 7, true, 'published', 'Imba Marketing', NOW() - INTERVAL '21 days'
  )
ON CONFLICT (slug) DO NOTHING;

-- ── Master admin user seed ────────────────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role,
      email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token,
      is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      uuid_generate_v4(),
      'authenticated',
      'authenticated',
      'admin@imbaproduction.com',
      crypt('Controlbalanced33101..', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      '', '',
      true
    ) ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;
