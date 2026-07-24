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
}
