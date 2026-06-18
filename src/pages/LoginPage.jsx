import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]   = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('All fields are required.'); return }
    const res = await login(form.email, form.password)
    if (res.success) navigate('/')
    else setError(res.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-ink-950">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                      rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-glow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-ink-100 tracking-tight">TaskPortal</span>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-ink-50 mb-1">Welcome back</h1>
          <p className="text-sm text-ink-400 mb-7">Sign in to your workspace</p>

          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20
                            rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input
                  type="email" placeholder="you@example.com"
                  value={form.email} onChange={set('email')}
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input
                  type="password" placeholder="••••••••"
                  value={form.password} onChange={set('password')}
                  className="input pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-500 mt-6">
          No account?{' '}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
