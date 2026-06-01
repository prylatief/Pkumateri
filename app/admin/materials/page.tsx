'use client'

import { useState, useEffect } from 'react'
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '@/actions/material.actions'
import { getMeetings } from '@/actions/meeting.actions'
import { Material } from '@/types/material'
import { Meeting } from '@/types/meeting'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { FileText, Plus, Pencil, Trash, Loader2, AlertCircle, Link2, Eye } from 'lucide-react'
import Link from 'next/link'

export default function ManageMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Form modal state
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [meetingId, setMeetingId] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [driveUrl, setDriveUrl] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    const [materialsData, meetingsData] = await Promise.all([
      getMaterials(),
      getMeetings()
    ])
    setMaterials(materialsData)
    setMeetings(meetingsData)
    if (meetingsData.length > 0) {
      setMeetingId(meetingsData[0].id)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenAdd = () => {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setDriveUrl('')
    if (meetings.length > 0 && !meetingId) {
      setMeetingId(meetings[0].id)
    }
    setError(null)
    setIsOpen(true)
  }

  const handleOpenEdit = (material: Material) => {
    setEditingId(material.id)
    setMeetingId(material.meeting_id)
    setTitle(material.title)
    setDescription(material.description || '')
    setDriveUrl(material.drive_url)
    setError(null)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!meetingId || !title || !driveUrl) return

    // Simple Google Drive URL validation
    if (!driveUrl.includes('drive.google.com')) {
      setError('Masukkan tautan berbagi Google Drive yang valid.')
      return
    }

    setError(null)
    setSubmitLoading(true)
    try {
      if (editingId) {
        await updateMaterial(editingId, meetingId, title, description, driveUrl)
      } else {
        await createMaterial(meetingId, title, description, driveUrl)
      }
      setIsOpen(false)
      fetchData()
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan materi.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus materi ini? Berkas asli di Google Drive tidak akan terpengaruh.')) {
      try {
        await deleteMaterial(id)
        fetchData()
      } catch (err: any) {
        alert(err.message || 'Gagal menghapus.')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-primary" />
            Kelola Materi Kuliah
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Unggah dan hubungkan tautan berkas materi Google Drive ke pertemuan terkait.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-xl font-semibold flex items-center gap-1.5 shadow-lg shadow-primary/10 shrink-0">
          <Plus className="h-4 w-4" />
          Tambah Materi
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">Memuat data...</span>
        </div>
      ) : materials.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/40 rounded-3xl bg-card/5">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-3.5 text-sm font-semibold text-foreground">Materi kosong</h3>
          <p className="mt-1 text-xs text-muted-foreground">Mulai dengan menambahkan materi pertama.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/30 overflow-hidden bg-card/10 backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b border-border/30">
                <TableHead className="w-[80px] text-xs font-bold text-muted-foreground uppercase tracking-wider">Tipe</TableHead>
                <TableHead className="w-[180px] text-xs font-bold text-muted-foreground uppercase tracking-wider">Judul Materi</TableHead>
                <TableHead className="w-[180px] text-xs font-bold text-muted-foreground uppercase tracking-wider">Sesi Pertemuan</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Link Drive</TableHead>
                <TableHead className="w-[150px] text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                  <TableCell className="text-center">
                    <span className="inline-flex items-center rounded-lg bg-emerald-500/10 text-primary ring-1 ring-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                      {material.file_type}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-foreground text-sm leading-snug">
                    {material.title}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-semibold leading-normal">
                    {material.meetings?.subjects?.name || '-'}
                    <span className="block text-[10px] font-medium text-primary/80 mt-0.5">
                      Pertemuan {material.meetings?.meeting_number || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground max-w-xs truncate">
                    <a href={material.drive_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Link2 className="h-3 w-3 shrink-0" />
                      Google Drive Link
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/preview/${material.id}`} target="_blank" title="Preview Halaman">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button onClick={() => handleOpenEdit(material)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button onClick={() => handleDelete(material.id)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* CRUD Dialog Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-card border border-border/40 max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {editingId ? 'Edit File Materi' : 'Tambah File Materi'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="material-meeting">
                Sesi Pertemuan Kuliah
              </label>
              <select
                id="material-meeting"
                required
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                className="w-full bg-card/40 border border-border/60 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary text-sm h-10 px-3 text-foreground outline-none"
              >
                {meetings.map((meet) => (
                  <option key={meet.id} value={meet.id} className="bg-card text-foreground">
                    {meet.subjects?.name} — Sesi {meet.meeting_number} ({meet.title})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="material-title">
                Judul Materi
              </label>
              <Input
                id="material-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Modul Fikih Sesi 1"
                className="bg-card/40 border-border/60 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-sm h-10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="material-desc">
                Deskripsi Singkat (Opsional)
              </label>
              <Input
                id="material-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Berisi rangkuman hukum islam modern..."
                className="bg-card/40 border-border/60 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-sm h-10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="material-url">
                Link Sharing Google Drive
              </label>
              <Input
                id="material-url"
                required
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                className="bg-card/40 border-border/60 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-sm h-10"
              />
              <span className="text-[10px] text-muted-foreground leading-snug block mt-1">
                ⚠️ Pastikan berkas Drive sudah di-set publik (Anyone with the link can view) agar siswa dapat membukanya.
              </span>
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl font-semibold">
                Batal
              </Button>
              <Button type="submit" disabled={submitLoading} className="rounded-xl font-semibold">
                {submitLoading ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
