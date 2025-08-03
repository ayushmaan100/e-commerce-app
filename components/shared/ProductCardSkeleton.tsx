import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * ProductCardSkeleton
 * This component mimics the ProductCard layout using Skeleton components.
 * It's useful to display while data is loading.
 */
export function ProductCardSkeleton() {
  return (
    <Card className="w-full h-full flex flex-col">
      {/* Simulate product image */}
      <CardHeader className="p-0">
        <Skeleton className="h-60 w-full rounded-t-lg" />
      </CardHeader>

      {/* Simulate product title and subtitle */}
      <CardContent className="flex-grow p-4">
        <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
        <Skeleton className="h-4 w-1/2" />       {/* Subtitle/price */}
      </CardContent>

      {/* Simulate button or action */}
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-8 w-1/3" />
      </CardFooter>
    </Card>
  );
}