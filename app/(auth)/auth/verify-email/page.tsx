import type { Metadata } from "next";

import { EmailVerificationNotice } from "@/components/auth/EmailVerificationNotice";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Verify email | Make It Possible",
};

export default function VerifyEmailPage() {
  return (
    <>
      <CardHeader>
        <CardTitle>Check your inbox</CardTitle>
        <CardDescription>We just sent you a verification link.</CardDescription>
      </CardHeader>
      <CardContent>
        <EmailVerificationNotice />
      </CardContent>
    </>
  );
}
