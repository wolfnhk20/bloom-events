// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Menu, X, Flower2, LayoutDashboard, Shield, LogOut, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, signOut } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      navigate('/')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl border-b border-white/10 bg-midnight-950/80'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #dc4878, #a8214d)' }}>
              <Flower2 size={16} className="text-white" />
            </div>
            <span className="font-display text-lg font-semibold text-white">
              Bloom <span className="gradient-text">Events</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {['Features', 'Packages', 'About'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-body">
                {item}
              </a>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 group"
                >
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white"
                      style={{ background: 'linear-gradient(135deg, #dc4878, #a8214d)' }}>
                      {user?.displayName?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-white/80 font-body">{user?.displayName}</span>
                  {isAdmin && (
                    <span className="badge bg-blush-500/20 text-blush-300 border border-blush-500/30 text-xs">Admin</span>
                  )}
                  <ChevronDown size={14} className={`text-white/40 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 glass-card border border-white/10 py-1 shadow-2xl"
                      style={{ background: 'rgba(18,6,13,0.95)' }}
                    >
                      <ProfileMenuItem icon={<LayoutDashboard size={14} />} label="Dashboard" onClick={() => { navigate('/dashboard'); setProfileOpen(false) }} />
                      {isAdmin && (
                        <ProfileMenuItem icon={<Shield size={14} />} label="Admin Panel" onClick={() => { navigate('/admin'); setProfileOpen(false) }} />
                      )}
                      <div className="my-1 border-t border-white/10" />
                      <ProfileMenuItem icon={<LogOut size={14} />} label="Sign out" onClick={handleSignOut} danger />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm py-2 px-4">Sign in</Link>
                <Link to="/login" className="btn-primary text-sm py-2 px-4">Book Event</Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
            {menuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-midnight-950/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <MobileMenuItem label="Dashboard" onClick={() => { navigate('/dashboard'); setMenuOpen(false) }} />
                  {isAdmin && <MobileMenuItem label="Admin Panel" onClick={() => { navigate('/admin'); setMenuOpen(false) }} />}
                  <MobileMenuItem label="Sign Out" onClick={handleSignOut} danger />
                </>
              ) : (
                <>
                  <MobileMenuItem label="Sign In" onClick={() => { navigate('/login'); setMenuOpen(false) }} />
                  <MobileMenuItem label="Book Event" onClick={() => { navigate('/login'); setMenuOpen(false) }} primary />
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function ProfileMenuItem({ icon, label, onClick, danger }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-body transition-colors ${
        danger ? 'text-red-400 hover:bg-red-500/10' : 'text-white/70 hover:text-white hover:bg-white/5'
      }`}>
      {icon}
      {label}
    </button>
  )
}

function MobileMenuItem({ label, onClick, primary, danger }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-body transition-colors ${
        primary ? 'btn-primary' :
        danger ? 'text-red-400 hover:bg-red-500/10' :
        'text-white/70 hover:text-white hover:bg-white/5'
      }`}>
      {label}
    </button>
  )
}
