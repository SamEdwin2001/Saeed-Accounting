import { useEffect, useState } from 'react'
import { api, getToken, clearToken } from './api.js'
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'
import './admin.css'

export default function AdminApp() {
  const [username, setUsername] = useState(null)
  const [checking, setChecking] = useState(true)

  /* A token in localStorage isn't proof of a valid session — it may have
     expired or been signed with an old secret. Verify before trusting it. */
  useEffect(() => {
    if (!getToken()) {
      setChecking(false)
      return
    }
    api
      .me()
      .then((u) => setUsername(u.username))
      .catch(() => clearToken())
      .finally(() => setChecking(false))
  }, [])

  /* api.js fires this when any request 401s mid-session. */
  useEffect(() => {
    const onSignedOut = () => setUsername(null)
    window.addEventListener('admin:signed-out', onSignedOut)
    return () => window.removeEventListener('admin:signed-out', onSignedOut)
  }, [])

  if (checking) return <div className="adm-boot">Loading…</div>

  return username ? (
    <Dashboard username={username} onSignOut={() => setUsername(null)} />
  ) : (
    <Login onSignedIn={setUsername} />
  )
}
