// components/shared/ProductCard.tsx
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
      <Card className="w-full h-full flex flex-col hover:border-primary transition-colors">
        <CardHeader className="p-0">
          <div className="relative h-60 w-full">
            <Image
              src={product.images[0] || "https://placehold.co/400x400/EEE/31343C?text=Photo"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-t-lg"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <CardTitle className="text-lg font-semibold line-clamp-2">{product.name}</CardTitle>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
