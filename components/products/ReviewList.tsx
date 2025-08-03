import prisma from "@/lib/prisma"; // Import Prisma instance to query DB
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"; // ShadCN UI components for user avatar
import { Star } from "lucide-react"; // Star icon used for ratings

// ⭐ Component to render star rating visuals
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            rating >= star
              ? "text-yellow-400 fill-yellow-400" // Filled star
              : "text-gray-300" // Empty star
          }`}
        />
      ))}
    </div>
  );
}

// 🔍 Server component to fetch and render all reviews for a product
export async function ReviewList({ productId }: { productId: string }) {
  // Fetch reviews from the database
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: true }, // Also fetch user details for each review
    orderBy: { createdAt: "desc" }, // Newest first
  });

  // If no reviews, show fallback text
  if (reviews.length === 0) {
    return <p className="text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-4">
          {/* 👤 Avatar section */}
          <Avatar>
            <AvatarImage src={review.user.image || ""} />
            <AvatarFallback>
              {review.user.name?.[0] ?? "?"}
            </AvatarFallback>
          </Avatar>

          {/* 💬 Review content */}
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{review.user.name}</p>
              <Stars rating={review.rating} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {review.comment}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}