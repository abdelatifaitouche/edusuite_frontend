// src/pages/Courses.jsx
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { listCourses } from "@/services/courses.service"
import { AppBreadcrumb } from "@/components/AppBreadcrumb"
import {
  BookOpenIcon,
  ClockIcon,
  UsersIcon,
  SearchIcon,
  LayoutGridIcon,
  LayoutListIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BadgeCheckIcon,
  FilterIcon,
  PlusIcon,
  TrendingUpIcon,
  AwardIcon,
  CalendarDaysIcon,
  FolderOpenIcon,
} from "lucide-react"

/* ─── Mock data (remove when API is ready) ──────────────────────────────── */
const MOCK_COURSES = [
  { id: 1,  titre: "Élaboration des Cahiers des Charges",  code: "CDC-01", domaine: "juridique",              type: "sur_mesure",      niveau: "avance",        duree_jours: 5,  heures_par_jour: 6, prix: 45000, certifiante: true,  active: true,  sessions_count: 4,  participants_count: 38 },
  { id: 2,  titre: "Gestion des Ressources Humaines",      code: "RH-01",  domaine: "rh",                     type: "professionnelle", niveau: "intermediaire", duree_jours: 3,  heures_par_jour: 6, prix: 28000, certifiante: true,  active: true,  sessions_count: 7,  participants_count: 62 },
  { id: 3,  titre: "Management & Leadership",              code: "MGT-01", domaine: "management",             type: "sur_mesure",      niveau: "avance",        duree_jours: 4,  heures_par_jour: 7, prix: 38000, certifiante: true,  active: true,  sessions_count: 5,  participants_count: 44 },
  { id: 4,  titre: "SIMDUT 2015 (SGH)",                   code: "SST-01", domaine: "sst",                    type: "sst",             niveau: "debutant",      duree_jours: 1,  heures_par_jour: 6, prix: 8500,  certifiante: true,  active: true,  sessions_count: 12, participants_count: 98 },
  { id: 5,  titre: "Développement Personnel & PNL",        code: "DP-01",  domaine: "developpement_personnel", type: "sur_mesure",      niveau: "tous_niveaux",  duree_jours: 2,  heures_par_jour: 6, prix: 18000, certifiante: false, active: true,  sessions_count: 9,  participants_count: 71 },
  { id: 6,  titre: "Chariot Élévateur",                   code: "SST-02", domaine: "sst",                    type: "sst",             niveau: "debutant",      duree_jours: 2,  heures_par_jour: 7, prix: 12000, certifiante: true,  active: true,  sessions_count: 8,  participants_count: 55 },
  { id: 7,  titre: "Coaching d'Entreprise",               code: "COACH-01",domaine: "coaching",              type: "sur_mesure",      niveau: "avance",        duree_jours: 3,  heures_par_jour: 6, prix: 32000, certifiante: false, active: false, sessions_count: 2,  participants_count: 14 },
  { id: 8,  titre: "Communication Non Violente (CNV)",    code: "DP-02",  domaine: "developpement_personnel", type: "sur_mesure",      niveau: "tous_niveaux",  duree_jours: 2,  heures_par_jour: 6, prix: 16000, certifiante: false, active: true,  sessions_count: 6,  participants_count: 48 },
  { id: 9,  titre: "Espace Clos & Travail en Hauteur",    code: "SST-03", domaine: "sst",                    type: "sst",             niveau: "intermediaire", duree_jours: 2,  heures_par_jour: 7, prix: 14000, certifiante: true,  active: true,  sessions_count: 5,  participants_count: 32 },
  { id: 10, titre: "DEP en Comptabilité",                 code: "DEP-01", domaine: "rh",                     type: "professionnelle", niveau: "debutant",      duree_jours: 10, heures_par_jour: 6, prix: 75000, certifiante: true,  active: true,  sessions_count: 3,  participants_count: 26 },
]

