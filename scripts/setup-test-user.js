const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash("Test@123456", 10);

    const user = await prisma.user.upsert({
      where: { email: "test@example.com" },
      update: {
        emailVerified: new Date(),
        status: "ACTIVE",
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

    console.log("\n✅ Test user ready!\n");
    console.log("📧 Email: test@example.com");
    console.log("🔐 Password: Test@123456");
    console.log("👤 Role: ADMIN\n");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
