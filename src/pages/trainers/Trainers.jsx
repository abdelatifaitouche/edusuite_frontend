import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"

import { listTrainers } from "@/services/training.service";
import { AppBreadcrumb } from "@/components/AppBreadcrumb"



/* ─── Helpers ───────────────────────────────────────────────────────────── */
const AVATAR_BG = [
  "bg-blue-700", "bg-indigo-600", "bg-sky-700",
  "bg-violet-600", "bg-teal-600", "bg-cyan-700",
  "bg-blue-500", "bg-indigo-500",
];

function initials(t) {
  return `${t.first_name?.[0] ?? ""}${t.last_name?.[0] ?? ""}`.toUpperCase();
}
function fullName(t) {
  return `${t.first_name ?? ""} ${t.last_name ?? ""}`.trim();
}

const NIVEAU_META = {
  junior:    { label: "Junior",    cls: "bg-slate-100 text-slate-600 border border-slate-200" },
  confirme:  { label: "Confirmé",  cls: "bg-blue-50 text-blue-700 border border-blue-200" },
  senior:    { label: "Senior",    cls: "bg-[#1B3A6B]/8 text-[#1B3A6B] border border-[#1B3A6B]/20" },
  expert:    { label: "Expert",    cls: "bg-[#E8450A]/8 text-[#E8450A] border border-[#E8450A]/25" },
};

/* ─── Sub-components ────────────────────────────────────────────────────── */

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-6 py-5">
      <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-3xl font-black text-[#1B3A6B] leading-none">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1.5">{sub}</p>}
    </div>
  );
}

function TrainerRow({ trainer, index, onView }) {
  const meta = NIVEAU_META[trainer.niveau_expertise] ?? NIVEAU_META.junior;
  return (
    <tr
      className="group border-b border-slate-100 hover:bg-slate-50/70 transition-colors duration-150 cursor-pointer"
      onClick={() => onView(trainer)}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Avatar + name */}
      <td className="py-3.5 pl-6 pr-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${AVATAR_BG[index % AVATAR_BG.length]} flex items-center justify-center text-white font-black text-sm shrink-0`}>
            {initials(trainer)}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">{fullName(trainer)}</p>
            <p className="text-xs text-slate-400 mt-0.5">{trainer.email}</p>
          </div>
        </div>
      </td>

      {/* Specialité */}
      <td className="py-3.5 px-4 hidden sm:table-cell">
        <p className="text-sm text-slate-600">{trainer.specialite ?? "—"}</p>
      </td>

      {/* Niveau */}
      <td className="py-3.5 px-4 hidden md:table-cell">
        <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${meta.cls}`}>
          {meta.label}
        </span>
      </td>

      {/* Sessions */}
      <td className="py-3.5 px-4 hidden lg:table-cell text-center">
        <span className="text-sm font-bold text-slate-700">{trainer.telephone}</span>
      </td>

      {/* Formations */}
      <td className="py-3.5 px-4 hidden lg:table-cell text-center">
        <span className="text-sm font-bold text-slate-700">{trainer.formations_count ?? 0}</span>
      </td>

      {/* Statut */}
      <td className="py-3.5 px-4">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
          trainer.status == "ACTIVE"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-slate-100 text-slate-500 border border-slate-200"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${          trainer.status == "ACTIVE"
 ? "bg-emerald-500" : "bg-slate-400"}`} />
          { trainer.status == "ACTIVE"? "Actif" : "Inactif"}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3.5 pl-4 pr-6">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onView(trainer); }}
            className="text-[11px] font-bold uppercase tracking-widest text-[#1B3A6B] hover:text-[#E8450A] transition-colors"
          >
            Voir →
          </button>
        </div>
      </td>
    </tr>
  );
}

