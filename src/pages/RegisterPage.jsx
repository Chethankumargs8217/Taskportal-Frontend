import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Zap, Mail, Lock, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name || !form.email || !form.password) { setError('All fields are required.'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }

    const res = await register(form.name, form.email, form.password)

    if (res.success) {
      setSuccess('Account created! Redirecting to login…')
      setTimeout(() => navigate('/login'), 1500)
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-ink-950">
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                      rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="w-full max-w-md animate-fade-in">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-glow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-ink-100 tracking-tight">TaskPortal</span>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-ink-50 mb-1">Create account</h1>
          <p className="text-sm text-ink-400 mb-7">Start managing tasks smarter with AI</p>

          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20
                            rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20
                            rounded-xl px-4 py-3 mb-5 text-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input type="text" placeholder="Jane Smith" value={form.name} onChange={set('name')} className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} className="input pl-10" />
              </div>
            </div>
            <button type="submit" disabled={loading || !!success} className="btn-primary w-full justify-center py-3 mt-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
