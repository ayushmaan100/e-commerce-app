// lib/prisma.ts

// Import the generated PrismaClient from node_modules
import { PrismaClient } from '@prisma/client';

// Extend the Node.js global object to hold the PrismaClient instance
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a single PrismaClient instance or reuse an existing one (for development)
const client = globalThis.prisma || new PrismaClient();

// In development, store the client in globalThis to prevent creating multiple connections
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

// Export the Prisma client for use in your app
export default client;