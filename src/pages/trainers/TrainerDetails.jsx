import React from 'react'

function TrainerDetails({ trainer }) {
  const data = trainer || {
    id: "a46d873e-a7d7-44ca-bc32-4ec8382514ff",
    nom: "Mahfoud",
    prenom: "el ounass",
    email: "mahfoud.elounass@gmail.com",
    telephone: "+21377818494",
    specialite: "rh",
    status: "ACTIVE",
  }

  return (
    <div className="p-6 bg-[#F5F7FA] min-h-full">
      <div className="max-w-6xl mx-auto">

        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#1B3A6B]">
              {data.nom} {data.prenom}
            </h1>
          </div>

          <div className="flex gap-3">
            <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded bg-[#E8450A] text-white hover:bg-[#c73a08] transition-colors">
              Edit
            </button>
            <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest rounded border border-[#1B3A6B] text-[#1B3A6B] hover:bg-[#1B3A6B] hover:text-white transition-colors">
              Delete
            </button>
          </div>
        </div>

        {/* Tabs (future ready) */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['Overview', 'Sessions', 'Courses', 'Stats'].map((tab, i) => (
            <button
              key={i}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded border transition-all ${
                i === 0
                  ? 'bg-white border-[#E2E8F0] text-[#1B3A6B] shadow-sm'
                  : 'bg-transparent border-transparent text-slate-500 hover:text-[#1B3A6B]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Top Summary Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#1B3A6B] flex items-center justify-center text-white font-black">
              {data.nom?.[0]?.toUpperCase()}
            </div>

            <div>
              <div className="text-base font-bold text-[#1B3A6B]">
                {data.specialite}
              </div>
              <div className="text-sm text-slate-500">
                Trainer ID: {data.id}
              </div>
            </div>

            <span className={`ml-auto text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded border ${
              data.status === 'ACTIVE'
                ? 'bg-green-50 text-green-600 border-green-200'
                : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {data.status}
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Trainer profile overview. This section will later include description, performance summary, and key highlights.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT - Main Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact Info */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-[#1B3A6B]">
                  Contact Information
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Email
                  </label>
                  <p className="text-sm text-slate-600">{data.email}</p>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                    Phone
                  </label>
                  <p className="text-sm text-slate-600">{data.telephone}</p>
                </div>
              </div>
            </div>

            {/* Placeholder for future sections */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <h3 className="text-base font-bold text-[#1B3A6B] mb-4">
                Sessions / Courses (Coming Soon)
              </h3>
              <p className="text-sm text-slate-500">
                This section will display trainer sessions, courses, and performance stats.
              </p>
            </div>
          </div>

          {/* RIGHT - Activity / Meta */}
          <div className="space-y-6">

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <h3 className="text-base font-bold text-[#1B3A6B] mb-4">
                Activity
              </h3>

              <div className="space-y-4 text-sm text-slate-600">
                <div>
                  Last update: <span className="text-slate-400">—</span>
                </div>
                <div>
                  Created at: <span className="text-slate-400">—</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
              <h3 className="text-base font-bold text-[#1B3A6B] mb-4">
                Notes
              </h3>

              <p className="text-sm text-slate-500">
                Internal notes about the trainer will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainerDetails
