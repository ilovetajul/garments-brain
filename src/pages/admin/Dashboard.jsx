import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Eye, PenSquare, TrendingUp, Plus, ArrowRight, BookOpen, Users } from 'lucide-react'
import { blogApi } from '@/lib/supabase'
import { DUMMY_POSTS } from '@/data/seed'
import { Spinner, CatBadge } from '@/components/ui'
import { format } from 'date-fns'

export default function Dashboard() {
  const [posts, setPosts] = useState([])
  const [loading, setL]   = useState(true)

  useEffect(() => {
    (async () => {
      try   { setPosts(await blogApi.getAll()) }
      catch { setPosts(DUMMY_POSTS) }
      finally { setL(false) }
    })()
  }, [])

  const published = posts.filter(p => p.published)
  const drafts    = posts.filter(p => !p.published)

  const stats = [
    { label: 'Total Posts', val: posts.length,     icon: FileText, color: 'text-navy-600',    bg: 'bg-navy-50' },
    { label: 'Published',   val: published.length, icon: Eye,      color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Drafts',      val: drafts.length,    icon: PenSquare,color: 'text-amber-600',   bg: 'bg-amber-50' },
    { label: 'Readers',     val: '10K+',           icon: Users,    color: 'text-brand-orange', bg: 'bg-orange-50' },
  ]

  return (
    <div className="space-y-5 sm:space-y-7 animate-fade-in fill-both pb-4">

      {/* Welcome */}
      <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-navy-800">Good morning 👋</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Garments Brain Admin Dashboard</p>
        </div>
        <Link to="/admin/new" className="btn btn-primary btn-sm">
          <Plus size={14} /> New Post
        </Link>
      </div>

      {/* Stats — 2×2 grid on mobile, 4-col on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {stats.map(s => (
          <div key={s.label} className="card p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={17} className={s.color} />
              </div>
              <TrendingUp size={13} className="text-emerald-400" />
            </div>
            <div className="font-display font-bold text-2xl sm:text-3xl text-navy-800">
              {loading ? '—' : s.val}
            </div>
            <div className="text-slate-400 text-xs sm:text-sm mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
        {[
          { icon: PenSquare, label: 'Write New Post',   sub: 'Create and publish', to: '/admin/new',   primary: true },
          { icon: FileText,  label: 'Manage Posts',     sub: 'Edit or delete',     to: '/admin/posts', primary: false },
          { icon: BookOpen,  label: 'View Public Site', sub: 'See live site',      to: '/',            primary: false },
        ].map(a => (
          <Link key={a.label} to={a.to}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all active:scale-[0.98] ${
              a.primary
                ? 'bg-navy-800 border-navy-700 hover:bg-navy-700 text-white'
                : 'bg-white border-slate-200 hover:shadow-card'
            }`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.primary ? 'bg-white/10' : 'bg-slate-100'}`}>
              <a.icon size={18} className={a.primary ? 'text-white' : 'text-navy-600'} />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`font-semibold text-sm ${a.primary ? 'text-white' : 'text-navy-800'}`}>{a.label}</div>
              <div className={`text-xs mt-0.5 ${a.primary ? 'text-navy-300' : 'text-slate-400'}`}>{a.sub}</div>
            </div>
            <ArrowRight size={14} className={a.primary ? 'text-navy-300 shrink-0' : 'text-slate-300 shrink-0'} />
          </Link>
        ))}
      </div>

      {/* Recent posts */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100">
          <h2 className="font-display font-semibold text-navy-800 text-sm sm:text-base">Recent Posts</h2>
          <Link to="/admin/posts" className="text-brand-orange hover:underline text-xs sm:text-sm font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12"><Spinner /></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {posts.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3 px-4 sm:px-6 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-navy-50 shrink-0">
                  {p.image_url
                    ? <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-base">📰</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-navy-800 text-xs sm:text-sm truncate">{p.title}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`badge text-[10px] ${p.published ? 'badge-live' : 'badge-slate'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {p.created_at ? format(new Date(p.created_at), 'MMM d') : ''}
                    </span>
                  </div>
                </div>
                <Link to={`/admin/edit/${p.id}`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-navy-600 transition-colors shrink-0">
                  <PenSquare size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
