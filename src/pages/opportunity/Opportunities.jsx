import { useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AppBreadcrumb } from "@/components/AppBreadcrumb"
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  SearchIcon,
  PlusIcon,
  TrendingUpIcon,
  DollarSignIcon,
  TargetIcon,
  AlertTriangleIcon,
  GripVerticalIcon,
  CalendarIcon,
  PercentIcon,
  ChevronRightIcon,
} from "lucide-react"

/* ─── Config ────────────────────────────────────────────────────────────── */
const STAGES = [
  {
    id:       "NEW",
    label:    "Nouveau",
    color:    "bg-slate-400",
    colorBg:  "bg-slate-100",
    colorText:"text-slate-600",
    colorBorder:"border-slate-300",
    wipLimit: 10,
  },
  {
    id:       "NEED_ANALYSIS",
    label:    "Analyse",
    color:    "bg-blue-500",
    colorBg:  "bg-blue-50",
    colorText:"text-blue-700",
    colorBorder:"border-blue-300",
    wipLimit: 10,
  },
  {
    id:       "PROPOSAL",
    label:    "Proposition",
    color:    "bg-violet-500",
    colorBg:  "bg-violet-50",
    colorText:"text-violet-700",
    colorBorder:"border-violet-300",
    wipLimit: 8,
  },
  {
    id:       "NEGOTIATION",
    label:    "Négociation",
    color:    "bg-amber-500",
    colorBg:  "bg-amber-50",
    colorText:"text-amber-700",
    colorBorder:"border-amber-300",
    wipLimit: 6,
  },
  {
    id:       "WON",
    label:    "Gagné",
    color:    "bg-emerald-500",
    colorBg:  "bg-emerald-50",
    colorText:"text-emerald-700",
    colorBorder:"border-emerald-300",
    wipLimit: 999,
  },
  {
    id:       "LOST",
    label:    "Perdu",
    color:    "bg-red-400",
    colorBg:  "bg-red-50",
    colorText:"text-red-600",
    colorBorder:"border-red-300",
    wipLimit: 999,
  },
]

const STAGE_MAP = Object.fromEntries(STAGES.map((s) => [s.id, s]))

/* ─── Mock data ─────────────────────────────────────────────────────────── */
const MOCK = [
  { id: "1", title: "AOA Opportunity",           probability: 0.65, estimated_value: 1000000, expected_close_date: "2026-06-30", status: "PROPOSAL",      company: "AOA Group" },
  { id: "2", title: "GT Formation RH",            probability: 0.2,  estimated_value: 50000,   expected_close_date: "2026-06-30", status: "NEW",           company: "GT Entreprises" },
  { id: "3", title: "Pack SST Sonatrach",         probability: 0.8,  estimated_value: 280000,  expected_close_date: "2026-05-15", status: "NEGOTIATION",   company: "Sonatrach" },
  { id: "4", title: "CDC Formation Juridique",    probability: 0.5,  estimated_value: 120000,  expected_close_date: "2026-07-01", status: "NEED_ANALYSIS", company: "Cabinet Meziane" },
  { id: "5", title: "Coaching Management CEE",    probability: 0.9,  estimated_value: 450000,  expected_close_date: "2026-04-20", status: "WON",           company: "CEE Algeria" },
  { id: "6", title: "Pack Manager Cevital",       probability: 0.4,  estimated_value: 320000,  expected_close_date: "2026-08-10", status: "PROPOSAL",      company: "Cevital" },
  { id: "7", title: "DEP Secrétariat Batimetal",  probability: 0.15, estimated_value: 85000,   expected_close_date: "2026-09-01", status: "NEW",           company: "Batimetal" },
  { id: "8", title: "Audit RH Extranet",          probability: 0.0,  estimated_value: 60000,   expected_close_date: "2026-03-15", status: "LOST",          company: "Extranet SARL" },
  { id: "9", title: "Team Building Mobilis",      probability: 0.7,  estimated_value: 200000,  expected_close_date: "2026-05-30", status: "NEGOTIATION",   company: "Mobilis" },
  { id: "10",title: "Formation PNL Biopharm",     probability: 0.55, estimated_value: 95000,   expected_close_date: "2026-06-15", status: "NEED_ANALYSIS", company: "Biopharm" },
]

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function formatValue(v) {
  if (!v && v !== 0) return "—"
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M DZD`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K DZD`
  return `${v} DZD`
}

function formatDate(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" })
}

function probColor(p) {
  if (p >= 0.7) return "text-emerald-600"
  if (p >= 0.4) return "text-amber-600"
  return "text-red-500"
}

function isOverdue(dateStr) {
  return dateStr && new Date(dateStr) < new Date()
}

