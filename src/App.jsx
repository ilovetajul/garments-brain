import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import Navbar         from '@/components/layout/Navbar'
import Footer         from '@/components/layout/Footer'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import AdminLayout    from '@/components/admin/AdminLayout'

import Home              from '@/pages/Home'
import KnowledgeLibrary  from '@/pages/KnowledgeLibrary'
import BlogPost          from '@/pages/BlogPost'
import Tools             from '@/pages/Tools'
import Glossary          from '@/pages/Glossary'
import { Courses }       from '@/pages/Courses'
import { Contact }       from '@/pages/Courses'   // co-located

import AdminLogin   from '@/pages/admin/Login'
import Dashboard    from '@/pages/admin/Dashboard'
import ManagePosts  from '@/pages/admin/ManagePosts'
import PostEditor   from '@/pages/admin/PostEditor'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Public layout wrapper
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

// 404
function NotFound() {
  return (
    <div className="pt-[68px] min-h-screen flex flex-col items-center justify-center text-center p-8">
      <div className="text-8xl mb-6">🧠</div>
      <h1 className="font-display font-bold text-4xl text-navy-800 mb-3">404 — Page Not Found</h1>
      <p className="text-slate-500 mb-8">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn btn-primary">Go Home</a>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/knowledge-library" element={<PublicLayout><KnowledgeLibrary /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />
        <Route path="/tools"   element={<PublicLayout><Tools /></PublicLayout>} />
        <Route path="/glossary" element={<PublicLayout><Glossary /></PublicLayout>} />
        <Route path="/courses"  element={<PublicLayout><Courses /></PublicLayout>} />
        <Route path="/contact"  element={<PublicLayout><Contact /></PublicLayout>} />

        {/* ── Admin auth ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Admin protected ── */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="posts"     element={<ManagePosts />} />
          <Route path="new"       element={<PostEditor />} />
          <Route path="edit/:id"  element={<PostEditor />} />
        </Route>

        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </>
  )
}
