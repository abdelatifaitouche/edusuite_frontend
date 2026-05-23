// src/pages/sessions/SessionDetails.jsx
import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AppBreadcrumb } from "@/components/AppBreadcrumb"
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserRoundIcon,
  BookOpenIcon,
  HashIcon,
  LayersIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertCircleIcon,
  LoaderCircleIcon,
  PlayCircleIcon,
  PencilIcon,
  MoreHorizontalIcon,
  ChevronRightIcon,
  TimerIcon,
  ActivityIcon,
  MapPinIcon,
  UsersIcon,
  FileTextIcon,
} from "lucide-react"

import { get_session_details } from "@/services/session.service"

/* ─── Mock fetch (replace with real service) ──────────────────────────────── */
const MOCK = {
  formateur_name:  "Mohammed",
  formateur_id:    "f9699c75-0ef2-4e36-97bd-55eb11c4c078",
  formation_title: "HSE TRAINING",
  formation_id:    "b99c6f76-54df-4b65-af61-bbefd2216474",
  start_date:      "2026-05-01",
  end_date:        "2026-05-30",
  type_planning:   "BLOC",
  session_number:  "1",
  status:          "CANCELLED",
  id:              "7e375ab0-f674-440c-b144-1e1dc661b6cd",
  occurrences: [
    { id:"occ-1", session_id:"7e375ab0", planned_date:"2026-05-05", start_at:"08:00:00", end_at:"10:00:00", status:"CANCELLED", notes:"" },
    { id:"occ-2", session_id:"7e375ab0", planned_date:"2026-05-06", start_at:"08:00:00", end_at:"10:00:00", status:"CANCELLED", notes:"" },
    { id:"occ-3", session_id:"7e375ab0", planned_date:"2026-05-12", start_at:"08:00:00", end_at:"10:00:00", status:"CANCELLED", notes:"" },
    { id:"occ-4", session_id:"7e375ab0", planned_date:"2026-05-13", start_at:"08:00:00", end_at:"10:00:00", status:"CANCELLED", notes:"" },
    { id:"occ-5", session_id:"7e375ab0", planned_date:"2026-05-19", start_at:"08:00:00", end_at:"10:00:00", status:"CANCELLED", notes:"" },
    { id:"occ-6", session_id:"7e375ab0", planned_date:"2026-05-20", start_at:"08:00:00", end_at:"10:00:00", status:"CANCELLED", notes:"" },
    { id:"occ-7", session_id:"7e375ab0", planned_date:"2026-05-26", start_at:"08:00:00", end_at:"10:00:00", status:"CANCELLED", notes:"" },
    { id:"occ-8", session_id:"7e375ab0", planned_date:"2026-05-27", start_at:"08:00:00", end_at:"10:00:00", status:"CANCELLED", notes:"" },
  ],
}

async function fetchSession(id) {
  // replace with: return getSession(id)
  const data = await get_session_details(id)
  return data
}

/* ─── Config ──────────────────────────────────────────────────────────────── */
const SESSION_STATUS = {
  PLANNED:   { label:"Planifiée",  bg:"bg-[#E6F1FB]", text:"text-[#0C447C]",  dot:"bg-[#185FA5]",  bar:"#185FA5",  gradFrom:"#1B3A6B", gradTo:"#0f2347"  },
  CONFIRMED: { label:"Confirmée",  bg:"bg-emerald-50", text:"text-emerald-800", dot:"bg-emerald-500", bar:"#10B981",  gradFrom:"#065F46", gradTo:"#047857"  },
  EN_COURS:  { label:"En cours",   bg:"bg-[#FAECE7]", text:"text-[#993C1D]",  dot:"bg-[#E8450A]",  bar:"#E8450A",  gradFrom:"#1B3A6B", gradTo:"#0f2347"  },
  COMPLETED: { label:"Terminée",   bg:"bg-[#EAF3DE]", text:"text-[#3B6D11]",  dot:"bg-[#639922]",  bar:"#639922",  gradFrom:"#1B3A6B", gradTo:"#0f2347"  },
  CANCELLED: { label:"Annulée",    bg:"bg-slate-100",  text:"text-slate-500",  dot:"bg-slate-400",  bar:"#9CA3AF",  gradFrom:"#374151", gradTo:"#1F2937"  },
  DRAFT:     { label:"Brouillon",  bg:"bg-amber-50",   text:"text-amber-800",  dot:"bg-amber-400",  bar:"#F59E0B",  gradFrom:"#1B3A6B", gradTo:"#0f2347"  },
}

