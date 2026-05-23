// src/pages/dashboard/Dashboard.jsx
import { useAuth } from "@/context/AuthContext"

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#1B3A6B]">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Bienvenue, {user?.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="text-xs font-bold uppercase tracking-widest text-[#E8450A] hover:underline"
        >
          Déconnexion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Documents soumis",  value: "0" },
          { label: "En cours de révision", value: "0" },
          { label: "Approuvés",         value: "0" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
          >
            <div className="text-3xl font-black text-[#1B3A6B]">{stat.value}</div>
            <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}