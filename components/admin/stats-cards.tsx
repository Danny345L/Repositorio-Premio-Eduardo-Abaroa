"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Users, FolderOpen, Eye, EyeOff } from "lucide-react"
import { MOCK_PARTICIPANTS } from "@/lib/mock-data"
import { CATEGORIES } from "@/lib/types"

export function StatsCards() {
  const totalParticipants = MOCK_PARTICIPANTS.length
  const publicCount = MOCK_PARTICIPANTS.filter((p) => p.status === "public").length
  const privateCount = MOCK_PARTICIPANTS.filter((p) => p.status === "private").length
  const totalCategories = CATEGORIES.length

  const stats = [
    {
      label: "Total Participantes",
      value: totalParticipants,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Categorias Activas",
      value: totalCategories,
      icon: FolderOpen,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Obras Publicas",
      value: publicCount,
      icon: Eye,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Obras Privadas",
      value: privateCount,
      icon: EyeOff,
      color: "text-muted-foreground",
      bg: "bg-muted",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className={cn(stat.bg, "flex h-11 w-11 items-center justify-center rounded-xl")}>
              <stat.icon className={cn(stat.color, "h-5 w-5")} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
