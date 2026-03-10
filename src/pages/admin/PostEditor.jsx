import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Save, Eye, EyeOff, Upload, X, ArrowLeft, Loader2, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { blogApi, storageApi } from '@/lib/supabase'
import { CATEGORIES, DUMMY_POSTS } from '@/data/seed'
import { Spinner, ErrorBox } from '@/components/ui'
import toast from 'react-hot-toast'

const slugify = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function PostEditor() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = !!id

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    image_url: '', category: CATEGORIES[0], author: '', published: false,
  })
  const [loading, setLoading]     = useState(isEdit)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [err, setErr]             = useState('')
  const [autoSlug, setAutoSlug]   = useState(!isEdit)
  const [preview, setPreview]     = useState(false)
  const [metaOpen, setMetaOpen]   = useState(false)

  useEffect(() => {
    if (!isEdit) return
    ;(async () => {
      try {
        const post = await blogApi.getById(id)
        setForm({
          title:     post.title     || '',
          slug:      post.slug      || '',
          excerpt:   post.excerpt   || '',
          content:   post.content   || '',
          image_url: post.image_url || '',
          category:  post.category  || CATEGORIES[0],
          author:    post.author    || '',
          published: !!post.published,
        })
        setAutoSlug(false)
      } catch {
        const post = DUMMY_POSTS.find(p => p.id === id)
        if (post) {
          setForm({ title: post.title, slug: post.slug, excerpt: post.excerpt || '',
            content: post.content || '', image_url: post.image_url || '',
            category: post.category, author: post.author, published: !!post.published })
          setAutoSlug(false)
        }
      } finally { setLoading(false) }
    })()
  }, [id, isEdit])

  const set = (key, val) => setForm(f => {
    const next = { ...f, [key]: val }
    if (key === 'title' && autoSlug) next.slug = slugify(val)
    return next
  })

  const validate = () => {
    if (!form.title.trim()) return 'Title is required.'
    if (!form.slug.trim())  return 'Slug is required.'
    if (!form.content.trim()) return 'Content is required.'
    return ''
  }

  const handleImageUpload = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await storageApi.upload(file)
      set('image_url', url)
      toast.success('Image uploaded!')
    } catch { toast.error('Upload failed. Check Supabase Storage.') }
    finally { setUploading(false) }
  }

  const save = async (publish = null) => {
    const e = validate()
    if (e) { setErr(e); return }
    setErr(''); setSaving(true)
    const payload = {
      ...form,
      published: publish !== null ? publish : form.published,
    }
    try {
      if (isEdit) {
        await blogApi.update(id, payload)
        toast.success('Post updated!')
      } else {
        await blogApi.create({ ...payload, created_at: new Date().toISOString() })
        toast.success('Post created!')
        navigate('/admin/posts')
      }
    } catch (err) {
      toast.error(err.message || 'Save failed.')
    } finally { setSaving(false) }
  }

  const insertMarkdown = (syntax) => {
    set('content', form.content + (form.content ? '\n' : '') + syntax)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size={32} /></div>

  return (
    <div className="space-y-4 animate-fade-in fill-both pb-6">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <Link to="/admin/posts" className="btn btn-ghost btn-icon shrink-0">
            <ArrowLeft size={17} />
          </Link>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-lg sm:text-xl text-navy-800 truncate">
              {isEdit ? 'Edit Post' : 'New Post'}
            </h1>
            <p className="text-slate-400 text-xs hidden sm:block">
              {isEdit ? form.title || '…' : 'Create a new article'}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setPreview(v => !v)}
            className="btn btn-ghost border border-slate-200 btn-sm">
            {preview ? <EyeOff size={14} /> : <Eye size={14} />}
            <span className="hidden sm:inline">{preview ? 'Edit' : 'Preview'}</span>
          </button>
          <button onClick={() => save(false)} disabled={saving}
            className="btn btn-ghost border border-slate-200 btn-sm">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span className="hidden sm:inline">Draft</span>
          </button>
          <button onClick={() => save(true)} disabled={saving} className="btn btn-primary btn-sm">
            {saving ? <Loader2 size={13} className="animate-spin text-white" /> : <Eye size={13} />}
            {form.published ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {err && <ErrorBox message={err} />}

      {/* ── Title & Slug ── */}
      <div className="card p-4 sm:p-6 space-y-4">
        <div>
          <label className="form-label">Post Title *</label>
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="Enter a clear, descriptive title…"
            className="form-input text-base sm:text-lg font-semibold" />
        </div>
        <div>
          <label className="form-label">URL Slug *</label>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-slate-400 text-xs sm:text-sm shrink-0">/blog/</span>
            <input value={form.slug}
              onChange={e => { set('slug', e.target.value); setAutoSlug(false) }}
              placeholder="url-slug" className="form-input font-mono text-sm flex-1" />
          </div>
        </div>
        <div>
          <label className="form-label">Excerpt</label>
          <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
            placeholder="Brief summary (1–2 sentences)…"
            rows={2} className="form-input resize-none" />
        </div>
      </div>

      {/* ── Content Editor ── */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 gap-2">
          <label className="form-label mb-0">Content *</label>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Info size={11} /> Markdown
          </span>
        </div>

        {/* Markdown toolbar — scrollable on mobile */}
        {!preview && (
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
            {[
              ['# ','H1'],['## ','H2'],['### ','H3'],
              ['**text**','Bold'],['*text*','Italic'],['`code`','Code'],
              ['> ','Quote'],['- ','List'],
              ['| Col |\n|---|\n| Val |','Table'],
            ].map(([ins, lbl]) => (
              <button key={lbl} type="button"
                onClick={() => insertMarkdown(ins)}
                className="shrink-0 px-2.5 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg hover:bg-navy-50 hover:border-navy-300 active:scale-95 transition-all whitespace-nowrap">
                {lbl}
              </button>
            ))}
          </div>
        )}

        {preview ? (
          <div className="min-h-[300px] bg-slate-50 rounded-xl p-4 border border-slate-200">
            {form.content ? (
              <div className="prose-blog text-sm">
                {form.content.split('\n').map((line, i) => {
                  if (line.startsWith('## '))  return <h2 key={i}>{line.slice(3)}</h2>
                  if (line.startsWith('# '))   return <h1 key={i}>{line.slice(2)}</h1>
                  if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>
                  if (line.startsWith('- '))   return <p key={i} className="ml-4">• {line.slice(2)}</p>
                  if (line.trim() === '')       return <br key={i} />
                  return <p key={i}>{line}</p>
                })}
              </div>
            ) : (
              <p className="text-slate-400 italic text-sm">Nothing to preview…</p>
            )}
          </div>
        ) : (
          <>
            <textarea value={form.content} onChange={e => set('content', e.target.value)}
              placeholder={`# Post Title\n\nWrite in Markdown...\n\n## Section\n\nContent here.`}
              rows={16} className="form-input font-mono text-sm resize-none leading-relaxed" />
            <p className="form-hint">{form.content.length} chars · ~{Math.max(1, Math.ceil(form.content.length / 1200))} min read</p>
          </>
        )}
      </div>

      {/* ── Meta panel — collapsible on mobile ── */}
      <div className="card overflow-hidden">
        <button onClick={() => setMetaOpen(v => !v)}
          className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-left hover:bg-slate-50 transition-colors sm:cursor-default">
          <span className="font-display font-semibold text-navy-800 text-sm sm:text-base">Post Settings</span>
          <div className="sm:hidden text-slate-400">
            {metaOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        <div className={`border-t border-slate-100 overflow-hidden transition-all duration-300 sm:max-h-none ${metaOpen ? 'max-h-[800px]' : 'max-h-0 sm:max-h-none'}`}>
          <div className="p-4 sm:p-6 grid sm:grid-cols-2 gap-5">

            {/* Status toggle */}
            <div>
              <label className="form-label">Visibility</label>
              <label className="flex items-center gap-3 cursor-pointer mt-1">
                <div className={`w-11 h-6 rounded-full relative transition-colors ${form.published ? 'bg-brand-orange' : 'bg-slate-200'}`}
                  onClick={() => set('published', !form.published)}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform`}
                    style={{ transform: form.published ? 'translateX(22px)' : 'translateX(2px)' }} />
                </div>
                <span className="text-sm text-slate-600">{form.published ? '● Published' : '○ Draft'}</span>
              </label>
            </div>

            {/* Category */}
            <div>
              <label className="form-label">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="form-input">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="form-label">Author</label>
              <input value={form.author} onChange={e => set('author', e.target.value)}
                placeholder="Author name" className="form-input" />
            </div>

            {/* Image URL */}
            <div>
              <label className="form-label">Image URL</label>
              <input value={form.image_url} onChange={e => set('image_url', e.target.value)}
                placeholder="https://…" className="form-input text-sm" />
            </div>

            {/* Image preview + upload */}
            {form.image_url && (
              <div className="sm:col-span-2">
                <div className="relative rounded-xl overflow-hidden h-36 bg-slate-100">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                  <button onClick={() => set('image_url', '')}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80">
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              <label className={`btn btn-ghost border border-dashed border-slate-300 w-full justify-center cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploading ? 'Uploading…' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
              <p className="form-hint text-center">Requires Supabase Storage bucket "garments-brain"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Save bar — sticky at bottom on mobile */}
      <div className="sticky bottom-0 -mx-6 px-4 sm:px-6 py-3 bg-white border-t border-slate-200 flex gap-3 sm:hidden z-20">
        <button onClick={() => save(false)} disabled={saving}
          className="btn btn-ghost border border-slate-200 flex-1 justify-center">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Draft
        </button>
        <button onClick={() => save(true)} disabled={saving} className="btn btn-primary flex-1 justify-center">
          {saving ? <Loader2 size={14} className="animate-spin text-white" /> : null}
          {form.published ? 'Update' : 'Publish'}
        </button>
      </div>
    </div>
  )
}
