const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with realistic test data...\n");

  // Clear existing data (respect foreign keys)
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.pTO.deleteMany({});
  await prisma.timesheet.deleteMany({});
  await prisma.audit.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.department.deleteMany({});

  // 1. Create Departments
  console.log("📋 Creating departments...");
  const departments = await Promise.all([
    prisma.department.create({
      data: { name: "Engineering", description: "Software Development" },
    }),
    prisma.department.create({
      data: { name: "Product", description: "Product Management & Design" },
    }),
    prisma.department.create({
      data: { name: "Sales", description: "Sales & Business Development" },
    }),
    prisma.department.create({
      data: { name: "Marketing", description: "Marketing & Communications" },
    }),
    prisma.department.create({
      data: { name: "HR", description: "Human Resources" },
    }),
  ]);

  // 2. Create Users with different roles
  console.log("👥 Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    // Admin
    prisma.user.create({
      data: {
        email: "admin@company.com",
        password: hashedPassword,
        firstName: "Admin",
        lastName: "User",
        name: "Admin User",
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: new Date(),
        departmentId: departments[0].id,
      },
    }),
    // Managers
    prisma.user.create({
      data: {
        email: "manager.eng@company.com",
        password: hashedPassword,
        firstName: "Sarah",
        lastName: "Johnson",
        name: "Sarah Johnson",
        role: "MANAGER",
        status: "ACTIVE",
        emailVerified: new Date(),
        departmentId: departments[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: "manager.sales@company.com",
        password: hashedPassword,
        firstName: "Mike",
        lastName: "Chen",
        name: "Mike Chen",
        role: "MANAGER",
        status: "ACTIVE",
        emailVerified: new Date(),
        departmentId: departments[2].id,
      },
    }),
    // Leads
    prisma.user.create({
      data: {
        email: "lead.frontend@company.com",
        password: hashedPassword,
        firstName: "Emily",
        lastName: "Rodriguez",
        name: "Emily Rodriguez",
        role: "LEAD",
        status: "ACTIVE",
        emailVerified: new Date(),
        departmentId: departments[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: "lead.backend@company.com",
        password: hashedPassword,
        firstName: "David",
        lastName: "Kim",
        name: "David Kim",
        role: "LEAD",
        status: "ACTIVE",
        emailVerified: new Date(),
        departmentId: departments[0].id,
      },
    }),
    // Employees
    prisma.user.create({
      data: {
        email: "john.doe@company.com",
        password: hashedPassword,
        firstName: "John",
        lastName: "Doe",
        name: "John Doe",
        role: "EMPLOYEE",
        status: "ACTIVE",
        emailVerified: new Date(),
        departmentId: departments[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: "jane.smith@company.com",
        password: hashedPassword,
        firstName: "Jane",
        lastName: "Smith",
        name: "Jane Smith",
        role: "EMPLOYEE",
        status: "ACTIVE",
        emailVerified: new Date(),
        departmentId: departments[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: "alex.wilson@company.com",
        password: hashedPassword,
        firstName: "Alex",
        lastName: "Wilson",
        name: "Alex Wilson",
        role: "EMPLOYEE",
        status: "ACTIVE",
        emailVerified: new Date(),
        departmentId: departments[1].id,
      },
    }),
    prisma.user.create({
      data: {
        email: "lisa.brown@company.com",
        password: hashedPassword,
        firstName: "Lisa",
        lastName: "Brown",
        name: "Lisa Brown",
        role: "EMPLOYEE",
        status: "ACTIVE",
        emailVerified: new Date(),
        departmentId: departments[2].id,
      },
    }),
    prisma.user.create({
      data: {
        email: "tom.davis@company.com",
        password: hashedPassword,
        firstName: "Tom",
        lastName: "Davis",
        name: "Tom Davis",
        role: "EMPLOYEE",
        status: "ACTIVE",
        emailVerified: new Date(),
        departmentId: departments[3].id,
      },
    }),
  ]);

  console.log("\n✅ Database seeded successfully with 10 users!");
  console.log("\n📝 Test Credentials:");
  console.log("═".repeat(50));
  console.log("Admin Account:");
  console.log("  Email: admin@company.com");
  console.log("  Password: password123");
  console.log("\nManager Account (Engineering):");
  console.log("  Email: manager.eng@company.com");
  console.log("  Password: password123");
  console.log("\nLead Account (Frontend):");
  console.log("  Email: lead.frontend@company.com");
  console.log("  Password: password123");
  console.log("\nEmployee Account:");
  console.log("  Email: john.doe@company.com");
  console.log("  Password: password123");
  console.log("═".repeat(50));
  console.log("\n✨ You can now test role-based access:");
  console.log("   - Login as admin@company.com to access /admin");
  console.log("   - Login as manager to access /manager");
  console.log("   - Login as employee to access /dashboard");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
