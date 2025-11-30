import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reset password | Make It Possible",
};

interface ResetPasswordPageProps {
  params: { token: string };
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = params;

  if (!token) {
    notFound();
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Create a new password</CardTitle>
        <CardDescription>This keeps your projects secure.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={token} />
      </CardContent>
    </>
  );
}
