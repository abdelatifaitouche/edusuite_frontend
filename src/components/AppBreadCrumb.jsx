// src/components/AppBreadcrumb.jsx
import { Link, useLocation } from "react-router-dom"
import { ChevronRightIcon, HomeIcon } from "lucide-react"

/**
 * Route → breadcrumb label map.
 * Add every route segment here as you build pages.
 */
const LABELS = {
  dashboard:  "Dashboard",
  // ── Formation module
  trainers:   "Formateurs",
  formations: "Formations",
  sessions:   "Sessions",
  students:   "Étudiants",
  salles:     "Salles",
  // ── User management
  users:      "Utilisateurs",
  // ── Actions
  new:        "Nouveau",
  edit:       "Modifier",
  // ── Other
  settings:   "Paramètres",
  help:       "Aide",
}

/**
 * Resolves a URL segment to a human-readable label.
 * Falls back to capitalising the raw segment.
 */
function resolveLabel(segment) {
  return (
    LABELS[segment.toLowerCase()] ??
    segment.charAt(0).toUpperCase() + segment.slice(1)
  )
}

/**
 * <AppBreadcrumb />
 *
 * Drop it at the top of any page — it reads the current URL automatically.
 *
 * Optional props:
 *   custom  — override the last crumb label, e.g. a resource name
 *             <AppBreadcrumb custom="Daghbouche Ouns" />
 */
export function AppBreadcrumb({ custom }) {
  const { pathname } = useLocation()

  // Split path into segments, drop empty strings
  const segments = pathname.split("/").filter(Boolean)

  // Build cumulative hrefs:  ["trainers"] → "/trainers", etc.
  const crumbs = segments.map((seg, i) => ({
    label: i === segments.length - 1 && custom ? custom : resolveLabel(seg),
    href:  "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }))

  if (crumbs.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 flex-wrap">
      {/* Home */}
      <Link
        to="/dashboard"
        className="flex items-center text-slate-400 hover:text-[#1B3A6B] transition-colors"
      >
        <HomeIcon size={13} />
      </Link>

      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRightIcon size={12} className="text-slate-300 shrink-0" />
          {crumb.isLast ? (
            <span className="text-[13px] font-semibold text-[#1B3A6B]">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.href}
              className="text-[13px] text-slate-400 hover:text-[#1B3A6B] transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}