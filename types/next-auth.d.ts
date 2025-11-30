import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      status?: string;
    };
    rememberMe?: boolean;
  }

  interface User {
    status?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    status?: string;
    rememberMe?: boolean;
    sessionExpiresAt?: number;
  }
}
