// actions/order.ts
"use server"; // 🚀 Tells Next.js this is a Server Action file

// 📦 Imports
import { auth } from "@/auth";                    // For checking user session
import prisma from "@/lib/prisma";                // Prisma client to talk to DB
import { CartItem } from "@/types";               // Cart item type definition
import { revalidatePath } from "next/cache";      // To revalidate cache for SSR pages
import { redirect } from "next/navigation";       // To programmatically redirect

// 🛒 Main server action to create order from cart
export async function createOrder(cart: CartItem[]) {
  // 🔐 Check if user is authenticated
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin"); // Redirect unauthenticated users to login
  }

  // 💰 Calculate total cart value
  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (totalAmount <= 0) {
    throw new Error("Cart cannot be empty."); // Prevent empty order submission
  }

  try {
    // 🧾 Create the order in database with associated items
    await prisma.order.create({
      data: {
        userId: session.user.id,     // Link order to logged-in user
        amount: totalAmount,
        currency: "usd",
        status: "processing",        // You can change to 'pending' or 'manual'
        items: {
          create: cart.map((item) => ({
            productId: item.id,      // Link to product
            name: item.name,         // Snapshot of product info
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

  } catch (error) {
    console.error("❌ Failed to create order:", error);
    return {
      error: "There was a problem placing your order. Please try again.",
    };
  }

  // ⚠️ Note: Cart clearing happens on client side after redirect

  // 🔄 Revalidate profile order history page cache
  revalidatePath("/profile/orders");

  // ➡️ Redirect to orders page with success query
  redirect("/profile/orders?status=success");
}