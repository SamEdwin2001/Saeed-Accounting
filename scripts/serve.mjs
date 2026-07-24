/**
 * Static server for the prerendered dist/.
 *
 * `vite preview` applies its SPA fallback before looking for a nested
 * index.html, so every route was served the prerendered *homepage* and React
 * then had to correct it client-side. This resolves /route to
 * dist/route/index.html first, which is what a real static host does.
 */
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')
const PORT = Number(process.argv[2] ?? 5173)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
}

const isFile = (p) => existsSync(p) && statSync(p).isFile()

const resolve = (urlPath) => {
  const direct = join(DIST, urlPath)
  if (extname(direct) && isFile(direct)) return direct // asset

  const nested = join(DIST, urlPath, 'index.html') // prerendered route
  if (isFile(nested)) return nested

  return join(DIST, 'index.html') // SPA fallback
}

/* Text assets must go out compressed — every real static host does this, and
   without it the prerendered HTML ships ~5x larger and wrecks FCP. */
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg'])

createServer(async (req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0])
  const file = resolve(urlPath)
  try {
    let body = await readFile(file)
    const ext = extname(file)
    const headers = {
      'Content-Type': MIME[ext] ?? 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000',
    }

    if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
      body = gzipSync(body)
      headers['Content-Encoding'] = 'gzip'
      headers.Vary = 'Accept-Encoding'
    }

    headers['Content-Length'] = body.length
    res.writeHead(200, headers)
    res.end(body)
  } catch {
    res.writeHead(404)
    res.end('not found')
  }
}).listen(PORT, () => console.log(`serving dist on http://localhost:${PORT}/`))
