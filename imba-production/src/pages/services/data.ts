export interface ServiceData {
  slug: string
  key: string
  icon: string
  label: string
  tagline: string
  color: string
  heroDesc: string
  stats: { num: string; label: string }[]
  features: { title: string; desc: string }[]
  process: { n: string; title: string; desc: string }[]
  cases: { client: string; headline: string; desc: string }[]
  faq: { q: string; a: string }[]
}

export const SERVICES_DATA: ServiceData[] = [
  {
    slug: 'growth',
    key: 'growth',
    icon: '◈',
    label: 'AI Growth Systems',
    tagline: 'Your marketing and sales on autopilot',
    color: '#E8452A',
    heroDesc: 'We design end-to-end AI-powered growth engines that automate your marketing and sales workflows, optimise campaigns in real time, and transform raw data into revenue-generating decisions. The result: a business that scales faster with less manual effort and compounding results over time.',
    stats: [
      { num: '3×', label: 'average revenue growth in year one' },
      { num: '89%', label: 'of clients see results within 4 weeks' },
      { num: '40%', label: 'reduction in cost per lead' },
      { num: '48h', label: 'time to first AI-driven improvement' },
    ],
    features: [
      { title: 'AI Workflow Automation', desc: 'Eliminate repetitive marketing tasks with intelligent automation. From lead routing and email sequences to social posting and campaign reporting — your stack works itself.' },
      { title: 'Campaign Intelligence Engine', desc: 'Real-time AI analysis of all your campaigns across every channel. Automatic budget reallocation, bid adjustments, and creative rotation based on live performance data.' },
      { title: 'Predictive Lead Scoring', desc: 'AI models trained on your historical data predict which leads are most likely to convert — so your sales team focuses only on high-value prospects.' },
      { title: 'Revenue Attribution Modelling', desc: 'Full-funnel attribution that shows exactly which marketing activities drive revenue. Stop guessing; start allocating budget to what actually works.' },
      { title: 'Customer Lifetime Value Prediction', desc: 'AI models that identify high-LTV customers early, enabling smarter acquisition spend, personalised retention strategies, and churn prevention at scale.' },
      { title: 'Growth Loop Architecture', desc: 'We design self-reinforcing growth loops — systems where every customer action generates data that improves acquisition, retention, and expansion automatically.' },
    ],
    process: [
      { n: '01', title: 'Growth Audit', desc: 'AI-powered audit of your entire marketing and sales stack. We map every touchpoint, identify revenue leaks, and quantify the exact opportunity in each channel.' },
      { n: '02', title: 'System Architecture', desc: 'We design your custom AI growth system — selecting the right models, integrations, and automation workflows for your specific business and competitive landscape.' },
      { n: '03', title: 'Build & Integration', desc: 'We build and connect every component of your AI growth system to your existing stack. Zero disruption to ongoing operations during the 2–4 week deployment.' },
      { n: '04', title: 'Launch & Optimise', desc: 'Systems go live with full monitoring. We optimise continuously as the AI learns — expanding capabilities and scaling what works as results compound.' },
    ],
    cases: [
      { client: 'FoodCo International', headline: '+89% revenue, 38% higher CTR', desc: 'Full-funnel AI growth system automated lead nurturing, campaign optimisation, and content distribution. Revenue grew 89% in 12 months.' },
      { client: 'Prime Real Estate', headline: '3× qualified leads, -52% CPL', desc: 'AI lead scoring and automated nurture sequences tripled qualified pipeline while cutting cost per lead in half.' },
    ],
    faq: [
      { q: 'How long before the AI system is live?', a: 'Most AI growth systems are fully deployed within 2–4 weeks. You\'ll see initial improvements within 48 hours of the first components going live.' },
      { q: 'Do you integrate with our existing CRM?', a: 'Yes — we integrate with all major CRMs including HubSpot, Salesforce, Pipedrive, and custom setups. Your existing data becomes the foundation for the AI.' },
      { q: 'How is this different from marketing automation?', a: 'Traditional automation follows fixed rules. Our AI systems learn from data, adapt in real time, and make decisions based on predictive models — not pre-written workflows.' },
      { q: 'What kind of ongoing support do you provide?', a: 'We provide continuous monitoring, monthly optimisation reviews, and quarterly system expansions. Your AI system gets smarter and more capable over time.' },
    ],
  },
  {
    slug: 'ads',
    key: 'ads',
    icon: '▣',
    label: 'AI Performance Advertising',
    tagline: 'Turn ad spend into predictable revenue',
    color: '#C9A96E',
    heroDesc: 'Our AI advertising systems run continuously across every platform — testing creatives, shifting budgets, refining audiences, and compounding learnings in real time. The result: dramatically higher ROAS, lower CPAs, and ad accounts that get smarter every single day without manual intervention.',
    stats: [
      { num: '300%', label: 'average ROAS improvement' },
      { num: '40%', label: 'lower cost per acquisition' },
      { num: '6', label: 'platforms managed simultaneously' },
      { num: '24/7', label: 'real-time AI optimisation' },
    ],
    features: [
      { title: 'Cross-Platform Ad Automation', desc: 'AI manages your campaigns across Meta, Google, TikTok, LinkedIn, Pinterest, and YouTube simultaneously — allocating budget to the highest-performing placements in real time.' },
      { title: 'Real-Time Creative Testing', desc: 'Hundreds of creative variants tested automatically. AI identifies winning combinations of headlines, visuals, and CTAs — then scales winners and kills losers instantly.' },
      { title: 'Audience Intelligence Engine', desc: 'AI builds and refines audience segments based on behavioural signals, lookalikes, and predictive intent modelling — finding your best customers before competitors do.' },
      { title: 'Automated Bid Management', desc: 'Intelligent bidding algorithms that adjust in real time based on conversion probability, competitor activity, and your ROAS targets — maximising every dollar of ad spend.' },
      { title: 'Dynamic Ad Personalisation', desc: 'AI-generated ad copy and visuals that adapt to each audience segment, device, and placement — delivering hyper-relevant messaging at scale without manual work.' },
      { title: 'Ad Account Health Monitoring', desc: 'Continuous monitoring for budget anomalies, frequency fatigue, policy issues, and performance drops. Automated alerts and fixes before problems cost you money.' },
    ],
    process: [
      { n: '01', title: 'Account Audit & Benchmarking', desc: 'Full audit of your existing ad accounts. AI benchmarks your current ROAS, CPA, and CTR against industry standards and identifies the highest-impact opportunities.' },
      { n: '02', title: 'AI Campaign Architecture', desc: 'We build a new campaign structure designed for AI optimisation — the right campaign types, bid strategies, and audience layers for maximum learning and scale.' },
      { n: '03', title: 'Creative System Build', desc: 'We build your creative testing pipeline — developing initial ad assets and setting up automated testing frameworks to accelerate learning velocity.' },
      { n: '04', title: 'Launch, Learn & Scale', desc: 'Campaigns launch with full AI oversight. The system learns daily, reallocates budget to winners, and scales proven combinations while continuously testing new variants.' },
    ],
    cases: [
      { client: 'NordShop', headline: '4.8× ROAS, CPA $18.40 (-40%)', desc: 'AI ad system deployed across Meta and Google. Real-time creative testing and audience intelligence reduced CPA by 40% while scaling spend 3×.' },
      { client: 'Velour Boutique', headline: '6× return on TikTok spend', desc: 'AI-generated creative variants and dynamic audience targeting generated 6× ROAS on TikTok within 8 weeks of launch.' },
    ],
    faq: [
      { q: 'Which ad platforms do you manage?', a: 'We manage Meta (Facebook/Instagram), Google (Search/Display/Shopping/YouTube), TikTok, LinkedIn, Pinterest, and X. We run all platforms simultaneously with unified AI optimisation.' },
      { q: 'What\'s the minimum ad budget you work with?', a: 'We typically work with clients spending a minimum of $3,000/month on ads. Below this threshold, the AI has insufficient data to optimise effectively.' },
      { q: 'How quickly will ROAS improve?', a: 'Most clients see measurable ROAS improvement within 2–4 weeks. Significant improvements (2–3× ROAS) typically materialise within 6–8 weeks as the AI accumulates learning data.' },
      { q: 'Do you create the ad creatives?', a: 'Yes — our AI content engine generates ad copy, headlines, and creative briefs. We also produce static and video ad assets in-house as part of your AI advertising package.' },
    ],
  },
  {
    slug: 'personalisation',
    key: 'personalisation',
    icon: '◉',
    label: 'AI Personalisation Systems',
    tagline: 'The right message, every time, at scale',
    color: '#00D4FF',
    heroDesc: 'We build AI systems that deliver hyper-personalised experiences across every channel — email, website, ads, SMS, and more. Every customer gets a unique, relevant experience based on their behaviour, preferences, and predicted intent — driving dramatically higher engagement and conversion at scale.',
    stats: [
      { num: '5×', label: 'higher engagement vs. generic messaging' },
      { num: '67%', label: 'average email conversion rate improvement' },
      { num: '41%', label: 'increase in customer lifetime value' },
      { num: '100%', label: 'automated, zero manual work' },
    ],
    features: [
      { title: 'Dynamic Content Personalisation', desc: 'AI personalises every email, landing page, and ad in real time based on user behaviour, segment, and purchase history — delivering uniquely relevant experiences at any scale.' },
      { title: 'Behavioural Segmentation Engine', desc: 'AI analyses thousands of behavioural signals to build predictive micro-segments — grouping customers by intent, engagement level, and conversion likelihood rather than simple demographics.' },
      { title: 'Email & SMS AI Personalisation', desc: 'Subject lines, content, send times, and offers personalised for each recipient by AI. Every message is optimised to maximise open rates, clicks, and conversions.' },
      { title: 'Website Personalisation Layer', desc: 'AI dynamically adjusts homepage content, product recommendations, CTAs, and pricing based on each visitor\'s profile, referral source, and on-site behaviour.' },
      { title: 'Predictive Product Recommendations', desc: 'AI recommendation engine trained on your catalogue and purchase data. Surfaces the right products to the right customers at exactly the right moment in the journey.' },
      { title: 'Churn Prediction & Prevention', desc: 'AI identifies customers showing churn signals before they leave — triggering personalised win-back sequences, special offers, or proactive support to retain high-value accounts.' },
    ],
    process: [
      { n: '01', title: 'Data & Behaviour Audit', desc: 'We audit your existing customer data, email platform, website analytics, and CRM. AI maps your current personalisation gaps and quantifies the revenue opportunity.' },
      { n: '02', title: 'Personalisation Architecture', desc: 'We design your personalisation system — selecting the right models, data sources, and channels for your business. Every touchpoint mapped for intelligent customisation.' },
      { n: '03', title: 'AI Model Training & Integration', desc: 'We train personalisation models on your historical data and integrate with your email platform, CMS, and CRM. Systems are tested on live traffic before full launch.' },
      { n: '04', title: 'Deploy & Continuously Improve', desc: 'Personalisation goes live across all channels. Models retrain automatically as new data arrives — getting smarter and more accurate with every customer interaction.' },
    ],
    cases: [
      { client: 'Irving Books', headline: '5× email CTR, +67% email conversion', desc: 'AI personalisation across email sequences and website homepage. Behavioural triggers and predictive segments drove massive engagement uplift.' },
      { client: 'Magic Mind', headline: '+41% customer lifetime value', desc: 'Personalised post-purchase journeys and churn prevention sequences increased LTV by 41% within the first quarter of deployment.' },
    ],
    faq: [
      { q: 'What data do you need to personalise effectively?', a: 'We can start with basic email engagement data and website behaviour. The system improves as more data is available — purchase history, CRM data, and third-party signals all increase accuracy.' },
      { q: 'Which email platforms do you integrate with?', a: 'We integrate with Klaviyo, Mailchimp, HubSpot, ActiveCampaign, Braze, Iterable, and custom setups. If you use it, we can connect it.' },
      { q: 'How is AI personalisation different from segmentation?', a: 'Traditional segmentation puts customers into fixed buckets. Our AI continuously analyses individual behaviour and updates each customer\'s profile in real time — it\'s individual-level intelligence, not group guessing.' },
      { q: 'Can you personalise our website without a rebuild?', a: 'Yes — we implement personalisation as a layer on top of your existing website using a lightweight script. No redevelopment needed.' },
    ],
  },
  {
    slug: 'content',
    key: 'content',
    icon: '▶',
    label: 'AI Content Engines',
    tagline: 'Endless high-quality content, zero bottlenecks',
    color: '#6C7AE0',
    heroDesc: 'We build custom AI content engines that generate, repurpose, and distribute brand-consistent content across every platform and format — at a scale that was previously impossible. One idea becomes a month of content. One article becomes 40 assets. Your brand voice, amplified by machine speed.',
    stats: [
      { num: '30×', label: 'content output vs. manual creation' },
      { num: '95%', label: 'time saved on content production' },
      { num: '180%', label: 'average engagement improvement' },
      { num: '100%', label: 'brand voice consistency' },
    ],
    features: [
      { title: 'AI Content Generation', desc: 'Custom GPT models trained on your brand voice, tone, and existing content library — generating blog posts, social copy, ad creative, email sequences, and more at scale.' },
      { title: 'Multi-Platform Content Repurposing', desc: 'One piece of core content automatically repurposed into 40+ formats: social posts, email snippets, ad copy, shorts scripts, infographic text, and more — across every platform.' },
      { title: 'Brand Voice Training', desc: 'We train AI models specifically on your brand\'s existing content, style guide, and editorial standards. Output is indistinguishable from your best human-written content.' },
      { title: 'SEO-Optimised Content Production', desc: 'AI generates content around high-opportunity keywords, structured for featured snippets, and optimised for E-E-A-T — driving organic traffic at scale without a large editorial team.' },
      { title: 'Content Calendar Automation', desc: 'AI plans, writes, and schedules your entire content calendar across channels. Content publishing becomes fully automated — from ideation to distribution.' },
      { title: 'Performance-Driven Content Iteration', desc: 'AI analyses which content formats, topics, and styles drive the most engagement and conversions — continuously improving output quality based on real performance data.' },
    ],
    process: [
      { n: '01', title: 'Brand Voice Capture', desc: 'We audit your existing content, style guide, and competitive positioning. Our AI models are trained to match your exact brand voice before producing a single piece of content.' },
      { n: '02', title: 'Content Engine Architecture', desc: 'We design your content system — workflows, distribution pipelines, approval processes, and platform integrations. Everything automated from generation to publication.' },
      { n: '03', title: 'AI Model Training & Launch', desc: 'Custom GPT models trained on your brand data. First content batch produced, reviewed, and refined. Engine goes live with continuous output across all channels.' },
      { n: '04', title: 'Scale & Optimise', desc: 'Production scales as the AI learns which content performs. Monthly performance reviews identify new content opportunities, formats, and channels to expand into.' },
    ],
    cases: [
      { client: 'Velour Boutique', headline: '30 days of content in 1 day, +180% engagement', desc: 'Custom AI content engine trained on brand voice. Full month\'s content — social, email, and ads — produced in a single session with zero quality compromise.' },
      { client: 'FoodCo International', headline: '4× organic reach, -80% content cost', desc: 'AI content engine producing 60+ assets/week. Organic social engagement quadrupled while content production costs fell by 80%.' },
    ],
    faq: [
      { q: 'Will the content really sound like our brand?', a: 'Yes — we spend significant time training the AI on your existing content, style guides, and brand voice. Content passes internal review and is indistinguishable from your best writing.' },
      { q: 'Do we still review content before it publishes?', a: 'Yes — we build whatever approval workflow you need. Most clients do a quick batch review once per week. For evergreen or templated content, full automation is an option.' },
      { q: 'What content types can your AI produce?', a: 'Blog posts, social media copy (all platforms), email sequences, ad copy, video scripts, landing page copy, product descriptions, PR pitches, and more. If it\'s written, we can automate it.' },
      { q: 'How do you handle content compliance and brand guidelines?', a: 'Brand guidelines and compliance requirements are built into the AI\'s training data and output filters. The system automatically flags anything that deviates from your standards.' },
    ],
  },
  {
    slug: 'intelligence',
    key: 'intelligence',
    icon: '◬',
    label: 'AI Data & Market Intelligence',
    tagline: 'Know your market before your competitors do',
    color: '#3CBFAE',
    heroDesc: 'We build AI-powered intelligence systems that give you an unfair competitive advantage. Real-time competitor monitoring, predictive trend analysis, customer behaviour modelling, and keyword opportunity mapping — surfacing the exact intelligence your team needs to make faster, smarter marketing decisions.',
    stats: [
      { num: '28%', label: 'average organic growth uplift' },
      { num: '340+', label: 'new keyword opportunities identified avg.' },
      { num: '12', label: 'competitor gaps uncovered on average' },
      { num: '24/7', label: 'live market monitoring' },
    ],
    features: [
      { title: 'Competitor Intelligence Monitoring', desc: 'AI tracks competitor ad spend, creative strategy, keyword rankings, pricing changes, and content activity in real time — alerting you to opportunities and threats as they emerge.' },
      { title: 'Market Trend Analysis', desc: 'Predictive AI models that identify emerging trends in your category 4–8 weeks before they reach mainstream — giving you first-mover advantage on content, ads, and product decisions.' },
      { title: 'Customer Behaviour Modelling', desc: 'Deep analysis of your customer journey data to build predictive models of intent, churn risk, and LTV — enabling proactive marketing decisions based on what customers will do, not just what they did.' },
      { title: 'Keyword & Content Opportunity Mapping', desc: 'AI identifies high-opportunity keywords your competitors are missing, content gaps in your category, and search intent clusters driving commercial conversions in your market.' },
      { title: 'Audience Intelligence Reports', desc: 'AI-generated intelligence reports on your target audiences — psychographic profiles, platform preferences, content consumption patterns, and purchase triggers — updated continuously.' },
      { title: 'Marketing Performance Intelligence', desc: 'Cross-channel performance intelligence that unifies data from all your marketing platforms into a single AI-powered dashboard — with predictive insights, anomaly detection, and automated recommendations.' },
    ],
    process: [
      { n: '01', title: 'Intelligence Scope & Setup', desc: 'We define the intelligence priorities — competitors to monitor, trends to track, and data sources to integrate. AI data pipelines are configured and connected to your existing stack.' },
      { n: '02', title: 'Data Collection & Modelling', desc: 'AI models are trained on your historical data alongside market signals, competitor activity, and search behaviour. Intelligence baselines are established for all key metrics.' },
      { n: '03', title: 'Intelligence System Launch', desc: 'Live monitoring begins across all defined channels. Automated alerts, weekly intelligence reports, and real-time dashboards go live for your team.' },
      { n: '04', title: 'Insight Activation', desc: 'Monthly intelligence briefings translate AI findings into prioritised marketing actions. We help your team turn data into decisions that drive measurable competitive advantage.' },
    ],
    cases: [
      { client: 'Magic Mind', headline: '12 competitor gaps, +28% organic growth', desc: 'AI market intelligence revealed underserved keyword clusters and audience segments competitors had ignored. Organic growth accelerated 28% in 6 months.' },
      { client: 'NordShop', headline: 'Predicted viral trend 6 weeks early', desc: 'Trend prediction AI identified a rising product category 6 weeks before competitors — enabling NordShop to dominate search and social before demand peaked.' },
    ],
    faq: [
      { q: 'What sources does your AI monitor?', a: 'We monitor search engines (Google, Bing), social platforms (Meta, TikTok, LinkedIn, X), ad libraries, review platforms, news sources, and competitor websites — all in real time.' },
      { q: 'How do we access the intelligence?', a: 'You receive a live AI dashboard, automated weekly reports delivered to your inbox, and real-time Slack/email alerts for high-priority signals that require immediate action.' },
      { q: 'Can your AI predict what my customers will do?', a: 'Yes — predictive models trained on your customer data forecast purchase probability, churn risk, and LTV. These predictions are used to trigger proactive marketing actions automatically.' },
      { q: 'How is this different from Google Analytics?', a: 'Google Analytics shows you what happened. Our AI intelligence system tells you what will happen — and proactively recommends the marketing actions to take before outcomes occur.' },
    ],
  },
  {
    slug: 'funnel',
    key: 'funnel',
    icon: '◫',
    label: 'AI Funnel Optimisation',
    tagline: 'Turn more visitors into customers, automatically',
    color: '#E87A2A',
    heroDesc: 'We use AI-driven analysis and continuous testing to find exactly where your funnel is losing revenue — then systematically fix it. Every step of your customer journey is analysed, tested, and optimised: from ad click to checkout, landing page to email, trial to paid. More conversions, less guessing.',
    stats: [
      { num: '62%', label: 'average conversion rate improvement' },
      { num: '2×', label: 'qualified leads from same traffic' },
      { num: '34%', label: 'average bounce rate reduction' },
      { num: '4', label: 'critical leakage points found on average' },
    ],
    features: [
      { title: 'AI Funnel Leak Detection', desc: 'AI analyses every step of your funnel across all traffic sources to identify exactly where and why users drop off — quantifying the revenue impact of each leakage point.' },
      { title: 'Multivariate A/B Testing Engine', desc: 'Automated testing of hundreds of variable combinations simultaneously — headlines, CTAs, layouts, offers, and social proof — with AI determining winners far faster than manual testing.' },
      { title: 'Landing Page Optimisation', desc: 'AI-generated landing page variants tested against your control. Continuous optimisation of copy, design, and structure based on live conversion data from real visitors.' },
      { title: 'Checkout & Form Optimisation', desc: 'AI analysis of checkout and form completion behaviour. Friction-reducing changes to field count, layout, error handling, and trust signals to maximise completion rates.' },
      { title: 'Lead Nurture Sequence Optimisation', desc: 'AI optimises your entire email nurture sequence — timing, content, personalisation, and offers — based on engagement data and conversion predictions for each lead segment.' },
      { title: 'Conversion Rate Intelligence', desc: 'Ongoing AI monitoring of conversion metrics across all channels. Automated anomaly detection, performance forecasting, and opportunity alerts — so you\'re always optimising the highest-impact lever.' },
    ],
    process: [
      { n: '01', title: 'Funnel Audit & Leak Mapping', desc: 'Comprehensive AI analysis of your entire funnel. Heatmaps, session recordings, and conversion data are processed to produce a ranked list of leakage points by revenue impact.' },
      { n: '02', title: 'Optimisation Roadmap', desc: 'We prioritise fixes by ROI potential. High-impact, low-effort wins are addressed first — delivering quick wins while we build longer-term optimisation infrastructure.' },
      { n: '03', title: 'Test & Optimise', desc: 'Multivariate tests run continuously across your highest-value pages and sequences. AI determines statistical winners rapidly and implements changes automatically.' },
      { n: '04', title: 'Scale & Expand', desc: 'Winning optimisations are systematically rolled out across your entire funnel. As conversion rates improve, we expand testing to new touchpoints and traffic sources.' },
    ],
    cases: [
      { client: 'BrandX', headline: '+62% conversion rate, 2× qualified leads', desc: 'AI funnel audit found 4 critical drop-off points. Multivariate testing and landing page rebuilds doubled qualified leads within 6 weeks from identical traffic.' },
      { client: 'Ogitive', headline: '-41% checkout abandonment, +38% revenue', desc: 'AI checkout optimisation reduced abandonment by 41%. Combined with nurture sequence improvements, revenue increased 38% without increasing ad spend.' },
    ],
    faq: [
      { q: 'How do you measure funnel performance?', a: 'We track micro-conversions at every step: click-through rates, scroll depth, form starts, form completions, checkout initiations, and purchases — giving a precise picture of where users convert and where they don\'t.' },
      { q: 'Will testing disrupt our live campaigns?', a: 'No — all testing is implemented carefully alongside your existing funnel. Tests are controlled and monitored continuously. Any underperforming variant is paused immediately.' },
      { q: 'How long does it take to see improvement?', a: 'Quick wins from immediate friction-reduction fixes are typically visible within days. More significant conversion improvements from multivariate testing usually materialise within 4–6 weeks.' },
      { q: 'Do you need to redesign our website?', a: 'Rarely. Most conversion improvements come from targeted changes to copy, CTAs, trust signals, and layout — not full redesigns. We optimise what exists before recommending any rebuild.' },
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return SERVICES_DATA.find(s => s.slug === slug || s.key === slug)
}
