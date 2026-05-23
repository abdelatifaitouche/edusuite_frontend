// src/pages/crm/CreateOpportunity.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeftIcon,
  TargetIcon,
  DollarSignIcon,
  PercentIcon,
  CalendarIcon,
  SaveIcon,
  LoaderCircleIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  TrophyIcon,
  TrendingUpIcon,
  SparklesIcon,
} from "lucide-react"
import { AppBreadcrumb } from "@/components/AppBreadcrumb"
import { createOpportunity } from "@/services/opportunity.service"
/* ─── API ─────────────────────────────────────────────────────────────────── */


/* ─── Probability presets ─────────────────────────────────────────────────── */
const PROB_PRESETS = [
  { label: "Faible",  value: 0.1,  color: "text-red-500",     bg: "bg-red-50  border-red-200",    active: "bg-red-500  border-red-500  text-white"  },
  { label: "Moyen",   value: 0.4,  color: "text-amber-600",   bg: "bg-amber-50 border-amber-200", active: "bg-amber-500 border-amber-500 text-white" },
  { label: "Élevé",   value: 0.7,  color: "text-blue-600",    bg: "bg-blue-50  border-blue-200",  active: "bg-blue-600  border-blue-600  text-white" },
  { label: "Certain", value: 0.9,  color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", active: "bg-emerald-500 border-emerald-500 text-white" },
]

/* ─── Value presets ───────────────────────────────────────────────────────── */
const VALUE_PRESETS = [
  { label: "50K",    value: 50000   },
  { label: "100K",   value: 100000  },
  { label: "250K",   value: 250000  },
  { label: "500K",   value: 500000  },
  { label: "1M",     value: 1000000 },
]

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function fmt(v) {
  if (!v && v !== 0) return "—"
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M DZD`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K DZD`
  return `${v} DZD`
}

function probColor(p) {
  if (p >= 0.7) return "bg-emerald-400"
  if (p >= 0.4) return "bg-amber-400"
  return "bg-red-400"
}

function probLabel(p) {
  if (p >= 0.9) return { text: "Très élevée", color: "text-emerald-600" }
  if (p >= 0.7) return { text: "Élevée",      color: "text-blue-600"    }
  if (p >= 0.4) return { text: "Moyenne",     color: "text-amber-600"   }
  return               { text: "Faible",      color: "text-red-500"     }
}

function minDate() {
  return new Date().toISOString().split("T")[0]
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function CreateOpportunity() {
  const navigate = useNavigate()

  /* ── Form state ── */
  const [form, setForm] = useState({
    title:               "",
    probability:         0.1,
    estimated_value:     "",
    expected_close_date: "",
  })
  const [errors,    setErrors]    = useState({})
  const [touched,   setTouched]   = useState({})
  const [loading,   setLoading]   = useState(false)
  const [submitErr, setSubmitErr] = useState(null)
  const [success,   setSuccess]   = useState(false)
  const [createdId, setCreatedId] = useState(null)

  /* ── Validation ── */
  function validate(values) {
    const errs = {}
    if (!values.title?.trim())
      errs.title = "Le titre est requis"
    else if (values.title.trim().length < 3)
      errs.title = "Minimum 3 caractères"

    if (!values.estimated_value && values.estimated_value !== 0)
      errs.estimated_value = "La valeur estimée est requise"
    else if (isNaN(Number(values.estimated_value)) || Number(values.estimated_value) < 0)
      errs.estimated_value = "Valeur numérique positive requise"

    if (!values.expected_close_date)
      errs.expected_close_date = "La date de clôture est requise"
    else if (new Date(values.expected_close_date) <= new Date())
      errs.expected_close_date = "La date doit être dans le futur"

    return errs
  }

  function handleChange(key, value) {
    const next = { ...form, [key]: value }
    setForm(next)
    if (touched[key]) {
      const errs = validate(next)
      setErrors((prev) => ({ ...prev, [key]: errs[key] ?? undefined }))
    }
  }

  function handleBlur(key) {
    setTouched((prev) => ({ ...prev, [key]: true }))
    const errs = validate(form)
    setErrors((prev) => ({ ...prev, [key]: errs[key] ?? undefined }))
  }

  /* ── Submit ── */
  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitErr(null)

    const allTouched = { title: true, estimated_value: true, expected_close_date: true }
    setTouched(allTouched)
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const payload = {
        title:               form.title.trim(),
        probability:         parseFloat(form.probability),
        estimated_value:     parseFloat(form.estimated_value),
        expected_close_date: form.expected_close_date,
      }
      const result = await createOpportunity(payload)
      setCreatedId(result?.id)
      setSuccess(true)
      setTimeout(() => navigate(`/crm/opportunities/${result?.id ?? ""}`), 2000)
    } catch (err) {
      setSubmitErr(err.message ?? "Une erreur est survenue.")
    } finally {
      setLoading(false)
    }
  }

  const hasErrors = Object.values(errors).some(Boolean)
  const probMeta  = probLabel(form.probability)
  const isFormValid = form.title.trim().length >= 3 && form.estimated_value && form.expected_close_date

  /* ── Success screen ── */
  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
          * { font-family:'Plus Jakarta Sans',sans-serif; }
          @keyframes pop { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
          @keyframes shrink { from{width:100%} to{width:0%} }
        `}</style>
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center max-w-sm w-full shadow-xl shadow-blue-900/8">
          <div
            className="w-20 h-20 bg-emerald-50 border-2 border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ animation: "pop .5s ease both" }}
          >
            <CheckCircle2Icon size={38} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-2">Opportunité créée !</h2>
          <p className="text-sm text-slate-500 font-light mb-6">
            Redirection vers le détail…
          </p>
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#E8450A] rounded-full" style={{ animation: "shrink 2s linear forwards" }} />
          </div>
          <button
            onClick={() => navigate(`/crm/opportunities/${createdId ?? ""}`)}
            className="mt-5 text-xs font-bold uppercase tracking-widest text-[#1B3A6B] hover:text-[#E8450A] transition-colors"
          >
            Voir maintenant →
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
        .fade-up   { animation: fadeUp .4s ease both; }
        .fade-up-1 { animation: fadeUp .4s ease 60ms  both; }
        .fade-up-2 { animation: fadeUp .4s ease 120ms both; }
        .fade-up-3 { animation: fadeUp .4s ease 180ms both; }
        input[type=range] { -webkit-appearance:none; appearance:none; height:6px; border-radius:999px; outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:50%; background:#1B3A6B; border:3px solid white; box-shadow:0 2px 8px rgba(27,58,107,0.3); cursor:pointer; transition:transform .15s; }
        input[type=range]::-webkit-slider-thumb:hover { transform:scale(1.15); }
        input[type=date]::-webkit-calendar-picker-indicator { opacity:.5; cursor:pointer; }
      `}</style>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-start justify-between gap-4">
          <div className="fade-up">
            <AppBreadcrumb />
            <div className="flex items-center gap-2 mt-3 mb-1">
              <span className="block w-5 h-0.5 bg-[#E8450A]" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8450A]">CRM</span>
            </div>
            <h1 className="text-2xl font-black text-[#1B3A6B] tracking-tight">
              Nouvelle opportunité
            </h1>
            <p className="text-sm text-slate-500 mt-0.5 font-light">
              Renseignez les informations de l'opportunité commerciale
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="fade-up flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#1B3A6B] transition-colors mt-1"
          >
            <ArrowLeftIcon size={13} /> Retour
          </button>
        </div>
      </div>

      {/* ── Form ────────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} noValidate>

          {/* Global error */}
          {submitErr && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5 fade-up">
              <AlertCircleIcon size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{submitErr}</p>
            </div>
          )}

          {/* ── Card 1: Informations générales ──────────────────────── */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden mb-4 fade-up-1">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#1B3A6B]/8 rounded-md flex items-center justify-center">
                <TargetIcon size={13} className="text-[#1B3A6B]" />
              </div>
              <h2 className="text-sm font-bold text-[#1B3A6B]">Informations générales</h2>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Titre <span className="text-[#E8450A]">*</span>
                </label>
                <div className="relative">
                  <SparklesIcon size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                    touched.title && errors.title ? "text-red-400" : "text-slate-400"
                  }`} />
                  <input
                    type="text"
                    placeholder="Ex: Formation SST Sonatrach Q3"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    onBlur={() => handleBlur("title")}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm bg-[#F5F7FA] border placeholder:text-slate-400 outline-none transition-all duration-200 ${
                      touched.title && errors.title
                        ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-[#E2E8F0] focus:border-[#1B3A6B] focus:bg-white focus:ring-2 focus:ring-[#1B3A6B]/10"
                    }`}
                  />
                </div>
                {touched.title && errors.title && (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                    <AlertCircleIcon size={11} /> {errors.title}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Card 2: Valeur & Financier ───────────────────────────── */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden mb-4 fade-up-2">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#E8450A]/8 rounded-md flex items-center justify-center">
                <DollarSignIcon size={13} className="text-[#E8450A]" />
              </div>
              <h2 className="text-sm font-bold text-[#1B3A6B]">Valeur & Financier</h2>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Estimated value */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Valeur estimée (DZD) <span className="text-[#E8450A]">*</span>
                </label>

                {/* Quick presets */}
                <div className="flex gap-2 mb-3 flex-wrap">
                  {VALUE_PRESETS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => handleChange("estimated_value", p.value)}
                      className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg border-2 transition-all ${
                        Number(form.estimated_value) === p.value
                          ? "bg-[#1B3A6B] border-[#1B3A6B] text-white"
                          : "bg-[#F5F7FA] border-slate-200 text-slate-500 hover:border-[#1B3A6B] hover:text-[#1B3A6B]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <DollarSignIcon size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                    touched.estimated_value && errors.estimated_value ? "text-red-400" : "text-slate-400"
                  }`} />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="100 000"
                    value={form.estimated_value}
                    onChange={(e) => handleChange("estimated_value", e.target.value)}
                    onBlur={() => handleBlur("estimated_value")}
                    className={`w-full pl-10 pr-20 py-3 rounded-lg text-sm bg-[#F5F7FA] border placeholder:text-slate-400 outline-none transition-all duration-200 ${
                      touched.estimated_value && errors.estimated_value
                        ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-[#E2E8F0] focus:border-[#1B3A6B] focus:bg-white focus:ring-2 focus:ring-[#1B3A6B]/10"
                    }`}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
                    DZD
                  </span>
                </div>

                {touched.estimated_value && errors.estimated_value ? (
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                    <AlertCircleIcon size={11} /> {errors.estimated_value}
                  </p>
                ) : form.estimated_value ? (
                  <p className="mt-1.5 text-xs text-slate-400">
                    = <strong className="text-[#1B3A6B]">{fmt(Number(form.estimated_value))}</strong>
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* ── Card 3: Probabilité ─────────────────────────────────── */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden mb-4 fade-up-2">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 bg-[#1B3A6B]/8 rounded-md flex items-center justify-center">
                  <PercentIcon size={13} className="text-[#1B3A6B]" />
                </div>
                <h2 className="text-sm font-bold text-[#1B3A6B]">Probabilité de succès</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-black text-[#1B3A6B]`}>
                  {Math.round(form.probability * 100)}%
                </span>
                <span className={`text-xs font-bold ${probMeta.color}`}>
                  — {probMeta.text}
                </span>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Presets */}
              <div className="grid grid-cols-4 gap-2">
                {PROB_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => handleChange("probability", p.value)}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-[11px] font-bold uppercase tracking-wide transition-all ${
                      form.probability === p.value
                        ? p.active
                        : `bg-white ${p.bg} ${p.color} hover:scale-105`
                    }`}
                  >
                    <span className="text-lg font-black">{Math.round(p.value * 100)}%</span>
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Slider */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  Ou ajustez manuellement
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={form.probability}
                  onChange={(e) => handleChange("probability", parseFloat(e.target.value))}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, ${
                      form.probability >= 0.7 ? "#10B981" :
                      form.probability >= 0.4 ? "#F59E0B" : "#EF4444"
                    } ${form.probability * 100}%, #E2E8F0 ${form.probability * 100}%)`,
                  }}
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-red-400 font-bold">0%</span>
                  <span className="text-[10px] text-amber-500 font-bold">50%</span>
                  <span className="text-[10px] text-emerald-500 font-bold">100%</span>
                </div>
              </div>

              {/* Visual bar */}
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${probColor(form.probability)}`}
                  style={{ width: `${form.probability * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── Card 4: Dates ────────────────────────────────────────── */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden mb-8 fade-up-3">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#1B3A6B]/8 rounded-md flex items-center justify-center">
                <CalendarIcon size={13} className="text-[#1B3A6B]" />
              </div>
              <h2 className="text-sm font-bold text-[#1B3A6B]">Date de clôture</h2>
            </div>

            <div className="px-6 py-5">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Date prévue de clôture <span className="text-[#E8450A]">*</span>
              </label>

              {/* Quick date shortcuts */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {[
                  { label: "+1 mois",  days: 30  },
                  { label: "+3 mois",  days: 90  },
                  { label: "+6 mois",  days: 180 },
                  { label: "+1 an",    days: 365 },
                ].map((s) => {
                  const d = new Date()
                  d.setDate(d.getDate() + s.days)
                  const val = d.toISOString().split("T")[0]
                  return (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => handleChange("expected_close_date", val)}
                      className={`text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg border-2 transition-all ${
                        form.expected_close_date === val
                          ? "bg-[#1B3A6B] border-[#1B3A6B] text-white"
                          : "bg-[#F5F7FA] border-slate-200 text-slate-500 hover:border-[#1B3A6B] hover:text-[#1B3A6B]"
                      }`}
                    >
                      {s.label}
                    </button>
                  )
                })}
              </div>

              <div className="relative">
                <CalendarIcon size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  touched.expected_close_date && errors.expected_close_date ? "text-red-400" : "text-slate-400"
                }`} />
                <input
                  type="date"
                  min={minDate()}
                  value={form.expected_close_date}
                  onChange={(e) => handleChange("expected_close_date", e.target.value)}
                  onBlur={() => handleBlur("expected_close_date")}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm bg-[#F5F7FA] border outline-none transition-all duration-200 ${
                    touched.expected_close_date && errors.expected_close_date
                      ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                      : "border-[#E2E8F0] focus:border-[#1B3A6B] focus:bg-white focus:ring-2 focus:ring-[#1B3A6B]/10"
                  }`}
                />
              </div>

              {touched.expected_close_date && errors.expected_close_date ? (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
                  <AlertCircleIcon size={11} /> {errors.expected_close_date}
                </p>
              ) : form.expected_close_date ? (
                <p className="mt-1.5 text-xs text-slate-400">
                  Clôture prévue le <strong className="text-[#1B3A6B]">
                    {new Date(form.expected_close_date).toLocaleDateString("fr-DZ", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
                  </strong>
                </p>
              ) : null}
            </div>
          </div>

          {/* ── Preview summary ──────────────────────────────────────── */}
          {isFormValid && (
            <div className="bg-gradient-to-br from-[#1B3A6B]/5 to-[#1B3A6B]/3 border border-[#1B3A6B]/15 rounded-xl p-5 mb-6 fade-up">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#1B3A6B]/60 mb-4">
                Aperçu de l'opportunité
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Titre",      value: form.title,                       icon: SparklesIcon  },
                  { label: "Valeur",     value: fmt(Number(form.estimated_value)), icon: DollarSignIcon},
                  { label: "Probabilité",value: `${Math.round(form.probability * 100)}% — ${probMeta.text}`, icon: PercentIcon },
                  { label: "Clôture",    value: form.expected_close_date
                    ? new Date(form.expected_close_date).toLocaleDateString("fr-DZ", { day:"2-digit", month:"short", year:"numeric" })
                    : "—",             icon: CalendarIcon },
                ].map((s) => {
                  const Icon = s.icon
                  return (
                    <div key={s.label} className="bg-white/70 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Icon size={11} className="text-[#1B3A6B]/50" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1B3A6B]/50">{s.label}</p>
                      </div>
                      <p className="text-xs font-bold text-[#1B3A6B] leading-tight truncate">{s.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Action bar ───────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#1B3A6B] border-2 border-slate-200 hover:border-[#1B3A6B] px-5 py-3 rounded-lg transition-all"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading || (hasErrors && Object.keys(touched).length > 0)}
              className={`
                flex items-center gap-2 text-xs font-bold uppercase tracking-widest
                px-7 py-3 rounded-lg border-2 transition-all duration-200
                ${loading
                  ? "bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed"
                  : hasErrors && Object.keys(touched).length > 0
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-[#E8450A] border-[#E8450A] text-white hover:bg-[#c73a08] hover:border-[#c73a08] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-900/20"
                }
              `}
            >
              {loading ? (
                <><LoaderCircleIcon size={14} className="animate-spin" /> Création…</>
              ) : (
                <><SaveIcon size={14} /> Créer l'opportunité</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}