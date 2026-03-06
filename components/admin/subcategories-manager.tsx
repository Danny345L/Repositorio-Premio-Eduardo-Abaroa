"use client"

import { useState } from "react"
import type { Subcategory, Category, FileType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Pencil, Trash2, Image, Music, Link2, FileText, Layers } from "lucide-react"

const FILE_TYPE_CONFIG: Record<FileType, { label: string; icon: React.ElementType; color: string }> = {
  image: { label: "Imagen", icon: Image, color: "bg-blue-100 text-blue-700" },
  audio: { label: "Audio", icon: Music, color: "bg-amber-100 text-amber-700" },
  link: { label: "Link (YouTube)", icon: Link2, color: "bg-red-100 text-red-700" },
  document: { label: "Documento", icon: FileText, color: "bg-emerald-100 text-emerald-700" },
}

interface SubcategoriesManagerProps {
  subcategories: Subcategory[]
  categories: Category[]
  onUpdate: (subcategories: Subcategory[]) => void
}

export function SubcategoriesManager({ subcategories, categories, onUpdate }: SubcategoriesManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingSub, setEditingSub] = useState<Subcategory | null>(null)
  const [deletingSub, setDeletingSub] = useState<Subcategory | null>(null)

  const [subName, setSubName] = useState("")
  const [fileType, setFileType] = useState<FileType>("image")
  const [categoryId, setCategoryId] = useState("")

  const [filterCategory, setFilterCategory] = useState<string>("all")

  const filteredSubcategories = filterCategory === "all"
    ? subcategories
    : subcategories.filter((s) => s.categoryId === filterCategory)

  const openCreate = () => {
    setEditingSub(null)
    setSubName("")
    setFileType("image")
    setCategoryId(categories[0]?.id ?? "")
    setDialogOpen(true)
  }

  const openEdit = (sub: Subcategory) => {
    setEditingSub(sub)
    setSubName(sub.name)
    setFileType(sub.fileType)
    setCategoryId(sub.categoryId)
    setDialogOpen(true)
  }

  const openDelete = (sub: Subcategory) => {
    setDeletingSub(sub)
    setDeleteDialogOpen(true)
  }

  const getCategoryName = (catId: string) => {
    return categories.find((c) => c.id === catId)?.name ?? catId
  }

  const handleSave = () => {
    if (!subName.trim() || !categoryId) return

    if (editingSub) {
      const updated = subcategories.map((s) =>
        s.id === editingSub.id
          ? { ...s, name: subName.trim(), fileType, categoryId }
          : s
      )
      onUpdate(updated)
    } else {
      const newSub: Subcategory = {
        id: subName.trim().toLowerCase().replace(/\s+/g, "-"),
        name: subName.trim(),
        fileType,
        categoryId,
      }
      onUpdate([...subcategories, newSub])
    }

    setDialogOpen(false)
    setEditingSub(null)
  }

  const handleDelete = () => {
    if (deletingSub) {
      onUpdate(subcategories.filter((s) => s.id !== deletingSub.id))
      setDeleteDialogOpen(false)
      setDeletingSub(null)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {subcategories.length} {subcategories.length === 1 ? "subcategoria registrada" : "subcategorias registradas"}
          </p>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-8 w-[180px] text-xs">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorias</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreate} className="h-9 gap-2">
          <Plus className="h-4 w-4" />
          Nueva Subcategoria
        </Button>
      </div>

      {/* Grid */}
      {filteredSubcategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
            <Layers className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No hay subcategorias</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {filterCategory !== "all" ? "No hay subcategorias en esta categoria" : "Agregue la primera subcategoria"}
          </p>
          <Button onClick={openCreate} variant="outline" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Agregar Subcategoria
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSubcategories.map((sub) => {
            const config = FILE_TYPE_CONFIG[sub.fileType]
            const Icon = config.icon
            return (
              <div
                key={sub.id}
                className="group relative flex items-start gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm leading-snug">{sub.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{getCategoryName(sub.categoryId)}</p>
                  <Badge variant="outline" className="mt-2 text-[10px] font-medium gap-1">
                    {config.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => openEdit(sub)}
                    aria-label={`Editar ${sub.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => openDelete(sub)}
                    aria-label={`Eliminar ${sub.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSub ? "Editar Subcategoria" : "Nueva Subcategoria"}
            </DialogTitle>
            <DialogDescription>
              {editingSub
                ? "Modifique los datos de esta subcategoria."
                : "Defina el nombre, tipo de archivo y la categoria a la que pertenece."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sub-name" className="text-sm font-medium">
                Nombre de la Subcategoria
              </Label>
              <Input
                id="sub-name"
                value={subName}
                onChange={(e) => setSubName(e.target.value)}
                placeholder="Ej: Pintura al oleo"
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Tipo de Archivo</Label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(FILE_TYPE_CONFIG) as [FileType, typeof FILE_TYPE_CONFIG[FileType]][]).map(([key, cfg]) => {
                  const Icon = cfg.icon
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFileType(key)}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                        fileType === key
                          ? "border-primary/50 bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{cfg.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Categoria</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Seleccionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!subName.trim() || !categoryId}>
              {editingSub ? "Guardar Cambios" : "Crear Subcategoria"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Subcategoria</AlertDialogTitle>
            <AlertDialogDescription>
              Esta seguro de eliminar la subcategoria{" "}
              <strong>{deletingSub?.name}</strong>? Esta accion no se puede deshacer.
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
