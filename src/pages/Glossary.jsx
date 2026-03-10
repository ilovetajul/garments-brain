import { useState, useMemo } from 'react'
import { Search, X, BookMarked } from 'lucide-react'
import { CatBadge } from '@/components/ui'
import { GLOSSARY } from '@/data/seed'

const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function Glossary() {
  const [q, setQ]      = useState('')
  const [letter, setL] = useState('All')

  const filtered = useMemo(() => {
    let r = GLOSSARY
    if (letter !== 'All') r = r.filter(g => g.term.startsWith(letter))
    if (q.trim()) {
      const lq = q.toLowerCase()
      r = r.filter(g => g.term.toLowerCase().includes(lq) || g.def.toLowerCase().includes(lq))
    }
    return r.sort((a, b) => a.term.localeCompare(b.term))
  }, [q, letter])

  const hasLetter = l => GLOSSARY.some(g => g.term.startsWith(l))

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-950 to-navy-800 bg-grid-navy py-12 sm:py-16">
        <div className="container-app text-center">
          <div className="eyebrow text-orange-400 justify-center mb-3">
            <span className="w-5 h-0.5 bg-orange-400 rounded" /> Bilingual Glossary <span className="w-5 h-0.5 bg-orange-400 rounded" />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-3">
            Industry Glossary
          </h1>
          <p className="text-navy-300 text-sm sm:text-base max-w-xl mx-auto mb-4">
            500+ terms in English and বাংলা — QC, fabric, POM, sewing, and more.
          </p>
          <div className="flex items-center justify-center gap-2 text-navy-400 text-xs sm:text-sm">
            <BookMarked size={13} className="text-orange-400" />
            <span>{GLOSSARY.length} terms · 2 languages</span>
          </div>
        </div>
      </div>

      <div className="container-app py-6 sm:py-10">
        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search terms…" className="form-input pl-10 pr-9" />
          {q && (
            <button onClick={() => setQ('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X size={14} />
            </button>
          )}
        </div>

        {/* A-Z — scrollable row on mobile */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none snap-x">
          <button onClick={() => setL('All')}
            className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold border transition-all snap-start ${
              letter === 'All' ? 'bg-navy-800 text-white border-navy-800' : 'bg-white text-slate-600 border-slate-200'
            }`}>All</button>
          {AZ.map(l => (
            <button key={l} onClick={() => setL(l)} disabled={!hasLetter(l)}
              className={`shrink-0 w-9 h-9 rounded-lg text-xs font-display font-bold border transition-all snap-start ${
                letter === l ? 'bg-navy-800 text-white border-navy-800' :
                hasLetter(l) ? 'bg-white text-slate-600 border-slate-200 hover:border-navy-400' :
                'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
              }`}>{l}</button>
          ))}
        </div>

        {/* Terms grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <BookMarked size={36} className="mx-auto mb-3 opacity-50" />
            <p className="font-semibold text-sm">No terms found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map(t => (
              <div key={t.term}
                className="card p-4 sm:p-5 hover:shadow-card-hover transition-all hover:-translate-y-0.5 active:scale-[0.99]">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <span className="font-display font-bold text-navy-800 text-sm sm:text-base">{t.term}</span>
                    <span className="text-slate-400 text-xs ml-1.5 block sm:inline mt-0.5 sm:mt-0">/ {t.bn}</span>
                  </div>
                  <CatBadge category={t.cat} className="shrink-0 text-[10px]" />
                </div>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{t.def}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
