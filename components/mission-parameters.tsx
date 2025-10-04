"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { MissionConfig } from "@/types/habitat"

interface MissionParametersProps {
  config: MissionConfig
  onChange: (config: MissionConfig) => void
}

export function MissionParameters({ config, onChange }: MissionParametersProps) {
  return (
    <div className="border-b border-border/50 p-4">
      <h2 className="mb-4 font-orbitron text-sm font-semibold uppercase tracking-wide text-primary">
        Mission Parameters
      </h2>

      <div className="space-y-4">
        {/* Destination */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Destination</Label>
          <Select value={config.destination} onValueChange={(v) => onChange({ ...config, destination: v as any })}>
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="moon">Moon</SelectItem>
              <SelectItem value="mars">Mars</SelectItem>
              <SelectItem value="transit">Transit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Crew Size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Crew Size</Label>
            <span className="font-mono text-sm text-foreground">{config.crewSize}</span>
          </div>
          <Slider
            value={[config.crewSize]}
            onValueChange={([v]) => onChange({ ...config, crewSize: v })}
            min={1}
            max={12}
            step={1}
            className="[&_[role=slider]]:bg-primary"
          />
        </div>

        {/* Mission Duration */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Duration (days)</Label>
          <Select
            value={config.duration.toString()}
            onValueChange={(v) => onChange({ ...config, duration: Number.parseInt(v) })}
          >
            <SelectTrigger className="bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="14">14 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="180">180 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payload Volume */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Payload Volume (m³)</Label>
          <Input
            type="number"
            value={config.payloadVolume}
            onChange={(e) => onChange({ ...config, payloadVolume: Number.parseFloat(e.target.value) })}
            className="bg-secondary/50"
          />
        </div>

        {/* Radiation Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Radiation Level</Label>
            <span className="font-mono text-sm text-foreground">{config.radiationLevel}%</span>
          </div>
          <Slider
            value={[config.radiationLevel]}
            onValueChange={([v]) => onChange({ ...config, radiationLevel: v })}
            min={0}
            max={100}
            step={5}
            className="[&_[role=slider]]:bg-destructive"
          />
        </div>
      </div>
    </div>
  )
}
