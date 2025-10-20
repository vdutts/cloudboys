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

interface Company {
  name: string
  symbol: string
  domain: string
  provider: string
}

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  const logoUrl = `https://logo.clearbit.com/${company.domain}`
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${company.domain}&sz=128`

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-3">
        <div className="relative w-12 h-12 flex-shrink-0 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={logoUrl || "/placeholder.svg"}
            alt={`${company.name} logo`}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to favicon if logo fails
              e.currentTarget.src = faviconUrl
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{company.name}</h3>
          <p className="text-xs text-muted-foreground">{company.symbol}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            PROVIDER_COLORS[company.provider as keyof typeof PROVIDER_COLORS] || PROVIDER_COLORS.Other
          }`}
        />
        <span className="text-xs font-medium">{company.provider}</span>
      </div>
    </Card>
  )
}
