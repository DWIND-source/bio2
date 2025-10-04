'use client'

import { useMemo, useRef, useState, Suspense } from 'react'
import type { RefObject } from 'react'
import dynamic from 'next/dynamic'
import { Rnd } from 'react-rnd'
import { RotateCw, Trash2 } from 'lucide-react'
import type { Module } from '@/types/habitat'

const Scene3D = dynamic(() => import('@/components/scene-3d').then((mod) => mod.Scene3D), {
  ssr: false,
  loading: () => (
    <div className='flex h-full items-center justify-center'>
      <div className='text-center'>
        <div className='mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
        <p className='text-sm text-muted-foreground'>Loading 3D View...</p>
      </div>
    </div>
  ),
})

interface DesignCanvasProps {
  viewMode: '2d' | '3d'
  modules: Module[]
  onRemoveModule: (id: string) => void
  onUpdateModule: (id: string, updates: Partial<Module>) => void
  canvasRef?: RefObject<HTMLDivElement>
}

const GRID_SIZE = 48
const CONTROL_CANCEL_SELECTOR = '.module-control'

export function DesignCanvas({ viewMode, modules, onRemoveModule, onUpdateModule, canvasRef }: DesignCanvasProps) {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const internalCanvasRef = useRef<HTMLDivElement>(null)
  const workingCanvasRef = canvasRef ?? internalCanvasRef

  const connections = useMemo(() => buildConnections(modules), [modules])

  const handleRotate = (id: string) => {
    const module = modules.find((mod) => mod.id === id)
    if (!module) return
    onUpdateModule(id, { rotation: (module.rotation + 90) % 360 })
  }

  const handleResize = (module: Module, widthPx: number, heightPx: number) => {
    const width = Number((widthPx / GRID_SIZE).toFixed(2))
    const height = Number((heightPx / GRID_SIZE).toFixed(2))
    const areaScale = (width * height) / (module.baseSize.width * module.baseSize.height || 1)
    const scaledMetrics = scaleMetrics(module, areaScale)
    onUpdateModule(module.id, {
      size: { width, height },
      metrics: scaledMetrics,
    })
  }

  if (viewMode === '3d') {
    return (
      <div className='h-full bg-[#0a0f1c]'>
        <Suspense
          fallback={
            <div className='flex h-full items-center justify-center'>
              <div className='text-center'>
                <div className='mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
                <p className='text-sm text-muted-foreground'>Loading 3D View...</p>
              </div>
            </div>
          }
        >
          <Scene3D modules={modules} selectedModule={selectedModule} onSelectModule={setSelectedModule} />
        </Suspense>
      </div>
    )
  }

  return (
    <div className='relative h-full overflow-auto bg-[#0a0f1c]'>
      <div
        className='absolute inset-0'
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 255, 133, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 133, 0.08) 1px, transparent 1px)`,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        }}
      />

      <div ref={workingCanvasRef} className='relative min-h-[1200px] min-w-[1200px] p-12'>
        {modules.length === 0 && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='text-center text-muted-foreground'>
              <p className='mb-2 text-3xl text-foreground'>Add modules to begin</p>
              <p className='text-sm'>Select units from the left to populate your habitat layout.</p>
            </div>
          </div>
        )}

        {connections.map((connection) => (
          <div
            key={connection.id}
            className='pointer-events-none absolute bg-primary/30'
            style={{
              left: `${connection.left}px`,
              top: `${connection.top}px`,
              width: `${connection.width}px`,
              height: `${connection.height}px`,
              opacity: selectedModule && !connection.members.includes(selectedModule) ? 0.2 : 0.6,
            }}
          />
        ))}

        {modules.map((module) => (
          <Rnd
            key={module.id}
            bounds='parent'
            cancel={CONTROL_CANCEL_SELECTOR}
            size={{
              width: module.size.width * GRID_SIZE,
              height: module.size.height * GRID_SIZE,
            }}
            position={{ x: module.position.x * GRID_SIZE, y: module.position.y * GRID_SIZE }}
            onDragStart={() => {
              setIsDragging(true)
              setSelectedModule(module.id)
            }}
            onDragStop={(_, data) => {
              setIsDragging(false)
              setSelectedModule(module.id)
              const x = Math.max(0, Math.round(data.x / GRID_SIZE))
              const y = Math.max(0, Math.round(data.y / GRID_SIZE))
              onUpdateModule(module.id, { position: { x, y } })
            }}
            onResizeStop={(_, __, ref) => {
              handleResize(module, ref.offsetWidth, ref.offsetHeight)
            }}
            grid={[GRID_SIZE, GRID_SIZE]}
            enableResizing={{
              bottom: true,
              bottomLeft: true,
              bottomRight: true,
              left: true,
              right: true,
              top: true,
              topLeft: true,
              topRight: true,
            }}
            dragGrid={[GRID_SIZE, GRID_SIZE]}
            className={`group absolute rounded-lg border-2 transition-all ${
              selectedModule === module.id
                ? 'border-primary shadow-lg shadow-primary/20'
                : 'border-border/60 hover:border-primary/40'
            }`}
          >
            <div
              className='relative flex h-full w-full cursor-move flex-col items-center justify-center gap-2 p-3'
              style={{
                background: `linear-gradient(160deg, ${module.color}26 0%, #0a0f1c 100%)`,
                transform: `rotate(${module.rotation}deg)`,
              }}
              onMouseDown={() => setSelectedModule(module.id)}
            >
              <div className='absolute inset-x-6 top-2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100' />
              <p className='text-sm font-medium' style={{ color: module.color }}>
                {module.name}
              </p>
              <p className='text-xs text-muted-foreground'>
                {module.size.width} x {module.size.height} m
              </p>
              <div className='grid grid-cols-2 gap-1 text-[10px] uppercase tracking-widest text-muted-foreground'>
                <span>Oxygen {module.metrics.oxygenGeneration.toFixed(1)} L/min</span>
                <span>Shield {module.metrics.shielding.toFixed(0)}%</span>
                <span>Power {module.metrics.powerGeneration.toFixed(1)} kW</span>
                <span>Mass {module.metrics.mass.toFixed(1)} t</span>
              </div>

              {selectedModule === module.id && (
                <div className='absolute inset-0 -m-1 rounded-lg border border-primary/30 shadow-inner shadow-primary/10' />
              )}

              <ModulePorts />
            </div>

            {selectedModule === module.id && !isDragging && (
              <div className='absolute -right-3 -top-3 flex gap-2'>
                <button
                  type='button'
                  onMouseDown={(event) => event.stopPropagation()}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation()
                    handleRotate(module.id)
                  }}
                  className='module-control rounded-full bg-primary p-1.5 text-primary-foreground shadow-lg transition-transform hover:scale-110'
                >
                  <RotateCw className='h-3.5 w-3.5' />
                </button>
                <button
                  type='button'
                  onMouseDown={(event) => event.stopPropagation()}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation()
                    onRemoveModule(module.id)
                  }}
                  className='module-control rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-lg transition-transform hover:scale-110'
                >
                  <Trash2 className='h-3.5 w-3.5' />
                </button>
              </div>
            )}
          </Rnd>
        ))}
      </div>
    </div>
  )
}

