import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Filter, SortAsc, Truck, Award, Clock } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";

export default function Category() {
  const [location] = useLocation();
  const [sortBy, setSortBy] = useState<string>("name");
  const [deliveryFilter, setDeliveryFilter] = useState<string>("all");
  
  // Extract category from URL path
  const pathParts = location.split("/");
  const category = pathParts[pathParts.length - 1];
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: [`/api/products?category=${category}`],
  });

  const categoryInfo = {
    printers: {
      title: "HP Printers",
      description: "Professional printers for home and office use",
      banner: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
      subtitle: "From compact home printers to powerful office workhorses",
      features: ["Wireless Connectivity", "Mobile Printing", "Duplex Printing", "High-Speed Output"]
    },
    "home-printers": {
      title: "Home Printers",
      description: "Compact and affordable printers perfect for home use",
      banner: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
      subtitle: "Easy-to-use printers designed for family and personal needs",
      features: ["Compact Design", "Wireless Setup", "Mobile Printing", "Affordable Ink"]
    },
    "office-printers": {
      title: "Office Printers",
      description: "High-performance printers built for business productivity",
      banner: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
      subtitle: "Professional printing solutions for modern workplaces",
      features: ["High Volume", "Fast Speeds", "Advanced Security", "Network Ready"]
    },
    "inkjet-printers": {
      title: "Inkjet Printers",
      description: "Versatile inkjet printers for documents and photos",
      banner: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
      subtitle: "Superior color printing and photo quality output",
      features: ["Photo Quality", "Color Accuracy", "Versatile Media", "Affordable Printing"]
    },
    "laser-printers": {
      title: "Laser Printers",
      description: "Fast and efficient laser printing technology",
      banner: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
      subtitle: "Professional laser printing for high-volume needs",
      features: ["Fast Printing", "Sharp Text", "High Volume", "Cost Efficient"]
    },
    ink: {
      title: "Ink Cartridges",
      description: "Original HP ink cartridges for superior print quality",
      banner: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
      subtitle: "Genuine HP ink for vibrant colors and sharp text",
      features: ["Original HP Quality", "High Page Yield", "Fade Resistant", "Easy Installation"]
    },
    paper: {
      title: "Paper & Media",
      description: "Premium paper for all your printing needs",
      banner: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
      subtitle: "From everyday printing to professional presentations",
      features: ["Bright White Finish", "Jam-Free Performance", "Various Sizes", "Professional Quality"]
    },
    supplies: {
      title: "Printer Supplies",
      description: "Essential accessories and supplies for your HP printer",
      banner: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
      subtitle: "Everything you need to keep your printer running smoothly",
      features: ["USB Cables", "Cleaning Kits", "Maintenance Tools", "Replacement Parts"]
    }
  };

  const currentCategory = categoryInfo[category as keyof typeof categoryInfo];

  // Filter and sort products
  let filteredProducts = [...products];
  
  if (deliveryFilter !== "all") {
    filteredProducts = filteredProducts.filter(product => product.deliveryTime === deliveryFilter);
  }

  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Category Not Found</h1>
            <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
            <Button onClick={() => window.history.back()} className="bg-hp-blue hover:bg-blue-700">
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Category Banner */}
      <section className="relative bg-gray-100 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="bg-blue-600 text-white border-blue-600 mb-4">
                {products.length} Products Available
              </Badge>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{currentCategory.title}</h1>
              <p className="text-xl mb-6 text-gray-700">{currentCategory.subtitle}</p>
              <p className="text-lg mb-8 text-gray-600">{currentCategory.description}</p>
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center text-gray-700">
                  <Truck className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="text-sm font-medium">Fast Delivery</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Award className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="text-sm font-medium">Genuine HP</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </div>
            
            <div>
              <Card className="bg-white/90 border-gray-200 backdrop-blur-sm shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Key Features</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {currentCategory.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="bg-white border-b py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredProducts.length} {currentCategory.title} Found
              </h2>
              <p className="text-sm text-gray-600">
                Shop authentic HP products with fast delivery
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by delivery" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Delivery Times</SelectItem>
                  <SelectItem value="Same Day">Same Day</SelectItem>
                  <SelectItem value="Next Day">Next Day</SelectItem>
                  <SelectItem value="2-3 Days">2-3 Days</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Filter className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or browse our other categories.
              </p>
              <Button 
                onClick={() => {
                  setDeliveryFilter("all");
                  setSortBy("name");
                }}
                className="bg-hp-blue hover:bg-blue-700"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Category Benefits */}
      <section className="bg-white py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Ink & Paper Express for {currentCategory.title}?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to delivering the fastest, most reliable service for all your HP printing needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="bg-hp-light rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-hp-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Lightning Fast Delivery</h3>
                <p className="text-gray-600">
                  Same-day delivery available on most {currentCategory.title.toLowerCase()}. 
                  Get what you need when you need it.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">100% Authentic</h3>
                <p className="text-gray-600">
                  Only genuine HP products with full manufacturer warranty. 
                  Quality you can trust.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
                <p className="text-gray-600">
                  24/7 customer support from HP specialists. 
                  Get help choosing the right products.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}