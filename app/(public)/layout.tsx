import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import SlidingBackground from '@/components/layout/SlidingBackground'
import { getCurrentUser } from '@/actions/auth.actions'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// Helper function to scan public directory on the server
async function getBackgroundImages(): Promise<string[]> {
  try {
    const publicDir = path.join(process.cwd(), 'public')
    const files = await fs.promises.readdir(publicDir)
    
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp']
    const bgImages = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase()
        const isImage = imageExtensions.includes(ext)
        const startsWithBg = file.toLowerCase().startsWith('bg')
        return isImage && startsWithBg
      })
      .map((file) => `/${file}`)
      .sort() // Sort alphabetically to maintain consistent order

    return bgImages.length > 0 ? bgImages : ['/bg1.jpg', '/bg2.jpg', '/bg3.jpg']
  } catch (err) {
    console.error('Error reading public background images:', err)
    return ['/bg1.jpg', '/bg2.jpg', '/bg3.jpg']
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  const bgImages = await getBackgroundImages()

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-foreground relative">
      <SlidingBackground images={bgImages} />
      <Navbar user={user} />
      <main className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}
