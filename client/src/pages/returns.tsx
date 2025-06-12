import { useState } from "react";
import { RotateCcw, Package, FileText, MessageCircle, CheckCircle, AlertCircle, Search, Truck, Clock } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Returns() {
  const [orderNumber, setOrderNumber] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [returnSubmitted, setReturnSubmitted] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [returnFound, setReturnFound] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const returnReasons = [
    "Defective product",
    "Wrong item received",
    "Damaged during shipping",
    "Not as described",
    "Changed my mind",
    "Compatibility issues",
    "Quality not as expected",
    "Other"
  ];

  // Mock return data
  const mockReturn = {
    id: "RET-2024-001234",
    orderNumber: "IPE-2024-001234",
    status: "Processing",
    returnReason: "Defective product",
    requestDate: "December 10, 2024",
    estimatedRefund: "December 18, 2024",
    refundAmount: "$119.98",
    timeline: [
      { status: "Return Requested", date: "Dec 10, 2024 2:30 PM", completed: true, icon: Package },
      { status: "Return Approved", date: "Dec 11, 2024 9:15 AM", completed: true, icon: CheckCircle },
      { status: "Return Label Sent", date: "Dec 11, 2024 10:30 AM", completed: true, icon: FileText },
      { status: "Item Shipped Back", date: "Dec 12, 2024 2:45 PM", completed: true, icon: Truck },
      { status: "Item Received", date: "Expected Dec 16", completed: false, icon: Package },
      { status: "Refund Processed", date: "Expected Dec 18", completed: false, icon: CheckCircle }
    ]
  };

  const handleSubmitReturn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setReturnSubmitted(true);
    }, 2000);
  };

  const handleTrackReturn = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      if (trackingNumber.trim()) {
        setReturnFound(true);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
          <p className="text-xl text-gray-600">
            We stand behind our products. If you're not satisfied, we're here to help.
          </p>
        </div>

        <Tabs defaultValue="request" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="request">Request Return</TabsTrigger>
            <TabsTrigger value="track">Track Return</TabsTrigger>
          </TabsList>

          <TabsContent value="track" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Track Your Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Enter return number (RET-2024-XXXXXX) or order number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="text-lg h-12"
                    />
                  </div>
                  <Button 
                    onClick={handleTrackReturn}
                    disabled={isSearching || !trackingNumber.trim()}
                    className="bg-blue-600 hover:bg-blue-700 h-12 px-8"
                  >
                    {isSearching ? "Searching..." : "Track Return"}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  You can find your return number in your return confirmation email
                </p>
              </CardContent>
            </Card>

            {returnFound && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Return #{mockReturn.id}</CardTitle>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {mockReturn.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Original Order</h3>
                        <p className="text-gray-600">{mockReturn.orderNumber}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Estimated Refund Date</h3>
                        <p className="text-gray-600">{mockReturn.estimatedRefund}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Refund Amount</h3>
                        <p className="text-gray-600 font-semibold">{mockReturn.refundAmount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Return Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockReturn.timeline.map((event, index) => {
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

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
                      <p className="text-gray-600 mb-4">
                        If you have questions about your return, our customer service team is here to help.
                      </p>
                      <Button variant="outline">
                        Contact Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="request">
            {!returnSubmitted ? (
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Return Policy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <RotateCcw className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">30-Day Returns</h3>
                        <p className="text-sm text-gray-600">
                          Return any unopened item within 30 days of purchase
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <Package className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Free Return Shipping</h3>
                        <p className="text-sm text-gray-600">
                          We provide prepaid return labels for your convenience
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Quick Refunds</h3>
                        <p className="text-sm text-gray-600">
                          Refunds processed within 3-5 business days
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Start a Return</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Number
                      </label>
                      <Input
                        type="text"
                        placeholder="IPE-2024-XXXXXX"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Found in your order confirmation email
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Return
                      </label>
                      <Select value={returnReason} onValueChange={setReturnReason}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {returnReasons.map((reason) => (
                            <SelectItem key={reason} value={reason}>
                              {reason}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Details
                      </label>
                      <Textarea
                        placeholder="Please provide any additional details about your return..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitReturn}
                      disabled={!orderNumber || !returnReason || isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? "Processing..." : "Submit Return Request"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Return Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900">Eligible Items</h4>
                          <p className="text-sm text-gray-600">
                            Unopened printers, unused ink cartridges, and unopened paper packages
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900">Special Conditions</h4>
                          <p className="text-sm text-gray-600">
                            Opened ink cartridges can only be returned if defective. Custom orders are final sale.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900">Packaging</h4>
                          <p className="text-sm text-gray-600">
                            Items must be returned in original packaging with all accessories
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Request Submitted</h2>
                    <p className="text-gray-600 mb-6">
                      Your return request has been received. You'll receive an email with return instructions
                      and a prepaid shipping label within 24 hours.
                    </p>
                    
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">Next Steps:</h3>
                      <ol className="text-left text-sm text-gray-600 space-y-2">
                        <li>1. Wait for email confirmation with return label</li>
                        <li>2. Package item in original packaging</li>
                        <li>3. Attach prepaid return label</li>
                        <li>4. Drop off at any USPS location</li>
                        <li>5. Track your return and refund status</li>
                      </ol>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        variant="outline"
                        onClick={() => setReturnSubmitted(false)}
                      >
                        Submit Another Return
                      </Button>
                      <Button variant="outline">
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  How long do refunds take to process?
                </h4>
                <p className="text-sm text-gray-600">
                  Once we receive your returned item, refunds are processed within 3-5 business days. 
                  You'll receive an email confirmation when the refund is issued.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Can I exchange an item for a different model?
                </h4>
                <p className="text-sm text-gray-600">
                  Yes! Contact our customer service team to arrange an exchange. 
                  Price differences will be refunded or charged accordingly.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  What if my item arrived damaged?
                </h4>
                <p className="text-sm text-gray-600">
                  Contact us immediately with photos of the damage. We'll arrange for a replacement 
                  or full refund at no cost to you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}