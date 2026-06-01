import { getSubjectBySlug } from '@/actions/subject.actions'
import { getMeetingsBySubjectId } from '@/actions/meeting.actions'
import { getMaterials } from '@/actions/material.actions'
import MeetingsAccordion from '@/components/subject/MeetingsAccordion'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Calendar, FileText, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface SubjectDetailPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 60

export default async function SubjectDetailPage({ params }: SubjectDetailPageProps) {
  const { slug } = await params
  const subject = await getSubjectBySlug(slug)

  if (!subject) {
    notFound()
  }

  const meetings = await getMeetingsBySubjectId(subject.id)
  const allMaterials = await getMaterials()

  // Group materials by meeting_id
  const materialsByMeeting: Record<string, typeof allMaterials> = {}
  allMaterials.forEach((material) => {
    if (material.meeting_id) {
      if (!materialsByMeeting[material.meeting_id]) {
        materialsByMeeting[material.meeting_id] = []
      }
      materialsByMeeting[material.meeting_id].push(material)
    }
  })

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Back button and Meta */}
      <div className="space-y-4">
        <Link href="/subjects">
          <Button variant="ghost" size="sm" className="pl-1 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Semua Mata Kuliah
          </Button>
        </Link>

        <div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-full ring-1 ring-primary/10">
            Detail Mata Kuliah
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mt-3">
            {subject.name}
          </h1>
          {subject.description && (
            <p className="mt-3 text-sm text-muted-foreground/90 leading-relaxed">
              {subject.description}
            </p>
          )}
        </div>
      </div>

      <hr className="border-border/30" />

      {/* Meetings Accordion Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          Daftar Pertemuan
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {meetings.length} Sesi
          </span>
        </h2>

        {meetings.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/40 rounded-2xl bg-card/10">
            <HelpCircle className="mx-auto h-9 w-9 text-muted-foreground" />
            <h3 className="mt-3 text-sm font-semibold text-foreground">Belum ada pertemuan</h3>
            <p className="mt-1 text-xs text-muted-foreground">Admin belum menambahkan pertemuan untuk kuliah ini.</p>
          </div>
        ) : (
          <MeetingsAccordion meetings={meetings} materialsByMeeting={materialsByMeeting} />
        )}
      </div>
    </div>
  )
}
