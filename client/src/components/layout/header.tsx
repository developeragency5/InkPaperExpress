import { Search, ShoppingCart, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Product } from "@shared/schema";

export default function Header() {
  const [location, setLocation] = useLocation();
  const { sessionId, cartCount, setCartCount } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const { data: cartItems } = useQuery({
    queryKey: [`/api/cart/${sessionId}`],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  useEffect(() => {
    if (cartItems && Array.isArray(cartItems)) {
      const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalItems);
    }
  }, [cartItems, setCartCount]);

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
      // Navigate to home page with search results
      setLocation(`/?search=${encodeURIComponent(searchQuery)}`);
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
  };

  const selectSuggestion = (product: Product) => {
    setSearchQuery(product.name);
    setShowSearchSuggestions(false);
    // Navigate to home page with this specific product search
    setLocation(`/?search=${encodeURIComponent(product.name)}`);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0">
              <div>
                <h1 className="text-2xl font-bold text-hp-blue">Ink & Paper Express</h1>
                <p className="text-xs text-gray-500">Fastest Printer Supplies</p>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/printers" className="text-gray-700 hover:text-hp-blue font-medium">
                Printers
              </Link>
              <Link href="/category/ink" className="text-gray-700 hover:text-hp-blue font-medium">
                Ink Cartridges
              </Link>
              <Link href="/category/paper" className="text-gray-700 hover:text-hp-blue font-medium">
                Paper
              </Link>
              <Link href="/category/supplies" className="text-gray-700 hover:text-hp-blue font-medium">
                Supplies
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search 
                className="absolute left-3 top-3 h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors z-10" 
                onClick={handleSearch}
              />
              <Input
                type="text"
                placeholder="Search printers & supplies..."
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
                className="w-64 pl-10"
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
                        className="w-8 h-8 object-cover rounded mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.category}</div>
                      </div>
                      <div className="font-bold text-blue-600 text-sm">${product.price}</div>
                    </div>
                  ))}
                  {getSearchSuggestions(searchQuery).length === 0 && (
                    <div className="p-3 text-gray-500 text-sm">No products found</div>
                  )}
                </div>
              )}
            </div>
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/admin">
              <Button className="bg-hp-blue text-white hover:bg-blue-700">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
