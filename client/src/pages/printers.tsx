import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Monitor, Home, Droplets, Zap, Clock, Award, Shield, Star } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";

export default function Printers() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const printerCategories = [
    {
      id: "home-printers",
      title: "Home Printers",
      subtitle: "Perfect for family use",
      description: "Compact, affordable printers designed for everyday home printing needs",
      icon: Home,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      features: ["Easy Setup", "Mobile Print", "Compact Size"],
      count: products.filter(p => p.category === "home-printers").length,
      priceRange: "$79 - $149"
    },
    {
      id: "office-printers",
      title: "Office Printers",
      subtitle: "Built for productivity",
      description: "High-performance printers with advanced features for business environments",
      icon: Monitor,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      features: ["High Volume", "Fast Speed", "Security"],
      count: products.filter(p => p.category === "office-printers").length,
      priceRange: "$179 - $299"
    },
    {
      id: "inkjet-printers",
      title: "Inkjet Printers",
      subtitle: "Superior color quality",
      description: "Versatile inkjet technology for documents and high-quality photo printing",
      icon: Droplets,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      features: ["Photo Quality", "Color Accuracy", "Versatile"],
      count: products.filter(p => p.category === "inkjet-printers").length,
      priceRange: "$79 - $179"
    },
    {
      id: "laser-printers",
      title: "Laser Printers",
      subtitle: "Fast & efficient",
      description: "Professional laser printing for sharp text and high-volume printing needs",
      icon: Zap,
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
      features: ["Fast Print", "Sharp Text", "Cost Efficient"],
      count: products.filter(p => p.category === "laser-printers").length,
      priceRange: "$249 - $499"
    }
  ];

  const featuredPrinters = products.filter(p => 
    ["home-printers", "office-printers", "inkjet-printers", "laser-printers"].includes(p.category)
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-gray-100 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <Badge className="bg-blue-600 text-white border-blue-600 px-4 py-2 mb-6">
              Complete HP Printer Collection
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900">
              Find Your Perfect
              <span className="block text-blue-600">
                HP Printer
              </span>
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto mb-12">
              From compact home printers to powerful office workhorses, discover the complete range 
              of HP printing solutions with ultra-fast delivery
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{products.filter(p => p.category.includes("printers")).length}+</div>
                <div className="text-sm text-gray-600">Printer Models</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">2-3</div>
                <div className="text-sm text-gray-600">Days Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">4.9</div>
                <div className="text-sm text-gray-600">Customer Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Authentic HP</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Printer Categories Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Printer Type</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect printer category for your specific needs and discover our curated collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {printerCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.id} href={`/category/${category.id}`}>
                  <Card className="group cursor-pointer border-2 hover:border-hp-blue transition-all duration-300 hover:shadow-2xl h-full">
                    <CardContent className="p-0">
                      {/* Header Section */}
                      <div className={`${category.color} ${category.hoverColor} transition-colors p-8 text-white relative overflow-hidden`}>
                        <div className="absolute top-4 right-4 opacity-20">
                          <IconComponent className="h-24 w-24" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-white/20 rounded-xl p-3">
                              <IconComponent className="h-8 w-8" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold">{category.title}</h3>
                              <p className="text-white/80">{category.subtitle}</p>
                            </div>
                          </div>
                          <p className="text-white/90 leading-relaxed">{category.description}</p>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-8">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">{category.count}</div>
                            <div className="text-sm text-gray-600">Models Available</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-hp-blue">{category.priceRange}</div>
                            <div className="text-sm text-gray-600">Price Range</div>
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          <h4 className="font-semibold text-gray-900">Key Features:</h4>
                          <div className="flex flex-wrap gap-2">
                            {category.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full bg-hp-blue hover:bg-blue-700 group-hover:bg-blue-700">
                          Explore {category.title}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Printers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured HP Printers</h2>
            <p className="text-xl text-gray-600">
              Handpicked bestsellers across all printer categories
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPrinters.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose HP Printers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose HP Printers?</h2>
            <p className="text-xl text-gray-600">
              Trusted by millions worldwide for reliable, high-quality printing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Award className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Industry Leading Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  HP printers are engineered for reliability and consistent performance, 
                  backed by decades of innovation in printing technology.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Advanced Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  Built-in security features protect your sensitive documents and 
                  prevent unauthorized access to your printer and network.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Star className="h-10 w-10 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Features</h3>
                <p className="text-gray-600 leading-relaxed">
                  Smart tasks, mobile printing, and cloud connectivity make 
                  HP printers the most convenient choice for modern workflows.
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