/* ─── Opportunity Card ──────────────────────────────────────────────────── */
function OpportunityCard({ op, isDragging = false }) {
  const stage = STAGE_MAP[op.status]
  const overdue = isOverdue(op.expected_close_date) && op.status !== "WON" && op.status !== "LOST"

  return (
    <div className={`
      bg-white rounded-xl border border-slate-200
      p-4 select-none
      transition-all duration-150
      ${isDragging
        ? "shadow-2xl shadow-blue-900/20 rotate-1 scale-105 border-[#1B3A6B]/30"
        : "hover:shadow-md hover:shadow-blue-900/8 hover:-translate-y-0.5"}
    `}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-bold text-slate-800 leading-tight flex-1">
          {op.title}
        </p>
        <GripVerticalIcon size={14} className="text-slate-300 shrink-0 mt-0.5 cursor-grab active:cursor-grabbing" />
      </div>

      {/* Company */}
      {op.company && (
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
          {op.company}
        </p>
      )}

      {/* Value */}
      <div className="flex items-center gap-1.5 mb-2">
        <DollarSignIcon size={11} className="text-[#1B3A6B] shrink-0" />
        <span className="text-sm font-black text-[#1B3A6B]">
          {formatValue(op.estimated_value)}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 mb-3" />

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2">
        {/* Probability */}
        <div className="flex items-center gap-1">
          <PercentIcon size={10} className="text-slate-400" />
          <span className={`text-xs font-bold ${probColor(op.probability)}`}>
            {Math.round(op.probability * 100)}%
          </span>
        </div>

        {/* Close date */}
        <div className={`flex items-center gap-1 ${overdue ? "text-red-500" : "text-slate-400"}`}>
          {overdue && <AlertTriangleIcon size={10} />}
          {!overdue && <CalendarIcon size={10} />}
          <span className="text-[11px] font-medium">
            {formatDate(op.expected_close_date)}
          </span>
        </div>
      </div>

      {/* Probability bar */}
      <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            op.probability >= 0.7 ? "bg-emerald-400" :
            op.probability >= 0.4 ? "bg-amber-400" : "bg-red-400"
          }`}
          style={{ width: `${op.probability * 100}%` }}
        />
      </div>
    </div>
  )
}

/* ─── Sortable wrapper ──────────────────────────────────────────────────── */
function SortableCard({ op }) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: op.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={isDragging ? "opacity-40" : ""}
      {...attributes}
      {...listeners}
    >
      <OpportunityCard op={op} />
    </div>
  )
}

/* ─── Column ────────────────────────────────────────────────────────────── */
function KanbanColumn({ stage, items }) {
  const totalValue = items.reduce((s, o) => s + (o.estimated_value ?? 0), 0)
  const isOverWip  = items.length > stage.wipLimit
  const isEmpty    = items.length === 0

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Column header */}
      <div className={`
        rounded-xl border mb-3 px-4 py-3
        ${stage.colorBg} ${stage.colorBorder}
      `}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`w-2 h-2 rounded-full ${stage.color} shrink-0`} />
            <span className={`text-xs font-black uppercase tracking-widest truncate ${stage.colorText}`}>
              {stage.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`
              text-[10px] font-black px-2 py-0.5 rounded-full
              ${isOverWip
                ? "bg-red-100 text-red-600 border border-red-200"
                : `${stage.colorBg} ${stage.colorText} border ${stage.colorBorder}`}
            `}>
              {items.length}
              {stage.wipLimit < 999 && `/${stage.wipLimit}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-2">
          <TrendingUpIcon size={10} className={stage.colorText} />
          <span className={`text-[11px] font-bold ${stage.colorText}`}>
            {formatValue(totalValue)}
          </span>
        </div>

        {isOverWip && (
          <div className="flex items-center gap-1 mt-1.5">
            <AlertTriangleIcon size={10} className="text-red-500" />
            <span className="text-[10px] font-bold text-red-500">
              Limite WIP dépassée
            </span>
          </div>
        )}
      </div>

      {/* Cards drop zone */}
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          id={stage.id}
          className={`
            flex-1 rounded-xl min-h-[200px] p-2 space-y-2
            border-2 border-dashed transition-colors duration-200
            ${isEmpty
              ? "border-slate-200 bg-slate-50/50"
              : "border-transparent bg-transparent"}
          `}
        >
          {items.map((op) => (
            <SortableCard key={op.id} op={op} />
          ))}

          {isEmpty && (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className={`w-8 h-8 rounded-full ${stage.colorBg} border ${stage.colorBorder} flex items-center justify-center`}>
                <span className={`text-lg ${stage.colorText}`}>·</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Aucune opportunité</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function Opportunities() {
  const [data,         setData]         = useState(MOCK)
  const [search,       setSearch]       = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [activeId,     setActiveId]     = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  /* ── Derived ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter((d) => {
      const matchSearch = !q || d.title.toLowerCase().includes(q) || d.company?.toLowerCase().includes(q)
      const matchStatus = statusFilter === "ALL" || d.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [data, search, statusFilter])

  const grouped = useMemo(() => {
    return STAGES.reduce((acc, s) => {
      acc[s.id] = filtered.filter((d) => d.status === s.id)
      return acc
    }, {})
  }, [filtered])

  const totalPipeline = useMemo(
    () => data.filter((d) => !["WON","LOST"].includes(d.status))
              .reduce((s, d) => s + (d.estimated_value ?? 0), 0),
    [data]
  )
  const totalWon = useMemo(
    () => data.filter((d) => d.status === "WON")
              .reduce((s, d) => s + (d.estimated_value ?? 0), 0),
    [data]
  )
  const activeOp = useMemo(() => data.find((d) => d.id === activeId), [data, activeId])

  /* ── Drag handlers ── */
  const onDragStart = ({ active }) => setActiveId(active.id)

  const onDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over) return

    const activeOp  = data.find((d) => d.id === active.id)
    const overIsCol = STAGES.some((s) => s.id === over.id)

    if (overIsCol) {
      // Dropped directly on a column
      if (activeOp.status !== over.id) {
        setData((prev) =>
          prev.map((item) =>
            item.id === active.id ? { ...item, status: over.id } : item
          )
        )
      }
    } else {
      // Dropped on another card — reorder or move column
      const overOp = data.find((d) => d.id === over.id)
      if (!overOp) return

      if (activeOp.status === overOp.status) {
        // Same column — reorder
        setData((prev) => {
          const col    = prev.filter((d) => d.status === activeOp.status)
          const others = prev.filter((d) => d.status !== activeOp.status)
          const oldIdx = col.findIndex((d) => d.id === active.id)
          const newIdx = col.findIndex((d) => d.id === over.id)
          return [...others, ...arrayMove(col, oldIdx, newIdx)]
        })
      } else {
        // Different column — move card
        setData((prev) =>
          prev.map((item) =>
            item.id === active.id ? { ...item, status: overOp.status } : item
          )
        )
      }
    }
  }

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .4s ease both; }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="fade-up">
              <AppBreadcrumb />
              <div className="flex items-center gap-2 mt-3 mb-1">
                <span className="block w-5 h-0.5 bg-[#E8450A]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8450A]">
                  CRM
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#1B3A6B] tracking-tight">
                Opportunités
              </h1>
              <p className="text-sm text-slate-500 mt-0.5 font-light">
                {data.length} opportunité{data.length !== 1 ? "s" : ""} dans le pipeline
              </p>
            </div>

            <button
              className="fade-up inline-flex items-center gap-2 bg-[#E8450A] hover:bg-[#c73a08] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg border-2 border-[#E8450A] hover:border-[#c73a08] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-900/20 transition-all"
              style={{ animationDelay: "80ms" }}
            >
              <PlusIcon size={14} />
              Nouvelle opportunité
            </button>
          </div>

          {/* ── Stats strip ─────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Total pipeline",  value: formatValue(totalPipeline), sub: "en cours",      icon: TargetIcon,      delay: 60  },
              { label: "Gagné",           value: formatValue(totalWon),      sub: "confirmé",      icon: TrendingUpIcon,  delay: 120 },
              { label: "Opportunités",    value: data.length,                sub: "au total",      icon: DollarSignIcon,  delay: 180 },
              { label: "Taux de succès",  value: `${Math.round((data.filter(d=>d.status==="WON").length / Math.max(data.filter(d=>["WON","LOST"].includes(d.status)).length,1)) * 100)}%`, sub: "won vs lost", icon: PercentIcon, delay: 240 },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.label}
                  className="fade-up bg-white border border-slate-200 rounded-xl px-4 py-3.5"
                  style={{ animationDelay: `${s.delay}ms` }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
                    <Icon size={12} className="text-slate-300" />
                  </div>
                  <p className="text-xl font-black text-[#1B3A6B] leading-none">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
                </div>
              )
            })}
          </div>

          {/* ── Toolbar ─────────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="relative">
              <SearchIcon size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une opportunité…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[#F5F7FA] border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10 transition-all w-64"
              />
            </div>

            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${
                  statusFilter === "ALL"
                    ? "bg-[#1B3A6B] text-white border-[#1B3A6B]"
                    : "bg-white text-slate-500 border-slate-200 hover:border-[#1B3A6B] hover:text-[#1B3A6B]"
                }`}
              >
                Tous
              </button>
              {STAGES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStatusFilter(s.id)}
                  className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${
                    statusFilter === s.id
                      ? `${s.colorBg} ${s.colorText} ${s.colorBorder}`
                      : "bg-white text-slate-400 border-slate-200 hover:text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {search && (
              <p className="text-xs text-slate-400 ml-auto">
                {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} pour <strong className="text-slate-600">«&nbsp;{search}&nbsp;»</strong>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Kanban board ────────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <ScrollArea className="w-full h-full">
            <div className="flex gap-4 p-6 min-w-max items-start">
              {STAGES.map((stage) => (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  items={grouped[stage.id] ?? []}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Drag overlay — floating card while dragging */}
          <DragOverlay dropAnimation={null}>
            {activeOp && <OpportunityCard op={activeOp} isDragging />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}