import { getSubjects } from '@/actions/subject.actions'
import { getMeetings } from '@/actions/meeting.actions'
import { getMaterials } from '@/actions/material.actions'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LayoutDashboard, BookOpen, Layers, FileText, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const subjects = await getSubjects()
  const meetings = await getMeetings()
  const materials = await getMaterials()

  const stats = [
    { name: 'Mata Kuliah', value: subjects.length, icon: BookOpen, href: '/admin/subjects', desc: 'Kelola subjek perkuliahan' },
    { name: 'Total Pertemuan', value: meetings.length, icon: Layers, href: '/admin/meetings', desc: 'Kelola sesi pertemuan kuliah' },
    { name: 'File Materi', value: materials.length, icon: FileText, href: '/admin/materials', desc: 'Kelola file drive PDF' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          Ringkasan Portal PKU 19
        </h1>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Selamat datang di panel kontrol administrator. Pantau metrik data perkuliahan secara real-time.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Link key={idx} href={stat.href} className="group">
              <Card className="bg-card/20 border-border/30 rounded-2xl hover:border-primary/20 hover:bg-card/40 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <span className="text-xs font-semibold text-muted-foreground">{stat.name}</span>
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {stat.value}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{stat.desc}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Guide Card */}
      <Card className="bg-card/10 border-border/30 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          Panduan Administrator
        </h3>
        <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed list-decimal list-inside">
          <li>
            <strong className="text-foreground">Langkah 1 (Subjek):</strong> Daftarkan mata kuliah baru terlebih dahulu di halaman <Link href="/admin/subjects" className="text-primary hover:underline font-medium">Kelola Subjek</Link>.
          </li>
          <li>
            <strong className="text-foreground">Langkah 2 (Pertemuan):</strong> Masuk ke halaman <Link href="/admin/meetings" className="text-primary hover:underline font-medium">Kelola Pertemuan</Link> untuk menambahkan daftar pertemuan (misalnya Sesi 1, Sesi 2) ke mata kuliah terkait.
          </li>
          <li>
            <strong className="text-foreground">Langkah 3 (Materi):</strong> Unggah berkas ke Google Drive, setel izin akses menjadi <strong className="text-foreground">"Siapa saja yang memiliki link dapat melihat"</strong>, salin tautannya, lalu masukkan ke menu <Link href="/admin/materials" className="text-primary hover:underline font-medium">Kelola Materi</Link>.
          </li>
        </ul>
      </Card>
    </div>
  )
}
