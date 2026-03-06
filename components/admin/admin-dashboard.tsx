"use client"

import { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { StatsCards } from "./stats-cards"
import { ParticipantsTable } from "./participants-table"
import { ParticipantForm } from "./participant-form"
import { CategoriesManager } from "./categories-manager"
import { SubcategoriesManager } from "./subcategories-manager"
import { JuryManager } from "./jury-manager"
import { CoordinatorManager } from "./coordinator-manager"
import { EditionsManager } from "./editions-manager"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DEFAULT_YEARS, CATEGORIES as DEFAULT_CATEGORIES } from "@/lib/types"
import type { Participant, Category, User, Subcategory } from "@/lib/types"
import { MOCK_SUBCATEGORIES } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import { PanelLeftClose, PanelLeft } from "lucide-react"

export function AdminDashboard() {
  const { users } = useAuth()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [selectedYear, setSelectedYear] = useState<string>("2026")
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Dynamic state
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [subcategories, setSubcategories] = useState<Subcategory[]>(MOCK_SUBCATEGORIES)
  const [years, setYears] = useState<number[]>([...DEFAULT_YEARS])
  const juryUsers = users.filter((u) => u.role === "jury")
  const coordinatorUsers = users.filter((u) => u.role === "coordinator")

  const handleNavigate = (section: string) => {
    if (section.startsWith("year-")) {
      setSelectedYear(section.replace("year-", ""))
      setActiveSection("participants")
    } else {
      setActiveSection(section)
    }
    setShowForm(false)
    setEditingParticipant(null)
  }

  const handleEdit = (participant: Participant) => {
    setEditingParticipant(participant)
    setShowForm(true)
  }

  const handleCreateNew = () => {
    setEditingParticipant(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingParticipant(null)
  }

  const sectionTitles: Record<string, string> = {
    dashboard: "Panel General",
    participants: showForm
      ? editingParticipant ? "Editar Participante" : "Nuevo Participante"
      : "Participantes",
    categories: "Categorias",
    subcategories: "Subcategorias",
    jury: "Jurados",
    coordinators: "Coordinadores de Registro",
    editions: "Ediciones",
    settings: "Configuracion",
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        years={years}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Header Bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
            >
              {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {sectionTitles[activeSection] ?? ""}
              </h1>
              <p className="text-sm text-muted-foreground">
                Gestion del Premio Eduardo Abaroa
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Edicion" />
              </SelectTrigger>
              <SelectContent>
                {years.sort((a, b) => b - a).map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {activeSection === "dashboard" && (
            <div className="flex flex-col gap-6">
              <StatsCards />
              <ParticipantsTable
                yearFilter={selectedYear}
                onEdit={handleEdit}
                onCreateNew={handleCreateNew}
              />
            </div>
          )}

          {activeSection === "participants" && !showForm && (
            <ParticipantsTable
              yearFilter={selectedYear}
              onEdit={handleEdit}
              onCreateNew={handleCreateNew}
            />
          )}

          {activeSection === "participants" && showForm && (
            <ParticipantForm
              participant={editingParticipant}
              onClose={handleFormClose}
            />
          )}

          {activeSection === "categories" && (
            <CategoriesManager
              categories={categories}
              allSubcategories={subcategories}
              onUpdate={setCategories}
            />
          )}

          {activeSection === "subcategories" && (
            <SubcategoriesManager
              subcategories={subcategories}
              categories={categories}
              onUpdate={setSubcategories}
            />
          )}

          {activeSection === "jury" && (
            <JuryManager
              juryUsers={juryUsers}
              categories={categories}
            />
          )}

          {activeSection === "coordinators" && (
            <CoordinatorManager
              coordinatorUsers={coordinatorUsers}
            />
          )}

          {activeSection === "editions" && (
            <EditionsManager
              years={years}
              onUpdate={setYears}
            />
          )}

          {activeSection === "settings" && (
            <SettingsView />
          )}
        </div>
      </main>
    </div>
  )
}

function SettingsView() {
  return (
    <div className="max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="font-semibold text-foreground mb-4">Configuracion General</h3>
      <div className="flex flex-col gap-4 text-sm text-muted-foreground">
        <div className="flex items-center justify-between py-3 border-b border-border">
          <span>Nombre de la Plataforma</span>
          <span className="font-medium text-foreground">Premio Eduardo Abaroa</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-border">
          <span>Edicion Actual</span>
          <span className="font-medium text-foreground">2026</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-border">
          <span>Inscripciones Abiertas</span>
          <span className="font-medium text-success">Activo</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span>Visibilidad Publica</span>
          <span className="font-medium text-foreground">Habilitada</span>
        </div>
      </div>
    </div>
  )
}
