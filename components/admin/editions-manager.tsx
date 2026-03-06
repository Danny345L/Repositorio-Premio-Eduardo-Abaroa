"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Calendar } from "lucide-react"

interface EditionsManagerProps {
  years: number[]
  onUpdate: (years: number[]) => void
}

export function EditionsManager({ years, onUpdate }: EditionsManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingYear, setDeletingYear] = useState<number | null>(null)
  const [newYear, setNewYear] = useState("")
  const [yearError, setYearError] = useState("")

  const currentYear = new Date().getFullYear()
  const sortedYears = [...years].sort((a, b) => b - a)

  const openCreate = () => {
    setNewYear(String(currentYear + 1))
    setYearError("")
    setDialogOpen(true)
  }

  const openDelete = (year: number) => {
    setDeletingYear(year)
    setDeleteDialogOpen(true)
  }

  const handleSave = () => {
    const parsed = parseInt(newYear, 10)
    if (isNaN(parsed) || parsed < 2000 || parsed > 2100) {
      setYearError("Ingrese un ano valido entre 2000 y 2100")
      return
    }
    if (years.includes(parsed)) {
      setYearError("Esta edicion ya existe")
      return
    }
    onUpdate([...years, parsed])
    setDialogOpen(false)
  }

  const handleDelete = () => {
    if (deletingYear !== null) {
      onUpdate(years.filter((y) => y !== deletingYear))
      setDeleteDialogOpen(false)
      setDeletingYear(null)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {years.length} {years.length === 1 ? "edicion registrada" : "ediciones registradas"}
        </p>
        <Button onClick={openCreate} className="h-9 gap-2">
          <Plus className="h-4 w-4" />
          Nueva Edicion
        </Button>
      </div>

      {/* Years List */}
      {sortedYears.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No hay ediciones</p>
          <p className="mt-1 text-sm text-muted-foreground">Agregue la primera edicion del premio</p>
          <Button onClick={openCreate} variant="outline" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Agregar Edicion
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedYears.map((year) => (
            <div
              key={year}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{year}</p>
                  {year === currentYear && (
                    <Badge variant="secondary" className="text-[10px] mt-0.5">Actual</Badge>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => openDelete(year)}
                aria-label={`Eliminar edicion ${year}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Nueva Edicion</DialogTitle>
            <DialogDescription>
              Ingrese el ano de la nueva edicion del premio.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edition-year" className="text-sm font-medium">
                Ano de la Edicion
              </Label>
              <Input
                id="edition-year"
                type="number"
                value={newYear}
                onChange={(e) => {
                  setNewYear(e.target.value)
                  setYearError("")
                }}
                placeholder="Ej: 2027"
                className="h-10"
                min={2000}
                max={2100}
              />
              {yearError && (
                <p className="text-xs text-destructive">{yearError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Crear Edicion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Edicion</AlertDialogTitle>
            <AlertDialogDescription>
              Esta seguro de eliminar la edicion <strong>{deletingYear}</strong>?
              Esto podria afectar a participantes registrados en esta edicion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
