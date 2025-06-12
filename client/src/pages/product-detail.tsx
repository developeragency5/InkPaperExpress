import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, Headphones, Check, ChevronRight, Plus, Minus, Camera, Play, FileText, Download, Zap, Wifi, Printer, Gauge } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Product } from "@shared/schema";
import { useCartStore } from "@/lib/cart-store";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/use-seo";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:productId");
  const productId = params?.productId;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState("overview");
  const { sessionId, incrementCartCount } = useCartStore();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
  });

  // Dynamic SEO based on product data
  useSEO(product ? {
    title: `${product.name} - ${product.category} | Ink & Paper Express`,
    description: `${product.description} - ${product.brand} ${product.category.toLowerCase()}. Price: $${product.price}. ${product.deliveryTime} delivery available.`,
    keywords: `${product.name}, ${product.brand}, ${product.category}, printer supplies, ${product.deliveryTime} delivery`,
    ogTitle: `${product.name} - Premium ${product.category}`,
    ogDescription: `Shop ${product.name} at the best price. ${product.description}`,
    ogImage: product.imageUrl
  } : undefined);

  // Mock product images (using copyright-free placeholder images)
  const productImages = [
    "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1586953135231-e5b8eea7d3f2?w=800&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=800&fit=crop&crop=left",
  ];

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await apiRequest("POST", "/api/cart", {
        sessionId,
        productId: product.id,
        quantity
      });
      
      incrementCartCount();
      toast({
        title: "Added to cart",
        description: `${quantity}x ${product.name} added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-blue-600 hover:text-blue-800">Home</a>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <a href="/printers" className="text-blue-600 hover:text-blue-800">Printers</a>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-blue-600" : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* 360° View & Video Buttons */}
            <div className="flex space-x-3">
              <Button variant="outline" className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                360° View
              </Button>
              <Button variant="outline" className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Watch Video
              </Button>
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.8/5) 2,341 reviews</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Best Seller
                </Badge>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Key Features */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center">
                  <Printer className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">All-in-One Printing</span>
                </div>
                <div className="flex items-center">
                  <Wifi className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">Wireless Connect</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">Fast Print Speed</span>
                </div>
                <div className="flex items-center">
                  <Gauge className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">High Quality</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                <span className="text-lg text-gray-500 line-through">$129.99</span>
                <Badge className="bg-red-100 text-red-800">Save $30</Badge>
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-600 font-medium">In Stock - {product.stock} available</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <div className="flex space-x-3">
                  <Button variant="outline" className="flex-1">
                    <Heart className="h-4 w-4 mr-2" />
                    Save for Later
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Service Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Free Shipping</div>
                  <div className="text-xs text-gray-600">On orders over $50</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <RotateCcw className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">30-Day Returns</div>
                  <div className="text-xs text-gray-600">Easy returns policy</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">2-Year Warranty</div>
                  <div className="text-xs text-gray-600">Manufacturer warranty</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Headphones className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-sm font-medium text-gray-900">24/7 Support</div>
                  <div className="text-xs text-gray-600">Expert help available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Overview</h3>
                  <p className="text-gray-600 mb-6">
                    This advanced all-in-one printer delivers professional-quality printing, scanning, and copying 
                    capabilities for both home and office environments. With wireless connectivity and mobile printing 
                    support, it seamlessly integrates into your workflow.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-3" />
                      <span className="text-sm">Print, scan, copy, and fax functionality</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-3" />
                      <span className="text-sm">Wireless and mobile printing support</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-3" />
                      <span className="text-sm">Automatic duplex printing</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-3" />
                      <span className="text-sm">High-yield ink cartridges</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What's in the Box</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• All-in-One Printer</li>
                    <li>• Setup ink cartridges (Black & Color)</li>
                    <li>• Power cord</li>
                    <li>• USB cable</li>
                    <li>• Setup guide</li>
                    <li>• Software CD</li>
                    <li>• Quick start guide</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Print Technology</span>
                        <span className="text-gray-600">Thermal Inkjet</span>
                      </div>
                    </div>
                    <div className="border-b pb-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Print Speed</span>
                        <span className="text-gray-600">Up to 15 ppm</span>
                      </div>
                    </div>
                    <div className="border-b pb-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Print Quality</span>
                        <span className="text-gray-600">Up to 4800 x 1200 dpi</span>
                      </div>
                    </div>
                    <div className="border-b pb-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Paper Sizes</span>
                        <span className="text-gray-600">A4, Letter, Legal, Photo</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Connectivity</h3>
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">WiFi</span>
                        <span className="text-gray-600">802.11b/g/n</span>
                      </div>
                    </div>
                    <div className="border-b pb-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">USB</span>
                        <span className="text-gray-600">USB 2.0</span>
                      </div>
                    </div>
                    <div className="border-b pb-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Mobile Printing</span>
                        <span className="text-gray-600">Yes</span>
                      </div>
                    </div>
                    <div className="border-b pb-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900">Cloud Printing</span>
                        <span className="text-gray-600">Supported</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Customer Reviews</h3>
                  <Button variant="outline">Write a Review</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">4.8</div>
                      <div className="flex justify-center items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Based on 2,341 reviews</div>
                    </div>
                    
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{rating}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Progress value={rating === 5 ? 85 : rating === 4 ? 12 : 2} className="flex-1" />
                          <span className="text-sm text-gray-600">
                            {rating === 5 ? '85%' : rating === 4 ? '12%' : '2%'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
                    {[1, 2, 3].map((review) => (
                      <Card key={review}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <div className="font-medium text-gray-900">Great printer for the price</div>
                            </div>
                            <div className="text-sm text-gray-500">2 days ago</div>
                          </div>
                          <p className="text-gray-600 text-sm">
                            This printer exceeded my expectations. Setup was easy, print quality is excellent, 
                            and the wireless connectivity works flawlessly. Highly recommended for home office use.
                          </p>
                          <div className="mt-3 text-sm text-gray-500">John D. - Verified Purchase</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="support" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Downloads & Resources</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download Driver (Windows)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Download Driver (Mac)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      User Manual (PDF)
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Quick Setup Guide
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>How do I set up wireless printing?</AccordionTrigger>
                      <AccordionContent>
                        Connect your printer to your WiFi network using the control panel. Download our mobile app 
                        or use the setup wizard included with the driver software.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>What ink cartridges does this printer use?</AccordionTrigger>
                      <AccordionContent>
                        This printer uses standard 65 series ink cartridges. We recommend using genuine cartridges 
                        for optimal print quality and reliability.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Is mobile printing supported?</AccordionTrigger>
                      <AccordionContent>
                        Yes, this printer supports printing from smartphones and tablets through our mobile app, 
                        AirPrint, and Google Cloud Print.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="compatibility" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">System Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Windows</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Windows 10, 8.1, 8, 7 SP1</li>
                        <li>• 1 GB RAM minimum</li>
                        <li>• 1.5 GB free disk space</li>
                        <li>• USB port or WiFi connection</li>
                        <li>• Internet connection for setup</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Mac</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• macOS 10.14 or later</li>
                        <li>• 1 GB RAM minimum</li>
                        <li>• 1.5 GB free disk space</li>
                        <li>• USB port or WiFi connection</li>
                        <li>• Internet connection for setup</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 overflow-hidden rounded-t-lg">
                  <img
                    src={`https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=300&fit=crop&crop=center&q=${item}`}
                    alt="Related product"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    Related Printer Model {item}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">$89.99</span>
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}