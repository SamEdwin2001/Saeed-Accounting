import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App, { preloadRoute } from './App.jsx'
import './styles.css'

const root = document.getElementById('root')

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

/**
 * Hydrate the prerendered markup; mount fresh only when there is none.
 *
 * createRoot() throws the server's HTML away and renders from scratch. Every
 * page is behind React.lazy, so that left the Suspense fallback — an empty
 * div — on screen until the route's chunk arrived: the page looked blank until
 * you reloaded it, which served the prerendered copy again.
 *
 * hydrateRoot() adopts the existing markup instead, so the content stays put
 * while the chunk loads. Routes rendered per request (/blog, /blog/<slug>) and
 * any route without a prerendered file still have an empty #root, and those
 * keep the original path.
 */
if (root.firstChild) {
  /* Wait for this route's chunk before hydrating: React compares the server's
     markup against the client's first render, and without the chunk that first
     render is the Suspense fallback — a mismatch, which throws the markup away
     and puts the blank screen back. */
  preloadRoute(window.location.pathname)
    .catch(() => {})
    .then(() => ReactDOM.hydrateRoot(root, app))
} else {
  ReactDOM.createRoot(root).render(app)
}
