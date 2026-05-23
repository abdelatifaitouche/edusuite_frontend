// src/components/layout/MainLayout.jsx
import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppBreadcrumb } from "../AppBreadCrumb"

export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="m-2">
              <AppBreadcrumb/>
          </div>
          
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}