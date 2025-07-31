// Import the ProductCard UI component to display individual product details
import { ProductCard } from "@/components/shared/ProductCard";

// Import your database client (Prisma) to fetch data from your database
import prisma from "@/lib/prisma";

// Import type for setting page metadata like <title>
import { Metadata } from "next";

// Define the type for the props this page will receive
type SearchPageProps = {
  searchParams: {
    q?: string; // Optional query string parameter (?q=some-text)
  };
};

// Dynamically generate the metadata (like the page <title>) based on the search term
export function generateMetadata({ searchParams }: SearchPageProps): Metadata {
  return {
    title: `Search results for "${searchParams.q || ''}"`,
  };
}

// The main component for the search results page
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q; // Get the search query from URL: /search?q=value

  // If there is no search query, prompt the user to enter one
  if (!query) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold">Please enter a search query.</h1>
      </div>
    );
  }

  // Query the database for products whose name or description includes the search term
  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,      // partial match
            mode: 'insensitive',  // case-insensitive search
          },
        },
        {
          description: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    },
  });

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page heading showing the search query */}
      <h1 className="text-3xl font-bold mb-8">
        Search results for: <span className="text-primary">"{query}"</span>
      </h1>

      {/* If products found, show them in a responsive grid layout */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        // If no products found, display a fallback message
        <p className="text-center text-muted-foreground mt-16">
          No products found matching your search.
        </p>
      )}
    </main>
  );
}