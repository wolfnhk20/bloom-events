//
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import { eventsApi } from '../lib/api'
import toast from 'react-hot-toast'
import {
  CalendarDays, Users, DollarSign, Package, Sparkles, Plus,
  ChevronRight, Clock, MapPin, CheckCircle2, AlertCircle,
  Flower2, Trash2, Eye, XCircle
} from 'lucide-react'
import { format } from 'date-fns'

const STATUS_CONFIG = {
  PENDING:   { label: 'Pending',   color: 'bg-amber-500/15 text-amber-300 border-amber-500/20' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-green-500/15 text-green-300 border-green-500/20' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-500/15 text-red-300 border-red-500/20' },
  COMPLETED: { label: 'Completed', color: 'bg-blush-500/15 text-blush-300 border-blush-500/20' },
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    eventsApi.getAll()
      .then(res => setEvents(res.data))
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Cancel this event?')) return
    try {
      await eventsApi.delete(id)
      setEvents(prev => prev.filter(e => e.id !== id))
      if (selectedEvent?.id === id) setSelectedEvent(null)
      toast.success('Event cancelled')
    } catch {
      toast.error('Failed to cancel event')
    }
  }

  const totalSpend = events.reduce((s, e) => s + Number(e.totalCost || 0), 0)
  const totalGuests = events.reduce((s, e) => s + (e.guestCount || 0), 0)

  const statsCards = [
    { label: 'My Events', value: events.length, icon: <CalendarDays size={18} />, color: 'text-blush-400', bg: 'bg-blush-500/10' },
    { label: 'Total Guests', value: totalGuests, icon: <Users size={18} />, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { label: 'Total Spend', value: `₹${totalSpend.toLocaleString('en-IN')}`, icon: <DollarSign size={18} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Upcoming', value: events.filter(e => e.status === 'CONFIRMED').length, icon: <CheckCircle2 size={18} />, color: 'text-green-400', bg: 'bg-green-500/10' },
  ]

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">

        {/* Welcome header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/40 text-sm font-body mb-1">Welcome back,</p>
              <h1 className="font-display text-3xl text-white">
                {user?.displayName} <span className="gradient-text italic">✦</span>
              </h1>
            </div>
            <button onClick={() => navigate('/book')} className="btn-primary self-start sm:self-auto">
              <Plus size={16} />
              Plan New Event
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card p-5"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.bg}`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <p className="text-2xl font-display text-white mb-0.5">{stat.value}</p>
              <p className="text-white/40 text-xs font-body">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Events section */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Events list */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-white">My Events</h2>
              <span className="text-white/30 text-xs font-body">{events.length} total</span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="glass-card p-4 rounded-xl animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="glass-card p-10 text-center rounded-2xl">
                <Flower2 size={32} className="text-blush-400/40 mx-auto mb-3" />
                <p className="text-white/40 font-body text-sm mb-4">No events yet</p>
                <button onClick={() => navigate('/book')} className="btn-primary text-sm py-2 px-5">
                  <Plus size={14} /> Plan your first event
                </button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {events.map((event, i) => {
                  const statusCfg = STATUS_CONFIG[event.status] || STATUS_CONFIG.PENDING
                  const isSelected = selectedEvent?.id === event.id
                  return (
                    <motion.button
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => setSelectedEvent(isSelected ? null : event)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? 'border-blush-400/40 bg-blush-500/8'
                          : 'glass-card hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-body font-medium text-sm truncate">{event.eventName}</p>
                          <div className="flex items-center gap-1.5 mt-1.5 text-white/40 text-xs font-body">
                            <Clock size={10} />
                            {event.eventDate ? format(new Date(event.eventDate), 'MMM d, yyyy') : '—'}
                          </div>
                        </div>
                        <span className={`badge border text-xs flex-shrink-0 ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Event detail */}
          <div className="lg:col-span-3">
            {selectedEvent ? (
              <motion.div
                key={selectedEvent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-7 rounded-2xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-display text-xl text-white mb-1">{selectedEvent.eventName}</h3>
                    <span className={`badge border text-xs ${STATUS_CONFIG[selectedEvent.status]?.color}`}>
                      {STATUS_CONFIG[selectedEvent.status]?.label}
                    </span>
                  </div>
                  <button onClick={() => handleDelete(selectedEvent.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: <CalendarDays size={14} />, label: 'Date', value: selectedEvent.eventDate ? format(new Date(selectedEvent.eventDate), 'EEEE, MMM d yyyy') : '—' },
                    { icon: <Clock size={14} />, label: 'Time', value: selectedEvent.eventTime || '—' },
                    { icon: <MapPin size={14} />, label: 'Venue', value: selectedEvent.venueName || 'Not set' },
                    { icon: <Users size={14} />, label: 'Guests', value: `${selectedEvent.guestCount} guests` },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-2.5">
                      <span className="text-blush-400 mt-0.5 flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-white/40 text-xs font-body">{item.label}</p>
                        <p className="text-white text-sm font-body">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedEvent.selectedPackage && (
                  <div className="p-4 rounded-xl bg-blush-500/8 border border-blush-400/15 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Package size={13} className="text-blush-400" />
                      <p className="text-blush-300 text-xs font-body font-medium">Selected Package</p>
                    </div>
                    <p className="text-white font-body font-medium">{selectedEvent.selectedPackage?.name}</p>
                    <p className="text-white/40 text-xs font-body mt-0.5">
                      ₹{Number(selectedEvent.selectedPackage?.basePrice || 0).toLocaleString('en-IN')} base price
                    </p>
                  </div>
                )}

                {selectedEvent.services?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-white/40 text-xs font-body uppercase tracking-wide mb-2.5">Add-on Services</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.services.map(s => (
                        <span key={s.id} className="badge bg-white/5 border border-white/10 text-white/60 text-xs">{s.name}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEvent.guests?.length > 0 && (
                  <div className="mb-6">
                    <p className="text-white/40 text-xs font-body uppercase tracking-wide mb-2.5">
                      Guest List ({selectedEvent.guests.length})
                    </p>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-hide">
                      {selectedEvent.guests.map(g => (
                        <div key={g.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/3">
                          <span className="text-white/70 text-xs font-body">{g.name}</span>
                          {g.dietaryPreference && (
                            <span className="badge bg-teal-500/10 text-teal-400 text-xs border-0">{g.dietaryPreference}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cost summary */}
                <div className="pt-4 border-t border-white/8">
                  <div className="flex justify-between items-center">
                    <p className="text-white/50 font-body text-sm">Estimated Total</p>
                    <p className="font-display text-2xl gradient-text">
                      ₹{Number(selectedEvent.totalCost || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-10 rounded-2xl flex flex-col items-center justify-center min-h-64 text-center">
                <Sparkles size={28} className="text-blush-400/40 mb-3" />
                <p className="text-white/30 font-body text-sm">Select an event to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
