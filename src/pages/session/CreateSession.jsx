import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  create_session,
  get_formations_options,
  get_formateurs_options,
  get_salles_options,
} from "@/services/session.service"

import {
  CalendarIcon,
  Clock3Icon,
  RepeatIcon,
  UsersIcon,
  MapPinIcon,
  BookOpenIcon,
  SaveIcon,
  LoaderCircleIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ArrowLeftIcon,
  ShieldAlertIcon,
} from "lucide-react"

const EMPTY_FORM = {
  formation_id: "",
  formateur_id: "",
  salle_id: "",
  type_planning: "BLOC",
  date_debut: "",
  date_fin: "",
  r_rule: {
    jours_semaine: [],
    heure_debut: "08:00",
    heure_fin: "16:00",
    interval_semaine: 1,
  },
}

const WEEK_DAYS = [
  { id: 1, label: "Lun" },
  { id: 2, label: "Mar" },
  { id: 3, label: "Mer" },
  { id: 4, label: "Jeu" },
  { id: 5, label: "Ven" },
  { id: 6, label: "Sam" },
  { id: 7, label: "Dim" },
]

export default function CreateSession() {
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)

  const [formations, setFormations] = useState([])
  const [formateurs, setFormateurs] = useState([])
  const [salles, setSalles] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [conflicts, setConflicts] = useState(null)

  useEffect(() => {
    ;(async () => {
      const [f, t, s] = await Promise.all([
        get_formations_options(),
        get_formateurs_options(),
        get_salles_options(),
      ])

      setFormations(f)
      setFormateurs(t)
      setSalles(s)
    })()
  }, [])

  function update(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  function updateRule(key, value) {
    setForm((prev) => ({
      ...prev,
      r_rule: {
        ...prev.r_rule,
        [key]: value,
      },
    }))
  }

  function toggleDay(day) {
    const exists = form.r_rule.jours_semaine.includes(day)

    updateRule(
      "jours_semaine",
      exists
        ? form.r_rule.jours_semaine.filter((d) => d !== day)
        : [...form.r_rule.jours_semaine, day]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setLoading(true)
    setError(null)
    setConflicts(null)

    try {
      await create_session(form)

      setSuccess(true)

      setTimeout(() => {
        navigate("/sessions")
      }, 1500)

    } catch (err) {

      if (err?.response?.status === 409) {
        setConflicts(err.response.data.details)
        return
      }

      setError(
        err?.response?.data?.message ||
        "Erreur serveur"
      )

    } finally {
      setLoading(false)
    }
  }

  const conflictDates = useMemo(() => {
    return new Set(
      conflicts?.dates?.map((d) => d.slice(0, 10)) || []
    )
  }, [conflicts])

  const previewOccurrences = useMemo(() => {
    if (
      !form.date_debut ||
      !form.date_fin ||
      form.r_rule.jours_semaine.length === 0
    ) {
      return []
    }

    const dates = []

    const start = new Date(form.date_debut)
    const end = new Date(form.date_fin)

    const current = new Date(start)

    while (current <= end) {
      const jsDay = current.getDay()

      const mappedDay = jsDay === 0 ? 7 : jsDay

      if (
        form.r_rule.jours_semaine.includes(mappedDay)
      ) {
        dates.push({
          date: current.toISOString().slice(0, 10),
          start: form.r_rule.heure_debut,
          end: form.r_rule.heure_fin,
        })
      }

      current.setDate(current.getDate() + 1)
    }

    return dates
  }, [form])

  if (success) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-lg">
          <CheckCircle2Icon
            size={42}
            className="mx-auto text-emerald-500 mb-4"
          />

          <h2 className="text-xl font-black text-[#1B3A6B]">
            Session créée !
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

        <div className="max-w-7xl mx-auto">

          <div className="flex justify-between items-center">

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="block w-5 h-0.5 bg-[#E8450A]" />

                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8450A]">
                  Planning
                </span>
              </div>

              <h1 className="text-2xl font-black text-[#1B3A6B]">
                Nouvelle session
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Configurez une nouvelle session de formation
              </p>
            </div>

            <button
              onClick={() => navigate("/sessions")}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#1B3A6B]"
            >
              <ArrowLeftIcon size={14} />
              Retour
            </button>

          </div>

        </div>

      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        <form onSubmit={handleSubmit}>

          {/* ERROR */}
          {error && (
            <div className="mb-6 flex gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircleIcon
                size={16}
                className="text-red-500 mt-0.5"
              />

              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* CONFLICT */}
          {conflicts && (
            <div className="mb-6 flex gap-3 bg-orange-50 border border-orange-200 rounded-xl px-5 py-4">

              <ShieldAlertIcon
                size={18}
                className="text-orange-500 mt-0.5"
              />

              <div>

                <h3 className="text-sm font-bold text-orange-700">
                  Conflits détectés
                </h3>

                <div className="mt-1 text-sm text-orange-600 space-y-1">

                  {conflicts.formateur_conflict && (
                    <p>• Formateur indisponible</p>
                  )}

                  {conflicts.salle_conflict && (
                    <p>• Salle indisponible</p>
                  )}

                </div>

              </div>

            </div>
          )}

          <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-6">

            {/* LEFT */}
            <div className="space-y-6">

              {/* SESSION */}
              <Card
                title="Informations session"
                icon={CalendarIcon}
              >

                <div className="grid md:grid-cols-2 gap-4">

                  <Select
                    label="Formation"
                    value={form.formation_id}
                    options={formations.map((f) => ({
                      value: f.id,
                      label: f.label || f.titre,
                    }))}
                    onChange={(v) =>
                      update("formation_id", v)
                    }
                  />

                  <Select
                    label="Formateur"
                    value={form.formateur_id}
                    options={formateurs.map((f) => ({
                      value: f.id,
                      label: f.full_name,
                    }))}
                    onChange={(v) =>
                      update("formateur_id", v)
                    }
                  />

                  <Select
                    label="Salle"
                    value={form.salle_id}
                    options={salles.map((s) => ({
                      value: s.id,
                      label: s.name,
                    }))}
                    onChange={(v) =>
                      update("salle_id", v)
                    }
                  />

                  <Select
                    label="Type planning"
                    value={form.type_planning}
                    options={[
                      {
                        value: "BLOC",
                        label: "BLOC",
                      },
                      {
                        value: "REGULIER",
                        label: "REGULIER",
                      },
                    ]}
                    onChange={(v) =>
                      update("type_planning", v)
                    }
                  />

                </div>

              </Card>

              {/* DATES */}
              <Card
                title="Période"
                icon={Clock3Icon}
              >

                <div className="grid md:grid-cols-2 gap-4">

                  <Input
                    label="Date début"
                    type="date"
                    value={form.date_debut}
                    onChange={(v) =>
                      update("date_debut", v)
                    }
                  />

                  <Input
                    label="Date fin"
                    type="date"
                    value={form.date_fin}
                    onChange={(v) =>
                      update("date_fin", v)
                    }
                  />

                </div>

              </Card>

              {/* RRULE */}
              <Card
                title="Règles de répétition"
                icon={RepeatIcon}
              >

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Jours de semaine
                  </label>

                  <div className="flex flex-wrap gap-2">

                    {WEEK_DAYS.map((d) => {

                      const active =
                        form.r_rule.jours_semaine.includes(
                          d.id
                        )

                      return (
                        <button
                          type="button"
                          key={d.id}
                          onClick={() =>
                            toggleDay(d.id)
                          }
                          className={`
                            px-4 py-2 rounded-full border text-sm font-semibold transition-all
                            ${
                              active
                                ? "bg-[#1B3A6B] border-[#1B3A6B] text-white"
                                : "bg-white border-slate-200 text-slate-500 hover:border-[#1B3A6B]"
                            }
                          `}
                        >
                          {d.label}
                        </button>
                      )
                    })}

                  </div>

                </div>

                <div className="grid md:grid-cols-3 gap-4">

                  <Input
                    label="Heure début"
                    type="time"
                    value={form.r_rule.heure_debut}
                    onChange={(v) =>
                      updateRule("heure_debut", v)
                    }
                  />

                  <Input
                    label="Heure fin"
                    type="time"
                    value={form.r_rule.heure_fin}
                    onChange={(v) =>
                      updateRule("heure_fin", v)
                    }
                  />

                  <Input
                    label="Interval semaine"
                    type="number"
                    value={
                      form.r_rule.interval_semaine
                    }
                    onChange={(v) =>
                      updateRule(
                        "interval_semaine",
                        Number(v)
                      )
                    }
                  />

                </div>

              </Card>

            </div>

            {/* RIGHT */}
            <div>

              <Card
                title="Prévisualisation"
                icon={CalendarIcon}
              >

                <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">

                  {previewOccurrences.length === 0 && (
                    <div className="text-sm text-slate-400 text-center py-10">
                      Configurez les dates et jours
                    </div>
                  )}

                  {previewOccurrences.map((occ) => {

                    const isConflict =
                      conflictDates.has(occ.date)

                    return (
                      <div
                        key={occ.date}
                        className={`
                          rounded-xl border p-4 transition-all
                          ${
                            isConflict
                              ? "border-red-200 bg-red-50"
                              : "border-slate-200 bg-white"
                          }
                        `}
                      >

                        <div className="flex justify-between items-start">

                          <div>

                            <h3 className="font-bold text-sm text-[#1B3A6B]">
                              {occ.date}
                            </h3>

                            <p className="text-xs text-slate-500 mt-1">
                              {occ.start} → {occ.end}
                            </p>

                          </div>

                          {isConflict ? (
                            <span className="text-[11px] font-bold uppercase tracking-widest text-red-600">
                              Conflit
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                              Disponible
                            </span>
                          )}

                        </div>

                        {isConflict && (
                          <div className="mt-3 space-y-1">

                            {conflicts.formateur_conflict && (
                              <div className="text-xs text-red-600">
                                • Formateur indisponible
                              </div>
                            )}

                            {conflicts.salle_conflict && (
                              <div className="text-xs text-orange-600">
                                • Salle indisponible
                              </div>
                            )}

                          </div>
                        )}

                      </div>
                    )
                  })}

                </div>

              </Card>

            </div>

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
                  Création...
                </>
              ) : (
                <>
                  <SaveIcon size={14} />
                  Créer la session
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
}) {
  return (
    <div className="
      bg-white
      border border-slate-200
      rounded-xl
      p-6
    ">

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
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>

      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          px-4 py-3
          bg-[#F5F7FA]
          border border-slate-200
          rounded-lg
          text-sm
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
          px-4 py-3
          bg-white
          border border-slate-200
          rounded-lg
          text-sm
        "
      >

        <option value="">
          Sélectionner
        </option>

        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
          >
            {opt.label}
          </option>
        ))}

      </select>

    </div>
  )
}