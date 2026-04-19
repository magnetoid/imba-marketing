import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import '@/i18n'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import QuoteModal from '@/components/QuoteModal'
import { QuoteModalProvider } from '@/contexts/QuoteModalContext'
import Home from '@/pages/Home'
import Work from '@/pages/Work'
import Services from '@/pages/Services'
import About from '@/pages/About'
import Blog from '@/pages/Blog'
import BlogPost from '@/pages/BlogPost'
import Contact from '@/pages/Contact'
import Reviews from '@/pages/Reviews'
import Gallery from '@/pages/Gallery'
import AIProjects from '@/pages/AIProjects'
import ServicePage from '@/pages/services/ServicePage'
import AdminLayout from '@/admin/AdminLayout'
import AdminLanding from '@/admin/AdminLanding'
import Dashboard from '@/admin/Dashboard'
import HeroVideosAdmin from '@/admin/HeroVideosAdmin'
import PortfolioAdmin from '@/admin/PortfolioAdmin'
import BlogAdmin from '@/admin/BlogAdmin'
import BlogPostEditor from '@/admin/BlogPostEditor'
import QuoteRequests from '@/admin/QuoteRequests'
import MediaAdmin from '@/admin/MediaAdmin'
import GalleryAdmin from '@/admin/GalleryAdmin'
import BlogCategoriesAdmin from '@/admin/BlogCategoriesAdmin'
import ImportAdmin from '@/admin/ImportAdmin'
import SeoAdmin from '@/admin/SeoAdmin'
import TranslationsAdmin from '@/admin/TranslationsAdmin'
import TestimonialsAdmin from '@/admin/TestimonialsAdmin'
import CRMDashboard from '@/admin/crm/CRMDashboard'
import LeadDetail from '@/admin/crm/LeadDetail'
import SEOManager from '@/admin/crm/SEOManager'
import AILeadSearcher from '@/admin/crm/AILeadSearcher'
import AIOutreach from '@/admin/crm/AIOutreach'
import AIInbox from '@/admin/crm/AIInbox'
import AIAnalytics from '@/admin/crm/AIAnalytics'
import AISettings from '@/admin/crm/AISettings'
import ChatInbox from '@/admin/crm/ChatInbox'
import ChatWidget from '@/components/ChatWidget'
import useAnalytics from '@/hooks/useAnalytics'

// Scroll reveal observer — uses MutationObserver to catch dynamically-added .reveal elements
function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    function observeAll() {
      document.querySelectorAll('.reveal:not(.in-view)').forEach((el) => io.observe(el))
    }

    observeAll()

    // Watch for new .reveal elements added to the DOM (e.g. async-loaded blog posts)
    const mo = new MutationObserver(() => observeAll())
    mo.observe(document.body, { childList: true, subtree: true })

    return () => { io.disconnect(); mo.disconnect() }
  }, [])
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  useScrollReveal()
  return (
    <>
      <ScrollToTop />
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <Nav />
      <main id="main-content">{children}</main>
      <Footer />
      <ChatWidget />
    </>
  )
}

export default function App() {
  useAnalytics()
  return (
    <QuoteModalProvider>
      <QuoteModal />
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/work" element={<PublicLayout><Work /></PublicLayout>} />
        <Route path="/results" element={<PublicLayout><Work /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/services/:slug" element={<PublicLayout><ServicePage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/reviews" element={<PublicLayout><Reviews /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/ai-projects" element={<PublicLayout><AIProjects /></PublicLayout>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminLanding />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hero-videos" element={<HeroVideosAdmin />} />
          <Route path="portfolio" element={<PortfolioAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="blog/new" element={<BlogPostEditor />} />
          <Route path="blog/categories" element={<BlogCategoriesAdmin />} />
          <Route path="blog/:id" element={<BlogPostEditor />} />
          <Route path="media" element={<MediaAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="import" element={<ImportAdmin />} />
          <Route path="quotes" element={<QuoteRequests />} />
          <Route path="seo" element={<SeoAdmin />} />
          <Route path="translations" element={<TranslationsAdmin />} />
          <Route path="testimonials" element={<TestimonialsAdmin />} />
          <Route path="crm" element={<CRMDashboard />} />
          <Route path="crm/ai-search" element={<AILeadSearcher />} />
          <Route path="crm/outreach" element={<AIOutreach />} />
          <Route path="crm/inbox" element={<AIInbox />} />
          <Route path="crm/analytics" element={<AIAnalytics />} />
          <Route path="crm/settings" element={<AISettings />} />
          <Route path="crm/chat" element={<ChatInbox />} />
          <Route path="crm/seo" element={<SEOManager />} />
          <Route path="crm/:id" element={<LeadDetail />} />
        </Route>
      </Routes>
    </QuoteModalProvider>
  )
}
