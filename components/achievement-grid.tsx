import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, ShieldCheck, FlaskConical, Radio, Orbit, Cpu } from 'lucide-react'

const achievements = [
  {
    title: 'HydroShield Pioneer',
    description: 'Achieve 90% radiation mitigation using hydrogel and regolith composites in a Moon mission.',
    icon: ShieldCheck,
    tier: 'Legendary',
  },
  {
    title: 'Mars Atmos Pioneer',
    description: 'Balance oxygen, CO2, and humidity for a 6-person crew on Mars for 180 days.',
    icon: Radio,
    tier: 'Elite',
  },
  {
    title: 'Transit Resilience',
    description: 'Maintain structural stress below 50% limit during spin-gravity transit simulations.',
    icon: Orbit,
    tier: 'Elite',
  },
  {
    title: 'Lab Synthesis',
    description: 'Integrate greenhouse, wet lab, and fabrication modules with positive resource margins.',
    icon: FlaskConical,
    tier: 'Advanced',
  },
  {
    title: 'Mission Planner',
    description: 'Export three PDF mission briefs with crew manifest and viability charts.',
    icon: Trophy,
    tier: 'Advanced',
  },
  {
    title: 'AI Copilot',
    description: 'Use the layout assistant to resolve three telemetry alerts automatically.',
    icon: Cpu,
    tier: 'Prototype',
  },
]

export function AchievementGrid() {
  return (
    <div className='min-h-screen bg-background pt-16'>
      <div className='container mx-auto px-4 py-16'>
        <div className='mx-auto max-w-5xl space-y-12'>
          <header className='text-center'>
            <h1 className='font-orbitron text-4xl font-bold'>Mission Achievements</h1>
            <p className='mt-4 text-lg text-muted-foreground'>
              Earn recognition for mastering habitat design, life support engineering, and mission-readiness workflows.
            </p>
          </header>

          <section className='grid gap-6 md:grid-cols-2'>
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <Card
                  key={achievement.title}
                  className='border-border/50 bg-card/60 p-6 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/80'
                >
                  <div className='mb-5 flex items-center gap-3'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
                      <Icon className='h-6 w-6' />
                    </div>
                    <div>
                      <h2 className='font-orbitron text-xl font-semibold'>{achievement.title}</h2>
                      <Badge className='bg-primary/20 text-primary'>{achievement.tier}</Badge>
                    </div>
                  </div>
                  <p className='text-sm text-muted-foreground'>{achievement.description}</p>
                </Card>
              )
            })}
          </section>
        </div>
      </div>
    </div>
  )
}
