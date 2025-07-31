// auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import type { UserRole } from "@prisma/client";

import prisma from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Resend({
        from: process.env.AUTH_EMAIL_FROM,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // This callback is called whenever a JWT is created
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Add role to the token
      }
      return token;
    },
    // This callback is called whenever a session is checked
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!; // Add user ID to session
        session.user.role = token.role as UserRole; // Add role to session
      }
      return session;
    },
  },
});