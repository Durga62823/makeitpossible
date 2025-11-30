"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AuthError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    toast.error(error.message ?? "Something went wrong");
  }, [error]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">We hit a snag</h2>
      <p className="text-muted-foreground">Please try again or return to the login page.</p>
      <div className="flex gap-3">
        <Button onClick={reset}>Retry</Button>
        <Button variant="outline" onClick={() => router.push("/auth/login")}>Back to login</Button>
      </div>
    </div>
  );
}
