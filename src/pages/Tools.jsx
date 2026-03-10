import { useState } from 'react'
import { Calculator, RefreshCw, Info, CheckCircle, Beaker } from 'lucide-react'
import { SectionHead } from '@/components/ui'

function gsmCat(gsm) {
  if (gsm < 80)  return { label: 'Ultra Lightweight', c: 'blue',   note: 'Chiffon, organza' }
  if (gsm < 120) return { label: 'Lightweight',       c: 'sky',    note: 'Lawn, batiste' }
  if (gsm < 160) return { label: 'Light-Medium',      c: 'teal',   note: 'Dress shirts, blouses' }
  if (gsm < 200) return { label: 'Medium Weight',     c: 'green',  note: 'Standard T-shirts' }
  if (gsm < 260) return { label: 'Medium-Heavy',      c: 'orange', note: 'Interlock, pique' }
  if (gsm < 350) return { label: 'Heavy Weight',      c: 'amber',  note: 'Sweatshirts, hoodies' }
  if (gsm < 450) return { label: 'Very Heavy',        c: 'red',    note: 'Heavy denim, canvas' }
  return                 { label: 'Extra Heavy',      c: 'rose',   note: 'Technical outerwear' }
}

const CC = {
  blue:'bg-blue-100 text-blue-700',sky:'bg-sky-100 text-sky-700',teal:'bg-teal-100 text-teal-700',
  green:'bg-green-100 text-green-700',orange:'bg-orange-100 text-orange-700',
  amber:'bg-amber-100 text-amber-700',red:'bg-red-100 text-red-700',rose:'bg-rose-100 text-rose-700',
}

function Field({ label, value, onChange, unit, hint, err }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="relative">
        <input
          type="number" inputMode="decimal" min="0" step="any"
          value={value} onChange={e => onChange(e.target.value)}
          placeholder="0" className={`form-input pr-14 ${err ? 'border-red-400 focus:ring-red-300' : ''}`}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
          {unit}
        </span>
      </div>
      {hint && <p className="form-hint">{hint}</p>}
      {err  && <p className="form-error">{err}</p>}
    </div>
  )
}

