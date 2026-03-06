"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Pencil, Trash2, ClipboardList, UserPlus, Eye, EyeOff } from "lucide-react"

interface CoordinatorManagerProps {
  coordinatorUsers: User[]
}

export function CoordinatorManager({ coordinatorUsers }: CoordinatorManagerProps) {
  const { registerUser, removeUser, updateUser } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const openCreate = () => {
    setEditingUser(null)
    setName("")
    setEmail("")
    setPassword("")
    setShowPassword(false)
    setDialogOpen(true)
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    setName(user.name)
    setEmail(user.email)
    setPassword("")
    setShowPassword(false)
    setDialogOpen(true)
  }

  const openDelete = (user: User) => {
    setDeletingUser(user)
    setDeleteDialogOpen(true)
  }

  const handleSave = () => {
    if (!name.trim() || !email.trim()) return
    if (!editingUser && !password.trim()) return

    if (editingUser) {
      const updated: User = {
        ...editingUser,
        name: name.trim(),
        email: email.trim(),
        ...(password.trim() ? { password: password.trim() } : {}),
      }
      updateUser(updated)
    } else {
      const newUser: User = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role: "coordinator",
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
          {coordinatorUsers.length} {coordinatorUsers.length === 1 ? "coordinador registrado" : "coordinadores registrados"}
        </p>
        <Button onClick={openCreate} className="h-9 gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Coordinador
        </Button>
      </div>

      {/* Coordinator List */}
      {coordinatorUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
            <ClipboardList className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground">No hay coordinadores</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Agregue el primer coordinador de registro
          </p>
          <Button onClick={openCreate} variant="outline" className="mt-4 gap-2">
            <UserPlus className="h-4 w-4" />
            Agregar Coordinador
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {coordinatorUsers.map((coord) => (
            <div
              key={coord.id}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent font-bold text-sm">
                {coord.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{coord.name}</p>
                <p className="text-sm text-muted-foreground truncate">{coord.email}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => openEdit(coord)}
                  aria-label={`Editar ${coord.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => openDelete(coord)}
                  aria-label={`Eliminar ${coord.name}`}
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
              {editingUser ? "Editar Coordinador" : "Nuevo Coordinador"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Modifique los datos del coordinador de registro."
                : "Ingrese los datos del nuevo coordinador. Se creara su usuario para acceder al sistema."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="coord-name" className="text-sm font-medium">
                Nombre Completo
              </Label>
              <Input
                id="coord-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Laura Paz Soldan"
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="coord-email" className="text-sm font-medium">
                Correo Electronico
              </Label>
              <Input
                id="coord-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coordinador@premioeduardoabaroa.bo"
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="coord-password" className="text-sm font-medium">
                {editingUser ? "Nueva Contrasena (dejar vacio para mantener)" : "Contrasena"}
              </Label>
              <div className="relative">
                <Input
                  id="coord-password"
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
              {editingUser ? "Guardar Cambios" : "Crear Coordinador"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Coordinador</AlertDialogTitle>
            <AlertDialogDescription>
              Esta seguro de eliminar al coordinador{" "}
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
