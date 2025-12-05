import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth-utils";

async function createTestUser() {
  try {
    const hashedPassword = await hashPassword("Test@123456");

    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: hashedPassword,
        firstName: "Test",
        lastName: "User",
        name: "Test User",
        emailVerified: new Date(), // Already verified
        role: "ADMIN",
        status: "ACTIVE",
      },
    });

    console.log("✅ Test user created successfully!");
    console.log("📧 Email: test@example.com");
    console.log("🔐 Password: Test@123456");
    console.log("👤 User ID:", user.id);
  } catch (error: any) {
    if (error.code === "P2002") {
      console.log("⚠️  User already exists. Use existing credentials:");
      console.log("📧 Email: test@example.com");
      console.log("🔐 Password: Test@123456");
    } else {
      console.error("❌ Error creating test user:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
