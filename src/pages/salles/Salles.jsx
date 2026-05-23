import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { listSalles } from "@/services/salle.service"

import {
  Building2Icon,
  SearchIcon,
  PlusIcon,
  UsersIcon,
  WrenchIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderOpenIcon,
} from "lucide-react"

const STATUS_META = {
  AVAILABLE: {
    label: "Disponible",
    classes: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  },
  OCCUPIED: {
    label: "Occupée",
    classes: "bg-blue-50 text-blue-700 border border-blue-100",
  },
  MAINTENANCE: {
    label: "Maintenance",
    classes: "bg-orange-50 text-orange-700 border border-orange-100",
  },
  DISABLED: {
    label: "Hors service",
    classes: "bg-red-50 text-red-700 border border-red-100",
  },
}

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      <td className="py-4 pl-6">
        <div className="h-3 bg-slate-200 rounded w-32" />
      </td>

      <td className="py-4 px-4">
        <div className="h-3 bg-slate-100 rounded w-10" />
      </td>

      <td className="py-4 px-4">
        <div className="h-5 bg-slate-100 rounded-full w-24" />
      </td>
    </tr>
  )
}

export default function Salles() {
  const navigate = useNavigate()

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)

  const fetchSalles = async (p = 1) => {
    try {
      setLoading(true)

      const res = await listSalles(p)

      if (Array.isArray(res)) {
        setData(res)
        setHasNext(false)
      } else {
        setData(res.results ?? [])
        setHasNext(Boolean(res.next))
      }
    } catch (err) {
      console.error(err)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalles(page)
  }, [page])

  const filtered = data.filter((room) =>
    room.name?.toLowerCase().includes(search.toLowerCase())
  )

  const availableCount = data.filter(
    (x) => x.status === "AVAILABLE"
  ).length

  const maintenanceCount = data.filter(
    (x) => x.status === "MAINTENANCE"
  ).length

  const occupiedCount = data.filter(
    (x) => x.status === "OCCUPIED"
  ).length

  const totalCapacity = data.reduce(
    (acc, room) => acc + (room.size || 0),
    0
  )

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-6">
        <div className="max-w-7xl mx-auto">

          <div className="flex justify-between items-start flex-wrap gap-4">

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="block w-5 h-0.5 bg-[#E8450A]" />
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#E8450A]">
                  Infrastructure
                </span>
              </div>

              <h1 className="text-2xl font-black text-[#1B3A6B]">
                Salles
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                {data.length} salle(s)
              </p>
            </div>

            <button
              onClick={() => navigate("/salles/create")}
              className="inline-flex items-center gap-2 bg-[#E8450A] hover:bg-[#c73a08] text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all"
            >
              <PlusIcon size={14} />
              Ajouter
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

            {[
              {
                label: "Total",
                value: data.length,
                icon: Building2Icon,
              },
              {
                label: "Disponibles",
                value: availableCount,
                icon: CheckCircle2Icon,
              },
              {
                label: "Maintenance",
                value: maintenanceCount,
                icon: WrenchIcon,
              },
              {
                label: "Capacité",
                value: totalCapacity,
                icon: UsersIcon,
              },
            ].map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.label}
                  className="bg-white border border-slate-200 rounded-xl px-5 py-4"
                >
                  <div className="flex justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {stat.label}
                    </p>

                    <Icon
                      size={13}
                      className="text-slate-300"
                    />
                  </div>

                  <p className="text-2xl font-black text-[#1B3A6B]">
                    {stat.value}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-7xl mx-auto px-6 py-5">

        <div className="relative max-w-sm">
          <SearchIcon
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Rechercher une salle..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1B3A6B]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto px-6 pb-8">

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-16 text-center">

            <FolderOpenIcon
              size={40}
              className="mx-auto text-slate-300 mb-4"
            />

            <p className="font-bold text-slate-700">
              Aucune salle trouvée
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

            <table className="w-full">

              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">

                  <th className="text-left py-3 pl-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Salle
                  </th>

                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Capacité
                  </th>

                  <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Statut
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((room) => {
                  const meta =
                    STATUS_META[room.status]

                  return (
                    <tr
                      key={room.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(`/salles/${room.id}`)
                      }
                    >
                      <td className="py-4 pl-6 font-semibold text-[#1B3A6B]">
                        {room.name}
                      </td>

                      <td className="py-4 px-4 text-sm text-slate-600">
                        {room.size}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${meta.classes}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="border-t border-slate-100 px-6 py-3 flex justify-between">

              <button
                disabled={page === 1}
                onClick={() =>
                  setPage((p) =>
                    Math.max(1, p - 1)
                  )
                }
                className="text-xs font-bold text-slate-500"
              >
                <ChevronLeftIcon size={13} />
              </button>

              <span className="text-xs font-black text-[#1B3A6B]">
                {page}
              </span>

              <button
                disabled={!hasNext}
                onClick={() =>
                  setPage((p) => p + 1)
                }
                className="text-xs font-bold text-slate-500"
              >
                <ChevronRightIcon size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}