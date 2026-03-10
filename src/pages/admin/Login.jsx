import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Eye, EyeOff, Lock, Brain, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [pass, setPass]   = useState('')
  const [show, setShow]   = useState(false)
  const [err, setErr]     = useState('')
  const [busy, setBusy]   = useState(false)
  const { signIn, user }  = useAuth()
  const navigate          = useNavigate()
  const location          = useLocation()
  const from              = location.state?.from?.pathname || '/admin/dashboard'

  if (user) { navigate(from, { replace: true }); return null }

  const submit = async e => {
    e.preventDefault()
    if (!email || !pass) { setErr('Please enter both email and password.'); return }
    setBusy(true); setErr('')
    try {
      const { error } = await signIn(email, pass)
      if (error) throw error
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (e) {
      setErr(e.message || 'Invalid credentials. Please try again.')
    } finally { setBusy(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-800 to-navy-900 bg-grid-navy flex flex-col items-center justify-center p-4">
      {/* Back link */}
      <Link to="/" className="flex items-center gap-2 text-navy-300 hover:text-white text-sm mb-8 transition-colors group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Garments Brain
      </Link>

      <div className="w-full max-w-sm sm:max-w-md animate-fade-up fill-both">
        <div className="bg-white rounded-3xl shadow-glow-orange p-6 sm:p-8">
          {/* Logo */}
          <div className="text-center mb-7">
            <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow-orange">
              <Brain size={28} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-navy-800">Admin Login</h1>
            <p className="text-slate-400 text-sm mt-1">Access the Garments Brain CMS</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="form-label">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@garmentsbrain.com"
                className="form-input" autoComplete="email" autoFocus />
            </div>

            <div>
              <label className="form-label">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="••••••••" className="form-input pr-12"
                  autoComplete="current-password" />
                <button type="button" onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center">
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {err && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                <AlertCircle size={15} className="shrink-0 mt-0.5" /> {err}
              </div>
            )}

            <button type="submit" disabled={busy}
              className="btn btn-primary w-full justify-center btn-lg mt-2">
              {busy ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
              {busy ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="font-semibold text-slate-700 text-xs mb-1">Setup Required</p>
            <p className="text-xs text-slate-500">Configure Supabase credentials in <code className="bg-slate-200 px-1 rounded">.env</code> and create an admin user in the Supabase Auth dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
