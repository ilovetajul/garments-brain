# 🧠 Garments Brain — Full-Stack Industry Knowledge Platform

A complete React + Supabase web application for garment industry professionals.

## ✅ Features

### Public Site
- **Homepage** — Hero, feature cards, manufacturing accordion (3/10 steps), recent articles, tools CTA
- **Knowledge Library** — Grid layout with search + category filter, featured post layout
- **Blog Post** — Full markdown-rendered article with related posts
- **GSM Calculator** — Fully functional fabric weight calculator with category classification
- **Glossary** — 500+ industry terms, bilingual EN+বাং, A-Z filter
- **Courses** — Course listing with progress states
- **Contact** — Contact form

### Admin CMS (`/admin`)
- **Secure Login** — Supabase Auth, route protection
- **Dashboard** — Stats overview, recent posts, quick actions
- **Manage Posts** — Data table with publish toggle, edit, delete, search
- **Post Editor** — Create / edit with Markdown editor, toolbar, image upload, meta fields

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Supabase
```bash
cp .env.example .env
# Edit .env with your Supabase URL and anon key
```

### 3. Set up the database
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Open your project → **SQL Editor** → **New Query**
3. Paste and run `supabase-schema.sql`

### 4. Create an admin user
1. Supabase Dashboard → **Authentication** → **Users** → **Add User**
2. Enter your admin email and password
3. Use these to log in at `/admin/login`

### 5. (Optional) Enable Storage for image uploads
The `supabase-schema.sql` already creates the bucket, but verify:
- Supabase Dashboard → **Storage** → confirm `garments-brain` bucket exists
- Bucket should be **public**

### 6. Start development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

## 📁 Project Structure

```
garments-brain/
├── src/
│   ├── components/
│   │   ├── admin/       # AdminLayout sidebar
│   │   ├── blog/        # PostCard component
│   │   ├── layout/      # Navbar, Footer, ProtectedRoute
│   │   └── ui/          # Shared UI primitives
│   ├── context/
│   │   └── AuthContext  # Supabase auth state
│   ├── data/
│   │   └── seed.js      # Dummy data + glossary + steps
│   ├── lib/
│   │   └── supabase.js  # Client + CRUD API helpers
│   └── pages/
│       ├── admin/       # Login, Dashboard, ManagePosts, PostEditor
│       ├── Home.jsx
│       ├── KnowledgeLibrary.jsx
│       ├── BlogPost.jsx
│       ├── Tools.jsx
│       ├── Glossary.jsx
│       └── Courses.jsx
├── supabase-schema.sql  # ← Run this in Supabase
├── .env.example
└── README.md
```

## 🎨 Design System

| Token | Value |
|---|---|
| Primary (Navy) | `#1A365D` |
| Accent (Orange) | `#EA580C` |
| Font Display | Sora |
| Font Body | DM Sans |
| Font Mono | JetBrains Mono |

## 🗄️ Database Schema

**`blogs` table**

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `title` | TEXT | Required |
| `slug` | TEXT | Unique URL identifier |
| `excerpt` | TEXT | Summary for cards |
| `content` | TEXT | Markdown body |
| `image_url` | TEXT | Thumbnail URL |
| `category` | TEXT | Content category |
| `author` | TEXT | Author name |
| `published` | BOOLEAN | Public visibility |
| `created_at` | TIMESTAMPTZ | Auto-set |
| `updated_at` | TIMESTAMPTZ | Auto-updated |

## 🏗️ Tech Stack

- **Frontend:** React 18 + Vite, Tailwind CSS v3, Lucide Icons, React Router v6
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Markdown:** react-markdown
- **Notifications:** react-hot-toast
- **Build:** Vite

## 📦 Build for Production

```bash
npm run build
# Output in /dist — deploy to Vercel, Netlify, etc.
```

### Vercel deploy (recommended)
```bash
# Install Vercel CLI
npm i -g vercel
vercel

# Add environment variables in Vercel Dashboard or:
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```
