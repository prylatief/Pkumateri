'use client'

import { useState, useEffect } from 'react'
import { getMeetings, createMeeting, updateMeeting, deleteMeeting } from '@/actions/meeting.actions'
import { getSubjects } from '@/actions/subject.actions'
import { Meeting } from '@/types/meeting'
import { Subject } from '@/types/subject'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Layers, Plus, Pencil, Trash, Loader2, AlertCircle } from 'lucide-react'

export default function ManageMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Form modal state
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [subjectId, setSubjectId] = useState('')
  const [title, setTitle] = useState('')
  const [meetingNumber, setMeetingNumber] = useState(1)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    const [meetingsData, subjectsData] = await Promise.all([
      getMeetings(),
      getSubjects()
    ])
    setMeetings(meetingsData)
    setSubjects(subjectsData)
    if (subjectsData.length > 0) {
      setSubjectId(subjectsData[0].id)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleOpenAdd = () => {
    setEditingId(null)
    setTitle('')
    setMeetingNumber(meetings.length + 1)
    if (subjects.length > 0 && !subjectId) {
      setSubjectId(subjects[0].id)
    }
    setError(null)
    setIsOpen(true)
  }

  const handleOpenEdit = (meeting: Meeting) => {
    setEditingId(meeting.id)
    setSubjectId(meeting.subject_id)
    setTitle(meeting.title)
    setMeetingNumber(meeting.meeting_number)
    setError(null)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subjectId || !title || !meetingNumber) return

    setError(null)
    setSubmitLoading(true)
    try {
      if (editingId) {
        await updateMeeting(editingId, subjectId, title, Number(meetingNumber))
      } else {
        await createMeeting(subjectId, title, Number(meetingNumber))
      }
      setIsOpen(false)
      fetchData()
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan pertemuan.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pertemuan ini? Seluruh materi di dalamnya akan ikut terhapus.')) {
      try {
        await deleteMeeting(id)
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
            <Layers className="h-6 w-6 text-primary" />
            Kelola Pertemuan
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Atur daftar pertemuan terjadwal untuk setiap mata kuliah program PKU MUI 19.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-xl font-semibold flex items-center gap-1.5 shadow-lg shadow-primary/10 shrink-0">
          <Plus className="h-4 w-4" />
          Tambah Sesi
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">Memuat data...</span>
        </div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/40 rounded-3xl bg-card/5">
          <Layers className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-3.5 text-sm font-semibold text-foreground">Pertemuan kosong</h3>
          <p className="mt-1 text-xs text-muted-foreground">Mulai dengan menambahkan pertemuan pertama.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/30 overflow-hidden bg-card/10 backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b border-border/30">
                <TableHead className="w-[120px] text-xs font-bold text-muted-foreground uppercase tracking-wider">Pertemuan Ke</TableHead>
                <TableHead className="w-[200px] text-xs font-bold text-muted-foreground uppercase tracking-wider">Mata Kuliah</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Topik/Judul Pertemuan</TableHead>
                <TableHead className="w-[120px] text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting) => (
                <TableRow key={meeting.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                  <TableCell className="font-bold text-foreground text-sm">
                    <span className="inline-flex items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 px-2.5 py-1 text-xs font-bold">
                      Sesi {meeting.meeting_number}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-muted-foreground">
                    {meeting.subjects?.name || '-'}
                  </TableCell>
                  <TableCell className="text-sm font-bold text-foreground leading-snug">
                    {meeting.title}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button onClick={() => handleOpenEdit(meeting)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button onClick={() => handleDelete(meeting.id)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
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
              {editingId ? 'Edit Sesi Pertemuan' : 'Tambah Sesi Pertemuan'}
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
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="meeting-subject">
                Mata Kuliah
              </label>
              <select
                id="meeting-subject"
                required
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full bg-card/40 border border-border/60 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary text-sm h-10 px-3 text-foreground outline-none"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id} className="bg-card text-foreground">
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="meeting-number">
                Pertemuan Ke (Angka Sesi)
              </label>
              <Input
                id="meeting-number"
                type="number"
                required
                min={1}
                value={meetingNumber}
                onChange={(e) => setMeetingNumber(Number(e.target.value))}
                className="bg-card/40 border-border/60 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-sm h-10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="meeting-title">
                Topik / Judul Pertemuan
              </label>
              <Input
                id="meeting-title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Konsep Dasar Fikih Modern"
                className="bg-card/40 border-border/60 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-sm h-10"
              />
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
