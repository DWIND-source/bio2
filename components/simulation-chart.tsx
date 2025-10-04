"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SimulationChartProps {
  data: Array<{
    day: number
    oxygen: number
    power: number
    water: number
    hydrogel: number
  }>
}

export function SimulationChart({ data }: SimulationChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 133, 0.1)" />
        <XAxis dataKey="day" stroke="#8b92a8" fontSize={10} tickFormatter={(value) => `D${value}`} />
        <YAxis stroke="#8b92a8" fontSize={10} domain={[0, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(10, 15, 28, 0.95)",
            border: "1px solid rgba(0, 255, 133, 0.2)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelFormatter={(value) => `Day ${value}`}
          formatter={(value: number) => [`${value.toFixed(1)}%`, ""]}
        />
        <Line type="monotone" dataKey="oxygen" stroke="#00ff85" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="power" stroke="#fcd34d" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="water" stroke="#4aa3ff" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="hydrogel" stroke="#a78bfa" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
