// This is a server component — it fetches data from Prisma and returns rendered HTML

import { ProductCard } from "@/components/shared/ProductCard"; // Reusable product display card
import { FilterSidebar } from "@/components/products/FilterSidebar"; // Sidebar for filtering
import prisma from "@/lib/prisma"; // Prisma instance
import { Prisma } from "@prisma/client"; // Type definitions from Prisma

// 👇 Type for props — query parameters sent through the URL
type ProductsPageProps = {
  searchParams: {
    sort?: string;        // 'price-asc', 'price-desc', or 'latest'
    categories?: string;  // Comma-separated category IDs
    price?: string;       // Price range, e.g. "100-500"
  };
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { sort, categories, price } = searchParams;

  // 🧠 Build dynamic Prisma filter conditions
  const where: Prisma.ProductWhereInput = {};

  // 🏷️ Category filtering
  if (categories) {
    where.categoryId = { in: categories.split(',') };
  }

  // 💰 Price range filtering
  if (price) {
    const [min, max] = price.split('-').map(Number); // Convert "100-500" -> [100, 500]
    where.price = { gte: min, lte: max }; // Price between min and max
  }

  // 📦 Build sorting conditions
  const orderBy: Prisma.ProductOrderByWithRelationInput = {};
  if (sort === 'price-asc') {
    orderBy.price = 'asc';
  } else if (sort === 'price-desc') {
    orderBy.price = 'desc';
  } else {
    orderBy.createdAt = 'desc'; // Default: show latest first
  }

  // 🚀 Fetch filtered and sorted data in parallel
  const [products, allCategories] = await Promise.all([
    prisma.product.findMany({ where, orderBy }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }), // For FilterSidebar
  ]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 🔍 Sidebar for filters (category, price, sort) */}
        <div className="lg:col-span-1">
          <FilterSidebar categories={allCategories} />
        </div>

        {/* 🛒 Main product grid */}
        <main className="lg:col-span-3">
          <h1 className="text-3xl font-bold mb-8">All Products</h1>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground mt-16">
              No products found with the selected filters.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}