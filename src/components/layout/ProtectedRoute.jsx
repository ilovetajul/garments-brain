import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950">
      <Loader2 size={32} className="text-brand-orange animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />
  return children
}
