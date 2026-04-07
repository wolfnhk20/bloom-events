// src/pages/admin/AdminPackages.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { packagesApi } from '../../lib/api'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, CheckCircle2, Crown, Package } from 'lucide-react'

const EMPTY_FORM = {
  name: '', description: '', basePrice: '', maxGuests: '',
  features: '', isPopular: false,
}

export default function AdminPackages() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = () => {
    packagesApi.getAll()
      .then(res => setPackages(res.data))
      .catch(() => toast.error('Failed to load packages'))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModalOpen(true) }
  const openEdit = (pkg) => {
    setEditing(pkg)
    setForm({
      name: pkg.name, description: pkg.description || '',
      basePrice: pkg.basePrice, maxGuests: pkg.maxGuests,
      features: (pkg.features || []).join('\n'), isPopular: pkg.isPopular || false,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!form.name || !form.basePrice || !form.maxGuests) {
      toast.error('Name, price, and max guests are required')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      basePrice: Number(form.basePrice),
      maxGuests: Number(form.maxGuests),
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
    }
    try {
      if (editing) {
        const res = await packagesApi.update(editing.id, payload)
        setPackages(prev => prev.map(p => p.id === editing.id ? res.data : p))
        toast.success('Package updated')
      } else {
        const res = await packagesApi.create(payload)
        setPackages(prev => [...prev, res.data])
        toast.success('Package created')
      }
      setModalOpen(false)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this package?')) return
    try {
      await packagesApi.delete(id)
      setPackages(prev => prev.filter(p => p.id !== id))
      toast.success('Package deleted')
    } catch { toast.error('Delete failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-white mb-1">Manage Packages</h1>
          <p className="text-white/40 text-sm font-body">Create and edit event packages</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-5">
          <Plus size={15} /> New Package
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="glass-card p-6 animate-pulse space-y-3">
              <div className="h-5 bg-white/10 rounded w-1/2" />
              <div className="h-8 bg-white/10 rounded w-2/3" />
              <div className="space-y-2">{[1,2,3].map(j => <div key={j} className="h-3 bg-white/5 rounded" />)}</div>
            </div>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Package size={32} className="text-white/20 mx-auto mb-3" />
          <p className="text-white/30 font-body text-sm mb-4">No packages yet</p>
          <button onClick={openCreate} className="btn-primary text-sm py-2 px-5">
            <Plus size={14} /> Create first package
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg, i) => (
            <motion.div key={pkg.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card p-6 group relative">
              {pkg.isPopular && (
                <div className="absolute top-4 right-4">
                  <span className="badge bg-blush-500/20 text-blush-300 border border-blush-400/20 text-xs">
                    <Crown size={10} /> Popular
                  </span>
                </div>
              )}
              <h3 className="font-display text-xl text-white mb-1">{pkg.name}</h3>
              <p className="text-white/40 text-xs font-body mb-3">Up to {pkg.maxGuests} guests</p>
              <p className="text-3xl font-display gradient-text mb-4">
                ₹{Number(pkg.basePrice).toLocaleString('en-IN')}
              </p>
              {pkg.description && (
                <p className="text-white/50 text-xs font-body mb-4 leading-relaxed line-clamp-2">{pkg.description}</p>
              )}
              <ul className="space-y-1.5 mb-6">
                {(pkg.features || []).slice(0, 4).map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs font-body text-white/60">
                    <CheckCircle2 size={10} className="text-blush-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {(pkg.features?.length || 0) > 4 && (
                  <li className="text-white/30 text-xs font-body pl-4">+{pkg.features.length - 4} more</li>
                )}
              </ul>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(pkg)} className="btn-ghost text-xs py-1.5 px-3 flex-1">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(pkg.id)}
                  className="p-1.5 rounded-lg border border-white/10 hover:bg-red-500/10 hover:border-red-400/20 text-white/30 hover:text-red-400 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
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
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg glass-card p-7 border border-white/15 shadow-2xl max-h-[90vh] overflow-y-auto"
                style={{ background: 'rgba(15, 5, 11, 0.97)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl text-white">
                    {editing ? 'Edit Package' : 'New Package'}
                  </h2>
                  <button onClick={() => setModalOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <FormField label="Package Name *">
                    <input className="input-field" placeholder="e.g. Bloom" value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                  </FormField>
                  <FormField label="Description">
                    <textarea className="input-field resize-none" rows={2} placeholder="Brief description..."
                      value={form.description}
                      onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                  </FormField>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Base Price (₹) *">
                      <input type="number" className="input-field" placeholder="35000" value={form.basePrice}
                        onChange={e => setForm(p => ({ ...p, basePrice: e.target.value }))} />
                    </FormField>
                    <FormField label="Max Guests *">
                      <input type="number" className="input-field" placeholder="75" value={form.maxGuests}
                        onChange={e => setForm(p => ({ ...p, maxGuests: e.target.value }))} />
                    </FormField>
                  </div>
                  <FormField label="Features (one per line)">
                    <textarea className="input-field resize-none font-mono text-xs" rows={5}
                      placeholder={"Premium floral arrangements\nPhotography (4 hrs)\nDJ + sound system"}
                      value={form.features}
                      onChange={e => setForm(p => ({ ...p, features: e.target.value }))} />
                  </FormField>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.isPopular}
                      onChange={e => setForm(p => ({ ...p, isPopular: e.target.checked }))}
                      className="w-4 h-4 rounded accent-blush-500" />
                    <span className="text-white/70 text-sm font-body">Mark as Popular</span>
                  </label>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
                    {saving ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : null}
                    {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Package'}
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

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-white/50 text-xs font-body uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  )
}
