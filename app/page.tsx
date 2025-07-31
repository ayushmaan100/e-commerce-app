// app/page.tsx

import { ProductCard } from "@/components/shared/ProductCard"; // Reusable product card component
import prisma from "@/lib/prisma"; // Prisma client for DB access


// Server component to render homepage
export default async function Home() {
  // ✅ Fetch 8 most recently added products from MongoDB
  const recentProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }, // Newest first
    take: 8,                         // Limit to 8 products
  });

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 🔥 Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Discover Our New Collection
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          High-quality products, curated for you.
        </p>
      </section>

      {/* 🆕 Latest Products Section */}
      <section className="pb-12 md:pb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Arrivals</h2>

        {/* ✅ If products exist, display them in a responsive grid */}
        {recentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          // ❌ Fallback when no products are available
          <p className="text-center text-muted-foreground">
            No products available at the moment. Check back soon!
          </p>
        )}
      </section>
    </main>
  );
}