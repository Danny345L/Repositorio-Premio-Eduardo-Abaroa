"use client"

import { useState, useMemo } from "react"
import { MOCK_PARTICIPANTS } from "@/lib/mock-data"
import { CATEGORIES, type Participant } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Pencil, Eye } from "lucide-react"

interface ParticipantsTableProps {
  yearFilter: string
  onEdit: (participant: Participant) => void
  onCreateNew: () => void
}

export function ParticipantsTable({ yearFilter, onEdit, onCreateNew }: ParticipantsTableProps) {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [subcategoryFilter, setSubcategoryFilter] = useState("all")
  const [modalityFilter, setModalityFilter] = useState("all")

  const selectedCategory = CATEGORIES.find((c) => c.name === categoryFilter)

  const filtered = useMemo(() => {
    return MOCK_PARTICIPANTS.filter((p) => {
      if (yearFilter !== "all" && p.year !== Number(yearFilter)) return false
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false
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
  }, [yearFilter, categoryFilter, subcategoryFilter, modalityFilter, search])

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar participante u obra..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <Button onClick={onCreateNew} className="h-10 gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Participante
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setSubcategoryFilter("all") }}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorias</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Subcategoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las subcategorias</SelectItem>
            {(selectedCategory?.subcategories ?? []).map((sub) => (
              <SelectItem key={sub} value={sub}>
                {sub}
              </SelectItem>
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

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-foreground">Participante</TableHead>
              <TableHead className="font-semibold text-foreground">Obra</TableHead>
              <TableHead className="font-semibold text-foreground">Categoria</TableHead>
              <TableHead className="font-semibold text-foreground hidden md:table-cell">Subcategoria</TableHead>
              <TableHead className="font-semibold text-foreground hidden lg:table-cell">Modalidad</TableHead>
              <TableHead className="font-semibold text-foreground hidden sm:table-cell">Ano</TableHead>
              <TableHead className="font-semibold text-foreground">Estado</TableHead>
              <TableHead className="font-semibold text-foreground text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  No se encontraron participantes
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id} className="group">
                  <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate">{p.workTitle}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{p.category}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {p.subcategory}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant={p.modality === "Profesional" ? "default" : "secondary"} className="text-xs font-medium">
                      {p.modality}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{p.year}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        p.status === "public"
                          ? "border-success/30 bg-success/10 text-success"
                          : p.status === "anonymous"
                            ? "border-accent/30 bg-accent/10 text-accent-foreground"
                            : "border-border text-muted-foreground"
                      }
                    >
                      {p.status === "public" ? "Publico" : p.status === "anonymous" ? "Anonimo" : "Privado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        aria-label="Ver participante"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onEdit(p)}
                        aria-label="Editar participante"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-muted-foreground">
        Mostrando {filtered.length} de {MOCK_PARTICIPANTS.length} participantes
      </p>
    </div>
  )
}
