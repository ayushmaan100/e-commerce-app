"use server";

// Import your custom NextAuth auth function to get the current session
import { auth } from "@/auth";

// Prisma client to interact with the database
import prisma from "@/lib/prisma";

// Used to revalidate (invalidate) the cache for a specific page
import { revalidatePath } from "next/cache";

// Zod for form data validation
import { z } from "zod";

// Define the shape and validation rules for the review form
const ReviewSchema = z.object({
  productId: z.string(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters long."),
});

// Server action to create a review
export async function createReview(prevState: any, formData: FormData) {
  // Step 1: Check if the user is logged in
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to leave a review." };
  }

  // Step 2: Validate incoming form data using the Zod schema
  const validatedFields = ReviewSchema.safeParse({
    productId: formData.get("productId"),
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  });

  // Step 3: If validation fails, return error object to the client
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Step 4: Extract validated data
  const { productId, rating, comment } = validatedFields.data;

  try {
    // Step 5: Check if the user has purchased the product
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ["paid", "processing"], // Only allow for completed/processing orders
        },
        items: {
          some: {
            productId: productId, // The product must be in one of the order items
          },
        },
      },
    });

    if (orders.length === 0) {
      return { error: "You can only review products you have purchased." };
    }

    // Step 6: Prevent duplicate reviews
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    if (existingReview) {
      return { error: "You have already reviewed this product." };
    }

    // Step 7: Create a new review in the database
    await prisma.review.create({
      data: {
        userId: session.user.id,
        productId: productId,
        rating: rating,
        comment: comment,
      },
    });

    // Step 8: Revalidate the product page to show the new review
    revalidatePath(`/products/${productId}`);

    // Step 9: Return success message
    return { success: "Review submitted successfully!" };
  } catch (error) {
    console.error("Review Error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}