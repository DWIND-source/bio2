import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileDown, GraduationCap, BookOpen, Share2 } from 'lucide-react'

const curriculum = [
  {
    title: 'Educator Kit: Hydrogel Life Support',
    summary: 'Lesson plans and lab activities for modelling algae-based oxygen generation.',
    format: 'PDF',
    href: '/Documents/1.pdf',
  },
  {
    title: 'Systems Engineering Workbook',
    summary: 'Step-by-step worksheets for students to balance oxygen, water, and power budgets.',
    format: 'PDF',
    href: '/Documents/2.pdf',
  },
  {
    title: 'Mission Brief Template',
    summary: 'Customisable report outline for Moon, Mars, and transit scenarios.',
    format: 'PDF',
    href: '/Documents/3.pdf',
  },
]

export function ResourceLibrary() {
  return (
    <div className='min-h-screen bg-background pt-16'>
      <div className='container mx-auto px-4 py-16'>
        <div className='mx-auto max-w-5xl space-y-10'>
          <header className='text-center'>
            <h1 className='font-orbitron text-4xl font-bold'>Resources and Learning Hub</h1>
            <p className='mt-4 text-lg text-muted-foreground'>
              Download mission briefs, educator kits, and research links to bring the BiO2 Habitat Tool into classrooms and labs.
            </p>
          </header>

          <section className='grid gap-6 md:grid-cols-3'>
            {curriculum.map((item) => (
              <Card key={item.title} className='flex flex-col justify-between border-border/50 bg-card/50 p-6 backdrop-blur'>
                <div>
                  <BookOpen className='mb-4 h-8 w-8 text-primary' />
                  <h2 className='mb-2 font-orbitron text-xl font-semibold'>{item.title}</h2>
                  <p className='text-sm text-muted-foreground'>{item.summary}</p>
                </div>
                <Button asChild variant='outline' className='mt-6 w-full border-primary/30 text-primary hover:bg-primary/10'>
                  <a href={item.href} download>
                    <FileDown className='mr-2 h-4 w-4' />
                    Download {item.format}
                  </a>
                </Button>
              </Card>
            ))}
          </section>

          <section className='grid gap-6 md:grid-cols-2'>

          </section>
        </div>
      </div>
    </div>
  )
}
