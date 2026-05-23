import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { createCourse } from "@/services/courses.service"
import { AppBreadcrumb } from "@/components/AppBreadcrumb"

import {
  BookOpenIcon,
  TagIcon,
  FileTextIcon,
  LayersIcon,
  Clock3Icon,
  WalletIcon,
  SaveIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  LoaderCircleIcon,
  BadgeCheckIcon,
} from "lucide-react"

const EMPTY_FORM = {
  titre: "",
  code: "",
  description: "",
  domaine: "",
  type: "PARTICULIER",
  niveau: "debutant",
  duree_jours: 1,
  heures_par_jour: 1,
  prix: "",
  certifiante: false,
}

export default function CreateCourse() {
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [success, setSuccess] = useState(false)

  function updateField(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setSubmitError(null)
    setLoading(true)

    try {
      await createCourse({
        ...form,
        prix: Number(form.prix),
        duree_jours: Number(form.duree_jours),
        heures_par_jour: Number(form.heures_par_jour),
      })

      setSuccess(true)

      setTimeout(() => {
        navigate("/courses")
      }, 1800)

    } catch (err) {
      setSubmitError(
        err.message ??
        "Une erreur est survenue."
      )
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center px-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-lg">

          <CheckCircle2Icon
            size={42}
            className="mx-auto text-emerald-500 mb-4"
          />

          <h2 className="text-xl font-black text-[#1B3A6B]">
            Formation créée !
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Redirection...
          </p>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">

        <div className="max-w-6xl mx-auto">

          <AppBreadcrumb />

          <div className="flex justify-between items-center mt-4">

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="block w-5 h-0.5 bg-[#E8450A]" />

                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8450A]">
                  Formation
                </span>
              </div>

              <h1 className="text-2xl font-black text-[#1B3A6B]">
                Nouvelle formation
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Créez une nouvelle formation
              </p>
            </div>

            <button
              onClick={() => navigate("/courses")}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#1B3A6B]"
            >
              <ArrowLeftIcon size={14} />
              Retour
            </button>

          </div>

        </div>

      </div>


      {/* FORM */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        <form onSubmit={handleSubmit}>

          {/* ERROR */}
          {submitError && (
            <div className="mb-6 flex gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">

              <AlertCircleIcon
                size={16}
                className="text-red-500 mt-0.5"
              />

              <p className="text-sm text-red-600">
                {submitError}
              </p>

            </div>
          )}


          {/* GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


            {/* LEFT */}
            <Card
              title="Informations générales"
              icon={BookOpenIcon}
            >

              <div className="grid grid-cols-2 gap-4">

                <Input
                  label="Titre"
                  icon={BookOpenIcon}
                  value={form.titre}
                  onChange={(v) =>
                    updateField("titre", v)
                  }
                />

                <Input
                  label="Code"
                  icon={TagIcon}
                  value={form.code}
                  onChange={(v) =>
                    updateField("code", v)
                  }
                />

              </div>

              <TextArea
                label="Description"
                value={form.description}
                onChange={(v) =>
                  updateField("description", v)
                }
              />

            </Card>



            {/* RIGHT */}
            <Card
              title="Classification"
              icon={LayersIcon}
            >

              <div className="grid grid-cols-2 gap-4">

                <Input
                  label="Domaine"
                  icon={LayersIcon}
                  value={form.domaine}
                  onChange={(v) =>
                    updateField("domaine", v)
                  }
                />

                <Select
                  label="Type"
                  value={form.type}
                  options={[
                    "PARTICULIER",
                    "ENTREPRISE",
                  ]}
                  onChange={(v) =>
                    updateField("type", v)
                  }
                />

                <Select
                  label="Niveau"
                  value={form.niveau}
                  options={[
                    "debutant",
                    "intermediaire",
                    "avance",
                  ]}
                  onChange={(v) =>
                    updateField("niveau", v)
                  }
                />

              </div>

            </Card>



            {/* BUSINESS */}
            <Card
              title="Organisation & tarif"
              icon={WalletIcon}
              className="xl:col-span-2"
            >

              <div className="grid md:grid-cols-4 gap-4">

                <Input
                  type="number"
                  label="Durée"
                  icon={Clock3Icon}
                  value={form.duree_jours}
                  onChange={(v) =>
                    updateField("duree_jours", v)
                  }
                />

                <Input
                  type="number"
                  label="Heures/Jour"
                  icon={Clock3Icon}
                  value={form.heures_par_jour}
                  onChange={(v) =>
                    updateField("heures_par_jour", v)
                  }
                />

                <Input
                  type="number"
                  label="Prix"
                  icon={WalletIcon}
                  value={form.prix}
                  onChange={(v) =>
                    updateField("prix", v)
                  }
                />

                <div className="flex items-end pb-2">

                  <label className="flex items-center gap-2 text-sm font-semibold text-[#1B3A6B]">

                    <input
                      type="checkbox"
                      checked={form.certifiante}
                      onChange={(e) =>
                        updateField(
                          "certifiante",
                          e.target.checked
                        )
                      }
                    />

                    <BadgeCheckIcon size={15} />

                    Certifiante

                  </label>

                </div>

              </div>

            </Card>

          </div>


          {/* ACTIONS */}
          <div className="flex justify-end mt-8">

            <button
              type="submit"
              disabled={loading}
              className="
                flex items-center gap-2
                bg-[#E8450A]
                border-2 border-[#E8450A]
                text-white
                text-xs font-bold uppercase tracking-widest
                px-6 py-3 rounded-lg
                hover:bg-[#c73a08]
                transition-all
              "
            >

              {loading ? (
                <>
                  <LoaderCircleIcon
                    size={14}
                    className="animate-spin"
                  />
                  Enregistrement...
                </>
              ) : (
                <>
                  <SaveIcon size={14} />
                  Enregistrer
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}



function Card({
  title,
  icon: Icon,
  children,
  className = "",
}) {
  return (
    <div className={`
      bg-white
      border border-slate-200
      rounded-xl
      p-6
      ${className}
    `}>

      <div className="flex items-center gap-2 mb-5">

        <Icon
          size={15}
          className="text-[#1B3A6B]"
        />

        <h2 className="font-bold text-[#1B3A6B]">
          {title}
        </h2>

      </div>

      <div className="space-y-4">
        {children}
      </div>

    </div>
  )
}



function Input({
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>

      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
        {label}
      </label>

      <div className="relative">

        <Icon
          size={14}
          className="absolute left-3 top-3.5 text-slate-400"
        />

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="
            w-full
            pl-10 pr-4 py-3
            bg-[#F5F7FA]
            border border-slate-200
            rounded-lg
            text-sm
          "
        />

      </div>

    </div>
  )
}



function TextArea({
  label,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
        {label}
      </label>

      <textarea
        rows={5}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          p-4
          bg-[#F5F7FA]
          border border-slate-200
          rounded-lg
          text-sm
          resize-none
        "
      />

    </div>
  )
}



function Select({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <div>

      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          p-3
          bg-white
          border border-slate-200
          rounded-lg
          text-sm
        "
      >

        {options.map((opt) => (
          <option
            key={opt}
            value={opt}
          >
            {opt}
          </option>
        ))}

      </select>

    </div>
  )
}