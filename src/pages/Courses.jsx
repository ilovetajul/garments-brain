import { Link } from 'react-router-dom'
import { PlayCircle, Clock, BookOpen, Award, ArrowRight, Lock } from 'lucide-react'

const COURSES = [
  { id:1, title:'QC for Embroidery — Complete Inspector Course', lessons:8, hrs:'4–5', level:'Intermediate', emoji:'🧵', status:'available', desc:'Stitch types, thread quality, defect classification, AQL sampling, wash durability, and compliance testing.' },
  { id:2, title:'POM Measurement Fundamentals', lessons:6, hrs:'3', level:'Beginner', emoji:'📐', status:'soon', desc:'Master all measurement checkpoints for woven and knit garments.' },
  { id:3, title:'AQL & Sampling Plans — Complete Guide', lessons:5, hrs:'2–3', level:'Intermediate', emoji:'📊', status:'soon', desc:'Statistical sampling, defect classification, and buyer audit preparation.' },
  { id:4, title:'Factory Audit & Social Compliance', lessons:10, hrs:'6', level:'Advanced', emoji:'🏭', status:'soon', desc:'Social compliance audits, certification pathways, and export market requirements.' },
]

export function Courses() {
  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-950 to-navy-800 bg-grid-navy py-12 sm:py-16">
        <div className="container-app text-center">
          <div className="eyebrow text-orange-400 justify-center mb-3">
            <span className="w-5 h-0.5 bg-orange-400 rounded" /> Learning Paths <span className="w-5 h-0.5 bg-orange-400 rounded" />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-3">
            Courses for Garment Pros
          </h1>
          <p className="text-navy-300 text-sm sm:text-base max-w-xl mx-auto">
            Industry-specific micro-courses. Learn at your pace. Get certified.
          </p>
        </div>
      </div>

      <div className="container-app py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {COURSES.map(c => (
            <div key={c.id}
              className={`card p-5 sm:p-6 ${c.status === 'available' ? 'hover:shadow-card-hover hover:-translate-y-1 transition-all' : 'opacity-60'}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${c.status === 'available' ? 'bg-orange-50 border border-orange-100' : 'bg-slate-100'}`}>
                  {c.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`badge text-[10px] ${c.status === 'available' ? 'badge-live' : 'badge-slate'}`}>
                      {c.status === 'available' ? '● Available' : '⏳ Coming Soon'}
                    </span>
                    <span className="badge badge-navy text-[10px]">{c.level}</span>
                  </div>
                  <h3 className="font-display font-bold text-navy-800 text-sm sm:text-base leading-snug">
                    {c.title}
                  </h3>
                </div>
              </div>

              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4">{c.desc}</p>

              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <span className="flex items-center gap-1"><BookOpen size={11} /> {c.lessons} lessons</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {c.hrs} hrs</span>
                <span className="flex items-center gap-1"><Award size={11} /> Certificate</span>
              </div>

              {c.status === 'available'
                ? <button className="btn btn-primary w-full justify-center">
                    <PlayCircle size={16} /> Start Course
                  </button>
                : <button disabled className="btn btn-ghost w-full justify-center border border-dashed border-slate-200 cursor-not-allowed opacity-60">
                    <Lock size={14} /> Notify Me When Ready
                  </button>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <div className="pt-16 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-950 to-navy-800 bg-grid-navy py-12 sm:py-16">
        <div className="container-app text-center">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-3">Get in Touch</h1>
          <p className="text-navy-300 text-sm sm:text-base max-w-md mx-auto">
            Questions, partnerships, or content contributions — we'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="container-app py-8 sm:py-16 max-w-lg mx-auto">
        <div className="card p-6 sm:p-8">
          <h2 className="heading-md mb-6">Send us a message</h2>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Name</label>
                <input className="form-input" placeholder="Your name" />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="form-label">Subject</label>
              <input className="form-input" placeholder="What's this about?" />
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea className="form-input resize-none" rows={5} placeholder="Tell us more…" />
            </div>
            <button className="btn btn-primary w-full justify-center btn-lg">
              Send Message <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
