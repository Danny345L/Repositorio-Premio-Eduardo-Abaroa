export type UserRole = "admin" | "jury" | "coordinator"

export interface User {
  id: string
  name: string
  email: string
  password?: string
  role: UserRole
  assignedCategories?: string[]
}

export type ParticipantStatus = "public" | "anonymous" | "private"
export type Modality = "Profesional" | "Emergente"

export interface Participant {
  id: string
  name: string
  workTitle: string
  year: number
  category: string
  subcategory: string
  modality: Modality
  status: ParticipantStatus
  thumbnail?: string
  audioUrl?: string
  videoUrl?: string
  images?: string[]
  createdAt: string
}

export type FileType = "image" | "audio" | "link" | "document"

export interface Subcategory {
  id: string
  name: string
  fileType: FileType
  categoryId: string
}

export interface Category {
  id: string
  name: string
  subcategories: string[]
}

export const DEFAULT_YEARS = [2024, 2025, 2026]

export const CATEGORIES: Category[] = [
  {
    id: "artes-visuales",
    name: "Artes Visuales",
    subcategories: ["Pintura", "Escultura", "Grabado", "Fotografia", "Instalacion", "Arte Digital"],
  },
  {
    id: "musica",
    name: "Musica",
    subcategories: ["Composicion Clasica", "Composicion Popular", "Interpretacion Instrumental", "Interpretacion Vocal"],
  },
  {
    id: "literatura",
    name: "Literatura",
    subcategories: ["Novela", "Cuento", "Poesia", "Ensayo", "Cronica"],
  },
  {
    id: "artes-escenicas",
    name: "Artes Escenicas",
    subcategories: ["Teatro", "Danza", "Performance"],
  },
  {
    id: "cine-audiovisual",
    name: "Cine y Audiovisual",
    subcategories: ["Largometraje", "Cortometraje", "Documental", "Animacion"],
  },
]
