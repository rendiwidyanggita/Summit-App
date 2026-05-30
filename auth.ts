import NextAuth from "next-auth";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getAdminClaims } from "@/lib/server/auth-service";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/masuk",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const credentials = credentialsSchema.safeParse(rawCredentials);

        if (!credentials.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.data.email.toLowerCase(),
          },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const validPassword = await bcrypt.compare(credentials.data.password, user.passwordHash);

        if (!validPassword) {
          return null;
        }

        const claims = await getAdminClaims(user.id);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          ...claims,
        };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
    Apple({
      clientId: process.env.AUTH_APPLE_ID ?? "",
      clientSecret: process.env.AUTH_APPLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin ?? false;
        token.roles = user.roles ?? [];
        token.permissions = user.permissions ?? [];
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = String(token.id);
      session.user.isAdmin = Boolean(token.isAdmin);
      session.user.roles = Array.isArray(token.roles) ? token.roles.map(String) : [];
      session.user.permissions = Array.isArray(token.permissions) ? token.permissions.map(String) : [];

      return session;
    },
  },
});
