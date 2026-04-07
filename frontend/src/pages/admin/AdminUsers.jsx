// src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { adminApi } from '../../lib/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Users, Search, Shield, User } from 'lucide-react'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    adminApi.getAllUsers()
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-white mb-1">Manage Users</h1>
        <p className="text-white/40 text-sm font-body">View all registered users</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        <input className="input-field pl-9 text-sm py-2.5" placeholder="Search by name or email..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Users', value: users.length, color: 'text-blush-400' },
          { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, color: 'text-amber-400' },
          { label: 'Regular Users', value: users.filter(u => u.role === 'USER').length, color: 'text-teal-400' },
        ].map(stat => (
          <div key={stat.label} className="glass-card p-5">
            <p className={`text-2xl font-display ${stat.color}`}>{stat.value}</p>
            <p className="text-white/40 text-xs font-body">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['User', 'Email', 'Role', 'Events', 'Joined'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-white/40 text-xs font-body uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-white/8 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <Users size={28} className="text-white/20 mx-auto mb-2" />
                    <p className="text-white/30 font-body text-sm">No users found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((user, i) => (
                  <motion.tr key={user.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #dc4878, #a8214d)' }}>
                            {user.fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <span className="text-white text-sm font-body">{user.fullName || '—'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/60 text-sm font-body">{user.email}</td>
                    <td className="px-5 py-4">
                      {user.role === 'ADMIN' ? (
                        <span className="badge bg-amber-500/15 text-amber-300 border border-amber-500/20 text-xs">
                          <Shield size={10} /> Admin
                        </span>
                      ) : (
                        <span className="badge bg-white/5 text-white/50 border border-white/10 text-xs">
                          <User size={10} /> User
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-white/60 text-sm font-body">
                      {user.eventCount ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-white/40 text-sm font-body">
                      {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : '—'}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
