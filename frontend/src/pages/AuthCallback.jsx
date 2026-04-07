// src/pages/AuthCallback.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Flower2 } from 'lucide-react'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    })
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
        style={{ background: 'linear-gradient(135deg, #dc4878, #a8214d)' }}>
        <Flower2 size={24} className="text-white" />
      </div>
      <div className="text-center">
        <p className="text-white font-body text-lg mb-1">Signing you in…</p>
        <p className="text-white/40 text-sm font-body">Please wait a moment</p>
      </div>
      <div className="w-8 h-8 rounded-full border-2 border-blush-400 border-t-transparent animate-spin" />
    </div>
  )
}
