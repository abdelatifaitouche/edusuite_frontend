// src/components/app-sidebar.jsx
import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  LayoutDashboardIcon,
  UsersIcon,
  Settings2Icon,
  CircleHelpIcon,
  GraduationCapIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  UserRoundIcon,
  Building2Icon,
  ShieldCheckIcon,
  ChevronRightIcon,
  ContactIcon
} from "lucide-react"

/* ─── Navigation structure ────────────────────────────────────────────────
   Each module has:
   - title      : display name
   - icon       : lucide icon
   - color      : accent color for the module badge
   - basePath   : used to detect if the module is "active"
   - items      : sub-routes
   ─────────────────────────────────────────────────────────────────────── */
const MODULES = [
  {
    title:    "Formation",
    icon:     GraduationCapIcon,
    color:    "#1B3A6B",
    badge:    "bg-[#1B3A6B]/10 text-[#1B3A6B]",
    basePath: ["/trainers", "/courses", "/sessions", "/students", "/salles"],
    items: [
      { title: "Formateurs",  url: "/trainers",   icon: UserRoundIcon },
      { title: "Formations",  url: "/courses", icon: BookOpenIcon },
      { title: "Sessions",    url: "/sessions",   icon: CalendarDaysIcon },
      { title: "Étudiants",   url: "/students",   icon: UsersIcon },
      { title: "Salles",      url: "/salles",     icon: Building2Icon },
    ],
  },
  {
    title:    "Utilisateurs",
    icon:     ShieldCheckIcon,
    color:    "#E8450A",
    badge:    "bg-[#E8450A]/10 text-[#E8450A]",
    basePath: ["/users"],
    items: [
      { title: "Gestion des users", url: "/users", icon: UsersIcon },
    ],
  },
  {
     title:    "CRM",
    icon:     ContactIcon,
    color:    "#7C3AED",
     badge:    "bg-violet-50 text-violet-700",
     basePath: ["/crm"],
     items: [
      { title: "companies",  url: "/companies",   icon: UserRoundIcon },
      { title: "opportunities",  url: "/crm/opportunities",   icon: UserRoundIcon }
     ]
  },
  // ── Placeholder modules (coming soon) ───────────────────────────────
  // {
  //   title:    "Finance",
  //   icon:     BanknoteIcon,
  //   color:    "#059669",
  //   badge:    "bg-emerald-50 text-emerald-700",
  //   basePath: ["/finance"],
  //   items: [...]
  //   comingSoon: true,
  // },
  // {
  //   title:    "CRM",
  //   icon:     ContactIcon,
  //   color:    "#7C3AED",
  //   badge:    "bg-violet-50 text-violet-700",
  //   basePath: ["/crm"],
  //   items: [...]
  //   comingSoon: true,
  // },
]

const SECONDARY = [
  { title: "Paramètres", url: "/settings", icon: Settings2Icon },
  { title: "Aide",       url: "/help",     icon: CircleHelpIcon },
]

