"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/lib/auth-context"
import { MOCK_PARTICIPANTS } from "@/lib/mock-data"
import { CATEGORIES, type Participant } from "@/lib/types"
import { JurySidebar } from "./jury-sidebar"
import { WorkCard } from "./work-card"
import { WorkDetail } from "./work-detail"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function JuryDashboard() {
  const { user } = useAuth()
  const categories = user?.assignedCategories ?? []

  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "")
  const [subcategoryFilter, setSubcategoryFilter] = useState("all")
  const [modalityFilter, setModalityFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [viewingWork, setViewingWork] = useState<Participant | null>(null)

  const selectedCategoryObj = CATEGORIES.find((c) => c.name === activeCategory)

  const filteredWorks = useMemo(() => {
    return MOCK_PARTICIPANTS.filter((p) => {
      if (p.category !== activeCategory) return false
      if (p.status !== "public" && p.status !== "anonymous") return false
      if (subcategoryFilter !== "all" && p.subcategory !== subcategoryFilter) return false
      if (modalityFilter !== "all" && p.modality !== modalityFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          p.name.toLowerCase().includes(q) ||
          p.workTitle.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [activeCategory, subcategoryFilter, modalityFilter, search])

  if (viewingWork) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <JurySidebar
          activeCategory={activeCategory}
          categories={categories}
          onSelectCategory={(cat) => {
            setActiveCategory(cat)
            setViewingWork(null)
          }}
        />
        <main className="flex-1 overflow-y-auto">
          <WorkDetail participant={viewingWork} onBack={() => setViewingWork(null)} />
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <JurySidebar
        activeCategory={activeCategory}
        categories={categories}
        onSelectCategory={(cat) => {
          setActiveCategory(cat)
          setSubcategoryFilter("all")
          setModalityFilter("all")
        }}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm px-6 py-4">
          <h1 className="text-lg font-semibold text-foreground">{activeCategory}</h1>
          <p className="text-sm text-muted-foreground">
            Evaluacion de obras - Premio Eduardo Abaroa
          </p>
        </header>

        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar obra o participante..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Subcategoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {(selectedCategoryObj?.subcategories ?? []).map((sub) => (
                  <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={modalityFilter} onValueChange={setModalityFilter}>
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue placeholder="Modalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Profesional">Profesional</SelectItem>
                <SelectItem value="Emergente">Emergente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Works Grid */}
          {filteredWorks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-2xl bg-muted p-6">
                <Search className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="font-medium text-foreground">No se encontraron obras</p>
              <p className="text-sm text-muted-foreground mt-1">
                Intente ajustar los filtros de busqueda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredWorks.map((work) => (
                <WorkCard key={work.id} participant={work} onView={setViewingWork} />
              ))}
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            {filteredWorks.length} obras encontradas
          </p>
        </div>
      </main>
    </div>
  )
}
