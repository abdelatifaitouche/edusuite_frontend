// src/pages/crm/OpportunityDetail.jsx
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  TrophyIcon,
  CalendarIcon,
  PercentIcon,
  DollarSignIcon,
  MapPinIcon,
  UsersIcon,
  BuildingIcon,
  ClockIcon,
  PlusIcon,
  CheckCircle2Icon,
  XCircleIcon,
  AlertCircleIcon,
  LoaderCircleIcon,
  SparklesIcon,
  TargetIcon,
  TrendingUpIcon,
  FileTextIcon,
  RefreshCwIcon,
  EditIcon,
} from "lucide-react"
import { AppBreadcrumb } from "@/components/AppBreadcrumb"

import { getOpportunity ,transitionNext , markAsWon , createSessionPlan } from "@/services/opportunity.service"



/* ─── Config ─────────────────────────────────────────────────────────────── */
const STAGES = [
  { id: "NEW",           label: "Nouveau",      short: "New" },
  { id: "NEED_ANALYSIS", label: "Analyse",      short: "Analyse" },
  { id: "PROPOSAL",      label: "Proposition",  short: "Prop." },
  { id: "NEGOTIATION",   label: "Négociation",  short: "Négoc." },
  { id: "WON",           label: "Gagné",        short: "Gagné" },
]

