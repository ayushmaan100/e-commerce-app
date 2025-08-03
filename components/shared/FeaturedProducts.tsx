import prisma from "@/lib/prisma";
import { ProductCard } from "./ProductCard";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function FeaturedProducts() {
  // Fetch latest 4 products as featured
  const featuredProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <section className="py-12 md:py-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        <Button asChild variant="ghost">
          <Link href="/products" className="flex items-center">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {featuredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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