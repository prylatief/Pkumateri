'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, BookOpen, Layers, FileText } from 'lucide-react'

interface HeroProps {
  stats: {
    subjectsCount: number
    meetingsCount: number
    materialsCount: number
  }
}

export default function Hero({ stats }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const statItems = [
    {
      label: 'Total Mata Kuliah',
      value: stats.subjectsCount,
      icon: BookOpen,
      color: 'text-primary bg-primary/10 ring-primary/20',
    },
    {
      label: 'Total Pertemuan',
      value: stats.meetingsCount,
      icon: Layers,
      color: 'text-indigo-400 bg-indigo-500/10 ring-indigo-500/20',
    },
    {
      label: 'Total Materi',
      value: stats.materialsCount,
      icon: FileText,
      color: 'text-sky-400 bg-sky-500/10 ring-sky-500/20',
    },
  ]

  return (
    <div className="relative isolate overflow-hidden py-16 sm:py-24">
      {/* Background radial gradients for glassmorphism vibes */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-emerald-500 to-teal-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center">
        <div className="bg-white/30 backdrop-blur-xl border border-white/40 p-8 sm:p-12 rounded-3xl shadow-xl shadow-neutral-900/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
          
          <h1 className="text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl leading-tight relative z-10">
            Portal Materi PKU MUI 19
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-900 max-w-2xl mx-auto font-bold relative z-10">
            Akses cepat, rapi, dan modern ke seluruh materi perkuliahan Program Kader Ulama (PKU) MUI Angkatan 19. Cari materi dan unduh langsung dari Google Drive.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-md flex items-center gap-x-3 relative z-10">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <Input
                type="text"
                placeholder="Cari materi kuliah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-11 bg-white border border-neutral-300 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-sm shadow-sm text-neutral-800 placeholder-neutral-400"
              />
            </div>
            <Button type="submit" size="lg" className="h-11 rounded-xl font-bold px-6 bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-xs">
              Cari
            </Button>
          </form>
        </div>

        {/* Statistics Grid */}
        <div className="mx-auto mt-16 max-w-3xl sm:mt-20">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {statItems.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div
                  key={idx}
                  className="flex flex-col gap-y-3 rounded-2xl bg-neutral-900 border border-neutral-800 p-6 text-center shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
                  <dt className="text-xs font-semibold leading-5 text-neutral-400 flex items-center justify-center gap-2">
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    {stat.label}
                  </dt>
                  <dd className="order-first text-3xl font-extrabold tracking-tight text-white group-hover:text-primary transition-colors">
                    {stat.value}
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
      </div>
    </div>
  )
}