const OCC_STATUS = {
  PLANNED:   { label:"Planifiée",  bg:"bg-[#E6F1FB]", text:"text-[#0C447C]",  dot:"bg-[#185FA5]",  icon: ClockIcon        },
  CONFIRMED: { label:"Confirmée",  bg:"bg-emerald-50", text:"text-emerald-800", dot:"bg-emerald-500", icon: CheckCircle2Icon  },
  EN_COURS:  { label:"En cours",   bg:"bg-[#FAECE7]", text:"text-[#993C1D]",  dot:"bg-[#E8450A]",  icon: PlayCircleIcon   },
  COMPLETED: { label:"Terminée",   bg:"bg-[#EAF3DE]", text:"text-[#3B6D11]",  dot:"bg-[#639922]",  icon: CheckCircle2Icon  },
  CANCELLED: { label:"Annulée",    bg:"bg-slate-100",  text:"text-slate-500",  dot:"bg-slate-400",  icon: XCircleIcon      },
  DRAFT:     { label:"Brouillon",  bg:"bg-amber-50",   text:"text-amber-800",  dot:"bg-amber-400",  icon: AlertCircleIcon  },
}

const PLANNING_TYPE = {
  BLOC:      { label:"Bloc continu",   cls:"bg-[#1B3A6B]/8 text-[#1B3A6B] border-[#1B3A6B]/20"    },
  RECURRENT: { label:"Récurrent",      cls:"bg-violet-50 text-violet-700 border-violet-200"         },
}

function getSS(s) { return SESSION_STATUS[s] ?? SESSION_STATUS.PLANNED }
function getOS(s) { return OCC_STATUS[s]     ?? OCC_STATUS.PLANNED      }

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function fmtDate(d, opts = {}) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("fr-DZ", {
    day: "2-digit", month: "long", year: "numeric", ...opts,
  })
}
function fmtDateShort(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short" })
}
function fmtDayName(d) {
  if (!d) return ""
  return new Date(d).toLocaleDateString("fr-DZ", { weekday: "long" })
}
function fmtTime(t) {
  return t ? t.slice(0, 5) : "—"
}
function durationLabel(start, end) {
  if (!start || !end) return "—"
  const d1 = new Date(start), d2 = new Date(end)
  const days = Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1
  return `${days} jour${days > 1 ? "s" : ""}`
}

/* ─── Scroll-reveal ───────────────────────────────────────────────────────── */
function useInView(threshold = 0.08) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, v]
}
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, v] = useInView()
  return (
    <div ref={ref} className={className} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(18px)",
      transition: `opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms`,
    }}>{children}</div>
  )
}

