import { Meeting } from './meeting'

export interface Material {
  id: string
  meeting_id: string
  title: string
  description?: string
  drive_url: string
  file_type: string // default 'pdf'
  thumbnail?: string
  created_at: string
  meetings?: Meeting // Relational payload from join query
}
