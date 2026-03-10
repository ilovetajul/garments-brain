import { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { Brain, LayoutDashboard, FileText, PenSquare, LogOut, Menu, X, ChevronRight, Layers } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/posts',     icon: FileText,        label: 'Manage Posts' },
  { to: '/admin/steps',     icon: Layers,          label: 'Mfg Steps' },
  { to: '/admin/new',       icon: PenSquare,       label: 'New Post' },
]

function SidebarContent({ onClose }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const doSignOut = async () => {
    await signOut()
    toast.success('Signed out.')
    navigate('/')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-navy-700 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-brand-orange flex items-center justify-center shrink-0">
          <Brain size={18} className="text-white" />
        </div>
        <div>
          <div className="font-display font-bold text-white text-sm">Garments Brain</div>
          <div className="text-navy-400 text-[9px] tracking-wider uppercase">Admin CMS</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-navy-400 hover:text-white p-1">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 py-4 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}>
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 pb-5 pt-3 border-t border-navy-700 space-y-1.5 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-brand-orange flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold truncate">{user?.email}</div>
            <div className="text-navy-400 text-[10px]">Administrator</div>
          </div>
        </div>
        <button onClick={doSignOut}
          className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-900/20">
          <LogOut size={15} /> Sign Out
        </button>
        <Link to="/" onClick={onClose} className="sidebar-link text-navy-400 text-xs">
          <ChevronRight size={13} className="rotate-180" /> Back to Site
        </Link>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [sideOpen, setSideOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-navy-900 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-navy-900 flex flex-col overflow-y-auto">
            <SidebarContent onClose={() => setSideOpen(false)} />
          </div>
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setSideOpen(false)} />
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 h-16 shrink-0 gap-3">
          <button onClick={() => setSideOpen(true)}
            className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-colors">
            <Menu size={20} className="text-slate-600" />
          </button>
          <span className="font-display font-bold text-navy-800 text-sm sm:text-base">Admin Dashboard</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-navy-100 flex items-center justify-center font-display font-bold text-navy-700 text-sm">
              A
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
