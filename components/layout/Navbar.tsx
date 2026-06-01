'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BookOpen, Search, LogOut, LayoutDashboard, User } from 'lucide-react'
import { signOut } from '@/actions/auth.actions'

interface NavbarProps {
  user?: any
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const navItems = [
    { name: 'Mata Kuliah', href: '/subjects', icon: BookOpen },
    { name: 'Cari Materi', href: '/search', icon: Search },
  ]

  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <span className="font-bold text-lg text-primary">PKU</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm leading-tight text-foreground tracking-wide">Portal Materi</span>
              <span className="text-[10px] leading-tight text-muted-foreground font-medium uppercase tracking-widest">PKU MUI 19</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {!isAdminRoute && (
            <nav className="hidden md:flex items-center gap-1.5 ml-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          )}
        </div>

        {/* Action Button Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {isAdminRoute ? (
                <Link href="/">
                  <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Portal Publik
                  </Button>
                </Link>
              ) : (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard Admin
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm font-medium text-muted-foreground max-w-[150px] truncate">
                <User className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate hidden sm:inline">{user.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-1.5">Keluar</span>
              </Button>
            </div>
          ) : (
            <Link href="/admin/login">
              <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-primary transition-colors">
                Admin Area
              </Button>
            </Link>
          )}

          {/* Simple Mobile Nav Toggle for pages */}
          {!isAdminRoute && (
            <div className="flex md:hidden items-center gap-1 border-l border-border/40 pl-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.name}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
