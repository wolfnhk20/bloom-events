// src/pages/LoginPage.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Flower2, Sparkles, Baby, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { isAuthenticated, loading, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && isAuthenticated ) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, loading, navigate])

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (err) {
      toast.error('Failed to sign in. Please try again.')
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #dc4878 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #a8214d 0%, transparent 70%)' }} />
        {/* Floating elements */}
        {[Baby, Heart, Flower2, Sparkles].map((Icon, i) => (
          <motion.div key={i}
            className="absolute opacity-10 text-blush-400"
            style={{ left: `${15 + i * 22}%`, top: `${20 + (i % 2) * 40}%` }}
            animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
          >
            <Icon size={24 + i * 6} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-card border border-white/15 p-10 shadow-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)' }}>

          {/* Logo */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6, delay: 0.2 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #dc4878, #a8214d)', boxShadow: '0 8px 32px rgba(220,72,120,0.35)' }}
            >
              <Flower2 size={28} className="text-white" />
            </motion.div>

            <h1 className="font-display text-3xl text-white mb-2">
              Welcome to <span className="gradient-text italic">Bloom</span>
            </h1>
            <p className="text-white/50 text-sm font-body leading-relaxed">
              Sign in to plan your perfect baby shower<br />or naming ceremony
            </p>
          </div>

          {/* Google button */}
          <motion.button
            onClick={handleGoogleLogin}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 transition-all duration-200 font-body font-medium text-white text-sm group"
          >
            {/* Google SVG */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
            </svg>
            Continue with Google
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-white/40">→</span>
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs font-body">Secure OAuth 2.0</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Features list */}
          <div className="space-y-3">
            {[
              'Multi-step booking wizard',
              'Package & service selection',
              'Guest list management',
              'Real-time cost calculation',
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="flex items-center gap-2.5"
              >
                <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(220,72,120,0.2)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-blush-400" />
                </div>
                <span className="text-white/50 text-xs font-body">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-6"
        >
          <button onClick={() => navigate('/')}
            className="text-white/30 text-sm font-body hover:text-white/60 transition-colors">
            ← Back to home
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
