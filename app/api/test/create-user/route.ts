import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const hashedPassword = await hashPassword("Test@123456");

    const user = await prisma.user.upsert({
      where: { email: "test@example.com" },
      update: {
        emailVerified: new Date(),
        status: "ACTIVE",
        role: "ADMIN",
      },
      create: {
        email: "test@example.com",
        password: hashedPassword,
        firstName: "Test",
        lastName: "User",
        name: "Test User",
        emailVerified: new Date(),
        role: "ADMIN",
        status: "ACTIVE",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Test user created successfully",
        credentials: {
          email: "test@example.com",
          password: "Test@123456",
          role: "ADMIN",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create test user" },
      { status: 500 }
    );
  }
}
