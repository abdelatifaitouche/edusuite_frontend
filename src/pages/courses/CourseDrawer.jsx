import React , { useEffect }  from "react"
import { DOMAINE_META , TYPE_META , NIVEAU_META } from "./meta_data"
import { useNavigate } from "react-router-dom"
import {
  AwardIcon,
} from "lucide-react"

function CourseDrawer({ course, onClose }) {
  const navigate = useNavigate()
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [onClose])

  if (!course) return null

  const domaine = DOMAINE_META[course.domaine] ?? DOMAINE_META.autre
  const type    = TYPE_META[course.type]    ?? TYPE_META.sur_mesure
  const niveau  = NIVEAU_META[course.niveau] ?? NIVEAU_META.tous_niveaux

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto flex flex-col"
        style={{ animation: "slideIn 0.25s ease" }}
      >
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div className="bg-gradient-to-br from-[#1B3A6B] via-[#0f2347] to-[#1a3560] px-6 pt-8 pb-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
          >
            ✕
          </button>

          <div className="relative z-10">
            {/* Type badge */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded ${type.cls}`}>
                {type.label}
              </span>
              {course.certifiante && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-500/25 px-2 py-1 rounded-full">
                  <AwardIcon size={10} /> Certifiant
                </span>
              )}
              <span className={`inline-block text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                course.active
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
              }`}>
                {course.active ? "Active" : "Inactive"}
              </span>
            </div>

            <h2 className="text-white font-black text-lg leading-tight mb-1">{course.titre}</h2>
            <p className="text-white/50 text-xs font-mono">{course.code}</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 border-b border-slate-100">
          {[
            { label: "Durée",        value: `${course.duree_jours} jours` },
            { label: "Sessions",     value: course.sessions_count },
            { label: "Participants", value: course.participants_count },
          ].map((s) => (
            <div key={s.label} className="px-4 py-4 text-center border-r last:border-r-0 border-slate-100">
              <p className="text-xl font-black text-[#1B3A6B] leading-none">{s.value}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="flex-1 px-6 py-6 space-y-4">
          {[
            { label: "Domaine",      value: domaine.label },
            { label: "Type",         value: type.label },
            { label: "Niveau",       value: niveau.label },
            { label: "Heures/Jour",  value: `${course.heures_par_jour}h` },
            { label: "Volume total", value: `${course.duree_jours * course.heures_par_jour}h` },
            { label: "Prix",         value: formatPrice(course.prix) },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{row.label}</p>
              <p className="text-sm font-semibold text-slate-700">{row.value ?? "—"}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="px-6 py-5 border-t border-slate-100 flex gap-3">
          <button
            onClick={() => navigate(`/formations/${course.id}/edit`)}
            className="flex-1 bg-[#E8450A] hover:bg-[#c73a08] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-colors"
          >
            Modifier
          </button>
          <button className="flex-1 border-2 border-slate-200 hover:border-[#1B3A6B] text-slate-600 hover:text-[#1B3A6B] text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-all">
            {course.active ? "Désactiver" : "Activer"}
          </button>
        </div>
      </div>
    </div>
  )
}


export default CourseDrawer ; 