/* ─── Config maps ───────────────────────────────────────────────────────── */
const DOMAINE_META = {
  rh:                     { label: "Ressources Humaines",   cls: "bg-blue-50 text-blue-700 border border-blue-200",      dot: "bg-blue-500" },
  developpement_personnel:{ label: "Développement perso",   cls: "bg-violet-50 text-violet-700 border border-violet-200", dot: "bg-violet-500" },
  management:             { label: "Management",             cls: "bg-[#1B3A6B]/8 text-[#1B3A6B] border border-[#1B3A6B]/20", dot: "bg-[#1B3A6B]" },
  team_building:          { label: "Team Building",          cls: "bg-teal-50 text-teal-700 border border-teal-200",      dot: "bg-teal-500" },
  coaching:               { label: "Coaching",               cls: "bg-amber-50 text-amber-700 border border-amber-200",   dot: "bg-amber-500" },
  sst:                    { label: "Santé & Sécurité",       cls: "bg-[#E8450A]/8 text-[#E8450A] border border-[#E8450A]/25", dot: "bg-[#E8450A]" },
  juridique:              { label: "Juridique",              cls: "bg-indigo-50 text-indigo-700 border border-indigo-200", dot: "bg-indigo-500" },
  informatique:           { label: "Informatique",           cls: "bg-cyan-50 text-cyan-700 border border-cyan-200",      dot: "bg-cyan-500" },
  autre:                  { label: "Autre",                  cls: "bg-slate-100 text-slate-600 border border-slate-200",  dot: "bg-slate-400" },
}

const TYPE_META = {
  professionnelle: { label: "DEP / ASP",     cls: "bg-[#1B3A6B] text-white" },
  sur_mesure:      { label: "Sur mesure",    cls: "bg-slate-700 text-white" },
  sst:             { label: "SST",           cls: "bg-[#E8450A] text-white" },
  elearning:       { label: "E-Learning",    cls: "bg-sky-600 text-white" },
  coaching:        { label: "Coaching",      cls: "bg-amber-600 text-white" },
}

const NIVEAU_META = {
  debutant:      { label: "Débutant",       cls: "text-slate-500" },
  intermediaire: { label: "Intermédiaire",  cls: "text-blue-600" },
  avance:        { label: "Avancé",         cls: "text-[#1B3A6B]" },
  tous_niveaux:  { label: "Tous niveaux",   cls: "text-slate-500" },
}

function formatPrice(p) {
  if (!p) return "—"
  return new Intl.NumberFormat("fr-DZ", { style: "currency", currency: "DZD", maximumFractionDigits: 0 }).format(p)
}

/* ─── Skeleton ──────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-5 bg-slate-200 rounded w-16" />
        <div className="h-5 bg-slate-100 rounded-full w-20" />
      </div>
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-1/2 mb-5" />
      <div className="h-px bg-slate-100 mb-4" />
      <div className="flex gap-4">
        <div className="h-8 bg-slate-100 rounded w-16" />
        <div className="h-8 bg-slate-100 rounded w-16" />
        <div className="h-8 bg-slate-100 rounded w-16" />
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      <td className="py-4 pl-6 pr-4"><div className="flex gap-3 items-center"><div className="h-3 bg-slate-200 rounded w-24" /><div className="h-3 bg-slate-100 rounded w-32" /></div></td>
      <td className="py-4 px-4 hidden sm:table-cell"><div className="h-5 bg-slate-100 rounded-full w-20" /></td>
      <td className="py-4 px-4 hidden md:table-cell"><div className="h-5 bg-slate-100 rounded-full w-16" /></td>
      <td className="py-4 px-4 hidden lg:table-cell"><div className="h-3 bg-slate-100 rounded w-14" /></td>
      <td className="py-4 px-4 hidden lg:table-cell"><div className="h-3 bg-slate-100 rounded w-16" /></td>
      <td className="py-4 px-4"><div className="h-5 bg-slate-100 rounded-full w-14" /></td>
      <td className="py-4 pl-4 pr-6"><div className="h-3 bg-slate-100 rounded w-8" /></td>
    </tr>
  )
}

/* ─── Course Card (grid) ────────────────────────────────────────────────── */
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

