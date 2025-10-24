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

  const providerBadgeColors = {
    AWS: "#f97316",
    Azure: "#06b6d4",
    GCP: "#3b82f6",
    Oracle: "#ef4444",
    Alibaba: "#eab308",
    Other: "#9ca3af",
  }

  return (
    <div 
      className="group relative bg-white rounded-lg p-2 hover:shadow-md transition-all cursor-pointer border-2"
      style={{ 
        borderColor: providerBadgeColors[company.provider as keyof typeof providerBadgeColors] || providerBadgeColors.Other 
      }}
      title={`${company.name} - ${company.provider}`}
    >
      {/* Logo Only */}
      <div className="relative w-full aspect-square bg-gray-50 rounded overflow-hidden flex items-center justify-center">
        <img
          src={logoUrl}
          alt={`${company.name} logo`}
          className="w-full h-full object-contain p-1.5"
          onError={(e) => {
            const target = e.currentTarget
            if (target.src.includes('clearbit')) {
              target.src = faviconUrl
            } else if (target.src.includes('google.com')) {
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random&size=128`
            }
          }}
        />
      </div>
      
      {/* Provider Dot - Bottom Right */}
      <div 
        className="absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white shadow-sm"
        style={{ 
          backgroundColor: providerBadgeColors[company.provider as keyof typeof providerBadgeColors] || providerBadgeColors.Other 
        }}
      />
    </div>
  )
}