/* ─── ModuleGroup ─────────────────────────────────────────────────────── */
function ModuleGroup({ module }) {
  const { pathname } = useLocation()

  const isModuleActive = module.basePath.some((p) => pathname.startsWith(p))

  const [open, setOpen] = React.useState(isModuleActive)

  // Auto-open when navigating directly to a module URL
  React.useEffect(() => {
    if (isModuleActive) setOpen(true)
  }, [pathname, isModuleActive])

  const Icon = module.icon

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarGroup className="py-0">
        {/* Group trigger */}
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel
            className={`
              group/label flex items-center justify-between
              px-3 py-2.5 rounded-lg cursor-pointer select-none
              text-xs font-bold uppercase tracking-widest
              transition-all duration-200
              hover:bg-slate-100
              ${isModuleActive
                ? "text-[#1B3A6B]"
                : "text-slate-400 hover:text-slate-600"}
            `}
          >
            <div className="flex items-center gap-2.5">
              {/* Module icon badge */}
              <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${module.badge}`}>
                <Icon size={13} />
              </div>
              <span>{module.title}</span>
            </div>
            <ChevronRightIcon
              size={13}
              className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
            />
          </SidebarGroupLabel>
        </CollapsibleTrigger>

        {/* Items */}
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuSub className="ml-3 border-l border-slate-200 pl-0">
                  {module.items.map((item) => {
                    const ItemIcon = item.icon
                    const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
                    return (
                      <SidebarMenuSubItem key={item.url}>
                        <SidebarMenuSubButton asChild isActive={isActive}>
                          <Link
                            to={item.url}
                            className={`
                              flex items-center gap-2.5 px-3 py-2 ml-1 rounded-lg
                              text-[13px] font-medium transition-all duration-150
                              ${isActive
                                ? "bg-[#1B3A6B]/8 text-[#1B3A6B] font-semibold"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}
                            `}
                          >
                            <ItemIcon
                              size={14}
                              className={isActive ? "text-[#E8450A]" : "text-slate-400"}
                            />
                            <span>{item.title}</span>
                            {isActive && (
                              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E8450A] shrink-0" />
                            )}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  )
}

/* ─── AppSidebar ──────────────────────────────────────────────────────── */
export function AppSidebar({ ...props }) {
  const { user } = useAuth()
  const { pathname } = useLocation()

  return (
    <Sidebar collapsible="offcanvas" {...props}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <SidebarHeader className="border-b border-slate-100 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-auto py-2 hover:bg-transparent">
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#1B3A6B] rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-white font-black text-[9px] tracking-wide">ECF</span>
                </div>
                <div className="leading-none">
                  <div className="text-sm font-black text-[#1B3A6B] tracking-wide">
                    ECF-MONTRÉAL
                  </div>
                  <div className="text-[9px] text-[#E8450A] uppercase tracking-widest mt-0.5">
                    Centre de Formation
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <SidebarContent className="px-2 py-3 gap-1">

        {/* Dashboard — standalone link */}
        <SidebarGroup className="py-0 mb-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                <Link
                  to="/dashboard"
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded-lg
                    text-[13px] font-medium transition-all duration-150
                    ${pathname === "/dashboard"
                      ? "bg-[#1B3A6B]/8 text-[#1B3A6B] font-semibold"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}
                  `}
                >
                  <LayoutDashboardIcon
                    size={15}
                    className={pathname === "/dashboard" ? "text-[#E8450A]" : "text-slate-400"}
                  />
                  <span>Dashboard</span>
                  {pathname === "/dashboard" && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E8450A] shrink-0" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Divider */}
        <div className="mx-3 mb-2 h-px bg-slate-100" />

        {/* Module groups */}
        <div className="flex flex-col gap-0.5">
          {MODULES.map((mod) => (
            <ModuleGroup key={mod.title} module={mod} />
          ))}
        </div>

        {/* Coming soon modules preview */}
        <div className="mx-3 mt-3 mb-1 h-px bg-slate-100" />
        <div className="px-3 mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
            Bientôt disponible
          </p>
        </div>
        {[
          { title: "Finance",  color: "bg-emerald-100 text-emerald-600" },
          { title: "CRM",      color: "bg-violet-100 text-violet-600"  },
        ].map((m) => (
          <div
            key={m.title}
            className="mx-1 flex items-center gap-2.5 px-3 py-2 rounded-lg opacity-40 cursor-not-allowed select-none"
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${m.color}`}>
              <span className="text-[10px] font-black">
                {m.title[0]}
              </span>
            </div>
            <span className="text-[13px] font-medium text-slate-400">{m.title}</span>
            <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-slate-300 bg-slate-100 px-1.5 py-0.5 rounded">
              Soon
            </span>
          </div>
        ))}

        {/* Secondary nav pushed to bottom */}
        <div className="mt-auto pt-3 border-t border-slate-100 mx-1">
          <SidebarMenu>
            {SECONDARY.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.url
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link
                      to={item.url}
                      className={`
                        flex items-center gap-2.5 px-3 py-2 rounded-lg
                        text-[13px] font-medium transition-all duration-150
                        ${isActive
                          ? "bg-[#1B3A6B]/8 text-[#1B3A6B] font-semibold"
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}
                      `}
                    >
                      <Icon size={14} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </div>

      </SidebarContent>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <SidebarFooter className="border-t border-slate-100 pt-2">
        <NavUser
          user={{
            name:   user?.email?.split("@")[0] ?? "Utilisateur",
            email:  user?.email ?? "",
            avatar: "",
          }}
        />
      </SidebarFooter>

    </Sidebar>
  )
}