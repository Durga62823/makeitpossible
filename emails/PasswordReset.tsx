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

interface PasswordResetProps {
  firstName?: string | null;
  actionUrl: string;
}

export default function PasswordReset({ firstName, actionUrl }: PasswordResetProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your Make It Possible password</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.heading}>Password reset requested</Text>
          <Text style={styles.paragraph}>
            {firstName ? `Hi ${firstName},` : "Hello,"} we received a request to reset your password. Use the
            secure button below to create a new one. This link expires in 60 minutes.
          </Text>
          <Section style={styles.section}>
            <Button style={styles.button} href={actionUrl}>
              Reset password
            </Button>
          </Section>
          <Text style={styles.paragraph}>
            Didn't request this? You can ignore this email and your current password will stay active.
          </Text>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>Need help? security@makeitpossible.com</Text>
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
    backgroundColor: "#10B981",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "12px 28px",
    textDecoration: "none",
    fontWeight: 600,
  },
  hr: { borderColor: "#e5e7eb", marginTop: "24px" },
  footer: { fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "16px" },
};
