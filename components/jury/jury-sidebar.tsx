"use client"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Award, FolderOpen, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JurySidebarProps {
  activeCategory: string
  categories: string[]
  onSelectCategory: (cat: string) => void
}

export function JurySidebar({ activeCategory, categories, onSelectCategory }: JurySidebarProps) {
  const { user, logout } = useAuth()

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
            Portal del Jurado
          </span>
        </div>
      </div>

      {/* Category Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Categorias Asignadas
        </p>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                activeCategory === cat
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <FolderOpen className="h-4 w-4" />
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* User Info */}
      <div className="border-t border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
            {user?.name?.charAt(0) ?? "J"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              Jurado
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
