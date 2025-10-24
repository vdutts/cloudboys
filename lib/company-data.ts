// Sample S&P 500 companies with their cloud providers
// This is a curated dataset based on public information and reports

export interface Company {
  name: string
  symbol: string
  domain: string
  provider: string
}

export const companies: Company[] = [
  // AWS - Dominant market leader
  { name: "Netflix", symbol: "NFLX", domain: "netflix.com", provider: "AWS" },
  { name: "Airbnb", symbol: "ABNB", domain: "airbnb.com", provider: "AWS" },
  { name: "Twitch", symbol: "AMZN", domain: "twitch.tv", provider: "AWS" },
  { name: "Adobe", symbol: "ADBE", domain: "adobe.com", provider: "AWS" },
  { name: "Salesforce", symbol: "CRM", domain: "salesforce.com", provider: "AWS" },
  { name: "Expedia", symbol: "EXPE", domain: "expedia.com", provider: "AWS" },
  { name: "Nasdaq", symbol: "NDAQ", domain: "nasdaq.com", provider: "AWS" },
  { name: "General Electric", symbol: "GE", domain: "ge.com", provider: "AWS" },
  { name: "BMW", symbol: "BMW", domain: "bmw.com", provider: "AWS" },
  { name: "Shell", symbol: "SHEL", domain: "shell.com", provider: "AWS" },
  { name: "Johnson & Johnson", symbol: "JNJ", domain: "jnj.com", provider: "AWS" },
  { name: "Pfizer", symbol: "PFE", domain: "pfizer.com", provider: "AWS" },
  { name: "Moderna", symbol: "MRNA", domain: "modernatx.com", provider: "AWS" },
  { name: "Coca-Cola", symbol: "KO", domain: "coca-cola.com", provider: "AWS" },
  { name: "Nike", symbol: "NKE", domain: "nike.com", provider: "AWS" },
  { name: "McDonald's", symbol: "MCD", domain: "mcdonalds.com", provider: "AWS" },
  { name: "Capital One", symbol: "COF", domain: "capitalone.com", provider: "AWS" },
  { name: "Intuit", symbol: "INTU", domain: "intuit.com", provider: "AWS" },
  { name: "Comcast", symbol: "CMCSA", domain: "comcast.com", provider: "AWS" },
  { name: "Disney", symbol: "DIS", domain: "disney.com", provider: "AWS" },
  { name: "Electronic Arts", symbol: "EA", domain: "ea.com", provider: "AWS" },
  { name: "Slack", symbol: "WORK", domain: "slack.com", provider: "AWS" },
  { name: "Dropbox", symbol: "DBX", domain: "dropbox.com", provider: "AWS" },
  { name: "Lyft", symbol: "LYFT", domain: "lyft.com", provider: "AWS" },
  { name: "Zillow", symbol: "Z", domain: "zillow.com", provider: "AWS" },
  { name: "Coinbase", symbol: "COIN", domain: "coinbase.com", provider: "AWS" },
  { name: "Reddit", symbol: "RDDT", domain: "reddit.com", provider: "AWS" },
  { name: "Twilio", symbol: "TWLO", domain: "twilio.com", provider: "AWS" },

  // GCP - Google's cloud platform
  { name: "Spotify", symbol: "SPOT", domain: "spotify.com", provider: "GCP" },
  { name: "Twitter/X", symbol: "X", domain: "twitter.com", provider: "GCP" },
  { name: "Snap", symbol: "SNAP", domain: "snap.com", provider: "GCP" },
  { name: "PayPal", symbol: "PYPL", domain: "paypal.com", provider: "GCP" },
  { name: "Shopify", symbol: "SHOP", domain: "shopify.com", provider: "GCP" },
  { name: "Target", symbol: "TGT", domain: "target.com", provider: "GCP" },
  { name: "Home Depot", symbol: "HD", domain: "homedepot.com", provider: "GCP" },
  { name: "Best Buy", symbol: "BBY", domain: "bestbuy.com", provider: "GCP" },
  { name: "Etsy", symbol: "ETSY", domain: "etsy.com", provider: "GCP" },
  { name: "Wayfair", symbol: "W", domain: "wayfair.com", provider: "GCP" },
  { name: "Kroger", symbol: "KR", domain: "kroger.com", provider: "GCP" },
  { name: "CVS Health", symbol: "CVS", domain: "cvs.com", provider: "GCP" },
  { name: "UPS", symbol: "UPS", domain: "ups.com", provider: "GCP" },
  { name: "FedEx", symbol: "FDX", domain: "fedex.com", provider: "GCP" },
  { name: "Ford", symbol: "F", domain: "ford.com", provider: "GCP" },
  { name: "Goldman Sachs", symbol: "GS", domain: "goldmansachs.com", provider: "GCP" },

  // Azure - Microsoft's cloud platform
  { name: "Microsoft", symbol: "MSFT", domain: "microsoft.com", provider: "Azure" },
  { name: "LinkedIn", symbol: "MSFT", domain: "linkedin.com", provider: "Azure" },
  { name: "GitHub", symbol: "MSFT", domain: "github.com", provider: "Azure" },
  { name: "OpenAI", symbol: "OPENAI", domain: "openai.com", provider: "Azure" },
  { name: "Walmart", symbol: "WMT", domain: "walmart.com", provider: "Azure" },
  { name: "Boeing", symbol: "BA", domain: "boeing.com", provider: "Azure" },
  { name: "Starbucks", symbol: "SBUX", domain: "starbucks.com", provider: "Azure" },
  { name: "AT&T", symbol: "T", domain: "att.com", provider: "Azure" },
  { name: "ExxonMobil", symbol: "XOM", domain: "exxonmobil.com", provider: "Azure" },
  { name: "Chevron", symbol: "CVX", domain: "chevron.com", provider: "Azure" },
  { name: "Walgreens", symbol: "WBA", domain: "walgreens.com", provider: "Azure" },
  { name: "3M", symbol: "MMM", domain: "3m.com", provider: "Azure" },
  { name: "Caterpillar", symbol: "CAT", domain: "caterpillar.com", provider: "Azure" },
  { name: "Deere & Company", symbol: "DE", domain: "deere.com", provider: "Azure" },
  { name: "Honeywell", symbol: "HON", domain: "honeywell.com", provider: "Azure" },
  { name: "Lockheed Martin", symbol: "LMT", domain: "lockheedmartin.com", provider: "Azure" },
  { name: "Raytheon", symbol: "RTX", domain: "rtx.com", provider: "Azure" },
  { name: "Uber", symbol: "UBER", domain: "uber.com", provider: "Azure" },
  { name: "DoorDash", symbol: "DASH", domain: "doordash.com", provider: "Azure" },

  // Oracle Cloud
  { name: "Oracle", symbol: "ORCL", domain: "oracle.com", provider: "Oracle" },
  { name: "Zoom", symbol: "ZM", domain: "zoom.us", provider: "Oracle" },
  { name: "8x8", symbol: "EGHT", domain: "8x8.com", provider: "Oracle" },
  { name: "Dyn", symbol: "DYN", domain: "dyn.com", provider: "Oracle" },
  { name: "Netsuite", symbol: "N", domain: "netsuite.com", provider: "Oracle" },

  // Alibaba Cloud
  { name: "Alibaba", symbol: "BABA", domain: "alibaba.com", provider: "Alibaba" },
  { name: "AliExpress", symbol: "BABA", domain: "aliexpress.com", provider: "Alibaba" },
  { name: "Taobao", symbol: "BABA", domain: "taobao.com", provider: "Alibaba" },
  { name: "Tmall", symbol: "BABA", domain: "tmall.com", provider: "Alibaba" },

  // Self-hosted / Other
  { name: "Apple", symbol: "AAPL", domain: "apple.com", provider: "Other" },
  { name: "Meta/Facebook", symbol: "META", domain: "facebook.com", provider: "Other" },
  { name: "Google", symbol: "GOOGL", domain: "google.com", provider: "Other" },
  { name: "Amazon", symbol: "AMZN", domain: "amazon.com", provider: "Other" },
  { name: "Tesla", symbol: "TSLA", domain: "tesla.com", provider: "Other" },
  { name: "Cloudflare", symbol: "NET", domain: "cloudflare.com", provider: "Other" },
]
