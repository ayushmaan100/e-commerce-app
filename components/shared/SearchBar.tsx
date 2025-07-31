"use client"; // 🔄 Ensures this component runs on the client side (needed for hooks like useRouter)

import { Input } from "@/components/ui/input"; // 🔤 Styled input field from your UI library
import { Search as SearchIcon } from "lucide-react"; // 🔍 Icon for search (renamed to avoid conflict with component name)
import { useRouter } from "next/navigation"; // 🧭 useRouter hook for client-side navigation
import { FormEvent } from "react"; // ✍️ For typing the form event

// 🔎 The actual SearchBar component
export function SearchBar() {
  const router = useRouter(); // Get access to the router for programmatic navigation

  // 🧠 Function to handle form submission
  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent full page reload
    const formData = new FormData(event.currentTarget); // Read form input values
    const query = formData.get("q") as string; // Extract value of the input named "q"

    if (query) {
      // 🚀 Redirect user to the search results page with query param
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    // 🧾 Search form wrapper
    <form onSubmit={handleSearch} className="relative w-full max-w-sm">
      {/* 🔤 Search input field */}
      <Input
        type="search"
        name="q" // This is the key used in FormData
        placeholder="Search products..."
        className="pl-10" // Padding-left to make space for the icon
      />
      {/* 🔍 Search icon positioned inside the input */}
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
    </form>
  );
}