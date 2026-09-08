/**
 * Server entry for the prerender step.
 *
 * Its own file rather than a branch inside main.jsx: that one calls
 * createRoot() against a real DOM element, which does not exist in Node.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import App from './App.jsx'
import { resetDirhamDefs } from './components/Icons.jsx'
import './styles.css'

/**
 * App.jsx code-splits every page with React.lazy, and renderToString does not
 * wait on a promise — it emits the Suspense fallback and returns. Prerendering
 * that way produced 26 files that all held the same header and nothing else.
 *
 * Importing the page modules here resolves those lazy() promises before the
 * first render, so the route's own markup is what gets written. This module is
 * only ever loaded by the prerender step, so pulling every page into one bundle
 * costs the browser nothing.
 */
const PAGES = [
  import('./pages/Home.jsx'),
  import('./pages/ServicePage.jsx'),
  import('./pages/VatRegistrationPage.jsx'),
  import('./pages/CorporateTaxLanding.jsx'),
  import('./pages/CtFilingPage.jsx'),
  import('./pages/CorporateTaxFilingUae.jsx'),
  import('./pages/AboutPage.jsx'),
  import('./pages/ContactPage.jsx'),
  import('./pages/NotFound.jsx'),
]

export async function warmup() {
  await Promise.all(PAGES)
}

const renderOnce = (url) => {
  /* The AED outline is emitted by the first <Dirham> of a render and skipped by
     the rest. Every pass has to start clean, or the pass that produces the file
     we keep would reference a <symbol> an earlier discarded pass had emitted. */
  resetDirhamDefs()
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  )
}

/**
 * Render until the markup stops changing.
 *
 * Even with the modules imported above, a lazy() component only records its
 * resolved value while React renders it, so the first pass emits the fallback.
 * A fixed two passes was not enough either: a route whose page lazily pulls in
 * further chunks needs one more, which is why some pages came out holding only
 * the header.
 *
 * Rendering in a loop and stopping when two passes agree covers any depth,
 * with a ceiling so a genuinely unresolvable route fails loudly instead of
 * spinning. Each pass is a few milliseconds against a warm module cache.
 */
const MAX_PASSES = 6

export async function render(url) {
  await warmup()

  let markup = renderOnce(url)
  for (let i = 1; i < MAX_PASSES; i += 1) {
    /* Let the promises lazy() just recorded settle before looking again. */
    await new Promise((r) => setImmediate(r))
    const next = renderOnce(url)
    if (next === markup) return markup
    markup = next
  }
  return markup
}
