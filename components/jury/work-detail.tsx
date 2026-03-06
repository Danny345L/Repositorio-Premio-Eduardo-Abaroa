"use client"

import { type Participant } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Calendar, FolderOpen, Tag, Music, Video, Image as ImageIcon, Play, Pause, ShieldQuestion } from "lucide-react"
import { useState } from "react"

interface WorkDetailProps {
  participant: Participant
  onBack: () => void
}

export function WorkDetail({ participant, onBack }: WorkDetailProps) {
  const isAnonymous = participant.status === "anonymous"
  const hasAudio = !!participant.audioUrl
  const hasVideo = !!participant.videoUrl
  const hasImages = participant.images && participant.images.length > 0

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm px-6 py-4">
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la lista
        </Button>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className="text-xs">
              {participant.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {participant.subcategory}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {participant.modality}
            </Badge>
            {isAnonymous && (
              <Badge variant="outline" className="text-xs gap-1 border-accent/40 bg-accent/10 text-accent-foreground">
                <ShieldQuestion className="h-3 w-3" />
                Evaluacion anonima
              </Badge>
            )}
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground leading-tight text-balance">
            {participant.workTitle}
          </h1>
          {isAnonymous ? (
            <p className="mt-2 text-sm text-muted-foreground italic">
              Los datos del participante estan ocultos durante la etapa de evaluacion.
            </p>
          ) : (
            <p className="mt-2 text-lg text-muted-foreground">
              {participant.name}
            </p>
          )}
        </div>

        {/* Media Section */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Video Player */}
          {hasVideo && (
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <Video className="h-4 w-4" />
                  Video
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-foreground/5">
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <button className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105">
                        <Play className="h-6 w-6 ml-1" />
                      </button>
                      <span className="text-sm text-muted-foreground">Reproducir video</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audio Player */}
          {hasAudio && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <Music className="h-4 w-4" />
                  Audio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AudioPlayer />
              </CardContent>
            </Card>
          )}

          {/* Image Gallery */}
          {hasImages && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <ImageIcon className="h-4 w-4" />
                  Galeria de Imagenes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {participant.images?.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl bg-secondary/50 overflow-hidden flex items-center justify-center"
                    >
                      <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* No media fallback */}
          {!hasVideo && !hasAudio && !hasImages && (
            <Card className="border-border/50 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-2xl bg-muted p-6">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="font-medium text-foreground">Sin archivos multimedia</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Esta obra no tiene archivos multimedia adjuntos
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Participant Info - hidden during anonymous evaluation */}
        {isAnonymous ? (
          <Card className="border-border/50 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <ShieldQuestion className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Informacion del participante oculta</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Para preservar la integridad de la evaluacion, los datos personales del participante no se muestran
                  durante esta etapa. Una vez finalizado el proceso de evaluacion, esta informacion sera visible.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">
                Informacion del Participante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <InfoRow icon={User} label="Participante" value={participant.name} />
                <Separator />
                <InfoRow icon={FolderOpen} label="Categoria" value={participant.category} />
                <Separator />
                <InfoRow icon={Tag} label="Subcategoria" value={participant.subcategory} />
                <Separator />
                <InfoRow icon={Calendar} label="Edicion" value={String(participant.year)} />
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">Modalidad</span>
                  </div>
                  <Badge variant={participant.modality === "Profesional" ? "default" : "secondary"}>
                    {participant.modality}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="flex items-center gap-4 rounded-xl bg-secondary/50 p-4">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-transform hover:scale-105"
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
      </button>
      <div className="flex-1">
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-primary transition-all" />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-muted-foreground">1:24</span>
          <span className="text-[11px] text-muted-foreground">4:30</span>
        </div>
      </div>
    </div>
  )
}
