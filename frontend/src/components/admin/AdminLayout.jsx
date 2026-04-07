// src/components/admin/AdminLayout.jsx
import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  LayoutDashboard, CalendarDays, Package, Sparkles, Users,
  LogOut, Flower2, Menu, X, ChevronRight
} from 'lucide-react'

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={17} />, end: true },
  { path: '/admin/events', label: 'Events', icon: <CalendarDays size={17} /> },
  { path: '/admin/packages', label: 'Packages', icon: <Package size={17} /> },
  { path: '/admin/services', label: 'Services', icon: <Sparkles size={17} /> },
  { path: '/admin/users', label: 'Users', icon: <Users size={17} /> },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    try { await signOut(); navigate('/') }
    catch { toast.error('Sign out failed') }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/8">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #dc4878, #a8214d)' }}>
          <Flower2 size={14} className="text-white" />
        </div>
        <div>
          <p className="font-display text-sm text-white">Bloom Events</p>
          <p className="text-white/40 text-xs font-body">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body transition-all duration-200 ${
                isActive
                  ? 'text-white font-medium'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, rgba(220,72,120,0.15), rgba(168,33,77,0.08))',
              border: '1px solid rgba(220,72,120,0.2)',
            } : {}}
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-blush-400' : ''}>{item.icon}</span>
                {item.label}
                {isActive && <ChevronRight size={13} className="ml-auto text-blush-400/60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile & logout */}
      <div className="px-3 py-4 border-t border-white/8 space-y-1">
        <div className="flex items-center gap-3 px-4 py-2.5">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #dc4878, #a8214d)' }}>
              {user?.displayName?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-body font-medium truncate">{user?.displayName}</p>
            <p className="text-white/30 text-xs font-body">Administrator</p>
          </div>
        </div>
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body text-white/40 hover:text-red-400 hover:bg-red-500/8 transition-all duration-200">
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col fixed top-0 left-0 bottom-0 z-40 border-r border-white/8"
        style={{ background: 'rgba(10, 3, 8, 0.9)', backdropFilter: 'blur(20px)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-64 z-50 border-r border-white/10 lg:hidden"
              style={{ background: 'rgba(10, 3, 8, 0.98)', backdropFilter: 'blur(20px)' }}>
              <button onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 text-white/40">
                <X size={16} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-4 border-b border-white/8 sticky top-0 z-30 backdrop-blur-xl"
          style={{ background: 'rgba(10,3,8,0.9)' }}>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/5">
            <Menu size={18} className="text-white" />
          </button>
          <span className="font-display text-white text-sm">Admin Panel</span>
        </div>

        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
