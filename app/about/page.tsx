import { Card } from '@/components/ui/card'
import { Droplets, Shield, Leaf, Recycle } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-background pt-16'>
      <div className='container mx-auto px-4 py-16'>
        <div className='mx-auto max-w-4xl'>
          <h1 className='mb-6 font-orbitron text-4xl font-bold'>About the BiO2 Habitat Tool</h1>

          <div className='prose prose-invert max-w-none space-y-6'>
            <p className='text-lg text-muted-foreground'>
              The BiO2 Habitat Design Tool is an interactive environment for imagining, assembling, and validating space habitats that rely on hydrogel-based life support. Built alongside NASA's Artemis and Moon-to-Mars initiatives, the experience invites engineers, researchers, and students to craft resilient habitats for lunar surfaces, Martian plains, and deep space transits.
            </p>

            <div className='my-8 grid gap-6 md:grid-cols-2'>
              <Card className='border-border/50 bg-card/50 p-6'>
                <Droplets className='mb-4 h-8 w-8 text-primary' />
                <h3 className='mb-2 font-orbitron text-xl font-semibold'>Oxygen Generation</h3>
                <p className='text-sm text-muted-foreground'>
                  BiO2 hydrogel photobioreactors convert carbon dioxide into breathable oxygen, providing closed-loop life support for long-duration missions.
                </p>
              </Card>

              <Card className='border-border/50 bg-card/50 p-6'>
                <Shield className='mb-4 h-8 w-8 text-accent' />
                <h3 className='mb-2 font-orbitron text-xl font-semibold'>Radiation Shielding</h3>
                <p className='text-sm text-muted-foreground'>
                  The water-rich hydrogel matrix forms a lightweight radiation barrier, reducing crew exposure to galactic cosmic rays and solar particle events.
                </p>
              </Card>

              <Card className='border-border/50 bg-card/50 p-6'>
                <Leaf className='mb-4 h-8 w-8 text-primary' />
                <h3 className='mb-2 font-orbitron text-xl font-semibold'>Carbon Cycling</h3>
                <p className='text-sm text-muted-foreground'>
                  Integrated algae modules absorb CO2 from cabin air, stabilise atmospheric balance, and provide nutritional supplements when required.
                </p>
              </Card>

              <Card className='border-border/50 bg-card/50 p-6'>
                <Recycle className='mb-4 h-8 w-8 text-chart-5' />
                <h3 className='mb-2 font-orbitron text-xl font-semibold'>Closed-Loop Systems</h3>
                <p className='text-sm text-muted-foreground'>
                  Users can combine recycling, waste processing, and energy modules to model truly regenerative habitats that meet mission logistics.
                </p>
              </Card>
            </div>

            <h2 className='mb-4 font-orbitron text-2xl font-bold'>Mission Objectives</h2>
            <ul className='space-y-2 text-muted-foreground'>
              <li>- Rapidly prototype Moon, Mars, and transit habitat layouts.</li>
              <li>- Simulate oxygen, power, water, and structural performance in real time.</li>
              <li>- Validate crew comfort and safety against NASA mission standards.</li>
              <li>- Share concepts and gather feedback from the BiO2 community.</li>
              <li>- Inspire a new generation of systems thinkers for deep space living.</li>
            </ul>

            <div className='mt-8 rounded-lg border border-primary/20 bg-primary/5 p-6'>
              <h3 className='mb-2 font-orbitron text-xl font-semibold'>Technology Partnerships</h3>
              <p className='text-sm text-muted-foreground'>
                BiO2 research integrates findings from NASA, ESA, JAXA, and leading universities in regenerative life support. The HydroShield materials program and Artemis surface habitat studies inform the physics-based models that power each simulation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
