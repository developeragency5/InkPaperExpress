import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, Zap, Target, Globe, Search, Filter, ArrowUpDown, ShoppingCart } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { Product } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // Initialize SEO for homepage
  useSEO();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Check for search parameter in URL when products are loaded
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam && products.length > 0) {
      setSearchQuery(searchParam);
      const results = products.filter(product => 
        product.name.toLowerCase().includes(searchParam.toLowerCase()) ||
        product.description.toLowerCase().includes(searchParam.toLowerCase()) ||
        product.category.toLowerCase().includes(searchParam.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [products]);

  const categories = [
    { label: "All Products", value: "all", icon: Package },
    { label: "Printers", value: "printers", icon: Package },
    { label: "Ink Cartridges", value: "ink", icon: Zap },
    { label: "Paper", value: "paper", icon: Target },
    { label: "Supplies", value: "supplies", icon: Globe },
  ];

  // Get search suggestions based on query
  const getSearchSuggestions = (query: string): Product[] => {
    if (!query.trim() || query.length < 2) return [];
    
    return products
      .filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchSuggestions(false);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length >= 2) {
      setShowSearchSuggestions(true);
    } else {
      setShowSearchSuggestions(false);
    }
    // Clear search results when input changes
    if (searchResults.length > 0) {
      setSearchResults([]);
    }
  };

  const selectSuggestion = (product: Product) => {
    setSearchQuery(product.name);
    setShowSearchSuggestions(false);
    setSearchResults([product]);
  };

  // Filter products based on search and category
  let filteredProducts = searchResults.length > 0 ? searchResults : products;
  
  if (selectedCategory !== "all" && searchResults.length === 0) {
    filteredProducts = products.filter(product => product.category === selectedCategory);
  }
  
  if (searchQuery && searchResults.length === 0) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return parseFloat(a.price) - parseFloat(b.price);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Ink & Paper Express
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Your trusted source for HP printers, ink cartridges, and paper supplies. 
              Fast delivery, authentic products, competitive prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/printers">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Shop Printers
                </Button>
              </Link>
              <Link href="/category/ink">
                <Button size="lg" className="bg-blue-500 text-white hover:bg-blue-600">
                  Shop Ink Cartridges
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const href = category.value === "all" ? "/" : 
                          category.value === "printers" ? "/printers" : 
                          `/category/${category.value}`;
              
              return (
                <Link key={category.value} href={href}>
                  <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 hover:border-blue-500">
                    <CardContent className="p-6 text-center">
                      <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{category.label}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {category.value === "all" ? "All products" : 
                         category.value === "printers" ? "4 Subcategories" :
                         category.value === "ink" ? "Original HP Ink" :
                         category.value === "paper" ? "Premium Quality" :
                         "Cables & More"}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Our Products</h2>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 cursor-pointer hover:text-blue-600 transition-colors" 
                  onClick={handleSearch}
                />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  onFocus={() => {
                    if (searchQuery.length >= 2) {
                      setShowSearchSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow clicks
                    setTimeout(() => setShowSearchSuggestions(false), 200);
                  }}
                  className="pl-10 w-full sm:w-64"
                />
                
                {/* Search Suggestions Dropdown */}
                {showSearchSuggestions && searchQuery.length >= 2 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                    {getSearchSuggestions(searchQuery).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => selectSuggestion(product)}
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.category}</div>
                        </div>
                        <div className="font-bold text-blue-600">${product.price}</div>
                      </div>
                    ))}
                    {getSearchSuggestions(searchQuery).length === 0 && (
                      <div className="p-3 text-gray-500 text-sm">No products found</div>
                    )}
                  </div>
                )}
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No products found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}