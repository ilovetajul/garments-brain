import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Save, X,
  ChevronUp, ChevronDown, Loader2, GripVertical, Layers
} from 'lucide-react'
import { stepsApi } from '@/lib/supabase'
import { MFG_STEPS } from '@/data/seed'
import { Spinner, Empty, ConfirmModal } from '@/components/ui'
import toast from 'react-hot-toast'

// ── Default empty form ──────────────────────────────
const EMPTY = {
  step_number: '', title: '', icon: '🔧', summary: '',
  description: '', points: '', active: true,
}

// ── Step Form Modal ─────────────────────────────────
function StepModal({ step, onSave, onClose, saving }) {
  const [form, setForm] = useState(step ? {
    step_number: step.step_number,
    title:       step.title,
    icon:        step.icon || '🔧',
    summary:     step.summary || '',
    description: step.description || step.desc || '',
    points:      Array.isArray(step.points) ? step.points.join('\n') : (step.points || ''),
    active:      step.active !== false,
  } : EMPTY)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title.trim())       return toast.error('Title দিন')
    if (!form.step_number)        return toast.error('Step number দিন')
    const payload = {
      ...form,
      step_number: Number(form.step_number),
      points: form.points.split('\n').map(p => p.trim()).filter(Boolean),
    }
    onSave(payload)
  }

  const EMOJIS = ['🧵','📐','✂️','🔍','🏭','📦','🚢','🧪','⚙️','🎨','📋','✅','🔧','💡','📊','🏷️','🔄','📏']

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h2 className="font-display font-bold text-navy-800 text-base">
            {step ? 'Step Edit করুন' : 'নতুন Step যোগ করুন'}
          </h2>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Step number + Active */}
          <div className="flex gap-3">
            <div className="w-28">
              <label className="form-label">Step নম্বর *</label>
              <input type="number" min="1" value={form.step_number}
                onChange={e => set('step_number', e.target.value)}
                placeholder="1" className="form-input text-center font-bold" />
            </div>
            <div className="flex-1">
              <label className="form-label">Visibility</label>
              <label className="flex items-center gap-3 mt-2 cursor-pointer">
                <div className={`w-11 h-6 rounded-full relative transition-colors ${form.active ? 'bg-brand-orange' : 'bg-slate-200'}`}
                  onClick={() => set('active', !form.active)}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                    style={{ transform: form.active ? 'translateX(22px)' : 'translateX(2px)' }} />
                </div>
                <span className="text-sm text-slate-600">{form.active ? 'Active (দেখাবে)' : 'Hidden (লুকানো)'}</span>
              </label>
            </div>
          </div>

          {/* Icon picker */}
          <div>
            <label className="form-label">Icon (Emoji)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {EMOJIS.map(e => (
                <button key={e} type="button" onClick={() => set('icon', e)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${form.icon === e ? 'bg-navy-100 ring-2 ring-navy-400 scale-110' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  {e}
                </button>
              ))}
            </div>
            <input value={form.icon} onChange={e => set('icon', e.target.value)}
              placeholder="অন্য emoji টাইপ করুন" className="form-input text-center text-xl" />
          </div>

          {/* Title */}
          <div>
            <label className="form-label">Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="যেমন: Fabric Inspection" className="form-input" />
          </div>

          {/* Summary */}
          <div>
            <label className="form-label">Short Summary</label>
            <input value={form.summary} onChange={e => set('summary', e.target.value)}
              placeholder="এক লাইনে বিবরণ…" className="form-input" />
          </div>

          {/* Description */}
          <div>
            <label className="form-label">বিস্তারিত বিবরণ</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="এই step সম্পর্কে বিস্তারিত লিখুন…"
              rows={3} className="form-input resize-none" />
          </div>

          {/* Points */}
          <div>
            <label className="form-label">Key Points <span className="text-slate-400 font-normal">(প্রতি লাইনে একটি)</span></label>
            <textarea value={form.points} onChange={e => set('points', e.target.value)}
              placeholder={"Check fabric GSM\nInspect color fastness\nVerify shrinkage level"}
              rows={5} className="form-input font-mono text-sm resize-none" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-slate-100 shrink-0">
          <button onClick={onClose} className="btn btn-ghost border border-slate-200 flex-1 justify-center">
            বাতিল
          </button>
          <button onClick={handleSave} disabled={saving} className="btn btn-primary flex-1 justify-center">
            {saving ? <Loader2 size={14} className="animate-spin text-white" /> : <Save size={14} />}
            সংরক্ষণ করুন
          </button>
        </div>
      </div>
    </div>
  )
}

