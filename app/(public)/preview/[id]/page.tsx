import { getMaterialById } from '@/actions/material.actions'
import PDFViewer from '@/components/pdf/PDFViewer'
import { notFound } from 'next/navigation'

interface PreviewPageProps {
  params: Promise<{ id: string }>
}

export const revalidate = 60

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = await params
  const material = await getMaterialById(id)

  if (!material) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <PDFViewer material={material} />
    </div>
  )
}
