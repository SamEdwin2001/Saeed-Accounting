import { useState } from 'react'
import { api, setToken } from './api.js'

export default function Login({ onSignedIn }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const { token, username: name } = await api.login(username, password)
      setToken(token)
      onSignedIn(name)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="adm-login">
      <form className="adm-login__card" onSubmit={onSubmit}>
        <span className="adm-login__mark">SA</span>
        <h1 className="adm-login__title">Saeed Accounting</h1>
        <p className="adm-login__sub">Sign in to the dashboard</p>

        {error && (
          <p className="adm-alert" role="alert">
            {error}
          </p>
        )}

        <label className="adm-field">
          <span>Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            required
          />
        </label>

        <label className="adm-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button className="adm-btn adm-btn--primary" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
