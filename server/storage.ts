import { products, orders, cartItems, type Product, type InsertProduct, type UpdateProduct, type Order, type InsertOrder, type CartItem, type InsertCartItem } from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: UpdateProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Cart Items
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private cartItems: Map<number, CartItem>;
  private currentProductId: number;
  private currentOrderId: number;
  private currentCartItemId: number;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.cartItems = new Map();
    this.currentProductId = 1;
    this.currentOrderId = 1;
    this.currentCartItemId = 1;
    
    // Initialize with sample products
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleProducts: InsertProduct[] = [
      // Home Printers
      {
        name: "HP DeskJet 3755",
        description: "Compact All-in-One Wireless Printer - Perfect for home use with mobile printing",
        price: "89.99",
        category: "home-printers",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 45,
        isActive: true,
        specifications: JSON.stringify({
          "Print Speed": "Up to 8 ppm black, 5.5 ppm color",
          "Connectivity": "Wi-Fi, USB",
          "Paper Size": "Up to 8.5 x 14 inches",
          "Monthly Duty Cycle": "Up to 1,000 pages"
        }),
        compatibility: JSON.stringify(["HP 65 Black", "HP 65 Tri-color"]),
        deliveryTime: "Same Day"
      },
      {
        name: "HP ENVY 6055e",
        description: "All-in-One Wireless Color Inkjet Printer with Smart Tasks - Ideal for home offices",
        price: "129.99",
        category: "home-printers",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 38,
        isActive: true,
        specifications: JSON.stringify({
          "Print Speed": "Up to 10 ppm black, 7 ppm color",
          "Connectivity": "Wi-Fi, USB, Bluetooth",
          "Paper Size": "Up to 8.5 x 14 inches",
          "Monthly Duty Cycle": "Up to 1,000 pages"
        }),
        compatibility: JSON.stringify(["HP 67 Black", "HP 67 Tri-color"]),
        deliveryTime: "Same Day"
      },
      // Office Printers
      {
        name: "HP OfficeJet Pro 9015e",
        description: "Smart Office All-in-One with Fast Print Speeds - Built for business productivity",
        price: "179.99",
        category: "office-printers",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 32,
        isActive: true,
        specifications: JSON.stringify({
          "Print Speed": "Up to 22 ppm black, 18 ppm color",
          "Connectivity": "Wi-Fi, Ethernet, USB",
          "Paper Size": "Up to 8.5 x 14 inches",
          "Monthly Duty Cycle": "Up to 25,000 pages"
        }),
        compatibility: JSON.stringify(["HP 962 Black", "HP 962 Cyan", "HP 962 Magenta", "HP 962 Yellow"]),
        deliveryTime: "Next Day"
      },
      {
        name: "HP OfficeJet Pro 8025e",
        description: "All-in-One Color Printer with Advanced Security - Perfect for small businesses",
        price: "199.99",
        category: "office-printers",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 25,
        isActive: true,
        specifications: JSON.stringify({
          "Print Speed": "Up to 20 ppm black, 10 ppm color",
          "Connectivity": "Wi-Fi, Ethernet, USB, Fax",
          "Paper Size": "Up to 8.5 x 14 inches",
          "Monthly Duty Cycle": "Up to 20,000 pages"
        }),
        compatibility: JSON.stringify(["HP 952 Black", "HP 952 Cyan", "HP 952 Magenta", "HP 952 Yellow"]),
        deliveryTime: "Next Day"
      },
      // Inkjet Printers
      {
        name: "HP ENVY Photo 7855",
        description: "Premium All-in-One Photo Printer - Professional quality prints with vibrant colors",
        price: "149.99",
        category: "inkjet-printers",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 22,
        isActive: true,
        specifications: JSON.stringify({
          "Print Speed": "Up to 15 ppm black, 10 ppm color",
          "Connectivity": "Wi-Fi, USB, SD Card",
          "Paper Size": "Up to 8.5 x 14 inches",
          "Photo Printing": "4x6 borderless in 43 seconds"
        }),
        compatibility: JSON.stringify(["HP 64 Black", "HP 64 Tri-color", "HP 64 Photo Black"]),
        deliveryTime: "Same Day"
      },
      {
        name: "HP DeskJet 4155e",
        description: "Wireless All-in-One Inkjet Printer - Affordable printing for everyday needs",
        price: "79.99",
        category: "inkjet-printers",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 55,
        isActive: true,
        specifications: JSON.stringify({
          "Print Speed": "Up to 8.5 ppm black, 5.5 ppm color",
          "Connectivity": "Wi-Fi, USB",
          "Paper Size": "Up to 8.5 x 14 inches",
          "Monthly Duty Cycle": "Up to 1,000 pages"
        }),
        compatibility: JSON.stringify(["HP 67 Black", "HP 67 Tri-color"]),
        deliveryTime: "Same Day"
      },
      // Laser Printers
      {
        name: "HP LaserJet Pro M404dn",
        description: "Monochrome Laser Printer with Ethernet - Fast, reliable printing for offices",
        price: "249.99",
        category: "laser-printers",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 28,
        isActive: true,
        specifications: JSON.stringify({
          "Print Speed": "Up to 38 ppm",
          "Connectivity": "Ethernet, USB",
          "Paper Size": "Up to 8.5 x 14 inches",
          "Monthly Duty Cycle": "Up to 80,000 pages"
        }),
        compatibility: JSON.stringify(["HP 58A Black"]),
        deliveryTime: "Next Day"
      },
      {
        name: "HP Color LaserJet Pro M255dw",
        description: "Wireless Color Laser Printer - Professional color printing with fast speeds",
        price: "329.99",
        category: "laser-printers",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 18,
        isActive: true,
        specifications: JSON.stringify({
          "Print Speed": "Up to 22 ppm color and black",
          "Connectivity": "Wi-Fi, Ethernet, USB",
          "Paper Size": "Up to 8.5 x 14 inches",
          "Monthly Duty Cycle": "Up to 40,000 pages"
        }),
        compatibility: JSON.stringify(["HP 207A Black", "HP 207A Cyan", "HP 207A Magenta", "HP 207A Yellow"]),
        deliveryTime: "Next Day"
      },
      {
        name: "HP LaserJet Enterprise M507dn",
        description: "Enterprise Monochrome Laser Printer - High-volume printing with advanced security",
        price: "449.99",
        category: "laser-printers",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 12,
        isActive: true,
        specifications: JSON.stringify({
          "Print Speed": "Up to 45 ppm",
          "Connectivity": "Ethernet, USB",
          "Paper Size": "Up to 8.5 x 14 inches",
          "Monthly Duty Cycle": "Up to 150,000 pages"
        }),
        compatibility: JSON.stringify(["HP 89A Black", "HP 89X Black High Yield"]),
        deliveryTime: "Next Day"
      },
      {
        name: "HP 65 Ink Combo Pack",
        description: "Original HP 65 Black & Tri-color Ink Cartridges - 2 Cartridges",
        price: "49.99",
        category: "ink",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 8,
        isActive: true,
        specifications: JSON.stringify({
          "Page Yield": "Approx. 120 pages black, 100 pages color",
          "Ink Type": "Dye-based",
          "Colors": "Black, Cyan, Magenta, Yellow"
        }),
        compatibility: JSON.stringify(["HP DeskJet 3755", "HP DeskJet 2655", "HP DeskJet 3700"]),
        deliveryTime: "Same Day"
      },
      {
        name: "HP 962 XL High Yield Ink Set",
        description: "High Yield Black, Cyan, Magenta & Yellow Ink Cartridges - 4 Pack",
        price: "89.99",
        category: "ink",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 15,
        isActive: true,
        specifications: JSON.stringify({
          "Page Yield": "Approx. 2000 pages black, 1600 pages color",
          "Ink Type": "Pigment-based",
          "Colors": "Black, Cyan, Magenta, Yellow"
        }),
        compatibility: JSON.stringify(["HP OfficeJet Pro 9015e", "HP OfficeJet Pro 9025e"]),
        deliveryTime: "Same Day"
      },
      {
        name: "HP Multipurpose Paper",
        description: "8.5\" x 11\" 20lb Copy Paper - 500 Sheets per Ream",
        price: "12.99",
        category: "paper",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 120,
        isActive: true,
        specifications: JSON.stringify({
          "Weight": "20 lb",
          "Brightness": "92",
          "Opacity": "94%"
        }),
        compatibility: JSON.stringify(["All HP Printers"]),
        deliveryTime: "Same Day"
      },
      {
        name: "HP Premium Photo Paper",
        description: "Glossy Photo Paper 4x6 inch - 100 Sheets",
        price: "19.99",
        category: "paper",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 75,
        isActive: true,
        specifications: JSON.stringify({
          "Finish": "Glossy",
          "Weight": "60 lb",
          "Size": "4 x 6 inches"
        }),
        compatibility: JSON.stringify(["All HP Inkjet Printers"]),
        deliveryTime: "Same Day"
      },
      {
        name: "HP USB Cable",
        description: "USB 2.0 A-to-B Cable for HP Printers - 6 feet",
        price: "14.99",
        category: "supplies",
        brand: "HP",
        imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        stock: 50,
        isActive: true,
        specifications: JSON.stringify({
          "Length": "6 feet",
          "Type": "USB 2.0 A-to-B",
          "Compatibility": "Most HP Printers"
        }),
        compatibility: JSON.stringify(["Most HP Printers"]),
        deliveryTime: "Same Day"
      }
    ];

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category && p.isActive);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      brand: insertProduct.brand || "HP",
      stock: insertProduct.stock || 0,
      isActive: insertProduct.isActive ?? true,
      specifications: insertProduct.specifications || null,
      compatibility: insertProduct.compatibility || null,
      deliveryTime: insertProduct.deliveryTime || "Same Day"
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updateProduct: UpdateProduct): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct: Product = { ...existingProduct, ...updateProduct };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = { 
      ...insertOrder, 
      id,
      status: insertOrder.status || "Processing",
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const existingOrder = this.orders.get(id);
    if (!existingOrder) return undefined;
    
    const updatedOrder: Order = { ...existingOrder, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Cart Items
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    const quantity = insertCartItem.quantity || 1;
    
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === insertCartItem.sessionId && item.productId === insertCartItem.productId
    );

    if (existingItem) {
      // Update quantity instead of adding new item
      const updatedItem: CartItem = { 
        ...existingItem, 
        quantity: existingItem.quantity + quantity 
      };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }

    const id = this.currentCartItemId++;
    const cartItem: CartItem = { ...insertCartItem, id, quantity };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const existingItem = this.cartItems.get(id);
    if (!existingItem) return undefined;
    
    const updatedItem: CartItem = { ...existingItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const cartItems = Array.from(this.cartItems.entries()).filter(
      ([_, item]) => item.sessionId === sessionId
    );
    
    cartItems.forEach(([id]) => {
      this.cartItems.delete(id);
    });
    
    return true;
  }
}

export const storage = new MemStorage();
