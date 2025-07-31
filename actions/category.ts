"use server"; // Required for server actions in Next.js App Router

import prisma from "@/lib/prisma";              // Prisma DB client
import { z } from "zod";                        // Zod for validation
import { revalidatePath } from "next/cache";    // To refresh cached page after DB mutation

// Define the validation schema for category input
const CategorySchema = z.object({
  name: z.string().min(3), // Name must be at least 3 characters
});

// Server action to create a new category from form data
export async function createCategory(prevState: any, formData: FormData) {
  // Validate the form input using Zod
  const validated = CategorySchema.safeParse({ name: formData.get("name") });

  // If validation fails, return error messages
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const name = validated.data.name;

  // Check if category already exists in DB
  const exists = await prisma.category.findUnique({ where: { name } });
  if (exists) {
    return { errors: { name: ["Category already exists."] } };
  }

  // Create the new category
  await prisma.category.create({ data: { name } });

  // Refresh the cached categories page
  revalidatePath("/dashboard/categories");

  // Return success message
  return { message: "Category created successfully." };
}