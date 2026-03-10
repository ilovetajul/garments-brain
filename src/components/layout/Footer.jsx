import { Link } from 'react-router-dom'
import { Brain, Mail, ArrowRight, MapPin } from 'lucide-react'

const cols = {
  Platform:   [['Knowledge Library','/knowledge-library'],['Glossary','/glossary'],['Tools','/tools'],['Courses','/courses']],
  Categories: [['Quality Control','/knowledge-library'],['Fabric Technology','/knowledge-library'],['POM & Measurement','/knowledge-library'],['Sustainability','/knowledge-library']],
  Company:    [['About Us','/contact'],['Contact','/contact'],['Admin Login','/admin/login']],
}

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      {/* Newsletter */}
      <div className="border-b border-navy-800">
        <div className="container-app py-8 sm:py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-display font-bold text-base sm:text-lg">Stay current with garment QC standards</p>
              <p className="text-navy-400 text-sm mt-1">Weekly guides, new tools, and industry updates.</p>
            </div>
            <form className="flex gap-2 w-full md:max-w-sm" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-navy-800 border border-navy-700 rounded-xl text-white placeholder-navy-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange min-w-0"
                style={{ fontSize: 16 }} />
              <button className="btn btn-primary btn-sm shrink-0">
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links grid — 2 col on mobile, 5 col on desktop */}
      <div className="container-app py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center shrink-0">
                <Brain size={20} className="text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-white text-base sm:text-lg">Garments Brain</div>
                <div className="text-navy-400 text-[10px] tracking-[2px] uppercase">Industry Platform</div>
              </div>
            </Link>
            <p className="text-navy-400 text-sm leading-relaxed max-w-xs mb-5">
              The ultimate knowledge platform for garment industry professionals. Master QC, fabric, POM, and sustainability.
            </p>
            <div className="flex flex-col gap-2 text-sm text-navy-500">
              <span className="flex items-center gap-2"><Mail size={13} /> info@garmentsbrain.com</span>
              <span className="flex items-center gap-2"><MapPin size={13} /> Dhaka, Bangladesh</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(cols).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white text-xs uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to}
                      className="text-navy-400 hover:text-brand-orange text-sm transition-colors flex items-center gap-1.5 group">
                      <span className="w-1 h-1 rounded-full bg-navy-700 group-hover:bg-brand-orange transition-colors shrink-0" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-navy-800">
        <div className="container-app py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-navy-600">
          <span>© {new Date().getFullYear()} Garments Brain. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
