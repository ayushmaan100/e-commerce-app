import prisma from "@/lib/prisma";
import NewProductForm from "./form";

// ✅ Server component to fetch categories
export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  return <NewProductForm categories={categories} />;
}