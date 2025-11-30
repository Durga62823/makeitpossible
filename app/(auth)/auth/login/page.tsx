import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/LoginForm";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign in | Make It Possible",
};

export default function LoginPage() {
  return (
    <>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Securely access your AI project workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <SocialAuthButtons />
        <div className="relative mt-6 mb-2">
          <div className="border-t border-slate-200 dark:border-slate-800" />
          <span className="absolute inset-0 -mt-3 flex items-center justify-center bg-white text-xs uppercase text-slate-400 dark:bg-neutral-900 dark:text-slate-500">
            or continue with email
          </span>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-brand-primary">
            Create one
          </Link>
        </p>
      </CardContent>
    </>
  );
}
