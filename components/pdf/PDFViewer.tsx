'use client'

import { useState } from 'react'
import { Material } from '@/types/material'
import { Button } from '@/components/ui/button'
import { getDrivePreviewUrl, getDriveDownloadUrl } from '@/lib/drive'
import { FileText, Download, ExternalLink, Calendar, ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface PDFViewerProps {
  material: Material
}

export default function PDFViewer({ material }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const previewUrl = getDrivePreviewUrl(material.drive_url)
  const downloadUrl = getDriveDownloadUrl(material.drive_url)

  const formattedDate = new Date(material.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Get subject and meeting titles
  const subjectName = material.meetings?.subjects?.name || 'Mata Kuliah'
  const meetingTitle = material.meetings?.title || 'Pertemuan'
  const subjectSlug = material.meetings?.subjects?.slug
  const meetingId = material.meeting_id

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-12rem)]">
      {/* Sidebar Info - left side */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col justify-between gap-6 bg-card/20 border border-border/30 rounded-2xl p-6 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Back button */}
          {subjectSlug && meetingId ? (
            <Link href={`/subjects/${subjectSlug}`}>
              <Button variant="ghost" size="sm" className="pl-1 text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kembali ke Subject
              </Button>
            </Link>
          ) : (
            <Link href="/subjects">
              <Button variant="ghost" size="sm" className="pl-1 text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kembali ke Mata Kuliah
              </Button>
            </Link>
          )}

          <div className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded ring-1 ring-primary/10">
                PDF Document
              </span>
              <h1 className="text-xl font-bold text-foreground mt-2 leading-snug">
                {material.title}
              </h1>
            </div>
          </div>

          <hr className="border-border/30" />

          {/* Details list */}
          <div className="space-y-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium block">Mata Kuliah</span>
              <span className="font-semibold text-foreground">{subjectName}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium block">Pertemuan</span>
              <span className="font-semibold text-foreground">{meetingTitle}</span>
            </div>
            {material.description && (
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground font-medium block">Deskripsi</span>
                <p className="text-xs text-muted-foreground/90 leading-relaxed">{material.description}</p>
              </div>
            )}
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Diunggah Pada
              </span>
              <span className="text-xs font-semibold text-foreground">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col gap-2 pt-4 border-t border-border/30">
          <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
            <Button className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold shadow-lg shadow-primary/10">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </a>
          <a href={material.drive_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 rounded-xl border-border/60 font-semibold">
              <ExternalLink className="h-4 w-4" />
              Buka di Google Drive
            </Button>
          </a>
        </div>
      </div>

      {/* Main View Area - right side */}
      <div className="flex-1 bg-card/10 border border-border/30 rounded-2xl overflow-hidden relative min-h-[500px] lg:min-h-0 flex flex-col">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-10 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground font-medium">Memuat PDF Viewer dari Google Drive...</span>
          </div>
        )}
        <iframe
          src={previewUrl}
          className="w-full h-full flex-grow border-0 min-h-[600px]"
          allow="autoplay"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </div>
  )
}