/* ─── Progress bar ────────────────────────────────────────────────────────── */
function ProgressBar({ occurrences }) {
  const total     = occurrences.length
  const completed = occurrences.filter(o => o.status === "COMPLETED").length
  const enCours   = occurrences.filter(o => o.status === "EN_COURS").length
  const cancelled = occurrences.filter(o => o.status === "CANCELLED").length
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl px-6 py-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Progression</p>
        <span className="text-lg font-black text-[#1B3A6B]">{pct}%</span>
      </div>

      {/* Segmented bar */}
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
        {occurrences.map((occ, i) => {
          const os = getOS(occ.status)
          const dotCls = {
            COMPLETED: "bg-[#639922]",
            EN_COURS:  "bg-[#E8450A]",
            CANCELLED: "bg-slate-300",
            PLANNED:   "bg-[#185FA5]",
            CONFIRMED: "bg-emerald-500",
            DRAFT:     "bg-amber-400",
          }[occ.status] ?? "bg-slate-300"
          return (
            <div
              key={occ.id}
              className={`flex-1 h-full rounded-sm ${dotCls} transition-all`}
              title={`${fmtDateShort(occ.planned_date)} — ${getOS(occ.status).label}`}
            />
          )
        })}
      </div>

      <div className="flex flex-wrap gap-4 mt-3">
        {[
          { label: "Terminées",  count: completed, cls: "bg-[#EAF3DE] text-[#3B6D11]"  },
          { label: "En cours",   count: enCours,   cls: "bg-[#FAECE7] text-[#993C1D]"  },
          { label: "Annulées",   count: cancelled, cls: "bg-slate-100 text-slate-500"   },
          { label: "Restantes",  count: total - completed - enCours - cancelled, cls: "bg-[#E6F1FB] text-[#0C447C]" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${s.cls}`}>{s.count}</span>
            <span className="text-[11px] text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Occurrence row ──────────────────────────────────────────────────────── */
function OccurrenceRow({ occ, index }) {
  const os     = getOS(occ.status)
  const Icon   = os.icon
  const isLast = false

  return (
    <div
      className="group flex items-start gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors"
      style={{ animation: `fadeUp .3s ease ${index * 35}ms both` }}
    >
      {/* Timeline connector */}
      <div className="flex flex-col items-center shrink-0 pt-0.5">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
          occ.status === "COMPLETED" ? "bg-[#EAF3DE] border-[#639922]" :
          occ.status === "EN_COURS"  ? "bg-[#FAECE7] border-[#E8450A]" :
          occ.status === "CANCELLED" ? "bg-slate-100 border-slate-300" :
          "bg-[#E6F1FB] border-[#185FA5]"
        }`}>
          <Icon size={14} className={os.text} />
        </div>
        <div className="w-px flex-1 bg-slate-200 mt-1 min-h-[16px]" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-slate-800 capitalize">{fmtDayName(occ.planned_date)}</p>
              <span className="text-slate-300">·</span>
              <p className="text-sm font-bold text-[#1B3A6B]">{fmtDate(occ.planned_date, { day:"2-digit", month:"long" })}</p>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <ClockIcon size={11} />
                {fmtTime(occ.start_at)} – {fmtTime(occ.end_at)}
              </span>
              <span className="text-[10px] font-mono text-slate-300">#{index + 1}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${os.bg} ${os.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${os.dot}`} />
              {os.label}
            </span>
            <button className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-400 transition-all">
              <MoreHorizontalIcon size={14} />
            </button>
          </div>
        </div>

        {occ.notes && (
          <p className="mt-2 text-xs text-slate-400 italic">{occ.notes}</p>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function SessionDetails() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const data = await fetchSession(id)
        setSession(data)
      } catch (e) {
        setError("Impossible de charger la session.")
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <style></style>
      <div className="bg-white border-b border-slate-200 px-6 py-6">
        <div className="max-w-5xl mx-auto animate-pulse space-y-3">
          <div className="h-3 bg-slate-200 rounded w-40" />
          <div className="h-7 bg-slate-200 rounded w-64" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`bg-white border border-slate-200 rounded-xl p-6 animate-pulse h-32 ${i < 2 ? "lg:col-span-2" : ""}`} />
        ))}
      </div>
    </div>
  )

  if (error || !session) return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
      <style>{fontImport}</style>
      <div className="text-center">
        <XCircleIcon size={36} className="text-red-400 mx-auto mb-3" />
        <p className="font-bold text-slate-700">{error ?? "Session introuvable"}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-xs font-bold uppercase tracking-widest text-[#E8450A] hover:underline">← Retour</button>
      </div>
    </div>
  )

  const ss      = getSS(session.status)
  const pt      = PLANNING_TYPE[session.type_planning] ?? PLANNING_TYPE.BLOC
  const total   = session.occurrences?.length ?? 0
  const done    = session.occurrences?.filter(o => o.status === "COMPLETED").length ?? 0
  const canStart = session.status === "PLANNED" || session.status === "CONFIRMED"

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <style>{`
       
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .4s ease both}
        .fade-up-1{animation:fadeUp .4s ease 60ms both}
        .fade-up-2{animation:fadeUp .4s ease 120ms both}
        .fade-up-3{animation:fadeUp .4s ease 180ms both}
      `}</style>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="fade-up">
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#1B3A6B] transition-colors"
                >
                  <ArrowLeftIcon size={12} /> Retour
                </button>
                <span className="text-slate-300">/</span>
                <AppBreadcrumb />
              </div>

              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <h1 className="text-2xl font-black text-[#1B3A6B] tracking-tight leading-tight">
                  {session.formation_title}
                </h1>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${ss.bg} ${ss.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
                  {ss.label}
                </span>
                <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${pt.cls}`}>
                  {pt.label}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">Session #{session.session_number} · {session.id}</p>
            </div>

            {/* Actions */}
            <div className="fade-up flex items-center gap-2 flex-wrap" style={{ animationDelay:"80ms" }}>
              {canStart && (
                <button className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg border-2 border-emerald-500 hover:-translate-y-0.5 hover:shadow-lg transition-all">
                  <PlayCircleIcon size={13} /> Démarrer
                </button>
              )}
              <button className="inline-flex items-center gap-2 text-[#1B3A6B] text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg border-2 border-[#1B3A6B] hover:bg-[#1B3A6B] hover:text-white hover:-translate-y-0.5 transition-all">
                <PencilIcon size={13} /> Modifier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT: main content (2/3) ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Hero banner */}
            <Reveal>
              <div
                className="rounded-xl p-6 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${ss.gradFrom} 0%, ${ss.gradTo} 100%)` }}
              >
                <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />

                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-5">
                  {[
                    { label:"Formateur",  value: session.formateur_name, icon: UserRoundIcon  },
                    { label:"Début",      value: fmtDate(session.start_date, { day:"2-digit", month:"short", year:"numeric" }), icon: CalendarDaysIcon },
                    { label:"Fin",        value: fmtDate(session.end_date,   { day:"2-digit", month:"short", year:"numeric" }), icon: CalendarDaysIcon },
                    { label:"Durée",      value: durationLabel(session.start_date, session.end_date), icon: TimerIcon },
                  ].map((s) => {
                    const Icon = s.icon
                    return (
                      <div key={s.label}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon size={11} className="text-white/50" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">{s.label}</p>
                        </div>
                        <p className="text-sm font-black text-white leading-tight">{s.value}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Reveal>

            {/* Progress */}
            <Reveal delay={60}>
              <ProgressBar occurrences={session.occurrences ?? []} />
            </Reveal>

            {/* Occurrences timeline */}
            <Reveal delay={120}>
              <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 bg-[#1B3A6B]/8 rounded-md flex items-center justify-center">
                      <LayersIcon size={13} className="text-[#1B3A6B]" />
                    </div>
                    <h2 className="text-sm font-bold text-[#1B3A6B]">Occurrences</h2>
                    <span className="text-[10px] font-black text-white bg-[#1B3A6B] px-2 py-0.5 rounded-full">
                      {total}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CheckCircle2Icon size={12} className="text-[#639922]" />
                    {done}/{total} complétées
                  </div>
                </div>

                {session.occurrences?.length === 0 ? (
                  <div className="py-14 text-center">
                    <LayersIcon size={32} className="text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-600 text-sm">Aucune occurrence</p>
                  </div>
                ) : (
                  <div>
                    {session.occurrences.map((occ, i) => (
                      <OccurrenceRow key={occ.id} occ={occ} index={i} />
                    ))}
                    {/* Last connector cap */}
                    <div className="h-3" />
                  </div>
                )}
              </div>
            </Reveal>

            {/* Coming soon placeholders */}
            <Reveal delay={160}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: MapPinIcon,   title: "Salle",            sub: "Bientôt disponible" },
                  { icon: UsersIcon,    title: "Participants",      sub: "Bientôt disponible" },
                  { icon: FileTextIcon, title: "Liste de présence", sub: "Bientôt disponible" },
                ].map((card) => {
                  const Icon = card.icon
                  return (
                    <div key={card.title} className="bg-white border border-[#E2E8F0] rounded-xl p-5 opacity-60">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                        <Icon size={16} className="text-slate-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-600">{card.title}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                        {card.sub}
                      </p>
                    </div>
                  )
                })}
              </div>
            </Reveal>
          </div>

          {/* ── RIGHT: detail panel (1/3) ────────────────────────── */}
          <div className="space-y-5">

            {/* Info card */}
            <Reveal delay={80}>
              <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#1B3A6B]/8 rounded-md flex items-center justify-center">
                    <ActivityIcon size={13} className="text-[#1B3A6B]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1B3A6B]">Détails</h3>
                </div>
                <div className="px-5 py-4 space-y-4">
                  {[
                    { label:"Statut",         value: <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${ss.bg} ${ss.text}`}><span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`}/>{ss.label}</span> },
                    { label:"Planification",  value: <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${pt.cls}`}>{pt.label}</span> },
                    { label:"Séance #",       value: session.session_number },
                    { label:"Formateur",      value: session.formateur_name },
                    { label:"Formation",      value: <span className="text-[#1B3A6B] font-bold">{session.formation_title}</span> },
                    { label:"Période",        value: `${fmtDate(session.start_date, { day:"2-digit", month:"short" })} → ${fmtDate(session.end_date, { day:"2-digit", month:"short", year:"numeric" })}` },
                    { label:"Durée totale",   value: durationLabel(session.start_date, session.end_date) },
                    { label:"Occurrences",    value: `${total} séances` },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 shrink-0">{row.label}</p>
                      <div className="text-xs font-semibold text-slate-700 text-right">{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* IDs card */}
            <Reveal delay={120}>
              <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#1B3A6B]/8 rounded-md flex items-center justify-center">
                    <HashIcon size={13} className="text-[#1B3A6B]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1B3A6B]">Références</h3>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {[
                    { label:"Session ID",   value: session.id },
                    { label:"Formation ID", value: session.formation_id },
                    { label:"Formateur ID", value: session.formateur_id },
                  ].map(row => (
                    <div key={row.label}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{row.label}</p>
                      <p className="text-[11px] font-mono text-slate-500 break-all leading-relaxed">{row.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Quick nav */}
            <Reveal delay={160}>
              <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-[#1B3A6B]">Navigation rapide</h3>
                </div>
                <div className="px-5 py-3 space-y-1">
                  {[
                    { label:"Voir la formation", url:`/courses/${session.formation_id}`, icon: BookOpenIcon },
                    { label:"Profil du formateur", url:`/trainers/${session.formateur_id}`, icon: UserRoundIcon },
                  ].map(link => {
                    const Icon = link.icon
                    return (
                      <button
                        key={link.label}
                        onClick={() => navigate(link.url)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left transition-colors group"
                      >
                        <Icon size={14} className="text-slate-400 group-hover:text-[#1B3A6B] transition-colors" />
                        <span className="text-xs font-semibold text-slate-600 group-hover:text-[#1B3A6B] transition-colors flex-1">{link.label}</span>
                        <ChevronRightIcon size={12} className="text-slate-300 group-hover:text-[#E8450A] transition-colors" />
                      </button>
                    )
                  })}
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </div>
  )
}

