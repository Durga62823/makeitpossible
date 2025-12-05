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
  useSecureCookies: process.env.NODE_ENV === "production",
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
          rememberMe:
            credentials?.rememberMe === "true" ||
            credentials?.rememberMe === true,
        });

        if (!parsed.success) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const { verifyPassword } = await import("@/lib/auth-utils");
        const isValidPassword = await verifyPassword(
          parsed.data.password,
          user.password
        );
        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name:
            user.firstName ??
            user.name ??
            `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          image: user.image,
          status: user.status,
          role: user.role,
          rememberMe: parsed.data.rememberMe,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async linkAccount({ user, account, profile }) {
      // Handle account unlinking if the account is already linked to a different user
      try {
        if (account) {
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          // If account exists and belongs to different user, delete the old one
          if (existingAccount && existingAccount.userId !== user.id) {
            await prisma.account.delete({
              where: {
                id: existingAccount.id,
              },
            });
            console.log(
              `Unlinked ${account.provider} account from previous user`
            );
          }
        }
      } catch (error) {
        console.error("Failed to handle account unlinking:", error);
      }

      return true;
    },
    async signIn({ user, account, profile }) {
      // For OAuth providers, auto-verify email if not already verified
      if (account && account.provider !== "credentials") {
        const email = user.email || profile?.email;
        if (!email) return false;

        // Check if user exists and needs email verification
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser && !existingUser.emailVerified) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              emailVerified: new Date(),
              image: user.image || existingUser.image,
              name: user.name || existingUser.name,
            },
          });
        }

        // Handle account linking: if account exists but linked to different user, unlink it
        if (user.id && account) {
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (existingAccount && existingAccount.userId !== user.id) {
            // Delete the old account link
            await prisma.account.delete({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            });
          }
        }
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // If it's a relative URL, redirect to that URL
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // If the URL is from the same origin, use it
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Return to base URL (which will redirect based on role via middleware)
      return baseUrl;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id as string;
        token.status = (user as { status?: string }).status ?? token.status;
        token.role = (user as { role?: any }).role ?? token.role;
        token.rememberMe =
          (user as { rememberMe?: boolean }).rememberMe ?? false;
        token.picture = user.image ?? token.picture;
        const now = Math.floor(Date.now() / 1000);
        token.sessionExpiresAt =
          now + (token.rememberMe ? REMEMBERED_MAX_AGE : DEFAULT_MAX_AGE);
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
        session.user.role = token.role as any;
        session.user.image = token.picture as string | undefined;
      }

      session.rememberMe = Boolean(token.rememberMe);
      const expiration =
        (token.sessionExpiresAt as number | undefined) ??
        Math.floor(Date.now() / 1000) + DEFAULT_MAX_AGE;
      session.expires = new Date(expiration * 1000).toISOString() as any;
      return session;
    },
    async authorized({ auth }) {
      return !!auth?.user;
    },
  },
  events: {
    async signIn({ user, account }) {
      // Handle account unlinking if needed
      try {
        if (account && user.id) {
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          // If account exists but linked to different user, delete it to allow re-linking
          if (existingAccount && existingAccount.userId !== user.id) {
            await prisma.account.delete({
              where: {
                id: existingAccount.id,
              },
            });
          }
        }
      } catch (error) {
        console.error("Failed to handle account linking:", error);
      }

      // Existing signIn event logic
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
            }
          );
        } catch (redisError) {
          console.warn(
            "Redis unavailable, skipping session cache:",
            redisError
          );
        }
      } catch (error) {
        console.error("Failed to persist login metadata:", error);
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
