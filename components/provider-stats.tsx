"use client"

import { Card } from "@/components/ui/card"

const PROVIDER_COLORS = {
  AWS: "bg-orange-500",
  GCP: "bg-blue-500",
  Azure: "bg-cyan-500",
  Oracle: "bg-red-500",
  Alibaba: "bg-yellow-500",
  Other: "bg-gray-500",
}

interface ProviderStatsProps {
  counts: Record<string, number>
  selectedProvider: string | null
  onSelectProvider: (provider: string | null) => void
}

export function ProviderStats({ counts, selectedProvider, onSelectProvider }: ProviderStatsProps) {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0)

  const sortedProviders = Object.entries(counts).sort((a, b) => b[1] - a[1])

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Provider Distribution</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {sortedProviders.map(([provider, count]) => {
          const percentage = ((count / total) * 100).toFixed(1)
          const isSelected = selectedProvider === provider

          return (
            <Card
              key={provider}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary" : ""}`}
              onClick={() => onSelectProvider(isSelected ? null : provider)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    PROVIDER_COLORS[provider as keyof typeof PROVIDER_COLORS] || PROVIDER_COLORS.Other
                  }`}
                />
                <span className="font-semibold text-sm">{provider}</span>
              </div>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs text-muted-foreground">{percentage}% of total</div>
            </Card>
          )
        })}
      </div>

      {/* Visual Bar Chart */}
      <div className="relative h-12 bg-muted rounded-lg overflow-hidden flex">
        {sortedProviders.map(([provider, count]) => {
          const percentage = (count / total) * 100

          return (
            <div
              key={provider}
              className={`${
                PROVIDER_COLORS[provider as keyof typeof PROVIDER_COLORS] || PROVIDER_COLORS.Other
              } flex items-center justify-center text-white text-xs font-semibold transition-all hover:opacity-80 cursor-pointer`}
              style={{ width: `${percentage}%` }}
              onClick={() => onSelectProvider(selectedProvider === provider ? null : provider)}
              title={`${provider}: ${count} companies (${percentage.toFixed(1)}%)`}
            >
              {percentage > 8 && provider}
            </div>
          )
        })}
      </div>
    </div>
  )
}
