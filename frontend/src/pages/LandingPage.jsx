// src/pages/LandingPage.jsx
import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import {
  Sparkles, Heart, Camera, Music, ChefHat, Gift,
  Users, Star, ArrowRight, CheckCircle2, Flower2,
  Baby, Crown, CalendarDays
} from 'lucide-react'

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp} className={className}>
      {children}
    </motion.div>
  )
}

// ─── Packages data ────────────────────────────────────────────────────────────
const packages = [
  {
    name: 'Blossom', price: '₹15,000', guests: 'Up to 30 guests',
    tag: 'Intimate', tagColor: 'bg-teal-500/20 text-teal-300',
    features: ['Basic floral decorations', 'Welcome banner', 'Cake table setup', 'Sound system', 'Event coordinator'],
    popular: false,
  },
  {
    name: 'Bloom', price: '₹35,000', guests: 'Up to 75 guests',
    tag: 'Most Popular', tagColor: 'bg-blush-500/20 text-blush-300',
    features: ['Premium floral arrangements', 'Themed decorations', 'Photography (4 hrs)', 'Catering setup', 'DJ + sound', 'Thank you cards'],
    popular: true,
  },
  {
    name: 'Radiance', price: '₹65,000', guests: 'Up to 150 guests',
    tag: 'Luxury', tagColor: 'bg-amber-500/20 text-amber-300',
    features: ['Luxury floral & décor', 'Full-day photo + video', 'Live music / DJ', 'Premium catering', 'Return gifts', 'Dedicated team'],
    popular: false,
  },
]

// ─── Features data ────────────────────────────────────────────────────────────
const features = [
  { icon: <Camera size={22} />, title: 'Photography & Video', desc: 'Professional coverage capturing every precious moment of your celebration.' },
  { icon: <Flower2 size={22} />, title: 'Floral & Décor', desc: 'Bespoke arrangements and themed decorations that set the perfect mood.' },
  { icon: <ChefHat size={22} />, title: 'Catering', desc: 'Curated menus with dietary options, from light bites to full buffet spreads.' },
  { icon: <Music size={22} />, title: 'Entertainment', desc: 'DJ, live music, and engaging games to keep your guests entertained.' },
  { icon: <Gift size={22} />, title: 'Return Gifts', desc: 'Personalized keepsakes that guests will treasure long after the event.' },
  { icon: <Users size={22} />, title: 'Dedicated Coordinator', desc: 'Your personal event planner managing every detail from start to finish.' },
]

