export interface CartItemWithProduct {
  id: number;
  sessionId: string;
  productId: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    description: string;
    price: string;
    category: string;
    brand: string;
    imageUrl: string;
    stock: number;
    isActive: boolean;
    specifications: string | null;
    compatibility: string | null;
    deliveryTime: string;
  };
}

export interface OrderItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
}

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  total: string;
  items: string; // JSON string of OrderItem[]
}
