import { useEffect, useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AppBreadcrumb } from "@/components/AppBreadcrumb"
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverlay,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"
import {
  SearchIcon,
  PlusIcon,
  TrendingUpIcon,
  DollarSignIcon,
  TargetIcon,
  AlertTriangleIcon,
  GripVerticalIcon,
  CalendarIcon,
  PercentIcon,
  ChevronRightIcon,
} from "lucide-react"

import MOCK from "./data/mock_data"
import OpportunityCard from "./OpportunityCard"
import KanbanColumn from "./KanbanColumn"

import STAGES from "./data/stages"
import { listOpportunities } from "@/services/opportunity.service"

function formatValue(v) {
  if (!v && v !== 0) return "—"
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M DZD`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)}K DZD`
  return `${v} DZD`
}



export default function Opportunities() {
  const [data,         setData]         = useState([])
  const [search,       setSearch]       = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [activeId,     setActiveId]     = useState(null)
  const [loading , setLoading] = useState(false);


const fetchOpp = async (p = 1) => {
    setLoading(true);
    try {
      const result = await listOpportunities(p);
      setData(result.data ?? MOCK);
      console.log(result.data)
    } catch {
      // fallback to mock while API isn't ready
      setData(MOCK);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => { fetchOpp(1);}, [1]);


  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  /* ── Derived ── 
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return data.filter((d) => {
      const matchSearch = !q || d.title.toLowerCase().includes(q) || d.company?.toLowerCase().includes(q)
      const matchStatus = statusFilter === "ALL" || d.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [data, search, statusFilter])

  const grouped = useMemo(() => {
    return STAGES.reduce((acc, s) => {
      acc[s.id] = filtered.filter((d) => d.status === s.id)
      return acc
    }, {})
  }, [filtered])

  const totalPipeline = useMemo(
    () => data.filter((d) => !["WON","LOST"].includes(d.status))
              .reduce((s, d) => s + (d.estimated_value ?? 0), 0),
    [data]
  )
  const totalWon = useMemo(
    () => data.filter((d) => d.status === "WON")
              .reduce((s, d) => s + (d.estimated_value ?? 0), 0),
    [data]
  )
  const activeOp = useMemo(() => data.find((d) => d.id === activeId), [data, activeId])

  /* ── Drag handlers ── 
  const onDragStart = ({ active }) => setActiveId(active.id)

  const onDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over) return

    const activeOp  = data.find((d) => d.id === active.id)
    const overIsCol = STAGES.some((s) => s.id === over.id)

    if (overIsCol) {
      // Dropped directly on a column
      if (activeOp.status !== over.id) {
        setData((prev) =>
          prev.map((item) =>
            item.id === active.id ? { ...item, status: over.id } : item
          )
        )
      }
    } else {
      // Dropped on another card — reorder or move column
      const overOp = data.find((d) => d.id === over.id)
      if (!overOp) return

      if (activeOp.status === overOp.status) {
        // Same column — reorder
        setData((prev) => {
          const col    = prev.filter((d) => d.status === activeOp.status)
          const others = prev.filter((d) => d.status !== activeOp.status)
          const oldIdx = col.findIndex((d) => d.id === active.id)
          const newIdx = col.findIndex((d) => d.id === over.id)
          return [...others, ...arrayMove(col, oldIdx, newIdx)]
        })
      } else {
        // Different column — move card
        setData((prev) =>
          prev.map((item) =>
            item.id === active.id ? { ...item, status: overOp.status } : item
          )
        )
      }
    }
  }*/

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp .4s ease both; }
      `}</style>
    { 
      data && data.map((op , idx)=>{

        return <OpportunityCard op={op} key={op.id}/>

      })
    }
    </div>
      
  )
}