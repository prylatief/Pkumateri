'use client'

import { Material } from '@/types/material'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Eye, Download, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { getDriveDownloadUrl } from '@/lib/drive'

interface MaterialListProps {
  materials: Material[]
}

export default function MaterialList({ materials }: MaterialListProps) {
  if (materials.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border/40 rounded-2xl bg-card/10">
        <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-sm font-semibold text-foreground">Belum ada materi</h3>
        <p className="mt-1.5 text-xs text-muted-foreground">Materi untuk pertemuan ini belum diunggah oleh admin.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
      {materials.map((material) => {
        const downloadUrl = getDriveDownloadUrl(material.drive_url)
        const title = material.title

        // 💡 Dynamic Categorization based on Title keywords (using regex for strict matching)
        let theme = {
          badge: 'Materi Kuliah',
          iconColor: 'text-primary bg-primary/10 ring-primary/20',
          badgeColor: 'bg-primary/5 text-primary ring-primary/10',
          hoverBorder: 'hover:border-primary/40',
        }

        if (/\buts\b/i.test(title) || /tengah/i.test(title)) {
          theme = {
            badge: '📝 UTS (Ujian Tengah)',
            iconColor: 'text-amber-600 bg-amber-500/10 ring-amber-500/20',
            badgeColor: 'bg-amber-500/5 text-amber-600 ring-amber-500/10',
            hoverBorder: 'hover:border-amber-400/50 hover:shadow-amber-500/5',
          }
        } else if (/\buas\b/i.test(title) || /akhir/i.test(title)) {
          theme = {
            badge: '🎓 UAS (Ujian Akhir)',
            iconColor: 'text-rose-600 bg-rose-500/10 ring-rose-500/20',
            badgeColor: 'bg-rose-500/5 text-rose-600 ring-rose-500/10',
            hoverBorder: 'hover:border-rose-400/50 hover:shadow-rose-500/5',
          }
        } else if (/tugas/i.test(title) || /\bpr\b/i.test(title) || /assignment/i.test(title)) {
          theme = {
            badge: '📌 Tugas Kuliah',
            iconColor: 'text-indigo-600 bg-indigo-500/10 ring-indigo-500/20',
            badgeColor: 'bg-indigo-500/5 text-indigo-600 ring-indigo-500/10',
            hoverBorder: 'hover:border-indigo-400/50 hover:shadow-indigo-500/5',
          }
        }

        return (
          <Card key={material.id} className={`bg-white/80 border border-neutral-200/50 rounded-2xl ${theme.hoverBorder} hover:bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden`}>
            <CardHeader className="p-5 flex-grow">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 group-hover:scale-105 transition-transform ${theme.iconColor}`}>
                  <FileText className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${theme.badgeColor}`}>
                    {theme.badge}
                  </span>
                  <CardTitle className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {material.title}
                  </CardTitle>
                  {material.description && (
                    <CardDescription className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed">
                      {material.description}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <div className="flex items-center gap-2 p-5 pt-0 border-t border-neutral-100/50 bg-neutral-50/50 group-hover:bg-neutral-50 transition-colors">
              <Link href={`/preview/${material.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1.5 rounded-xl border-border/60 hover:bg-primary/10 hover:text-primary hover:border-primary/20 font-bold text-xs h-9">
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </Button>
              </Link>
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1.5 rounded-xl border-border/60 hover:bg-primary/10 hover:text-primary hover:border-primary/20 font-bold text-xs h-9">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </a>
              <a href={material.drive_url} target="_blank" rel="noopener noreferrer" title="Buka di Google Drive">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted shrink-0">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
