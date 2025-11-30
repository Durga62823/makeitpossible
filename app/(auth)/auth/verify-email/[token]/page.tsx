import { redirect } from "next/navigation";

import { verifyEmail } from "@/app/actions/auth";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface VerifyEmailTokenPageProps {
  params: { token: string };
}

export default async function VerifyEmailTokenPage({ params }: VerifyEmailTokenPageProps) {
  const { token } = params;
  const result = await verifyEmail(token);

  if (!result.success) {
    return (
      <>
        <CardHeader>
          <CardTitle>Verification issue</CardTitle>
          <CardDescription>{result.error}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Need a new link? Go back to the sign-in page and request another verification email.
          </p>
        </CardContent>
      </>
    );
  }

  redirect("/auth/login");
}
