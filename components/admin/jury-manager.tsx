"use client"

import { useState } from "react"
import type { User, Category } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
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
import { Plus, Pencil, Trash2, UserPlus, Users, Eye, EyeOff } from "lucide-react"

interface JuryManagerProps {
  juryUsers: User[]
  categories: Category[]
}

export function JuryManager({ juryUsers, categories }: JuryManagerProps) {
  const { registerUser, removeUser, updateUser } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [assignedCategories, setAssignedCategories] = useState<string[]>([])

  const openCreate = () => {
    setEditingUser(null)
    setName("")
    setEmail("")
    setPassword("")
    setShowPassword(false)
    setAssignedCategories([])
    setDialogOpen(true)
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    setName(user.name)
    setEmail(user.email)
    setPassword("")
    setShowPassword(false)
    setAssignedCategories(user.assignedCategories ? [...user.assignedCategories] : [])
    setDialogOpen(true)
  }

  const openDelete = (user: User) => {
    setDeletingUser(user)
    setDeleteDialogOpen(true)
  }

  const toggleCategory = (catName: string) => {
    setAssignedCategories((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    )
  }

  const handleSave = () => {
    if (!name.trim() || !email.trim()) return
    if (!editingUser && !password.trim()) return

    if (editingUser) {
      const updated: User = {
        ...editingUser,
        name: name.trim(),
        email: email.trim(),
        assignedCategories,
        ...(password.trim() ? { password: password.trim() } : {}),
      }
      updateUser(updated)
    } else {
      const newUser: User = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role: "jury",
        assignedCategories,
      }
      registerUser(newUser)
    }

    setDialogOpen(false)
    setEditingUser(null)
  }

  const handleDelete = () => {
    if (deletingUser) {
      removeUser(deletingUser.id)
      setDeleteDialogOpen(false)
      setDeletingUser(null)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {juryUsers.length} {juryUsers.length === 1 ? "jurado registrado" : "jurados registrados"}
        </p>
        <Button onClick={openCreate} className="h-9 gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Jurado
        </Button>
      </div>

      {/* Jury List */}
      {juryUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No hay jurados</p>
          <p className="mt-1 text-sm text-muted-foreground">Agregue el primer miembro del jurado</p>
          <Button onClick={openCreate} variant="outline" className="mt-4 gap-2">
            <UserPlus className="h-4 w-4" />
            Agregar Jurado
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {juryUsers.map((jury) => (
            <div
              key={jury.id}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                {jury.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{jury.name}</p>
                <p className="text-sm text-muted-foreground truncate">{jury.email}</p>
              </div>
              <div className="hidden sm:flex flex-wrap gap-1.5 max-w-xs">
                {jury.assignedCategories?.map((cat) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    {cat}
                  </Badge>
                ))}
                {(!jury.assignedCategories || jury.assignedCategories.length === 0) && (
                  <span className="text-xs text-muted-foreground italic">Sin categorias asignadas</span>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => openEdit(jury)}
                  aria-label={`Editar ${jury.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => openDelete(jury)}
                  aria-label={`Eliminar ${jury.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Editar Jurado" : "Nuevo Jurado"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Modifique los datos del jurado y sus categorias asignadas."
                : "Ingrese los datos del nuevo jurado. Se creara su usuario para acceder al sistema."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="jury-name" className="text-sm font-medium">
                Nombre Completo
              </Label>
              <Input
                id="jury-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Maria Elena Gutierrez"
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="jury-email" className="text-sm font-medium">
                Correo Electronico
              </Label>
              <Input
                id="jury-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jurado@premioeduardoabaroa.bo"
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="jury-password" className="text-sm font-medium">
                {editingUser ? "Nueva Contrasena (dejar vacio para mantener)" : "Contrasena"}
              </Label>
              <div className="relative">
                <Input
                  id="jury-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingUser ? "Dejar vacio para no cambiar" : "Ingrese una contrasena"}
                  className="h-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {!editingUser && (
                <p className="text-xs text-muted-foreground">
                  Esta contrasena sera utilizada por el jurado para iniciar sesion en el sistema.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Categorias Asignadas</Label>
              <p className="text-xs text-muted-foreground">
                Seleccione las categorias que este jurado podra evaluar
              </p>
              <div className="flex flex-col gap-2 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border p-3">
                {categories.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-2 text-center">
                    No hay categorias disponibles. Cree categorias primero.
                  </p>
                ) : (
                  categories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2.5 rounded-md px-2 py-1.5 cursor-pointer transition-colors hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={assignedCategories.includes(cat.name)}
                        onCheckedChange={() => toggleCategory(cat.name)}
                      />
                      <span className="text-sm text-foreground">{cat.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || !email.trim() || (!editingUser && !password.trim())}
            >
              {editingUser ? "Guardar Cambios" : "Crear Jurado"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Jurado</AlertDialogTitle>
            <AlertDialogDescription>
              Esta seguro de eliminar al jurado{" "}
              <strong>{deletingUser?.name}</strong>? El usuario ya no podra acceder al sistema.
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
