// src/pages/sessions/Sessions.jsx
import { useMemo, useState, useCallback } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin  from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin     from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import { useNavigate } from "react-router-dom"
import { list_occurrences } from "@/services/session.service"
import { AppBreadcrumb } from "@/components/AppBreadcrumb"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  LayoutListIcon,
  ClockIcon,
  UserRoundIcon,
  MapPinIcon,
  HashIcon,
  XIcon,
  PlusIcon,
  RefreshCwIcon,
  LoaderCircleIcon,
  CalendarIcon,
  ActivityIcon,
} from "lucide-react"

/* ─── Status config ───────────────────────────────────────────────────────── */
const STATUS_META = {
  PLANNED: {
    label:       "Planifiée",
    chipBg:      "bg-[#E6F1FB]",
    chipText:    "text-[#0C447C]",
    dot:         "bg-[#185FA5]",
    barColor:    "#185FA5",
    badgeBg:     "#E6F1FB",
    badgeColor:  "#0C447C",
  },
  CONFIRMED: {
    label:       "Confirmée",
    chipBg:      "bg-emerald-50",
    chipText:    "text-emerald-800",
    dot:         "bg-emerald-500",
    barColor:    "#10B981",
    badgeBg:     "#ECFDF5",
    badgeColor:  "#065F46",
  },
  EN_COURS: {
    label:       "En cours",
    chipBg:      "bg-[#FAECE7]",
    chipText:    "text-[#993C1D]",
    dot:         "bg-[#D85A30]",
    barColor:    "#E8450A",
    badgeBg:     "#FAECE7",
    badgeColor:  "#993C1D",
  },
  COMPLETED: {
    label:       "Terminée",
    chipBg:      "bg-[#EAF3DE]",
    chipText:    "text-[#3B6D11]",
    dot:         "bg-[#639922]",
    barColor:    "#639922",
    badgeBg:     "#EAF3DE",
    badgeColor:  "#3B6D11",
  },
  CANCELLED: {
    label:       "Annulée",
    chipBg:      "bg-slate-100",
    chipText:    "text-slate-500",
    dot:         "bg-slate-400",
    barColor:    "#9CA3AF",
    badgeBg:     "#F1F5F9",
    badgeColor:  "#64748B",
  },
  DRAFT: {
    label:       "Brouillon",
    chipBg:      "bg-amber-50",
    chipText:    "text-amber-800",
    dot:         "bg-amber-400",
    barColor:    "#F59E0B",
    badgeBg:     "#FFFBEB",
    badgeColor:  "#92400E",
  },
}

function getStatus(s) {
  return STATUS_META[s] ?? {
    label: s, chipBg: "bg-slate-100", chipText: "text-slate-500",
    dot: "bg-slate-400", barColor: "#9CA3AF", badgeBg: "#F1F5F9", badgeColor: "#64748B",
  }
}

