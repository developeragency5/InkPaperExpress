import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertOrderSchema, insertCartItemSchema, updateProductSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      const products = category 
        ? await storage.getProductsByCategory(category as string)
        : await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = updateProductSchema.parse(req.body);
      const product = await storage.updateProduct(id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Order tracking endpoint
  app.get("/api/orders/track/:identifier", async (req, res) => {
    try {
      const { identifier } = req.params;
      const orders = await storage.getOrders();
      
      // Search by order ID or tracking number (stored in items field for now)
      const order = orders.find(o => 
        o.id.toString() === identifier || 
        o.customerEmail === identifier ||
        o.customerName.toLowerCase().includes(identifier.toLowerCase())
      );
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Generate tracking timeline based on order status and creation date
      const timeline = generateOrderTimeline(order);
      
      res.json({
        ...order,
        timeline,
        trackingNumber: `USPS${order.id.toString().padStart(12, '0')}`,
        estimatedDelivery: getEstimatedDelivery(order)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to track order" });
    }
  });

  function generateOrderTimeline(order: any) {
    const baseDate = new Date(order.createdAt);
    const timeline = [
      {
        status: "Order Placed",
        date: baseDate.toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        completed: true,
        icon: 'Package'
      },
      {
        status: "Order Processed",
        date: new Date(baseDate.getTime() + 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        completed: order.status !== 'pending',
        icon: 'CheckCircle'
      }
    ];

    if (order.status === 'shipped' || order.status === 'delivered') {
      timeline.push({
        status: "Shipped",
        date: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        completed: true,
        icon: 'Truck'
      });

      timeline.push({
        status: "In Transit",
        date: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        completed: true,
        icon: 'MapPin'
      });
    }

    if (order.status === 'delivered') {
      timeline.push({
        status: "Delivered",
        date: new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        completed: true,
        icon: 'CheckCircle'
      });
    } else {
      timeline.push({
        status: "Out for Delivery",
        date: `Expected ${new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        completed: false,
        icon: 'Truck'
      });

      timeline.push({
        status: "Delivered",
        date: `Expected ${new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        completed: false,
        icon: 'CheckCircle'
      });
    }

    return timeline;
  }

  function getEstimatedDelivery(order: any) {
    const baseDate = new Date(order.createdAt);
    return new Date(baseDate.getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric'
    });
  }

  // Cart
  app.get("/api/cart/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const cartItems = await storage.getCartItems(sessionId);
      
      // Get product details for each cart item
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      
      res.json(cartWithProducts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(id, quantity);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.removeFromCart(id);
      if (!deleted) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove cart item" });
    }
  });

  app.delete("/api/cart/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.clearCart(sessionId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // SEO Routes for search engines
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const baseUrl = process.env.BASE_URL || "https://inkpaperexpress.com";
      
      // Generate main sitemap with static pages
      const staticPages = [
        { url: `${baseUrl}/`, priority: 1.0, changefreq: 'daily' },
        { url: `${baseUrl}/printers`, priority: 0.9, changefreq: 'weekly' },
        { url: `${baseUrl}/category/ink`, priority: 0.9, changefreq: 'weekly' },
        { url: `${baseUrl}/category/paper`, priority: 0.8, changefreq: 'weekly' },
        { url: `${baseUrl}/category/supplies`, priority: 0.8, changefreq: 'weekly' },
        { url: `${baseUrl}/returns`, priority: 0.5, changefreq: 'monthly' },
        { url: `${baseUrl}/customer-service`, priority: 0.6, changefreq: 'monthly' },
        { url: `${baseUrl}/order-tracking`, priority: 0.4, changefreq: 'never' }
      ];

      // Add product pages
      const productPages = products.map(product => ({
        url: `${baseUrl}/product/${product.id}`,
        priority: 0.7,
        changefreq: 'weekly'
      }));

      const allPages = [...staticPages, ...productPages];
      const currentDate = new Date().toISOString().split('T')[0];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate sitemap" });
    }
  });

  app.get("/robots.txt", (req, res) => {
    const baseUrl = process.env.BASE_URL || "https://inkpaperexpress.com";
    const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout
Disallow: /cart

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow specific search engines full access
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Block sensitive areas
User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$
Disallow: /*?*sessionId=*
Disallow: /*?*cart=*`;

    res.set('Content-Type', 'text/plain');
    res.send(robots);
  });

  const httpServer = createServer(app);
  return httpServer;
}
