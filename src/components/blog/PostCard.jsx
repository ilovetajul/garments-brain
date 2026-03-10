import { Link } from 'react-router-dom'
import { Clock, User, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { CatBadge } from '@/components/ui'

export default function PostCard({ post, featured = false }) {
  const readTime = Math.max(2, Math.ceil((post.content?.length || 600) / 1200))

  if (featured) {
    return (
      <Link to={`/blog/${post.slug}`}
        className="group flex flex-col sm:grid sm:grid-cols-5 card-lift overflow-hidden rounded-2xl">
        {/* Image */}
        <div className="relative sm:col-span-3 h-52 sm:h-auto overflow-hidden bg-navy-100 shrink-0">
          {post.image_url
            ? <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
            : <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-5xl opacity-20">📰</div>
          }
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/20 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="badge bg-brand-orange text-white text-[10px] px-2.5 py-1 font-semibold">✦ Featured</span>
          </div>
        </div>
        {/* Body */}
        <div className="sm:col-span-2 p-5 sm:p-7 flex flex-col justify-center gap-3">
          <CatBadge category={post.category} />
          <h2 className="font-display font-bold text-navy-800 text-lg sm:text-xl leading-snug group-hover:text-brand-orange transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 hidden sm:block">{post.excerpt}</p>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 sm:hidden">{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><User size={11} /> {post.author}</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {readTime} min</span>
            </div>
            <span className="flex items-center gap-1 text-brand-orange font-semibold group-hover:gap-2 transition-all">
              Read <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/blog/${post.slug}`}
      className="group card-lift flex flex-col overflow-hidden rounded-2xl active:scale-[0.98] transition-all">
      {/* Thumb */}
      <div className="relative h-44 overflow-hidden bg-navy-50 shrink-0">
        {post.image_url
          ? <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
          : <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center text-4xl opacity-20">📰</div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
      {/* Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <CatBadge category={post.category} />
          <span className="ml-auto text-xs text-slate-400 flex items-center gap-1 shrink-0"><Clock size={11} /> {readTime} min</span>
        </div>
        <h3 className="font-display font-bold text-navy-800 text-[15px] leading-snug group-hover:text-brand-orange transition-colors line-clamp-2 mb-2 flex-1">
          {post.title}
        </h3>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-400 flex items-center gap-1"><User size={11} /> {post.author}</span>
          <span className="text-brand-orange font-semibold flex items-center gap-1">Read more <ArrowRight size={11} /></span>
        </div>
      </div>
    </Link>
  )
}
