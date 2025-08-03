"use client"; // This is a client-side component since it uses hooks and Zustand

// 📦 Imports
import { createOrder } from "@/actions/order"; // Server action to create order
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store"; // Zustand store for cart
import { useTransition } from "react"; // To show loading state
import { toast } from "sonner"; // Notification/toast library

export default function CheckoutPage() {
  // 🔄 Get cart items and clearCart function from Zustand store
  const { items, clearCart } = useCartStore();

  // 🎛️ Track whether the action is running using useTransition
  const [isPending, startTransition] = useTransition();

  // 💰 Calculate total cart value
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // 🧾 Handle order placement
  const handlePlaceOrder = () => {
    startTransition(async () => {
      const result = await createOrder(items); // Call server action

      if (result?.error) {
        toast.error(result.error); // ❌ Show error if order creation fails
      } else {
        toast.success("Order placed successfully!"); // ✅ Success toast
        clearCart(); // 🧹 Clear cart on client side
        // 🔁 The server action already handles redirection to /profile/orders
      }
    });
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Review your order and confirm.</CardDescription>
        </CardHeader>

        <CardContent>
          {/* 🛒 List all cart items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>

        {/* 💰 Total */}
        <CardFooter className="flex justify-between items-center font-bold text-lg border-t pt-4">
          <p>Total</p>
          <p>${total.toFixed(2)}</p>
        </CardFooter>

        {/* 📦 Place Order Button */}
        <CardFooter>
          <Button
            className="w-full"
            onClick={handlePlaceOrder}
            disabled={isPending || items.length === 0} // Disable while placing or empty cart
          >
            {isPending ? "Placing Order..." : "Place Order"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}