"use client";

import { useTransition } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Spinner } from "@/components/ui/spinner";

export function SocialAuthButtons() {
  const [isPending, startTransition] = useTransition();
  const handleSignIn = (provider: "google" | "github") => {
    startTransition(async () => {
      // Don't specify callbackUrl - let the auth system determine based on role
      const result = await signIn(provider, { redirect: true });
      if (result?.error) {
        toast.error(result.error ?? `Unable to sign in with ${provider}`);
      }
    });
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-center gap-3 border-slate-200 bg-white text-slate-900 shadow-sm"
        onClick={() => handleSignIn("google")}
        disabled={isPending}
      >
        {isPending ? <Spinner className="border-brand-primary" /> : <Icons.google />}
        Continue with Google
      </Button>
      <Button
        type="button"
        className="w-full justify-center gap-3 bg-black text-white hover:bg-zinc-900"
        onClick={() => handleSignIn("github")}
        disabled={isPending}
      >
        {isPending ? <Spinner className="border-white" /> : <Icons.github />}
        Continue with GitHub
      </Button>
    </div>
  );
}