function scaleMetrics(module: Module, scale: number): Module['metrics'] {
  const clampedScale = Math.max(0.3, Math.min(scale, 3))
  const base = module.baseMetrics
  return {
    oxygenGeneration: Number((base.oxygenGeneration * clampedScale).toFixed(2)),
    oxygenDemand: Number((base.oxygenDemand * clampedScale).toFixed(2)),
    powerGeneration: Number((base.powerGeneration * clampedScale).toFixed(2)),
    powerDemand: Number((base.powerDemand * clampedScale).toFixed(2)),
    waterProcessing: Number((base.waterProcessing * clampedScale).toFixed(1)),
    thermalLoad: Number((base.thermalLoad * clampedScale).toFixed(1)),
    shielding: Number((base.shielding * clampedScale).toFixed(1)),
    crewCapacity: Math.max(0, Math.round(base.crewCapacity * clampedScale)),
    mass: Number((base.mass * clampedScale).toFixed(1)),
  }
}

interface ConnectionSegment {
  id: string
  left: number
  top: number
  width: number
  height: number
  members: string[]
}

function buildConnections(modules: Module[]): ConnectionSegment[] {
  const segments: ConnectionSegment[] = []
  const grid = GRID_SIZE

  for (let i = 0; i < modules.length; i += 1) {
    for (let j = i + 1; j < modules.length; j += 1) {
      const a = modules[i]
      const b = modules[j]
      const ax = (a.position.x + a.size.width / 2) * grid
      const ay = (a.position.y + a.size.height / 2) * grid
      const bx = (b.position.x + b.size.width / 2) * grid
      const by = (b.position.y + b.size.height / 2) * grid

      const sameRow = Math.abs(ay - by) < grid / 4
      const sameCol = Math.abs(ax - bx) < grid / 4

      if (sameRow) {
        const left = Math.min(ax, bx)
        const width = Math.abs(ax - bx)
        if (width > grid) {
          segments.push({
            id: `${a.id}-${b.id}-row`,
            left,
            top: ay,
            width,
            height: 2,
            members: [a.id, b.id],
          })
        }
      }

      if (sameCol) {
        const top = Math.min(ay, by)
        const height = Math.abs(ay - by)
        if (height > grid) {
          segments.push({
            id: `${a.id}-${b.id}-col`,
            left: ax,
            top,
            width: 2,
            height,
            members: [a.id, b.id],
          })
        }
      }
    }
  }

  return segments
}

function ModulePorts() {
  return (
    <div className='pointer-events-none absolute inset-1 flex justify-between'>
      <div className='flex flex-col justify-between'>
        <span className='h-1 w-2 rounded-r-full bg-primary/40' />
        <span className='h-1 w-2 rounded-r-full bg-primary/40' />
      </div>
      <div className='flex flex-col justify-between'>
        <span className='h-1 w-2 rounded-l-full bg-primary/40' />
        <span className='h-1 w-2 rounded-l-full bg-primary/40' />
      </div>
    </div>
  )
}