/* ─── Course Row (table) ────────────────────────────────────────────────── */
function CourseRow({ course, onView }) {
  const domaine = DOMAINE_META[course.domaine] ?? DOMAINE_META.autre
  const type    = TYPE_META[course.type]    ?? TYPE_META.sur_mesure

  return (
    <tr
      className="group border-b border-slate-100 hover:bg-slate-50/70 transition-colors cursor-pointer"
      onClick={() => onView(course)}
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

/* ─── Detail Drawer ─────────────────────────────────────────────────────── */
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

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Courses() {
  const navigate = useNavigate()

  const [data,        setData]        = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [page,        setPage]        = useState(1)
  const [hasNext,     setHasNext]     = useState(false)
  const [search,      setSearch]      = useState("")
  const [filterDomaine, setFilterDomaine] = useState("all")
  const [filterType,    setFilterType]    = useState("all")
  const [filterActif,   setFilterActif]   = useState("all")
  const [viewMode,    setViewMode]    = useState("grid")
  const [selected,    setSelected]    = useState(null)

  /* ── Fetch ──────────────────────────────────────────────────────── */
  const fetchCourses = async (p = 1) => {
    setLoading(true)
    setError(null)
    try {
      const res = await listCourses(p)
      // Support both { results, next } (DRF pagination) and plain array
      if (Array.isArray(res)) {
        setData(res)
        setHasNext(false)
      } else {
        setData(res.results ?? res.data ?? [])
        setHasNext(Boolean(res.next))
      }
    } catch {
      setData(MOCK_COURSES)
      setHasNext(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCourses(page) }, [page])

  /* ── Derived ────────────────────────────────────────────────────── */
  const filtered = data.filter((c) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      c.titre?.toLowerCase().includes(q) ||
      c.code?.toLowerCase().includes(q)  ||
      (DOMAINE_META[c.domaine]?.label ?? "").toLowerCase().includes(q)
    const matchDomaine = filterDomaine === "all" || c.domaine === filterDomaine
    const matchType    = filterType    === "all" || c.type    === filterType
    const matchActif   =
      filterActif === "all"    ? true :
      filterActif === "active" ? c.active :
      !c.active
    return matchSearch && matchDomaine && matchType && matchActif
  })

  const totalActive   = data.filter((c) => c.active).length
  const totalCertif   = data.filter((c) => c.certifiante).length
  const totalSessions = data.reduce((a, c) => a + (c.sessions_count ?? 0), 0)
  const totalPartic   = data.reduce((a, c) => a + (c.participants_count ?? 0), 0)

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="fade-up">
              <AppBreadcrumb />
              <div className="flex items-center gap-2 mt-3 mb-1">
                <span className="block w-5 h-0.5 bg-[#E8450A]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8450A]">
                  Formation
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#1B3A6B] tracking-tight leading-tight">
                Formations
              </h1>
              <p className="text-sm text-slate-500 mt-0.5 font-light">
                {data.length} formation{data.length !== 1 ? "s" : ""} enregistrée{data.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={() => navigate("/formations/new")}
              className="fade-up inline-flex items-center gap-2 bg-[#E8450A] hover:bg-[#c73a08] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg border-2 border-[#E8450A] hover:border-[#c73a08] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-900/20 transition-all"
              style={{ animationDelay: "80ms" }}
            >
              <PlusIcon size={14} />
              Ajouter une formation
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Total",       value: data.length,    sub: "formations",               icon: BookOpenIcon,    delay: 60 },
              { label: "Actives",     value: totalActive,    sub: `${data.length - totalActive} inactive(s)`, icon: TrendingUpIcon,  delay: 120 },
              { label: "Certifiantes",value: totalCertif,    sub: "avec certificat",          icon: AwardIcon,       delay: 180 },
              { label: "Participants",value: totalPartic,    sub: `${totalSessions} sessions`, icon: UsersIcon,       delay: 240 },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.label}
                  className="fade-up bg-white border border-slate-200 rounded-xl px-5 py-4"
                  style={{ animationDelay: `${s.delay}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
                    <Icon size={13} className="text-slate-300" />
                  </div>
                  <p className="text-2xl font-black text-[#1B3A6B] leading-none">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <SearchIcon size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Titre, code, domaine…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10 transition-all"
            />
          </div>

          {/* Domaine filter */}
          <select
            value={filterDomaine}
            onChange={(e) => setFilterDomaine(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 px-3 py-2.5 focus:outline-none focus:border-[#1B3A6B] transition-colors cursor-pointer"
          >
            <option value="all">Tous domaines</option>
            {Object.entries(DOMAINE_META).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 px-3 py-2.5 focus:outline-none focus:border-[#1B3A6B] transition-colors cursor-pointer"
          >
            <option value="all">Tous types</option>
            {Object.entries(TYPE_META).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          {/* Statut filter */}
          <select
            value={filterActif}
            onChange={(e) => setFilterActif(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 px-3 py-2.5 focus:outline-none focus:border-[#1B3A6B] transition-colors cursor-pointer"
          >
            <option value="all">Tous statuts</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
          </select>

          {/* View toggle */}
          <div className="ml-auto flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {[
              { mode: "grid",  Icon: LayoutGridIcon },
              { mode: "table", Icon: LayoutListIcon },
            ].map(({ mode, Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`p-1.5 rounded transition-all ${
                  viewMode === mode
                    ? "bg-[#1B3A6B] text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Result hint */}
        {(search || filterDomaine !== "all" || filterType !== "all" || filterActif !== "all") && (
          <p className="text-xs text-slate-400 mt-3">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
            {search && <span> pour <strong className="text-slate-600">«&nbsp;{search}&nbsp;»</strong></span>}
          </p>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-10">
        {loading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <tbody>{[...Array(8)].map((_, i) => <SkeletonRow key={i} />)}</tbody>
              </table>
            </div>
          )
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-600 font-semibold text-sm">{error}</p>
            <button onClick={() => fetchCourses(page)} className="mt-4 text-xs font-bold uppercase tracking-widest text-[#E8450A] hover:underline">
              Réessayer
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-16 text-center">
            <FolderOpenIcon size={40} className="text-slate-300 mx-auto mb-4" />
            <p className="font-bold text-slate-700">Aucune formation trouvée</p>
            <p className="text-sm text-slate-400 mt-1">Modifiez vos filtres ou ajoutez une formation.</p>
            <button
              onClick={() => navigate("/formations/new")}
              className="mt-6 inline-flex items-center gap-2 bg-[#E8450A] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg hover:bg-[#c73a08] transition-colors"
            >
              <PlusIcon size={13} /> Ajouter une formation
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} onView={setSelected} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3 pl-6 pr-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Formation</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden sm:table-cell">Domaine</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden md:table-cell">Type</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden lg:table-cell">Durée</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden lg:table-cell">Activité</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden xl:table-cell">Prix</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</th>
                  <th className="py-3 pl-4 pr-6" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => (
                  <CourseRow key={course.id} course={course} onView={setSelected} />
                ))}
              </tbody>
            </table>

            {/* Pagination footer */}
            <div className="border-t border-slate-100 px-6 py-3 flex items-center justify-between">
              <p className="text-xs text-slate-400">{filtered.length} formation{filtered.length !== 1 ? "s" : ""}</p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 disabled:opacity-30 hover:text-[#1B3A6B] transition-colors px-2 py-1"
                >
                  <ChevronLeftIcon size={13} /> Préc.
                </button>
                <span className="text-xs font-black text-[#1B3A6B] bg-[#1B3A6B]/8 px-3 py-1 rounded">{page}</span>
                <button
                  disabled={!hasNext}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 disabled:opacity-30 hover:text-[#1B3A6B] transition-colors px-2 py-1"
                >
                  Suiv. <ChevronRightIcon size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid pagination */}
        {!loading && viewMode === "grid" && filtered.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 disabled:opacity-30 hover:text-[#1B3A6B] border border-slate-200 hover:border-[#1B3A6B] px-4 py-2 rounded-lg transition-all bg-white"
            >
              <ChevronLeftIcon size={13} /> Précédent
            </button>
            <span className="text-xs font-black text-[#1B3A6B] bg-white border border-[#1B3A6B]/20 px-4 py-2 rounded-lg">
              Page {page}
            </span>
            <button
              disabled={!hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 disabled:opacity-30 hover:text-[#1B3A6B] border border-slate-200 hover:border-[#1B3A6B] px-4 py-2 rounded-lg transition-all bg-white"
            >
              Suivant <ChevronRightIcon size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ── Detail drawer ────────────────────────────────────────────── */}
      {selected && <CourseDrawer course={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}