import Link from 'next/link'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/design', label: 'Start Designing' },
  { href: '/about', label: 'About' },
  { href: '/achievements', label: 'Achievements' },
  { href: '/resources', label: 'Resources' },
  { href: '/community', label: 'Community' },
  { href: '/team', label: 'Team' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  return (
    <header className='fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <Link href='/' className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20'>
            <span className='font-orbitron text-lg font-bold text-primary'>B</span>
          </div>
          <span className='font-orbitron text-xl font-bold tracking-tight'>
            BiO<sub className='text-sm'>2</sub>
          </span>
        </Link>

        <nav className='hidden items-center gap-6 lg:flex'>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className='hidden items-center gap-3 lg:flex'>
          <Button variant='ghost' size='sm' className='text-muted-foreground hover:text-foreground'>
            Sign In
          </Button>
          <Button size='sm' className='bg-primary text-primary-foreground hover:bg-primary/90' asChild>
            <Link href='/dashboard'>Launch Workspace</Link>
          </Button>
        </div>

        <div className='flex lg:hidden'>
          <Button size='icon' variant='ghost' asChild>
            <Link href='/design'>
              <span className='sr-only'>Open designer</span>
              ☰
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
