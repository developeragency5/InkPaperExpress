import { useState } from "react";
import { MessageCircle, Phone, Mail, Clock, HelpCircle, FileText, User, Send } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function CustomerService() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    orderNumber: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageSubmitted, setMessageSubmitted] = useState(false);

  const contactSubjects = [
    "Order Status",
    "Product Question",
    "Technical Support", 
    "Returns & Exchanges",
    "Billing Issue",
    "Shipping Problem",
    "Product Recommendation",
    "Other"
  ];

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setMessageSubmitted(true);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Service</h1>
          <p className="text-xl text-gray-600">
            We're here to help! Get in touch with our friendly support team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Options */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Phone Support</div>
                    <div className="text-sm text-gray-600">1-800-INK-HELP</div>
                    <div className="text-xs text-gray-500">Mon-Fri 8AM-8PM EST</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Email Support</div>
                    <div className="text-sm text-gray-600">support@inkpaperexpress.com</div>
                    <div className="text-xs text-gray-500">Response within 24 hours</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Live Chat</div>
                    <div className="text-sm text-gray-600">Available now</div>
                    <Badge className="text-xs bg-green-100 text-green-800 mt-1">Online</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Support Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 8:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>10:00 AM - 4:00 PM EST</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Track Your Order
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Returns & Exchanges
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Warranty Information
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Product Manuals
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {!messageSubmitted ? (
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <Input
                        type="text"
                        placeholder="Your full name"
                        value={contactForm.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        value={contactForm.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Number (if applicable)
                      </label>
                      <Input
                        type="text"
                        placeholder="IPE-2024-XXXXXX"
                        value={contactForm.orderNumber}
                        onChange={(e) => handleInputChange("orderNumber", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Select 
                        value={contactForm.subject} 
                        onValueChange={(value) => handleInputChange("subject", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {contactSubjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      placeholder="Please describe your question or issue in detail..."
                      value={contactForm.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message || isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? "Sending..." : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500">
                    * Required fields. We typically respond within 24 hours during business days.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <MessageCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h2>
                    <p className="text-gray-600 mb-6">
                      Thank you for contacting us. We've received your message and will respond within 24 hours.
                    </p>
                    
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-2">What happens next?</h3>
                      <ul className="text-left text-sm text-gray-600 space-y-2">
                        <li>• We'll review your message and assign it to the right specialist</li>
                        <li>• You'll receive an email confirmation with a ticket number</li>
                        <li>• Our team will respond with a solution or follow-up questions</li>
                        <li>• For urgent issues, please call our support line</li>
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setMessageSubmitted(false);
                          setContactForm({
                            name: "",
                            email: "",
                            orderNumber: "",
                            subject: "",
                            message: ""
                          });
                        }}
                      >
                        Send Another Message
                      </Button>
                      <Button variant="outline">
                        Call Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      How can I track my order?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Use our order tracking page with your order number or USPS tracking number. 
                      You'll get real-time updates on your shipment status.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      What's your return policy?
                    </h4>
                    <p className="text-sm text-gray-600">
                      We offer 30-day returns on unopened items with free return shipping. 
                      Visit our Returns page to start the process.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Do you offer technical support?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Yes! Our technical support team can help with printer setup, 
                      troubleshooting, and compatibility questions.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      How long does shipping take?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Standard USPS shipping takes 2-3 business days. Orders over $50 
                      ship free, while orders under $50 have a $9.99 shipping fee.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Are your products genuine HP?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Absolutely! We only sell authentic HP products with full manufacturer 
                      warranties. All items are sourced directly from HP.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Can I cancel or modify my order?
                    </h4>
                    <p className="text-sm text-gray-600">
                      Contact us immediately if you need to modify your order. 
                      We can make changes before the item ships from our warehouse.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}