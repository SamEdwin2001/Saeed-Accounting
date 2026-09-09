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

/* Routes whose content comes from the database, so a build-time render would
   freeze whatever posts existed at deploy. server.js renders these per request
   from the live rows instead. */
const DYNAMIC = new Set(['blog'])

/* Keyed without a leading slash, '' being the homepage — the same shape the
   admin panel and server.js use. */
const ROUTES = Object.keys(ROUTE_SEO).filter((r) => !DYNAMIC.has(r))

const shell = readFileSync(join(DIST, 'index.html'), 'utf8')
const MARKER = '<div id="root"></div>'

if (!shell.includes(MARKER)) {
  console.error('prerender: dist/index.html has no empty #root to fill — run vite build first')
  process.exit(1)
}

/* Keep the untouched shell beside the filled one.
   /blog and /blog/<slug> are rendered per request from the database, and that
   code injects the post into an empty #root — which dist/index.html no longer
   has once the homepage is written into it. server.js reads this copy for those
   routes instead. */
writeFileSync(join(DIST, 'shell.html'), shell, 'utf8')

/* Elements whose text is significant: a newline added inside one of these is
   rendered, so they are emitted on a single line whatever their length. */
const INLINE = new Set([
  'a', 'abbr', 'b', 'br', 'button', 'cite', 'code', 'em', 'i', 'img', 'input',
  'label', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u',
])

/* Void elements never take a closing tag, so they must not open a level. */
const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr',
])

/**
 * Indent renderToString's output so view-source is readable.
 *
 * React emits the whole tree on one line, which is right for the wire and
 * unreadable for a person — and reading it is the reason these files exist.
 *
 * Whitespace-only changes, and only between block-level tags: adding a newline
 * inside a <span> or <a> would put a space into the rendered text, so those
 * subtrees are left on one line. Text nodes are never touched.
 */
const formatHtml = (html) => {
  /* Split into tags and the text between them; keep both. */
  const tokens = html.split(/(<[^>]+>)/).filter((t) => t !== '')
  const out = []
  let depth = 0
  /* >0 while inside an inline element, where newlines would be rendered. */
  let inline = 0

  const pad = () => '  '.repeat(depth)

  for (const token of tokens) {
    if (!token.startsWith('<')) {
      /* A text node. Inside inline content it stays put; elsewhere it goes on
         its own line, trimmed — the trim is safe because a block element's
         leading and trailing whitespace is not rendered. */
      if (inline > 0) out.push(token)
      else if (token.trim()) out.push(`\n${pad()}${token.trim()}`)
      continue
    }

    const name = (token.match(/^<\/?([a-zA-Z0-9-]+)/) || [])[1]?.toLowerCase()
    const closing = token.startsWith('</')
    const selfClosing = token.endsWith('/>') || VOID.has(name)

    if (inline > 0) {
      /* Everything inside an inline element rides on the same line. */
      out.push(token)
      if (INLINE.has(name) && !selfClosing) inline += closing ? -1 : 1
      continue
    }

    if (closing) {
      depth = Math.max(0, depth - 1)
      out.push(`\n${pad()}${token}`)
      continue
    }

    out.push(`\n${pad()}${token}`)
    if (selfClosing) continue
    if (INLINE.has(name)) inline = 1
    else depth += 1
  }

  return out.join('').replace(/^\n/, '')
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

  /* Indented to match the shell's own two-space body indent. */
  const pretty = formatHtml(`<div id="root">${markup}</div>`)
    .split('\n')
    .map((line, i) => (i === 0 ? line : `    ${line}`))
    .join('\n')

  const html = shell.replace(MARKER, pretty)

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
