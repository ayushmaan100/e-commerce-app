// This client component will manage the filter state and update the URL.

"use client"; // This is a client component because it uses hooks like useRouter and manages state

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";

// 📦 Props type definition for categories passed from parent component
type FilterSidebarProps = {
  categories: { id: string; name: string }[];
};

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter(); // For programmatic navigation
  const pathname = usePathname(); // Current path (e.g. /products)
  const searchParams = useSearchParams(); // Access to current URL query string

  // 🔁 Reusable helper to update query string parameters
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value); // Update or add param
      } else {
        params.delete(name); // Remove if value is empty
      }
      return params.toString(); // Return full query string
    },
    [searchParams]
  );

  // 🔃 Handler for sort dropdown
  const handleSortChange = (value: string) => {
    router.push(pathname + "?" + createQueryString("sort", value));
  };

  // ✅ Handler for category checkbox
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const currentCategories = searchParams.get("categories")?.split(",") || [];

    const newCategories = checked
      ? [...currentCategories, categoryId] // Add selected
      : currentCategories.filter((c) => c !== categoryId); // Remove unchecked

    router.push(pathname + "?" + createQueryString("categories", newCategories.join(",")));
  };

  // 💸 Handler for price slider change
  const handlePriceChange = (values: number[]) => {
    router.push(pathname + "?" + createQueryString("price", values.join("-")));
  };

  // 📊 Parse existing query params for UI state
  const selectedCategories = searchParams.get("categories")?.split(",") || [];
  const [minPrice, maxPrice] = searchParams.get("price")?.split("-").map(Number) || [0, 1000];

  return (
    <aside className="w-full lg:w-64 space-y-8">
      {/* 🔽 Sort Dropdown */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Sort By</h3>
        <Select onValueChange={handleSortChange} defaultValue={searchParams.get("sort") || "latest"}>
          <SelectTrigger>
            <SelectValue placeholder="Sort products" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 🧾 Category Filters */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, !!checked)}
              />
              <Label htmlFor={category.id}>{category.name}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* 💲 Price Range Slider */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <Slider
          defaultValue={[minPrice, maxPrice]}
          max={1000}
          step={10}
          onValueCommit={handlePriceChange}
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>${minPrice}</span>
          <span>${maxPrice}</span>
        </div>
      </div>

      {/* ❌ Clear Button */}
      <Button variant="outline" className="w-full" onClick={() => router.push(pathname)}>
        Clear Filters
      </Button>
    </aside>
  );
}