const STAGE_META = {
  NEW:           { color: "bg-slate-400",   bg: "bg-slate-100",   text: "text-slate-600",   border: "border-slate-300",   ring: "ring-slate-400" },
  NEED_ANALYSIS: { color: "bg-blue-500",    bg: "bg-blue-50",     text: "text-blue-700",    border: "border-blue-300",    ring: "ring-blue-500"  },
  PROPOSAL:      { color: "bg-violet-500",  bg: "bg-violet-50",   text: "text-violet-700",  border: "border-violet-300",  ring: "ring-violet-500"},
  NEGOTIATION:   { color: "bg-amber-500",   bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-300",   ring: "ring-amber-500" },
  WON:           { color: "bg-emerald-500", bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-300", ring: "ring-emerald-500"},
  LOST:          { color: "bg-red-400",     bg: "bg-red-50",      text: "text-red-600",     border: "border-red-300",     ring: "ring-red-400"   },
}

const SESSION_PLAN_STATUS = {
  DRAFT:     { label: "Brouillon",  cls: "bg-slate-100 text-slate-600 border-slate-200" },
  CONFIRMED: { label: "Confirmé",   cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "Annulé",     cls: "bg-red-50 text-red-600 border-red-200" },
}

const LOCATION_TYPE = {
  HOTEL:    { label: "Hôtel / Venue externe",  icon: BuildingIcon },
  ECF:      { label: "Salle ECF",              icon: MapPinIcon   },
  ONLINE:   { label: "En ligne",               icon: SparklesIcon },
  CLIENT:   { label: "Site client",            icon: MapPinIcon   },
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function fmt(v) {
  if (!v && v !== 0) return "—"
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M DZD`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(1)}K DZD`
  return `${v} DZD`
}
function fmtDate(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("fr-DZ", { day: "2-digit", month: "long", year: "numeric" })
}
function fmtDateShort(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" })
}
function fmtDateTime(d) {
  if (!d) return "—"
  return new Date(d).toLocaleString("fr-DZ", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })
}
function stageIndex(status) {
  return STAGES.findIndex((s) => s.id === status)
}
function isOverdue(dateStr) {
  return dateStr && new Date(dateStr) < new Date()
}

/* ─── Reveal ─────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}
function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useInView()
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

/* ─── Stage Progress Bar ─────────────────────────────────────────────────── */
function StageProgress({ status }) {
  if (status === "LOST") {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3.5">
        <XCircleIcon size={18} className="text-red-500 shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-600">Opportunité perdue</p>
          <p className="text-xs text-red-400 mt-0.5">Cette opportunité a été marquée comme perdue.</p>
        </div>
      </div>
    )
  }

  const current = stageIndex(status)

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl px-5 py-4">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Pipeline</p>
      <div className="flex items-center gap-0">
        {STAGES.map((stage, i) => {
          const meta    = STAGE_META[stage.id]
          const isDone  = i < current
          const isCurr  = i === current
          const isWon   = stage.id === "WON" && status === "WON"
          const isLast  = i === STAGES.length - 1

          return (
            <div key={stage.id} className="flex items-center flex-1">
              {/* Step */}
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-black
                  transition-all duration-300
                  ${isDone  ? "bg-[#1B3A6B] text-white shadow-md"         : ""}
                  ${isCurr  ? `${meta.color} text-white shadow-lg ring-4 ${meta.ring}/25` : ""}
                  ${!isDone && !isCurr ? "bg-slate-100 text-slate-400 border border-slate-200" : ""}
                `}>
                  {isDone
                    ? <CheckCircle2Icon size={14} />
                    : isWon
                    ? <TrophyIcon size={14} />
                    : <span>{i + 1}</span>
                  }
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide whitespace-nowrap
                  ${isCurr  ? meta.text   : ""}
                  ${isDone  ? "text-[#1B3A6B]" : ""}
                  ${!isDone && !isCurr ? "text-slate-400" : ""}
                `}>
                  {stage.short}
                </span>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className={`h-0.5 flex-1 mx-1 rounded transition-all duration-300 ${
                  i < current ? "bg-[#1B3A6B]" : "bg-slate-200"
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Session Plan Card ──────────────────────────────────────────────────── */
function SessionPlanCard({ plan, opportunityId, canCreate, onCreated }) {
  const [creating,  setCreating]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState(null)
  const [form, setForm] = useState({
    expected_students: "",
    location_type:     "HOTEL",
    venue_cost:        "",
    cost_per_student:  "",
  })

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        expected_students: parseInt(form.expected_students) || 0,
        location_type:     form.location_type,
        venue_cost:        parseFloat(form.venue_cost)       || 0,
        cost_per_student:  parseFloat(form.cost_per_student) || 0,
      }
      const result = await createSessionPlan(opportunityId, payload)
      onCreated(result)
      setCreating(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* No plan exists */
  if (!plan && !creating) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
          <div className="w-6 h-6 bg-[#1B3A6B]/8 rounded-md flex items-center justify-center">
            <FileTextIcon size={13} className="text-[#1B3A6B]" />
          </div>
          <h2 className="text-sm font-bold text-[#1B3A6B]">Plan de session</h2>
        </div>

        <div className="px-6 py-10 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileTextIcon size={20} className="text-slate-400" />
          </div>
          <p className="font-bold text-slate-700 text-sm">Aucun plan de session</p>

          {canCreate ? (
            <>
              <p className="text-xs text-slate-400 mt-1 mb-5">
                Créez un plan pour définir la logistique de cette formation.
              </p>
              <button
                onClick={() => setCreating(true)}
                className="inline-flex items-center gap-2 bg-[#E8450A] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg border-2 border-[#E8450A] hover:bg-[#c73a08] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-900/20 transition-all"
              >
                <PlusIcon size={13} />
                Créer un plan
              </button>
            </>
          ) : (
            <p className="text-xs text-slate-400 mt-1">
              Disponible une fois l'opportunité en phase <strong className="text-[#1B3A6B]">Analyse</strong>.
            </p>
          )}
        </div>
      </div>
    )
  }

  /* Create form */
  if (creating) {
    const LocationIcon = LOCATION_TYPE[form.location_type]?.icon ?? MapPinIcon
    const totalCost = (parseFloat(form.venue_cost) || 0) + (parseFloat(form.cost_per_student) || 0) * (parseInt(form.expected_students) || 0)

    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-[#E8450A]/8 rounded-md flex items-center justify-center">
              <PlusIcon size={13} className="text-[#E8450A]" />
            </div>
            <h2 className="text-sm font-bold text-[#1B3A6B]">Nouveau plan de session</h2>
          </div>
          <button onClick={() => setCreating(false)} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Annuler
          </button>
        </div>

        <form onSubmit={handleCreate} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircleIcon size={14} className="text-red-500 shrink-0" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Location type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Type de lieu <span className="text-[#E8450A]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(LOCATION_TYPE).map(([key, val]) => {
                const Icon = val.icon
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, location_type: key }))}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 text-xs font-semibold transition-all ${
                      form.location_type === key
                        ? "border-[#1B3A6B] bg-[#1B3A6B]/8 text-[#1B3A6B]"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <Icon size={13} className="shrink-0" />
                    {val.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Expected students */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Nombre d'étudiants <span className="text-[#E8450A]">*</span>
            </label>
            <input
              type="number" min="1"
              placeholder="Ex: 15"
              value={form.expected_students}
              onChange={(e) => setForm((f) => ({ ...f, expected_students: e.target.value }))}
              required
              className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg text-sm text-[#1A1A2E] px-4 py-3 placeholder:text-slate-400 outline-none focus:border-[#1B3A6B] focus:bg-white focus:ring-2 focus:ring-[#1B3A6B]/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Venue cost */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Coût venue (DZD)
              </label>
              <input
                type="number" min="0" step="100"
                placeholder="5 500"
                value={form.venue_cost}
                onChange={(e) => setForm((f) => ({ ...f, venue_cost: e.target.value }))}
                className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg text-sm text-[#1A1A2E] px-4 py-3 placeholder:text-slate-400 outline-none focus:border-[#1B3A6B] focus:bg-white focus:ring-2 focus:ring-[#1B3A6B]/10 transition-all"
              />
            </div>

            {/* Cost per student */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Coût / étudiant (DZD)
              </label>
              <input
                type="number" min="0" step="100"
                placeholder="1 500"
                value={form.cost_per_student}
                onChange={(e) => setForm((f) => ({ ...f, cost_per_student: e.target.value }))}
                className="w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg text-sm text-[#1A1A2E] px-4 py-3 placeholder:text-slate-400 outline-none focus:border-[#1B3A6B] focus:bg-white focus:ring-2 focus:ring-[#1B3A6B]/10 transition-all"
              />
            </div>
          </div>

          {/* Cost preview */}
          {totalCost > 0 && (
            <div className="bg-[#1B3A6B]/4 border border-[#1B3A6B]/15 rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#1B3A6B]/70">Coût total estimé</span>
              <span className="text-base font-black text-[#1B3A6B]">{fmt(totalCost)}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="flex-1 border-2 border-slate-200 hover:border-[#1B3A6B] text-slate-600 hover:text-[#1B3A6B] text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-[#E8450A] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg border-2 border-[#E8450A] hover:bg-[#c73a08] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <><LoaderCircleIcon size={13} className="animate-spin" /> Création…</> : "Créer le plan"}
            </button>
          </div>
        </form>
      </div>
    )
  }

  /* Plan exists — show details */
  const planStatus  = SESSION_PLAN_STATUS[plan.status] ?? SESSION_PLAN_STATUS.DRAFT
  const LocationIcon= LOCATION_TYPE[plan.location_type]?.icon ?? MapPinIcon
  const totalCost   = (plan.venue_cost ?? 0) + (plan.cost_per_student ?? 0) * (plan.expected_students ?? 0)

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-[#1B3A6B]/8 rounded-md flex items-center justify-center">
            <FileTextIcon size={13} className="text-[#1B3A6B]" />
          </div>
          <h2 className="text-sm font-bold text-[#1B3A6B]">Plan de session</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${planStatus.cls}`}>
            {planStatus.label}
          </span>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#1B3A6B] transition-colors">
            <EditIcon size={13} />
          </button>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        {/* Location */}
        <div className="flex items-center gap-3 p-3 bg-[#F5F7FA] rounded-lg">
          <LocationIcon size={16} className="text-[#1B3A6B] shrink-0" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Lieu</p>
            <p className="text-sm font-semibold text-slate-700">
              {LOCATION_TYPE[plan.location_type]?.label ?? plan.location_type}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Étudiants",    value: plan.expected_students ?? "—", icon: UsersIcon },
            { label: "Coût venue",   value: fmt(plan.venue_cost),           icon: BuildingIcon },
            { label: "Coût/étudiant",value: fmt(plan.cost_per_student),     icon: DollarSignIcon },
          ].map((s) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="bg-[#F5F7FA] rounded-lg p-3 text-center">
                <Icon size={13} className="text-slate-400 mx-auto mb-1.5" />
                <p className="text-base font-black text-[#1B3A6B]">{s.value}</p>
                <p className="text-[9px] uppercase tracking-wide text-slate-400 mt-0.5">{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* Total cost */}
        <div className="bg-gradient-to-r from-[#1B3A6B]/6 to-[#1B3A6B]/3 border border-[#1B3A6B]/15 rounded-lg px-4 py-3 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#1B3A6B]/70">Coût total estimé</span>
          <span className="text-lg font-black text-[#1B3A6B]">{fmt(totalCost)}</span>
        </div>

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
          {[
            { label: "Créé le",   value: fmtDateTime(plan.created_at) },
            { label: "Modifié le",value: fmtDateTime(plan.updated_at) },
          ].map((r) => (
            <div key={r.label}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{r.label}</p>
              <p className="text-xs text-slate-600 mt-0.5">{r.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`
      fixed bottom-6 right-6 z-50 flex items-center gap-3
      px-5 py-3.5 rounded-xl shadow-2xl border
      ${type === "success"
        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
        : "bg-red-50 border-red-200 text-red-700"}
    `}
      style={{ animation: "slideUp 0.3s ease both" }}
    >
      {type === "success"
        ? <CheckCircle2Icon size={16} className="text-emerald-500 shrink-0" />
        : <AlertCircleIcon  size={16} className="text-red-500 shrink-0" />}
      <p className="text-sm font-semibold">{message}</p>
      <button onClick={onClose} className="ml-2 text-xs opacity-50 hover:opacity-100">✕</button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function OpportunityDetails() {
  const { id }     = useParams()
  const navigate   = useNavigate()

  const [opp,          setOpp]          = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [transitioning,setTransitioning]= useState(false)
  const [winning,      setWinning]      = useState(false)
  const [toast,        setToast]        = useState(null)

  /* ── Fetch ── */
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const data = await getOpportunity(id)
        setOpp(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  /* ── Transition next ── */
  const handleTransition = async () => {
    setTransitioning(true)
    try {
      const updated = await transitionNext(id)
      setOpp(updated.data)
      setToast({ message: `Statut mis à jour → ${STAGE_META[updated.status] ? updated.status : updated.status}`, type: "success" })
    } catch (err) {
      setToast({ message: err.message, type: "error" })
    } finally {
      setTransitioning(false)
    }
  }

  /* ── Mark as won ── */
  const handleWon = async () => {
    setWinning(true)
    try {
      const updated = await markAsWon(id)
      setOpp(updated)
      setToast({ message: "🏆 Opportunité marquée comme gagnée !", type: "success" })
    } catch (err) {
      setToast({ message: err.message, type: "error" })
    } finally {
      setWinning(false)
    }
  }

  const handleSessionPlanCreated = (plan) => {
    setOpp((prev) => ({ ...prev, session_plan: plan }))
    setToast({ message: "Plan de session créé avec succès.", type: "success" })
  }

  /* ── Computed ── */
  const stage          = opp ? (STAGE_META[opp.status] ?? STAGE_META.NEW) : null
  const stageName      = opp ? (STAGES.find((s) => s.id === opp.status)?.label ?? opp.status) : ""
  const isTerminal     = opp?.status === "WON" || opp?.status === "LOST"
  const isWon          = opp?.status === "WON"
  const isLost         = opp?.status === "LOST"
  const canTransition  = !isTerminal
  const canMarkWon     = opp?.status === "NEGOTIATION"
  const canCreatePlan  = opp?.status === "NEED_ANALYSIS"
  const overdue        = opp && isOverdue(opp.expected_close_date) && !isTerminal
  const currIdx        = opp ? stageIndex(opp.status) : -1
  const nextStage      = currIdx >= 0 && currIdx < STAGES.length - 1 ? STAGES[currIdx + 1] : null

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'); *{font-family:'Plus Jakarta Sans',sans-serif;}`}</style>
        <div className="bg-white border-b border-slate-200 px-6 py-6">
          <div className="max-w-5xl mx-auto space-y-3">
            <div className="h-3 bg-slate-200 rounded w-40 animate-pulse" />
            <div className="h-7 bg-slate-200 rounded w-64 animate-pulse" />
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`bg-white border border-[#E2E8F0] rounded-xl p-6 animate-pulse ${i < 2 ? "lg:col-span-2" : ""}`}>
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-6">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'); *{font-family:'Plus Jakarta Sans',sans-serif;}`}</style>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center max-w-sm">
          <XCircleIcon size={40} className="text-red-400 mx-auto mb-4" />
          <p className="font-bold text-slate-700">Erreur de chargement</p>
          <p className="text-sm text-slate-500 mt-1 mb-6">{error}</p>
          <button onClick={() => navigate(-1)} className="text-xs font-bold uppercase tracking-widest text-[#1B3A6B] hover:text-[#E8450A] transition-colors">
            ← Retour
          </button>
        </div>
      </div>
    )
  }

  /* ── Main render ── */
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .4s ease both; }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="fade-up">
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#1B3A6B] transition-colors"
                >
                  <ArrowLeftIcon size={12} /> Retour
                </button>
                <span className="text-slate-300">/</span>
                <AppBreadcrumb />
              </div>

              <div className="flex items-center gap-3 mt-2">
                <h1 className="text-2xl font-black text-[#1B3A6B] tracking-tight leading-tight">
                  {opp.title}
                </h1>
                {/* Status badge */}
                <span className={`
                  inline-flex items-center gap-1.5
                  text-[10px] font-bold uppercase tracking-widest
                  px-2.5 py-1 rounded-full border
                  ${stage.bg} ${stage.text} ${stage.border}
                `}>
                  <span className={`w-1.5 h-1.5 rounded-full ${stage.color}`} />
                  {stageName}
                </span>

                {isWon && <TrophyIcon size={18} className="text-amber-500" />}
                {overdue && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                    <AlertCircleIcon size={10} /> En retard
                  </span>
                )}
              </div>

              <p className="text-xs font-mono text-slate-400 mt-1">{opp.id}</p>
            </div>

            {/* CTA actions */}
            {!isTerminal && (
              <div className="fade-up flex items-center gap-2 flex-wrap" style={{ animationDelay: "80ms" }}>
                {/* Mark as won */}
                {canMarkWon && (
                  <button
                    onClick={handleWon}
                    disabled={winning}
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg border-2 border-amber-500 hover:border-amber-600 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {winning
                      ? <><LoaderCircleIcon size={13} className="animate-spin" /> Traitement…</>
                      : <><TrophyIcon size={13} /> Marquer Gagné</>
                    }
                  </button>
                )}

                {/* Advance stage */}
                {canTransition && nextStage && (
                  <button
                    onClick={handleTransition}
                    disabled={transitioning}
                    className="inline-flex items-center gap-2 bg-[#E8450A] hover:bg-[#c73a08] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg border-2 border-[#E8450A] hover:border-[#c73a08] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {transitioning
                      ? <><LoaderCircleIcon size={13} className="animate-spin" /> Mise à jour…</>
                      : <><ChevronRightIcon size={13} /> Passer à : {nextStage.label}</>
                    }
                  </button>
                )}
              </div>
            )}

            {isWon && (
              <div className="fade-up flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2" style={{ animationDelay: "80ms" }}>
                <TrophyIcon size={16} className="text-amber-500" />
                <span className="text-xs font-bold text-emerald-700">Opportunité gagnée !</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT COLUMN (2/3) ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Stage progress */}
            <Reveal>
              <StageProgress status={opp.status} />
            </Reveal>

            {/* Key metrics */}
            <Reveal delay={60}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    label: "Valeur estimée",
                    value: fmt(opp.estimated_value),
                    icon:  DollarSignIcon,
                    accent: true,
                  },
                  {
                    label: "Probabilité",
                    value: `${Math.round((opp.probability ?? 0) * 100)}%`,
                    icon:  PercentIcon,
                    accent: false,
                  },
                  {
                    label: "Clôture prévue",
                    value: fmtDateShort(opp.expected_close_date),
                    icon:  CalendarIcon,
                    accent: overdue,
                    accentClass: overdue ? "text-red-500" : null,
                  },
                  {
                    label: "Phase",
                    value: stageName,
                    icon:  TargetIcon,
                    accent: false,
                  },
                ].map((s) => {
                  const Icon = s.icon
                  return (
                    <div key={s.label} className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
                        <Icon size={12} className={s.accentClass ?? "text-slate-300"} />
                      </div>
                      <p className={`text-lg font-black leading-none ${s.accentClass ?? (s.accent ? "text-[#E8450A]" : "text-[#1B3A6B]")}`}>
                        {s.value}
                      </p>
                    </div>
                  )
                })}
              </div>
            </Reveal>

            {/* Probability bar */}
            <Reveal delay={100}>
              <div className="bg-white border border-[#E2E8F0] rounded-xl px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Probabilité de succès</p>
                  <span className="text-lg font-black text-[#1B3A6B]">
                    {Math.round((opp.probability ?? 0) * 100)}%
                  </span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      opp.probability >= 0.7 ? "bg-emerald-400" :
                      opp.probability >= 0.4 ? "bg-amber-400" : "bg-red-400"
                    }`}
                    style={{ width: `${(opp.probability ?? 0) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-slate-300">0%</span>
                  <span className="text-[10px] text-slate-300">100%</span>
                </div>
              </div>
            </Reveal>

            {/* Session plan */}
            <Reveal delay={140}>
              <SessionPlanCard
                plan={opp.session_plan}
                opportunityId={opp.id}
                canCreate={canCreatePlan}
                onCreated={handleSessionPlanCreated}
              />
            </Reveal>
          </div>

          {/* ── RIGHT COLUMN (1/3) ────────────────────────────────── */}
          <div className="space-y-5">

            {/* Details card */}
            <Reveal delay={80}>
              <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#1B3A6B]/8 rounded-md flex items-center justify-center">
                    <TrendingUpIcon size={13} className="text-[#1B3A6B]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1B3A6B]">Détails</h3>
                </div>

                <div className="px-5 py-4 space-y-4">
                  {[
                    { label: "Identifiant",   value: <span className="font-mono text-[11px] text-slate-500 break-all">{opp.id}</span> },
                    { label: "Statut",        value: <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${stage.bg} ${stage.text} ${stage.border}`}><span className={`w-1.5 h-1.5 rounded-full ${stage.color}`}/>{stageName}</span> },
                    { label: "Valeur",        value: <span className="font-black text-[#1B3A6B]">{fmt(opp.estimated_value)}</span> },
                    { label: "Probabilité",   value: `${Math.round((opp.probability ?? 0) * 100)}%` },
                    { label: "Clôture",       value: <span className={overdue ? "text-red-500 font-semibold" : ""}>{fmtDate(opp.expected_close_date)}</span> },
                    { label: "Créé le",       value: fmtDateTime(opp.created_at) },
                    { label: "Modifié le",    value: fmtDateTime(opp.updated_at) },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 shrink-0">{row.label}</p>
                      <div className="text-xs font-medium text-slate-700 text-right">{row.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Quick actions */}
            {!isTerminal && (
              <Reveal delay={120}>
                <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-[#1B3A6B]">Actions rapides</h3>
                  </div>
                  <div className="px-5 py-4 space-y-2">
                    {canTransition && nextStage && (
                      <button
                        onClick={handleTransition}
                        disabled={transitioning}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-[#E8450A]/6 border border-[#E8450A]/20 hover:bg-[#E8450A]/10 transition-all text-left group disabled:opacity-60"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronRightIcon size={14} className="text-[#E8450A]" />
                          <span className="text-xs font-bold text-[#E8450A]">
                            Avancer → {nextStage.label}
                          </span>
                        </div>
                        {transitioning && <LoaderCircleIcon size={13} className="animate-spin text-[#E8450A]" />}
                      </button>
                    )}

                    {canMarkWon && (
                      <button
                        onClick={handleWon}
                        disabled={winning}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all text-left disabled:opacity-60"
                      >
                        <div className="flex items-center gap-2">
                          <TrophyIcon size={14} className="text-amber-500" />
                          <span className="text-xs font-bold text-amber-700">Marquer comme Gagné</span>
                        </div>
                        {winning && <LoaderCircleIcon size={13} className="animate-spin text-amber-500" />}
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/crm/opportunities/${id}/edit`)}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-[#F5F7FA] border border-slate-200 hover:border-[#1B3A6B] hover:bg-white transition-all text-left"
                    >
                      <EditIcon size={14} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-600">Modifier l'opportunité</span>
                    </button>

                    <button
                      onClick={() => { setLoading(true); getOpportunity(id).then(setOpp).finally(() => setLoading(false)) }}
                      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-[#F5F7FA] border border-slate-200 hover:border-[#1B3A6B] hover:bg-white transition-all text-left"
                    >
                      <RefreshCwIcon size={14} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-600">Rafraîchir</span>
                    </button>
                  </div>
                </div>
              </Reveal>
            )}

            {/* Won celebration */}
            {isWon && (
              <Reveal delay={100}>
                <div className="bg-gradient-to-br from-amber-50 to-emerald-50 border border-amber-200 rounded-xl px-5 py-6 text-center">
                  <TrophyIcon size={32} className="text-amber-500 mx-auto mb-3" />
                  <p className="font-black text-[#1B3A6B] text-base">Félicitations !</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Opportunité conclue avec succès.
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      {/* ── Toast ─────────────────────────────────────────────────── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}