// app/profile/wishlist/page.tsx

import { auth } from "@/auth";
import { ProductCard } from "@/components/shared/ProductCard";
import { getWishlistStatusForProducts } from "@/actions/wishlist";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function WishlistPage() {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // 2. Fetch wishlist items for the authenticated user
  const wishlistItems = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  // 3. Extract product info from wishlist
  const products = wishlistItems.map((item) => item.product);

  // 4. Determine which products are wishlisted (for button state)
  const wishlistStatus = await getWishlistStatusForProducts(products.map((p) => p.id));

  // 5. Render the page
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={!!wishlistStatus[product.id]}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-16">
          Your wishlist is empty. Start adding products you love!
        </p>
      )}
    </div>
  );
}