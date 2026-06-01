import { Subject } from './subject'

export interface Meeting {
  id: string
  subject_id: string
  title: string
  meeting_number: number
  created_at: string
  subjects?: Subject // Relational payload from join query
}
