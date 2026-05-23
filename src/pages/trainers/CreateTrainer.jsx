// src/pages/trainers/CreateTrainer.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createTrainer } from "@/services/training.service"
import { AppBreadcrumb } from "@/components/AppBreadcrumb"
import {
  UserRoundIcon,
  MailIcon,
  PhoneIcon,
  BriefcaseIcon,
  SaveIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  LoaderCircleIcon,
} from "lucide-react"

/* ─── Field config ────────────────────────────────────────────────────── */
const FIELDS = [
  {
    key:         "nom",
    label:       "Nom",
    type:        "text",
    placeholder: "Ex: Daghbouche",
    icon:        UserRoundIcon,
    required:    true,
    hint:        null,
  },
  {
    key:         "prenom",
    label:       "Prénom",
    type:        "text",
    placeholder: "Ex: Ouns",
    icon:        UserRoundIcon,
    required:    true,
    hint:        null,
  },
  {
    key:         "email",
    label:       "Adresse email",
    type:        "email",
    placeholder: "formateur@ecfmontreal.ca",
    icon:        MailIcon,
    required:    true,
    hint:        null,
    validate:    (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Email invalide",
  },
  {
    key:         "telephone",
    label:       "Téléphone",
    type:        "tel",
    placeholder: "+213 7XX XXX XXX",
    icon:        PhoneIcon,
    required:    false,
    hint:        "Format international recommandé",
  },
  {
    key:         "specialite",
    label:       "Spécialité",
    type:        "text",
    placeholder: "Ex: RH & PNL, Santé-Sécurité, Management…",
    icon:        BriefcaseIcon,
    required:    false,
    hint:        null,
  },
]

const EMPTY_FORM = { nom: "", prenom: "", email: "", telephone: "", specialite: "" }

/* ─── Component ───────────────────────────────────────────────────────── */
export default function CreateTrainer() {
  const navigate = useNavigate()

  const [form,       setForm]       = useState(EMPTY_FORM)
  const [errors,     setErrors]     = useState({})
  const [touched,    setTouched]    = useState({})
  const [loading,    setLoading]    = useState(false)
  const [submitError,setSubmitError]= useState(null)
  const [success,    setSuccess]    = useState(false)

  /* ── Validation ─────────────────────────────────────────────────── */
  function validate(values) {
    const errs = {}
    FIELDS.forEach(({ key, required, validate: validateFn, label }) => {
      const v = (values[key] ?? "").trim()
      if (required && !v) {
        errs[key] = `${label} est requis`
      } else if (v && validateFn) {
        const msg = validateFn(v)
        if (msg) errs[key] = msg
      }
    })
    return errs
  }

  function handleChange(key, value) {
    const next = { ...form, [key]: value }
    setForm(next)
    // Live-clear error once the user fixes the field
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

  /* ── Submit ─────────────────────────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError(null)

    // Mark all touched
    const allTouched = Object.fromEntries(FIELDS.map((f) => [f.key, true]))
    setTouched(allTouched)

    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    try {
      await createTrainer({
        nom:        form.nom.trim(),
        prenom:     form.prenom.trim(),
        email:      form.email.trim(),
        telephone:  form.telephone.trim() || undefined,
        specialite: form.specialite.trim() || undefined,
      })
      setSuccess(true)
      setTimeout(() => navigate("/trainers"), 1800)
    } catch (err) {
      setSubmitError(err.message ?? "Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const hasErrors    = Object.values(errors).some(Boolean)
  const isFormEmpty  = !form.nom && !form.prenom && !form.email

  /* ── Success state ──────────────────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-6">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap'); *{font-family:'Plus Jakarta Sans',sans-serif;}`}</style>
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-sm w-full shadow-lg shadow-blue-900/8">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2Icon size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-black text-[#1B3A6B] mb-2">Formateur créé !</h2>
          <p className="text-sm text-slate-500">
            Redirection vers la liste des formateurs…
          </p>
          <div className="mt-5 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E8450A] rounded-full"
              style={{ width: "100%", animation: "shrink 1.8s linear forwards" }}
            />
          </div>
          <style>{`@keyframes shrink { from{width:100%} to{width:0%} }`}</style>
        </div>
      </div>
    )
  }

  /* ── Main render ────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap'); *{font-family:'Plus Jakarta Sans',sans-serif;}`}</style>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <AppBreadcrumb />

          <div className="flex items-center justify-between mt-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="block w-5 h-0.5 bg-[#E8450A]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8450A]">
                  Formation
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#1B3A6B] tracking-tight">
                Nouveau formateur
              </h1>
              <p className="text-sm text-slate-500 mt-0.5 font-light">
                Renseignez les informations du formateur
              </p>
            </div>

            <button
              onClick={() => navigate("/trainers")}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#1B3A6B] transition-colors"
            >
              <ArrowLeftIcon size={14} />
              Retour
            </button>
          </div>
        </div>
      </div>

      {/* ── Form ──────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} noValidate>

          {/* Global error banner */}
          {submitError && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5">
              <AlertCircleIcon size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}

          {/* ── Card: Informations personnelles ───────────────────── */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#1B3A6B]/8 rounded-md flex items-center justify-center">
                <UserRoundIcon size={13} className="text-[#1B3A6B]" />
              </div>
              <h2 className="text-sm font-bold text-[#1B3A6B]">Informations personnelles</h2>
            </div>

            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FIELDS.slice(0, 2).map((field) => (
                <FormField
                  key={field.key}
                  field={field}
                  value={form[field.key]}
                  error={touched[field.key] ? errors[field.key] : undefined}
                  onChange={(v) => handleChange(field.key, v)}
                  onBlur={() => handleBlur(field.key)}
                />
              ))}
            </div>
          </div>

          {/* ── Card: Coordonnées ─────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#E8450A]/8 rounded-md flex items-center justify-center">
                <MailIcon size={13} className="text-[#E8450A]" />
              </div>
              <h2 className="text-sm font-bold text-[#1B3A6B]">Coordonnées</h2>
            </div>

            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FIELDS.slice(2, 4).map((field) => (
                <FormField
                  key={field.key}
                  field={field}
                  value={form[field.key]}
                  error={touched[field.key] ? errors[field.key] : undefined}
                  onChange={(v) => handleChange(field.key, v)}
                  onBlur={() => handleBlur(field.key)}
                />
              ))}
            </div>
          </div>

          {/* ── Card: Profil professionnel ────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#1B3A6B]/8 rounded-md flex items-center justify-center">
                <BriefcaseIcon size={13} className="text-[#1B3A6B]" />
              </div>
              <h2 className="text-sm font-bold text-[#1B3A6B]">Profil professionnel</h2>
            </div>

            <div className="px-6 py-5">
              <FormField
                field={FIELDS[4]}
                value={form[FIELDS[4].key]}
                error={touched[FIELDS[4].key] ? errors[FIELDS[4].key] : undefined}
                onChange={(v) => handleChange(FIELDS[4].key, v)}
                onBlur={() => handleBlur(FIELDS[4].key)}
              />
            </div>
          </div>

          {/* ── Action bar ────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/trainers")}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#1B3A6B] border-2 border-slate-200 hover:border-[#1B3A6B] px-5 py-2.5 rounded-lg transition-all"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading || (hasErrors && Object.keys(touched).length > 0)}
              className={`
                flex items-center gap-2
                text-xs font-bold uppercase tracking-widest
                px-6 py-2.5 rounded-lg border-2
                transition-all duration-200
                ${loading
                  ? "bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed"
                  : hasErrors && Object.keys(touched).length > 0
                    ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-[#E8450A] border-[#E8450A] text-white hover:bg-[#c73a08] hover:border-[#c73a08] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-900/20"
                }
              `}
            >
              {loading ? (
                <>
                  <LoaderCircleIcon size={14} className="animate-spin" />
                  Enregistrement…
                </>
              ) : (
                <>
                  <SaveIcon size={14} />
                  Enregistrer le formateur
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

/* ─── FormField sub-component ─────────────────────────────────────────── */
function FormField({ field, value, error, onChange, onBlur }) {
  const Icon = field.icon
  const hasError = Boolean(error)

  return (
    <div>
      {/* Label */}
      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
        {field.label}
        {field.required && (
          <span className="text-[#E8450A] ml-1">*</span>
        )}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon
            size={14}
            className={hasError ? "text-red-400" : "text-slate-400"}
          />
        </div>

        <input
          type={field.type}
          value={value}
          placeholder={field.placeholder}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`
            w-full pl-10 pr-4 py-3 rounded-lg text-sm
            bg-[#F5F7FA] border
            placeholder:text-slate-400
            outline-none transition-all duration-200
            ${hasError
              ? "border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-[#1B3A6B] focus:bg-white focus:ring-2 focus:ring-[#1B3A6B]/10"
            }
          `}
        />
      </div>

      {/* Error or hint */}
      {hasError ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircleIcon size={11} />
          {error}
        </p>
      ) : field.hint ? (
        <p className="mt-1.5 text-xs text-slate-400">{field.hint}</p>
      ) : null}
    </div>
  )
}