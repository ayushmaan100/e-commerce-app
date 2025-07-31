// Import authentication helpers
import { auth, signOut } from "@/auth";

// UI components for the avatar and dropdown menu
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@prisma/client";


import Link from "next/link";

export async function UserNav() {
  // ⏳ Get the current authenticated session
  const session = await auth();

  // 🔓 If user is not logged in, show a Sign In button
  if (!session?.user) {
    return (
      <Button asChild>
        <Link href="/api/auth/signin">Sign In</Link>
      </Button>
    );
  }

  // ✅ If user is logged in, show avatar with dropdown menu
  return (
    <DropdownMenu>
      {/* Avatar button opens the menu */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* Load user's image or fallback to first letter of name */}
            <AvatarImage src={session.user.image!} alt={session.user.name!} />
            <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* Actual dropdown content */}
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {/* User's name and email */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Link to profile page */}
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>

        {/* If user has ADMIN role, show dashboard link */}
        {session.user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/products/new">Dashboard</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Sign-out button inside form for server action */}
        <form
          action={async () => {
            "use server";
            await signOut(); // ends session
          }}
        >
          <button type="submit" className="w-full">
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}