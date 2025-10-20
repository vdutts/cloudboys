"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { companies as defaultCompanies, type Company } from "@/lib/company-data"
import { CompanyCard } from "@/components/company-card"
import { ProviderStats } from "@/components/provider-stats"
import { Search, Plus, Loader2 } from "lucide-react"

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

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Cloud Infrastructure Dependencies</h1>
          <p className="text-muted-foreground text-lg">Visualizing how companies rely on major cloud providers</p>
        </div>

        {/* Provider Statistics */}
        <ProviderStats
          counts={providerCounts}
          selectedProvider={selectedProvider}
          onSelectProvider={setSelectedProvider}
        />

        <div className="mb-6 p-4 border rounded-lg bg-card">
          <h3 className="text-sm font-medium mb-3">Add Custom Company</h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter company URL (e.g., example.com)"
              value={newCompanyUrl}
              onChange={(e) => setNewCompanyUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCompany()}
              disabled={isDetecting}
              className="flex-1"
            />
            <Button onClick={handleAddCompany} disabled={isDetecting || !newCompanyUrl.trim()}>
              {isDetecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </>
              )}
            </Button>
          </div>
          {detectionError && <p className="text-sm text-destructive mt-2">{detectionError}</p>}
          <p className="text-xs text-muted-foreground mt-2">
            Enter any company URL to automatically detect their cloud infrastructure provider
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCompanies.length} of {allCompanies.length} companies
            {customCompanies.length > 0 && ` (${customCompanies.length} custom)`}
          </p>
          {selectedProvider && (
            <button onClick={() => setSelectedProvider(null)} className="text-sm text-primary hover:underline">
              Clear filter
            </button>
          )}
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCompanies.map((company) => (
            <CompanyCard key={`${company.domain}-${company.symbol}`} company={company} />
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No companies found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
