import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Admin from "@/pages/admin";
import AdminImages from "@/pages/admin-images";
import ProductDetail from "@/pages/product-detail";
import Category from "@/pages/category";
import Printers from "@/pages/printers";
import OrderTracking from "@/pages/order-tracking";
import Returns from "@/pages/returns";
import CustomerService from "@/pages/customer-service";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/images" component={AdminImages} />
      <Route path="/admin/:section*" component={Admin} />
      <Route path="/product/:productId" component={ProductDetail} />
      <Route path="/printers" component={Printers} />
      <Route path="/category/:categoryName" component={Category} />
      <Route path="/printers/:subcategory" component={Category} />
      <Route path="/order-tracking" component={OrderTracking} />
      <Route path="/returns" component={Returns} />
      <Route path="/customer-service" component={CustomerService} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
