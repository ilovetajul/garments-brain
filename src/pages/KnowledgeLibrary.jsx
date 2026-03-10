import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, BookOpen, SlidersHorizontal } from 'lucide-react'
import PostCard from '@/components/blog/PostCard'
import { PageLoader, Empty, CatBadge } from '@/components/ui'
import { blogApi } from '@/lib/supabase'
import { DUMMY_POSTS, CATEGORIES } from '@/data/seed'

export default function KnowledgeLibrary() {
  const [params, setParams] = useSearchParams()
  const [posts, setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ]           = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const cat = params.get('cat') || 'All'

  useEffect(() => {
    (async () => {
      setLoading(true)
      try   { setPosts(await blogApi.getPublished()) }
      catch { setPosts(DUMMY_POSTS) }
      finally { setLoading(false) }
    })()
  }, [])

  const setCat = c => {
    if (c === 'All') params.delete('cat'); else params.set('cat', c)
    setParams(params)
    setShowFilter(false)
  }

  const shown = useMemo(() => {
    let r = posts
    if (cat !== 'All') r = r.filter(p => p.category === cat)
    if (q.trim()) {
      const lq = q.toLowerCase()
      r = r.filter(p => [p.title, p.excerpt, p.category, p.author].some(f => f?.toLowerCase().includes(lq)))
    }
    return r
  }, [posts, cat, q])

  const usedCats = ['All', ...CATEGORIES.filter(c => posts.some(p => p.category === c))]

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-950 to-navy-800 bg-grid-navy py-12 sm:py-16">
        <div className="container-app text-center">
          <div className="eyebrow text-orange-400 justify-center mb-3">
            <span className="w-5 h-0.5 bg-orange-400 rounded" /> Knowledge Library <span className="w-5 h-0.5 bg-orange-400 rounded" />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-3">
            Industry Guides & Articles
          </h1>
          <p className="text-navy-300 text-sm sm:text-base max-w-xl mx-auto mb-4">
            Expert-written guides on QC, fabric, POM, embroidery, and sustainability.
          </p>
          <div className="flex items-center justify-center gap-2 text-navy-400 text-xs sm:text-sm">
            <BookOpen size={13} className="text-orange-400" />
            <span>{posts.length} articles · {CATEGORIES.length} categories</span>
          </div>
        </div>
      </div>

      <div className="container-app py-6 sm:py-10">
        {/* Search + filter row */}
        <div className="flex gap-3 mb-5 sm:mb-7">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="Search articles…" className="form-input pl-10 pr-9" />
            {q && (
              <button onClick={() => setQ('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 flex items-center justify-center">
                <X size={14} />
              </button>
            )}
          </div>
          {/* Mobile filter button */}
          <button onClick={() => setShowFilter(v => !v)}
            className={`sm:hidden btn border flex items-center gap-2 btn-sm shrink-0 ${showFilter || cat !== 'All' ? 'btn-navy' : 'btn-ghost border-slate-200'}`}>
            <SlidersHorizontal size={14} />
            {cat !== 'All' ? cat.split(' ')[0] : 'Filter'}
          </button>
        </div>

        {/* Desktop category chips */}
        <div className="hidden sm:flex flex-wrap gap-2 mb-7">
          {usedCats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`text-xs font-semibold px-3.5 py-2 rounded-full border transition-all duration-200 ${
                cat === c ? 'bg-navy-800 text-white border-navy-800' : 'bg-white text-slate-600 border-slate-200 hover:border-navy-400'
              }`}>{c}</button>
          ))}
        </div>

        {/* Mobile filter dropdown */}
        {showFilter && (
          <div className="sm:hidden grid grid-cols-2 gap-2 mb-5 p-4 bg-white rounded-2xl border border-slate-200 shadow-card animate-fade-up fill-both">
            {usedCats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`text-xs font-semibold px-3 py-2.5 rounded-xl border text-left transition-all ${
                  cat === c ? 'bg-navy-800 text-white border-navy-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}>{c}</button>
            ))}
          </div>
        )}

        {/* Active filter pill */}
        {cat !== 'All' && (
          <div className="flex items-center gap-2 mb-5">
            <span className="text-sm text-slate-500">Filtered:</span>
            <button onClick={() => setCat('All')}
              className="flex items-center gap-1.5 badge badge-navy text-xs">
              {cat} <X size={11} />
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? <PageLoader /> : shown.length === 0 ? (
          <Empty icon={BookOpen} title="No articles found"
            desc="Try a different search or category."
            action={
              <button onClick={() => { setQ(''); setCat('All') }}
                className="btn btn-outline btn-sm">Clear filters</button>
            }
          />
        ) : (
          <>
            {/* Featured post */}
            {!q && cat === 'All' && (
              <div className="mb-5 sm:mb-6">
                <PostCard post={shown[0]} featured />
              </div>
            )}
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {(q || cat !== 'All' ? shown : shown.slice(1)).map(p => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
