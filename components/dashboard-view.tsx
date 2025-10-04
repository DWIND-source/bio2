'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Rocket, Star, UploadCloud, User, BarChart3, ExternalLink } from 'lucide-react'
import type { HabitatDesign } from '@/types/habitat'
import { computeHabitatMetrics } from '@/lib/calculations'

export function DashboardView() {
  const [projects, setProjects] = useState<HabitatDesign[]>([])
  const [username, setUsername] = useState('Explorer')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('bio2.projects')
    const storedName = window.localStorage.getItem('bio2.username')
    if (stored) {
      try {
        const parsed: HabitatDesign[] = JSON.parse(stored)
        const normalised = parsed.map((project) => ({
          ...project,
          modules: project.modules.map((module) => ({
            ...module,
            baseMetrics: module.baseMetrics ?? module.metrics,
            baseSize: module.baseSize ?? module.size,
          })),
        }))
        setProjects(normalised)
      } catch (error) {
        console.error('Failed to parse stored projects', error)
      }
    }
    if (storedName) {
      setUsername(storedName)
    }
  }, [])

  const highlightedProject = useMemo(() => projects[0] ?? null, [projects])
  const highlightedMetrics = useMemo(
    () => (highlightedProject ? computeHabitatMetrics(highlightedProject.modules, highlightedProject.mission) : null),
    [highlightedProject],
  )

  return (
    <div className='min-h-screen bg-background pt-16'>
      <div className='container mx-auto grid gap-10 px-4 py-16 lg:grid-cols-[280px_1fr]'>
        <aside className='flex flex-col gap-6'>
          <Card className='border-border/50 bg-card/60 p-6 backdrop-blur'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <User className='h-6 w-6' />
              </div>
              <div>
                <p className='text-xs uppercase tracking-widest text-muted-foreground'>Mission Specialist</p>
                <p className='font-orbitron text-lg font-semibold'>{username}</p>
              </div>
            </div>
            <div className='space-y-3 text-sm text-muted-foreground'>
              <p>Projects saved: {projects.length}</p>
              <p>Badges earned: 4</p>
              <p>Member since: 2042</p>
            </div>
            <div className='mt-6 space-y-2'>
              <Button className='w-full bg-primary text-primary-foreground hover:bg-primary/90' asChild>
                <Link href='/design'>Start a New Habitat Design</Link>
              </Button>
              <Button variant='outline' className='w-full border-primary/30 text-primary hover:bg-primary/10' asChild>
                <Link href='/results'>View Latest Results</Link>
              </Button>
            </div>
          </Card>

          <Card className='border-border/50 bg-card/60 p-6 backdrop-blur'>
            <h2 className='mb-4 font-orbitron text-sm font-semibold uppercase tracking-wide text-primary'>Badges</h2>
            <div className='flex flex-wrap gap-2'>
              <Badge className='bg-primary/20 text-primary'>Hydrogel Pioneer</Badge>
              <Badge className='bg-accent/20 text-accent'>Radiation Guardian</Badge>
              <Badge className='bg-chart-5/20 text-chart-5'>Thermal Tuner</Badge>
              <Badge className='bg-destructive/20 text-destructive'>Resilience Architect</Badge>
            </div>
          </Card>
        </aside>

        <main className='space-y-8'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div>
              <h1 className='font-orbitron text-3xl font-bold text-foreground'>Mission Dashboard</h1>
              <p className='text-muted-foreground'>Review saved designs, track viability, and explore community creations.</p>
            </div>
            <div className='flex gap-3'>
              <Button variant='outline' className='border-primary/30 bg-primary/10 text-primary hover:bg-primary/15' asChild>
                <Link href='/community'>Explore Community Designs</Link>
              </Button>
              <Button className='bg-primary text-primary-foreground hover:bg-primary/90' asChild>
                <Link href='/design'>Start Designing</Link>
              </Button>
            </div>
          </div>

          {highlightedProject && highlightedMetrics && (
            <Card className='border-border/50 bg-card/60 p-6 backdrop-blur'>
              <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
                <div>
                  <h2 className='font-orbitron text-xl font-semibold text-foreground'>{highlightedProject.name}</h2>
                  <p className='text-sm text-muted-foreground'>
                    {highlightedProject.mission.destination.toUpperCase()} - Crew {highlightedProject.mission.crewSize} - {highlightedProject.mission.duration} days
                  </p>
                </div>
                <div className='flex items-center gap-6'>
                  <div className='text-right'>
                    <p className='text-xs uppercase tracking-widest text-muted-foreground'>Viability</p>
                    <p className='font-orbitron text-2xl font-bold text-primary'>
                      {highlightedMetrics.viabilityScore.toFixed(0)}%
                    </p>
                  </div>
                  <Progress value={highlightedMetrics.viabilityScore} className='h-2 w-48' />
                </div>
              </div>

              <div className='mt-6 grid gap-3 md:grid-cols-3'>
                <DashboardMetric icon={BarChart3} label='Oxygen Net' value={`${highlightedMetrics.netOxygen.toFixed(2)} L/min`} positive={highlightedMetrics.netOxygen >= 0} />
                <DashboardMetric icon={Star} label='Shielding' value={`${highlightedMetrics.shieldingScore.toFixed(0)}%`} positive={highlightedMetrics.shieldingScore >= highlightedMetrics.radiationRequirement} />
                <DashboardMetric icon={UploadCloud} label='Volume per Crew' value={`${highlightedMetrics.volumePerCrew.toFixed(1)} m^3`} positive={highlightedMetrics.volumePerCrew >= highlightedMetrics.recommendedVolumePerCrew} />
              </div>
            </Card>
          )}

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h2 className='font-orbitron text-2xl font-bold text-foreground'>Saved Projects</h2>
              <Button variant='ghost' className='gap-2 text-sm text-muted-foreground hover:text-foreground' asChild>
                <Link href='/design?tab=imports'>
                  <UploadCloud className='h-4 w-4' />
                  Import JSON
                </Link>
              </Button>
            </div>

            {projects.length === 0 ? (
              <Card className='flex h-60 flex-col items-center justify-center gap-3 border-dashed border-primary/30 bg-card/40 text-center text-muted-foreground'>
                <Rocket className='h-10 w-10 text-primary' />
                <p className='font-medium text-foreground'>No saved habitats yet</p>
                <p className='max-w-sm text-sm'>Launch the designer to start crafting modular habitats for Moon, Mars, or transit missions.</p>
                <Button className='bg-primary text-primary-foreground hover:bg-primary/90' asChild>
                  <Link href='/design'>Start Designing</Link>
                </Button>
              </Card>
            ) : (
              <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
                {projects.map((project) => {
                  const projectMetrics = computeHabitatMetrics(project.modules, project.mission)
                  const viability = (project.viability ?? projectMetrics.viabilityScore).toFixed(0)
                  return (
                    <Card
                      key={project.id}
                      className='group overflow-hidden border-border/50 bg-card/60 backdrop-blur transition-all hover:border-primary/30 hover:bg-card/80'
                    >
                      <div className='relative aspect-[4/3] bg-secondary/30'>
                        <img
                          src={project.thumbnail || '/habitat-thumbnail-fallback.png'}
                          alt={`${project.name} layout preview`}
                          className='h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100'
                        />
                        <Badge className='absolute left-3 top-3 bg-primary/80 text-primary-foreground'>
                          {project.mission.destination.toUpperCase()}
                        </Badge>
                      </div>
                      <div className='space-y-3 p-4'>
                        <div>
                          <h3 className='font-orbitron text-lg font-semibold text-foreground'>{project.name}</h3>
                          <p className='text-xs uppercase tracking-widest text-muted-foreground'>Crew {project.mission.crewSize}</p>
                        </div>
                        <div className='flex items-center justify-between text-xs text-muted-foreground'>
                          <span>Viability</span>
                          <span className='font-semibold text-primary'>{viability}%</span>
                        </div>
                        <div className='grid grid-cols-2 gap-2 text-[11px] text-muted-foreground'>
                          <span>Oxygen {projectMetrics.netOxygen.toFixed(1)} L/min</span>
                          <span>Shield {projectMetrics.shieldingScore.toFixed(0)}%</span>
                        </div>
                        <div className='flex gap-2'>
                          <Button size='sm' variant='outline' className='flex-1 bg-transparent text-xs' asChild>
                            <Link href={`/design?project=${project.id}`}>Open Design</Link>
                          </Button>
                          <Button size='sm' variant='outline' className='flex-1 bg-transparent text-xs' asChild>
                            <Link href={`/results?project=${project.id}`}>
                              <ExternalLink className='mr-1 h-3.5 w-3.5' /> Results
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          <Card className='border-border/50 bg-card/60 p-6 backdrop-blur'>
            <h2 className='mb-3 font-orbitron text-xl font-semibold text-foreground'>Community Highlights</h2>
            <p className='text-sm text-muted-foreground'>Visit the public gallery to remix featured designs and climb the mission leaderboard.</p>
            <div className='mt-4 flex flex-wrap gap-3'>
              <Badge className='bg-accent/20 text-accent'>Featured: HydroShield Nova</Badge>
              <Badge className='bg-primary/20 text-primary'>Top Remix Candidate</Badge>
              <Badge className='bg-chart-5/20 text-chart-5'>Mars Expedition Week</Badge>
            </div>
            <Button variant='outline' className='mt-6 border-primary/30 text-primary hover:bg-primary/10' asChild>
              <Link href='/community'>Browse Gallery</Link>
            </Button>
          </Card>
        </main>
      </div>
    </div>
  )
}

function DashboardMetric({
  icon: Icon,
  label,
  value,
  positive,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  positive?: boolean
}) {
  return (
    <div className='flex items-center gap-3 rounded-lg border border-border/40 bg-background/60 p-3 text-sm text-muted-foreground'>
      <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary'>
        <Icon className='h-4 w-4' />
      </div>
      <div>
        <p className='text-xs uppercase tracking-widest'>{label}</p>
        <p className={`font-mono ${positive ? 'text-primary' : 'text-foreground'}`}>{value}</p>
      </div>
    </div>
  )
}
