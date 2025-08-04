// actions/wishlist.ts
"use server"; // Enables server-only functionality (for security and DB access)

import { auth } from "@/auth";                    // Auth helper to get the logged-in user
import prisma from "@/lib/prisma";                // Prisma client instance
import { revalidatePath } from "next/cache";      // Revalidate a specific path in Next.js cache

/**
 * Toggles a product's presence in the user's wishlist.
 * If it exists, remove it. If not, add it.
 *
 * @param productId - ID of the product to be toggled
 * @param path - Page path to revalidate after mutation (e.g. "/wishlist")
 */


export async function getWishlistStatusForProducts(productIds: string[]) {
  const session = await auth();

  // If there's no user, no products can be wishlisted.
  if (!session?.user) {
    return {};
  }

  // Find all wishlist items for this user that match the given product IDs
  const wishlistItems = await prisma.wishlistItem.findMany({
    where: {
      userId: session.user.id,
      productId: {
        in: productIds,
      },
    },
    select: {
      productId: true, // Only select the productId
    },
  });

  // Convert the result into a simple map for easy lookup, e.g., { "product123": true }
  const statusMap = wishlistItems.reduce((acc, item) => {
    acc[item.productId] = true;
    return acc;
  }, {} as Record<string, boolean>);

  return statusMap;
}



export async function toggleWishlist(productId: string, path: string) {
  // Step 1: Authenticate user
  const session = await auth();

  // If user is not logged in
  if (!session?.user) {
    return { error: "You must be logged in to manage your wishlist." };
  }

  const userId = session.user.id;

  try {
    // Step 2: Check if this product is already in the wishlist
   const existingItem = await prisma.wishlistItem.findUnique({
  where: {
    // This is the key line
    userId_productId: {
      userId,
      productId,
    },
  },
});

    if (existingItem) {
      // Step 3: If item exists in wishlist, remove it
      await prisma.wishlistItem.delete({
        where: {
          id: existingItem.id,
        },
      });

      // Revalidate the path (like /wishlist or /products/[id])
      revalidatePath(path);

      return { success: "Removed from wishlist." };
    } // actions/wishlist.ts

    // ... (previous code is fine)
    
       else {
          // Step 4: If not in wishlist, add it
          await prisma.wishlistItem.create({
            data: {
              userId,
              productId,
            },
          });
    
          // Revalidate the same path to update UI
          revalidatePath(path);
    
          return { success: "Added to wishlist." };
        }
      // Revalidate the same path to update UI
      revalidatePath(path);

      return { success: "Added to wishlist." };
    }

   catch (error) {
    console.error("Wishlist toggle failed:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
