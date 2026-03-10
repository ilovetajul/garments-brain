-- ═══════════════════════════════════════════════════════════════
--  GARMENTS BRAIN — Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Enable UUID extension ──────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 2. Create the blogs table ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blogs (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  excerpt     TEXT,
  content     TEXT,           -- Markdown / rich text
  image_url   TEXT,
  category    TEXT NOT NULL DEFAULT 'Quality Control',
  author      TEXT,
  published   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. Index for fast slug lookups ───────────────────────────
CREATE INDEX IF NOT EXISTS blogs_slug_idx      ON public.blogs (slug);
CREATE INDEX IF NOT EXISTS blogs_published_idx ON public.blogs (published);
CREATE INDEX IF NOT EXISTS blogs_category_idx  ON public.blogs (category);
CREATE INDEX IF NOT EXISTS blogs_created_idx   ON public.blogs (created_at DESC);

-- ── 4. Row Level Security ────────────────────────────────────
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts (public)
CREATE POLICY "Public can read published posts"
  ON public.blogs FOR SELECT
  USING (published = TRUE);

-- Only authenticated users (admins) can do everything
CREATE POLICY "Authenticated users can manage all posts"
  ON public.blogs FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ── 5. Storage bucket ────────────────────────────────────────
-- Run this to create the storage bucket:
INSERT INTO storage.buckets (id, name, public)
VALUES ('garments-brain', 'garments-brain', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Allow public to read from storage
CREATE POLICY "Public read access to garments-brain"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'garments-brain');

-- Allow authenticated to upload/delete
CREATE POLICY "Authenticated upload to garments-brain"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'garments-brain');

CREATE POLICY "Authenticated delete from garments-brain"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'garments-brain');

-- ── 6. Updated_at trigger ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ── 7. Sample seed data ──────────────────────────────────────
INSERT INTO public.blogs (title, slug, excerpt, content, image_url, category, author, published)
VALUES
(
  'Understanding AQL 2.5 in Garment Quality Control',
  'understanding-aql-garment-qc',
  'AQL 2.5 is the global standard for garment inspection. Learn how sampling plans work and how to apply acceptance criteria during final audits.',
  '## What is AQL?

AQL (Acceptable Quality Level) is the maximum defect percentage considered acceptable during final inspection.

## Sampling Table (GIL II)

| Lot Size | Sample | Accept | Reject |
|---|---|---|---|
| 281–500 | 50 | 3 | 4 |
| 501–1200 | 80 | 5 | 6 |
| 1201–3200 | 125 | 7 | 8 |

## Defect Classification

- **Critical (AQL 0):** Safety hazard — instant rejection
- **Major (AQL 2.5):** Affects function or appearance
- **Minor (AQL 4.0):** Small cosmetic issues',
  'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
  'Quality Control',
  'Rahman Hossain',
  TRUE
),
(
  'Complete Guide to Fabric GSM — Testing & Standards',
  'fabric-gsm-testing-guide',
  'GSM (Grams per Square Metre) is the fundamental measurement for fabric weight. Testing methods, standards, and tolerances used in export garments.',
  '## Why GSM Matters

GSM determines fabric quality, durability, and garment hand-feel.

## Testing Method

1. Cut a 10×10 cm sample with a die cutter
2. Weigh on a 0.001g precision balance
3. Multiply weight × 100 = GSM

**Formula:** GSM = Weight(g) ÷ (Length(m) × Width(m))

## GSM Reference Chart

| Fabric | GSM Range |
|---|---|
| Light T-shirt | 100–140 |
| Standard T-shirt | 150–180 |
| Sweatshirt fleece | 250–350 |',
  'https://images.unsplash.com/photo-1586495777744-4e6232bf3628?w=800&q=80',
  'Fabric Technology',
  'Sumaiya Akter',
  TRUE
);

-- ═══════════════════════════════════════════════════════════════
--  DONE! Your database is ready.
--  Next: Create an admin user in Supabase Dashboard → Auth → Users
-- ═══════════════════════════════════════════════════════════════
