import type { Module, MissionConfig } from '@/types/habitat'

const MODULE_HEIGHT = 2.5
const CREW_OXYGEN_NEED = 0.84 // L/min per crew member
const CREW_POWER_NEED = 0.3 // kW per crew member baseline
const RECOMMENDED_VOLUME_PER_CREW = 10 // m^3 per crew

export interface HabitatMetrics {
  oxygenGeneration: number
  oxygenDemand: number
  netOxygen: number
  powerGeneration: number
  powerDemand: number
  netPower: number
  waterProcessing: number
  thermalLoad: number
  shieldingScore: number
  crewCapacity: number
  totalMass: number
  totalVolume: number
  volumePerCrew: number
  recommendedVolumePerCrew: number
  radiationRequirement: number
  viabilityScore: number
  alerts: { level: 'warning' | 'critical'; message: string }[]
}

export function computeHabitatMetrics(modules: Module[], mission: MissionConfig): HabitatMetrics {
  const totals = modules.reduce(
    (acc, module) => {
      const area = module.size.width * module.size.height
      return {
        oxygenGeneration: acc.oxygenGeneration + module.metrics.oxygenGeneration,
        oxygenDemand: acc.oxygenDemand + module.metrics.oxygenDemand,
        powerGeneration: acc.powerGeneration + module.metrics.powerGeneration,
        powerDemand: acc.powerDemand + module.metrics.powerDemand,
        waterProcessing: acc.waterProcessing + module.metrics.waterProcessing,
        thermalLoad: acc.thermalLoad + module.metrics.thermalLoad,
        shielding: acc.shielding + module.metrics.shielding * area,
        crewCapacity: acc.crewCapacity + module.metrics.crewCapacity,
        mass: acc.mass + module.metrics.mass,
        volume: acc.volume + area * MODULE_HEIGHT,
      }
    },
    {
      oxygenGeneration: 0,
      oxygenDemand: 0,
      powerGeneration: 0,
      powerDemand: 0,
      waterProcessing: 0,
      thermalLoad: 0,
      shielding: 0,
      crewCapacity: 0,
      mass: 0,
      volume: 0,
    },
  )

  const crewOxygenDemand = mission.crewSize * CREW_OXYGEN_NEED
  const crewPowerDemand = mission.crewSize * CREW_POWER_NEED
  const totalOxygenDemand = totals.oxygenDemand + crewOxygenDemand
  const totalPowerDemand = totals.powerDemand + crewPowerDemand

  const netOxygen = totals.oxygenGeneration - totalOxygenDemand
  const netPower = totals.powerGeneration - totalPowerDemand
  const volumePerCrew = mission.crewSize > 0 ? totals.volume / mission.crewSize : totals.volume
  const shieldingScore = mission.crewSize > 0 ? Math.min((totals.shielding / (mission.crewSize * 100)) * 100, 100) : 100
  const radiationRequirement = mission.destination === 'mars' ? 75 : mission.destination === 'moon' ? 60 : 50

  const alerts: HabitatMetrics['alerts'] = []

  if (netOxygen < 0) alerts.push({ level: 'critical', message: 'Oxygen generation below crew requirements.' })
  if (netPower < 0) alerts.push({ level: 'critical', message: 'Power generation is in deficit.' })
  if (volumePerCrew < RECOMMENDED_VOLUME_PER_CREW)
    alerts.push({ level: 'warning', message: 'Crew volume below recommended 10 m^3.' })
  if (totals.waterProcessing < mission.crewSize * 25)
    alerts.push({ level: 'warning', message: 'Water recycling capacity needs improvement.' })
  if (shieldingScore < radiationRequirement)
    alerts.push({ level: 'warning', message: 'Radiation shielding below mission threshold.' })
  if (totals.crewCapacity < mission.crewSize)
    alerts.push({ level: 'critical', message: 'Sleeping capacity below crew manifest.' })

  const viabilityScore = Math.max(
    0,
    Math.min(
      100,
      (netOxygen > 0 ? 30 : 10 + netOxygen * 5) +
        (netPower > 0 ? 20 : 10 + netPower * 3) +
        Math.min((totals.waterProcessing / (mission.crewSize * 25)) * 25, 25) +
        Math.min((volumePerCrew / RECOMMENDED_VOLUME_PER_CREW) * 15, 15) +
        Math.min((shieldingScore / radiationRequirement) * 10, 10),
    ),
  )

  return {
    oxygenGeneration: totals.oxygenGeneration,
    oxygenDemand: totalOxygenDemand,
    netOxygen,
    powerGeneration: totals.powerGeneration,
    powerDemand: totalPowerDemand,
    netPower,
    waterProcessing: totals.waterProcessing,
    thermalLoad: totals.thermalLoad,
    shieldingScore,
    crewCapacity: totals.crewCapacity,
    totalMass: totals.mass,
    totalVolume: totals.volume,
    volumePerCrew,
    recommendedVolumePerCrew: RECOMMENDED_VOLUME_PER_CREW,
    radiationRequirement,
    viabilityScore,
    alerts,
  }
}
