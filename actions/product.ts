// actions/product.ts
"use server"; // Server-only action

import prisma from "@/lib/prisma";               // Prisma client
import { z } from "zod";                         // Schema validation
import { revalidatePath } from "next/cache";     // Cache invalidation
import { v2 as cloudinary } from "cloudinary";   // Cloudinary SDK for image uploads

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Keep this private (not NEXT_PUBLIC)
});

// Zod schema to validate product input
const ProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01),
  categoryId: z.string(),
  images: z.array(z.string()).optional(), // Will hold image URLs after upload
});

// Server action to create a new product
export async function createProduct(prevState: any, formData: FormData) {
  // Validate form fields
  const validatedFields = ProductSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
  });

  // If validation fails, return error object
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const imageFiles = formData.getAll("images") as File[]; // Get uploaded image files
  const imageUrls: string[] = [];

  try {
    // Upload each image to Cloudinary
    for (const file of imageFiles) {
      if (file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload_stream({}, (error, result) => {
            if (error) reject(error);
            resolve(result);
          }).end(buffer);
        });

        imageUrls.push(result.secure_url); // Store secure image URL
      }
    }

    // Ensure at least one image was uploaded
    if (imageUrls.length === 0) {
      return { errors: { images: ["At least one image is required."] } };
    }

    // Save the product to the database
    await prisma.product.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        price: validatedFields.data.price,
        categoryId: validatedFields.data.categoryId,
        images: imageUrls,
      },
    });

    // Revalidate the product dashboard cache
    revalidatePath("/dashboard/products");

    // Return success message
    return { message: "Product created successfully." };
  } catch (error) {
    console.error(error);
    return { message: "Failed to create product." };
  }
}