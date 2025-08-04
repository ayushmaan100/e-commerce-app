// app/(routes)/products/[productId]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Product, Category } from "@prisma/client";

import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { ReviewForm } from "@/components/products/ReviewForm";
import { ReviewList } from "@/components/products/ReviewList";
import { Separator } from "@/components/ui/separator";
import { AddToWishlistButton } from "@/components/products/AddToWishlistButton";

// ✅ Import auth, prisma, and client-side hooks
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { useCartStore } from "@/store/cart-store";

// ✅ Type combining product and category
type ProductWithCategory = Product & { category: Category };

// Props for the new client component
interface ProductClientProps {
  product: ProductWithCategory;
  isWishlisted: boolean;
}

// ✅ New Client Component for interactive elements
function ProductClient({ product, isWishlisted }: ProductClientProps) {
  "use client";
  const { addToCart } = useCartStore();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price, // Assuming price is in cents
      image: product.images[0],
    });
  };

  return (
    <div className="md:sticky md:top-24">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
      <p className="text-2xl lg:text-3xl font-semibold text-primary mb-4">
        ${(product.price / 100).toFixed(2)}
      </p>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {product.description}
      </p>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm font-medium">Category:</span>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground">
          {product.category.name}
        </span>
      </div>

      {/* ✅ Updated button section */}
      <div className="flex items-center gap-4 w-full md:w-3/4">
        <Button size="lg" className="w-full" onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <AddToWishlistButton
          productId={product.id}
          isWishlisted={isWishlisted}
        />
      </div>
    </div>
  );
}

// Props received by the page from the route
interface ProductPageProps {
  params: {
    productId: string;
  };
}

// ✅ Main component is now an async Server Component
export default async function ProductPage({ params }: ProductPageProps) {
  // Fetch product and session data on the server
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    include: { category: true },
  });

  const session = await auth();

  // If product not found, show 404
  if (!product) {
    notFound();
  }

  // Check if the product is in the user's wishlist
  const isWishlisted = session?.user
    ? !!(await prisma.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: params.productId,
          },
        },
      }))
    : false;

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Main Section */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Left Column: Gallery */}
        <div className="md:col-span-1">
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Right Column: Interactive Product Info */}
        <div className="md:col-span-1">
          <ProductClient product={product} isWishlisted={isWishlisted} />
        </div>
      </div>

      {/* Reviews Section */}
      <Separator className="my-12" />
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: Review Form */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
          <ReviewForm productId={product.id} />
        </div>

        {/* Right: Review List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <ReviewList productId={product.id} />
        </div>
      </div>
    </div>
  );
}