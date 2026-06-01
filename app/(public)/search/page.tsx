import { searchMaterials } from '@/actions/material.actions'
import MaterialList from '@/components/material/MaterialList'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, FileText } from 'lucide-react'
import Form from 'next/form'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export const dynamic = 'force-dynamic'

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q || ''
  const materials = await searchMaterials(query)

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header and Search Form */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl flex items-center gap-3">
            <Search className="h-8 w-8 text-primary" />
            Pencarian Materi
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Cari seluruh berkas materi, rangkuman, dan literatur PKU MUI 19 berdasarkan judul atau deskripsi materi.
          </p>
        </div>

        {/* Dynamic form utilizing Next.js Form component */}
        <Form action="/search" className="flex items-center gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Ketik kata kunci pencarian..."
              className="pl-11 h-12 bg-card/40 border-border/60 rounded-xl focus-visible:ring-primary focus-visible:border-primary text-base"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 rounded-xl font-semibold px-6 shadow-lg shadow-primary/10">
            Cari
          </Button>
        </Form>
      </div>

      <hr className="border-border/30" />

      {/* Results Section */}
      <div className="space-y-4">
        {query ? (
          <h2 className="text-sm font-semibold text-muted-foreground">
            Menampilkan hasil untuk: <span className="text-foreground">"{query}"</span> ({materials.length} ditemukan)
          </h2>
        ) : (
          <h2 className="text-sm font-semibold text-muted-foreground">
            Semua Materi Terbaru ({materials.length} file)
          </h2>
        )}

        {materials.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border/40 rounded-2xl bg-card/10">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-sm font-semibold text-foreground">Tidak menemukan berkas</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">Coba gunakan kata kunci pencarian lain.</p>
          </div>
        ) : (
          <MaterialList materials={materials} />
        )}
      </div>
    </div>
  )
}
