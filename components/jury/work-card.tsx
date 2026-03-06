"use client"

import { type Participant } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Music, Video, Image as ImageIcon, ShieldQuestion } from "lucide-react"

interface WorkCardProps {
  participant: Participant
  onView: (participant: Participant) => void
}

export function WorkCard({ participant, onView }: WorkCardProps) {
  const isAnonymous = participant.status === "anonymous"
  const hasAudio = !!participant.audioUrl
  const hasVideo = !!participant.videoUrl
  const hasImages = participant.images && participant.images.length > 0

  return (
    <Card className="group overflow-hidden border-border/50 shadow-sm transition-shadow hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <div className="flex h-full w-full items-center justify-center bg-secondary/50">
          {hasVideo && <Video className="h-10 w-10 text-muted-foreground/50" />}
          {!hasVideo && hasImages && <ImageIcon className="h-10 w-10 text-muted-foreground/50" />}
          {!hasVideo && !hasImages && hasAudio && <Music className="h-10 w-10 text-muted-foreground/50" />}
          {!hasVideo && !hasImages && !hasAudio && (
            <div className="text-4xl font-serif font-bold text-muted-foreground/20">
              {participant.workTitle.charAt(0)}
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-[10px] font-medium bg-background/80 backdrop-blur-sm">
            {participant.modality}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2 mb-1">
          {participant.workTitle}
        </h3>
        {isAnonymous ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <ShieldQuestion className="h-3 w-3" />
            <span>Participante anonimo</span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mb-3">
            {participant.name}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            {participant.subcategory}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => onView(participant)}
          >
            <Eye className="h-3.5 w-3.5" />
            Ver obra
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
