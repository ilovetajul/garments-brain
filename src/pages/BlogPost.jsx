import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, User, Calendar, Share2, ChevronRight, BookOpen, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { blogApi } from '@/lib/supabase'
import { DUMMY_POSTS } from '@/data/seed'
import { PageLoader, CatBadge, Prose } from '@/components/ui'
import PostCard from '@/components/blog/PostCard'

export default function BlogPost() {
  const { slug }          = useParams()
  const navigate          = useNavigate()
  const [post, setPost]   = useState(null)
  const [related, setRel] = useState([])
  const [loading, setLoad]= useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    ;(async () => {
      setLoad(true)
      try {
        const p = await blogApi.getBySlug(slug)
        setPost(p)
        const all = await blogApi.getPublished()
        setRel(all.filter(x => x.slug !== slug && x.category === p.category).slice(0, 3))
      } catch {
        const p = DUMMY_POSTS.find(b => b.slug === slug)
        if (!p) { navigate('/knowledge-library'); return }
        setPost(p)
        setRel(DUMMY_POSTS.filter(x => x.slug !== slug && x.category === p.category).slice(0, 3))
      } finally { setLoad(false) }
    })()
  }, [slug, navigate])

  if (loading) return <div className="pt-16"><PageLoader /></div>
  if (!post)   return null

  const rt   = Math.max(2, Math.ceil((post.content?.length || 600) / 1200))
  const date = post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : ''

  const share = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="pt-16 min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container-app py-2.5">
          <nav className="flex items-center gap-1 text-xs text-slate-400 overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link to="/" className="hover:text-navy-700 transition-colors shrink-0">Home</Link>
            <ChevronRight size={10} className="shrink-0" />
            <Link to="/knowledge-library" className="hover:text-navy-700 transition-colors shrink-0">Library</Link>
            <ChevronRight size={10} className="shrink-0" />
            <span className="text-navy-700 font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-app py-5 sm:py-8">
        <div className="max-w-3xl mx-auto">

          {/* Back */}
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-navy-800 text-sm font-medium mb-5 group transition-colors active:scale-95">
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>

          {/* Category + meta */}
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <CatBadge category={post.category} />
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={11} /> {rt} min read
            </span>
            {date && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar size={11} /> {date}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-navy-900 leading-tight mb-4">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-base sm:text-xl text-slate-600 leading-relaxed border-l-4 border-brand-orange pl-4 py-2 bg-orange-50 rounded-r-xl mb-5">
              {post.excerpt}
            </p>
          )}

          {/* Author row */}
          <div className="flex items-center justify-between py-3.5 border-y border-slate-100 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-navy-100 flex items-center justify-center font-display font-bold text-navy-700 text-sm shrink-0">
                {(post.author || 'A')[0]}
              </div>
              <div>
                <div className="font-semibold text-navy-800 text-sm">{post.author || 'Garments Brain'}</div>
                <div className="text-slate-400 text-xs">Industry Expert</div>
              </div>
            </div>
            <button onClick={share}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-navy-700 border border-slate-200 hover:border-navy-300 px-3 py-2 rounded-xl transition-all active:scale-95">
              <Share2 size={12} />
              {copied ? <><CheckCircle size={12} className="text-emerald-500" /> Copied!</> : 'Share'}
            </button>
          </div>

          {/* Hero image */}
          {post.image_url && (
            <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden shadow-card">
              <img src={post.image_url} alt={post.title}
                className="w-full h-48 sm:h-72 md:h-96 object-cover" loading="lazy" />
            </div>
          )}

          {/* Content */}
          <Prose content={post.content} />

          {/* Footer */}
          <div className="flex items-center gap-2 mt-8 pt-5 border-t border-slate-100">
            <span className="text-slate-400 text-sm">Category:</span>
            <CatBadge category={post.category} />
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-slate-100">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-navy-800 flex items-center gap-2 mb-6">
              <BookOpen size={20} className="text-brand-orange" /> Related Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map(r => <PostCard key={r.id} post={r} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
