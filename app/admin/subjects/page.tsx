'use client'

import { useState, useEffect } from 'react'
import { getSubjects, createSubject, updateSubject, deleteSubject } from '@/actions/subject.actions'
import { Subject } from '@/types/subject'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { BookOpen, Plus, Pencil, Trash, Loader2, AlertCircle } from 'lucide-react'

export default function ManageSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Form modal state
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch subjects
  const fetchSubjects = async () => {
    setIsLoading(true)
    const data = await getSubjects()
    setSubjects(data)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  // Auto-slugify name
  const handleNameChange = (val: string) => {
    setName(val)
    if (!editingId) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
      )
    }
  }

  const handleOpenAdd = () => {
    setEditingId(null)
    setName('')
    setSlug('')
    setDescription('')
    setError(null)
    setIsOpen(true)
  }

  const handleOpenEdit = (subject: Subject) => {
    setEditingId(subject.id)
    setName(subject.name)
    setSlug(subject.slug)
    setDescription(subject.description || '')
    setError(null)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !slug) return
    
    setError(null)
    setSubmitLoading(true)
    try {
      if (editingId) {
        await updateSubject(editingId, name, slug, description)
      } else {
        await createSubject(name, slug, description)
      }
      setIsOpen(false)
      fetchSubjects()
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan mata kuliah.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus mata kuliah ini? Seluruh pertemuan dan materi di dalamnya akan ikut terhapus.')) {
      try {
        await deleteSubject(id)
        fetchSubjects()
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
            <BookOpen className="h-6 w-6 text-primary" />
            Kelola Mata Kuliah
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Tambah, perbarui, atau hapus mata kuliah program PKU MUI 19.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="rounded-xl font-semibold flex items-center gap-1.5 shadow-lg shadow-primary/10 shrink-0">
          <Plus className="h-4 w-4" />
          Tambah Kuliah
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">Memuat data...</span>
        </div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/40 rounded-3xl bg-card/5">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-3.5 text-sm font-semibold text-foreground">Mata kuliah kosong</h3>
          <p className="mt-1 text-xs text-muted-foreground">Mulai dengan menambahkan mata kuliah pertama.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/30 overflow-hidden bg-card/10 backdrop-blur-sm">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b border-border/30">
                <TableHead className="w-[200px] text-xs font-bold text-muted-foreground uppercase tracking-wider">Nama Kuliah</TableHead>
                <TableHead className="w-[150px] text-xs font-bold text-muted-foreground uppercase tracking-wider">Slug</TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Deskripsi</TableHead>
                <TableHead className="w-[120px] text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id} className="border-b border-border/20 hover:bg-muted/10 transition-colors">
                  <TableCell className="font-bold text-foreground text-sm leading-snug">{subject.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{subject.slug}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate leading-normal">
                    {subject.description || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button onClick={() => handleOpenEdit(subject)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button onClick={() => handleDelete(subject.id)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
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
              {editingId ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}
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
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="subject-name">
                Nama Mata Kuliah
              </label>
              <Input
                id="subject-name"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Fikih Kontemporer"
                className="bg-card/40 border-border/60 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-sm h-10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="subject-slug">
                Slug (URL Friendly)
              </label>
              <Input
                id="subject-slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="fikih-kontemporer"
                className="bg-card/40 border-border/60 rounded-xl focus-visible:ring-primary focus-visible:border-primary font-mono text-sm h-10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground" htmlFor="subject-desc">
                Deskripsi
              </label>
              <Input
                id="subject-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Membahas dinamika fikih fatwa modern..."
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
