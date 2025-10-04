'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import type { Module } from '@/types/habitat'
import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BedSingle,
  Bot,
  Box,
  Dumbbell,
  Factory,
  Flame,
  FlaskConical,
  Leaf,
  PlugZap,
  ShieldCheck,
  Thermometer,
  Wind,
} from 'lucide-react'

interface ModulePreset {
  type: string
  name: string
  category: string
  size: { width: number; height: number }
  color: string
  icon: LucideIcon
  description: string
  metrics: Module['metrics']
}

const moduleCatalog: ModulePreset[] = [
  {
    type: 'airlock',
    name: 'Airlock Node',
    category: 'Core Systems',
    size: { width: 2, height: 2 },
    color: '#4AA3FF',
    icon: Box,
    description: 'Primary ingress and egress with pressure management.',
    metrics: {
      oxygenGeneration: 0,
      oxygenDemand: 0.3,
      powerGeneration: 0,
      powerDemand: 2,
      waterProcessing: 0,
      thermalLoad: 2,
      shielding: 12,
      crewCapacity: 0,
      mass: 4,
    },
  },
  {
    type: 'command',
    name: 'Command Bridge',
    category: 'Core Systems',
    size: { width: 3, height: 3 },
    color: '#4AA3FF',
    icon: Bot,
    description: 'Mission control, navigation, and comms hub.',
    metrics: {
      oxygenGeneration: 0,
      oxygenDemand: 0.5,
      powerGeneration: 0,
      powerDemand: 4,
      waterProcessing: 0,
      thermalLoad: 3,
      shielding: 18,
      crewCapacity: 0,
      mass: 6,
    },
  },
  {
    type: 'hydrogel',
    name: 'Hydrogel Shield Pod',
    category: 'BiO2 Hydrogel',
    size: { width: 2, height: 2 },
    color: '#00FF85',
    icon: ShieldCheck,
    description: 'Hydrogel-based oxygen generation and radiation buffer.',
    metrics: {
      oxygenGeneration: 2.8,
      oxygenDemand: 0.2,
      powerGeneration: 0,
      powerDemand: 1.2,
      waterProcessing: 35,
      thermalLoad: 1,
      shielding: 45,
      crewCapacity: 0,
      mass: 3,
    },
  },
  {
    type: 'algae',
    name: 'Algae Bioreactor',
    category: 'BiO2 Hydrogel',
    size: { width: 3, height: 2 },
    color: '#00FF85',
    icon: Leaf,
    description: 'High-density algae racks for CO2 scrubbing and nutrition.',
    metrics: {
      oxygenGeneration: 3.4,
      oxygenDemand: 0.4,
      powerGeneration: 0,
      powerDemand: 1.8,
      waterProcessing: 28,
      thermalLoad: 1,
      shielding: 22,
      crewCapacity: 0,
      mass: 2,
    },
  },
  {
    type: 'sleep',
    name: 'Crew Sleep Pod',
    category: 'Living Quarters',
    size: { width: 2, height: 1.5 },
    color: '#8B92A8',
    icon: BedSingle,
    description: 'Private sleep bays with circadian lighting and acoustic dampening.',
    metrics: {
      oxygenGeneration: 0,
      oxygenDemand: 0.6,
      powerGeneration: 0,
      powerDemand: 0.6,
      waterProcessing: 2,
      thermalLoad: 1,
      shielding: 18,
      crewCapacity: 2,
      mass: 2,
    },
  },
  {
    type: 'exercise',
    name: 'Exercise Module',
    category: 'Living Quarters',
    size: { width: 2, height: 2 },
    color: '#8B92A8',
    icon: Dumbbell,
    description: 'Resistance and cardio equipment to preserve crew health.',
    metrics: {
      oxygenGeneration: 0,
      oxygenDemand: 0.8,
      powerGeneration: 0,
      powerDemand: 1.5,
      waterProcessing: 1,
      thermalLoad: 2,
      shielding: 16,
      crewCapacity: 0,
      mass: 2,
    },
  },
  {
    type: 'galley',
    name: 'Galley & Wardroom',
    category: 'Living Quarters',
    size: { width: 2, height: 2 },
    color: '#8B92A8',
    icon: Flame,
    description: 'Food prep, hydration, and communal gathering space.',
    metrics: {
      oxygenGeneration: 0,
      oxygenDemand: 0.7,
      powerGeneration: 0,
      powerDemand: 2,
      waterProcessing: 6,
      thermalLoad: 3,
      shielding: 14,
      crewCapacity: 0,
      mass: 3,
    },
  },
  {
    type: 'lab',
    name: 'Science Lab',
    category: 'Science and Research',
    size: { width: 3, height: 2 },
    color: '#A78BFA',
    icon: FlaskConical,
    description: 'Flexible laboratory for hydroponics, materials, and medical research.',
    metrics: {
      oxygenGeneration: 0.4,
      oxygenDemand: 0.9,
      powerGeneration: 0,
      powerDemand: 3,
      waterProcessing: 8,
      thermalLoad: 4,
      shielding: 20,
      crewCapacity: 0,
      mass: 4,
    },
  },
  {
    type: 'greenhouse',
    name: 'Greenhouse Dome',
    category: 'Science and Research',
    size: { width: 3, height: 3 },
    color: '#00FF85',
    icon: Leaf,
    description: 'Pressurised dome for crops, nutrition, and supplemental oxygen.',
    metrics: {
      oxygenGeneration: 4.5,
      oxygenDemand: 0.5,
      powerGeneration: 0,
      powerDemand: 2.2,
      waterProcessing: 22,
      thermalLoad: 3,
      shielding: 30,
      crewCapacity: 0,
      mass: 5,
    },
  },
  {
    type: 'power',
    name: 'Power Core',
    category: 'Support Systems',
    size: { width: 2, height: 2 },
    color: '#FCD34D',
    icon: PlugZap,
    description: 'Power distribution, fuel cells, and battery regulation.',
    metrics: {
      oxygenGeneration: 0,
      oxygenDemand: 0,
      powerGeneration: 6.5,
      powerDemand: 0.5,
      waterProcessing: 0,
      thermalLoad: 3,
      shielding: 18,
      crewCapacity: 0,
      mass: 4,
    },
  },
  {
    type: 'water',
    name: 'Water Recycling',
    category: 'Support Systems',
    size: { width: 2, height: 2 },
    color: '#4AA3FF',
    icon: Wind,
    description: 'Closed-loop water recovery and filtration racks.',
    metrics: {
      oxygenGeneration: 0,
      oxygenDemand: 0.2,
      powerGeneration: 0,
      powerDemand: 1.3,
      waterProcessing: 60,
      thermalLoad: 1,
      shielding: 16,
      crewCapacity: 0,
      mass: 3,
    },
  },
  {
    type: 'waste',
    name: 'Waste Processing',
    category: 'Support Systems',
    size: { width: 2, height: 2 },
    color: '#8B92A8',
    icon: Factory,
    description: 'Solid and liquid waste processing with nutrient recovery.',
    metrics: {
      oxygenGeneration: 0,
      oxygenDemand: 0.2,
      powerGeneration: 0,
      powerDemand: 1.6,
      waterProcessing: 18,
      thermalLoad: 2,
      shielding: 15,
      crewCapacity: 0,
      mass: 3,
    },
  },
  {
    type: 'medbay',
    name: 'Medical Bay',
    category: 'Support Systems',
    size: { width: 2, height: 2 },
    color: '#FF7847',
    icon: Activity,
    description: 'Trauma care, diagnostics, and radiation decontamination.',
    metrics: {
      oxygenGeneration: 0,
      oxygenDemand: 0.4,
      powerGeneration: 0,
      powerDemand: 2.5,
      waterProcessing: 4,
      thermalLoad: 1,
      shielding: 25,
      crewCapacity: 0,
      mass: 2,
    },
  },
  {
    type: 'thermal',
    name: 'Thermal Control',
    category: 'Support Systems',
    size: { width: 2, height: 2 },
    color: '#4AA3FF',
    icon: Thermometer,
    description: 'Heat rejection radiators and coolant loops.',
    metrics: {
      oxygenGeneration: 0,
      oxygenDemand: 0,
      powerGeneration: 0,
      powerDemand: 1,
      waterProcessing: 0,
      thermalLoad: -6,
      shielding: 12,
      crewCapacity: 0,
      mass: 2,
    },
  },
]

