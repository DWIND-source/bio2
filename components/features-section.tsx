import { Card } from '@/components/ui/card'
import { Leaf, Layout, Activity, Users, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: Leaf,
    title: 'BiO2 Modules',
    description:
      'Algae and hydrogel units that generate oxygen, recycle water, and deliver passive radiation shielding.',
    color: 'text-primary',
  },
  {
    icon: Layout,
    title: 'Habitat Layout Tool',
    description:
      'Drag-and-drop builder with snap-to-grid precision, 2D floor plans, and immersive 3D structure views.',
    color: 'text-accent',
  },
  {
    icon: Activity,
    title: 'Simulation Engine',
    description:
      'Live telemetry tracks oxygen balance, hydrogel health, crew comfort, thermal envelopes, and structural loads.',
    color: 'text-destructive',
  },
  {
    icon: Shield,
    title: 'Mission Viability',
    description:
      'Automated scoring highlights shielding effectiveness, resource margins, redundancy, and safety factors.',
    color: 'text-chart-4',
  },
  {
    icon: Users,
    title: 'Community Sharing',
    description:
      'Publish, remix, and collaborate on habitat concepts with the BiO2 community gallery and design badges.',
    color: 'text-primary',
  },
  {
    icon: Zap,
    title: '3D Printing Function',
    description:
      'Using locally available materials at the exploration site to print BiO2-based structures via a 3D printing robot.',
    color: 'text-chart-5',
  },
]

export function FeaturesSection() {
  return (
    <section className='relative py-24'>
      <div className='container mx-auto px-4'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 font-orbitron text-4xl font-bold tracking-tight md:text-5xl'>
            Everything You Need to Design Space Habitats
          </h2>
          <p className='mx-auto max-w-2xl text-lg text-muted-foreground text-balance'>
            Professional-grade tools for students, engineers, and explorers to imagine resilient Moon, Mars, and deep-space habitats.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className='group relative overflow-hidden border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/20 hover:bg-card/80'
              >
                <div className='absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10' />
                <div className='relative'>
                  <div className={`mb-4 inline-flex rounded-lg bg-secondary/50 p-3 ${feature.color}`}>
                    <Icon className='h-6 w-6' />
                  </div>
                  <h3 className='mb-2 font-orbitron text-xl font-semibold'>{feature.title}</h3>
                  <p className='text-sm leading-relaxed text-muted-foreground'>{feature.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
