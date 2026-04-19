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
    label: 'Grow Your Revenue on Autopilot',
    tagline: 'Marketing that runs itself and gets better every day',
    color: '#EF4444',
    heroDesc: 'Imagine your marketing working around the clock without you having to manage it. Campaigns that improve on their own, leads that get scored automatically, and revenue that grows month after month. That\'s what we build for you — a marketing engine that runs itself so you can focus on running your business.',
    stats: [
      { num: '3×', label: 'average revenue growth in year one' },
      { num: '89%', label: 'of clients see results within 4 weeks' },
      { num: '40%', label: 'lower cost to get each customer' },
      { num: '48h', label: 'until you see first improvements' },
    ],
    features: [
      { title: 'Your marketing runs itself', desc: 'No more spending hours on repetitive tasks. Emails go out at the right time, posts get published, campaigns get adjusted — all automatically, all optimized.' },
      { title: 'Your best campaigns get more budget', desc: 'We automatically move your money to what\'s working. If a campaign is performing well, it gets more budget. If it\'s not, we cut it — in real time.' },
      { title: 'Your best leads get found first', desc: 'Not all leads are equal. We help you identify which ones are most likely to buy so your sales team stops wasting time on people who won\'t convert.' },
      { title: 'You see exactly what\'s making you money', desc: 'No more guessing which marketing activities drive revenue. We show you exactly where your sales come from so you can double down on what works.' },
      { title: 'Your best customers get identified early', desc: 'We spot high-value customers before they even buy much — so you can invest more in keeping them happy and coming back.' },
      { title: 'Growth that feeds itself', desc: 'Every customer interaction makes your marketing smarter. The more your business grows, the better your marketing performs. Results compound over time.' },
    ],
    process: [
      { n: '01', title: 'We look at everything', desc: 'We review your entire marketing setup — ads, emails, website, social media. We find exactly where you\'re losing potential customers and money.' },
      { n: '02', title: 'We design your plan', desc: 'Based on what we find, we create a custom growth plan. You\'ll know exactly what we\'ll build, what results to expect, and when you\'ll see them.' },
      { n: '03', title: 'We build and connect everything', desc: 'We set up your automated marketing and connect it to your existing tools. Everything goes live within 2–4 weeks with zero disruption to your business.' },
      { n: '04', title: 'We keep improving your results', desc: 'Once live, your marketing gets smarter every day. We monitor everything and keep expanding what works — your results grow month after month.' },
    ],
    cases: [
      { client: 'FoodCo International', headline: '89% more revenue, 38% better click rates', desc: 'We automated their entire marketing process. Leads got scored automatically, campaigns optimized themselves, and revenue grew 89% in 12 months.' },
      { client: 'Prime Real Estate', headline: '3× more quality leads, 52% lower costs', desc: 'We built a system that finds their best potential buyers automatically. They got three times more quality leads while spending half as much per lead.' },
    ],
    faq: [
      { q: 'How long before everything is running?', a: 'Most setups are fully live within 2–4 weeks. But you\'ll start seeing first improvements within 48 hours as the early pieces go live.' },
      { q: 'Will it work with the tools we already use?', a: 'Yes — we connect with all the major tools: HubSpot, Salesforce, Mailchimp, Shopify, and more. Your existing setup becomes the foundation.' },
      { q: 'How is this different from regular marketing automation?', a: 'Regular automation follows fixed rules you set. Our system learns and adapts. It spots patterns, makes decisions, and improves on its own based on what\'s actually working.' },
      { q: 'Do we get support after launch?', a: 'Absolutely. We monitor everything continuously, review performance monthly, and keep adding improvements. Your marketing gets better over time, not stale.' },
    ],
  },
  {
    slug: 'ads',
    key: 'ads',
    icon: '▣',
    label: 'Get More from Every Ad Dollar',
    tagline: 'Stop wasting money on ads that don\'t convert',
    color: '#D4A853',
    heroDesc: 'If you\'re running ads and not happy with the returns, we can fix that. We manage your advertising across all platforms — testing what works, cutting what doesn\'t, and making sure every dollar you spend brings back as much as possible. Our clients typically see 3× better returns within 2 months.',
    stats: [
      { num: '300%', label: 'better return on ad spend' },
      { num: '40%', label: 'lower cost per customer' },
      { num: '6', label: 'platforms managed at once' },
      { num: '24/7', label: 'your ads are always improving' },
    ],
    features: [
      { title: 'Ads on every platform, managed together', desc: 'Facebook, Instagram, Google, TikTok, LinkedIn, YouTube — we run your ads everywhere that matters and move money to wherever it\'s working best.' },
      { title: 'Hundreds of versions tested automatically', desc: 'We don\'t guess what ad will work. We test hundreds of different versions — images, headlines, audiences — and automatically put more budget behind the winners.' },
      { title: 'We find your best customers before competitors do', desc: 'We analyze who\'s most likely to buy from you and target them specifically — reaching the right people instead of wasting money showing ads to everyone.' },
      { title: 'Your budget goes where it works', desc: 'Smart bidding that adjusts in real time based on what\'s converting. Your money automatically flows to the ads, audiences, and platforms getting the best results.' },
      { title: 'Ads that speak to each audience', desc: 'Different people need different messages. We create personalized ads for each audience segment — so every potential customer sees something relevant to them.' },
      { title: 'Problems get caught before they cost you', desc: 'We constantly watch your ad accounts for anything unusual — budget spikes, declining performance, policy issues. Problems get fixed before they waste your money.' },
    ],
    process: [
      { n: '01', title: 'We review your current ads', desc: 'Full review of your existing ad accounts. We compare your numbers to what\'s typical in your industry and show you exactly where the biggest improvements are.' },
      { n: '02', title: 'We rebuild for better results', desc: 'We restructure your campaigns for maximum performance — the right ad types, targeting, and budget allocation to get the most from every dollar.' },
      { n: '03', title: 'We create and test ads', desc: 'We develop your ad creative — images, videos, copy — and set up automatic testing so we quickly find what resonates most with your audience.' },
      { n: '04', title: 'Results improve every day', desc: 'Once live, your campaigns learn and improve daily. Budget flows to winners, losers get cut, and new ideas keep getting tested. Your returns grow over time.' },
    ],
    cases: [
      { client: 'NordShop', headline: 'Every $1 spent → $4.80 back, costs cut 40%', desc: 'We rebuilt their ad strategy across Facebook and Google. Automatic testing and smarter targeting cut their cost per customer by 40% while tripling their ad spend.' },
      { client: 'Velour Boutique', headline: '6× return on TikTok ads', desc: 'We created and tested dozens of TikTok ad variations. Smart targeting and constant optimization generated 6× returns within 8 weeks.' },
    ],
    faq: [
      { q: 'Which platforms do you run ads on?', a: 'Facebook, Instagram, Google (Search, Shopping, Display, YouTube), TikTok, LinkedIn, Pinterest, and X. We manage all of them together and move budget to wherever it\'s working best.' },
      { q: 'How much should I be spending on ads?', a: 'We typically work with clients spending at least $3,000/month on ads. Below that, there\'s not enough data to optimize effectively. But we\'ll tell you honestly if your budget is enough for your goals.' },
      { q: 'How fast will I see better results?', a: 'Most clients see noticeable improvement within 2–4 weeks. Significant results (2–3× better returns) typically come within 6–8 weeks as we gather enough data to fully optimize.' },
      { q: 'Do you make the ads too?', a: 'Yes — we create everything: ad copy, images, video concepts. Creating the ads and optimizing them together is what makes our approach work so well.' },
    ],
  },
  {
    slug: 'personalisation',
    key: 'personalisation',
    icon: '◉',
    label: 'Make Every Customer Feel Special',
    tagline: 'The right message, right person, right time — automatically',
    color: '#3B82F6',
    heroDesc: 'Your customers don\'t want generic emails and one-size-fits-all websites. They want to feel like you understand them. We make that happen automatically — every email, every webpage, every ad adapts to each person\'s interests and behavior. The result? People engage more, buy more, and come back more often.',
    stats: [
      { num: '5×', label: 'more engagement than generic messages' },
      { num: '67%', label: 'more people convert from emails' },
      { num: '41%', label: 'increase in customer lifetime value' },
      { num: '100%', label: 'automated — zero manual work' },
    ],
    features: [
      { title: 'Every message feels personal', desc: 'Every email, landing page, and ad automatically adapts to what each person cares about. It\'s like having a personal marketing assistant for every single customer.' },
      { title: 'Customers grouped by what they actually do', desc: 'We don\'t just look at age and location. We group customers by their actual behavior — what they click, browse, buy, and ignore — for truly relevant messaging.' },
      { title: 'Emails that people actually open', desc: 'Subject lines, content, send times, and offers — all personalized for each person. Every email is designed to be relevant, not just another message in the inbox.' },
      { title: 'Your website adapts to each visitor', desc: 'Different visitors see different homepage content, product recommendations, and offers based on who they are and what they\'re interested in.' },
      { title: 'Product recommendations that actually work', desc: 'We show each customer the products they\'re most likely to buy — not random suggestions, but genuinely helpful recommendations based on their browsing and purchase history.' },
      { title: 'Keep customers from leaving', desc: 'We spot when a customer is about to stop buying from you and automatically send them the right message or offer to bring them back — before it\'s too late.' },
    ],
    process: [
      { n: '01', title: 'We review your customer data', desc: 'We look at your email platform, website analytics, and customer database. We find where personalization can have the biggest impact on your revenue.' },
      { n: '02', title: 'We design the experience', desc: 'We plan exactly how each customer touchpoint should be personalized — emails, website, ads. Every decision is mapped to a revenue goal.' },
      { n: '03', title: 'We build and connect everything', desc: 'We set up the personalization system and connect it to your existing tools. We test on real visitors before going fully live.' },
      { n: '04', title: 'It gets smarter over time', desc: 'Once live, the system keeps learning from every customer interaction. The more data it sees, the better it gets at showing people what they want.' },
    ],
    cases: [
      { client: 'Irving Books', headline: '5× more email clicks, 67% more sales from email', desc: 'We personalized their email campaigns and website. Customers started seeing books they actually wanted, and email conversions jumped 67%.' },
      { client: 'Magic Mind', headline: '41% more revenue per customer', desc: 'Personalized post-purchase emails and targeted offers increased how much each customer spends over time by 41% in just one quarter.' },
    ],
    faq: [
      { q: 'What data do you need to get started?', a: 'We can start with basic email engagement and website behavior. The more data you have (purchase history, CRM info), the more we can personalize — but it\'s not required to get started.' },
      { q: 'Which email tools do you work with?', a: 'Klaviyo, Mailchimp, HubSpot, ActiveCampaign, Braze, and many more. If you use an email tool, chances are we can connect to it.' },
      { q: 'How is this different from just sending different emails to different lists?', a: 'Traditional email lists are static — you put people in buckets and hope they fit. Our approach adapts to each individual person in real time based on what they actually do, not just what segment you put them in.' },
      { q: 'Do we need to rebuild our website?', a: 'No — personalization works as a layer on top of your existing website. No redesign needed. We add it seamlessly without changing what you already have.' },
    ],
  },
  {
    slug: 'content',
    key: 'content',
    icon: '▶',
    label: 'A Month of Content in One Day',
    tagline: 'Never run out of things to post again',
    color: '#EF4444',
    heroDesc: 'Creating content is exhausting and time-consuming. We fix that. We build you a content machine that creates posts, emails, ads, and articles that sound exactly like your brand — at a speed that would be impossible to do manually. One session produces a whole month of ready-to-publish content across all your platforms.',
    stats: [
      { num: '30×', label: 'more content than doing it yourself' },
      { num: '95%', label: 'less time spent on content' },
      { num: '180%', label: 'more engagement on average' },
      { num: '100%', label: 'matches your brand voice' },
    ],
    features: [
      { title: 'Content that sounds like you wrote it', desc: 'We train our system on your brand voice, tone, and style. The content it creates is indistinguishable from your best human-written pieces — because it learned from them.' },
      { title: 'One idea becomes 40+ pieces of content', desc: 'Write one article or do one video session, and we turn it into social posts, email content, ad copy, short video scripts, and more — all automatically.' },
      { title: 'Your brand stays consistent everywhere', desc: 'No matter how much content we produce, it all sounds and feels like your brand. Your guidelines and style are built into the system from day one.' },
      { title: 'Content that ranks on Google', desc: 'Every piece of content is optimized for search engines. We target the keywords that will bring you the most traffic and customers — not just any traffic.' },
      { title: 'Your whole content calendar, automated', desc: 'Planning, creating, scheduling, and publishing — all handled. Your content goes out consistently across every platform without you having to think about it.' },
      { title: 'We learn what works and do more of it', desc: 'We track which content gets the most engagement and sales. Then we create more of what works and less of what doesn\'t. Your content strategy improves over time.' },
    ],
    process: [
      { n: '01', title: 'We learn your brand voice', desc: 'We study your existing content, brand guidelines, and how you talk to customers. Our system is trained to match your exact style before producing anything.' },
      { n: '02', title: 'We set up your content machine', desc: 'We design the workflow: what content gets created, where it goes, and how it gets approved. Everything is automated from creation to publishing.' },
      { n: '03', title: 'First content batch goes live', desc: 'Your first batch of content is created, reviewed, and refined. Once you\'re happy with the quality, the system goes live and starts producing across all channels.' },
      { n: '04', title: 'More of what works, less of what doesn\'t', desc: 'We track performance and adjust. Content that performs well gets replicated. New formats and topics get tested. Your content strategy evolves with your audience.' },
    ],
    cases: [
      { client: 'Velour Boutique', headline: '30 days of content in 1 day, 180% more engagement', desc: 'We built a content system trained on their brand voice. A full month of social media, email, and ad content — produced in a single session, zero quality compromise.' },
      { client: 'FoodCo International', headline: '4× more reach, 80% lower content costs', desc: 'Their content system produces 60+ pieces per week. Social media reach quadrupled while content production costs dropped by 80%.' },
    ],
    faq: [
      { q: 'Will the content actually sound like our brand?', a: 'Yes — we spend significant time learning your brand voice before producing anything. Clients regularly tell us they can\'t tell the difference between our content and what they wrote themselves.' },
      { q: 'Do we review everything before it publishes?', a: 'Yes — we build whatever approval process you want. Most clients do a quick batch review once per week. For recurring content types, you can choose to fully automate.' },
      { q: 'What types of content can you create?', a: 'Blog posts, social media for every platform, email campaigns, ad copy, video scripts, product descriptions, landing pages, and more. If it\'s written, we can create it.' },
      { q: 'What about brand guidelines and compliance?', a: 'Your brand guidelines are built into the system. Every piece of content automatically follows your rules — tone, terminology, compliance requirements, everything.' },
    ],
  },
  {
    slug: 'intelligence',
    key: 'intelligence',
    icon: '◬',
    label: 'Know What Your Customers Want',
    tagline: 'Stop guessing, start knowing',
    color: '#D4A853',
    heroDesc: 'Most businesses make marketing decisions based on gut feeling. We give you hard data instead. Know exactly what your customers are searching for, what your competitors are doing, and where the untapped opportunities are in your market. No more guessing — just clear, actionable answers that help you grow.',
    stats: [
      { num: '28%', label: 'average growth from opportunities found' },
      { num: '340+', label: 'new keyword opportunities found on average' },
      { num: '12', label: 'competitor blind spots uncovered on average' },
      { num: '24/7', label: 'always watching your market' },
    ],
    features: [
      { title: 'See what your competitors are doing', desc: 'We track what competitors spend on ads, what content they publish, what keywords they target, and when they change strategy — so you can stay one step ahead.' },
      { title: 'Spot trends before they go mainstream', desc: 'We identify emerging trends in your market 4–8 weeks before most businesses notice them. This gives you time to act first and capture the opportunity.' },
      { title: 'Understand what your customers really want', desc: 'We analyze your customer data to understand not just what they bought, but what they\'re likely to buy next, when they might stop buying, and how to keep them engaged.' },
      { title: 'Find keywords your competitors miss', desc: 'We uncover search terms that your competitors aren\'t targeting but your customers are using. These hidden opportunities often drive significant growth.' },
      { title: 'Know your audience inside out', desc: 'Detailed profiles of who your customers are, what they care about, how they consume content, and what triggers them to buy — updated continuously.' },
      { title: 'All your marketing data in one place', desc: 'We connect data from all your marketing tools into one clear dashboard with actionable recommendations — no more switching between 10 different platforms.' },
    ],
    process: [
      { n: '01', title: 'We set up monitoring', desc: 'We identify what to track — competitors, keywords, customer behavior, market trends — and set up the systems to collect and analyze this data automatically.' },
      { n: '02', title: 'We establish your baseline', desc: 'We analyze your current position, your competitors, and your market. This gives us a clear picture of where you stand and where the opportunities are.' },
      { n: '03', title: 'You get real-time insights', desc: 'Live dashboards, weekly reports, and instant alerts for important changes. You always know what\'s happening in your market and what to do about it.' },
      { n: '04', title: 'We turn insights into action', desc: 'Monthly briefings translate what we find into clear marketing recommendations. We don\'t just give you data — we tell you what to do with it.' },
    ],
    cases: [
      { client: 'Magic Mind', headline: '12 competitor blind spots, 28% more growth', desc: 'We found 12 opportunities their competitors were missing — underserved search terms and audience segments. They acted on them and grew 28% in 6 months.' },
      { client: 'NordShop', headline: 'Spotted a trend 6 weeks before anyone else', desc: 'Our trend analysis caught a rising product category 6 weeks early. NordShop was ready before demand peaked — while competitors scrambled to catch up.' },
    ],
    faq: [
      { q: 'What do you actually monitor?', a: 'Search engines, social media, ad platforms, review sites, news, and competitor websites — all in real time. We watch everything relevant to your market so you don\'t have to.' },
      { q: 'How do we see the insights?', a: 'You get a live dashboard you can check anytime, weekly email reports with key findings, and instant alerts via email or Slack when something important happens.' },
      { q: 'Can you really predict what customers will do?', a: 'Yes — based on patterns in your data, we can predict who\'s likely to buy, who might stop buying, and which products each customer is interested in. These predictions drive automated marketing actions.' },
      { q: 'How is this different from Google Analytics?', a: 'Google Analytics tells you what already happened. We tell you what\'s about to happen and what to do about it — before your competitors figure it out.' },
    ],
  },
  {
    slug: 'funnel',
    key: 'funnel',
    icon: '◫',
    label: 'Turn More Visitors into Buyers',
    tagline: 'Same traffic, more sales — automatically',
    color: '#E87A2A',
    heroDesc: 'You\'re already getting visitors to your website. The problem? Most of them leave without buying. We find exactly where and why people drop off in your buying process — and fix it. The result: more of your existing visitors become paying customers, without spending more on ads.',
    stats: [
      { num: '62%', label: 'more visitors end up buying' },
      { num: '2×', label: 'more quality leads from same traffic' },
      { num: '34%', label: 'fewer people leave without buying' },
      { num: '4', label: 'problem spots found on average' },
    ],
    features: [
      { title: 'We find where you\'re losing customers', desc: 'We analyze every step of your buying process — from first click to final purchase — and pinpoint exactly where and why people are leaving without buying.' },
      { title: 'Hundreds of improvements tested at once', desc: 'We test different headlines, buttons, layouts, and offers simultaneously. Instead of guessing what works, we let real visitor behavior decide — and winners get implemented automatically.' },
      { title: 'Better pages that convert more', desc: 'We create improved versions of your key pages — landing pages, product pages, pricing pages — tested against your current versions to prove they work better.' },
      { title: 'Smoother checkout, more completed orders', desc: 'We analyze where people abandon their cart or form and make it easier to complete. Fewer form fields, better error messages, and trust signals that reduce friction.' },
      { title: 'Follow-up that brings people back', desc: 'Not everyone buys on the first visit. We optimize your email follow-up sequences to bring interested visitors back and convert them — with the right message at the right time.' },
      { title: 'You always know what\'s improving', desc: 'Real-time tracking of your conversion rates across every page and channel. You always know exactly how many visitors become customers — and how fast that number is growing.' },
    ],
    process: [
      { n: '01', title: 'We map where customers drop off', desc: 'We analyze your entire buying process to find exactly where people leave. Each problem spot is ranked by how much revenue it\'s costing you.' },
      { n: '02', title: 'We prioritize the biggest wins', desc: 'We fix the highest-impact problems first — delivering quick wins while we set up longer-term improvements. You see results fast.' },
      { n: '03', title: 'We test and improve continuously', desc: 'We run tests on your most important pages and emails. Real visitors determine what works best. Winning versions go live automatically.' },
      { n: '04', title: 'Results compound across your site', desc: 'Proven improvements get rolled out everywhere. As conversion rates improve, we test new areas. The improvements never stop.' },
    ],
    cases: [
      { client: 'BrandX', headline: '62% more sales, 2× more leads from same traffic', desc: 'We found 4 critical points where visitors were leaving. Testing and fixing these doubled their quality leads within 6 weeks — from the same traffic they already had.' },
      { client: 'Ogitive', headline: '41% fewer abandoned carts, 38% more revenue', desc: 'We streamlined their checkout process and improved follow-up emails. Cart abandonment dropped 41% and revenue increased 38% — without increasing ad spend.' },
    ],
    faq: [
      { q: 'How do you figure out where people drop off?', a: 'We track every step: what people click, how far they scroll, where they hesitate, when they leave forms. This gives us a precise picture of where and why people leave.' },
      { q: 'Will testing mess up our live website?', a: 'Not at all. Tests run alongside your existing pages. We monitor everything closely and immediately stop any version that performs worse. Your current experience is always the fallback.' },
      { q: 'How fast will we see improvement?', a: 'Quick fixes (removing friction, fixing confusing elements) often show results within days. Bigger improvements from systematic testing typically come within 4–6 weeks.' },
      { q: 'Do you need to redesign our whole website?', a: 'Almost never. Most conversion improvements come from targeted changes — better headlines, clearer buttons, smarter layout. We optimize what you have before suggesting any rebuild.' },
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return SERVICES_DATA.find(s => s.slug === slug || s.key === slug)
}