const categories = Array.from(new Set(moduleCatalog.map((module) => module.category)))

interface ModuleLibraryProps {
  onAddModule: (module: Module) => void
}

export function ModuleLibrary({ onAddModule }: ModuleLibraryProps) {
  const handleAdd = (preset: ModulePreset) => {
    const module: Module = {
      id: '',
      type: preset.type,
      name: preset.name,
      category: preset.category,
      position: { x: 5, y: 5 },
      size: { ...preset.size },
      baseSize: { ...preset.size },
      rotation: 0,
      color: preset.color,
      metrics: { ...preset.metrics },
      baseMetrics: { ...preset.metrics },
    }
    onAddModule(module)
  }

  return (
    <div className='p-4'>
      <h2 className='mb-4 font-orbitron text-sm font-semibold uppercase tracking-wide text-primary'>
        Module Library
      </h2>
      <ScrollArea className='h-[calc(100vh-320px)] pr-2'>
        <div className='space-y-6'>
          {categories.map((category) => (
            <div key={category} className='space-y-3'>
              <div className='flex items-center justify-between'>
                <h3 className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
                  {category}
                </h3>
                <div className='h-px flex-1 bg-border/60'></div>
              </div>
              <div className='space-y-2'>
                {moduleCatalog
                  .filter((module) => module.category === category)
                  .map((module) => (
                    <button
                      key={module.type}
                      type='button'
                      onClick={() => handleAdd(module)}
                      className='group flex w-full items-center gap-3 rounded-lg border border-border/50 bg-secondary/30 p-3 text-left transition-all hover:border-primary/30 hover:bg-secondary/50'
                    >
                      <ModulePreview color={module.color} icon={module.icon} />
                      <div className='flex-1 space-y-1'>
                        <div className='flex items-center justify-between'>
                          <p className='text-sm font-medium text-foreground'>{module.name}</p>
                          <span className='text-xs text-muted-foreground'>
                            {module.size.width}x{module.size.height} m
                          </span>
                        </div>
                        <p className='text-xs text-muted-foreground'>{module.description}</p>
                        <div className='flex gap-2 text-[10px] uppercase tracking-widest text-muted-foreground'>
                          <span>Oxygen +{module.metrics.oxygenGeneration.toFixed(1)} L/min</span>
                          <span>Shield {module.metrics.shielding.toFixed(0)}%</span>
                        </div>
                      </div>
                      <Button
                        asChild
                        size='icon'
                        variant='ghost'
                        className='h-8 w-8 rounded-full border border-primary/40 bg-primary/10 text-primary opacity-0 transition-opacity group-hover:opacity-100'
                        aria-label='Add module'
                      >
                        <span aria-hidden>+</span>
                      </Button>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function ModulePreview({ color, icon: Icon }: { color: string; icon: LucideIcon }) {
  return (
    <div className='relative flex h-12 w-12 items-center justify-center'>
      <div
        className='absolute inset-0 rounded-lg'
        style={{
          // thêm alpha như #RRGGBBAA (vd: #4AA3FF30)
          background: `linear-gradient(145deg, ${color}30 0%, ${color}10 100%)`,
          boxShadow: `0 0 20px ${color}1a`,
        }}
      />
      <div className='absolute inset-0 translate-y-1 rounded-lg border border-white/10' />
      <Icon className='relative h-5 w-5 text-foreground' />
    </div>
  )
}
