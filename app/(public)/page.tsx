import Hero from '@/components/landing/Hero'
import FeaturedSubjects from '@/components/landing/FeaturedSubjects'
import MaterialList from '@/components/material/MaterialList'
import { getSubjects } from '@/actions/subject.actions'
import { getMeetings } from '@/actions/meeting.actions'
import { getMaterials } from '@/actions/material.actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronRight, Shield, ClipboardList } from 'lucide-react'

export const revalidate = 60 // revalidate public page every 60s (ISR)

export default async function HomePage() {
  const subjects = await getSubjects()
  const meetings = await getMeetings()
  const materials = await getMaterials()

  // Calculate stats
  const stats = {
    subjectsCount: subjects.length,
    meetingsCount: meetings.length,
    materialsCount: materials.length,
  }

  // Count meetings by subject_id
  const meetingsCounts: Record<string, number> = {}
  meetings.forEach((meeting) => {
    if (meeting.subject_id) {
      meetingsCounts[meeting.subject_id] = (meetingsCounts[meeting.subject_id] || 0) + 1
    }
  })

  // Filter for UTS, UAS, or Tugas materials (using regex for strict matching)
  const examMaterials = materials.filter((material) => {
    const title = material.title
    return (
      /\buts\b/i.test(title) ||
      /tengah/i.test(title) ||
      /\buas\b/i.test(title) ||
      /akhir/i.test(title) ||
      /tugas/i.test(title) ||
      /\bpr\b/i.test(title) ||
      /assignment/i.test(title)
    )
  }).slice(0, 4) // Show up to 4 recent exams/assignments

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <Hero stats={stats} />

      {/* Featured Subjects */}
      <FeaturedSubjects subjects={subjects} meetingsCounts={meetingsCounts} />

      {/* 📝 New Featured Exams & Assignments Section */}
      {examMaterials.length > 0 && (
        <section className="py-12 sm:py-16 border-t border-neutral-200/40 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl flex items-center gap-2.5">
                <ClipboardList className="h-7 w-7 text-primary" />
                Ujian & Tugas Terbaru
              </h2>
              <p className="mt-2 text-sm text-neutral-600 max-w-xl font-medium">
                Temukan berkas lembar ujian tengah semester (UTS), ujian akhir (UAS), dan lembar tugas mandiri terkini di sini.
              </p>
            </div>
            <Link href="/search?q=uts">
              <Button variant="outline" className="rounded-xl font-bold border-neutral-300 hover:bg-primary/5 hover:text-primary">
                Cari Semua Berkas Ujian
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {/* Re-use our gorgeous, dynamically-themed MaterialList */}
          <MaterialList materials={examMaterials} />
        </section>
      )}

      {/* CTA / Quick Links Section */}
      <section className="rounded-3xl border border-neutral-200/50 bg-white/40 p-8 md:p-12 text-center backdrop-blur-md relative overflow-hidden max-w-4xl mx-auto shadow-xl shadow-neutral-900/5">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl font-extrabold text-neutral-950 md:text-3xl leading-tight">
            Pelajari Materi Secara Terstruktur
          </h2>
          <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed font-semibold">
            Temukan kumpulan berkas materi perkuliahan Program Kader Ulama 19 lengkap yang diunggah langsung oleh administrator untuk kebutuhan studi Anda.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/subjects">
              <Button size="lg" className="rounded-xl font-bold px-6 shadow-lg shadow-primary/10">
                Jelajahi Mata Kuliah
                <ChevronRight className="ml-1.5 h-4.5 w-4.5" />
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="lg" variant="outline" className="rounded-xl border-neutral-300 font-bold px-6 hover:bg-neutral-50">
                <Shield className="mr-2 h-4.5 w-4.5 text-primary" />
                Login Administrator
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
