const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function seedTestUsers() {
  try {
    const testUsers = [
      {
        email: "admin@company.com",
        firstName: "Admin",
        lastName: "User",
        name: "Admin User",
        password: "password123",
        role: "ADMIN",
      },
      {
        email: "manager1@company.com",
        firstName: "Manager",
        lastName: "One",
        name: "Manager One",
        password: "password123",
        role: "MANAGER",
      },
      {
        email: "manager2@company.com",
        firstName: "Manager",
        lastName: "Two",
        name: "Manager Two",
        password: "password123",
        role: "MANAGER",
      },
      {
        email: "lead1@company.com",
        firstName: "Lead",
        lastName: "One",
        name: "Lead One",
        password: "password123",
        role: "LEAD",
      },
      {
        email: "lead2@company.com",
        firstName: "Lead",
        lastName: "Two",
        name: "Lead Two",
        password: "password123",
        role: "LEAD",
      },
      {
        email: "dev1@company.com",
        firstName: "Developer",
        lastName: "One",
        name: "Developer One",
        password: "password123",
        role: "EMPLOYEE",
      },
      {
        email: "dev2@company.com",
        firstName: "Developer",
        lastName: "Two",
        name: "Developer Two",
        password: "password123",
        role: "EMPLOYEE",
      },
      {
        email: "dev3@company.com",
        firstName: "Developer",
        lastName: "Three",
        name: "Developer Three",
        password: "password123",
        role: "EMPLOYEE",
      },
      {
        email: "dev4@company.com",
        firstName: "Developer",
        lastName: "Four",
        name: "Developer Four",
        password: "password123",
        role: "EMPLOYEE",
      },
      {
        email: "dev5@company.com",
        firstName: "Developer",
        lastName: "Five",
        name: "Developer Five",
        password: "password123",
        role: "EMPLOYEE",
      },
    ];

    console.log("\n📝 Seeding test users...\n");
    console.log("┌─────────────────────────────────────────────────────────┐");
    console.log(
      "│ Role     │ Email                  │ Password                │"
    );
    console.log("├─────────────────────────────────────────────────────────┤");

    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          emailVerified: new Date(),
          status: "ACTIVE",
          role: userData.role,
        },
        create: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          name: userData.name,
          password: hashedPassword,
          emailVerified: new Date(),
          role: userData.role,
          status: "ACTIVE",
        },
      });

      const role = userData.role.padEnd(8);
      const email = userData.email.padEnd(23);
      const password = userData.password.padEnd(24);
      console.log(`│ ${role} │ ${email} │ ${password} │`);
    }

    console.log(
      "└─────────────────────────────────────────────────────────┘\n"
    );
    console.log("✅ Test users seeded successfully!\n");
    console.log("🔐 All passwords: password123\n");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestUsers();
