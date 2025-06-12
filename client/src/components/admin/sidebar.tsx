import { BarChart3, Package, ShoppingCart, Warehouse, Users, TrendingUp, Settings, ArrowLeft, Image } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminSidebar() {
  const [location] = useLocation();

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/admin" },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
    { icon: Image, label: "Website Pages", href: "/admin/images" },
    { icon: Warehouse, label: "Inventory", href: "/admin/inventory" },
    { icon: Users, label: "Customers", href: "/admin/customers" },
    { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  return (
    <nav className="bg-white w-64 min-h-screen shadow-lg border-r">
      <div className="p-4 border-b">
        <Link href="/">
          <Button variant="outline" size="sm" className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Store
          </Button>
        </Link>
      </div>
      <div className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      isActive ? "bg-hp-light text-hp-blue" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
