import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";
import { NextResponse } from "next/server";

const testUsers = [
  {
    email: "admin@company.com",
    firstName: "Admin",
    lastName: "User",
    password: "password123",
    role: "ADMIN",
  },
  {
    email: "manager1@company.com",
    firstName: "Manager",
    lastName: "One",
    password: "password123",
    role: "MANAGER",
  },
  {
    email: "manager2@company.com",
    firstName: "Manager",
    lastName: "Two",
    password: "password123",
    role: "MANAGER",
  },
  {
    email: "lead1@company.com",
    firstName: "Lead",
    lastName: "One",
    password: "password123",
    role: "LEAD",
  },
  {
    email: "lead2@company.com",
    firstName: "Lead",
    lastName: "Two",
    password: "password123",
    role: "LEAD",
  },
  {
    email: "dev1@company.com",
    firstName: "Developer",
    lastName: "One",
    password: "password123",
    role: "EMPLOYEE",
  },
  {
    email: "dev2@company.com",
    firstName: "Developer",
    lastName: "Two",
    password: "password123",
    role: "EMPLOYEE",
  },
  {
    email: "dev3@company.com",
    firstName: "Developer",
    lastName: "Three",
    password: "password123",
    role: "EMPLOYEE",
  },
  {
    email: "dev4@company.com",
    firstName: "Developer",
    lastName: "Four",
    password: "password123",
    role: "EMPLOYEE",
  },
  {
    email: "dev5@company.com",
    firstName: "Developer",
    lastName: "Five",
    password: "password123",
    role: "EMPLOYEE",
  },
];

export async function POST() {
  try {
    console.log("\n📝 Seeding test users...\n");
    const results = [];

    for (const userData of testUsers) {
      const hashedPassword = await hashPassword(userData.password);

      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          emailVerified: new Date(),
          status: "ACTIVE",
          role: userData.role as any,
        },
        create: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          name: `${userData.firstName} ${userData.lastName}`,
          password: hashedPassword,
          emailVerified: new Date(),
          role: userData.role as any,
          status: "ACTIVE",
        },
      });

      results.push({
        email: user.email,
        role: user.role,
        created: true,
      });

      console.log(`✅ ${user.role} - ${user.email}`);
    }

    console.log("\n✅ All test users seeded successfully!\n");
    console.log("🔐 All passwords: password123\n");

    return NextResponse.json(
      {
        success: true,
        message: "Test users seeded successfully",
        count: results.length,
        users: results,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to seed users",
      },
      { status: 500 }
    );
  }
}
