import NextAuth from "next-auth";
import { authOptions } from "./config";

// Ensure NEXTAUTH_SECRET is set for development
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "height-calculator-development-secret-key-2024";
}

// Ensure NEXTAUTH_URL is set for development
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = "http://localhost:3000";
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
