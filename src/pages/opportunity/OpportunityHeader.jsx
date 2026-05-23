import React from 'react'
import { AppBreadcrumb } from "@/components/AppBreadcrumb"

import {
  SearchIcon,
  PlusIcon,
  TrendingUpIcon,
  DollarSignIcon,
  TargetIcon,
  PercentIcon,
} from "lucide-react"

function OpportunityHeader() {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="fade-up">
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
)
}
  
export default OpportunityHeader