// ══ Main Page ══════════════════════════════════════
export default function ManageSteps() {
  const [steps, setSteps]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(null)   // null | 'new' | step-object
  const [delId, setDelId]     = useState(null)
  const [saving, setSaving]   = useState(false)
  const [delBusy, setDelBusy] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await stepsApi.getAll()
      setSteps(data.length ? data : MFG_STEPS.map((s, i) => ({
        id: String(i), step_number: s.step, title: s.title,
        icon: s.icon, summary: s.summary, description: s.desc,
        points: s.points, active: true,
      })))
    } catch {
      setSteps(MFG_STEPS.map((s, i) => ({
        id: String(i), step_number: s.step, title: s.title,
        icon: s.icon, summary: s.summary, description: s.desc,
        points: s.points, active: true,
      })))
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (payload) => {
    setSaving(true)
    try {
      if (modal?.id && modal.id.length > 2) {
        await stepsApi.update(modal.id, payload)
        setSteps(ss => ss.map(s => s.id === modal.id ? { ...s, ...payload } : s))
        toast.success('Step আপডেট হয়েছে!')
      } else {
        const created = await stepsApi.create(payload)
        setSteps(ss => [...ss, created].sort((a, b) => a.step_number - b.step_number))
        toast.success('নতুন Step যোগ হয়েছে!')
      }
      setModal(null)
    } catch { toast.error('সংরক্ষণ করা যায়নি') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDelBusy(true)
    try {
      await stepsApi.delete(delId)
      setSteps(ss => ss.filter(s => s.id !== delId))
      toast.success('Step মুছে ফেলা হয়েছে।')
    } catch { toast.error('মুছতে পারেনি।') }
    finally { setDelBusy(false); setDelId(null) }
  }

  const handleToggle = async (step) => {
    try {
      await stepsApi.update(step.id, { active: !step.active })
      setSteps(ss => ss.map(s => s.id === step.id ? { ...s, active: !s.active } : s))
      toast.success(step.active ? 'লুকানো হয়েছে।' : 'দেখানো হবে।')
    } catch { toast.error('আপডেট হয়নি।') }
  }

  const activeCount = steps.filter(s => s.active).length

  return (
    <div className="space-y-5 animate-fade-in fill-both pb-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-navy-800">Manufacturing Steps</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            {steps.length} steps · {activeCount} active (homepage-এ দেখাচ্ছে)
          </p>
        </div>
        <button onClick={() => setModal('new')} className="btn btn-primary btn-sm">
          <Plus size={14} /> নতুন Step
        </button>
      </div>

      {/* Info */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3">
        <span className="text-lg shrink-0">💡</span>
        <p className="text-orange-800 text-sm">
          এখানে step যোগ, edit বা delete করুন। <strong>Active</strong> করলে homepage-এ দেখাবে।
          Supabase-এ <code className="bg-orange-100 px-1 rounded text-xs">mfg_steps</code> table প্রয়োজন — নিচে SQL দেওয়া আছে।
        </p>
      </div>

      {/* Steps list */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Spinner size={32} /></div>
      ) : steps.length === 0 ? (
        <Empty icon={Layers} title="কোনো Step নেই"
          action={<button onClick={() => setModal('new')} className="btn btn-primary btn-sm"><Plus size={14} /> প্রথম Step যোগ করুন</button>} />
      ) : (
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id}
              className={`card p-4 flex items-start gap-3 transition-all ${!step.active ? 'opacity-50' : ''}`}>

              {/* Step number */}
              <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center font-display font-bold text-white text-sm shrink-0">
                {String(step.step_number).padStart(2, '0')}
              </div>

              {/* Icon + Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xl">{step.icon}</span>
                  <span className="font-display font-bold text-navy-800 text-sm sm:text-base">{step.title}</span>
                  <span className={`badge text-[10px] ${step.active ? 'badge-live' : 'badge-slate'}`}>
                    {step.active ? '● Active' : '○ Hidden'}
                  </span>
                </div>
                {step.summary && <p className="text-slate-500 text-xs line-clamp-1">{step.summary}</p>}
                {Array.isArray(step.points) && step.points.length > 0 && (
                  <p className="text-slate-400 text-[11px] mt-1">{step.points.length} key points</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleToggle(step)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                  title={step.active ? 'লুকাও' : 'দেখাও'}>
                  {step.active ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button onClick={() => setModal(step)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-navy-500 hover:bg-navy-50 transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => setDelId(step.id)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SQL Guide */}
      <div className="card p-4 sm:p-5 border-l-4 border-navy-400">
        <h3 className="font-display font-bold text-navy-800 text-sm mb-3">📋 Supabase SQL — একবার চালাতে হবে</h3>
        <pre className="bg-slate-900 text-green-300 rounded-xl p-4 text-xs overflow-x-auto font-mono leading-relaxed">{`CREATE TABLE public.mfg_steps (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  step_number INTEGER NOT NULL,
  title       TEXT NOT NULL,
  icon        TEXT DEFAULT '🔧',
  summary     TEXT,
  description TEXT,
  points      JSONB DEFAULT '[]',
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.mfg_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active steps"
  ON public.mfg_steps FOR SELECT
  USING (active = true);
CREATE POLICY "Auth full access"
  ON public.mfg_steps FOR ALL
  TO authenticated USING (true);`}</pre>
        <p className="text-slate-500 text-xs mt-3">
          Supabase → SQL Editor → উপরের code paste করুন → Run চাপুন
        </p>
      </div>

      {/* Modals */}
      {(modal === 'new' || (modal && typeof modal === 'object')) && (
        <StepModal
          step={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}

      {delId && (
        <ConfirmModal
          title="Step Delete করবেন?"
          message="এই step চিরতরে মুছে যাবে।"
          onConfirm={handleDelete}
          onCancel={() => setDelId(null)}
          loading={delBusy}
        />
      )}
    </div>
  )
}
