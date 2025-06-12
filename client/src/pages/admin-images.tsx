import { useState } from "react";
import { Upload, Image, Save, X, Eye, Edit2, Plus, Search as SearchIcon, Globe, FileText, Trash2 } from "lucide-react";
import Header from "@/components/layout/header";
import AdminSidebar from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { updateSEOSettings } from "@/hooks/use-seo";
import { generateSitemap, generateRobotsTxt } from "@/lib/seo-utils";

interface WebsiteImage {
  id: string;
  name: string;
  url: string;
  category: string;
  page: string;
  description: string;
  altText: string;
  dimensions: string;
  fileSize: string;
  lastUpdated: string;
}

interface SEOSettings {
  page: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterCard: string;
  schemaType: string;
  schemaData: string;
  robotsDirective: string;
  hreflangTags: string;
  structuredData: string;
  focusKeyword: string;
  readabilityScore: number;
  seoScore: number;
  lastUpdated: string;
}

export default function AdminImages() {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<WebsiteImage | null>(null);
  const [selectedSEO, setSelectedSEO] = useState<SEOSettings | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [altText, setAltText] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPage, setSelectedPage] = useState("all");

  // Website images data
  const [websiteImages, setWebsiteImages] = useState<WebsiteImage[]>([
    {
      id: "hero-home",
      name: "Homepage Hero Banner",
      url: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=1200&h=600&fit=crop",
      category: "Hero Banners",
      page: "Homepage",
      description: "Main hero banner for homepage",
      altText: "Professional printer and office supplies",
      dimensions: "1200x600",
      fileSize: "245 KB",
      lastUpdated: "2024-12-11"
    },
    {
      id: "hero-printers",
      name: "Printers Page Hero",
      url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=600&fit=crop",
      category: "Hero Banners",
      page: "Printers",
      description: "Hero banner for printers category page",
      altText: "Modern printer showcase",
      dimensions: "1200x600",
      fileSize: "198 KB",
      lastUpdated: "2024-12-11"
    },
    {
      id: "hero-ink",
      name: "Ink Cartridges Hero",
      url: "https://images.unsplash.com/photo-1586953135231-e5b8eea7d3f2?w=1200&h=600&fit=crop",
      category: "Hero Banners",
      page: "Ink Cartridges",
      description: "Hero banner for ink cartridges page",
      altText: "Colorful ink cartridges display",
      dimensions: "1200x600",
      fileSize: "167 KB",
      lastUpdated: "2024-12-11"
    },
    {
      id: "about-team",
      name: "About Us Team Photo",
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      category: "About Section",
      page: "Homepage",
      description: "Team photo for about us section",
      altText: "Our professional team at work",
      dimensions: "800x600",
      fileSize: "134 KB",
      lastUpdated: "2024-12-11"
    },
    {
      id: "feature-delivery",
      name: "Fast Delivery Feature",
      url: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop",
      category: "Features",
      page: "All Pages",
      description: "Image representing fast delivery service",
      altText: "Fast delivery truck on the road",
      dimensions: "400x300",
      fileSize: "89 KB",
      lastUpdated: "2024-12-11"
    },
    {
      id: "feature-support",
      name: "Customer Support Feature",
      url: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=400&h=300&fit=crop",
      category: "Features",
      page: "All Pages",
      description: "Customer support representative",
      altText: "Friendly customer support agent",
      dimensions: "400x300",
      fileSize: "76 KB",
      lastUpdated: "2024-12-11"
    }
  ]);

  // Enhanced SEO settings data
  const [seoSettings, setSeoSettings] = useState<SEOSettings[]>([
    {
      page: "Homepage",
      title: "Ink & Paper Express - Premium Printer Supplies & Fast Delivery",
      description: "Shop high-quality HP printer supplies, ink cartridges, and paper with fast nationwide delivery. Best prices on genuine and compatible cartridges.",
      keywords: "printer supplies, ink cartridges, HP printers, office supplies, fast delivery",
      ogTitle: "Ink & Paper Express - Your Printer Supply Headquarters",
      ogDescription: "Discover premium printer supplies with unbeatable prices and lightning-fast delivery nationwide.",
      ogImage: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=1200&h=630&fit=crop",
      canonicalUrl: "https://inkpaperexpress.com/",
      twitterTitle: "Ink & Paper Express - Premium Printer Supplies",
      twitterDescription: "Get the best deals on HP printer supplies with lightning-fast delivery nationwide.",
      twitterImage: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=1200&h=630&fit=crop",
      twitterCard: "summary_large_image",
      schemaType: "LocalBusiness",
      schemaData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Ink & Paper Express",
        "description": "Premium printer supplies retailer",
        "url": "https://inkpaperexpress.com",
        "telephone": "+1-800-555-0123"
      }),
      robotsDirective: "index, follow",
      hreflangTags: "en-US",
      structuredData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Ink & Paper Express",
        "url": "https://inkpaperexpress.com"
      }),
      focusKeyword: "printer supplies",
      readabilityScore: 85,
      seoScore: 92,
      lastUpdated: "2024-12-11"
    },
    {
      page: "Printers",
      title: "HP Printers - All-in-One & Inkjet Printers | Ink & Paper Express",
      description: "Browse our selection of HP printers including all-in-one, inkjet, and laser printers. Free shipping on orders over $50.",
      keywords: "HP printers, all-in-one printers, inkjet printers, laser printers, office printers",
      ogTitle: "Shop HP Printers - Best Selection & Prices",
      ogDescription: "Find the perfect HP printer for your home or office with our comprehensive selection and expert support.",
      ogImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=630&fit=crop",
      canonicalUrl: "https://inkpaperexpress.com/printers",
      twitterTitle: "HP Printers - Best Selection & Prices",
      twitterDescription: "Shop our complete range of HP printers with expert support and fast shipping.",
      twitterImage: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=630&fit=crop",
      twitterCard: "summary_large_image",
      schemaType: "ProductCategory",
      schemaData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "category": "Printers",
        "brand": {"@type": "Brand", "name": "HP"}
      }),
      robotsDirective: "index, follow",
      hreflangTags: "en-US",
      structuredData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "HP Printers Collection"
      }),
      focusKeyword: "HP printers",
      readabilityScore: 88,
      seoScore: 89,
      lastUpdated: "2024-12-11"
    },
    {
      page: "Ink Cartridges",
      title: "HP Ink Cartridges - Genuine & Compatible | Ink & Paper Express",
      description: "High-quality HP ink cartridges at unbeatable prices. Genuine and compatible options available with fast shipping.",
      keywords: "HP ink cartridges, printer ink, genuine cartridges, compatible cartridges, ink refills",
      ogTitle: "Premium HP Ink Cartridges - Guaranteed Quality",
      ogDescription: "Save big on genuine and compatible HP ink cartridges with our quality guarantee and fast delivery.",
      ogImage: "https://images.unsplash.com/photo-1586953135231-e5b8eea7d3f2?w=1200&h=630&fit=crop",
      canonicalUrl: "https://inkpaperexpress.com/category/ink",
      twitterTitle: "HP Ink Cartridges - Genuine & Compatible",
      twitterDescription: "Quality ink cartridges at unbeatable prices with fast shipping and quality guarantee.",
      twitterImage: "https://images.unsplash.com/photo-1586953135231-e5b8eea7d3f2?w=1200&h=630&fit=crop",
      twitterCard: "summary_large_image",
      schemaType: "Product",
      schemaData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "HP Ink Cartridges",
        "category": "Office Supplies"
      }),
      robotsDirective: "index, follow",
      hreflangTags: "en-US",
      structuredData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "OfferCatalog",
        "name": "Ink Cartridges"
      }),
      focusKeyword: "ink cartridges",
      readabilityScore: 86,
      seoScore: 91,
      lastUpdated: "2024-12-11"
    },
    {
      page: "Paper & Supplies",
      title: "Premium Paper & Office Supplies | Ink & Paper Express",
      description: "Quality paper and office supplies for all your printing needs. From photo paper to multipurpose paper, we have it all.",
      keywords: "office paper, photo paper, printing paper, office supplies, stationery",
      ogTitle: "Quality Paper & Office Supplies - Fast Delivery",
      ogDescription: "Stock up on premium paper and office supplies with competitive prices and quick shipping.",
      ogImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop",
      canonicalUrl: "https://inkpaperexpress.com/category/paper",
      twitterTitle: "Premium Paper & Office Supplies",
      twitterDescription: "Everything you need for printing - from photo paper to office supplies with fast delivery.",
      twitterImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=630&fit=crop",
      twitterCard: "summary_large_image",
      schemaType: "Product",
      schemaData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Office Paper & Supplies",
        "category": "Office Supplies"
      }),
      robotsDirective: "index, follow",
      hreflangTags: "en-US",
      structuredData: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Paper & Office Supplies"
      }),
      focusKeyword: "office paper",
      readabilityScore: 84,
      seoScore: 87,
      lastUpdated: "2024-12-11"
    }
  ]);

  const imageCategories = [
    "Hero Banners",
    "Product Images", 
    "Feature Images",
    "About Section",
    "Logos & Icons",
    "Background Images"
  ];

  const pages = [
    "Homepage",
    "Printers",
    "Ink Cartridges", 
    "Paper & Supplies",
    "About Us",
    "Contact",
    "All Pages"
  ];

  // Filter functions
  const filteredImages = websiteImages.filter(image => {
    const matchesSearch = image.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPage = selectedPage === "all" || image.page === selectedPage;
    return matchesSearch && matchesPage;
  });

  // Image management functions
  const openImageDialog = (image: WebsiteImage) => {
    setSelectedImage(image);
    setImageUrl(image.url);
    setImageDescription(image.description);
    setAltText(image.altText);
  };

  const saveImageChanges = () => {
    if (selectedImage) {
      const updatedImages = websiteImages.map(img => 
        img.id === selectedImage.id 
          ? { 
              ...img, 
              url: imageUrl, 
              description: imageDescription,
              altText: altText,
              lastUpdated: new Date().toISOString().split('T')[0] 
            }
          : img
      );
      setWebsiteImages(updatedImages);
      setSelectedImage(null);
      setImageUrl("");
      setImageDescription("");
      setAltText("");
      toast({
        title: "Image Updated",
        description: "The image has been successfully updated.",
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newImage: WebsiteImage = {
        id: `img-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: URL.createObjectURL(file),
        category: "Product Images",
        page: "Homepage",
        description: "New uploaded image",
        altText: file.name.replace(/\.[^/.]+$/, ""),
        dimensions: "800x600",
        fileSize: `${Math.round(file.size / 1024)} KB`,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      setWebsiteImages([...websiteImages, newImage]);
      setUploadingImage(false);
      toast({
        title: "Image Uploaded",
        description: "New image has been successfully uploaded.",
      });
    }, 2000);
  };

  const deleteImage = (imageId: string) => {
    setWebsiteImages(websiteImages.filter(img => img.id !== imageId));
    toast({
      title: "Image Deleted",
      description: "The image has been removed from the website.",
    });
  };

  // SEO management functions
  const openSEODialog = (seo: SEOSettings) => {
    setSelectedSEO(seo);
  };

  const saveSEOChanges = () => {
    if (selectedSEO) {
      const updatedSEO = seoSettings.map(seo => 
        seo.page === selectedSEO.page 
          ? { ...selectedSEO, lastUpdated: new Date().toISOString().split('T')[0] }
          : seo
      );
      setSeoSettings(updatedSEO);
      
      // Update live SEO settings for immediate search engine indexing
      const pagePath = getPagePath(selectedSEO.page);
      updateSEOSettings(pagePath, {
        title: selectedSEO.title,
        description: selectedSEO.description,
        keywords: selectedSEO.keywords,
        ogTitle: selectedSEO.ogTitle,
        ogDescription: selectedSEO.ogDescription,
        ogImage: selectedSEO.ogImage,
        canonicalUrl: selectedSEO.canonicalUrl
      });
      
      setSelectedSEO(null);
      toast({
        title: "SEO Updated & Applied",
        description: "SEO settings updated and immediately applied to the live website for search engine indexing.",
      });
    }
  };

  // Helper function to convert page names to URL paths
  const getPagePath = (pageName: string): string => {
    const pathMap: Record<string, string> = {
      "Homepage": "/",
      "Printers": "/printers",
      "Ink Cartridges": "/category/ink",
      "Paper & Supplies": "/category/paper",
      "About Us": "/about",
      "Contact": "/contact"
    };
    return pathMap[pageName] || "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      <div className="flex-1">
        <Header />
        
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Pages Management</h1>
            <p className="text-gray-600">Manage website images, content, and SEO settings for each page</p>
          </div>

          <Tabs defaultValue="images" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="images" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Images & Media
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                SEO Settings
              </TabsTrigger>
            </TabsList>

            {/* Images Management Tab */}
            <TabsContent value="images" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search images..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={selectedPage} onValueChange={setSelectedPage}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Pages</SelectItem>
                      {pages.filter(page => page !== "All Pages").map(page => (
                        <SelectItem key={page} value={page}>{page}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button asChild disabled={uploadingImage}>
                      <span className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-100 relative group">
                      <img
                        src={image.url}
                        alt={image.altText}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <Button size="sm" variant="secondary" onClick={() => window.open(image.url, '_blank')}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{image.name}</h3>
                        <Badge variant="secondary" className="text-xs ml-2">
                          {image.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-blue-600 mb-1">{image.page}</p>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{image.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                        <span>{image.dimensions}</span>
                        <span>{image.fileSize}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Updated: {image.lastUpdated}</span>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => openImageDialog(image)}>
                                <Edit2 className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Image: {selectedImage?.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                  <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Invalid+URL";
                                    }}
                                  />
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                  <div>
                                    <Label htmlFor="image-url">Image URL</Label>
                                    <Input
                                      id="image-url"
                                      value={imageUrl}
                                      onChange={(e) => setImageUrl(e.target.value)}
                                      placeholder="https://example.com/image.jpg"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="alt-text">Alt Text (SEO)</Label>
                                    <Input
                                      id="alt-text"
                                      value={altText}
                                      onChange={(e) => setAltText(e.target.value)}
                                      placeholder="Descriptive text for screen readers"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="image-description">Description</Label>
                                    <Textarea
                                      id="image-description"
                                      value={imageDescription}
                                      onChange={(e) => setImageDescription(e.target.value)}
                                      placeholder="Brief description of the image"
                                      rows={3}
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                  <Button variant="outline" onClick={() => setSelectedImage(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={saveImageChanges}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => deleteImage(image.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* SEO Management Tab */}
            <TabsContent value="seo" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {seoSettings.map((seo) => (
                  <Card key={seo.page} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{seo.page}</CardTitle>
                        <Badge variant="outline">SEO Ready</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Page Title</Label>
                        <p className="text-sm text-gray-600 line-clamp-2">{seo.title}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Meta Description</Label>
                        <p className="text-sm text-gray-600 line-clamp-3">{seo.description}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Keywords</Label>
                        <p className="text-sm text-gray-600">{seo.keywords}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-gray-400">Updated: {seo.lastUpdated}</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => openSEODialog(seo)}>
                              <Edit2 className="h-3 w-3 mr-2" />
                              Edit SEO
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>SEO Settings: {selectedSEO?.page}</DialogTitle>
                            </DialogHeader>
                            {selectedSEO && (
                              <Tabs defaultValue="basic" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                  <TabsTrigger value="basic">Basic SEO</TabsTrigger>
                                  <TabsTrigger value="social">Social Media</TabsTrigger>
                                  <TabsTrigger value="technical">Technical</TabsTrigger>
                                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="basic" className="space-y-4 mt-4">
                                  <div className="grid grid-cols-1 gap-4">
                                    <div>
                                      <Label htmlFor="seo-title">Page Title</Label>
                                      <Input
                                        id="seo-title"
                                        value={selectedSEO.title}
                                        onChange={(e) => setSelectedSEO({...selectedSEO, title: e.target.value})}
                                        placeholder="Page title for search engines"
                                      />
                                      <p className="text-xs text-gray-500 mt-1">
                                        {selectedSEO.title.length}/60 characters
                                      </p>
                                    </div>
                                    <div>
                                      <Label htmlFor="seo-description">Meta Description</Label>
                                      <Textarea
                                        id="seo-description"
                                        value={selectedSEO.description}
                                        onChange={(e) => setSelectedSEO({...selectedSEO, description: e.target.value})}
                                        placeholder="Brief description for search results"
                                        rows={3}
                                      />
                                      <p className="text-xs text-gray-500 mt-1">
                                        {selectedSEO.description.length}/160 characters
                                      </p>
                                    </div>
                                    <div>
                                      <Label htmlFor="focus-keyword">Focus Keyword</Label>
                                      <Input
                                        id="focus-keyword"
                                        value={selectedSEO.focusKeyword}
                                        onChange={(e) => setSelectedSEO({...selectedSEO, focusKeyword: e.target.value})}
                                        placeholder="Primary keyword for this page"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="seo-keywords">Keywords</Label>
                                      <Textarea
                                        id="seo-keywords"
                                        value={selectedSEO.keywords}
                                        onChange={(e) => setSelectedSEO({...selectedSEO, keywords: e.target.value})}
                                        placeholder="keyword1, keyword2, keyword3"
                                        rows={2}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="canonical-url">Canonical URL</Label>
                                      <Input
                                        id="canonical-url"
                                        value={selectedSEO.canonicalUrl}
                                        onChange={(e) => setSelectedSEO({...selectedSEO, canonicalUrl: e.target.value})}
                                        placeholder="https://example.com/page"
                                      />
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="social" className="space-y-4 mt-4">
                                  <div className="space-y-4">
                                    <h4 className="font-medium text-sm">Open Graph (Facebook, LinkedIn)</h4>
                                    <div className="grid grid-cols-1 gap-4">
                                      <div>
                                        <Label htmlFor="og-title">Open Graph Title</Label>
                                        <Input
                                          id="og-title"
                                          value={selectedSEO.ogTitle}
                                          onChange={(e) => setSelectedSEO({...selectedSEO, ogTitle: e.target.value})}
                                          placeholder="Title for social media sharing"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="og-description">Open Graph Description</Label>
                                        <Textarea
                                          id="og-description"
                                          value={selectedSEO.ogDescription}
                                          onChange={(e) => setSelectedSEO({...selectedSEO, ogDescription: e.target.value})}
                                          placeholder="Description for social media sharing"
                                          rows={2}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="og-image">Open Graph Image URL</Label>
                                        <Input
                                          id="og-image"
                                          value={selectedSEO.ogImage}
                                          onChange={(e) => setSelectedSEO({...selectedSEO, ogImage: e.target.value})}
                                          placeholder="https://example.com/image.jpg"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Recommended: 1200x630 pixels</p>
                                      </div>
                                    </div>
                                    
                                    <h4 className="font-medium text-sm mt-6">Twitter Cards</h4>
                                    <div className="grid grid-cols-1 gap-4">
                                      <div>
                                        <Label htmlFor="twitter-card">Twitter Card Type</Label>
                                        <Select 
                                          value={selectedSEO.twitterCard} 
                                          onValueChange={(value) => setSelectedSEO({...selectedSEO, twitterCard: value})}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select card type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="summary">Summary</SelectItem>
                                            <SelectItem value="summary_large_image">Summary Large Image</SelectItem>
                                            <SelectItem value="app">App</SelectItem>
                                            <SelectItem value="player">Player</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label htmlFor="twitter-title">Twitter Title</Label>
                                        <Input
                                          id="twitter-title"
                                          value={selectedSEO.twitterTitle}
                                          onChange={(e) => setSelectedSEO({...selectedSEO, twitterTitle: e.target.value})}
                                          placeholder="Title for Twitter sharing"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="twitter-description">Twitter Description</Label>
                                        <Textarea
                                          id="twitter-description"
                                          value={selectedSEO.twitterDescription}
                                          onChange={(e) => setSelectedSEO({...selectedSEO, twitterDescription: e.target.value})}
                                          placeholder="Description for Twitter sharing"
                                          rows={2}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="twitter-image">Twitter Image URL</Label>
                                        <Input
                                          id="twitter-image"
                                          value={selectedSEO.twitterImage}
                                          onChange={(e) => setSelectedSEO({...selectedSEO, twitterImage: e.target.value})}
                                          placeholder="https://example.com/image.jpg"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="technical" className="space-y-4 mt-4">
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="robots-directive">Robots Directive</Label>
                                      <Select 
                                        value={selectedSEO.robotsDirective} 
                                        onValueChange={(value) => setSelectedSEO({...selectedSEO, robotsDirective: value})}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select robots directive" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="index, follow">Index, Follow</SelectItem>
                                          <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                                          <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                                          <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="hreflang">Hreflang Tags</Label>
                                      <Input
                                        id="hreflang"
                                        value={selectedSEO.hreflangTags}
                                        onChange={(e) => setSelectedSEO({...selectedSEO, hreflangTags: e.target.value})}
                                        placeholder="en-US, es-ES, fr-FR"
                                      />
                                      <p className="text-xs text-gray-500 mt-1">Language and region codes</p>
                                    </div>
                                    <div>
                                      <Label htmlFor="schema-type">Schema Type</Label>
                                      <Select 
                                        value={selectedSEO.schemaType} 
                                        onValueChange={(value) => setSelectedSEO({...selectedSEO, schemaType: value})}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select schema type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="WebPage">WebPage</SelectItem>
                                          <SelectItem value="Product">Product</SelectItem>
                                          <SelectItem value="LocalBusiness">LocalBusiness</SelectItem>
                                          <SelectItem value="Organization">Organization</SelectItem>
                                          <SelectItem value="Article">Article</SelectItem>
                                          <SelectItem value="CollectionPage">CollectionPage</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">SEO Score</Label>
                                        <div className="flex items-center space-x-2 mt-1">
                                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div 
                                              className={`h-2 rounded-full ${
                                                selectedSEO.seoScore >= 80 ? 'bg-green-500' :
                                                selectedSEO.seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                              }`}
                                              style={{ width: `${selectedSEO.seoScore}%` }}
                                            />
                                          </div>
                                          <span className="text-sm font-medium">{selectedSEO.seoScore}/100</span>
                                        </div>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Readability Score</Label>
                                        <div className="flex items-center space-x-2 mt-1">
                                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div 
                                              className={`h-2 rounded-full ${
                                                selectedSEO.readabilityScore >= 80 ? 'bg-green-500' :
                                                selectedSEO.readabilityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                              }`}
                                              style={{ width: `${selectedSEO.readabilityScore}%` }}
                                            />
                                          </div>
                                          <span className="text-sm font-medium">{selectedSEO.readabilityScore}/100</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </TabsContent>

                                <TabsContent value="advanced" className="space-y-4 mt-4">
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="schema-data">Schema.org Structured Data (JSON-LD)</Label>
                                      <Textarea
                                        id="schema-data"
                                        value={selectedSEO.schemaData}
                                        onChange={(e) => setSelectedSEO({...selectedSEO, schemaData: e.target.value})}
                                        placeholder='{"@context": "https://schema.org", "@type": "Product", "name": "..."}'
                                        rows={6}
                                        className="font-mono text-xs"
                                      />
                                      <p className="text-xs text-gray-500 mt-1">Valid JSON-LD structured data for search engines</p>
                                    </div>
                                    <div>
                                      <Label htmlFor="structured-data">Additional Structured Data</Label>
                                      <Textarea
                                        id="structured-data"
                                        value={selectedSEO.structuredData}
                                        onChange={(e) => setSelectedSEO({...selectedSEO, structuredData: e.target.value})}
                                        placeholder="Additional schema markup for enhanced search results"
                                        rows={4}
                                        className="font-mono text-xs"
                                      />
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                      <h4 className="font-medium text-sm text-blue-900 mb-2">AI & Search Engine Optimization</h4>
                                      <ul className="text-xs text-blue-800 space-y-1">
                                        <li>• Structured data helps AI understand page content</li>
                                        <li>• Rich snippets improve search result appearance</li>
                                        <li>• Schema markup enables voice search optimization</li>
                                        <li>• Enhanced crawling for better indexing</li>
                                      </ul>
                                    </div>
                                  </div>
                                </TabsContent>

                                <div className="flex justify-end gap-2 pt-4">
                                  <Button variant="outline" onClick={() => setSelectedSEO(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={saveSEOChanges}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save SEO Settings
                                  </Button>
                                </div>
                              </Tabs>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}