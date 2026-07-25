import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import FloatingActions from './components/FloatingActions.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

import { SERVICES } from './data/services.js'
import {
  CORPORATE_TAX_FILING,
  CORPORATE_TAX_REGISTRATION,
  CORPORATE_TAX_CONSULTANT,
} from './data/corporateTax.js'

/* Route-level code splitting: each page ships as its own chunk, so the initial
   load only pulls the shell + the page the visitor actually hits. This keeps
   the CtFiling stylesheet (~34kB) off every other route. */
const Home = lazy(() => import('./pages/Home.jsx'))
const ServicePage = lazy(() => import('./pages/ServicePage.jsx'))
const VatRegistrationPage = lazy(() => import('./pages/VatRegistrationPage.jsx'))
const CorporateTaxLanding = lazy(() => import('./pages/CorporateTaxLanding.jsx'))
const CtFilingPage = lazy(() => import('./pages/CtFilingPage.jsx'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

/* The dashboard is a separate app behind a login — it renders without the
   site header, footer and contact rail, and its CSS never loads for
   visitors. Lazy so none of it ships in the public bundle. */
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

/* Landing page converted from a full HTML file. Its CSS is scoped under
   .ctf-page, so it renders inside the normal site chrome (header + footer). */
const CorporateTaxFilingUae = lazy(() => import('./pages/CorporateTaxFilingUae.jsx'))

/** Slugs that use a bespoke layout rather than the article template. */
const CUSTOM_PAGES = {
  'vat-registration-services': <VatRegistrationPage />,
  'corporate-tax-filing': <CorporateTaxLanding data={CORPORATE_TAX_FILING} />,
  'corporate-tax-registration': <CorporateTaxLanding data={CORPORATE_TAX_REGISTRATION} />,
}

export default function App() {
  return (
    <Routes>
      {/* Standalone — no site chrome. */}
      <Route
        path="/admin"
        element={
          <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
            <AdminApp />
          </Suspense>
        }
      />

      <Route path="*" element={<PublicSite />} />
    </Routes>
  )
}

function PublicSite() {
  return (
    <>
      <ScrollToTop />
      <Header />

      {/* Footer sits inside the Suspense boundary: if it painted while a lazy
          route chunk was still loading it would jump down once the page
          rendered, which Lighthouse counts as a large layout shift. */}
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* One route per service slug, rendered by the shared article
                template unless the slug has a bespoke page. */}
            {SERVICES.map((s) => (
              <Route
                key={s.slug}
                path={`/${s.slug}`}
                element={CUSTOM_PAGES[s.slug] ?? <ServicePage service={s} />}
              />
            ))}

            {/* SEO landing variants — not in SERVICES, so routed explicitly.
                /uae-vat-registration is a duplicate of /vat-registration-services
                on the live site, so it renders the same page. */}
            <Route
              path="/uae-corporate-tax-registration"
              element={<CorporateTaxLanding data={CORPORATE_TAX_CONSULTANT} />}
            />
            <Route path="/uae-vat-registration" element={<VatRegistrationPage carouselReviews />} />
            <Route path="/file-corporate-tax-return" element={<CtFilingPage />} />
            <Route path="/corporate-tax-filing-uae" element={<CorporateTaxFilingUae />} />

            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </Suspense>

      <FloatingActions />
    </>
  )
}