export default function Tools() {
  const [l, setL] = useState(''); const [w, setW] = useState(''); const [g, setG] = useState('')
  const [gsm, setGsm] = useState(null)
  const [errs, setErrs] = useState({})
  const [hist, setHist] = useState([])

  const validate = () => {
    const e = {}
    if (!l || +l <= 0) e.l = 'Enter length'
    if (!w || +w <= 0) e.w = 'Enter width'
    if (!g || +g <= 0) e.g = 'Enter weight'
    setErrs(e); return !Object.keys(e).length
  }

  const calc = () => {
    if (!validate()) return
    const result = +g / ((+l / 100) * (+w / 100))
    setGsm(result)
    setHist(h => [{ l, w, g, gsm: Math.round(result), cat: gsmCat(result).label }, ...h].slice(0, 5))
  }

  const reset = () => { setL(''); setW(''); setG(''); setGsm(null); setErrs({}) }
  const cat   = gsm !== null ? gsmCat(gsm) : null

  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-950 to-navy-800 bg-grid-navy py-12 sm:py-16">
        <div className="container-app text-center">
          <div className="eyebrow text-orange-400 justify-center mb-3">
            <span className="w-5 h-0.5 bg-orange-400 rounded" /> Free Tools <span className="w-5 h-0.5 bg-orange-400 rounded" />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-3">GSM Calculator</h1>
          <p className="text-navy-300 text-sm sm:text-base max-w-md mx-auto">Calculate fabric weight instantly. Get GSM and oz/yd² with automatic fabric classification.</p>
        </div>
      </div>

      <div className="container-app py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Mobile: stacked, Desktop: 3-col grid */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Calculator ── */}
            <div className="lg:col-span-2 space-y-5">
              <div className="card p-5 sm:p-8">

                {/* Info box */}
                <div className="flex gap-3 bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6">
                  <Info size={15} className="text-brand-orange shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-800 leading-relaxed">
                    Cut a rectangular fabric sample. Measure length & width in cm. Weigh in grams. Enter values below.
                  </p>
                </div>

                {/* Formula */}
                <div className="flex items-center gap-2 bg-navy-50 rounded-xl px-4 py-3 mb-6 overflow-x-auto">
                  <Beaker size={14} className="text-navy-500 shrink-0" />
                  <span className="font-mono text-sm text-navy-700 whitespace-nowrap">GSM = Weight(g) ÷ [Length(m) × Width(m)]</span>
                </div>

                {/* Inputs — stacked on mobile, 3-col on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <Field label="Length" value={l} onChange={setL} unit="cm" hint="e.g. 25" err={errs.l} />
                  <Field label="Width"  value={w} onChange={setW} unit="cm" hint="e.g. 25" err={errs.w} />
                  <Field label="Weight" value={g} onChange={setG} unit="g"  hint="e.g. 1.125" err={errs.g} />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button onClick={calc} className="btn btn-primary flex-1 btn-lg">
                    <Calculator size={18} /> Calculate GSM
                  </button>
                  <button onClick={reset} className="btn btn-ghost border border-slate-200 btn-icon">
                    <RefreshCw size={16} />
                  </button>
                </div>

                {/* Result */}
                {gsm !== null && (
                  <div className="mt-7 pt-7 border-t border-slate-100 animate-fade-up fill-both">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Result</p>

                    {/* Two stat boxes */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gradient-to-br from-navy-800 to-navy-950 rounded-2xl p-4 sm:p-6 text-center">
                        <p className="text-navy-400 text-[10px] uppercase tracking-widest mb-1">GSM</p>
                        <div className="font-display font-bold text-4xl sm:text-5xl text-white">{Math.round(gsm)}</div>
                        <div className="text-navy-300 text-xs mt-1">g/m²</div>
                      </div>
                      <div className="bg-slate-800 rounded-2xl p-4 sm:p-6 text-center">
                        <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-1">US Unit</p>
                        <div className="font-display font-bold text-4xl sm:text-5xl text-white">{(gsm / 33.906).toFixed(2)}</div>
                        <div className="text-slate-400 text-xs mt-1">oz/yd²</div>
                      </div>
                    </div>

                    {cat && (
                      <div className={`flex items-center gap-3 p-4 rounded-xl ${CC[cat.c]}`}>
                        <CheckCircle size={18} className="shrink-0" />
                        <div>
                          <div className="font-semibold text-sm">{cat.label}</div>
                          <div className="text-xs opacity-75 mt-0.5">{cat.note}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* History */}
              {hist.length > 0 && (
                <div className="card p-5">
                  <h3 className="font-display font-semibold text-navy-800 mb-4 text-sm">Recent Calculations</h3>
                  <div className="space-y-2">
                    {hist.map((h, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                        <span className="text-slate-500 font-mono text-xs">{h.l}×{h.w}cm, {h.g}g</span>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold text-navy-800 text-sm">{h.gsm} GSM</span>
                          <span className="badge badge-navy text-[10px] hidden sm:inline-flex">{h.cat}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Reference sidebar ── */}
            <div className="space-y-4">
              {/* GSM chart */}
              <div className="card p-5">
                <h3 className="font-display font-semibold text-navy-800 mb-4 text-sm flex items-center gap-2">
                  <Beaker size={14} className="text-brand-orange" /> GSM Reference
                </h3>
                {[['< 80','Ultra Light','sky'],['80–120','Lightweight','teal'],['120–160','Light-Medium','green'],
                  ['160–200','Medium','blue'],['200–260','Med-Heavy','orange'],['260–350','Heavy','amber'],['350+','Extra Heavy','red'],
                ].map(([range, label, c]) => (
                  <div key={range} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="font-mono text-xs text-slate-500 w-14 shrink-0">{range}</span>
                    <span className={`badge text-[10px] ${CC[c]}`}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div className="bg-navy-50 rounded-2xl p-4 border border-navy-100">
                <h3 className="font-semibold text-navy-800 text-sm mb-3">Tips</h3>
                {['Use GSM cutter for precision','Take 5 samples, average','0.001g balance for accuracy','Sample 10cm from edge','Cut on-grain only'].map(t => (
                  <div key={t} className="flex items-start gap-2 text-xs text-navy-700 py-1.5 border-b border-navy-100 last:border-0">
                    <CheckCircle size={11} className="text-brand-orange mt-0.5 shrink-0" /> {t}
                  </div>
                ))}
              </div>

              {/* More tools */}
              <div className="bg-navy-900 rounded-2xl p-4 text-white">
                <p className="font-semibold text-sm mb-3">More Tools Soon</p>
                {['POM Template Generator','AQL Sampling Calc','Fabric Consumption','Shrinkage Calculator'].map(t => (
                  <div key={t} className="flex items-center gap-2 text-slate-400 text-xs py-2 border-b border-navy-800 last:border-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-navy-700 shrink-0" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
