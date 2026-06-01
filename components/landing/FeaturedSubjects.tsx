'use client'

import SubjectCard from '@/components/subject/SubjectCard'
import { Subject } from '@/types/subject'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface FeaturedSubjectsProps {
  subjects: Subject[]
  meetingsCounts: Record<string, number>
}

export default function FeaturedSubjects({ subjects, meetingsCounts }: FeaturedSubjectsProps) {
  // Take up to 3 subjects for the featured section
  const featured = subjects.slice(0, 3)

  if (featured.length === 0) {
    return null
  }

  return (
    <section className="py-12 sm:py-16 border-t border-border/10 bg-gradient-to-b from-transparent to-card/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Mata Kuliah Pilihan
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Materi perkuliahan PKU MUI 19 terstruktur yang sering dicari dan dipelajari.
            </p>
          </div>
          <Link href="/subjects">
            <Button variant="outline" className="rounded-xl font-semibold border-border/60 hover:bg-primary/10 hover:text-primary hover:border-primary/20">
              Lihat Semua
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              meetingsCount={meetingsCounts[subject.id] || 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
