// A simple navigation bar to hold our logo, links, and the cart button.

import Link from "next/link"; // 🔗 For internal navigation
import { Package2 } from "lucide-react"; // 📦 Logo icon from Lucide
import { CartSheet } from "./CartSheet"; // 🛒 Slide-out cart drawer component
import { SearchBar } from "./SearchBar"; // 🔍 Import the search bar component

// 🧭 Navbar component definition
export function Navbar() {
  return (
    // 📌 Sticky header to keep navbar visible at top while scrolling
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="hidden items-center gap-2 sm:flex">
            <Package2 className="h-6 w-6" />
            <span className="font-bold">ACME Inc.</span>
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Products
          </Link>
        </div>

        {/* 🔍 Search bar sits in the center and expands */}
        <div className="flex-1">
          <SearchBar />
        </div>

        {/* 🛒 Cart icon always visible */}
        <nav>
          <CartSheet />
        </nav>
      </div>
    </header>
  );
}