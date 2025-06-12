import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/cart-store";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CartItemWithProduct } from "@/lib/types";

export default function Cart() {
  const { sessionId, setCartCount } = useCartStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: [`/api/cart/${sessionId}`],
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      return apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    },
  });

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    updateCartMutation.mutate({ id, quantity });
  };

  const removeItem = (id: number) => {
    removeFromCartMutation.mutate(id);
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product ? parseFloat(item.product.price) * item.quantity : 0);
  }, 0);

  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
                ))}
              </div>
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some amazing HP products to get started!</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-20 h-20">
                      <img
                        src={item.product?.imageUrl}
                        alt={item.product?.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.product?.description.substring(0, 100)}...
                      </p>
                      <p className="text-lg font-bold text-hp-blue mt-2">
                        ${item.product?.price}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updateCartMutation.isPending}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                        disabled={updateCartMutation.isPending}
                      />
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updateCartMutation.isPending}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={removeFromCartMutation.isPending}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                
                {shipping > 0 && (
                  <p className="text-sm text-gray-600">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                
                <div className="space-y-2">
                  <Link href="/checkout">
                    <Button className="w-full bg-hp-blue hover:bg-blue-700">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
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
