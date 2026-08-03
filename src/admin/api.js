/* Vite proxies /api to the Express server in dev (see vite.config.js), so a
   relative base works in both dev and production behind one origin. */
const BASE = import.meta.env.VITE_API_URL || '/api'

const TOKEN_KEY = 'saeed_admin_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    /* Never serve API data from the browser's HTTP cache — after an edit/toggle
       the admin re-fetches and must see the just-saved value, not a stale copy. */
    cache: 'no-store',
  })

  /* An expired token should bounce the user to the login screen rather than
     surfacing as a confusing error inside the dashboard. */
  if (res.status === 401 && auth) {
    clearToken()
    window.dispatchEvent(new Event('admin:signed-out'))
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: { username, password }, auth: false }),
  me: () => request('/auth/me'),

  submitLead: (lead) => request('/leads', { method: 'POST', body: lead, auth: false }),
  listLeads: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    ).toString()
    return request(`/leads${qs ? `?${qs}` : ''}`)
  },
  stats: () => request('/leads/stats'),
  trend: () => request('/leads/trend'),
  setStatus: (id, status) => request(`/leads/${id}`, { method: 'PATCH', body: { status } }),
  remove: (id) => request(`/leads/${id}`, { method: 'DELETE' }),

  /* WhatsApp scheduled-message manager (admin-only CRUD). */
  whatsapp: {
    list: () => request('/whatsapp'),
    create: (data) => request('/whatsapp', { method: 'POST', body: data }),
    update: (id, data) => request(`/whatsapp/${id}`, { method: 'PATCH', body: data }),
    remove: (id) => request(`/whatsapp/${id}`, { method: 'DELETE' }),
  },

  /* Blog. The two `read` calls are public — the website's /blog pages use them
     with no token — while everything under `admin` needs one. */
  blog: {
    list: () => request('/blog/posts', { auth: false }),
    bySlug: (slug) => request(`/blog/posts/${encodeURIComponent(slug)}`, { auth: false }),

    admin: {
      list: () => request('/blog/admin/posts'),
      one: (id) => request(`/blog/admin/posts/${id}`),
      create: (data) => request('/blog/admin/posts', { method: 'POST', body: data }),
      update: (id, data) => request(`/blog/admin/posts/${id}`, { method: 'PATCH', body: data }),
      remove: (id) => request(`/blog/admin/posts/${id}`, { method: 'DELETE' }),
      uploadImage,
    },
  },
}

/**
 * Posts an image file as a raw body typed with its own MIME type, rather than
 * multipart or base64 — the server writes the bytes straight to disk and
 * returns the URL to store on the post. Kept out of `request` because that
 * helper always sends JSON.
 */
async function uploadImage(file) {
  const res = await fetch(`${BASE}/blog/admin/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': file.type,
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: file,
  })

  if (res.status === 401) {
    clearToken()
    window.dispatchEvent(new Event('admin:signed-out'))
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Could not upload that image.')
  return data.url
}
