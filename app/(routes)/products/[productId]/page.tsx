"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import type { Product, Category } from "@prisma/client";
import { ReviewForm } from "@/components/products/ReviewForm";
import { ReviewList } from "@/components/products/ReviewList";
import { Separator } from "@/components/ui/separator";

// 📦 Type combining product and category
type ProductWithCategory = Product & { category: Category };

// 🧠 Server-side function to fetch product data
async function getProduct(productId: string): Promise<ProductWithCategory | null> {
  const { default: prisma } = await import("@/lib/prisma");
  return prisma.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });
}

interface ProductPageProps {
  params: { productId: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<ProductWithCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      const fetchedProduct = await getProduct(params.productId);
      if (!fetchedProduct) notFound();
      setProduct(fetchedProduct);
      setIsLoading(false);
    };
    fetchProduct();
  }, [params.productId]);

  if (isLoading) return <div className="container mx-auto p-8 text-center">Loading...</div>;
  if (!product) return null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Image */}
        <div>
          <div className="relative aspect-square w-full">
            <Image
              src={product.images[0] || "https://placehold.co/600x600/EEE/31343C?text=Photo"}
              alt={product.name}
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl lg:text-3xl font-semibold text-primary mb-4">
            {/* Note: price is in cents, converting back for display */}
            ${(product.price / 100).toFixed(2)}
          </p>
          <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Category:</span>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">
              {product.category.name}
            </span>
          </div>
          <div className="w-full md:w-1/2">
            <Button size="lg" className="w-full" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ Review Section Added Below */}
      <Separator className="my-12" />

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
          <ReviewForm productId={product.id} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <ReviewList productId={product.id} />
        </div>
      </div>
    </div>
  );
}