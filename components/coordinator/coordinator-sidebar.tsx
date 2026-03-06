"use client"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { DEFAULT_YEARS } from "@/lib/types"
import {
  Award,
  Users,
  Calendar,
  ChevronDown,
  LogOut,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CoordinatorSidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
}

export function CoordinatorSidebar({ activeSection, onNavigate }: CoordinatorSidebarProps) {
  const { user, logout } = useAuth()
  const [yearsOpen, setYearsOpen] = useState(false)

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <Award className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-sm font-bold text-sidebar-foreground leading-tight">
            Premio Abaroa
          </span>
          <span className="text-[11px] text-muted-foreground leading-tight">
            Coordinador de Registro
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onNavigate("participants")}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              activeSection === "participants" || activeSection.startsWith("year-")
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <Users className="h-4 w-4" />
            Participantes
          </button>

          {/* Years Section */}
          <div className="mt-4">
            <button
              onClick={() => setYearsOpen(!yearsOpen)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
            >
              <span className="flex items-center gap-3">
                <Calendar className="h-4 w-4" />
                Ediciones
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  yearsOpen && "rotate-180"
                )}
              />
            </button>
            {yearsOpen && (
              <div className="ml-7 mt-1 flex flex-col gap-0.5">
                {DEFAULT_YEARS.map((year) => (
                  <button
                    key={year}
                    onClick={() => onNavigate(`year-${year}`)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      activeSection === `year-${year}`
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* User Info */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
            {user?.name?.charAt(0) ?? "C"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {user?.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            aria-label="Cerrar sesion"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
