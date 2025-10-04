'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { computeHabitatMetrics } from '@/lib/calculations'
import type { HabitatDesign, MissionConfig } from '@/types/habitat'
import { Download, RefreshCw } from 'lucide-react'

const PIE_COLORS = ['#00ff85', '#4aa3ff', '#ff7847', '#a78bfa', '#fcd34d']

export function ResultsView() {
  const searchParams = useSearchParams()
  const [designs, setDesigns] = useState<HabitatDesign[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [comparisonId, setComparisonId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('bio2.projects')
    const active = window.localStorage.getItem('bio2.activeProject')
    const parsed: HabitatDesign[] = stored ? JSON.parse(stored) : []
    setDesigns(parsed.map((project) => ({
      ...project,
      modules: project.modules.map((module) => ({
        ...module,
        baseMetrics: module.baseMetrics ?? module.metrics,
        baseSize: module.baseSize ?? module.size,
      })),
    })))
    if (active) {
      try {
        const design: HabitatDesign = JSON.parse(active)
        setActiveId(design.id)
        if (!parsed.find((entry) => entry.id === design.id)) {
          setDesigns((prev) => [design, ...prev])
        }
      } catch (error) {
        console.error('Failed to parse active project', error)
      }
    } else if (parsed.length > 0) {
      setActiveId(parsed[0].id)
    }
  }, [])

  useEffect(() => {
    const projectParam = searchParams.get('project')
    if (!projectParam) return
    if (designs.some((design) => design.id === projectParam)) {
      setActiveId(projectParam)
    }
  }, [searchParams, designs])

  const activeDesign = designs.find((design) => design.id === activeId) ?? null
  const comparisonDesign = designs.find((design) => design.id === comparisonId) ?? null

  const activeMetrics = useMemo(
    () => (activeDesign ? computeHabitatMetrics(activeDesign.modules, activeDesign.mission) : null),
    [activeDesign],
  )
  const comparisonMetrics = useMemo(
    () => (comparisonDesign ? computeHabitatMetrics(comparisonDesign.modules, comparisonDesign.mission) : null),
    [comparisonDesign],
  )

  if (!activeDesign || !activeMetrics) {
    return (
      <div className='min-h-screen bg-background pt-16'>
        <div className='container mx-auto px-4 py-16 text-center text-muted-foreground'>
          <p className='text-lg'>No simulation data available yet.</p>
          <p className='mt-2 text-sm'>Save a design from the workspace to generate mission results.</p>
        </div>
      </div>
    )
  }

  const allocationData = buildSpaceAllocation(activeDesign)
  const atmosphereSeries = buildAtmosphereSeries(activeMetrics, activeDesign.mission.duration)
  const heatmapData = buildHeatmap(activeDesign)

  return (
    <div className='min-h-screen bg-background pt-16'>
      <div className='container mx-auto px-4 py-16 space-y-8'>
        <header className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <p className='text-xs uppercase tracking-widest text-muted-foreground'>Simulation Results</p>
            <h1 className='font-orbitron text-4xl font-bold text-foreground'>{activeDesign.name}</h1>
            <p className='mt-2 text-sm text-muted-foreground'>
              Destination {activeDesign.mission.destination.toUpperCase()} - Crew {activeDesign.mission.crewSize} - {activeDesign.mission.duration} days
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <Select value={activeId ?? undefined} onValueChange={(value) => setActiveId(value)}>
              <SelectTrigger className='w-56 bg-secondary/60'>
                <SelectValue placeholder='Select project' />
              </SelectTrigger>
              <SelectContent>
                {designs.map((design) => (
                  <SelectItem key={design.id} value={design.id}>
                    {design.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant='outline' className='border-primary/30 text-primary hover:bg-primary/10' asChild>
              <Link href={`/design?project=${activeDesign.id}#exports`}>
                <Download className='mr-2 h-4 w-4' /> Export Report
              </Link>
            </Button>
            <Button variant='ghost' onClick={() => window.location.reload()}>
              <RefreshCw className='mr-2 h-4 w-4' /> Refresh
            </Button>
          </div>
        </header>

        <section className='grid gap-6 lg:grid-cols-[2fr_1fr]'>
          <Card className='border-border/50 bg-card/60 p-6 backdrop-blur'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div>
                <h2 className='font-orbitron text-xl font-semibold text-foreground'>Mission Overview</h2>
                <p className='text-sm text-muted-foreground'>Key summary metrics derived from simulation.</p>
              </div>
              <Badge className='bg-primary/20 px-3 py-1 text-primary'>Viability {activeMetrics.viabilityScore.toFixed(0)}%</Badge>
            </div>

            <div className='mt-6 grid gap-4 md:grid-cols-2'>
              <MetricPanel title='Atmosphere' items={[
                { label: 'Oxygen Balance', value: `${activeMetrics.netOxygen.toFixed(2)} L/min`, positive: activeMetrics.netOxygen >= 0 },
                { label: 'CO2 Reserve', value: `${Math.max(0, 4 - activeDesign.mission.crewSize * 0.2).toFixed(1)} hrs` },
                { label: 'Hydrogel Vitality', value: `${Math.max(20, 100 - activeDesign.mission.duration / 2).toFixed(0)}%` },
              ]} />
              <MetricPanel title='Resources' items={[
                { label: 'Power Reserve', value: `${activeMetrics.netPower.toFixed(2)} kW`, positive: activeMetrics.netPower >= 0 },
                { label: 'Water Processing', value: `${activeMetrics.waterProcessing.toFixed(1)} L/day` },
                { label: 'Volume per Crew', value: `${activeMetrics.volumePerCrew.toFixed(1)} m^3 / crew`, positive: activeMetrics.volumePerCrew >= activeMetrics.recommendedVolumePerCrew },
              ]} />
            </div>

            <div className='mt-6 grid gap-4 md:grid-cols-3'>
              <TrendGauge label='Oxygen Stability' value={normalizeScore(activeMetrics.netOxygen, [0, 5])} />
              <TrendGauge label='Power Stability' value={normalizeScore(activeMetrics.netPower, [0, 3])} />
              <TrendGauge label='Shielding Coverage' value={normalizeScore(activeMetrics.shieldingScore, [activeMetrics.radiationRequirement, 110])} />
            </div>
          </Card>

          <Card className='border-border/50 bg-card/60 p-6 backdrop-blur'>
            <h2 className='font-orbitron text-xl font-semibold text-foreground'>Radiation Protection</h2>
            <p className='mt-2 text-sm text-muted-foreground'>Required {activeMetrics.radiationRequirement}% - Achieved {activeMetrics.shieldingScore.toFixed(0)}%</p>
            <Progress value={activeMetrics.shieldingScore} className='mt-4 h-2' />
            <div className='mt-4 space-y-2 text-xs text-muted-foreground'>
              <p>Hydrogel Modules: {hydrogelModules(activeDesign)} installed</p>
              <p>Shield Margin: {(activeMetrics.shieldingScore - activeMetrics.radiationRequirement).toFixed(1)}%</p>
              <p>Total Habitat Mass: {activeMetrics.totalMass.toFixed(1)} tons</p>
            </div>
          </Card>
        </section>

        <Tabs defaultValue='allocation' className='space-y-6'>
          <TabsList className='bg-secondary/60'>
            <TabsTrigger value='allocation'>Space Allocation</TabsTrigger>
            <TabsTrigger value='atmosphere'>Atmosphere</TabsTrigger>
            <TabsTrigger value='heatmap'>Heatmap</TabsTrigger>
            <TabsTrigger value='comparison'>Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value='allocation'>
            <div className='grid gap-6 lg:grid-cols-[1fr_1fr]'>
              <Card className='border-border/50 bg-card/60 p-6 backdrop-blur'>
                <h3 className='font-orbitron text-lg font-semibold text-foreground'>Habitat Footprint</h3>
                <div className='mt-6 h-72'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie data={allocationData} dataKey='value' nameKey='category' innerRadius={60} outerRadius={110} paddingAngle={2}>
                        {allocationData.map((entry, index) => (
                          <Cell key={entry.category} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(10,15,28,0.95)', border: '1px solid rgba(0,255,133,0.2)', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className='border-border/50 bg-card/60 p-6 backdrop-blur'>
                <h3 className='font-orbitron text-lg font-semibold text-foreground'>Category Breakdown</h3>
                <div className='mt-4 space-y-3 text-sm text-muted-foreground'>
                  {allocationData.map((item, index) => (
                    <div key={item.category} className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='inline-block h-2 w-2 rounded-full' style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                        <span>{item.category}</span>
                      </div>
                      <span className='font-mono text-foreground'>{item.value.toFixed(1)} m^3</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='atmosphere'>
            <Card className='border-border/50 bg-card/60 p-6 backdrop-blur'>
              <h3 className='font-orbitron text-lg font-semibold text-foreground'>Oxygen vs CO2 Timeline</h3>
              <div className='mt-6 h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={atmosphereSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='rgba(0,255,133,0.1)' />
                    <XAxis dataKey='day' stroke='#8b92a8' fontSize={10} tickFormatter={(value) => `D${value}`} />
                    <YAxis stroke='#8b92a8' fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(10,15,28,0.95)', border: '1px solid rgba(0,255,133,0.2)', fontSize: '12px' }}
                      labelFormatter={(value) => `Day ${value}`}
                    />
                    <Line type='monotone' dataKey='oxygen' stroke='#00ff85' strokeWidth={2} dot={false} />
                    <Line type='monotone' dataKey='co2' stroke='#ff7847' strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value='heatmap'>
            <Card className='border-border/50 bg-card/60 p-6 backdrop-blur'>
              <h3 className='font-orbitron text-lg font-semibold text-foreground'>Crew Density & Shielding Heatmap</h3>
              <p className='mt-2 text-sm text-muted-foreground'>Darker cells indicate higher occupancy or shielding deficits.</p>
              <div className='mt-6 grid grid-cols-3 gap-3'>
                {heatmapData.map((cell) => (
                  <div
                    key={cell.id}
                    className='rounded-lg border border-border/60 p-3'
                    style={{
                      background: `linear-gradient(135deg, rgba(255, 120, 71, ${cell.heat}) 0%, rgba(0, 255, 133, ${cell.shield}) 100%)`,
                    }}
                  >
                    <p className='text-sm font-medium text-foreground'>{cell.label}</p>
                    <p className='text-xs text-muted-foreground'>Crew Density {cell.density.toFixed(1)} / Shield {cell.shielding.toFixed(0)}%</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value='comparison'>
            <Card className='border-border/50 bg-card/60 p-6 backdrop-blur'>
              <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                <div>
                  <h3 className='font-orbitron text-lg font-semibold text-foreground'>Comparison Mode</h3>
                  <p className='text-sm text-muted-foreground'>Select another design to compare mission readiness.</p>
                </div>
                <Select value={comparisonId ?? undefined} onValueChange={(value) => setComparisonId(value)}>
                  <SelectTrigger className='w-56 bg-secondary/60'>
                    <SelectValue placeholder='Choose design' />
                  </SelectTrigger>
                  <SelectContent>
                    {designs
                      .filter((design) => design.id !== activeDesign.id)
                      .map((design) => (
                        <SelectItem key={design.id} value={design.id}>
                          {design.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {comparisonDesign && comparisonMetrics ? (
                <div className='mt-6 grid gap-4 md:grid-cols-2'>
                  <ComparisonCard title={activeDesign.name} metrics={activeMetrics} mission={activeDesign.mission} />
                  <ComparisonCard title={comparisonDesign.name} metrics={comparisonMetrics} mission={comparisonDesign.mission} />
                </div>
              ) : (
                <p className='mt-6 text-sm text-muted-foreground'>Select another saved design to enable side-by-side comparison.</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function MetricPanel({
  title,
  items,
}: {
  title: string
  items: Array<{ label: string; value: string; positive?: boolean }>
}) {
  return (
    <div className='rounded-xl border border-border/40 bg-background/60 p-4'>
      <h4 className='text-sm font-semibold text-foreground'>{title}</h4>
      <div className='mt-3 space-y-2 text-xs text-muted-foreground'>
        {items.map((item) => (
          <div key={item.label} className='flex items-center justify-between'>
            <span>{item.label}</span>
            <span className={`font-mono ${item.positive ? 'text-primary' : 'text-foreground'}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendGauge({ label, value }: { label: string; value: number }) {
  return (
    <div className='rounded-xl border border-border/40 bg-background/60 p-4 text-center'>
      <p className='text-xs uppercase tracking-widest text-muted-foreground'>{label}</p>
      <div className='mt-3 text-2xl font-bold text-primary'>{value.toFixed(0)}%</div>
      <Progress value={value} className='mt-3 h-2' />
    </div>
  )
}

function ComparisonCard({
  title,
  metrics,
  mission,
}: {
  title: string
  metrics: ReturnType<typeof computeHabitatMetrics>
  mission: MissionConfig
}) {
  return (
    <div className='space-y-3 rounded-xl border border-border/40 bg-background/60 p-4'>
      <h4 className='font-orbitron text-lg font-semibold text-foreground'>{title}</h4>
      <div className='grid gap-2 text-xs text-muted-foreground'>
        <ComparisonRow label='Viability' value={`${metrics.viabilityScore.toFixed(0)}%`} />
        <ComparisonRow label='Oxygen Net' value={`${metrics.netOxygen.toFixed(2)} L/min`} positive={metrics.netOxygen >= 0} />
        <ComparisonRow label='Power Net' value={`${metrics.netPower.toFixed(2)} kW`} positive={metrics.netPower >= 0} />
        <ComparisonRow label='Shielding' value={`${metrics.shieldingScore.toFixed(0)}%`} positive={metrics.shieldingScore >= metrics.radiationRequirement} />
        <ComparisonRow label='Volume per Crew' value={`${metrics.volumePerCrew.toFixed(1)} m^3`} positive={metrics.volumePerCrew >= metrics.recommendedVolumePerCrew} />
        <ComparisonRow label='Crew Count' value={`${mission.crewSize}`} />
      </div>
    </div>
  )
}

function ComparisonRow({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className='flex items-center justify-between'>
      <span>{label}</span>
      <span className={`font-mono ${positive ? 'text-primary' : 'text-foreground'}`}>{value}</span>
    </div>
  )
}

function buildSpaceAllocation(design: HabitatDesign) {
  const areaByCategory = new Map<string, number>()
  design.modules.forEach((module) => {
    const area = module.size.width * module.size.height * 2.5
    areaByCategory.set(module.category, (areaByCategory.get(module.category) ?? 0) + area)
  })
  return Array.from(areaByCategory.entries()).map(([category, value]) => ({ category, value }))
}

function buildAtmosphereSeries(metrics: ReturnType<typeof computeHabitatMetrics>, duration: number) {
  const days = Math.max(7, duration)
  return Array.from({ length: days }, (_, day) => ({
    day,
    oxygen: clamp(60 + metrics.netOxygen * day * 1.2 + randomNoise(), 0, 100),
    co2: clamp(40 - metrics.netOxygen * day * 0.8 + randomNoise(3), 0, 100),
  }))
}

function buildHeatmap(design: HabitatDesign) {
  const categories = ['Living Quarters', 'BiO2 Hydrogel', 'Science and Research', 'Support Systems']
  return categories.map((category) => {
    const modules = design.modules.filter((module) => module.category === category)
    const crewCapacity = modules.reduce((sum, module) => sum + module.metrics.crewCapacity, 0)
    const shielding = modules.reduce((sum, module) => sum + module.metrics.shielding, 0)
    const area = modules.reduce((sum, module) => sum + module.size.width * module.size.height * 2.5, 0)
    const densityScore = area > 0 ? crewCapacity / (area / 10) : 0
    const shieldScore = modules.length > 0 ? shielding / modules.length : 0
    return {
      id: category,
      label: category,
      density: densityScore,
      shielding: shieldScore,
      heat: clamp(densityScore / 4, 0.15, 0.9),
      shield: clamp(shieldScore / 100, 0.2, 0.8),
    }
  })
}

function hydrogelModules(design: HabitatDesign) {
  return design.modules.filter((module) => module.type === 'hydrogel').length
}

function normalizeScore(value: number, [min, max]: [number, number]) {
  const range = max - min
  if (range === 0) return 100
  return clamp(((value - min) / range) * 100, 0, 100)
}

function randomNoise(amplitude = 4) {
  return (Math.random() - 0.5) * amplitude
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
