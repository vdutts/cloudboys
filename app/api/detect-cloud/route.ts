import { type NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

interface CloudDetectionResult {
  provider: string
  confidence: "high" | "medium" | "low"
  signals: string[]
}

async function detectCloudProvider(url: string): Promise<CloudDetectionResult> {
  const signals: string[] = []
  let provider = "Other"
  let confidence: "high" | "medium" | "low" = "low"

  try {
    // Fetch the URL and analyze headers
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
    })

    const headers = response.headers

    // AWS Detection
    if (
      headers.get("x-amz-cf-id") ||
      headers.get("x-amz-request-id") ||
      headers.get("x-amzn-requestid") ||
      headers.get("x-amzn-trace-id")
    ) {
      provider = "AWS"
      confidence = "high"
      signals.push("AWS CloudFront headers detected")
    }

    // Check for AWS CloudFront in Via header
    if (headers.get("via")?.includes("CloudFront")) {
      provider = "AWS"
      confidence = "high"
      signals.push("CloudFront in Via header")
    }

    // Azure Detection
    if (
      headers.get("x-azure-ref") ||
      headers.get("x-ms-request-id") ||
      headers.get("x-ms-version") ||
      headers.get("x-aspnet-version")
    ) {
      provider = "Azure"
      confidence = "high"
      signals.push("Azure headers detected")
    }

    // GCP Detection
    if (
      headers.get("x-goog-generation") ||
      headers.get("x-goog-metageneration") ||
      headers.get("x-goog-stored-content-length") ||
      headers.get("x-guploader-uploadid")
    ) {
      provider = "GCP"
      confidence = "high"
      signals.push("Google Cloud headers detected")
    }

    // Check for GCP in Via or Server headers
    if (headers.get("via")?.includes("google") || headers.get("server")?.includes("gws")) {
      provider = "GCP"
      confidence = "high"
      signals.push("Google infrastructure detected")
    }

    // Oracle Cloud Detection
    if (headers.get("x-oracle-dms-ecid") || headers.get("x-oracle-dms-rid")) {
      provider = "Oracle"
      confidence = "high"
      signals.push("Oracle Cloud headers detected")
    }

    // Alibaba Cloud Detection
    if (headers.get("x-oss-request-id") || headers.get("x-oss-hash-crc64ecma") || headers.get("eagleeye-traceid")) {
      provider = "Alibaba"
      confidence = "high"
      signals.push("Alibaba Cloud headers detected")
    }

    // Cloudflare (often used with various clouds)
    if (headers.get("cf-ray") || headers.get("cf-cache-status")) {
      signals.push("Cloudflare CDN detected (underlying cloud may vary)")
      if (provider === "Other") {
        confidence = "low"
      }
    }

    // Server header analysis
    const server = headers.get("server")
    if (server) {
      if (server.includes("AmazonS3") || server.includes("AmazonEC2")) {
        provider = "AWS"
        confidence = "high"
        signals.push(`Server header: ${server}`)
      } else if (server.includes("Microsoft") || server.includes("IIS")) {
        if (provider === "Other") {
          provider = "Azure"
          confidence = "medium"
          signals.push(`Server header suggests Azure: ${server}`)
        }
      }
    }

    // If no signals found, try a full GET request to check content
    if (signals.length === 0) {
      const fullResponse = await fetch(url, {
        method: "GET",
        redirect: "follow",
      })

      const text = await fullResponse.text()

      // Check for cloud provider mentions in HTML
      if (text.includes("cloudfront.net")) {
        provider = "AWS"
        confidence = "medium"
        signals.push("CloudFront domain in content")
      } else if (text.includes("azureedge.net") || text.includes("azure.com")) {
        provider = "Azure"
        confidence = "medium"
        signals.push("Azure domain in content")
      } else if (text.includes("googleapis.com") || text.includes("gstatic.com")) {
        provider = "GCP"
        confidence = "medium"
        signals.push("Google Cloud domain in content")
      }
    }

    if (signals.length === 0) {
      signals.push("No clear cloud provider signals detected")
    }

    return { provider, confidence, signals }
  } catch (error) {
    console.error("[v0] Error detecting cloud provider:", error)
    return {
      provider: "Other",
      confidence: "low",
      signals: ["Error fetching URL - unable to detect"],
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Ensure URL has protocol
    let fullUrl = url
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      fullUrl = `https://${url}`
    }

    const result = await detectCloudProvider(fullUrl)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Failed to detect cloud provider" }, { status: 500 })
  }
}
