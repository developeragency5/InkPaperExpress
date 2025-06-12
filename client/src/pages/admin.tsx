import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, DollarSign, ShoppingCart, Package, TrendingUp, Eye } from "lucide-react";
import Header from "@/components/layout/header";
import AdminSidebar from "@/components/admin/sidebar";
import ProductForm from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Product, Order } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PUT", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order updated",
        description: "Order status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
    setSelectedProduct(undefined);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "In Transit":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalSales = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  }).length;
  const lowStockItems = products.filter(product => product.stock < 10).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-hp-blue">Admin Dashboard</h1>
              <span className="ml-4 text-sm text-gray-500">Ink & Paper Express</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50" 
                  alt="Admin user profile" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700">Admin User</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900">${totalSales.toFixed(2)}</p>
                    <p className="text-sm text-green-600">+12% from last month</p>
                  </div>
                  <div className="bg-hp-light p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-hp-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Orders Today</p>
                    <p className="text-2xl font-bold text-gray-900">{todayOrders}</p>
                    <p className="text-sm text-green-600">+8% from yesterday</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                    <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
                    <p className="text-sm text-yellow-600">Need restock</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                    <p className="text-sm text-green-600">Active inventory</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button variant="outline" size="sm">
                    View All Orders
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">#{order.id.toString().padStart(3, '0')}</p>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${order.total}</p>
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Inventory Management */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Product Management</CardTitle>
                  <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
                    <DialogTrigger asChild>
                      <Button className="bg-hp-blue hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {selectedProduct ? "Edit Product" : "Add New Product"}
                        </DialogTitle>
                      </DialogHeader>
                      <ProductForm
                        product={selectedProduct}
                        onSuccess={handleCloseProductForm}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.slice(0, 4).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-hp-light rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-hp-blue" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 truncate max-w-40">{product.name}</h4>
                            <p className="text-sm text-gray-500">Stock: {product.stock} units</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={product.stock < 10 ? "destructive" : "secondary"}>
                            {product.stock < 10 ? "Low Stock" : "In Stock"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* All Products Table */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>All Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
