"use client"

import { useState } from "react"
import type { Category, Subcategory } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Plus, Pencil, Trash2, FolderPlus } from "lucide-react"

interface CategoriesManagerProps {
  categories: Category[]
  allSubcategories: Subcategory[]
  onUpdate: (categories: Category[]) => void
}

export function CategoriesManager({ categories, allSubcategories, onUpdate }: CategoriesManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  const [catName, setCatName] = useState("")
  const [selectedSubs, setSelectedSubs] = useState<string[]>([])

  const openCreate = () => {
    setEditingCategory(null)
    setCatName("")
    setSelectedSubs([])
    setDialogOpen(true)
  }

  const openEdit = (cat: Category) => {
    setEditingCategory(cat)
    setCatName(cat.name)
    setSelectedSubs([...cat.subcategories])
    setDialogOpen(true)
  }

  const openDelete = (cat: Category) => {
    setDeletingCategory(cat)
    setDeleteDialogOpen(true)
  }

  const toggleSub = (subName: string) => {
    setSelectedSubs((prev) =>
      prev.includes(subName) ? prev.filter((s) => s !== subName) : [...prev, subName]
    )
  }

  const handleSave = () => {
    if (!catName.trim()) return

    const catId = editingCategory?.id ?? catName.trim().toLowerCase().replace(/\s+/g, "-")

    if (editingCategory) {
      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? { ...c, name: catName.trim(), subcategories: selectedSubs }
          : c
      )
      onUpdate(updated)
    } else {
      const newCat: Category = {
        id: catId,
        name: catName.trim(),
        subcategories: selectedSubs,
      }
      onUpdate([...categories, newCat])
    }

    setDialogOpen(false)
    setEditingCategory(null)
  }

  const handleDelete = () => {
    if (deletingCategory) {
      onUpdate(categories.filter((c) => c.id !== deletingCategory.id))
      setDeleteDialogOpen(false)
      setDeletingCategory(null)
    }
  }

  // Get subcategories that belong to this category (by id) for the edit dialog
  const getAvailableSubcategories = () => {
    const catId = editingCategory?.id ?? catName.trim().toLowerCase().replace(/\s+/g, "-")
    // Show subcategories that belong to this category OR are already selected
    const belonging = allSubcategories.filter((s) => s.categoryId === catId)
    // Also include any that don't belong to any category yet (for new categories)
    const unassigned = allSubcategories.filter(
      (s) => !categories.some((c) => c.id === s.categoryId && c.id !== catId)
    )
    // Merge without duplicates
    const merged = [...belonging]
    for (const sub of unassigned) {
      if (!merged.find((m) => m.id === sub.id)) {
        merged.push(sub)
      }
    }
    return merged
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {categories.length} {categories.length === 1 ? "categoria registrada" : "categorias registradas"}
        </p>
        <Button onClick={openCreate} className="h-9 gap-2">
          <Plus className="h-4 w-4" />
          Nueva Categoria
        </Button>
      </div>

      {/* Grid */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
            <FolderPlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No hay categorias</p>
          <p className="mt-1 text-sm text-muted-foreground">Agregue la primera categoria para comenzar</p>
          <Button onClick={openCreate} variant="outline" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Agregar Categoria
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-foreground">{cat.name}</h3>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => openEdit(cat)}
                    aria-label={`Editar ${cat.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => openDelete(cat)}
                    aria-label={`Eliminar ${cat.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.subcategories.map((sub) => (
                  <Badge key={sub} variant="secondary" className="text-xs font-medium">
                    {sub}
                  </Badge>
                ))}
                {cat.subcategories.length === 0 && (
                  <span className="text-xs text-muted-foreground italic">Sin subcategorias asignadas</span>
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {cat.subcategories.length} {cat.subcategories.length === 1 ? "subcategoria" : "subcategorias"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Editar Categoria" : "Nueva Categoria"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Modifique el nombre o seleccione las subcategorias."
                : "Ingrese el nombre y seleccione las subcategorias que pertenecen a esta categoria."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cat-name" className="text-sm font-medium">
                Nombre de la Categoria
              </Label>
              <Input
                id="cat-name"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Ej: Artes Visuales"
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Subcategorias</Label>
              <p className="text-xs text-muted-foreground">
                Seleccione las subcategorias que pertenecen a esta categoria. Las subcategorias se crean desde la seccion "Subcategorias".
              </p>
              {allSubcategories.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    No hay subcategorias creadas aun. Cree subcategorias primero desde la seccion correspondiente.
                  </p>
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto rounded-xl border border-border divide-y divide-border">
                  {allSubcategories.map((sub) => (
                    <label
                      key={sub.id}
                      className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedSubs.includes(sub.name)}
                        onCheckedChange={() => toggleSub(sub.name)}
                      />
                      <span className="text-sm text-foreground flex-1">{sub.name}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {sub.categoryId !== (editingCategory?.id ?? "") && categories.find(c => c.id === sub.categoryId)
                          ? categories.find(c => c.id === sub.categoryId)?.name
                          : ""}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {selectedSubs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedSubs.map((sub) => (
                    <Badge key={sub} variant="secondary" className="text-xs font-medium">
                      {sub}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!catName.trim()}>
              {editingCategory ? "Guardar Cambios" : "Crear Categoria"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Esta seguro de eliminar la categoria{" "}
              <strong>{deletingCategory?.name}</strong>? Esta accion no se puede deshacer.
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
