// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { adminApi } from '../../lib/api'
import toast from 'react-hot-toast'
import { CalendarDays, Users, DollarSign, TrendingUp, Clock, CheckCircle2, XCircle, Flower2 } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getStats()
      .then(res => setStats(res.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Total Events', value: stats.totalEvents, icon: <CalendarDays size={20} />, color: 'text-blush-400', bg: 'bg-blush-500/10', change: '+12%' },
    { label: 'Total Users', value: stats.totalUsers, icon: <Users size={20} />, color: 'text-teal-400', bg: 'bg-teal-500/10', change: '+8%' },
    { label: 'Total Revenue', value: `₹${Number(stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: <DollarSign size={20} />, color: 'text-amber-400', bg: 'bg-amber-500/10', change: '+23%' },
    { label: 'Confirmed', value: stats.confirmedEvents, icon: <CheckCircle2 size={20} />, color: 'text-green-400', bg: 'bg-green-500/10', change: '' },
    { label: 'Pending', value: stats.pendingEvents, icon: <Clock size={20} />, color: 'text-orange-400', bg: 'bg-orange-500/10', change: '' },
    { label: 'Total Guests', value: stats.totalGuests, icon: <TrendingUp size={20} />, color: 'text-purple-400', bg: 'bg-purple-500/10', change: '+15%' },
  ] : []

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-white mb-1">Dashboard</h1>
        <p className="text-white/40 text-sm font-body">Overview of all events and activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}>
                <span className={card.color}>{card.icon}</span>
              </div>
              {card.change && (
                <span className="text-green-400 text-xs font-body">{card.change}</span>
              )}
            </div>
            <p className="text-2xl font-display text-white mb-0.5">{card.value}</p>
            <p className="text-white/40 text-xs font-body">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Event type breakdown */}
      {stats?.eventTypeBreakdown?.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="font-display text-lg text-white mb-5">Event Type Breakdown</h2>
          <div className="space-y-3">
            {stats.eventTypeBreakdown.map(item => {
              const total = stats.totalEvents || 1
              const pct = Math.round((item.count / total) * 100)
              return (
                <div key={item.type}>
                  <div className="flex justify-between text-sm font-body mb-1.5">
                    <span className="text-white/70">{item.type.replace(/_/g, ' ')}</span>
                    <span className="text-white/40">{item.count} events ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #dc4878, #a8214d)' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Revenue by month */}
      {stats?.revenueByMonth?.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="font-display text-lg text-white mb-5">Revenue by Month</h2>
          <div className="space-y-2">
            {stats.revenueByMonth.map(item => (
              <div key={item.month} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-white/60 text-sm font-body">{item.month}</span>
                <span className="text-white font-body font-medium text-sm">
                  ₹{Number(item.revenue || 0).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-8 bg-white/10 rounded w-48 animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map(i => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="w-10 h-10 bg-white/10 rounded-xl mb-4" />
            <div className="h-6 bg-white/10 rounded w-16 mb-1" />
            <div className="h-3 bg-white/5 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}
