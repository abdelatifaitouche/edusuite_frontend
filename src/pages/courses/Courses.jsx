// src/pages/Courses.jsx
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { listCourses } from "@/services/courses.service"
import { AppBreadcrumb } from "@/components/AppBreadcrumb"
import {
  BookOpenIcon,
  UsersIcon,
  SearchIcon,
  LayoutGridIcon,
  LayoutListIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  TrendingUpIcon,
  AwardIcon,
  FolderOpenIcon,
} from "lucide-react"

import CourseCard from "./CourseCard"
import CourseRow from "./CourseRow"
import CourseDrawer from "./CourseDrawer"
import { NIVEAU_META , TYPE_META , DOMAINE_META } from "./meta_data"


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






/* ─── Detail Drawer ─────────────────────────────────────────────────────── */


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
              onClick={() => navigate("/courses/create")}
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
        ) :  (
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