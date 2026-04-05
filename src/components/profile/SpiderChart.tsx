'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface SpiderChartProps {
  data: Array<{ topic: string; mastery: number; icon: string }>
}

export function SpiderChart({ data }: SpiderChartProps) {
  if (!data.length) return null

  const chartData = data.map((d) => ({
    subject: `${d.icon} ${d.topic}`,
    mastery: d.mastery,
    fullMark: 100,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={chartData}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#8888A0', fontSize: 12 }}
        />
        <Radar
          name="Mastery"
          dataKey="mastery"
          stroke="#6C5CE7"
          fill="#6C5CE7"
          fillOpacity={0.3}
          dot={{ fill: '#6C5CE7', r: 4 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#16161F',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#E8E8F0',
          }}
          formatter={(value) => [`${value}%`, 'Mastery']}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
