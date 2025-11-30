import * as React from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface EmailVerificationProps {
  firstName?: string | null;
  actionUrl: string;
}

export default function EmailVerification({ firstName, actionUrl }: EmailVerificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your Make It Possible account</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.heading}>Confirm your email</Text>
          <Text style={styles.paragraph}>
            {firstName ? `Hi ${firstName},` : "Hello,"} thanks for creating an account with Make It
            Possible. Please verify your email to activate enterprise-grade security.
          </Text>
          <Section style={styles.section}>
            <Button style={styles.button} href={actionUrl}>
              Verify email
            </Button>
          </Section>
          <Text style={styles.paragraph}>
            This link expires in 24 hours. If you didn't sign up, you can safely ignore this email.
          </Text>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>© {new Date().getFullYear()} Make It Possible</Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: { backgroundColor: "#f4f6fb", padding: "24px" },
  container: {
    maxWidth: "480px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "16px",
    fontFamily: '"Inter", Arial, sans-serif',
  },
  heading: { fontSize: "20px", fontWeight: 600, marginBottom: "16px", color: "#111827" },
  paragraph: { fontSize: "14px", color: "#4b5563", lineHeight: "22px" },
  section: { margin: "24px 0" },
  button: {
    backgroundColor: "#1E40AF",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "12px 28px",
    textDecoration: "none",
    fontWeight: 600,
  },
  hr: { borderColor: "#e5e7eb", marginTop: "24px" },
  footer: { fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "16px" },
};
