import { Loader2, AlertCircle, PackageOpen } from 'lucide-react'
import clsx from 'clsx'

/* ── Spinner ───────────────────────────────────────── */
export function Spinner({ size = 24, className = '' }) {
  return <Loader2 size={size} className={clsx('animate-spin text-brand-orange', className)} />
}

/* ── Page loader ────────────────────────────────────── */
export function PageLoader({ text = 'Loading…' }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <Spinner size={36} />
      <p className="text-slate-400 text-sm animate-pulse-slow">{text}</p>
    </div>
  )
}

/* ── Error box ──────────────────────────────────────── */
export function ErrorBox({ message }) {
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
      <AlertCircle size={16} className="shrink-0" />
      <span>{message}</span>
    </div>
  )
}

/* ── Empty state ────────────────────────────────────── */
export function Empty({ icon: Icon = PackageOpen, title, desc, action }) {
  return (
    <div className="py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Icon size={28} className="text-slate-400" />
      </div>
      <p className="font-display font-bold text-navy-800 text-lg mb-2">{title}</p>
      {desc && <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">{desc}</p>}
      {action}
    </div>
  )
}

/* ── Category badge ─────────────────────────────────── */
const CAT_COLORS = {
  'Quality Control':      'bg-blue-100   text-blue-700',
  'Fabric Technology':    'bg-amber-100  text-amber-700',
  'POM & Measurement':    'bg-green-100  text-green-700',
  'Sewing Technology':    'bg-purple-100 text-purple-700',
  'Embroidery':           'bg-pink-100   text-pink-700',
  'Sustainability':       'bg-emerald-100 text-emerald-700',
  'Standards & Compliance':'bg-red-100   text-red-700',
  'Production Management':'bg-indigo-100 text-indigo-700',
  'Dyeing & Finishing':   'bg-orange-100 text-orange-700',
}
export function CatBadge({ category, className = '' }) {
  return (
    <span className={clsx('badge', CAT_COLORS[category] || 'bg-slate-100 text-slate-600', className)}>
      {category}
    </span>
  )
}

/* ── Section header ─────────────────────────────────── */
export function SectionHead({ eyebrow, title, subtitle, left = false }) {
  return (
    <div className={clsx('mb-12', !left && 'text-center')}>
      {eyebrow && (
        <div className={clsx('eyebrow mb-3', !left && 'justify-center')}>
          <span className="w-6 h-0.5 bg-brand-orange rounded-full" />
          {eyebrow}
          {!left && <span className="w-6 h-0.5 bg-brand-orange rounded-full" />}
        </div>
      )}
      <h2 className="heading-lg text-balance mb-3">{title}</h2>
      {subtitle && <p className={clsx('text-muted', !left && 'max-w-2xl mx-auto')}>{subtitle}</p>}
    </div>
  )
}

/* ── Modal wrapper ──────────────────────────────────── */
export function Modal({ children, onClose }) {
  return (
    <div className="overlay animate-fade-in" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-2xl shadow-card-hover max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {children}
      </div>
    </div>
  )
}

/* ── Confirm dialog ─────────────────────────────────── */
export function ConfirmModal({ title, message, onConfirm, onCancel, loading }) {
  return (
    <Modal onClose={onCancel}>
      <div className="p-6">
        <h3 className="font-display font-bold text-navy-800 text-lg mb-2">{title}</h3>
        <p className="text-slate-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn btn-ghost">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="btn btn-danger">
            {loading ? <Spinner size={16} className="text-white" /> : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

/* ── Prose renderer ─────────────────────────────────── */
import ReactMarkdown from 'react-markdown'
export function Prose({ content }) {
  return (
    <div className="prose-blog">
      <ReactMarkdown>{content || ''}</ReactMarkdown>
    </div>
  )
}
