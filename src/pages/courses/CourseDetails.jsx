// src/pages/courses/CourseDetails.jsx
import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getCourse } from "@/services/courses.service"
import { AppBreadcrumb } from "@/components/AppBreadcrumb"
import {
  PencilIcon,
  Trash2Icon,
  PlusIcon,
  XIcon,
  BookOpenIcon,
  ClockIcon,
  GripVerticalIcon,
  TargetIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  LoaderCircleIcon,
  AwardIcon,
  LayersIcon,
  ListChecksIcon,
  ChevronRightIcon,
  HashIcon,
  CalendarDaysIcon,
  DollarSignIcon,
  BarChart2Icon,
  ArrowLeftIcon,
  SaveIcon,
} from "lucide-react"

/* ─── Mock objectifs (replace with API call) ──────────────────────────────── */
const MOCK_OBJECTIFS = [
  { id: "obj-1", description: "Maîtriser les fondamentaux de la comptabilité générale", ordre: 1, formation_id: "05e6a407" },
  { id: "obj-2", description: "Comprendre le plan comptable algérien (PCG)", ordre: 2, formation_id: "05e6a407" },
  { id: "obj-3", description: "Savoir établir un bilan et un compte de résultat", ordre: 3, formation_id: "05e6a407" },
]

/* ─── Config maps ─────────────────────────────────────────────────────────── */
const DOMAINE_META = {
  rh:                      { label: "Ressources Humaines",    cls: "bg-blue-50 text-blue-700 border-blue-200" },
  developpement_personnel: { label: "Développement perso",    cls: "bg-violet-50 text-violet-700 border-violet-200" },
  management:              { label: "Management",              cls: "bg-[#1B3A6B]/8 text-[#1B3A6B] border-[#1B3A6B]/20" },
  sst:                     { label: "Santé & Sécurité",        cls: "bg-[#E8450A]/8 text-[#E8450A] border-[#E8450A]/25" },
  coaching:                { label: "Coaching",                cls: "bg-amber-50 text-amber-700 border-amber-200" },
  juridique:               { label: "Juridique",               cls: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  informatique:            { label: "Informatique",            cls: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  autre:                   { label: "Autre",                   cls: "bg-slate-100 text-slate-600 border-slate-200" },
}
const NIVEAU_META = {
  debutant:      "Débutant",
  intermediaire: "Intermédiaire",
  avance:        "Avancé",
  tous_niveaux:  "Tous niveaux",
}
const STATUS_META = {
  DISPONIBLE:  { label: "Disponible",  cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  ARCHIVEE:    { label: "Archivée",    cls: "bg-slate-100 text-slate-500 border-slate-200",      dot: "bg-slate-400" },
  BROUILLON:   { label: "Brouillon",   cls: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-500" },
}

function fmt(v) {
  if (!v && v !== 0) return "—"
  return new Intl.NumberFormat("fr-DZ", { style: "currency", currency: "DZD", maximumFractionDigits: 0 }).format(v)
}

/* ─── Drawer ──────────────────────────────────────────────────────────────── */
function Drawer({ open, onClose, title, children, onSave, saving, saveLabel = "Enregistrer" }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col"
        style={{ animation: "slideIn .25s ease" }}
      >
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-black text-[#1B3A6B]">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <XIcon size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 border-2 border-slate-200 hover:border-[#1B3A6B] text-slate-600 hover:text-[#1B3A6B] text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-all">
            Annuler
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-[#E8450A] hover:bg-[#c73a08] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-all disabled:opacity-60"
          >
            {saving ? <><LoaderCircleIcon size={13} className="animate-spin" />Sauvegarde…</> : <><SaveIcon size={13} />{saveLabel}</>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Field components ────────────────────────────────────────────────────── */
function FormField({ label, required, children, error }) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
        {label} {required && <span className="text-[#E8450A]">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircleIcon size={11} />{error}
        </p>
      )}
    </div>
  )
}

const inputCls = "w-full bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg text-sm text-[#1A1A2E] px-4 py-3 placeholder:text-slate-400 outline-none focus:border-[#1B3A6B] focus:bg-white focus:ring-2 focus:ring-[#1B3A6B]/10 transition-all"

/* ─── Delete confirm modal ────────────────────────────────────────────────── */
function DeleteModal({ open, onClose, onConfirm, title, description }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl" style={{ animation: "pop .2s ease" }}>
        <style>{`@keyframes pop{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2Icon size={20} className="text-red-500" />
        </div>
        <h3 className="text-base font-black text-center text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 text-center mb-6">{description}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border-2 border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest py-2.5 rounded-lg hover:border-slate-300 transition-all">
            Annuler
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest py-2.5 rounded-lg transition-all">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function CourseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [course,    setCourse]    = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [activeTab, setActiveTab] = useState("modules") // "modules" | "objectifs"

  /* ── Modules state ── */
  const [modules,      setModules]      = useState([])
  const [moduleDrawer, setModuleDrawer] = useState(false)
  const [editingModule,setEditingModule]= useState(null)   // null = create, obj = edit
  const [deletingModule,setDeletingModule] = useState(null)
  const [moduleForm,   setModuleForm]   = useState({ titre: "", duree_heure: 1, order: 1, contenu: "" })
  const [savingModule, setSavingModule] = useState(false)

  /* ── Objectifs state ── */
  const [objectifs,       setObjectifs]       = useState(MOCK_OBJECTIFS)
  const [objectifDrawer,  setObjectifDrawer]  = useState(false)
  const [editingObjectif, setEditingObjectif] = useState(null)
  const [deletingObjectif,setDeletingObjectif]= useState(null)
  const [objectifForm,    setObjectifForm]    = useState({ description: "", ordre: 1 })
  const [savingObjectif,  setSavingObjectif]  = useState(false)

  /* ── Course edit ── */
  const [courseDrawer, setCourseDrawer] = useState(false)
  const [deleteCourse, setDeleteCourse] = useState(false)

  /* ── Fetch ── */
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await getCourse(id)
        setCourse(res)
        setModules(res.modules ?? [])
      } catch {
        setError("Impossible de charger la formation.")
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  /* ── Module handlers ── */
  function openCreateModule() {
    setEditingModule(null)
    setModuleForm({ titre: "", duree_heure: 1, order: (modules.length + 1), contenu: "" })
    setModuleDrawer(true)
  }
  function openEditModule(mod) {
    setEditingModule(mod)
    setModuleForm({ titre: mod.titre, duree_heure: mod["durée_heure"] ?? mod.duree_heure ?? 1, order: mod.order, contenu: mod.contenu ?? "" })
    setModuleDrawer(true)
  }
  function saveModule() {
    setSavingModule(true)
    setTimeout(() => {
      if (editingModule) {
        setModules(prev => prev.map(m => m.id === editingModule.id ? { ...m, ...moduleForm, "durée_heure": moduleForm.duree_heure } : m))
      } else {
        setModules(prev => [...prev, { ...moduleForm, "durée_heure": moduleForm.duree_heure, id: crypto.randomUUID(), formation_id: id }])
      }
      setSavingModule(false)
      setModuleDrawer(false)
    }, 600)
  }
  function confirmDeleteModule() {
    setModules(prev => prev.filter(m => m.id !== deletingModule.id))
    setDeletingModule(null)
  }

  /* ── Objectif handlers ── */
  function openCreateObjectif() {
    setEditingObjectif(null)
    setObjectifForm({ description: "", ordre: (objectifs.length + 1) })
    setObjectifDrawer(true)
  }
  function openEditObjectif(obj) {
    setEditingObjectif(obj)
    setObjectifForm({ description: obj.description, ordre: obj.ordre })
    setObjectifDrawer(true)
  }
  function saveObjectif() {
    setSavingObjectif(true)
    setTimeout(() => {
      if (editingObjectif) {
        setObjectifs(prev => prev.map(o => o.id === editingObjectif.id ? { ...o, ...objectifForm } : o))
      } else {
        setObjectifs(prev => [...prev, { ...objectifForm, id: crypto.randomUUID(), formation_id: id }])
      }
      setSavingObjectif(false)
      setObjectifDrawer(false)
    }, 600)
  }
  function confirmDeleteObjectif() {
    setObjectifs(prev => prev.filter(o => o.id !== deletingObjectif.id))
    setDeletingObjectif(null)
  }

  /* ── Computed ── */
  const domaine  = course ? (DOMAINE_META[course.domaine] ?? DOMAINE_META.autre) : null
  const status   = course ? (STATUS_META[course.status]  ?? STATUS_META.DISPONIBLE) : null
  const totalHeures = course ? (course.duree_jours ?? 0) * (course.heures_par_jour ?? 0) : 0

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');*{font-family:'Plus Jakarta Sans',sans-serif;}`}</style>
      <div className="bg-white border-b border-slate-200 px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-3 animate-pulse">
          <div className="h-3 bg-slate-200 rounded w-40" />
          <div className="h-7 bg-slate-200 rounded w-64" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse h-28" />)}
      </div>
    </div>
  )

  if (error || !course) return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');*{font-family:'Plus Jakarta Sans',sans-serif;}`}</style>
      <div className="text-center">
        <p className="font-bold text-slate-700">{error ?? "Formation introuvable"}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-xs font-bold uppercase tracking-widest text-[#E8450A] hover:underline">← Retour</button>
      </div>
    </div>
  )

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up   { animation: fadeUp .4s ease both; }
        .fade-up-1 { animation: fadeUp .4s ease 60ms  both; }
        .fade-up-2 { animation: fadeUp .4s ease 120ms both; }
        .fade-up-3 { animation: fadeUp .4s ease 180ms both; }
      `}</style>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="fade-up">
              <div className="flex items-center gap-2 mb-1">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#1B3A6B] transition-colors">
                  <ArrowLeftIcon size={12} /> Retour
                </button>
                <span className="text-slate-300">/</span>
                <AppBreadcrumb />
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <h1 className="text-2xl font-black text-[#1B3A6B] tracking-tight">{course.titre}</h1>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${status.cls}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
                {course.certifiante && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                    <AwardIcon size={10} /> Certifiant
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-slate-400 mt-1">{course.code}</p>
            </div>

            {/* Actions */}
            <div className="fade-up flex items-center gap-2" style={{ animationDelay: "80ms" }}>
              <button
                onClick={() => setCourseDrawer(true)}
                className="inline-flex items-center gap-2 bg-transparent text-[#1B3A6B] text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg border-2 border-[#1B3A6B] hover:bg-[#1B3A6B] hover:text-white transition-all"
              >
                <PencilIcon size={13} /> Modifier
              </button>
              <button
                onClick={() => setDeleteCourse(true)}
                className="inline-flex items-center gap-2 bg-transparent text-red-500 text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg border-2 border-red-200 hover:bg-red-50 transition-all"
              >
                <Trash2Icon size={13} /> Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── LEFT: Stats + Description ───────────────────────── */}
          <div className="space-y-5">

            {/* Stat cards */}
            <div className="fade-up grid grid-cols-2 gap-3">
              {[
                { label: "Prix",        value: fmt(course.prix),             icon: DollarSignIcon },
                { label: "Durée",       value: `${course.duree_jours} jours`,icon: CalendarDaysIcon },
                { label: "Heures/Jour", value: `${course.heures_par_jour}h`, icon: ClockIcon },
                { label: "Total",       value: `${totalHeures}h`,            icon: BarChart2Icon },
              ].map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
                      <Icon size={12} className="text-slate-300" />
                    </div>
                    <p className="text-lg font-black text-[#1B3A6B] leading-none">{s.value}</p>
                  </div>
                )
              })}
            </div>

            {/* Details card */}
            <div className="fade-up-1 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <div className="w-6 h-6 bg-[#1B3A6B]/8 rounded-md flex items-center justify-center">
                  <BookOpenIcon size={13} className="text-[#1B3A6B]" />
                </div>
                <h3 className="text-sm font-bold text-[#1B3A6B]">Détails</h3>
              </div>
              <div className="px-5 py-4 space-y-3">
                {[
                  { label: "Domaine",  value: <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${domaine.cls}`}>{domaine.label}</span> },
                  { label: "Type",     value: course.type },
                  { label: "Niveau",   value: NIVEAU_META[course.niveau] ?? course.niveau },
                  { label: "Certifiant", value: course.certifiante ? "Oui" : "Non" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{row.label}</p>
                    <div className="text-xs font-semibold text-slate-700">{row.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {course.description && (
              <div className="fade-up-2 bg-white border border-[#E2E8F0] rounded-xl px-5 py-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Description</p>
                <p className="text-sm text-slate-600 leading-relaxed font-light">{course.description}</p>
              </div>
            )}
          </div>

          {/* ── RIGHT: Tabs (Modules + Objectifs) ───────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Tab bar */}
            <div className="fade-up bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
              <div className="flex border-b border-slate-100">
                {[
                  { id: "modules",   label: "Modules",   icon: LayersIcon,    count: modules.length },
                  { id: "objectifs", label: "Objectifs", icon: ListChecksIcon, count: objectifs.length },
                ].map(tab => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                        isActive
                          ? "text-[#1B3A6B] border-[#E8450A] bg-slate-50/50"
                          : "text-slate-400 border-transparent hover:text-slate-600"
                      }`}
                    >
                      <Icon size={14} />
                      {tab.label}
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive ? "bg-[#1B3A6B] text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* ── MODULES TAB ── */}
              {activeTab === "modules" && (
                <div>
                  {/* Tab header */}
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500 font-light">
                      {modules.length === 0 ? "Aucun module ajouté" : `${modules.length} module${modules.length > 1 ? "s" : ""}`}
                    </p>
                    <button
                      onClick={openCreateModule}
                      className="inline-flex items-center gap-1.5 bg-[#E8450A] hover:bg-[#c73a08] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all"
                    >
                      <PlusIcon size={13} /> Ajouter
                    </button>
                  </div>

                  {/* Module list */}
                  {modules.length === 0 ? (
                    <div className="py-14 text-center">
                      <LayersIcon size={32} className="text-slate-300 mx-auto mb-3" />
                      <p className="font-bold text-slate-600 text-sm">Aucun module</p>
                      <p className="text-xs text-slate-400 mt-1">Ajoutez le premier module de cette formation.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {[...modules].sort((a, b) => a.order - b.order).map((mod, i) => (
                        <div
                          key={mod.id}
                          className="group flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors"
                          style={{ animation: `fadeUp .3s ease ${i * 40}ms both` }}
                        >
                          {/* Drag handle */}
                          <GripVerticalIcon size={15} className="text-slate-300 shrink-0 cursor-grab" />

                          {/* Order badge */}
                          <div className="w-7 h-7 rounded-full bg-[#1B3A6B]/8 border border-[#1B3A6B]/15 flex items-center justify-center shrink-0">
                            <span className="text-[11px] font-black text-[#1B3A6B]">{mod.order}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{mod.titre}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                                <ClockIcon size={11} />
                                {mod["durée_heure"] ?? mod.duree_heure ?? "—"}h
                              </span>
                              {mod.contenu && (
                                <span className="text-[11px] text-slate-400 truncate max-w-[200px]">{mod.contenu}</span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModule(mod)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1B3A6B]/8 text-slate-400 hover:text-[#1B3A6B] transition-colors"
                            >
                              <PencilIcon size={13} />
                            </button>
                            <button
                              onClick={() => setDeletingModule(mod)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2Icon size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── OBJECTIFS TAB ── */}
              {activeTab === "objectifs" && (
                <div>
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500 font-light">
                      {objectifs.length === 0 ? "Aucun objectif défini" : `${objectifs.length} objectif${objectifs.length > 1 ? "s" : ""}`}
                    </p>
                    <button
                      onClick={openCreateObjectif}
                      className="inline-flex items-center gap-1.5 bg-[#E8450A] hover:bg-[#c73a08] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all"
                    >
                      <PlusIcon size={13} /> Ajouter
                    </button>
                  </div>

                  {objectifs.length === 0 ? (
                    <div className="py-14 text-center">
                      <ListChecksIcon size={32} className="text-slate-300 mx-auto mb-3" />
                      <p className="font-bold text-slate-600 text-sm">Aucun objectif</p>
                      <p className="text-xs text-slate-400 mt-1">Définissez les objectifs pédagogiques.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {[...objectifs].sort((a, b) => a.ordre - b.ordre).map((obj, i) => (
                        <div
                          key={obj.id}
                          className="group flex items-start gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors"
                          style={{ animation: `fadeUp .3s ease ${i * 40}ms both` }}
                        >
                          {/* Checkmark */}
                          <div className="w-6 h-6 rounded-full bg-[#E8450A]/8 border border-[#E8450A]/20 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2Icon size={12} className="text-[#E8450A]" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700 leading-relaxed">{obj.description}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                              Objectif {obj.ordre}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                              onClick={() => openEditObjectif(obj)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1B3A6B]/8 text-slate-400 hover:text-[#1B3A6B] transition-colors"
                            >
                              <PencilIcon size={13} />
                            </button>
                            <button
                              onClick={() => setDeletingObjectif(obj)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2Icon size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Module Drawer ──────────────────────────────────────────── */}
      <Drawer
        open={moduleDrawer}
        onClose={() => setModuleDrawer(false)}
        title={editingModule ? "Modifier le module" : "Nouveau module"}
        onSave={saveModule}
        saving={savingModule}
        saveLabel={editingModule ? "Mettre à jour" : "Créer le module"}
      >
        <div className="space-y-5">
          <FormField label="Titre" required>
            <input
              type="text"
              placeholder="Ex: Introduction à la comptabilité"
              value={moduleForm.titre}
              onChange={e => setModuleForm(p => ({ ...p, titre: e.target.value }))}
              className={inputCls}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ordre">
              <input
                type="number" min="1"
                value={moduleForm.order}
                onChange={e => setModuleForm(p => ({ ...p, order: parseInt(e.target.value) || 1 }))}
                className={inputCls}
              />
            </FormField>
            <FormField label="Durée (heures)">
              <input
                type="number" min="1"
                value={moduleForm.duree_heure}
                onChange={e => setModuleForm(p => ({ ...p, duree_heure: parseInt(e.target.value) || 1 }))}
                className={inputCls}
              />
            </FormField>
          </div>

          <FormField label="Contenu">
            <textarea
              rows={6}
              placeholder="Décrivez le contenu de ce module…"
              value={moduleForm.contenu}
              onChange={e => setModuleForm(p => ({ ...p, contenu: e.target.value }))}
              className={`${inputCls} resize-y`}
            />
          </FormField>

          {/* Preview */}
          {moduleForm.titre && (
            <div className="bg-[#1B3A6B]/4 border border-[#1B3A6B]/15 rounded-lg px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1B3A6B]/60 mb-2">Aperçu</p>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#1B3A6B]/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-[#1B3A6B]">{moduleForm.order}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1B3A6B]">{moduleForm.titre}</p>
                  <p className="text-xs text-slate-500">{moduleForm.duree_heure}h</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Drawer>

      {/* ── Objectif Drawer ────────────────────────────────────────── */}
      <Drawer
        open={objectifDrawer}
        onClose={() => setObjectifDrawer(false)}
        title={editingObjectif ? "Modifier l'objectif" : "Nouvel objectif"}
        onSave={saveObjectif}
        saving={savingObjectif}
        saveLabel={editingObjectif ? "Mettre à jour" : "Créer l'objectif"}
      >
        <div className="space-y-5">
          <FormField label="Ordre">
            <input
              type="number" min="1"
              value={objectifForm.ordre}
              onChange={e => setObjectifForm(p => ({ ...p, ordre: parseInt(e.target.value) || 1 }))}
              className={inputCls}
            />
          </FormField>

          <FormField label="Description" required>
            <textarea
              rows={5}
              placeholder="Ex: Maîtriser les fondamentaux de la comptabilité générale"
              value={objectifForm.description}
              onChange={e => setObjectifForm(p => ({ ...p, description: e.target.value }))}
              className={`${inputCls} resize-y`}
            />
          </FormField>

          {objectifForm.description && (
            <div className="flex items-start gap-3 bg-[#E8450A]/4 border border-[#E8450A]/15 rounded-lg px-4 py-3">
              <CheckCircle2Icon size={15} className="text-[#E8450A] shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700">{objectifForm.description}</p>
            </div>
          )}
        </div>
      </Drawer>

      {/* ── Course edit drawer (placeholder) ───────────────────────── */}
      <Drawer
        open={courseDrawer}
        onClose={() => setCourseDrawer(false)}
        title="Modifier la formation"
        onSave={() => setCourseDrawer(false)}
        saving={false}
        saveLabel="Mettre à jour"
      >
        <div className="space-y-5">
          <FormField label="Titre">
            <input type="text" defaultValue={course.titre} className={inputCls} />
          </FormField>
          <FormField label="Description">
            <textarea rows={4} defaultValue={course.description} className={`${inputCls} resize-y`} />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Prix (DZD)">
              <input type="number" defaultValue={course.prix} className={inputCls} />
            </FormField>
            <FormField label="Durée (jours)">
              <input type="number" defaultValue={course.duree_jours} className={inputCls} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Heures / Jour">
              <input type="number" defaultValue={course.heures_par_jour} className={inputCls} />
            </FormField>
            <FormField label="Niveau">
              <select defaultValue={course.niveau} className={inputCls}>
                {Object.entries(NIVEAU_META).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </FormField>
          </div>
        </div>
      </Drawer>

      {/* ── Delete modals ──────────────────────────────────────────── */}
      <DeleteModal
        open={!!deletingModule}
        onClose={() => setDeletingModule(null)}
        onConfirm={confirmDeleteModule}
        title="Supprimer ce module ?"
        description={`Le module "${deletingModule?.titre}" sera définitivement supprimé.`}
      />
      <DeleteModal
        open={!!deletingObjectif}
        onClose={() => setDeletingObjectif(null)}
        onConfirm={confirmDeleteObjectif}
        title="Supprimer cet objectif ?"
        description="Cet objectif pédagogique sera définitivement supprimé."
      />
      <DeleteModal
        open={deleteCourse}
        onClose={() => setDeleteCourse(false)}
        onConfirm={() => { setDeleteCourse(false); navigate("/formations") }}
        title="Supprimer cette formation ?"
        description={`La formation "${course.titre}" et tous ses modules seront supprimés.`}
      />
    </div>
  )
}