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


export default STAGES;