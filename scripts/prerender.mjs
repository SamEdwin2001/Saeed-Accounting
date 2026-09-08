/**
 * Writes dist/<route>/index.html for every static route, with the page's markup
 * already in it.
 *
 * Vite ships one shell for the whole site, so `view-source` on any route showed
 * `<div id="root"></div>` and nothing else — the copy only existed once React
 * had run. That is fine for a browser and bad for everything that reads HTML
 * without executing it.
 *
 * Rendering at build time rather than per request: these routes are the same
 * for every visitor and change only when the code does, so there is nothing to
 * recompute on a request. server.js already prefers dist/<path>/index.html over
 * the shell, so writing the files is the whole integration.
 *
 * /blog and /blog/<slug> are deliberately absent — their content lives in the
 * database and is rendered per request in server.js.
 *
 * Run: node scripts/prerender.mjs   (part of `npm run build`)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { build } from 'vite'

/* Compile the app for Node first. Vite's SSR build applies the same JSX and CSS
   handling as the client build and resolves the CommonJS dependencies (React,
   react-router) the way Node expects — which its dev-time SSR loader does not.
   Written to a temp directory that is not served. */
const SSR_OUT = 'dist-ssr'

await build({
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: SSR_OUT,
    emptyOutDir: true,
  },
})

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')

const { render } = await import(
  pathToFileURL(join(__dirname, '..', SSR_OUT, 'entry-server.js')).href
)
const { ROUTE_SEO } = await import(
  pathToFileURL(join(__dirname, '..', 'src', 'data', 'seo.js')).href
)

/* Keyed without a leading slash, '' being the homepage — the same shape the
   admin panel and server.js use. */
const ROUTES = Object.keys(ROUTE_SEO)

const shell = readFileSync(join(DIST, 'index.html'), 'utf8')
const MARKER = '<div id="root"></div>'

if (!shell.includes(MARKER)) {
  console.error('prerender: dist/index.html has no empty #root to fill — run vite build first')
  process.exit(1)
}

let written = 0
let failed = 0

for (const route of ROUTES) {
  const url = `/${route}`

  let markup
  try {
    markup = await render(url)
  } catch (err) {
    /* One route that throws must not cost the other twenty-four theirs: leave
       it to the SPA shell, which still renders correctly in a browser. */
    console.error(`prerender: skipped ${url} — ${err.message}`)
    failed += 1
    continue
  }

  const html = shell.replace(MARKER, `<div id="root">${markup}</div>`)

  /* The homepage is dist/index.html itself; every other route gets its own
     directory so a static host resolves /about-us to about-us/index.html. */
  const out = route === '' ? join(DIST, 'index.html') : join(DIST, route, 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html, 'utf8')
  written += 1
}

console.log(
  `prerender: wrote ${written} route${written === 1 ? '' : 's'}` +
    (failed ? `, skipped ${failed}` : '')
)
