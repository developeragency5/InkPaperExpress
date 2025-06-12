import { useEffect } from "react";
import { useLocation } from "wouter";

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

const defaultSEOSettings: Record<string, SEOData> = {
  "/": {
    title: "Ink & Paper Express - Premium Printer Supplies & Fast Delivery",
    description: "Shop high-quality HP printer supplies, ink cartridges, and paper with fast nationwide delivery. Best prices on genuine and compatible cartridges.",
    keywords: "printer supplies, ink cartridges, HP printers, office supplies, fast delivery",
    ogTitle: "Ink & Paper Express - Your Printer Supply Headquarters",
    ogDescription: "Discover premium printer supplies with unbeatable prices and lightning-fast delivery nationwide.",
    ogImage: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=1200&h=630&fit=crop",
    canonicalUrl: "https://inkpaperexpress.com/"
  },
  "/printers": {
    title: "HP Printers - All-in-One & Inkjet Printers | Ink & Paper Express",
    description: "Browse our selection of HP printers including all-in-one, inkjet, and laser printers. Free shipping on orders over $50.",
    keywords: "HP printers, all-in-one printers, inkjet printers, laser printers, office printers",
    ogTitle: "Shop HP Printers - Best Selection & Prices",
    ogDescription: "Find the perfect HP printer for your home or office with our comprehensive selection and expert support.",
    ogImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=630&fit=crop",
    canonicalUrl: "https://inkpaperexpress.com/printers"
  },
  "/category/ink": {
    title: "HP Ink Cartridges - Genuine & Compatible | Ink & Paper Express",
    description: "High-quality HP ink cartridges at unbeatable prices. Genuine and compatible options available with fast shipping.",
    keywords: "HP ink cartridges, printer ink, genuine cartridges, compatible cartridges, ink refills",
    ogTitle: "Premium HP Ink Cartridges - Guaranteed Quality",
    ogDescription: "Save big on genuine and compatible HP ink cartridges with our quality guarantee and fast delivery.",
    ogImage: "https://images.unsplash.com/photo-1586953135231-e5b8eea7d3f2?w=1200&h=630&fit=crop",
    canonicalUrl: "https://inkpaperexpress.com/category/ink"
  },
  "/category/paper": {
    title: "Premium Paper & Office Supplies | Ink & Paper Express",
    description: "Quality paper and office supplies for all your printing needs. From photo paper to multipurpose paper, we have it all.",
    keywords: "office paper, photo paper, printing paper, office supplies, stationery",
    ogTitle: "Quality Paper & Office Supplies - Fast Delivery",
    ogDescription: "Stock up on premium paper and office supplies with competitive prices and quick shipping.",
    ogImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop",
    canonicalUrl: "https://inkpaperexpress.com/category/paper"
  },
  "/cart": {
    title: "Shopping Cart | Ink & Paper Express",
    description: "Review your selected printer supplies and complete your order with fast, secure checkout.",
    keywords: "shopping cart, checkout, printer supplies order",
    canonicalUrl: "https://inkpaperexpress.com/cart"
  },
  "/checkout": {
    title: "Secure Checkout | Ink & Paper Express",
    description: "Complete your printer supplies order with our secure checkout process. Fast delivery available.",
    keywords: "secure checkout, order, printer supplies delivery",
    canonicalUrl: "https://inkpaperexpress.com/checkout"
  }
};

export function useSEO(customSEO?: Partial<SEOData>) {
  const [location] = useLocation();

  useEffect(() => {
    const currentSEO = defaultSEOSettings[location] || defaultSEOSettings["/"];
    const finalSEO = { ...currentSEO, ...customSEO };

    // Update document title
    document.title = finalSEO.title;

    // Update meta tags
    updateMetaTag("description", finalSEO.description);
    updateMetaTag("keywords", finalSEO.keywords);
    
    // Update Open Graph tags
    updateMetaProperty("og:title", finalSEO.ogTitle || finalSEO.title);
    updateMetaProperty("og:description", finalSEO.ogDescription || finalSEO.description);
    updateMetaProperty("og:url", finalSEO.canonicalUrl || `https://inkpaperexpress.com${location}`);
    
    if (finalSEO.ogImage) {
      updateMetaProperty("og:image", finalSEO.ogImage);
    }

    // Update Twitter Card tags
    updateMetaTag("twitter:title", finalSEO.ogTitle || finalSEO.title);
    updateMetaTag("twitter:description", finalSEO.ogDescription || finalSEO.description);
    
    if (finalSEO.ogImage) {
      updateMetaTag("twitter:image", finalSEO.ogImage);
    }

    // Update canonical URL
    updateCanonicalUrl(finalSEO.canonicalUrl || `https://inkpaperexpress.com${location}`);

    // Add structured data for product pages
    if (location.startsWith("/product/")) {
      addProductStructuredData();
    }

  }, [location, customSEO]);
}

function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateCanonicalUrl(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
}

function addProductStructuredData() {
  // Remove existing product structured data
  const existingScript = document.querySelector('script[data-type="product-schema"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new product structured data
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute("data-type", "product-schema");
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "HP Printer Product",
    "description": "High-quality printer supplies and accessories",
    "brand": {
      "@type": "Brand",
      "name": "HP"
    },
    "category": "Office Supplies",
    "availability": "https://schema.org/InStock",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "29.99",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Ink & Paper Express"
      }
    }
  });
  document.head.appendChild(script);
}

export function updateSEOSettings(path: string, seoData: SEOData) {
  defaultSEOSettings[path] = seoData;
}