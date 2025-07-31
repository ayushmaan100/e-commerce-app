/*This component will display the cart items and summary. It will be triggered by a button in our Navbar.
A drawer component (Sheet) that slides out and shows the user’s cart items, quantity controls, total price, and a Checkout button.
 */

// components/shared/CartSheet.tsx
"use client";

// Import required components and utilities
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
  SheetTrigger, SheetFooter
} from "@/components/ui/sheet"; // Sheet is a drawer-like UI component
import { Button } from "@/components/ui/button"; // Reusable button component
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"; // Icon imports
import { useCartStore } from "@/store/cart-store"; // Zustand-based cart store hook
import Image from "next/image"; // Next.js image component for optimization
import HydrationWrapper from "./HydrationWrapper"; // To avoid hydration mismatch with persisted localStorage data
import Link from "next/link"; // For internal navigation

export function CartSheet() {
  // Retrieve cart data and handlers from Zustand store
  const { items, removeFromCart, updateQuantity } = useCartStore();

  // Calculate total price for items in cart
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <HydrationWrapper>
      {/* Main wrapper to manage sheet visibility */}
      <Sheet>
        {/* Cart icon trigger button (with badge) */}
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {items.length} {/* Shows count of items */}
              </span>
            )}
          </Button>
        </SheetTrigger>

        {/* Side drawer panel */}
        <SheetContent className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Your Cart ({items.length})</SheetTitle>
          </SheetHeader>

          {/* If cart has items */}
          {items.length > 0 ? (
            <>
              {/* Scrollable cart item list */}
              <div className="flex-1 overflow-y-auto pr-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                    {/* Product image */}
                    <div className="relative h-20 w-20">
                      <Image src={item.image} alt={item.name} fill className="object-cover rounded-md" />
                    </div>

                    {/* Item details and controls */}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Remove item from cart */}
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Cart summary and checkout button */}
              <SheetFooter className="mt-auto">
                <div className="w-full space-y-4">
                  {/* Total price display */}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  {/* Checkout navigation */}
                  <Button asChild size="lg" className="w-full">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </div>
              </SheetFooter>
            </>
          ) : (
            // Message for empty cart
            <div className="flex flex-col items-center justify-center h-full">
              <ShoppingCart className="h-20 w-20 text-muted-foreground" />
              <p className="mt-4 text-lg text-muted-foreground">Your cart is empty.</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </HydrationWrapper>
  );
}