import { render } from "@react-email/render";
import { Resend } from "resend";

import EmailVerification from "@/emails/EmailVerification";
import PasswordReset from "@/emails/PasswordReset";
import WelcomeEmail from "@/emails/Welcome";
import { getBaseUrl } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

const assertEmailConfig = () => {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error("Email credentials are not configured");
  }
};

type EmailParams = {
  email: string;
  token: string;
  firstName?: string | null;
};

export async function sendVerificationEmail({ email, token, firstName }: EmailParams) {
  assertEmailConfig();
  const verificationUrl = `${getBaseUrl()}/auth/verify-email/${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Verify your Make It Possible account",
    html: render(
      <EmailVerification firstName={firstName} actionUrl={verificationUrl} />,
    ),
  });
}

export async function sendPasswordResetEmail({ email, token, firstName }: EmailParams) {
  assertEmailConfig();
  const resetUrl = `${getBaseUrl()}/auth/reset-password/${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Reset your Make It Possible password",
    html: render(<PasswordReset firstName={firstName} actionUrl={resetUrl} />),
  });
}

export async function sendWelcomeEmail(email: string, firstName?: string | null) {
  assertEmailConfig();
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Welcome to Make It Possible",
    html: render(<WelcomeEmail firstName={firstName} />),
  });
}
