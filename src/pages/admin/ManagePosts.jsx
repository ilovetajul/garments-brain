import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PenSquare, Trash2, Eye, EyeOff, Plus, Search, X, ExternalLink, MoreVertical } from 'lucide-react'
import { blogApi } from '@/lib/supabase'
import { DUMMY_POSTS } from '@/data/seed'
import { Spinner, Empty, CatBadge, ConfirmModal } from '@/components/ui'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import clsx from 'clsx'

export default function ManagePosts() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ]             = useState('')
  const [delId, setDelId]     = useState(null)
  const [delBusy, setDelBusy] = useState(false)
  const [togglingId, setTogglingId] = useState(null)
  const [menuId, setMenuId]   = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try   { setPosts(await blogApi.getAll()) }
    catch { setPosts(DUMMY_POSTS) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = posts.filter(p =>
    !q.trim() || [p.title, p.category, p.author].some(f => f?.toLowerCase().includes(q.toLowerCase()))
  )

  const handleDelete = async () => {
    setDelBusy(true)
    try {
      await blogApi.delete(delId)
      setPosts(ps => ps.filter(p => p.id !== delId))
      toast.success('Post deleted.')
    } catch { toast.error('Could not delete post.') }
    finally { setDelBusy(false); setDelId(null) }
  }

  const handleToggle = async (post) => {
    setTogglingId(post.id); setMenuId(null)
    try {
      await blogApi.update(post.id, { published: !post.published })
      setPosts(ps => ps.map(p => p.id === post.id ? { ...p, published: !p.published } : p))
      toast.success(post.published ? 'Unpublished.' : 'Published!')
    } catch { toast.error('Could not update status.') }
    finally { setTogglingId(null) }
  }

  return (
    <div className="space-y-5 animate-fade-in fill-both">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-navy-800">Manage Posts</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">{posts.length} total posts</p>
        </div>
        <Link to="/admin/new" className="btn btn-primary btn-sm">
          <Plus size={14} /> New Post
        </Link>
      </div>

      {/* Search */}
      <div className="card p-3 sm:p-4">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search posts…" className="form-input pl-10 pr-9" />
          {q && (
            <button onClick={() => setQ('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 flex items-center justify-center">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── MOBILE: Card list ── */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner size={32} /></div>
        ) : filtered.length === 0 ? (
          <Empty icon={PenSquare} title="No posts found"
            action={<Link to="/admin/new" className="btn btn-primary btn-sm">Write first post</Link>} />
        ) : (
          filtered.map(post => (
            <div key={post.id} className="card p-4">
              <div className="flex items-start gap-3">
                {/* Thumb */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-navy-50 shrink-0">
                  {post.image_url
                    ? <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xl">📰</div>
                  }
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy-800 text-sm leading-snug line-clamp-2 mb-1.5">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <CatBadge category={post.category} className="text-[10px]" />
                    <span className={`badge text-[10px] ${post.published ? 'badge-live' : 'badge-slate'}`}>
                      {post.published ? '● Published' : '○ Draft'}
                    </span>
                  </div>
                </div>
                {/* Menu button */}
                <div className="relative shrink-0">
                  <button onClick={() => setMenuId(menuId === post.id ? null : post.id)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 active:bg-slate-200 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                  {menuId === post.id && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-card-hover border border-slate-100 overflow-hidden z-10 animate-scale-in fill-both">
                      <Link to={`/admin/edit/${post.id}`} onClick={() => setMenuId(null)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-100">
                        <PenSquare size={14} className="text-navy-500" /> Edit
                      </Link>
                      <button onClick={() => handleToggle(post)}
                        disabled={togglingId === post.id}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-100">
                        {post.published
                          ? <><EyeOff size={14} className="text-amber-500" /> Unpublish</>
                          : <><Eye size={14} className="text-emerald-500" /> Publish</>
                        }
                      </button>
                      {post.published && post.slug && (
                        <Link to={`/blog/${post.slug}`} target="_blank" onClick={() => setMenuId(null)}
                          className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-100">
                          <ExternalLink size={14} className="text-blue-500" /> View Post
                        </Link>
                      )}
                      <button onClick={() => { setDelId(post.id); setMenuId(null) }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Date */}
              <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
                {post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : '—'}
              </p>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP: Table ── */}
      <div className="hidden sm:block card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Spinner size={32} /></div>
        ) : filtered.length === 0 ? (
          <Empty icon={PenSquare} title="No posts found"
            action={<Link to="/admin/new" className="btn btn-primary btn-sm">Write your first post</Link>} />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(post => (
                  <tr key={post.id}>
                    <td className="max-w-[260px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-navy-50 shrink-0">
                          {post.image_url
                            ? <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-sm">📰</div>
                          }
                        </div>
                        <span className="font-medium text-navy-800 truncate text-sm">{post.title}</span>
                      </div>
                    </td>
                    <td><CatBadge category={post.category} className="text-[10px]" /></td>
                    <td>
                      <button onClick={() => handleToggle(post)}
                        disabled={togglingId === post.id}
                        className={clsx(
                          'badge transition-all cursor-pointer hover:opacity-80',
                          post.published ? 'badge-live' : 'badge-slate',
                          togglingId === post.id && 'opacity-50 cursor-not-allowed',
                        )}>
                        {togglingId === post.id ? '…' : post.published ? '● Published' : '○ Draft'}
                      </button>
                    </td>
                    <td className="text-slate-400 text-xs whitespace-nowrap">
                      {post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : '—'}
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        {post.published && post.slug && (
                          <Link to={`/blog/${post.slug}`} target="_blank" className="btn btn-ghost btn-icon" title="View">
                            <ExternalLink size={14} />
                          </Link>
                        )}
                        <Link to={`/admin/edit/${post.id}`} className="btn btn-ghost btn-icon text-navy-600">
                          <PenSquare size={14} />
                        </Link>
                        <button onClick={() => setDelId(post.id)} className="btn btn-ghost btn-icon text-red-500 hover:bg-red-50">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {delId && (
        <ConfirmModal
          title="Delete Post"
          message="This will permanently delete the post. Cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDelId(null)}
          loading={delBusy}
        />
      )}
    </div>
  )
}
