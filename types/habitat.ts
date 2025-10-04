export interface ModuleMetrics {
  oxygenGeneration: number
  oxygenDemand: number
  powerGeneration: number
  powerDemand: number
  waterProcessing: number
  thermalLoad: number
  shielding: number
  crewCapacity: number
  mass: number
}

export interface Module {
  id: string
  type: string
  name: string
  category: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  baseSize: { width: number; height: number }
  rotation: number
  color: string
  metrics: ModuleMetrics
  baseMetrics: ModuleMetrics
}

export interface MissionConfig {
  destination: 'moon' | 'mars' | 'transit'
  crewSize: number
  duration: number
  payloadVolume: number
  radiationLevel: number
}

export interface HabitatDesign {
  id: string
  name: string
  mission: MissionConfig
  modules: Module[]
  viability: number
  createdAt: string
  updatedAt: string
  notes?: string
  thumbnail?: string
}
