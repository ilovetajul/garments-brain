import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BookOpen, Award, Users, CheckCircle,
  ChevronDown, Calculator, Layers, Shield, Zap, Star, TrendingUp,
} from 'lucide-react'
import PostCard from '@/components/blog/PostCard'
import { SectionHead } from '@/components/ui'
import { DUMMY_POSTS, MFG_STEPS } from '@/data/seed'

/* ─── Accordion item ─── */
function Step({ data, open, onToggle }) {
  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-300 ${open ? 'border-navy-200 shadow-card' : 'border-slate-200'}`}>
      <button onClick={onToggle}
        className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors duration-200 ${open ? 'bg-navy-800 text-white' : 'bg-white hover:bg-slate-50 active:bg-slate-100'}`}
        style={{ minHeight: 64 }}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0 transition-colors ${open ? 'bg-brand-orange text-white' : 'bg-navy-100 text-navy-700'}`}>
          {String(data.step).padStart(2, '0')}
        </div>
        <span className="text-xl shrink-0">{data.icon}</span>
        <div className="flex-1 min-w-0 text-left">
          <div className={`font-display font-bold text-sm sm:text-base ${open ? 'text-white' : 'text-navy-800'}`}>{data.title}</div>
          <div className={`text-xs mt-0.5 truncate ${open ? 'text-navy-300' : 'text-slate-400'}`}>{data.summary}</div>
        </div>
        <ChevronDown size={16} className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-orange-300' : 'text-slate-400'}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="bg-white px-4 py-5 border-t border-slate-100">
          <p className="text-slate-600 text-sm leading-relaxed mb-4">{data.desc}</p>
          <ul className="space-y-2.5">
            {data.points.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle size={14} className="text-brand-orange mt-0.5 shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ─── Feature card ─── */
function FeatCard({ icon: Icon, title, desc, idx }) {
  const S = [
    { wrap: 'bg-navy-800',            icon: 'bg-brand-orange', text: 'text-white',     sub: 'text-navy-300' },
    { wrap: 'bg-brand-orange',        icon: 'bg-white',        text: 'text-white',     sub: 'text-orange-100' },
    { wrap: 'bg-white border border-slate-200', icon: 'bg-navy-100', text: 'text-navy-800', sub: 'text-slate-500' },
  ]
  const s = S[idx]
  return (
    <div className={`${s.wrap} rounded-2xl p-6 fill-both animate-fade-up shadow-card hover:shadow-card-hover transition-all duration-300`}
      style={{ animationDelay: `${idx * 120}ms` }}>
      <div className={`${s.icon} w-11 h-11 rounded-xl flex items-center justify-center mb-4`}>
        <Icon size={20} className={idx === 1 ? 'text-brand-orange' : idx === 0 ? 'text-white' : 'text-navy-700'} />
      </div>
      <h3 className={`font-display font-bold text-base mb-2 ${s.text}`}>{title}</h3>
      <p className={`text-sm leading-relaxed ${s.sub}`}>{desc}</p>
    </div>
  )
}

export default function Home() {
  const [activeStep, setActiveStep] = useState(0)
  const recent = DUMMY_POSTS.slice(0, 4)

  return (
    <div className="pt-16">

      {/* ══ HERO ══ */}
      <section className="relative bg-gradient-to-br from-navy-950 via-navy-800 to-navy-900 overflow-hidden min-h-[88vh] flex items-center">
        <div className="absolute inset-0 bg-grid-navy" />
        <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-brand-orange/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-600/30 rounded-full blur-[80px]" />

        <div className="container-app relative z-10 py-16 sm:py-20 md:py-28 w-full">
          <div className="max-w-3xl">
            {/* Tag */}
            <div className="fill-both animate-fade-in inline-flex items-center gap-2 bg-white/8 border border-white/15 rounded-full px-3.5 py-2 mb-6 sm:mb-8">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse shrink-0" />
              <span className="text-orange-300 text-[11px] sm:text-xs font-semibold tracking-wider uppercase">BD Garment Industry's #1 Knowledge Hub</span>
            </div>

            {/* Headline */}
            <h1 className="fill-both animate-fade-up delay-100 font-display text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-5 sm:mb-6">
              Master the{' '}
              <span className="text-gradient">Garments<br className="hidden sm:block" /> Industry</span>
              {' '}with Experts
            </h1>

            <p className="fill-both animate-fade-up delay-200 text-navy-300 text-base sm:text-lg md:text-xl leading-relaxed mb-8 sm:mb-10 max-w-2xl">
              QC guides, fabric specs, POM charts, interactive tools, and professional courses — everything a garment professional needs.
            </p>

            {/* CTA buttons — stacked on mobile */}
            <div className="fill-both animate-fade-up delay-300 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/knowledge-library" className="btn btn-primary btn-lg justify-center">
                Explore Library <ArrowRight size={18} />
              </Link>
              <Link to="/tools"
                className="btn btn-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 justify-center">
                <Calculator size={18} /> Try GSM Calculator
              </Link>
            </div>

            {/* Stats */}
            <div className="fill-both animate-fade-up delay-400 mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-white/10 grid grid-cols-3 gap-4 sm:gap-6">
              {[['500+','Industry Terms'],['50+','Expert Guides'],['10K+','Professionals']].map(([n,l]) => (
                <div key={l}>
                  <div className="font-display font-bold text-2xl sm:text-3xl text-brand-orange">{n}</div>
                  <div className="text-navy-400 text-xs sm:text-sm mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none" fill="white">
          <path d="M0,30 C360,50 1080,5 1440,30 L1440,40 L0,40Z" />
        </svg>
      </section>

      {/* ══ FEATURE CARDS ══ */}
      <section className="section bg-white">
        <div className="container-app">
          <SectionHead eyebrow="Core Goals" title="Everything You Need to Excel"
            subtitle="Three pillars that make Garments Brain the complete platform for industry professionals." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <FeatCard idx={0} icon={BookOpen} title="Knowledge Archive"   desc="500+ expert articles on every aspect of garment manufacturing — from fabric specs to final QC." />
            <FeatCard idx={1} icon={Award}    title="Teaching Platform"   desc="Structured micro-courses for QC professionals and factory supervisors with real examples." />
            <FeatCard idx={2} icon={Users}    title="Professional Growth" desc="Interactive tools, bilingual glossary (EN+বাং), and calculators for practical skills." />
          </div>
        </div>
      </section>

      {/* ══ MANUFACTURING STEPS ══ */}
      <section className="section bg-slate-50">
        <div className="container-app">
          {/* Mobile: stacked, Desktop: 2-col */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left info */}
            <div>
              <SectionHead left eyebrow="Process Guide" title="10 Steps of Garments Manufacturing"
                subtitle="Understand the complete lifecycle of a garment order. Click each step to explore detailed workflows." />

              <div className="grid grid-cols-2 gap-3 mt-6">
                {[[Layers,'10 Steps','Full lifecycle'],[Shield,'QC Focused','Every stage'],[TrendingUp,'Industry Best','Proven methods'],[Star,'Bilingual','EN + বাং']].map(([Icon,a,b]) => (
                  <div key={a} className="bg-white rounded-xl p-3.5 border border-slate-200 flex items-center gap-3">
                    <div className="w-9 h-9 bg-navy-50 rounded-lg flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-navy-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-navy-800 text-xs sm:text-sm">{a}</div>
                      <div className="text-slate-400 text-[11px]">{b}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-orange-800 text-sm font-semibold">🔧 Steps 4–10 coming soon</p>
                <p className="text-orange-700 text-xs mt-1">Each step includes SOPs, defect prevention checklists, and compliance tips.</p>
              </div>
            </div>

            {/* Accordion */}
            <div className="space-y-2.5">
              {MFG_STEPS.map((s, i) => (
                <Step key={s.step} data={s} open={activeStep === i}
                  onToggle={() => setActiveStep(activeStep === i ? -1 : i)} />
              ))}
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i+4} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-dashed border-slate-200 opacity-40 bg-white">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-display font-bold text-slate-400">
                    {String(i+4).padStart(2,'0')}
                  </div>
                  <span className="text-slate-400 text-sm">Coming soon…</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ RECENT ARTICLES ══ */}
      <section className="section bg-white">
        <div className="container-app">
          <div className="flex items-start sm:items-end justify-between mb-8 sm:mb-12 gap-4 flex-wrap">
            <SectionHead left eyebrow="Knowledge Library" title="Latest Industry Guides"
              subtitle="Expert-written references for garment professionals." />
            <Link to="/knowledge-library" className="btn btn-outline btn-sm shrink-0">
              View All <ArrowRight size={13} />
            </Link>
          </div>

          {/* Featured — hidden on very small screens, shown as normal card */}
          <div className="hidden sm:block mb-5">
            <PostCard post={recent[0]} featured />
          </div>
          <div className="sm:hidden mb-4">
            <PostCard post={recent[0]} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recent.slice(1).map(p => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      </section>

      {/* ══ TOOLS CTA ══ */}
      <section className="section bg-navy-800 bg-grid-navy relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl" />
        <div className="container-app relative z-10 text-center">
          <div className="eyebrow text-orange-400 justify-center mb-3">
            <span className="w-5 h-0.5 bg-orange-400 rounded" /> Free Tools <span className="w-5 h-0.5 bg-orange-400 rounded" />
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-4">
            Calculate. Generate. Validate.
          </h2>
          <p className="text-navy-300 text-base sm:text-lg max-w-xl mx-auto mb-10">
            Production-ready tools for the factory floor. No sign-in required.
          </p>

          {/* Tool cards — 1 col mobile, 3 col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              ['⚖️','GSM Calculator','Calculate fabric weight from sample dimensions.','Available now','bg-emerald-500/20 text-emerald-300'],
              ['📐','POM Generator','Generate measurement spec sheets with all POM points.','Coming soon','bg-white/10 text-navy-400'],
              ['📊','AQL Calculator','Determine sample size and acceptance numbers.','Coming soon','bg-white/10 text-navy-400'],
            ].map(([icon,title,desc,badge,bc]) => (
              <div key={title} className="bg-white/8 border border-white/12 rounded-2xl p-5 text-left hover:bg-white/12 active:bg-white/15 transition-all">
                <span className="text-3xl mb-3 block">{icon}</span>
                <span className={`badge mb-2 ${bc} text-[10px] uppercase tracking-wider`}>{badge}</span>
                <h3 className="font-display font-bold text-white text-sm mb-1.5">{title}</h3>
                <p className="text-navy-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <Link to="/tools" className="btn btn-primary btn-lg">
            Open GSM Calculator <Zap size={18} />
          </Link>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="section-sm bg-orange-50">
        <div className="container-app text-center">
          <h2 className="heading-lg mb-4">Ready to level up your garment knowledge?</h2>
          <p className="text-muted mb-8 max-w-lg mx-auto text-sm sm:text-base">Join thousands of professionals already using Garments Brain.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/knowledge-library" className="btn btn-primary btn-lg justify-center">Start Learning Free <ArrowRight size={18} /></Link>
            <Link to="/glossary"          className="btn btn-navy btn-lg justify-center">Explore Glossary</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
