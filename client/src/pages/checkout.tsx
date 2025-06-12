import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Lock, CheckCircle, Truck } from "lucide-react";
import { Link, useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCartStore } from "@/lib/cart-store";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CartItemWithProduct, OrderItem } from "@/lib/types";

const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  shippingAddress: z.string().min(10, "Please provide a complete address"),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export default function Checkout() {
  const { sessionId, setCartCount } = useCartStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: [`/api/cart/${sessionId}`],
  });

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      shippingAddress: "",
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: CheckoutFormData) => {
      const orderItems: OrderItem[] = cartItems.map(item => ({
        productId: item.productId,
        name: item.product?.name || '',
        price: item.product?.price || '0',
        quantity: item.quantity,
      }));

      const subtotal = cartItems.reduce((sum, item) => {
        return sum + (item.product ? parseFloat(item.product.price) * item.quantity : 0);
      }, 0);

      const shipping = subtotal > 50 ? 0 : 9.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      const order = await apiRequest("POST", "/api/orders", {
        ...orderData,
        total: total.toFixed(2),
        items: JSON.stringify(orderItems),
      });

      // Clear cart after successful order
      await apiRequest("DELETE", `/api/cart/session/${sessionId}`);

      return order;
    },
    onSuccess: (response) => {
      setCartCount(0);
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      
      // Parse the response to get order ID
      response.json().then((order) => {
        setOrderId(order.id);
        setOrderPlaced(true);
        toast({
          title: "Order placed successfully!",
          description: "Thank you for your order. You will receive a confirmation email shortly.",
        });
      });
    },
    onError: () => {
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product ? parseFloat(item.product.price) * item.quantity : 0);
  }, 0);

  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;





  const onSubmit = (data: CheckoutFormData) => {
    placeOrderMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-lg h-96"></div>
              <div className="bg-gray-200 rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
            <Link href="/">
              <Button className="bg-hp-blue hover:bg-blue-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="p-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
              <p className="text-gray-600 mb-2">Thank you for your order.</p>
              {orderId && (
                <p className="text-gray-600 mb-8">Order #ORD-{orderId.toString().padStart(3, '0')}</p>
              )}
              <p className="text-sm text-gray-500 mb-8">
                You will receive a confirmation email with tracking information shortly.
              </p>
              <div className="space-x-4">
                <Link href="/">
                  <Button className="bg-hp-blue hover:bg-blue-700">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="outline">
                    View Admin Panel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Secure Checkout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="123 Main St, City, State 12345"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Shipping Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Truck className="h-5 w-5 mr-2" />
                        Shipping Details
                      </h3>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-full bg-blue-100">
                            <Truck className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">Standard USPS Shipping</h4>
                              <div className="text-right">
                                <div className="font-bold text-lg text-green-600">FREE on orders $50+</div>
                                <div className="text-sm text-gray-500">2-3 business days</div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">Direct shipping from our warehouse with USPS tracking</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">USPS tracking</span>
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Reliable delivery</span>
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Free on $50+</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Payment Information
                      </h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Demo Mode:</strong> This is a demonstration checkout. 
                          No actual payment will be processed.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={placeOrderMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {placeOrderMutation.isPending ? "Placing Order..." : `Place Order - $${total.toFixed(2)}`}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12">
                        <img
                          src={item.product?.imageUrl}
                          alt={item.product?.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product?.name}
                        </p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${(parseFloat(item.product?.price || '0') * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <hr />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    🚛 <strong>Fast Delivery:</strong> Your order will be delivered within 24-48 hours.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
