"use client"

import { useState } from "react"
import { CoordinatorSidebar } from "./coordinator-sidebar"
import { ParticipantsTable } from "@/components/admin/participants-table"
import { ParticipantForm } from "@/components/admin/participant-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DEFAULT_YEARS } from "@/lib/types"
import type { Participant } from "@/lib/types"

export function CoordinatorDashboard() {
  const [activeSection, setActiveSection] = useState("participants")
  const [selectedYear, setSelectedYear] = useState<string>("2025")
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)
  const [showForm, setShowForm] = useState(false)

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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <CoordinatorSidebar activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="flex-1 overflow-y-auto">
        {/* Header Bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur-sm px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {showForm
                ? editingParticipant
                  ? "Editar Participante"
                  : "Nuevo Participante"
                : "Participantes"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Registro de participantes y obras
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px] h-9">
                <SelectValue placeholder="Edicion" />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_YEARS.map((year) => (
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
          {!showForm && (
            <ParticipantsTable
              yearFilter={selectedYear}
              onEdit={handleEdit}
              onCreateNew={handleCreateNew}
            />
          )}

          {showForm && (
            <ParticipantForm
              participant={editingParticipant}
              onClose={handleFormClose}
            />
          )}
        </div>
      </main>
    </div>
  )
}
