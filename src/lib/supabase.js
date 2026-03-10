import { createClient } from '@supabase/supabase-js'

// ──────────────────────────────────────────────────────────────────
//  Replace with your Supabase project values:
//  Dashboard → Project Settings → API
// ──────────────────────────────────────────────────────────────────
const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL      || 'https://YOUR_PROJECT.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
})

// ──────────────────────────────────────────────────────────────────
//  Blog API helpers
// ──────────────────────────────────────────────────────────────────
export const blogApi = {
  /* Public: all published posts */
  async getPublished() {
    const { data, error } = await supabase
      .from('blogs')
      .select('id,title,slug,image_url,category,author,excerpt,created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  /* Admin: all posts */
  async getAll() {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  /* Single post by slug (public) */
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    if (error) throw error
    return data
  },

  /* Single post by id (admin edit) */
  async getById(id) {
    const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  async create(payload) {
    const { data, error } = await supabase.from('blogs').insert([payload]).select().single()
    if (error) throw error
    return data
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from('blogs').update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id).select().single()
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase.from('blogs').delete().eq('id', id)
    if (error) throw error
  },
}

// ──────────────────────────────────────────────────────────────────
//  Storage helpers (image uploads)
// ──────────────────────────────────────────────────────────────────
export const storageApi = {
  async upload(file) {
    const ext  = file.name.split('.').pop()
    const path = `blog-images/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('garments-brain').upload(path, file, { cacheControl: '3600' })
    if (error) throw error
    const { data } = supabase.storage.from('garments-brain').getPublicUrl(path)
    return data.publicUrl
  },
}
