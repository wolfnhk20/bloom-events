// src/pages/BookingPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import { packagesApi, servicesApi, eventsApi } from '../lib/api'
import toast from 'react-hot-toast'
import {
  CalendarDays, Clock, MapPin, Users, Baby, ArrowLeft, ArrowRight,
  CheckCircle2, Flower2, Package, Sparkles, UserPlus, Trash2, Crown
} from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Event Details', icon: <CalendarDays size={16} /> },
  { id: 2, label: 'Package', icon: <Package size={16} /> },
  { id: 3, label: 'Services', icon: <Sparkles size={16} /> },
  { id: 4, label: 'Guest List', icon: <Users size={16} /> },
]

const SERVICE_CATEGORIES = ['ALL', 'DECORATION', 'MEDIA', 'ENTERTAINMENT', 'CATERING', 'GIFTS', 'STATIONERY', 'VENUE']

export default function BookingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [packages, setPackages] = useState([])
  const [services, setServices] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  // Form state
  const [eventDetails, setEventDetails] = useState({
    eventName: '', eventType: 'BABY_SHOWER',
    eventDate: '', eventTime: '14:00',
    venueName: '', venueAddress: '', guestCount: 20, specialNotes: '',
  })
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])
  const [guests, setGuests] = useState([])
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '', dietaryPreference: '' })
  const [recommendation, setRecommendation] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [pkgs, svcs] = await Promise.all([packagesApi.getAll(), servicesApi.getAll()])
        setPackages(pkgs.data)
        setServices(svcs.data)
      } catch (e) {
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (eventDetails.guestCount >= 1) {
      packagesApi.recommend(eventDetails.guestCount)
        .then(res => setRecommendation(res.data))
        .catch(() => { })
    }
  }, [eventDetails.guestCount])

  const totalCost = () => {
    let cost = 0
    if (selectedPackage) cost += Number(selectedPackage.basePrice)
    selectedServices.forEach(s => cost += Number(s.price))
    cost += eventDetails.guestCount * 500 // catering per guest
    return cost
  }

  const handleNext = () => {
    if (step === 1) {
      if (!eventDetails.eventName || !eventDetails.eventDate || !eventDetails.eventTime) {
        toast.error('Please fill in all required fields')
        return
      }
    }
    if (step < 4) setStep(s => s + 1)
    else handleSubmit()
  }

  const handleSubmit = async () => {
    if (!selectedPackage) { toast.error('Please select a package'); setStep(2); return }
    setSubmitting(true)
    try {
      const payload = {
        ...eventDetails,
        packageId: selectedPackage.id,
        serviceIds: selectedServices.map(s => s.id),
        guestCount: guests.length,
      }
      await eventsApi.create(payload)
      toast.success('🎉 Event booked successfully!')
      navigate('/dashboard')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleService = (service) => {
    setSelectedServices(prev =>
      prev.find(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service]
    )
  }

  const addGuest = () => {
    if (!newGuest.name.trim()) { toast.error('Guest name is required'); return }
    setGuests(prev => [...prev, { ...newGuest, id: Date.now() }])
    setNewGuest({ name: '', email: '', phone: '', dietaryPreference: '' })
  }

  const filteredServices = categoryFilter === 'ALL'
    ? services
    : services.filter(s => s.category === categoryFilter)

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-white mb-2">
            Book Your <span className="gradient-text italic">Celebration</span>
          </h1>
          <p className="text-white/40 font-body text-sm">Complete all steps to confirm your event</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <motion.button
                onClick={() => step > s.id && setStep(s.id)}
                whileHover={step > s.id ? { scale: 1.05 } : {}}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${step === s.id
                    ? 'text-white font-medium'
                    : step > s.id
                      ? 'text-blush-300 cursor-pointer'
                      : 'text-white/30 cursor-default'
                  }`}
                style={step === s.id ? {
                  background: 'linear-gradient(135deg, rgba(220,72,120,0.2), rgba(168,33,77,0.1))',
                  border: '1px solid rgba(220,72,120,0.3)',
                } : {}}
              >
                <div className={`step-indicator ${step > s.id ? 'bg-blush-500/20 border-blush-400 text-blush-400' :
                    step === s.id ? 'border-blush-400 text-white' :
                      'border-white/20 text-white/30'
                  }`}>
                  {step > s.id ? <CheckCircle2 size={14} className="text-blush-400" /> : s.icon}
                </div>
                <span className="hidden sm:block text-sm font-body">{s.label}</span>
              </motion.button>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-px mx-1 transition-colors duration-300 ${step > s.id ? 'bg-blush-400/50' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* ── Step 1: Event Details ── */}
            {step === 1 && (
              <div className="glass-card p-8 space-y-6">
                <StepHeader icon={<CalendarDays size={20} />} title="Event Details" subtitle="Tell us about your celebration" />
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Label>Event Name *</Label>
                    <input className="input-field mt-1.5" placeholder="e.g. Aanya's Baby Shower"
                      value={eventDetails.eventName}
                      onChange={e => setEventDetails(p => ({ ...p, eventName: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Event Type *</Label>
                    <select className="input-field mt-1.5"
                      value={eventDetails.eventType}
                      onChange={e => setEventDetails(p => ({ ...p, eventType: e.target.value }))}>
                      <option value="BABY_SHOWER">Baby Shower</option>
                      <option value="NAMING_CEREMONY">Naming Ceremony</option>
                      <option value="BOTH">Both</option>
                    </select>
                  </div>
                  <div>
                    <Label>Expected Guests *</Label>
                    <div className="relative mt-1.5">
                      <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                      <input type="number" min="1" max="500" className="input-field pl-9"
                        value={eventDetails.guestCount}
                        onChange={e => setEventDetails(p => ({ ...p, guestCount: Number(e.target.value) }))} />
                    </div>
                    {recommendation && (
                      <p className="text-blush-400 text-xs font-body mt-1.5 flex items-center gap-1">
                        <Sparkles size={10} />
                        Recommended: {recommendation.packageName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Event Date *</Label>
                    <input type="date" className="input-field mt-1.5"
                      min={new Date().toISOString().split('T')[0]}
                      value={eventDetails.eventDate}
                      onChange={e => setEventDetails(p => ({ ...p, eventDate: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Event Time *</Label>
                    <input type="time" className="input-field mt-1.5"
                      value={eventDetails.eventTime}
                      onChange={e => setEventDetails(p => ({ ...p, eventTime: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Venue Name</Label>
                    <div className="relative mt-1.5">
                      <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                      <input className="input-field pl-9" placeholder="The Grand Hall"
                        value={eventDetails.venueName}
                        onChange={e => setEventDetails(p => ({ ...p, venueName: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <Label>Venue Address</Label>
                    <input className="input-field mt-1.5" placeholder="123 Garden Road, Mumbai"
                      value={eventDetails.venueAddress}
                      onChange={e => setEventDetails(p => ({ ...p, venueAddress: e.target.value }))} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Special Notes</Label>
                    <textarea className="input-field mt-1.5 resize-none" rows={3}
                      placeholder="Any special requirements, dietary restrictions, theme preferences..."
                      value={eventDetails.specialNotes}
                      onChange={e => setEventDetails(p => ({ ...p, specialNotes: e.target.value }))} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Package Selection ── */}
            {step === 2 && (
              <div className="space-y-4">
                <StepHeader icon={<Package size={20} />} title="Select Package" subtitle="Choose the perfect package for your event" />
                {recommendation && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-blush-500/10 border border-blush-400/20">
                    <Sparkles size={14} className="text-blush-400 flex-shrink-0" />
                    <p className="text-blush-300 text-sm font-body">{recommendation.reason}</p>
                  </div>
                )}
                {loading ? <LoadingCards /> : (
                  <div className="grid md:grid-cols-3 gap-4">
                    {packages.map(pkg => (
                      <motion.button key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                        className={`text-left p-6 rounded-2xl border-2 transition-all duration-200 ${selectedPackage?.id === pkg.id
                            ? 'border-blush-400 shadow-[0_0_25px_rgba(220,72,120,0.2)]'
                            : 'border-white/10 hover:border-white/20 glass-card'
                          }`}
                        style={selectedPackage?.id === pkg.id ? {
                          background: 'linear-gradient(135deg, rgba(220,72,120,0.12), rgba(168,33,77,0.06))',
                        } : {}}>
                        {pkg.isPopular && (
                          <span className="badge bg-blush-500/20 text-blush-300 text-xs mb-3 flex items-center gap-1 w-fit">
                            <Crown size={10} /> Popular
                          </span>
                        )}
                        <p className="font-display text-xl text-white mb-1">{pkg.name}</p>
                        <p className="text-white/40 text-xs font-body mb-3">Up to {pkg.maxGuests} guests</p>
                        <p className="text-2xl font-display gradient-text mb-4">
                          ₹{Number(pkg.basePrice).toLocaleString('en-IN')}
                        </p>
                        <ul className="space-y-2">
                          {(pkg.features || []).slice(0, 4).map(f => (
                            <li key={f} className="flex items-start gap-2 text-xs font-body text-white/60">
                              <CheckCircle2 size={11} className="text-blush-400 mt-0.5 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        {selectedPackage?.id === pkg.id && (
                          <div className="mt-4 flex items-center gap-1.5 text-blush-300 text-xs font-medium">
                            <CheckCircle2 size={14} className="fill-blush-400 text-midnight-950" />
                            Selected
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Step 3: Services ── */}
            {step === 3 && (
              <div className="space-y-5">
                <StepHeader icon={<Sparkles size={20} />} title="Add-on Services" subtitle="Enhance your event with additional services" />
                {/* Category filters */}
                <div className="flex flex-wrap gap-2">
                  {SERVICE_CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${categoryFilter === cat
                          ? 'text-white border border-blush-400/40'
                          : 'text-white/40 border border-white/10 hover:border-white/20 hover:text-white/60'
                        }`}
                      style={categoryFilter === cat ? { background: 'rgba(220,72,120,0.2)' } : {}}>
                      {cat}
                    </button>
                  ))}
                </div>

                {selectedServices.length > 0 && (
                  <div className="flex items-center gap-2 text-sm font-body text-white/50">
                    <CheckCircle2 size={14} className="text-blush-400" />
                    {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                    <span className="text-blush-300">
                      (+₹{selectedServices.reduce((s, x) => s + Number(x.price), 0).toLocaleString('en-IN')})
                    </span>
                  </div>
                )}

                {loading ? <LoadingCards /> : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {filteredServices.map(svc => {
                      const active = selectedServices.find(s => s.id === svc.id)
                      return (
                        <motion.button key={svc.id}
                          onClick={() => toggleService(svc)}
                          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                          className={`text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${active
                              ? 'border-blush-400/40 bg-blush-500/10'
                              : 'border-white/10 hover:border-white/20 glass-card'
                            }`}>
                          <div>
                            <p className="font-body font-medium text-sm text-white">{svc.name}</p>
                            <p className="text-white/40 text-xs font-body mt-0.5">{svc.description}</p>
                            <p className="text-blush-300 text-sm font-medium font-body mt-1.5">
                              ₹{Number(svc.price).toLocaleString('en-IN')}
                            </p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${active ? 'bg-blush-500 border-blush-400' : 'border-white/20'
                            }`}>
                            {active && <CheckCircle2 size={13} className="text-white" />}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── Step 4: Guest List ── */}
            {step === 4 && (
              <div className="space-y-6">
                <StepHeader icon={<Users size={20} />} title="Guest List" subtitle="Add your guests (optional — you can update later)" />

                {/* Add guest form */}
                <div className="glass-card p-5 space-y-4">
                  <p className="text-white/60 text-sm font-body">Add a guest</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Name *</Label>
                      <input className="input-field mt-1" placeholder="Guest name"
                        value={newGuest.name}
                        onChange={e => setNewGuest(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <input className="input-field mt-1" type="email" placeholder="guest@email.com"
                        value={newGuest.email}
                        onChange={e => setNewGuest(p => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <input className="input-field mt-1" placeholder="+91 98765 43210"
                        value={newGuest.phone}
                        onChange={e => setNewGuest(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                    <div>
                      <Label>Dietary Preference</Label>
                      <select className="input-field mt-1"
                        value={newGuest.dietaryPreference}
                        onChange={e => setNewGuest(p => ({ ...p, dietaryPreference: e.target.value }))}>
                        <option value="">None</option>
                        <option value="VEGETARIAN">Vegetarian</option>
                        <option value="VEGAN">Vegan</option>
                        <option value="JAIN">Jain</option>
                        <option value="NON_VEGETARIAN">Non-vegetarian</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={addGuest} className="btn-ghost text-sm py-2 px-5">
                    <UserPlus size={14} /> Add Guest
                  </button>
                </div>

                {/* Guest list */}
                {guests.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-white/50 text-sm font-body">{guests.length} guest{guests.length > 1 ? 's' : ''} added</p>
                    {guests.map((g, i) => (
                      <motion.div key={g.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between px-4 py-3 rounded-xl glass-card">
                        <div>
                          <p className="text-white text-sm font-body font-medium">{g.name}</p>
                          <p className="text-white/40 text-xs font-body">{g.email || g.phone || 'No contact info'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {g.dietaryPreference && (
                            <span className="badge bg-teal-500/15 text-teal-300 border border-teal-500/20 text-xs">
                              {g.dietaryPreference}
                            </span>
                          )}
                          <button onClick={() => setGuests(prev => prev.filter(x => x.id !== g.id))}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-white/30">
                    <Users size={28} className="mx-auto mb-3 opacity-40" />
                    <p className="text-sm font-body">No guests added yet</p>
                  </div>
                )}

                {/* Cost summary */}
                <div className="glass-card p-6 border border-blush-400/20"
                  style={{ background: 'linear-gradient(135deg, rgba(220,72,120,0.08), rgba(168,33,77,0.04))' }}>
                  <p className="text-white/60 text-sm font-body mb-4">Cost Summary</p>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Package', value: selectedPackage ? `₹${Number(selectedPackage.basePrice).toLocaleString('en-IN')}` : '—' },
                      { label: `Services (${selectedServices.length})`, value: `₹${selectedServices.reduce((s, x) => s + Number(x.price), 0).toLocaleString('en-IN')}` },
                      { label: `Catering (${eventDetails.guestCount} × ₹500)`, value: `₹${(eventDetails.guestCount * 500).toLocaleString('en-IN')}` },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between text-sm font-body">
                        <span className="text-white/50">{item.label}</span>
                        <span className="text-white">{item.value}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-white/10 flex justify-between">
                      <span className="font-body font-medium text-white">Estimated Total</span>
                      <span className="font-display text-xl gradient-text">₹{totalCost().toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/dashboard')}
            className="btn-ghost">
            <ArrowLeft size={16} />
            {step > 1 ? 'Back' : 'Cancel'}
          </button>
          <button
            onClick={handleNext}
            disabled={submitting}
            className="btn-primary">
            {submitting ? (
              <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />Booking…</>
            ) : step === 4 ? (
              <><CheckCircle2 size={16} />Confirm Booking</>
            ) : (
              <>Next<ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function StepHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-blush-400"
        style={{ background: 'linear-gradient(135deg, rgba(220,72,120,0.2), rgba(168,33,77,0.1))' }}>
        {icon}
      </div>
      <div>
        <h2 className="font-display text-xl text-white">{title}</h2>
        <p className="text-white/40 text-sm font-body">{subtitle}</p>
      </div>
    </div>
  )
}

function Label({ children }) {
  return <label className="text-white/60 text-xs font-body font-medium uppercase tracking-wide">{children}</label>
}

function LoadingCards() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="glass-card p-6 rounded-2xl animate-pulse space-y-3">
          <div className="h-4 bg-white/10 rounded w-1/2" />
          <div className="h-8 bg-white/10 rounded w-2/3" />
          <div className="space-y-2">
            {[1, 2, 3].map(j => <div key={j} className="h-3 bg-white/5 rounded" />)}
          </div>
        </div>
      ))}
    </div>
  )
}
