import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";
import { logger } from "@/lib/logger";
import { signInSchema } from "@/lib/validations/auth";
import { getRequestIp, getRequestUserAgent } from "@/lib/request";

const REMEMBERED_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: REMEMBERED_MAX_AGE,
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
    verifyRequest: "/auth/verify-email",
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse({
          email: credentials?.email,
          password: credentials?.password,
          rememberMe: credentials?.rememberMe === "true" || credentials?.rememberMe === true,
        });

        if (!parsed.success) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const { verifyPassword } = await import("@/lib/auth-utils");
        const isValidPassword = await verifyPassword(parsed.data.password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }

        if (!user.emailVerified) {
          throw new Error("Email not verified");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.firstName ?? user.name ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          image: user.image,
          status: user.status,
          rememberMe: parsed.data.rememberMe,
        } as const;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id as string;
        token.status = (user as { status?: string }).status ?? token.status;
        token.rememberMe = (user as { rememberMe?: boolean }).rememberMe ?? false;
        token.picture = user.image ?? token.picture;
        const now = Math.floor(Date.now() / 1000);
        token.sessionExpiresAt = now + (token.rememberMe ? REMEMBERED_MAX_AGE : DEFAULT_MAX_AGE);
      }

      if (account) {
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.status = token.status as string;
        session.user.image = token.picture as string | undefined;
      }

      session.rememberMe = Boolean(token.rememberMe);
      const expiration = (token.sessionExpiresAt as number | undefined) ??
        Math.floor(Date.now() / 1000) + DEFAULT_MAX_AGE;
      session.expires = new Date(expiration * 1000).toISOString();
      return session;
    },
    async authorized({ auth }) {
      return !!auth?.user;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        const ip = await getRequestIp();
        const userAgent = await getRequestUserAgent();
        
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLogin: new Date(),
            lastLoginIp: ip,
            lastLoginUserAgent: userAgent,
          },
        });

        try {
          const redis = getRedis();
          await redis.set(
            `session:last:${user.id}`,
            {
              lastLogin: new Date().toISOString(),
              ip,
              userAgent,
            },
            {
              ex: REMEMBERED_MAX_AGE,
            },
          );
        } catch (redisError) {
          console.warn("Redis unavailable, skipping session cache:", redisError);
        }
      } catch (error) {
        console.error("Failed to persist login metadata:", error);
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);