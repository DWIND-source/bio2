"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Grid, Environment, PerspectiveCamera } from "@react-three/drei"
import type { Module } from "@/types/habitat"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

interface Scene3DProps {
  modules: Module[]
  selectedModule: string | null
  onSelectModule: (id: string | null) => void
}

export function Scene3D({ modules, selectedModule, onSelectModule }: Scene3DProps) {
  const [lighting, setLighting] = useState<"day" | "night">("day")

  return (
    <div className="relative h-full w-full">
      {/* Lighting controls */}
      <div className="absolute right-4 top-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant={lighting === "day" ? "default" : "outline"}
          onClick={() => setLighting("day")}
          className="bg-primary/10 backdrop-blur-sm"
        >
          <Sun className="mr-2 h-4 w-4" />
          Day
        </Button>
        <Button
          size="sm"
          variant={lighting === "night" ? "default" : "outline"}
          onClick={() => setLighting("night")}
          className="bg-primary/10 backdrop-blur-sm"
        >
          <Moon className="mr-2 h-4 w-4" />
          Night
        </Button>
      </div>

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[20, 15, 20]} fov={50} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={100}
          maxPolarAngle={Math.PI / 2}
        />

        {/* Lighting */}
        {lighting === "day" ? (
          <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[2048, 2048]} />
            <directionalLight position={[-10, 10, -10]} intensity={0.3} />
          </>
        ) : (
          <>
            <ambientLight intensity={0.1} color="#4aa3ff" />
            <pointLight position={[0, 10, 0]} intensity={0.5} color="#00ff85" />
            <directionalLight position={[5, 10, 5]} intensity={0.2} color="#4aa3ff" />
          </>
        )}

        {/* Environment */}
        <Environment preset={lighting === "day" ? "sunset" : "night"} />

        {/* Ground grid */}
        <Grid
          args={[50, 50]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#00ff85"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#00ff85"
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
          position={[0, 0, 0]}
        />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#0a0f1c" opacity={0.8} transparent />
        </mesh>

        {/* Render modules */}
        {modules.map((module) => (
          <Module3D
            key={module.id}
            module={module}
            isSelected={selectedModule === module.id}
            onClick={() => onSelectModule(module.id)}
          />
        ))}

        {/* Empty state */}
        {modules.length === 0 && (
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color="#00ff85" emissive="#00ff85" emissiveIntensity={0.5} />
          </mesh>
        )}
      </Canvas>
    </div>
  )
}

interface Module3DProps {
  module: Module
  isSelected: boolean
  onClick: () => void
}

function Module3D({ module, isSelected, onClick }: Module3DProps) {
  const height = 2.5 // Default height for all modules
  const x = module.position.x
  const z = module.position.y
  const rotationY = (module.rotation * Math.PI) / 180

  return (
    <group position={[x, height / 2, z]} rotation={[0, rotationY, 0]} onClick={onClick}>
      {/* Main module box */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[module.size.width, height, module.size.height]} />
        <meshStandardMaterial
          color={module.color}
          opacity={isSelected ? 0.9 : 0.7}
          transparent
          emissive={module.color}
          emissiveIntensity={isSelected ? 0.3 : 0.1}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Selection outline */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[module.size.width + 0.1, height + 0.1, module.size.height + 0.1]} />
          <meshBasicMaterial color="#00ff85" wireframe />
        </mesh>
      )}

      {/* Module type indicator */}
      {module.type === "hydrogel" && (
        <mesh position={[0, height / 2 + 0.3, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#00ff85" emissive="#00ff85" emissiveIntensity={0.8} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Glowing edges for selected module */}
      {isSelected && (
        <>
          <pointLight position={[0, height / 2, 0]} intensity={1} color="#00ff85" distance={5} />
        </>
      )}
    </group>
  )
}
