import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "./components/data-table"
import data from "./app/dashboard/data.json"
import LoginPage from "./login"
export default function App({ children }) {
  return (
    <LoginPage/>
  )
}