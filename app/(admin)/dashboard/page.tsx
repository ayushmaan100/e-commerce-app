import { AnalyticsCard } from "@/components/admin/AnalyticsCard";
import { RecentSales } from "@/components/admin/RecentSales";
import { SalesChart } from "@/components/admin/SalesChart";
import prisma from "@/lib/prisma";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

async function getDashboardData() {
  const [totalRevenue, totalSales, totalProducts, totalUsers, recentOrders] = await Promise.all([
    prisma.order.aggregate({
      _sum: { amount: true },
      where: { status: { in: ["paid", "processing"] } },
    }),
    prisma.order.count({
      where: { status: { in: ["paid", "processing"] } },
    }),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      where: { status: { in: ["paid", "processing"] } },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
  ]);

  // You can dynamically calculate this from DB (currently hardcoded)
  const salesData = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 850 },
    { name: "Jun", total: 1200 },
    { name: "Jul", total: totalRevenue._sum.amount || 0 }, // Sample logic
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  return {
    totalRevenue: totalRevenue._sum.amount || 0,
    totalSales,
    totalProducts,
    totalUsers,
    recentOrders,
    salesData,
  };
}

export default async function DashboardPage() {
  const {
    totalRevenue,
    totalSales,
    totalProducts,
    totalUsers,
    recentOrders,
    salesData,
  } = await getDashboardData();

  return (
    <>
      {/* Top metrics grid */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          description="Total revenue from all sales"
        />
        <AnalyticsCard
          title="Sales"
          value={`+${totalSales}`}
          icon={ShoppingCart}
          description="Total number of sales"
        />
        <AnalyticsCard
          title="Products"
          value={`${totalProducts}`}
          icon={Package}
          description="Total number of products"
        />
        <AnalyticsCard
          title="Users"
          value={`${totalUsers}`}
          icon={Users}
          description="Total registered users"
        />
      </div>

      {/* Bottom grid with sales chart and recent sales */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-6">
        <div className="xl:col-span-2">
          <SalesChart data={salesData} />
        </div>
        <div>
          <RecentSales orders={recentOrders} />
        </div>
      </div>
    </>
  );
}