function TrainerCard({ trainer, index, onView }) {
  const meta = NIVEAU_META[trainer.niveau_expertise] ?? NIVEAU_META.junior;
  return (
    <div
      className="bg-white border border-slate-200 rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/8 transition-all duration-200 cursor-pointer group"
      onClick={() => onView(trainer)}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-full ${AVATAR_BG[index % AVATAR_BG.length]} flex items-center justify-center text-white font-black text-base`}>
          {initials(trainer)}
        </div>
        <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    trainer.status == "ACTIVE"

            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-slate-100 text-slate-500 border border-slate-200"
        }`}>
          {trainer.actif ? "Actif" : "Inactif"}
        </span>
      </div>

      <p className="font-black text-slate-800 text-sm leading-tight">{fullName(trainer)}</p>
      <p className="text-xs text-slate-400 mt-0.5 mb-3 truncate">{trainer.email}</p>

      <div className="flex items-center justify-between">
        <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${meta.cls}`}>
          {meta.label}
        </span>
        <span className="text-xs text-slate-400">{trainer.specialite}</span>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex gap-4">
        <div className="text-center">
          <p className="text-base font-black text-[#1B3A6B]">{trainer.telephone}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">telephone</p>
        </div>
        <div className="text-center">
          <p className="text-base font-black text-[#1B3A6B]">{trainer.formations_count ?? 0}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Formations</p>
        </div>
        <div className="ml-auto flex items-end">
          <span className="text-[11px] font-bold text-[#E8450A] opacity-0 group-hover:opacity-100 transition-opacity">
            Voir →
          </span>
        </div>
      </div>
    </div>
  );
}

function TrainerDrawer({ trainer, onClose }) {
  const drawerRef = useRef(null);
  const meta = NIVEAU_META[trainer?.niveau_expertise] ?? NIVEAU_META.junior;

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!trainer) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={drawerRef}
        className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto flex flex-col"
        style={{ animation: "slideIn 0.25s ease" }}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div className="bg-linear-to-br from-[#1B3A6B] to-[#0f2347] px-6 pt-8 pb-10 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
          >
            ✕
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className={`w-14 h-14 rounded-full ${AVATAR_BG[0]} flex items-center justify-center text-white font-black text-xl`}>
              {initials(trainer)}
            </div>
            <div>
              <p className="text-white font-black text-lg leading-tight">{fullName(trainer)}</p>
              <p className="text-white/60 text-xs mt-0.5">{trainer.email}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-5 relative z-10">
            <span className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${meta.cls}`}>
              {meta.label}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        trainer.status == "ACTIVE"

                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${          trainer.status == "ACTIVE"
 ? "bg-emerald-400" : "bg-slate-500"}`} />
              {          trainer.status == "ACTIVE"
 ? "Actif" : "Inactif"}
            </span>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 border-b border-slate-100">
          {[
            { label: "Sessions animées", value: trainer.sessions_count ?? 0 },
            { label: "Formations",       value: trainer.formations_count ?? 0 },
          ].map((s) => (
            <div key={s.label} className="px-6 py-4 text-center border-r last:border-r-0 border-slate-100">
              <p className="text-2xl font-black text-[#1B3A6B]">{s.value}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="flex-1 px-6 py-6 space-y-5">
          {[
            { label: "Spécialité",    value: trainer.specialite },
            { label: "Niveau",        value: meta.label },
            { label: "Email",         value: trainer.email },
            { label: "Téléphone",     value: trainer.telephone ?? "Non renseigné" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100 last:border-0">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 shrink-0">{row.label}</p>
              <p className="text-sm font-semibold text-slate-700 text-right">{row.value ?? "—"}</p>
            </div>
          ))}

          {trainer.bio && (
            <div className="pt-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Biographie</p>
              <p className="text-sm text-slate-600 leading-relaxed">{trainer.bio}</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-5 border-t border-slate-100 flex gap-3">
          <button className="flex-1 bg-[#E8450A] hover:bg-[#c73a08] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-colors">
            Modifier
          </button>
          <button className="flex-1 border-2 border-slate-200 hover:border-[#1B3A6B] text-slate-600 hover:text-[#1B3A6B] text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-colors">
            {          trainer.status == "ACTIVE"
 ? "Désactiver" : "Activer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function Trainers() {
  const [data,        setData]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState("");
  const [filterNiveau, setFilterNiveau] = useState("all");
  const [filterActif,  setFilterActif]  = useState("all");
  const [viewMode,    setViewMode]    = useState("table"); // "table" | "grid"
  const [selected,    setSelected]    = useState(null);
  const [page,        setPage]        = useState(1);

   const navigate = useNavigate()


  const PAGE_SIZE = 8;

  const fetchTrainers = async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const result = await listTrainers(p);
      setData(result ?? MOCK);
    } catch {
      // fallback to mock while API isn't ready
      setData(MOCK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrainers(page); }, [page]);

  // Derived / filtered list
  const filtered = data.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      fullName(t).toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q) ||
      t.specialite?.toLowerCase().includes(q);
    const matchNiveau = filterNiveau === "all" || t.niveau_expertise === filterNiveau;
    const matchActif  =
      filterActif === "all"  ? true :
      filterActif === "actif"? t.actif :
      !t.actif;
    return matchSearch && matchNiveau && matchActif;
  });

  const totalActif   = data.filter((t) => t.actif).length;
  const totalExpert  = data.filter((t) => t.niveau_expertise === "expert").length;
  const totalSession = data.reduce((a, t) => a + (t.sessions_count ?? 0), 0);

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.45s ease both; }
      `}</style>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="fade-up">
                        <AppBreadcrumb />

              <div className="flex items-center gap-2 mb-1">
                <span className="block w-5 h-0.5 bg-[#E8450A]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8450A]">
                  Gestion
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#1B3A6B] tracking-tight leading-tight">
                Formateurs
              </h1>
              <p className="text-sm text-slate-500 mt-0.5 font-light">
                {data.length} formateur{data.length !== 1 ? "s" : ""} enregistré{data.length !== 1 ? "s" : ""}
              </p>
            </div>

            <button onClick={() => navigate("/trainers/new")} 
              className="fade-up inline-flex items-center gap-2 bg-[#E8450A] hover:bg-[#c73a08] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg border-2 border-[#E8450A] hover:border-[#c73a08] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-900/20 transition-all"
              style={{ animationDelay: "80ms" }}
            >
              + Ajouter un formateur
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Total formateurs", value: data.length,    sub: "enregistrés" },
              { label: "Actifs",           value: totalActif,     sub: `${data.length - totalActif} inactif(s)` },
              { label: "Experts",          value: totalExpert,    sub: "niveau expert" },
              { label: "Sessions totales", value: totalSession,   sub: "animées" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="fade-up bg-white border border-slate-200 rounded-xl px-5 py-4"
                style={{ animationDelay: `${(i + 1) * 60}ms` }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
                <p className="text-2xl font-black text-[#1B3A6B] mt-1 leading-none">{s.value}</p>
                <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-50 max-w-sm">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Rechercher un formateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10 transition-all"
            />
          </div>

          {/* Niveau filter */}
          <select
            value={filterNiveau}
            onChange={(e) => setFilterNiveau(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg text-xs font-semibold uppercase tracking-wide text-slate-600 px-3 py-2.5 focus:outline-none focus:border-[#1B3A6B] transition-colors cursor-pointer"
          >
            <option value="all">Tous niveaux</option>
            <option value="junior">Junior</option>
            <option value="confirme">Confirmé</option>
            <option value="senior">Senior</option>
            <option value="expert">Expert</option>
          </select>

          {/* Statut filter */}
          <select
            value={filterActif}
            onChange={(e) => setFilterActif(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg text-xs font-semibold uppercase tracking-wide text-slate-600 px-3 py-2.5 focus:outline-none focus:border-[#1B3A6B] transition-colors cursor-pointer"
          >
            <option value="all">Tous statuts</option>
            <option value="actif">Actifs</option>
            <option value="inactif">Inactifs</option>
          </select>

          {/* View toggle */}
          <div className="ml-auto flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {[
              { mode: "table", icon: "☰" },
              { mode: "grid",  icon: "⊞" },
            ].map(({ mode, icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded text-sm font-bold transition-all ${
                  viewMode === mode
                    ? "bg-[#1B3A6B] text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        {search || filterNiveau !== "all" || filterActif !== "all" ? (
          <p className="text-xs text-slate-400 mt-3">
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
            {search && <span> pour <strong className="text-slate-600">«&nbsp;{search}&nbsp;»</strong></span>}
          </p>
        ) : null}
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-10">
        {loading ? (
          /* Skeleton */
          <div className={viewMode === "table"
            ? "bg-white border border-slate-200 rounded-xl overflow-hidden"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          }>
            {[...Array(6)].map((_, i) => (
              viewMode === "table" ? (
                <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 last:border-0 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-32" />
                    <div className="h-2.5 bg-slate-100 rounded w-44" />
                  </div>
                  <div className="h-5 bg-slate-100 rounded-full w-16" />
                </div>
              ) : (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse space-y-3">
                  <div className="flex justify-between">
                    <div className="w-11 h-11 rounded-full bg-slate-200" />
                    <div className="h-5 bg-slate-100 rounded-full w-14" />
                  </div>
                  <div className="h-3 bg-slate-200 rounded w-28" />
                  <div className="h-2.5 bg-slate-100 rounded w-36" />
                  <div className="h-px bg-slate-100 w-full mt-2" />
                  <div className="flex gap-4">
                    <div className="h-8 bg-slate-100 rounded w-12" />
                    <div className="h-8 bg-slate-100 rounded w-12" />
                  </div>
                </div>
              )
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-600 font-semibold text-sm">{error}</p>
            <button
              onClick={() => fetchTrainers(page)}
              className="mt-4 text-xs font-bold uppercase tracking-widest text-[#E8450A] hover:underline"
            >
              Réessayer
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-16 text-center">
            <p className="text-4xl mb-4">👤</p>
            <p className="font-bold text-slate-700 text-base">Aucun formateur trouvé</p>
            <p className="text-sm text-slate-400 mt-1">Modifiez vos filtres ou ajoutez un formateur.</p>
          </div>
        ) : viewMode === "table" ? (
          /* ── Table view ── */
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3 pl-6 pr-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Formateur</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden sm:table-cell">Spécialité</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden md:table-cell">Telephone</th>
                  <th className="text-center py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden lg:table-cell">Sessions</th>
                  <th className="text-center py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden lg:table-cell">Formations</th>
                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</th>
                  <th className="py-3 pl-4 pr-6" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((trainer, i) => (
                  <TrainerRow
                    key={trainer.id ?? i}
                    trainer={trainer}
                    index={i}
                    onView={setSelected}
                  />
                ))}
              </tbody>
            </table>

            {/* Table footer */}
            <div className="border-t border-slate-100 px-6 py-3 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                {filtered.length} formateur{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="text-xs font-bold text-slate-400 disabled:opacity-30 hover:text-[#1B3A6B] transition-colors px-2 py-1"
                >
                  ← Préc.
                </button>
                <span className="text-xs font-bold text-[#1B3A6B] bg-[#1B3A6B]/8 px-3 py-1 rounded">
                  {page}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="text-xs font-bold text-slate-400 hover:text-[#1B3A6B] transition-colors px-2 py-1"
                >
                  Suiv. →
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ── Grid view ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((trainer, i) => (
              <TrainerCard
                key={trainer.id ?? i}
                trainer={trainer}
                index={i}
                onView={setSelected}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Detail drawer ─────────────────────────────────────────── */}
      {selected && (
        <TrainerDrawer trainer={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}