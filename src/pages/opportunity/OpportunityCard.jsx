import React from "react";
import STAGES from "./data/stages";
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


const STAGE_MAP = Object.fromEntries(STAGES.map((s) => [s.id, s]))



export default function OpportunityCard({ op, isDragging = false }) {
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
          {op?.title}
        </p>
        <GripVerticalIcon size={14} className="text-slate-300 shrink-0 mt-0.5 cursor-grab active:cursor-grabbing" />
      </div>

      {/* Company */}
      

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