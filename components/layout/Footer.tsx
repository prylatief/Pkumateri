export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border/40 bg-background/50 py-6 md:py-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
            PKU
          </div>
          <span className="text-sm text-muted-foreground font-semibold tracking-wide">
            Portal Materi PKU MUI 19
          </span>
        </div>
        <p className="text-center text-xs leading-5 text-muted-foreground">
          &copy; {currentYear} Program Kader Ulama (PKU) MUI Angkatan 19. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
