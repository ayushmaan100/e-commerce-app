"use client";

// ✅ Import the server action to toggle wishlist status
import { toggleWishlist } from "@/actions/wishlist";

// ✅ UI elements
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

// ✅ Hooks
import { usePathname } from "next/navigation";
import { useTransition } from "react";

// ✅ Notification
import { toast } from "sonner";

type AddToWishlistButtonProps = {
  productId: string;       // The ID of the product being wishlisted
  isWishlisted: boolean;   // Whether the product is already in the user's wishlist
};

export function AddToWishlistButton({ productId, isWishlisted }: AddToWishlistButtonProps) {
  // ✅ Manage UI state transition
  const [isPending, startTransition] = useTransition();

  // ✅ Get the current path for revalidation
  const pathname = usePathname();

  // ✅ Handle button click
  const handleClick = () => {
    startTransition(async () => {
      // Call the server action to add or remove item from wishlist
      const result = await toggleWishlist(productId, pathname);

      // Show success or error message
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isPending} // Disable while pending
      className="group"
    >
      <Heart
        className={`h-6 w-6 transition-colors ${
          isWishlisted
            ? "text-red-500 fill-red-500"                       // Highlighted heart when wishlisted
            : "text-muted-foreground group-hover:text-red-500"   // Gray heart with red hover
        }`}
      />
    </Button>
  );
}