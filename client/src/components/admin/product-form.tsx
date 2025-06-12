import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Product } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  category: z.enum(["printers", "ink", "paper", "supplies"]),
  brand: z.string().min(1, "Brand is required"),
  imageUrl: z.string().url("Invalid image URL"),
  stock: z.number().min(0, "Stock cannot be negative"),
  isActive: z.boolean(),
  specifications: z.string().optional(),
  compatibility: z.string().optional(),
  deliveryTime: z.enum(["Same Day", "Next Day", "2-3 Days"]),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      category: product?.category as any || "printers",
      brand: product?.brand || "HP",
      imageUrl: product?.imageUrl || "",
      stock: product?.stock || 0,
      isActive: product?.isActive ?? true,
      specifications: product?.specifications || "",
      compatibility: product?.compatibility || "",
      deliveryTime: product?.deliveryTime as any || "Same Day",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const method = product ? "PUT" : "POST";
      const url = product ? `/api/products/${product.id}` : "/api/products";
      return apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: `Product ${product ? "updated" : "created"} successfully.`,
      });
      if (onSuccess) onSuccess();
      if (!product) form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${product ? "update" : "create"} product. Please try again.`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    createProductMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="HP DeskJet 3755" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="HP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="All-in-One Wireless Printer..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="89.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="printers">Printers</SelectItem>
                        <SelectItem value="ink">Ink Cartridges</SelectItem>
                        <SelectItem value="paper">Paper</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deliveryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Same Day">Same Day</SelectItem>
                        <SelectItem value="Next Day">Next Day</SelectItem>
                        <SelectItem value="2-3 Days">2-3 Days</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Product</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Product will be visible to customers
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="specifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specifications (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{"Print Speed": "Up to 8 ppm", "Connectivity": "Wi-Fi, USB"}'
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="compatibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compatibility (JSON Array)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='["HP 65 Black", "HP 65 Tri-color"]'
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createProductMutation.isPending}
                className="bg-hp-blue hover:bg-blue-700"
              >
                {createProductMutation.isPending ? "Saving..." : product ? "Update Product" : "Create Product"}
              </Button>
              {onSuccess && (
                <Button type="button" variant="outline" onClick={onSuccess}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
