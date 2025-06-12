import { pgTable, text, serial, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // 'printers', 'ink', 'paper', 'supplies'
  brand: text("brand").notNull().default("HP"),
  imageUrl: text("image_url").notNull(),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  specifications: text("specifications"), // JSON string
  compatibility: text("compatibility"), // JSON string for compatible models
  deliveryTime: text("delivery_time").notNull().default("Same Day"), // 'Same Day', 'Next Day', '2-3 Days'
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("Processing"), // 'Processing', 'In Transit', 'Delivered', 'Cancelled'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  items: text("items").notNull(), // JSON string of order items
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
});

export const updateProductSchema = insertProductSchema.partial();

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
