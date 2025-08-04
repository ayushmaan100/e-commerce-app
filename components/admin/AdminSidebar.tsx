"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  BarChart
} from "lucide-react"; // Importing icons
import { cn } from "@/lib/utils"; // Utility function to handle conditional classes

// Define the admin navigation items
const navItems = [
  { href: "/dashboard", icon: Home, label: "Overview" },
  { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/dashboard/products", icon: Package, label: "Products" },
  { href: "/dashboard/users", icon: Users, label: "Customers" },
  { href: "/dashboard/analytics", icon: BarChart, label: "Analytics" },
];

export function AdminSidebar() {
  const pathname = usePathname(); // Get the current path to highlight the active link

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            pathname === item.href && "bg-muted text-primary"
          )}
        >
          {/* Render the associated icon */}
          <item.icon className="h-4 w-4" />
          {/* Render the label */}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}