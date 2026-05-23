import React from "react";
import { useNavigate } from "react-router-dom";
import { DOMAINE_META , TYPE_META } from "./meta_data";
import formatPrice from "./utils";
import {
  UsersIcon,
  AwardIcon,
  CalendarDaysIcon,
} from "lucide-react"


function CourseRow({ course, onView }) {
    const navigation = useNavigate()
  const domaine = DOMAINE_META[course.domaine] ?? DOMAINE_META.autre
  const type    = TYPE_META[course.type]    ?? TYPE_META.sur_mesure

  return (
    <tr
      className="group border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer"
      onClick={() => navigation(`/courses/${course.id}`)}
    >
      <td className="py-3.5 pl-6 pr-4">
        <div>   
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-[#1B3A6B] transition-colors">
              {course.titre}
            </p>
            {course.certifiante && <AwardIcon size={12} className="text-amber-500 shrink-0" />}
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">{course.code}</p>
        </div>
      </td>

      <td className="py-3.5 px-4 hidden sm:table-cell">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${domaine.cls}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${domaine.dot} shrink-0`} />
          {domaine.label}
        </span>
      </td>

      <td className="py-3.5 px-4 hidden md:table-cell">
        <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded ${type.cls}`}>
          {type.label}
        </span>
      </td>

      <td className="py-3.5 px-4 hidden lg:table-cell text-center">
        <span className="text-sm font-bold text-slate-700">{course.duree_jours}j</span>
        <span className="text-[10px] text-slate-400 ml-1">({course.duree_jours * course.heures_par_jour}h)</span>
      </td>

      <td className="py-3.5 px-4 hidden lg:table-cell">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CalendarDaysIcon size={11} className="text-slate-400" />
            {course.sessions_count}
          </span>
          <span className="flex items-center gap-1">
            <UsersIcon size={11} className="text-slate-400" />
            {course.participants_count}
          </span>
        </div>
      </td>

      <td className="py-3.5 px-4 hidden xl:table-cell">
        <span className="text-sm font-bold text-[#1B3A6B]">{formatPrice(course.prix)}</span>
      </td>

      <td className="py-3.5 px-4">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
          course.active
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-slate-100 text-slate-500 border border-slate-200"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${course.active ? "bg-emerald-500" : "bg-slate-400"}`} />
          {course.active ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="py-3.5 pl-4 pr-6">
        <span className="text-[11px] font-bold text-[#1B3A6B] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#E8450A]">
          Voir →
        </span>
      </td>
    </tr>
  )
}


export default CourseRow;