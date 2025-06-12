import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function OrderTracking() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderFound, setOrderFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Mock order data for demonstration
  const mockOrder = {
    id: "IPE-2024-001234",
    status: "In Transit",
    trackingNumber: "9400110200830123456789",
    estimatedDelivery: "December 15, 2024",
    items: [
      { name: "HP DeskJet 3755 All-in-One Printer", quantity: 1, price: "89.99" },
      { name: "HP 65 Black Ink Cartridge", quantity: 2, price: "29.99" }
    ],
    shippingAddress: "123 Main St, Anytown, ST 12345",
    timeline: [
      { status: "Order Placed", date: "Dec 10, 2024 2:30 PM", completed: true, icon: Package },
      { status: "Order Processed", date: "Dec 11, 2024 9:15 AM", completed: true, icon: CheckCircle },
      { status: "Shipped", date: "Dec 12, 2024 11:45 AM", completed: true, icon: Truck },
      { status: "In Transit", date: "Dec 13, 2024 8:20 AM", completed: true, icon: MapPin },
      { status: "Out for Delivery", date: "Expected Dec 15", completed: false, icon: Truck },
      { status: "Delivered", date: "Expected Dec 15", completed: false, icon: CheckCircle }
    ]
  };

  const handleTrackOrder = () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setIsSearching(false);
      if (trackingNumber.trim()) {
        setOrderFound(true);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-xl text-gray-600">
            Enter your order number or tracking number to get real-time updates
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Order Lookup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter order number (IPE-2024-XXXXXX) or USPS tracking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="text-lg h-12"
                />
              </div>
              <Button 
                onClick={handleTrackOrder}
                disabled={isSearching || !trackingNumber.trim()}
                className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
              >
                {isSearching ? "Searching..." : "Track Order"}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              You can find your order number in your confirmation email
            </p>
          </CardContent>
        </Card>

        {/* Order Details */}
        {orderFound && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order #{mockOrder.id}</CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {mockOrder.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Tracking Number</h3>
                    <p className="text-gray-600 font-mono">{mockOrder.trackingNumber}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Estimated Delivery</h3>
                    <p className="text-gray-600">{mockOrder.estimatedDelivery}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-gray-600">{mockOrder.shippingAddress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrder.timeline.map((event, index) => {
                    const IconComponent = event.icon;
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          event.completed 
                            ? "bg-green-100 text-green-600" 
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${
                              event.completed ? "text-gray-900" : "text-gray-500"
                            }`}>
                              {event.status}
                            </h4>
                            <span className="text-sm text-gray-500">{event.date}</span>
                          </div>
                        </div>
                        {event.completed && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                  <p className="text-gray-600 mb-4">
                    If you have questions about your order, our customer service team is here to help.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="outline">
                      Contact Support
                    </Button>
                    <Button variant="outline">
                      Track with USPS
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Results */}
        {!orderFound && trackingNumber && !isSearching && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find an order with that number. Please check your order number and try again.
                </p>
                <Button variant="outline">
                  Contact Customer Service
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}