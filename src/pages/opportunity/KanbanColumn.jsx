import React from "react";
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

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities"
import OpportunityCard from "./OpportunityCard";



function formatValue(v) {
  if (!v && v !== 0) return "—"
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M DZD`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K DZD`
  return `${v} DZD`
}

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

export default function KanbanColumn({ stage, items }) {
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
            flex-1 rounded-xl min-h-50 p-2 space-y-2
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