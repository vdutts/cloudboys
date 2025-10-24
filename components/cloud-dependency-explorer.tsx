"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { companies as defaultCompanies, type Company } from "@/lib/company-data"
import { CompanyCard } from "@/components/company-card"
import { ProviderStats } from "@/components/provider-stats"
import { Search, Plus, Loader2 } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Treemap, Tooltip, Legend } from "recharts"

export function CloudDependencyExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [customCompanies, setCustomCompanies] = useState<Company[]>([])
  const [newCompanyUrl, setNewCompanyUrl] = useState("")
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionError, setDetectionError] = useState<string | null>(null)

  // Combine default and custom companies
  const allCompanies = useMemo(() => {
    return [...defaultCompanies, ...customCompanies]
  }, [customCompanies])

  const filteredCompanies = useMemo(() => {
    return allCompanies.filter((company) => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesProvider = !selectedProvider || company.provider === selectedProvider
      return matchesSearch && matchesProvider
    })
  }, [allCompanies, searchQuery, selectedProvider])

  const providerCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allCompanies.forEach((company) => {
      counts[company.provider] = (counts[company.provider] || 0) + 1
    })
    return counts
  }, [allCompanies])

  const handleAddCompany = async () => {
    if (!newCompanyUrl.trim()) return

    setIsDetecting(true)
    setDetectionError(null)

    try {
      // Extract domain from URL
      let domain = newCompanyUrl.trim()
      if (domain.startsWith("http://") || domain.startsWith("https://")) {
        domain = new URL(domain).hostname
      }
      domain = domain.replace("www.", "")

      // Check if company already exists
      if (allCompanies.some((c) => c.domain === domain)) {
        setDetectionError("Company already exists")
        setIsDetecting(false)
        return
      }

      // Call detection API
      const response = await fetch("/api/detect-cloud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newCompanyUrl.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to detect cloud provider")
      }

      const result = await response.json()

      // Extract company name from domain
      const name = domain.split(".")[0]
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1)

      // Add new company
      const newCompany: Company = {
        name: formattedName,
        symbol: "CUSTOM",
        domain,
        provider: result.provider,
      }

      setCustomCompanies((prev) => [...prev, newCompany])
      setNewCompanyUrl("")
    } catch (error) {
      console.error("[v0] Error adding company:", error)
      setDetectionError("Failed to detect cloud provider. Please try again.")
    } finally {
      setIsDetecting(false)
    }
  }

  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null)

  const COLORS = {
    AWS: "#ff9900",
    Azure: "#0089d6",
    GCP: "#4285f4",
    Oracle: "#f80000",
    Alibaba: "#ff6a00",
    Other: "#6b7280",
  }

  const PROVIDER_LOGOS = {
    AWS: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    Azure: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg",
    GCP: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
    Oracle: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
    Alibaba: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Alibaba_Cloud_logo.png",
  }

  const pieData = useMemo(() => {
    return Object.entries(providerCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        value,
        color: COLORS[name as keyof typeof COLORS] || COLORS.Other,
      }))
  }, [providerCounts])

  const displayedCompanies = useMemo(() => {
    if (hoveredProvider) {
      return allCompanies.filter((c) => c.provider === hoveredProvider)
    }
    return filteredCompanies
  }, [hoveredProvider, filteredCompanies, allCompanies])

  const handleSearch = async (value: string) => {
    setSearchQuery(value)
    
    // If it looks like a URL or domain, try to add it
    if (value.includes('.') && value.length > 3 && !allCompanies.some(c => c.name.toLowerCase().includes(value.toLowerCase()))) {
      // Auto-trigger detection after short delay
      const timer = setTimeout(() => {
        setNewCompanyUrl(value)
      }, 500)
      return () => clearTimeout(timer)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-gray-900 mb-3">
            Who Controls <span className="text-orange-500">The Internet?</span>
          </h1>
          <p className="text-gray-600 text-lg">
            When AWS goes down, Netflix, Reddit, and Slack go with it.
          </p>
        </div>

        {/* Single Search Bar */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search companies or add new ones (e.g., 'Netflix' or 'stripe.com')..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.includes('.')) {
                  setNewCompanyUrl(searchQuery)
                  handleAddCompany()
                }
              }}
              className="pl-12 h-14 border-2 border-gray-300 text-base bg-white shadow-lg rounded-xl"
            />
          </div>
        </div>

        {/* Provider Filter Pills with LOGOS */}
        <div className="mb-6 flex flex-wrap gap-3 justify-center">
          {Object.entries(providerCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([provider, count]) => {
              const isSelected = selectedProvider === provider
              const logo = PROVIDER_LOGOS[provider as keyof typeof PROVIDER_LOGOS]
              return (
                <button
                  key={provider}
                  className={`px-4 py-2.5 rounded-xl font-bold transition-all border-2 flex items-center gap-2 ${
                    isSelected ? "ring-4 ring-offset-2 scale-105 shadow-lg" : "hover:scale-105 shadow-md"
                  }`}
                  style={{
                    backgroundColor: isSelected ? COLORS[provider as keyof typeof COLORS] : "white",
                    borderColor: COLORS[provider as keyof typeof COLORS],
                    color: isSelected ? "white" : COLORS[provider as keyof typeof COLORS],
                  }}
                  onClick={() => onSelectProvider(isSelected ? null : provider)}
                  onMouseEnter={() => setHoveredProvider(provider)}
                  onMouseLeave={() => setHoveredProvider(null)}
                >
                  {logo && (
                    <img 
                      src={logo} 
                      alt={provider} 
                      className="h-5 w-auto" 
                      style={{ filter: isSelected ? "brightness(0) invert(1)" : "none" }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <span className="text-sm">{provider}</span>
                  <span className="text-xs opacity-75">({count})</span>
                </button>
              )
            })}
        </div>

        {/* Main Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart with Hover */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Cloud Provider Market Share</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  onMouseEnter={(data) => setHoveredProvider(data.name)}
                  onMouseLeave={() => setHoveredProvider(null)}
                >
                  {pieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      onClick={() => onSelectProvider(selectedProvider === entry.name ? null : entry.name)}
                      style={{ cursor: "pointer" }}
                      opacity={
                        hoveredProvider 
                          ? hoveredProvider === entry.name ? 1 : 0.3
                          : selectedProvider && selectedProvider !== entry.name ? 0.3 : 1
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <div className="text-6xl font-black text-blue-600">
                {Math.round(((providerCounts["AWS"] || 0) + (providerCounts["Azure"] || 0) + (providerCounts["GCP"] || 0)) / allCompanies.length * 100)}%
              </div>
              <div className="text-sm text-gray-600 font-medium">The Big 3 Control Everything</div>
            </div>
          </div>

          {/* All Company Logos - Scrollable */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {hoveredProvider || selectedProvider ? `${hoveredProvider || selectedProvider} Companies` : "All Companies"} ({displayedCompanies.length})
              </h2>
              {selectedProvider && (
                <button 
                  onClick={() => setSelectedProvider(null)} 
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-xs"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-6 gap-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {displayedCompanies.map((company) => (
                <div
                  key={company.domain}
                  className="relative bg-gray-50 rounded-lg p-2 border-2 hover:scale-110 transition-transform cursor-pointer"
                  style={{ borderColor: COLORS[company.provider as keyof typeof COLORS] }}
                  title={`${company.name} - ${company.provider}`}
                >
                  <img
                    src={`https://logo.clearbit.com/${company.domain}`}
                    alt={company.name}
                    className="w-full h-full object-contain aspect-square"
                    onError={(e) => {
                      const target = e.currentTarget
                      if (target.src.includes('clearbit')) {
                        target.src = `https://www.google.com/s2/favicons?domain=${company.domain}&sz=128`
                      } else if (target.src.includes('google.com')) {
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random&size=128`
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Social Share */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <a
              href="https://x.com/vdutts7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors"
              title="Follow on X"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://github.com/vdutts7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-900 transition-colors"
              title="View on GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
              </svg>
            </a>
          </div>
          <p className="text-xs text-gray-500">Built with v0 by Vercel</p>
        </div>
      </div>
    </div>
  )
}
