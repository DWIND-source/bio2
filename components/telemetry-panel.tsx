'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Activity,
  AlertTriangle,
  Droplets,
  Shield,
  Thermometer,
  TrendingUp,
  Gauge,
  Clock,
} from 'lucide-react'
import type { Module, MissionConfig } from '@/types/habitat'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SimulationChart } from '@/components/simulation-chart'
import { computeHabitatMetrics } from '@/lib/calculations'

interface TelemetryPanelProps {
  modules: Module[]
  missionConfig: MissionConfig
}

export function TelemetryPanel({ modules, missionConfig }: TelemetryPanelProps) {
  const metrics = useMemo(() => computeHabitatMetrics(modules, missionConfig), [modules, missionConfig])

  const hydrogelModules = modules.filter((module) => module.type === 'hydrogel').length
  const algaeModules = modules.filter((module) => module.type === 'algae').length
  const hydrogelVitality = Math.max(20, 100 - missionConfig.duration / 2)
  const hydrogelLifetime = Math.max(0, 180 - missionConfig.duration)
  const hydrogelHealthLabel = hydrogelVitality > 70 ? 'Optimal' : hydrogelVitality > 45 ? 'Stable' : 'Replace Soon'

  const co2Load = Math.max(0, missionConfig.crewSize * 0.9 - algaeModules * 0.4)
  const thermalDrift = Math.max(0, Math.abs(missionConfig.radiationLevel - 50) / 5)
  const stressFactor = Math.min(100, 88 - missionConfig.payloadVolume / 12 + modules.length * 1.5)

  const alerts = metrics.alerts.slice()
  if (hydrogelVitality < 50 || hydrogelLifetime < 14) {
    alerts.push({ level: 'warning', message: 'Hydrogel shield requires maintenance within two weeks.' })
  }
  if (co2Load > 1.5) {
    alerts.push({ level: 'warning', message: 'CO2 buildup projected. Increase algae capacity or scrubbers.' })
  }
  if (stressFactor < 65) {
    alerts.push({ level: 'critical', message: 'Structural stress factor below safe threshold.' })
  }

  const simulationData = useMemo(() => buildSimulationSeries(metrics, missionConfig, hydrogelVitality), [
    metrics,
    missionConfig,
    hydrogelVitality,
  ])

  const oxygenScore = normalizeScore(metrics.netOxygen, [0, 5])
  const powerScore = normalizeScore(metrics.netPower, [0, 3])
  const waterScore = normalizeScore(metrics.waterProcessing - missionConfig.crewSize * 25, [0, 30])
  const shieldingScore = normalizeScore(metrics.shieldingScore - metrics.radiationRequirement, [0, 30])

  return (
    <div className='space-y-4 p-4'>
      <div>
        <h2 className='mb-4 font-orbitron text-sm font-semibold uppercase tracking-wide text-primary'>
          Mission Analysis
        </h2>

        <Card className='mb-4 border-primary/20 bg-primary/5 p-4'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-medium'>Mission Viability</span>
            <span className='font-orbitron text-2xl font-bold text-primary'>{metrics.viabilityScore.toFixed(0)}%</span>
          </div>
          <Progress value={metrics.viabilityScore} className='h-2' />
          <p className='mt-2 text-xs text-muted-foreground'>
            {metrics.viabilityScore >= 80
              ? 'Excellent - Mission ready'
              : metrics.viabilityScore >= 60
                ? 'Good - Minor improvements needed'
                : metrics.viabilityScore >= 40
                  ? 'Fair - Reinforce life support and shielding'
                  : 'Critical - Mission not yet viable'}
          </p>
        </Card>
      </div>

      {alerts.length > 0 && (
        <div className='space-y-2'>
          <h3 className='text-xs font-medium text-muted-foreground'>Alerts</h3>
          {alerts.map((alert, index) => (
            <Alert key={`${alert.message}-${index}`} variant={alert.level === 'critical' ? 'destructive' : 'default'} className='py-2'>
              <AlertTriangle className='h-4 w-4' />
              <AlertDescription className='text-xs'>{alert.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Tabs defaultValue='metrics' className='w-full'>
        <TabsList className='grid w-full grid-cols-2 bg-secondary/50'>
          <TabsTrigger value='metrics'>Metrics</TabsTrigger>
          <TabsTrigger value='simulation'>Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value='metrics' className='space-y-3 pt-3'>
          <Card className='border-border/50 bg-card/50 p-3'>
            <div className='mb-2 flex items-center gap-2'>
              <Activity className='h-4 w-4 text-primary' />
              <span className='text-sm font-medium'>Atmospheric Cycle</span>
            </div>
            <MetricRow label='Oxygen Generation' value={`${metrics.oxygenGeneration.toFixed(2)} L/min`} trend={oxygenScore} />
            <MetricRow label='Oxygen Demand' value={`${metrics.oxygenDemand.toFixed(2)} L/min`} />
            <MetricRow label='Net Oxygen' value={`${metrics.netOxygen.toFixed(2)} L/min`} highlight={metrics.netOxygen >= 0} />
            <MetricRow label='CO2 Scrub Reserve' value={`${Math.max(0, 4 - co2Load).toFixed(1)} hrs`} highlight={co2Load < 2} />
          </Card>

          <Card className='border-border/50 bg-card/50 p-3'>
            <div className='mb-2 flex items-center gap-2'>
              <TrendingUp className='h-4 w-4 text-chart-5' />
              <span className='text-sm font-medium'>Power System</span>
            </div>
            <MetricRow label='Generation' value={`${metrics.powerGeneration.toFixed(2)} kW`} trend={powerScore} />
            <MetricRow label='Demand' value={`${metrics.powerDemand.toFixed(2)} kW`} />
            <MetricRow label='Reserve' value={`${metrics.netPower.toFixed(2)} kW`} highlight={metrics.netPower >= 0} />
            <MetricRow label='Thermal Rejection' value={`${(metrics.thermalLoad - thermalDrift).toFixed(1)} kW`} />
          </Card>

          <Card className='border-border/50 bg-card/50 p-3'>
            <div className='mb-2 flex items-center gap-2'>
              <Droplets className='h-4 w-4 text-chart-1' />
              <span className='text-sm font-medium'>Water & Hydrogel</span>
            </div>
            <MetricRow label='Water Recycling' value={`${metrics.waterProcessing.toFixed(1)} L/day`} trend={waterScore} />
            <MetricRow label='Hydrogel Units' value={`${hydrogelModules} active`} />
            <MetricRow label='Hydrogel Vitality' value={`${hydrogelVitality.toFixed(0)}% (${hydrogelHealthLabel})`} highlight={hydrogelVitality > 50} />
            <MetricRow label='Estimated Lifespan' value={`${hydrogelLifetime} days`} />
          </Card>

          <Card className='border-border/50 bg-card/50 p-3'>
            <div className='mb-2 flex items-center gap-2'>
              <Shield className='h-4 w-4 text-accent' />
              <span className='text-sm font-medium'>Shielding & Structure</span>
            </div>
            <MetricRow
              label='Radiation Shielding'
              value={`${metrics.shieldingScore.toFixed(0)}% (Target ${metrics.radiationRequirement}%)`}
              trend={shieldingScore}
              highlight={metrics.shieldingScore >= metrics.radiationRequirement}
            />
            <MetricRow label='Structural Stress' value={`${stressFactor.toFixed(0)}% of limit`} highlight={stressFactor >= 75} />
            <MetricRow label='Crew Capacity' value={`${metrics.crewCapacity} berths`} highlight={metrics.crewCapacity >= missionConfig.crewSize} />
            <MetricRow label='Volume per Crew' value={`${metrics.volumePerCrew.toFixed(1)} m^3`} highlight={metrics.volumePerCrew >= metrics.recommendedVolumePerCrew} />
          </Card>

          <Card className='border-border/50 bg-card/50 p-3'>
            <div className='mb-2 flex items-center gap-2'>
              <Thermometer className='h-4 w-4 text-chart-5' />
              <span className='text-sm font-medium'>Thermal Envelope</span>
            </div>
            <MetricRow label='Cabin Setpoint' value={`${22 + modules.length * 0.05} °C`} />
            <MetricRow label='Drift' value={`${thermalDrift.toFixed(1)} °C/day`} highlight={thermalDrift < 1.5} />
            <MetricRow label='Heat Load' value={`${metrics.thermalLoad.toFixed(1)} kW`} />
          </Card>
        </TabsContent>

        <TabsContent value='simulation' className='space-y-3 pt-3'>
          <Card className='border-border/50 bg-card/50 p-3'>
            <div className='mb-3 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Clock className='h-4 w-4 text-primary' />
                <span className='text-sm font-medium'>Mission Projection</span>
              </div>
              <span className='text-xs text-muted-foreground'>{missionConfig.duration} days</span>
            </div>

            <SimulationChart data={simulationData} />

            <div className='mt-3 grid grid-cols-2 gap-2 text-xs'>
              <LegendSwatch color='bg-primary' label='Oxygen' />
              <LegendSwatch color='bg-chart-5' label='Power' />
              <LegendSwatch color='bg-chart-1' label='Water' />
              <LegendSwatch color='bg-accent' label='Hydrogel' />
            </div>
          </Card>

          <Card className='border-border/50 bg-card/50 p-3'>
            <div className='mb-2 flex items-center gap-2'>
              <Gauge className='h-4 w-4 text-primary' />
              <span className='text-sm font-medium'>System Stability</span>
            </div>
            <div className='grid grid-cols-2 gap-3 text-xs text-muted-foreground'>
              <StabilityChip label='Oxygen' value={`${oxygenScore.toFixed(0)}%`} healthy={oxygenScore > 60} />
              <StabilityChip label='Power' value={`${powerScore.toFixed(0)}%`} healthy={powerScore > 60} />
              <StabilityChip label='Water' value={`${waterScore.toFixed(0)}%`} healthy={waterScore > 60} />
              <StabilityChip label='Shielding' value={`${shieldingScore.toFixed(0)}%`} healthy={shieldingScore > 60} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface MetricRowProps {
  label: string
  value: string
  trend?: number
  highlight?: boolean
}

function MetricRow({ label, value, trend, highlight = false }: MetricRowProps) {
  return (
    <div className='flex items-center justify-between text-xs text-muted-foreground'>
      <span>{label}</span>
      <span className={`font-mono ${highlight ? 'text-primary' : 'text-foreground'}`}>
        {value}
        {typeof trend === 'number' && (
          <span className={`ml-2 inline-flex h-4 w-10 items-center justify-center rounded-full text-[10px] ${trend >= 60 ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
            {trend.toFixed(0)}%
          </span>
        )}
      </span>
    </div>
  )
}

function buildSimulationSeries(metrics: ReturnType<typeof computeHabitatMetrics>, mission: MissionConfig, hydrogelVitality: number) {
  const days = Math.max(7, mission.duration)
  return Array.from({ length: days }, (_, day) => ({
    day,
    oxygen: clamp(60 + metrics.netOxygen * day * 1.5 + randomNoise(), 0, 100),
    power: clamp(55 + metrics.netPower * day * 2 + randomNoise(), 0, 100),
    water: clamp(70 + metrics.waterProcessing / 10 - day * 0.3 + randomNoise(), 0, 100),
    hydrogel: clamp(hydrogelVitality - day * 0.35 + randomNoise(), 0, 100),
  }))
}

function randomNoise(amplitude = 4) {
  return (Math.random() - 0.5) * amplitude
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function normalizeScore(value: number, [min, max]: [number, number]) {
  const range = max - min
  if (range === 0) return 100
  return clamp(((value - min) / range) * 100, 0, 100)
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className='flex items-center gap-2'>
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <span className='text-muted-foreground'>{label}</span>
    </div>
  )
}

function StabilityChip({ label, value, healthy }: { label: string; value: string; healthy: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2 text-center ${healthy ? 'border-primary/40 bg-primary/10 text-primary' : 'border-destructive/40 bg-destructive/10 text-destructive'}`}>
      <p className='text-[10px] uppercase tracking-widest'>{label}</p>
      <p className='font-mono text-sm'>{value}</p>
    </div>
  )
}
