import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Subject } from '@/types/subject'
import { BookOpen, ChevronRight } from 'lucide-react'

interface SubjectCardProps {
  subject: Subject
  meetingsCount?: number
}

export default function SubjectCard({ subject, meetingsCount = 0 }: SubjectCardProps) {
  return (
    <Card className="flex flex-col h-full bg-white/70 border border-neutral-200/60 hover:border-primary/40 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-2xl group overflow-hidden relative backdrop-blur-md">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex-grow p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:scale-105 transition-transform">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-xs font-bold text-primary/95 uppercase tracking-wider bg-primary/5 px-2.5 py-1 rounded-full ring-1 ring-primary/10">
            {meetingsCount} Sesi Kuliah
          </span>
        </div>
        <CardTitle className="text-lg font-extrabold text-neutral-905 leading-snug group-hover:text-primary transition-colors">
          {subject.name}
        </CardTitle>
        {subject.description && (
          <CardDescription className="mt-2 text-neutral-500 line-clamp-3 leading-relaxed text-sm">
            {subject.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardFooter className="p-6 pt-0 border-t border-neutral-100/50 bg-neutral-50/50 group-hover:bg-neutral-50 transition-colors">
        <Link href={`/subjects/${subject.slug}`} className="w-full">
          <Button variant="ghost" className="w-full flex items-center justify-between font-bold text-neutral-700 group-hover:text-primary group-hover:bg-primary/5 rounded-xl transition-all h-10 text-xs">
            Pelajari Materi Kuliah
            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