/* ─── Custom event chip ───────────────────────────────────────────────────── */
function EventChip({ event, timeText }) {
  const st = getStatus(event.extendedProps.status)
  return (
    <div className={`
      h-full overflow-hidden rounded-lg px-2 py-1.5 cursor-pointer
      border border-white/60
      ${st.chipBg} ${st.chipText}
      hover:brightness-95 transition-all duration-150
    `}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${st.dot}`} />
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 truncate">
          {st.label}
        </span>
      </div>
      <div className="text-[12px] font-bold leading-tight truncate">
        {event.title}
      </div>
      {event.extendedProps.formateur && (
        <div className="text-[10px] opacity-65 truncate mt-0.5">
          {event.extendedProps.formateur}
        </div>
      )}
      {timeText && (
        <div className="text-[10px] opacity-55 mt-0.5">{timeText}</div>
      )}
    </div>
  )
}

/* ─── Detail drawer ───────────────────────────────────────────────────────── */
function OccurrenceDrawer({ occ, onClose }) {
  const navigate  = useNavigate()
  const st        = getStatus(occ?.status)

  if (!occ) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
        style={{ animation: "slideIn .25s ease" }}
      >
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div
          className="px-6 pt-8 pb-6 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, #1B3A6B 0%, #0f2347 100%)` }}
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <XIcon size={15} />
          </button>

          {/* Status bar */}
          <div
            className="w-10 h-1 rounded mb-4"
            style={{ background: st.barColor }}
          />

          <div
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3"
            style={{ background: `${st.barColor}25`, color: st.badgeBg, border: `1px solid ${st.barColor}40` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.barColor }} />
            {st.label}
          </div>

          <h2 className="text-white font-black text-lg leading-tight">
            {occ.formation_name ?? "Session"}
          </h2>
          <p className="text-white/50 text-xs font-mono mt-1">{occ.id}</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 border-b border-slate-100">
          {[
            { label: "Séance #", value: occ.session_number ?? "—" },
            { label: "Début",    value: occ.start_at ? occ.start_at.slice(0,5) : "—" },
            { label: "Fin",      value: occ.end_at   ? occ.end_at.slice(0,5)   : "—" },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`px-4 py-3.5 text-center ${i < 2 ? "border-r border-slate-100" : ""}`}
            >
              <p className="text-xl font-black text-[#1B3A6B] leading-none">{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Detail rows */}
        <div className="flex-1 px-6 py-6 space-y-4 overflow-y-auto">
          {[
            { icon: CalendarIcon,  label: "Date",       value: occ.planned_date ? new Date(occ.planned_date).toLocaleDateString("fr-DZ", { weekday:"long", day:"numeric", month:"long", year:"numeric" }) : "—" },
            { icon: ClockIcon,     label: "Horaire",    value: occ.start_at && occ.end_at ? `${occ.start_at.slice(0,5)} – ${occ.end_at.slice(0,5)}` : "—" },
            { icon: UserRoundIcon, label: "Formateur",  value: occ.formateur_name ?? "—" },
            { icon: MapPinIcon,    label: "Salle",      value: occ.salle ?? "—" },
            { icon: HashIcon,      label: "Session ID", value: <span className="font-mono text-[11px] text-slate-500 break-all">{occ.session_id}</span> },
          ].map((row) => {
            const Icon = row.icon
            return (
              <div key={row.label} className="flex justify-between items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 shrink-0">
                  <Icon size={14} className="text-slate-400" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{row.label}</p>
                </div>
                <div className="text-sm font-semibold text-slate-700 text-right">{row.value}</div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-100 flex gap-3">
          <button
            onClick={() => navigate(`/sessions/${occ.session_id}`)}
            className="flex-1 bg-[#E8450A] hover:bg-[#c73a08] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-colors"
          >
            Voir la session →
          </button>
          <button
            onClick={onClose}
            className="flex-1 border-2 border-slate-200 hover:border-[#1B3A6B] text-slate-600 hover:text-[#1B3A6B] text-xs font-bold uppercase tracking-widest py-3 rounded-lg transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Sessions() {
  const navigate               = useNavigate()
  const [occurrences,setOccurrences] = useState([])
  const [loading,    setLoading]     = useState(false)
  const [selectedOcc,setSelectedOcc] = useState(null)
  const [calRef,     setCalRef]      = useState(null)
  const [currentTitle, setCurrentTitle] = useState("")
  const [activeFilters, setActiveFilters] = useState(
    Object.fromEntries(Object.keys(STATUS_META).map(k => [k, true]))
  )
  const [viewMode, setViewMode] = useState("dayGridMonth")

  /* ── Fetch ── */
  const fetchOccurrences = useCallback(async (range) => {
    try {
      setLoading(true)
      const data = await list_occurrences(range)
      setOccurrences(data ?? [])
    } catch (err) {
      console.error("Failed to fetch occurrences", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDatesSet = useCallback((info) => {
    setCurrentTitle(info.view.title)
    const start = info.startStr.split("T")[0]
    const end   = info.endStr.split("T")[0]
    fetchOccurrences({ start_date: start, end_date: end })
  }, [fetchOccurrences])

  /* ── Events ── */
  const events = useMemo(() => {
    return occurrences
      .filter(occ => activeFilters[occ.status] !== false)
      .map(occ => ({
        id:    occ.id,
        title: occ.formation_name,
        start: `${occ.planned_date}T${occ.start_at}`,
        end:   `${occ.planned_date}T${occ.end_at}`,
        extendedProps: {
          status:        occ.status,
          formateur:     occ.formateur_name,
          sessionNumber: occ.session_number,
          sessionId:     occ.session_id,
          salle:         occ.salle,
          raw:           occ,
        },
      }))
  }, [occurrences, activeFilters])

  /* ── Stats ── */
  const stats = useMemo(() => {
    const total    = occurrences.length
    const today    = new Date().toISOString().split("T")[0]
    const todayEvs = occurrences.filter(o => o.planned_date === today).length
    const active   = occurrences.filter(o => ["PLANNED","EN_COURS","CONFIRMED"].includes(o.status)).length
    const done     = occurrences.filter(o => o.status === "COMPLETED").length
    return { total, todayEvs, active, done }
  }, [occurrences])

  /* ── Calendar API helpers ── */
  const calApi = () => calRef?.getApi()
  const prev   = () => calApi()?.prev()
  const next   = () => calApi()?.next()
  const today  = () => calApi()?.today()

  const switchView = (v) => {
    setViewMode(v)
    calApi()?.changeView(v)
  }

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

        /* ── FullCalendar overrides ── */
        .fc { font-family: 'Plus Jakarta Sans', sans-serif !important; }

        .fc .fc-toolbar { display: none !important; }

        .fc .fc-col-header-cell {
          padding: 10px 0 !important;
          background: #F5F7FA !important;
          border-color: #E2E8F0 !important;
        }
        .fc .fc-col-header-cell-cushion {
          font-size: 11px !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          color: #6B7280 !important;
          text-decoration: none !important;
        }

        .fc .fc-daygrid-day {
          border-color: #E2E8F0 !important;
          cursor: pointer;
        }
        .fc .fc-daygrid-day:hover { background: #F5F7FA !important; }
        .fc .fc-daygrid-day.fc-day-today {
          background: rgba(232,69,10,0.03) !important;
        }
        .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
          background: #E8450A !important;
          color: #fff !important;
          border-radius: 50% !important;
          width: 26px !important; height: 26px !important;
          display: flex !important; align-items: center !important;
          justify-content: center !important;
          font-weight: 800 !important;
        }

        .fc .fc-daygrid-day-number {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #374151 !important;
          text-decoration: none !important;
          padding: 6px 8px !important;
        }
        .fc .fc-day-other .fc-daygrid-day-number { color: #CBD5E1 !important; }

        .fc .fc-daygrid-event-harness { margin: 2px 4px !important; }
        .fc .fc-daygrid-event { border-radius: 8px !important; border: none !important; background: transparent !important; }
        .fc .fc-event-main { padding: 0 !important; }

        .fc .fc-more-link {
          font-size: 10px !important;
          font-weight: 700 !important;
          color: #1B3A6B !important;
          padding: 2px 8px !important;
          margin: 1px 4px !important;
        }
        .fc .fc-more-link:hover { color: #E8450A !important; }

        .fc .fc-scrollgrid { border-color: #E2E8F0 !important; border-radius: 0 0 12px 12px; overflow: hidden; }
        .fc .fc-scrollgrid-section-body td { border-color: #E2E8F0 !important; }
        .fc .fc-scrollgrid-section-header td { border-color: #E2E8F0 !important; }

        .fc .fc-list-event td { border-color: #E2E8F0 !important; }
        .fc .fc-list-day-cushion { background: #F5F7FA !important; }
        .fc .fc-list-day-text, .fc .fc-list-day-side-text {
          font-size: 11px !important; font-weight: 700 !important;
          text-transform: uppercase !important; letter-spacing: 0.08em !important;
          color: #1B3A6B !important; text-decoration: none !important;
        }
        .fc .fc-list-event:hover td { background: #F5F7FA !important; }
        .fc .fc-list-empty { color: #9CA3AF !important; font-size: 13px !important; }
      `}</style>

      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="fade-up">
              <AppBreadcrumb />
              <div className="flex items-center gap-2 mt-3 mb-1">
                <span className="block w-5 h-0.5 bg-[#E8450A]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8450A]">Formation</span>
              </div>
              <h1 className="text-2xl font-black text-[#1B3A6B] tracking-tight">Sessions</h1>
              <p className="text-sm text-slate-500 mt-0.5 font-light">
                Calendrier des occurrences de sessions
              </p>
            </div>

            <button
              onClick={() => navigate("/sessions/new")}
              className="fade-up inline-flex items-center gap-2 bg-[#E8450A] hover:bg-[#c73a08] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg border-2 border-[#E8450A] hover:border-[#c73a08] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-900/20 transition-all"
              style={{ animationDelay: "80ms" }}
            >
              <PlusIcon size={14} /> Nouvelle session
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Ce mois",    value: stats.total,    sub: "occurrences",     icon: CalendarDaysIcon, delay: 60  },
              { label: "Aujourd'hui",value: stats.todayEvs, sub: "programmées",     icon: ClockIcon,        delay: 120 },
              { label: "Actives",    value: stats.active,   sub: "en cours / prévues", icon: ActivityIcon,  delay: 180 },
              { label: "Terminées",  value: stats.done,     sub: "ce mois",         icon: LayoutListIcon,   delay: 240 },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.label}
                  className="fade-up bg-white border border-[#E2E8F0] rounded-xl px-5 py-4"
                  style={{ animationDelay: `${s.delay}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
                    <Icon size={13} className="text-slate-300" />
                  </div>
                  <p className="text-2xl font-black text-[#1B3A6B] leading-none">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Calendar section ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Custom calendar toolbar */}
        <div className="bg-white border border-[#E2E8F0] rounded-t-xl px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          {/* Nav */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] hover:bg-[#F5F7FA] text-slate-600 transition-colors"
            >
              <ChevronLeftIcon size={15} />
            </button>
            <button
              onClick={next}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E2E8F0] hover:bg-[#F5F7FA] text-slate-600 transition-colors"
            >
              <ChevronRightIcon size={15} />
            </button>
            <button
              onClick={today}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-500 border border-[#E2E8F0] rounded-lg hover:bg-[#F5F7FA] transition-colors"
            >
              Aujourd'hui
            </button>
            <h2 className="text-base font-black text-[#1B3A6B] tracking-tight ml-1">
              {currentTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Loading indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <LoaderCircleIcon size={13} className="animate-spin text-[#E8450A]" />
                Chargement…
              </div>
            )}

            {/* Status filter pills */}
            <div className="flex gap-1.5 flex-wrap">
              {Object.entries(STATUS_META).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => setActiveFilters(f => ({ ...f, [key]: !f[key] }))}
                  className={`
                    inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest
                    px-2.5 py-1 rounded-full border transition-all
                    ${activeFilters[key]
                      ? `${meta.chipBg} ${meta.chipText} border-current`
                      : "bg-slate-50 text-slate-300 border-slate-200"
                    }
                  `}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeFilters[key] ? meta.dot : "bg-slate-300"}`} />
                  {meta.label}
                </button>
              ))}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-[#F5F7FA] border border-[#E2E8F0] rounded-lg p-1">
              {[
                { id: "dayGridMonth", icon: CalendarDaysIcon, label: "Mois" },
                { id: "listMonth",    icon: LayoutListIcon,   label: "Liste" },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => switchView(id)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-widest transition-all
                    ${viewMode === id
                      ? "bg-[#1B3A6B] text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-600"
                    }
                  `}
                >
                  <Icon size={13} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white border border-[#E2E8F0] border-t-0 rounded-b-xl overflow-hidden">
          <FullCalendar
            ref={setCalRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="fr"
            height="auto"
            events={events}
            eventContent={(info) => <EventChip event={info.event} timeText={info.timeText} />}
            datesSet={handleDatesSet}
            headerToolbar={false}
            dayMaxEvents={3}
            eventClick={({ event }) => setSelectedOcc(event.extendedProps.raw)}
            eventMinHeight={52}
            firstDay={1}
            buttonText={{ today: "Aujourd'hui", month: "Mois", list: "Liste" }}
            noEventsText="Aucune occurrence pour cette période"
            listDayFormat={{ weekday: "long", day: "numeric", month: "long" }}
            listDaySideFormat={false}
          />
        </div>

      </div>

      {/* ── Occurrence detail drawer ───────────────────────────────── */}
      {selectedOcc && (
        <OccurrenceDrawer
          occ={selectedOcc}
          onClose={() => setSelectedOcc(null)}
        />
      )}
    </div>
  )
}