import { NextResponse } from "next/server";

import { registerUser } from "@/app/actions/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await registerUser(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ message: result.message ?? "Registered" }, { status: 201 });
}