const stats = [
  { value: '500+', label: 'Events Hosted' },
  { value: '98%', label: 'Happy Families' },
  { value: '50+', label: 'Expert Vendors' },
  { value: '5★', label: 'Average Rating' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #dc4878 0%, transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, #a8214d 0%, transparent 70%)' }} />
          {/* Floating petals */}
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: `${8 + i * 4}px`, height: `${8 + i * 4}px`,
                background: 'linear-gradient(135deg, #dc4878, #f0a3b9)',
                left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blush-400/30 bg-blush-500/10 mb-6"
              >
                <Sparkles size={14} className="text-blush-400" />
                <span className="text-blush-300 text-sm font-body">Premium Event Coordination</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-display leading-[1.05] mb-6"
              >
                Celebrate Every<br />
                <span className="gradient-text italic">Precious</span><br />
                Moment
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/60 text-lg leading-relaxed mb-8 font-body max-w-lg"
              >
                From intimate baby showers to grand naming ceremonies — we craft unforgettable
                experiences with meticulous attention to every detail.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <button onClick={() => navigate(isAuthenticated ? '/book' : '/login')}
                  className="btn-primary text-base px-8 py-3.5 group">
                  Book Your Event
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <a href="#packages" className="btn-ghost text-base px-8 py-3.5">
                  View Packages
                </a>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap items-center gap-4 mt-10"
              >
                <div className="flex -space-x-2">
                  {['bg-blush-400', 'bg-purple-400', 'bg-teal-400', 'bg-amber-400'].map((c, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-midnight-950 flex items-center justify-center text-xs font-bold text-midnight-950`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}</div>
                  <p className="text-white/40 text-xs font-body">500+ families trust us</p>
                </div>
              </motion.div>
            </div>

            {/* Right – event card mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main card */}
                <div className="glass-card-light p-8 border border-white/15 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #dc4878, #a8214d)' }}>
                      <Baby size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-display text-lg">Aanya's Baby Shower</p>
                      <p className="text-white/50 text-sm font-body">March 15, 2025 · 4:00 PM</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    {[
                      { label: 'Package', value: 'Bloom — Premium', color: 'text-blush-300' },
                      { label: 'Guests', value: '45 confirmed' },
                      { label: 'Venue', value: 'The Grand Banquet' },
                      { label: 'Total', value: '₹58,500', color: 'text-green-400' },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-white/50 text-sm font-body">{item.label}</span>
                        <span className={`text-sm font-medium font-body ${item.color || 'text-white'}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-500/10 border border-green-500/20">
                    <CheckCircle2 size={14} className="text-green-400" />
                    <span className="text-green-300 text-sm font-body">Event confirmed & ready</span>
                  </div>
                </div>

                {/* Floating service cards */}
                <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-6 glass-card px-4 py-3 border border-white/10 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Camera size={14} className="text-blush-400" />
                    <span className="text-white text-xs font-body">Photography booked</span>
                  </div>
                </motion.div>

                <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -left-6 glass-card px-4 py-3 border border-white/10 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Heart size={14} className="text-blush-400 fill-blush-400" />
                    <span className="text-white text-xs font-body">45 RSVPs received</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <AnimatedSection key={stat.label}>
                <motion.div custom={i} variants={fadeUp} className="text-center">
                  <p className="text-4xl font-display gradient-text mb-1">{stat.value}</p>
                  <p className="text-white/50 text-sm font-body">{stat.label}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-blush-400 text-sm font-body tracking-widest uppercase mb-3">Everything You Need</p>
            <h2 className="text-4xl sm:text-5xl font-display mb-4">
              Crafted with <span className="gradient-text italic">Love</span>
            </h2>
            <div className="section-divider" />
            <p className="text-white/50 font-body max-w-xl mx-auto">
              Every element of your celebration, thoughtfully curated and professionally managed.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-card p-6 group cursor-default transition-all duration-300 hover:border-blush-400/20"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, rgba(220,72,120,0.2), rgba(168,33,77,0.1))' }}>
                  <span className="text-blush-400">{feature.icon}</span>
                </div>
                <h3 className="font-display text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm font-body leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section id="packages" className="py-24 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(220,72,120,0.04) 0%, transparent 70%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-blush-400 text-sm font-body tracking-widest uppercase mb-3">Our Packages</p>
            <h2 className="text-4xl sm:text-5xl font-display mb-4">
              Choose Your <span className="gradient-text italic">Perfect</span> Package
            </h2>
            <div className="section-divider" />
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                  pkg.popular
                    ? 'border-2 border-blush-400/40 shadow-[0_0_40px_rgba(220,72,120,0.15)]'
                    : 'glass-card'
                }`}
                style={pkg.popular ? {
                  background: 'linear-gradient(135deg, rgba(220,72,120,0.1) 0%, rgba(168,33,77,0.05) 100%)',
                  border: '1px solid rgba(220,72,120,0.35)',
                } : {}}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="badge bg-blush-500 text-white text-xs px-4 py-1.5 shadow-lg">
                      <Crown size={11} /> Most Popular
                    </span>
                  </div>
                )}

                <div className={`badge ${pkg.tagColor} border border-current/20 mb-4 self-start`}>
                  {pkg.tag}
                </div>

                <h3 className="font-display text-2xl text-white mb-1">{pkg.name}</h3>
                <p className="text-white/40 text-sm font-body mb-4">{pkg.guests}</p>

                <div className="mb-6">
                  <span className="text-4xl font-display gradient-text">{pkg.price}</span>
                  <span className="text-white/40 text-sm font-body ml-2">base price</span>
                </div>

                <ul className="space-y-2.5 mb-8 flex-grow">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm font-body text-white/70">
                      <CheckCircle2 size={14} className="text-blush-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate(isAuthenticated ? '/book' : '/login')}
                  className={pkg.popular ? 'btn-primary w-full' : 'btn-ghost w-full'}
                >
                  Select Package
                  <ArrowRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>

          <AnimatedSection className="text-center mt-8">
            <p className="text-white/40 text-sm font-body">
              + ₹500 per guest for catering · Additional services available
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="glass-card border border-blush-400/20 p-12 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(220,72,120,0.08) 0%, rgba(168,33,77,0.04) 100%)' }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(220,72,120,0.08) 0%, transparent 70%)' }} />
              <div className="relative">
                <div className="flex justify-center mb-6">
                  <div className="flex gap-3">
                    <Baby size={28} className="text-blush-400" />
                    <Heart size={28} className="text-blush-300 fill-blush-300" />
                    <CalendarDays size={28} className="text-blush-400" />
                  </div>
                </div>
                <h2 className="text-4xl sm:text-5xl font-display mb-4">
                  Ready to Create<br />
                  <span className="gradient-text italic">Magic?</span>
                </h2>
                <p className="text-white/50 font-body text-lg mb-8 max-w-xl mx-auto">
                  Start planning your perfect celebration today. Our team is ready to bring your vision to life.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate(isAuthenticated ? '/book' : '/login')}
                    className="btn-primary text-base px-8 py-3.5 group animate-pulse-glow"
                  >
                    Start Booking Now
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #dc4878, #a8214d)' }}>
                <Flower2 size={13} className="text-white" />
              </div>
              <span className="font-display text-white">Bloom <span className="gradient-text">Events</span></span>
            </div>
            <p className="text-white/30 text-sm font-body text-center">
              © 2025 Bloom Events. Crafting memories, one celebration at a time.
            </p>
            <div className="flex gap-4">
              {['Privacy', 'Terms', 'Contact'].map(link => (
                <a key={link} href="#" className="text-white/30 text-sm font-body hover:text-white/60 transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
