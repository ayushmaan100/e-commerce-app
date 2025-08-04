import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Order, User } from "@prisma/client";

// Props type: An array of orders with attached user info
type RecentSalesProps = {
  orders: (Order & { user: User | null })[];
};

export function RecentSales({ orders }: RecentSalesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>You made {orders.length} sales this month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center">
            {/* User Avatar */}
            <Avatar className="h-9 w-9">
              <AvatarImage src={order.user?.image || ""} alt="Avatar" />
              <AvatarFallback>
                {order.user?.name?.[0].toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>

            {/* User name and email */}
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {order.user?.name || "Anonymous"}
              </p>
              <p className="text-sm text-muted-foreground">
                {order.user?.email || "No email"}
              </p>
            </div>

            {/* Order amount */}
            <div className="ml-auto font-medium">
              +${order.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}