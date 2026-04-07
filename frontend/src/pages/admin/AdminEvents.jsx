// src/pages/admin/AdminEvents.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { adminApi } from '../../lib/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { Trash2, CheckCircle2, Clock, XCircle, Search, Filter } from 'lucide-react'

const STATUS_CONFIG = {
  PENDING:   { label: 'Pending',   color: 'bg-amber-500/15 text-amber-300 border-amber-500/20' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-green-500/15 text-green-300 border-green-500/20' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500/15 text-red-300 border-red-500/20' },
  COMPLETED: { label: 'Completed', color: 'bg-blush-500/15 text-blush-300 border-blush-500/20' },
}

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const load = () => {
    setLoading(true)
    adminApi.getAllEvents({ status: statusFilter || undefined })
      .then(res => setEvents(res.data))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [statusFilter])

  const handleStatusChange = async (id, status) => {
    try {
      await adminApi.updateEventStatus(id, status)
      setEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e))
      toast.success('Status updated')
    } catch { toast.error('Failed to update') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event permanently?')) return
    try {
      await adminApi.deleteEvent(id)
      setEvents(prev => prev.filter(e => e.id !== id))
      toast.success('Event deleted')
    } catch { toast.error('Failed to delete') }
  }

  const filtered = events.filter(e =>
    e.eventName?.toLowerCase().includes(search.toLowerCase()) ||
    e.user?.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-white mb-1">Manage Events</h1>
        <p className="text-white/40 text-sm font-body">View and manage all events</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input className="input-field pl-9 text-sm py-2.5" placeholder="Search events..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field py-2.5 text-sm w-auto"
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['Event', 'Date', 'Guests', 'Package', 'Total', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-white/40 text-xs font-body uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-white/8 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-white/30 font-body text-sm">No events found</td></tr>
              ) : (
                filtered.map((event, i) => {
                  const statusCfg = STATUS_CONFIG[event.status] || STATUS_CONFIG.PENDING
                  return (
                    <motion.tr key={event.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-white text-sm font-body font-medium">{event.eventName}</p>
                          <p className="text-white/30 text-xs font-body">{event.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-white/60 text-sm font-body">
                        {event.eventDate ? format(new Date(event.eventDate), 'MMM d, yyyy') : '—'}
                      </td>
                      <td className="px-5 py-4 text-white/60 text-sm font-body">{event.guestCount}</td>
                      <td className="px-5 py-4 text-white/60 text-sm font-body">{event.selectedPackage?.name || '—'}</td>
                      <td className="px-5 py-4 text-white text-sm font-body">₹{Number(event.totalCost || 0).toLocaleString('en-IN')}</td>
                      <td className="px-5 py-4">
                        <select
                          value={event.status}
                          onChange={e => handleStatusChange(event.id, e.target.value)}
                          className={`badge border text-xs font-body py-1 px-2 rounded-lg bg-transparent cursor-pointer ${statusCfg.color}`}
                          style={{ outline: 'none' }}>
                          {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                            <option key={val} value={val} className="bg-midnight-950 text-white">{cfg.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => handleDelete(event.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
