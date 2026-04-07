// src/pages/admin/AdminServices.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { servicesApi } from '../../lib/api'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Sparkles, Search } from 'lucide-react'

const CATEGORIES = ['DECORATION', 'MEDIA', 'ENTERTAINMENT', 'CATERING', 'GIFTS', 'STATIONERY', 'VENUE', 'ACTIVITIES']

const EMPTY_FORM = { name: '', description: '', price: '', category: 'DECORATION', icon: '' }

const CATEGORY_COLORS = {
  DECORATION: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
  MEDIA: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  ENTERTAINMENT: 'bg-purple-500/15 text-purple-300 border-purple-500/20',
  CATERING: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  GIFTS: 'bg-teal-500/15 text-teal-300 border-teal-500/20',
  STATIONERY: 'bg-green-500/15 text-green-300 border-green-500/20',
  VENUE: 'bg-orange-500/15 text-orange-300 border-orange-500/20',
  ACTIVITIES: 'bg-red-500/15 text-red-300 border-red-500/20',
}

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')

  const load = () => {
    servicesApi.getAll()
      .then(res => setServices(res.data))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit = (svc) => {
    setEditing(svc)
    setForm({ name: svc.name, description: svc.description || '', price: svc.price, category: svc.category, icon: svc.icon || '' })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price required'); return }
    setSaving(true)
    const payload = { ...form, price: Number(form.price) }
    try {
      if (editing) {
        const res = await servicesApi.update(editing.id, payload)
        setServices(prev => prev.map(s => s.id === editing.id ? res.data : s))
        toast.success('Service updated')
      } else {
        const res = await servicesApi.create(payload)
        setServices(prev => [...prev, res.data])
        toast.success('Service created')
      }
      setModalOpen(false)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    try {
      await servicesApi.delete(id)
      setServices(prev => prev.filter(s => s.id !== id))
      toast.success('Service deleted')
    } catch { toast.error('Delete failed') }
  }

  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !catFilter || s.category === catFilter
    return matchSearch && matchCat
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Manage Services</h1>
          <p className="text-white/40 text-sm font-body">Add and edit event add-on services</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-5">
          <Plus size={15} /> New Service
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input className="input-field pl-9 text-sm py-2.5" placeholder="Search services..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field py-2.5 text-sm w-auto"
          value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Services grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card p-5 animate-pulse space-y-2">
              <div className="h-4 bg-white/10 rounded w-2/3" />
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-5 bg-white/10 rounded w-1/3 mt-2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-14 text-center">
          <Sparkles size={28} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/30 font-body text-sm">{search || catFilter ? 'No services match your filter' : 'No services yet'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((svc, i) => {
            const catColor = CATEGORY_COLORS[svc.category] || 'bg-gray-500/15 text-gray-300'
            return (
              <motion.div key={svc.id}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card p-5 group">
                <div className="flex items-start justify-between mb-3">
                  <span className={`badge border text-xs ${catColor}`}>{svc.category}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(svc)}
                      className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => handleDelete(svc.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <h3 className="font-body font-semibold text-white text-sm mb-1">{svc.name}</h3>
                {svc.description && (
                  <p className="text-white/40 text-xs font-body leading-relaxed mb-3 line-clamp-2">{svc.description}</p>
                )}
                <p className="text-blush-300 font-display text-lg">
                  ₹{Number(svc.price).toLocaleString('en-IN')}
                </p>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md glass-card p-7 border border-white/15 shadow-2xl"
                style={{ background: 'rgba(15, 5, 11, 0.97)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl text-white">{editing ? 'Edit Service' : 'New Service'}</h2>
                  <button onClick={() => setModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Service Name *', key: 'name', placeholder: 'e.g. Professional Photography' },
                    { label: 'Description', key: 'description', placeholder: 'Brief description of the service', textarea: true },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-white/50 text-xs font-body uppercase tracking-wide mb-1.5">{field.label}</label>
                      {field.textarea ? (
                        <textarea className="input-field resize-none" rows={2} placeholder={field.placeholder}
                          value={form[field.key]}
                          onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))} />
                      ) : (
                        <input className="input-field" placeholder={field.placeholder}
                          value={form[field.key]}
                          onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))} />
                      )}
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/50 text-xs font-body uppercase tracking-wide mb-1.5">Price (₹) *</label>
                      <input type="number" className="input-field" placeholder="12000"
                        value={form.price}
                        onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-white/50 text-xs font-body uppercase tracking-wide mb-1.5">Category</label>
                      <select className="input-field" value={form.category}
                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs font-body uppercase tracking-wide mb-1.5">Icon Key</label>
                    <input className="input-field" placeholder="e.g. camera, music, flower"
                      value={form.icon}
                      onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                    {saving && <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                    {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Service'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
