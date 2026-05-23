import React from "react"
import { DOMAINE_META , TYPE_META , NIVEAU_META } from "./meta_data"
import formatPrice from "./utils"

import {
  AwardIcon,
} from "lucide-react"

function CourseCard({ course, onView }) {
  const domaine = DOMAINE_META[course.domaine] ?? DOMAINE_META.autre
  const type    = TYPE_META[course.type]    ?? TYPE_META.sur_mesure
  const niveau  = NIVEAU_META[course.niveau] ?? NIVEAU_META.tous_niveaux

  return (
    <div
      onClick={() => onView(course)}
      className="bg-white border border-slate-200 rounded-xl p-5 cursor-pointer group
                 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-900/8
                 transition-all duration-200 flex flex-col"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded ${type.cls}`}>
          {type.label}
        </span>
        {course.certifiante && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
            <AwardIcon size={10} /> Certifiant
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-slate-800 leading-snug mb-1 group-hover:text-[#1B3A6B] transition-colors">
        {course.titre}
      </h3>
      <p className="text-[11px] font-mono text-slate-400 mb-3">{course.code}</p>

      {/* Domaine badge */}
      <span className={`inline-flex items-center gap-1.5 self-start text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 ${domaine.cls}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${domaine.dot}`} />
        {domaine.label}
      </span>

      {/* Divider */}
      <div className="h-px bg-slate-100 mb-4 mt-auto" />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center">
          <p className="text-base font-black text-[#1B3A6B]">{course.duree_jours}j</p>
          <p className="text-[9px] uppercase tracking-wide text-slate-400">Durée</p>
        </div>
        <div className="text-center border-x border-slate-100">
          <p className="text-base font-black text-[#1B3A6B]">{course.sessions_count}</p>
          <p className="text-[9px] uppercase tracking-wide text-slate-400">Sessions</p>
        </div>
        <div className="text-center">
          <p className="text-base font-black text-[#1B3A6B]">{course.participants_count}</p>
          <p className="text-[9px] uppercase tracking-wide text-slate-400">Participants</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold ${niveau.cls}`}>{niveau.label}</span>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-black text-[#1B3A6B]">{formatPrice(course.prix)}</span>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
            course.active
              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
              : "bg-slate-100 text-slate-400 border border-slate-200"
          }`}>
            {course.active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  )
}


export default CourseCard;