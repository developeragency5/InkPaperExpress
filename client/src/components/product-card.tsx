import { Star, Truck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { useCartStore } from "@/lib/cart-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { sessionId, incrementCartCount } = useCartStore();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/cart", {
        sessionId,
        productId: product.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      incrementCartCount();
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getDeliveryColor = (deliveryTime: string) => {
    switch (deliveryTime) {
      case "Same Day":
        return "text-green-600";
      case "Next Day":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg group">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <Link href={`/product/${product.id}`}>
              <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <Link href={`/product/${product.id}`}>
              <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors">
                {product.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-lg font-bold text-hp-blue">${product.price}</div>
              <div className="flex items-center space-x-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-gray-500">(123)</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>

          <div className={`flex items-center text-sm ${getDeliveryColor(product.deliveryTime)}`}>
            <Truck className="h-4 w-4 mr-1" />
            <span>{product.deliveryTime} delivery</span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => addToCartMutation.mutate()}
              disabled={addToCartMutation.isPending || product.stock === 0}
              className="flex-1 bg-hp-blue hover:bg-blue-700"
            >
              {addToCartMutation.isPending ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Link href={`/product/${product.id}`}>
              <Button variant="outline" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
