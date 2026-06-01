import SubjectCard from '@/components/subject/SubjectCard'
import { getSubjects } from '@/actions/subject.actions'
import { getMeetings } from '@/actions/meeting.actions'
import { BookOpen } from 'lucide-react'

export const revalidate = 60

export default async function SubjectsPage() {
  const subjects = await getSubjects()
  const meetings = await getMeetings()

  // Count meetings by subject_id
  const meetingsCounts: Record<string, number> = {}
  meetings.forEach((meeting) => {
    if (meeting.subject_id) {
      meetingsCounts[meeting.subject_id] = (meetingsCounts[meeting.subject_id] || 0) + 1
    }
  })

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          Semua Mata Kuliah
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl">
          Temukan seluruh daftar mata kuliah yang diajarkan pada Program Kader Ulama 19 lengkap dengan berkas materi di setiap pertemuan.
        </p>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/40 rounded-2xl bg-card/10">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-sm font-semibold text-foreground">Belum ada mata kuliah</h3>
          <p className="mt-1.5 text-xs text-muted-foreground">Mata kuliah akan segera ditambahkan oleh admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              meetingsCount={meetingsCounts[subject.id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}
