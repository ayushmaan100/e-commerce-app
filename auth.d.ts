// next-auth.d.ts

import type { UserRole } from "@prisma/client";
import { type DefaultSession } from "next-auth";

// Extend the built-in session and user types
declare module "next-auth" {
  /**
   * The shape of the user object returned in the JWT and session callbacks.
   */
  interface User {
    role: UserRole;
  }

  /**
   * The shape of the session object.
   */
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"]; // Combine with default session user properties
  }
}