import { headers } from "next/headers";

export const getRequestIp = async () => {
  const incomingHeaders = await headers();
  return (
    incomingHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    incomingHeaders.get("x-real-ip") ??
    "unknown"
  );
};

export const getRequestUserAgent = async () => {
  const incomingHeaders = await headers();
  return incomingHeaders.get("user-agent") ?? "unknown";
};
