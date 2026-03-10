import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Brain, Lock, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import clsx from 'clsx'

const LINKS = [
  { to: '/',                  label: 'Home' },
  { to: '/knowledge-library', label: 'Library' },
  { to: '/glossary',          label: 'Glossary' },
  { to: '/tools',             label: 'Tools' },
  { to: '/courses',           label: 'Courses' },
  { to: '/contact',           label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen]   = useState(false)
  const [solid, setSolid] = useState(false)
  const { user, signOut } = useAuth()
  const navigate          = useNavigate()

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 16)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close drawer on route change
  useEffect(() => { setOpen(false) }, [navigate])

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const doSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <>
      <header className={clsx(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        solid ? 'bg-navy-950/97 backdrop-blur-md shadow-glow' : 'bg-navy-800',
      )}>
        <nav className="container-app">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0" onClick={() => setOpen(false)}>
              <div className="w-9 h-9 rounded-xl bg-brand-orange flex items-center justify-center shadow-glow-orange">
                <Brain size={19} className="text-white" />
              </div>
              <div className="leading-none">
                <div className="font-display font-bold text-white text-[16px] tracking-tight">Garments Brain</div>
                <div className="text-navy-300 text-[9px] tracking-[2px] uppercase mt-0.5 hidden sm:block">Industry Platform</div>
              </div>
            </Link>

            {/* Desktop links */}
            <ul className="hidden lg:flex items-center gap-0.5">
              {LINKS.map(l => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.to === '/'}
                    className={({ isActive }) => clsx(
                      'px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive ? 'bg-brand-orange text-white' : 'text-navy-200 hover:text-white hover:bg-navy-700',
                    )}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right */}
            <div className="flex items-center gap-2">
              {user ? (
                <div className="hidden lg:flex items-center gap-2">
                  <Link to="/admin/dashboard" className="btn btn-ghost text-navy-200 hover:text-white hover:bg-navy-700 btn-sm gap-1.5">
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                  <button onClick={doSignOut} className="btn btn-ghost text-navy-300 hover:text-white btn-sm">
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <Link to="/admin/login"
                  className="hidden lg:inline-flex items-center gap-2 btn btn-primary btn-sm">
                  <Lock size={13} /> Admin
                </Link>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setOpen(v => !v)}
                className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl text-white hover:bg-navy-700 active:bg-navy-600 transition-colors"
                aria-label="Menu">
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col bg-navy-900">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-navy-700 bg-navy-950 shrink-0">
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center">
                <Brain size={17} className="text-white" />
              </div>
              <span className="font-display font-bold text-white text-[15px]">Garments Brain</span>
            </Link>
            <button onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-xl text-white hover:bg-navy-700 flex items-center justify-center">
              <X size={22} />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
            {LINKS.map((l, i) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) => clsx(
                  'flex items-center px-5 py-4 rounded-2xl text-base font-semibold transition-all',
                  'fill-both animate-slide-right',
                  isActive ? 'bg-brand-orange text-white' : 'text-navy-200 hover:text-white hover:bg-navy-700 active:bg-navy-600',
                )}
                style={{ animationDelay: `${i * 50}ms` }}>
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Bottom auth */}
          <div className="px-4 pb-8 pt-4 border-t border-navy-700 space-y-3 shrink-0">
            {user ? (
              <>
                <Link to="/admin/dashboard" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-navy-700 text-white text-base font-semibold">
                  <LayoutDashboard size={18} /> Admin Dashboard
                </Link>
                <button onClick={() => { doSignOut(); setOpen(false) }}
                  className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-red-400 bg-red-900/20 text-base font-semibold">
                  <LogOut size={18} /> Sign Out
                </button>
              </>
            ) : (
              <Link to="/admin/login" onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 btn btn-primary w-full btn-lg">
                <Lock size={16} /> Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}
