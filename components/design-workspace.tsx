'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { ModuleLibrary } from '@/components/module-library'
import Link from 'next/link'
import { DesignCanvas } from '@/components/design-canvas'
import { TelemetryPanel } from '@/components/telemetry-panel'
import { MissionParameters } from '@/components/mission-parameters'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Save,
  Download,
  Eye,
  Grid3x3,
  Box,
  Share2,
  Upload,
  FolderUp,
  FileJson,
  FileDown,
  FileText,
} from 'lucide-react'
import type { HabitatDesign, MissionConfig, Module } from '@/types/habitat'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { computeHabitatMetrics } from '@/lib/calculations'

export function DesignWorkspace() {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')
  const [placedModules, setPlacedModules] = useState<Module[]>([])
  const [missionConfig, setMissionConfig] = useState<MissionConfig>({
    destination: 'moon',
    crewSize: 4,
    duration: 30,
    payloadVolume: 120,
    radiationLevel: 50,
  })
  const [projectName, setProjectName] = useState('Untitled Habitat')
  const [projectNotes, setProjectNotes] = useState('')
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('bio2.activeProject')
    if (!stored) return
    try {
      const project: HabitatDesign = JSON.parse(stored)
      setPlacedModules(project.modules)
      setMissionConfig(project.mission)
      setProjectName(project.name)
      setProjectNotes(project.notes ?? '')
      setCurrentProjectId(project.id)
    } catch (error) {
      console.error('Failed to load cached design', error)
    }
  }, [])

  const metrics = useMemo(() => computeHabitatMetrics(placedModules, missionConfig), [placedModules, missionConfig])

  const handleAddModule = (module: Module) => {
    const offset = placedModules.length
    const newModule: Module = {
      ...module,
      id: generateId(),
      position: { x: 4 + (offset % 6) * 3, y: 4 + Math.floor(offset / 6) * 3 },
    }
    setPlacedModules((prev) => [...prev, newModule])
  }

  const handleRemoveModule = (id: string) => {
    setPlacedModules((prev) => prev.filter((module) => module.id !== id))
  }

  const handleUpdateModule = (id: string, updates: Partial<Module>) => {
    setPlacedModules((prev) =>
      prev.map((module) => (module.id === id ? { ...module, ...updates, metrics: updates.metrics ?? module.metrics } : module)),
    )
  }

  const handleSaveProject = async () => {
    setSaveDialogOpen(false)

    const viability = Number(metrics.viabilityScore.toFixed(0))
    const id = currentProjectId ?? generateId()
    const timestamp = new Date().toISOString()
    let thumbnail: string | undefined

    if (canvasRef.current) {
      try {
        thumbnail = await toPng(canvasRef.current, { pixelRatio: 1.5 })
      } catch (error) {
        console.warn('Failed to capture layout preview', error)
      }
    }

    const design: HabitatDesign = {
      id,
      name: projectName,
      mission: missionConfig,
      modules: placedModules,
      viability,
      createdAt: currentProjectId ? timestamp : timestamp,
      updatedAt: timestamp,
      notes: projectNotes,
      thumbnail,
    }

    persistProject(design)
    setCurrentProjectId(id)
    toast.success('Design saved to dashboard')
  }

  const handleExportJSON = () => {
    if (placedModules.length === 0) {
      toast.error('Add at least one module before exporting.')
      return
    }

    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      project: {
        id: currentProjectId ?? generateId(),
        name: projectName,
        mission: missionConfig,
        metrics,
        modules: placedModules,
        notes: projectNotes,
      },
    }

    downloadBlob(JSON.stringify(data, null, 2), `${slugify(projectName)}.json`, 'application/json')
    toast.success('JSON export generated')
  }

  const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const project = parsed.project as HabitatDesign
      const modules = (project.modules ?? []).map((module) => ({
        ...module,
        baseMetrics: module.baseMetrics ?? module.metrics,
        baseSize: module.baseSize ?? module.size,
      }))
      setPlacedModules(modules)
      setMissionConfig(project.mission)
      setProjectName(project.name)
      setProjectNotes(project.notes ?? '')
      setCurrentProjectId(project.id)
      toast.success('Design imported successfully')
    } catch (error) {
      console.error(error)
      toast.error('Unable to import design file')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleExportPNG = async () => {
    if (!canvasRef.current) {
      toast.error('Switch to 2D view to export an image')
      return
    }
    try {
      const dataUrl = await toPng(canvasRef.current, { pixelRatio: 2 })
      downloadDataUrl(dataUrl, `${slugify(projectName)}.png`)
      toast.success('PNG export ready')
    } catch (error) {
      console.error(error)
      toast.error('Could not capture layout image')
    }
  }

  const handleExportPDF = async () => {
    if (!canvasRef.current) {
      toast.error('Switch to 2D view to export a PDF report')
      return
    }

    try {
      const dataUrl = await toPng(canvasRef.current, { pixelRatio: 1.5 })
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(20)
      doc.text(`BiO2 Habitat Report: ${projectName}`, 40, 50)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(`Exported: ${format(new Date(), 'MMMM d, yyyy HH:mm')}`, 40, 70)
      doc.text(`Destination: ${missionConfig.destination.toUpperCase()}`, 40, 90)
      doc.text(`Crew Size: ${missionConfig.crewSize}`, 40, 110)
      doc.text(`Duration: ${missionConfig.duration} days`, 40, 130)

      doc.addImage(dataUrl, 'PNG', 360, 60, 400, 260)

      const metricsStartY = 160
      const metricsLeft = 40
      const metricLines = [
        `Mission Viability: ${metrics.viabilityScore.toFixed(0)}%`,
        `Oxygen Net: ${metrics.netOxygen.toFixed(2)} L/min`,
        `Power Net: ${metrics.netPower.toFixed(2)} kW`,
        `Water Processing: ${metrics.waterProcessing.toFixed(1)} L/day`,
        `Radiation Shielding: ${metrics.shieldingScore.toFixed(0)}% (Target ${metrics.radiationRequirement}%)`,
        `Volume per Crew: ${metrics.volumePerCrew.toFixed(1)} m^3`,
      ]
      metricLines.forEach((line, index) => {
        doc.text(line, metricsLeft, metricsStartY + index * 20)
      })

      if (projectNotes) {
        doc.text('Mission Notes:', metricsLeft, metricsStartY + metricLines.length * 20 + 30)
        doc.text(doc.splitTextToSize(projectNotes, 260), metricsLeft, metricsStartY + metricLines.length * 20 + 50)
      }

      doc.save(`${slugify(projectName)}-report.pdf`)
      toast.success('PDF report downloaded')
    } catch (error) {
      console.error(error)
      toast.error('Failed to compose PDF report')
    }
  }

  const handleShare = () => {
    setShareDialogOpen(true)
  }

  return (
    <div className='flex h-screen flex-col bg-background pt-16'>
      <input
        ref={fileInputRef}
        type='file'
        accept='application/json'
        className='hidden'
        onChange={handleImportJSON}
      />

      <div className='flex h-14 items-center justify-between border-b border-border/50 bg-card/60 px-4 backdrop-blur-xl'>
        <div className='flex items-center gap-3'>
          <h1 className='font-orbitron text-lg font-semibold'>Habitat Designer</h1>
          <Input
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            className='h-8 w-48 border-transparent bg-transparent px-2 text-sm'
          />
          <span className='text-xs text-muted-foreground'>Viability {metrics.viabilityScore.toFixed(0)}%</span>
        </div>

        <div className='flex items-center gap-2'>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as '2d' | '3d')}>
            <TabsList className='bg-secondary/60'>
              <TabsTrigger value='2d' className='gap-2'>
                <Grid3x3 className='h-4 w-4' />2D
              </TabsTrigger>
              <TabsTrigger value='3d' className='gap-2'>
                <Box className='h-4 w-4' />3D
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className='h-6 w-px bg-border' />

          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' variant='ghost'>
                <Save className='mr-2 h-4 w-4' />
                Save
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Habitat Design</DialogTitle>
                <DialogDescription>Store this design in your dashboard for future missions.</DialogDescription>
              </DialogHeader>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='design-name'>Design Name</Label>
                  <Input id='design-name' value={projectName} onChange={(event) => setProjectName(event.target.value)} />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='design-notes'>Mission Notes</Label>
                  <Textarea
                    id='design-notes'
                    rows={3}
                    value={projectNotes}
                    onChange={(event) => setProjectNotes(event.target.value)}
                    placeholder='Key objectives, crew details, or outstanding tasks.'
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveProject} className='bg-primary text-primary-foreground hover:bg-primary/90'>
                  Save to Dashboard
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button size='sm' variant='ghost' onClick={() => fileInputRef.current?.click()}>
            <FolderUp className='mr-2 h-4 w-4' />
            Load
          </Button>

          <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' variant='ghost'>
                <Download className='mr-2 h-4 w-4' />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Options</DialogTitle>
                <DialogDescription>Share mission data with teammates or educators.</DialogDescription>
              </DialogHeader>
              <div className='grid gap-3 sm:grid-cols-3'>
                <ExportCard icon={FileJson} label='JSON Blueprint' onClick={handleExportJSON} />
                <ExportCard icon={FileDown} label='PNG Layout' onClick={handleExportPNG} />
                <ExportCard icon={FileText} label='PDF Report' onClick={handleExportPDF} />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <DialogTrigger asChild>
              <Button size='sm' variant='outline' className='border-primary/20 bg-primary/5'>
                <Share2 className='mr-2 h-4 w-4' />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Design</DialogTitle>
                <DialogDescription>Publish your habitat design to the BiO2 community gallery.</DialogDescription>
              </DialogHeader>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='share-title'>Design Title</Label>
                  <Input id='share-title' placeholder='Lunar HydroShield Base' />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='share-description'>Description</Label>
                  <Textarea id='share-description' placeholder='Describe your habitat design...' rows={3} />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='share-tags'>Tags (comma separated)</Label>
                  <Input id='share-tags' placeholder='lunar, research, sustainable' />
                </div>
                <div className='flex gap-2'>
                  <Button className='flex-1' onClick={() => setShareDialogOpen(false)}>
                    <Upload className='mr-2 h-4 w-4' />
                    Publish to Gallery
                  </Button>
                  <Button variant='outline' onClick={() => setShareDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button size='sm' variant='outline' className='border-primary/20 bg-primary/5'>
            <Eye className='mr-2 h-4 w-4' />
            Preview
          </Button>
        </div>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        <div className='flex w-80 flex-col border-r border-border/50 bg-card/30 backdrop-blur-sm'>
          <div className='flex-1 overflow-y-auto'>
            <MissionParameters config={missionConfig} onChange={setMissionConfig} />
            <ModuleLibrary onAddModule={handleAddModule} />
          </div>
        </div>

        <div className='flex-1 overflow-hidden bg-background'>
          <DesignCanvas
            viewMode={viewMode}
            modules={placedModules}
            onRemoveModule={handleRemoveModule}
            onUpdateModule={handleUpdateModule}
            canvasRef={canvasRef}
          />
        </div>

        <div className='w-80 overflow-y-auto border-l border-border/50 bg-card/30 backdrop-blur-sm'>
          <TelemetryPanel modules={placedModules} missionConfig={missionConfig} />
        </div>
      </div>
    </div>
  )
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'bio2-habitat'
}

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'bio2-' + Math.random().toString(36).slice(2, 10)
}

function persistProject(design: HabitatDesign) {
  if (typeof window === 'undefined') return
  const stored = window.localStorage.getItem('bio2.projects')
  const projects: HabitatDesign[] = stored ? JSON.parse(stored) : []
  const index = projects.findIndex((project) => project.id === design.id)
  if (index >= 0) {
    design.createdAt = projects[index].createdAt
    projects[index] = { ...design }
  } else {
    projects.unshift(design)
  }
  window.localStorage.setItem('bio2.projects', JSON.stringify(projects))
  window.localStorage.setItem('bio2.activeProject', JSON.stringify(design))
}

interface ExportCardProps {
  icon: ComponentType<{ className?: string }>
  label: string
  onClick: () => void
}

function ExportCard({ icon: Icon, label, onClick }: ExportCardProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='flex flex-col items-center gap-3 rounded-lg border border-border/50 bg-secondary/40 p-4 text-sm text-muted-foreground transition-all hover:border-primary/30 hover:bg-secondary/60 hover:text-foreground'
    >
      <Icon className='h-6 w-6 text-primary' />
      {label}
    </button>
  )
}








