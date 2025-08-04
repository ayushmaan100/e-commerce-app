// app/profile/orders/page.tsx

import { auth } from "@/auth"; // Auth function to get the current user
import prisma from "@/lib/prisma"; // Prisma client to query database
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation"; // For redirecting unauthorized users
import {
  Alert, AlertDescription, AlertTitle,
} from "@/components/ui/alert";
import { CheckCircle } from "lucide-react"; // Success icon

// The page receives searchParams to detect successful checkout
export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  // 🛡️ Authenticate the user
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // 📦 Fetch all orders placed by this user, including items in each order
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true }, // Join order items
    orderBy: { createdAt: "desc" }, // Newest first
  });

  return (
    <div className="container mx-auto py-8">
      
      {/* ✅ Success Alert shown if redirected after placing an order */}
      {searchParams.status === "success" && (
        <Alert variant="default" className="mb-8 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Order Placed!</AlertTitle>
          <AlertDescription className="text-green-700">
            Thank you for your purchase. You can see your order details below.
          </AlertDescription>
        </Alert>
      )}

      {/* 📄 Page Title */}
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {/* 🧾 Orders List */}
      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle>
                    Order #{order.id.slice(-6).toUpperCase()}
                  </CardTitle>
                  <CardDescription>
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                {/* 🟡 Order status badge */}
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground capitalize">
                  {order.status}
                </span>
              </CardHeader>

              {/* 🧾 Order Items */}
              <CardContent>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 border-b last:border-none"
                  >
                    <p>
                      {item.name} (x{item.quantity})
                    </p>
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </CardContent>

              {/* 💰 Order Total */}
              <CardFooter className="font-bold flex justify-between bg-muted/50 py-3 px-6">
                <p>Total</p>
                <p>${order.amount.toFixed(2)}</p>
              </CardFooter>
            </Card>
          ))
        ) : (
          // ❌ No orders yet
          <p className="text-center text-muted-foreground py-16">
            You haven't placed any orders yet.
          </p>
        )}
      </div>
    </div>
  );
}