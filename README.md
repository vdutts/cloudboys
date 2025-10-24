# ☁️ Who Controls The Internet?

> **When AWS goes down, Netflix, Reddit, and Slack go with it.**

An interactive data visualization showing how 80+ major companies depend on just 3 cloud providers. Built in response to the AWS US-EAST-1 outage.

[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/xmpzffkC2sM)

## 🎯 The Insight

**81% of major companies** run on AWS, Azure, or GCP. When one goes down, a massive chunk of the internet breaks.

## ✨ Features

- **Interactive Pie Chart** - Visualize cloud provider market share
- **Live Company Grid** - See 80+ companies organized by their cloud provider
- **Hover to Filter** - Hover over pie chart slices to see which companies use each provider
- **Auto-Detection** - Add any company URL and automatically detect their cloud provider via HTTP header analysis
- **Real Logos** - Actual company logos with color-coded provider indicators

## 🛠️ Tech Stack

- **Built with** [v0 by Vercel](https://v0.app)
- **Framework** Next.js 15 + React 19
- **Charts** Recharts for data visualization
- **Styling** Tailwind CSS
- **Detection** Edge Runtime API analyzing HTTP headers

## 🚀 How Detection Works

The app analyzes HTTP response headers to identify cloud providers:
- **AWS**: CloudFront headers (`x-amz-cf-id`, `x-amz-request-id`)
- **Azure**: Microsoft headers (`x-azure-ref`, `x-ms-*`)
- **GCP**: Google headers (`x-goog-*`, `gws` server signatures)
- **Oracle**: Oracle Cloud headers (`x-oracle-dms-*`)
- **Alibaba**: Alibaba Cloud headers (`x-oss-*`)

## 🌐 Live Demo

**[View Live →](https://cloudboys.vercel.app)**

## 📊 Data

Curated list of 80+ S&P 500 and major tech companies with their verified cloud providers. Data based on public information and automated detection.

---

Built by [@vdutts7](https://x.com/vdutts7) • [GitHub](https://github.com/vdutts7)
