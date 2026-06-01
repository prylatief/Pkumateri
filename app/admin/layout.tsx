import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getCurrentUser } from '@/actions/auth.actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Layers, FileText, LayoutDashboard, Shield } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // If user is not authenticated, render children directly (e.g. the Login Page)
  // to avoid infinite redirect loops. Middleware protects actual dashboard routes.
  if (!user) {
    return <>{children}</>
  }

  const sidebarLinks = [
    { name: 'Ringkasan', href: '/admin', icon: LayoutDashboard },
    { name: 'Kelola Subjek', href: '/admin/subjects', icon: BookOpen },
    { name: 'Kelola Pertemuan', href: '/admin/meetings', icon: Layers },
    { name: 'Kelola Materi', href: '/admin/materials', icon: FileText },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar user={user} />
      
      <div className="flex-grow container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex flex-col md:flex-row gap-8">
        {/* Admin Sidebar Navigation */}
        <aside className="w-full md:w-60 shrink-0">
          <div className="rounded-2xl border border-border/30 bg-card/20 p-5 space-y-5 backdrop-blur-sm sticky top-24">
            <div className="flex items-center gap-2 px-1">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold text-sm text-foreground tracking-wide uppercase">CMS Dashboard</span>
            </div>
            
            <hr className="border-border/20" />

            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {sidebarLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all shrink-0 whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    {link.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Dashboard Main Panel */}
        <main className="flex-grow bg-card/10 border border-border/30 rounded-3xl p-6 md:p-8 backdrop-blur-sm min-h-[500px]">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  )
}
