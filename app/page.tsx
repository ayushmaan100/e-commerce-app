import { FeaturedProducts } from "@/components/shared/FeaturedProducts";
import { HeroCarousel } from "@/components/shared/HeroCarousel";
import { ProductCardSkeleton } from "@/components/shared/ProductCardSkeleton";
import { Suspense } from "react";

/**
 * A fallback skeleton section for Featured Products while data is loading.
 */
function FeaturedProductsFallback() {
  return (
    <section className="py-12 md:py-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Featured Products</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero banner */}
      <section className="py-8">
        <HeroCarousel />
      </section>

      {/* Featured products with suspense fallback */}
      <Suspense fallback={<FeaturedProductsFallback />}>
        <FeaturedProducts />
      </Suspense>

      {/* Add future sections below if needed */}
    </div>
  );
}