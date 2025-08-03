// middleware.ts
/*Middleware allows us to protect routes by running code before a request is completed.
 We'll use it to protect our admin dashboard and user profiles. */

// Import `auth` function to access user session info
import { auth } from "@/auth";



// Import NextResponse to allow or redirect the request
import { NextResponse } from "next/server";

// Wrap the middleware logic using the auth helper
export default auth((req) => {
  const { nextUrl } = req;               // Get the requested URL
  const isLoggedIn = !!req.auth;         // Check if the user is authenticated

  const isAdminRoute = nextUrl.pathname.startsWith("/dashboard");
  const isProfileRoute = nextUrl.pathname.startsWith("/profile");

  // 🔐 Check if trying to access /dashboard
  if (isAdminRoute) {
    // Allow only if logged in and role is ADMIN
    if (isLoggedIn && req.auth?.user?.role === "ADMIN") {
      return NextResponse.next(); // Allow request
    }
    // Redirect to sign-in if not authorized
    return NextResponse.redirect(new URL("/api/auth/signin", nextUrl));
  }

  // 🔐 Check if trying to access /profile
  if (isProfileRoute) {
    if (isLoggedIn) {
      return NextResponse.next(); // Allow request
    }
    return NextResponse.redirect(new URL("/api/auth/signin", nextUrl));
  }

  // 🟢 Allow all other requests
  return NextResponse.next();
});

// This config ensures middleware only runs on these paths
// middleware.ts
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/checkout"],
};