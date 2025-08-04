// components/shared/ProductCard.tsx

import Link from "next/link";
import Image from "next/image";

import { AddToWishlistButton } from "../products/AddToWishlistButton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ Removed unused imports for auth and prisma

// Props to pass product data and wishlist status
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number; // Price in cents
    images: string[];
  };
  isWishlisted: boolean;
}

export function ProductCard({ product, isWishlisted }: ProductCardProps) {
  return (
    <Card className="w-full h-full flex flex-col group">
      {/* --- Product Image Section --- */}
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} className="outline-none">
          <div className="relative h-60 w-full">
            <Image
              src={product.images[0] || "https://placehold.co/400x400/EEE/31343C?text=Photo"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-t-lg"
            />
          </div>
        </Link>

        {/* --- Add to Wishlist Button (top-right) --- */}
        <div className="absolute top-2 right-2 z-10">
          <AddToWishlistButton productId={product.id} isWishlisted={isWishlisted} />
        </div>
      </CardHeader>

      {/* --- Product Info --- */}
      <Link href={`/products/${product.id}`} className="flex flex-col flex-grow">
        <CardContent className="flex-grow p-4">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {product.name}
          </CardTitle>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {/* ✅ Corrected price formatting */}
          <p className="text-xl font-bold">${(product.price / 100).toFixed(2)}</p>
        </CardFooter>
      </Link>
    </Card>
  );
}