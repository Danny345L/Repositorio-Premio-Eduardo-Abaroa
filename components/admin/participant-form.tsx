"use client"

import { useState } from "react"
import { CATEGORIES, DEFAULT_YEARS, type Participant, type Modality, type ParticipantStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, Image, Music, Video, Eye, EyeOff, ShieldQuestion } from "lucide-react"

interface ParticipantFormProps {
  participant: Participant | null
  onClose: () => void
}

export function ParticipantForm({ participant, onClose }: ParticipantFormProps) {
  const [name, setName] = useState(participant?.name ?? "")
  const [workTitle, setWorkTitle] = useState(participant?.workTitle ?? "")
  const [year, setYear] = useState(String(participant?.year ?? "2025"))
  const [category, setCategory] = useState(participant?.category ?? "")
  const [subcategory, setSubcategory] = useState(participant?.subcategory ?? "")
  const [modality, setModality] = useState<Modality>(participant?.modality ?? "Profesional")
  const [visibility, setVisibility] = useState<ParticipantStatus>(participant?.status ?? "private")

  const selectedCategory = CATEGORIES.find((c) => c.name === category)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
  }

  return (
    <div className="max-w-3xl">
      <Button
        variant="ghost"
        onClick={onClose}
        className="mb-4 gap-2 text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la lista
      </Button>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic Info */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Informacion General
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-sm font-medium">Nombre del Participante</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre completo"
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="workTitle" className="text-sm font-medium">Titulo de la Obra</Label>
              <Input
                id="workTitle"
                value={workTitle}
                onChange={(e) => setWorkTitle(e.target.value)}
                placeholder="Titulo de la obra"
                className="h-10"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Edicion (Ano)</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_YEARS.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Modalidad</Label>
                <Select value={modality} onValueChange={(v) => setModality(v as Modality)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Profesional">Profesional</SelectItem>
                    <SelectItem value="Emergente">Emergente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classification */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Clasificacion
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Categoria</Label>
              <Select value={category} onValueChange={(v) => { setCategory(v); setSubcategory("") }}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Seleccionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Subcategoria</Label>
              <Select value={subcategory} onValueChange={setSubcategory} disabled={!category}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Seleccionar subcategoria" />
                </SelectTrigger>
                <SelectContent>
                  {(selectedCategory?.subcategories ?? []).map((sub) => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Media Uploads */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Archivos Multimedia
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FileUploadZone icon={Image} label="Imagenes" accept="image/*" />
            <FileUploadZone icon={Music} label="Audio" accept="audio/*" />
            <FileUploadZone icon={Video} label="Video" accept="video/*" />
          </CardContent>
        </Card>

        {/* Visibility */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Visibilidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={visibility}
              onValueChange={(v) => setVisibility(v as ParticipantStatus)}
              className="flex flex-col gap-3"
            >
              <label
                className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
                  visibility === "public"
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <RadioGroupItem value="public" id="vis-public" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-success" />
                    <span className="text-sm font-semibold text-foreground">Publico</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    La obra y todos los datos del participante son visibles para el jurado.
                    Usar despues de la etapa de evaluacion.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
                  visibility === "anonymous"
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <RadioGroupItem value="anonymous" id="vis-anonymous" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <ShieldQuestion className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold text-foreground">Solo obra (anonimo)</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    El jurado solo vera el titulo y la obra (archivos multimedia).
                    Los datos personales del participante se ocultan para preservar la integridad de la evaluacion.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors ${
                  visibility === "private"
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <RadioGroupItem value="private" id="vis-private" className="mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Privado</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    La obra esta completamente oculta. No es visible para ningun jurado.
                  </p>
                </div>
              </label>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="h-10">
            Cancelar
          </Button>
          <Button type="submit" className="h-10 px-8">
            {participant ? "Guardar Cambios" : "Crear Participante"}
          </Button>
        </div>
      </form>
    </div>
  )
}

function FileUploadZone({ icon: Icon, label, accept }: { icon: React.ElementType; label: string; accept: string }) {
  return (
    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 text-center transition-colors hover:border-primary/30 hover:bg-muted/50">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">
        Arrastre o haga clic
      </span>
      <input type="file" accept={accept} className="sr-only" multiple={label === "Imagenes"} />
      <div className="flex items-center gap-1.5 mt-1 text-xs text-primary font-medium">
        <Upload className="h-3 w-3" />
        Subir archivo
      </div>
    </label>
  )
}
