import type { UserRole } from "@prisma/client";
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * We are extending the built-in User model with our custom fields
   */
  interface User {
    role: UserRole;
  }

  /**
   * We are extending the built-in Session model
   */
  interface Session {
    user: {
      /** Your custom properties */
      id: string;
      role: UserRole;
      
      /** Default properties */
    } & DefaultSession["user"]; // <-- This "&" is the key to merging the types
  }
}