import * as React from "react";

import { Body, Container, Head, Hr, Html, Preview, Text } from "@react-email/components";

interface WelcomeEmailProps {
  firstName?: string | null;
}

export default function WelcomeEmail({ firstName }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Make It Possible</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.heading}>Welcome aboard!</Text>
          <Text style={styles.paragraph}>
            {firstName ? `Hi ${firstName},` : "Hello,"} thanks for joining Make It Possible. You now have access
            to AI-assisted planning, automated workflows, and enterprise-grade governance.
          </Text>
          <Text style={styles.paragraph}>Start by creating your first workspace and inviting collaborators.</Text>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>Let's build something remarkable together.</Text>
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
  hr: { borderColor: "#e5e7eb", marginTop: "24px" },
  footer: { fontSize: "12px", color: "#9ca3af", textAlign: "center", marginTop: "16px" },
};
