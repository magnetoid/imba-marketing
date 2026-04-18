# 2026 SEO & AEO (Answer Engine Optimization) Roadmap

This document outlines the comprehensive strategy, technical implementations, and continuous optimization workflows adopted by Imba Marketing to dominate Search Generative Experiences (SGE) and AI-driven search engines (ChatGPT, Perplexity, Bing AI, Google SGE) in 2026.

## 1. The 2026 Search Landscape
In 2026, traditional "blue link" SEO has been largely superseded by **AEO (Answer Engine Optimization)**. Users rely on AI overviews and conversational interfaces. 

### Key Pillars of our Strategy:
1. **Entity-First Optimization:** Treating Imba Marketing and its services as semantic entities via robust JSON-LD Schema.org markup.
2. **Conversational Snippets:** Direct, factual, and concise Q&A formatting that LLMs can easily extract and cite.
3. **Technical Performance (Core Web Vitals):** Sub-second load times and flawless mobile experiences, as LLM crawlers heavily penalize slow TTFB (Time to First Byte).
4. **LLM Context Files:** Utilizing `/llms.txt` and specific `robots.txt` directives to explicitly feed context to AI bots (GPTBot, Claude-Web, PerplexityBot).

---

## 2. Implemented AI-Driven SEO Tools
We have upgraded the internal CMS with an **AI-Powered SEO Generator** that leverages Anthropic's Claude 3.5 Sonnet to automate the heavy lifting:

* **Location:** `src/admin/crm/SEOManager.tsx` & `supabase/functions/generate-seo`
* **Capabilities:** 
  * Instantly generates `title` and `description` optimized for click-through-rate and SGE relevance.
  * Automatically creates complex `FAQPage` and `WebPage` structured data (JSON-LD) tailored to the specific page content.
  * Enforces character limits (60 for titles, 160 for descriptions) dynamically.

---

## 3. Technical Enhancements

### Component Upgrades (`Seo.tsx`)
- Explicit bot directives added for `googlebot` and `bingbot`.
- Enforced `max-snippet:-1, max-image-preview:large, max-video-preview:-1` to ensure LLMs and search engines have permission to use our rich media in generative answers.
- Array-based schema injection allows a single page to hold multiple entity definitions (e.g., `Organization` + `FAQPage` + `Service`).

### Crawler Directives
- **`robots.txt`:** Explicitly allows major AI crawlers (`GPTBot`, `anthropic-ai`, `Claude-Web`, `PerplexityBot`) to ingest the site.
- **`llms.txt`:** A dedicated plaintext context file summarizing the business, services, and pricing specifically formatted for LLM ingestion.

---

## 4. Measurable KPIs & Tracking

To evaluate the success of this AEO rollout, we will track the following KPIs:

| KPI | Target (2026) | Measurement Tool |
| :--- | :--- | :--- |
| **AEO Citation Rate** | > 15% appearance in Perplexity/SGE queries | Brand monitoring tools (e.g., Mention, custom LLM tracking) |
| **Core Web Vitals (LCP)** | < 1.2s | Google Search Console / Lighthouse CI |
| **Organic CTR** | > 4.5% on non-branded terms | Google Search Console |
| **Schema Validation** | 100% Error-Free | Rich Results Test API |
| **Indexation Speed** | < 24 hours | Google Search Console API |

---

## 5. Automated Testing Protocols & Maintenance Workflow

### Continuous Optimization Workflow (Weekly)
1. **Content Refresh:** Use the AI Auto-Generator in the CMS to refresh underperforming pages based on GSC impression data.
2. **Schema Expansion:** As new services are added, generate corresponding `Service` and `FAQPage` schemas via the one-click tool.

### Automated Testing (CI/CD)
To maintain our technical edge, the following protocols should be added to the deployment pipeline:
- **Lighthouse CI:** Run against staging deployments. Fail builds if SEO or Performance scores drop below `95`.
- **JSON-LD Validator:** Add a pre-commit hook or build step (e.g., `schema-dts` or custom script) to ensure all dynamically generated schemas in the database are structurally valid.
- **Dead Link Checker:** Run weekly automated checks to prevent 404s, which harm crawler trust.

## 6. Next Steps
1. Deploy the `generate-seo` edge function to the production Coolify server.
2. Content managers must navigate to the **SEO Manager** in the Admin CRM and click **"✨ Auto-Generate (AEO 2026)"** for all core service pages.
3. Monitor Google Search Console for "Rich Results" and "FAQ" impressions over the next 14 days.