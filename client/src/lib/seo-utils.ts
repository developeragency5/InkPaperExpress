// SEO utilities for sitemap generation and robots.txt management

export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function generateSitemap(baseUrl: string = 'https://inkpaperexpress.com'): string {
  const entries: SitemapEntry[] = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/printers`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/category/ink`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/category/paper`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/category/supplies`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'never',
      priority: 0.3
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'never',
      priority: 0.3
    },
    {
      url: `${baseUrl}/order-tracking`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'never',
      priority: 0.4
    },
    {
      url: `${baseUrl}/returns`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/customer-service`,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'monthly',
      priority: 0.6
    }
  ];

  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const urlsetClose = '</urlset>';

  const urls = entries.map(entry => {
    return `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
  }).join('\n');

  return xmlHeader + urlsetOpen + urls + '\n' + urlsetClose;
}

export function generateRobotsTxt(baseUrl: string = 'https://inkpaperexpress.com'): string {
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout
Disallow: /cart

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow specific search engines full access
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Block sensitive areas
User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$
Disallow: /*?*sessionId=*
Disallow: /*?*cart=*
`;
}

export function addProductToSitemap(productId: string, baseUrl: string = 'https://inkpaperexpress.com'): SitemapEntry {
  return {
    url: `${baseUrl}/product/${productId}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly',
    priority: 0.7
  };
}

export function generateProductsSitemap(productIds: string[], baseUrl: string = 'https://inkpaperexpress.com'): string {
  const productEntries = productIds.map(id => addProductToSitemap(id, baseUrl));
  
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const urlsetClose = '</urlset>';

  const urls = productEntries.map(entry => {
    return `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
  }).join('\n');

  return xmlHeader + urlsetOpen + urls + '\n' + urlsetClose;
}

// Generate JSON-LD structured data for better search engine understanding
export function generateOrganizationSchema(baseUrl: string = 'https://inkpaperexpress.com') {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ink & Paper Express",
    "description": "Premium printer supplies and office equipment retailer specializing in HP products",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-800-555-0123",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://www.facebook.com/inkpaperexpress",
      "https://www.twitter.com/inkpaperexpress",
      "https://www.linkedin.com/company/inkpaperexpress"
    ]
  };
}

export function generateWebsiteSchema(baseUrl: string = 'https://inkpaperexpress.com') {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ink & Paper Express",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}