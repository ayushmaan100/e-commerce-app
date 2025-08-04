// components/shared/FeaturedProducts.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import prisma from "@/lib/prisma";
import { ProductCard } from "./ProductCard";
import { getWishlistStatusForProducts } from "@/actions/wishlist";
import { Button } from "../ui/button";

export async function FeaturedProducts() {
  // ✅ Step 1: Fetch featured (recent) products
  const featuredProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  // ✅ Step 2: Fetch wishlist status for the current user
  const wishlistStatus = await getWishlistStatusForProducts(
    featuredProducts.map((p) => p.id)
  );

  return (
    <section className="py-12 md:py-20">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        <Button asChild variant="ghost">
          <Link href="/products">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Product Grid */}
      {featuredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={!!wishlistStatus[product.id]} // Convert to boolean
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No featured products available at the moment.
        </p>
      )}
    </section>
  );
}