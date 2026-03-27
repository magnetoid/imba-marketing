# Imba Marketing — Web Platform

AI-powered marketing agency for e-commerce brands. Full website with CMS, CRM, and admin panel.

**Stack:** Vite + React + TypeScript + Supabase (self-hosted) + Redis + nginx
**Deploy:** Coolify on Hetzner · Reverse proxy via Plesk/Traefik

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Hetzner VPS  (Coolify managed)                     │
│                                                     │
│  ┌────────────┐    ┌──────────────────────────────┐ │
│  │  Traefik   │    │  imba-web (nginx + React SPA)│ │
│  │  (SSL/TLS) │───▶│  imbamarketing.com           │ │
│  └─────┬──────┘    └──────────────────────────────┘ │
│        │                                            │
│        │           ┌──────────────────────────────┐ │
│        └──────────▶│  supabase-kong               │ │
│                    │  supabase.imbamarketing.com   │ │
│                    │  ├── GoTrue (auth :9999)      │ │
│                    │  ├── PostgREST (api :3001)    │ │
│                    │  └── Storage (:5000)          │ │
│                    └────────────┬─────────────────┘ │
│                                 │                   │
│  ┌──────────────┐  ┌────────────▼─────────────────┐ │
│  │ Redis :6379  │  │  PostgreSQL :5432            │ │
│  │ (cache/sess) │  │  (Supabase-compatible)       │ │
│  └──────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## Quick Deploy to Coolify

### 1. Connect repo

In Coolify → New Resource → Application → GitHub → `magnetoid/imba-marketing`
Build pack: **Docker Compose**
Compose file: `docker-compose.yml`

### 2. Generate JWT keys

```bash
openssl rand -base64 32

# Generate anon key (role: anon, exp: far future)
# Generate service_role key (role: service_role)
# Use: https://supabase.com/docs/guides/self-hosting#api-keys
```

Or use the Supabase JWT generator script:
```bash
node scripts/generate-jwt-keys.js
```

### 3. Set environment variables in Coolify

Copy `.env.example` → paste all vars into Coolify's env UI.
**Critical vars:**

| Variable | Description |
|---|---|
| `JWT_SECRET` | 32+ char random string |
| `SUPABASE_ANON_KEY` | JWT with role=anon |
| `SUPABASE_SERVICE_KEY` | JWT with role=service_role |
| `VITE_SUPABASE_URL` | `https://supabase.yourdomain.com` |
| `VITE_SUPABASE_ANON_KEY` | Same as SUPABASE_ANON_KEY |
| `POSTGRES_PASSWORD` | Strong password |
| `REDIS_PASSWORD` | Strong password |
| `APP_DOMAIN` | `imbamarketing.com` |
| `SUPABASE_DOMAIN` | `supabase.imbamarketing.com` |

### 4. DNS records

```
A  imbamarketing.com          → your-hetzner-ip
A  supabase.imbamarketing.com → your-hetzner-ip
```

### 5. Deploy

```bash
# Coolify triggers on git push to main
git push origin main
```

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/magnetoid/imba-marketing.git
cd imba-marketing

# 2. Install
cd imba-marketing
npm install

# 3. Environment
cp .env.example .env
# Fill in your Supabase cloud or local values

# 4. Start Supabase + Redis locally (optional)
docker compose up supabase-db redis -d

# 5. Run migrations
docker exec -i imba-supabase-db psql -U supabase -d imba_marketing < scripts/init.sql

# 6. Dev server
npm run dev
# → http://localhost:3000
```

---

## Admin Panel

URL: `https://imbamarketing.com/admin`

Login with Supabase Auth credentials.
Create first admin user via Supabase Studio or SQL:
```sql
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, role)
VALUES ('admin@imbamarketing.com', crypt('yourpassword', gen_salt('bf')), NOW(), 'authenticated');
```

---

## CMS Content Types

| Type | Table | Public read | Admin write |
|---|---|---|---|
| Portfolio items | `portfolio_items` | published only | yes |
| Blog posts | `blog_posts` | published only | yes |
| Services | `services` | published only | yes |
| Testimonials | `testimonials` | published only | yes |
| Team members | `team_members` | published only | yes |
| Quote requests | `quote_requests` | INSERT only | yes |
| Site settings | `site_settings` | yes | yes |

---

## Tech Stack

- **Frontend:** Vite 5 · React 18 · TypeScript · TailwindCSS
- **Backend:** Supabase (PostgreSQL + PostgREST + GoTrue + Storage)
- **Cache:** Redis 7 (session cache, rate limiting)
- **Gateway:** Kong 2.8 (API routing)
- **Serve:** nginx 1.25 (SPA + static assets)
- **Deploy:** Docker Compose · Coolify · Hetzner
- **Fonts:** Cormorant Garamond · DM Mono
