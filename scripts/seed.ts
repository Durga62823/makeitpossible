import {
  PrismaClient,
  UserRole,
  UserStatus,
  ProjectStatus,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with realistic test data...\n");

  // Clear existing data
  await prisma.timesheet.deleteMany({});
  await prisma.appraisalReview.deleteMany({});
  await prisma.appraisalCycle.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.team.deleteMany({});
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
        role: "ADMIN" as UserRole,
        status: "ACTIVE" as UserStatus,
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
        role: "MANAGER" as UserRole,
        status: "ACTIVE" as UserStatus,
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
        role: "MANAGER" as UserRole,
        status: "ACTIVE" as UserStatus,
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
        role: "LEAD" as UserRole,
        status: "ACTIVE" as UserStatus,
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
        role: "LEAD" as UserRole,
        status: "ACTIVE" as UserStatus,
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
        role: "EMPLOYEE" as UserRole,
        status: "ACTIVE" as UserStatus,
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
        role: "EMPLOYEE" as UserRole,
        status: "ACTIVE" as UserStatus,
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
        role: "EMPLOYEE" as UserRole,
        status: "ACTIVE" as UserStatus,
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
        role: "EMPLOYEE" as UserRole,
        status: "ACTIVE" as UserStatus,
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
        role: "EMPLOYEE" as UserRole,
        status: "ACTIVE" as UserStatus,
        emailVerified: new Date(),
        departmentId: departments[3].id,
      },
    }),
  ]);

  // 3. Create Teams
  console.log("👨‍💼 Creating teams...");
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: "Frontend Team",
        description: "React and UI development",
        departmentId: departments[0].id,
        leadId: users[1].id, // Sarah Johnson
      },
    }),
    prisma.team.create({
      data: {
        name: "Backend Team",
        description: "API and Database development",
        departmentId: departments[0].id,
        leadId: users[1].id, // Sarah Johnson
      },
    }),
    prisma.team.create({
      data: {
        name: "Sales Team",
        description: "Enterprise Sales",
        departmentId: departments[2].id,
        leadId: users[2].id, // Mike Chen
      },
    }),
  ]);

  // 4. Team members are managed via leadId field in teams
  console.log("✅ Teams created successfully");

  // 5. Create Projects
  console.log("📊 Creating projects...");
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        name: "Mobile App Redesign",
        description: "Redesign the mobile app UI/UX",
        status: "ON_TRACK" as ProjectStatus,
        startDate: new Date("2024-11-01"),
        endDate: new Date("2025-02-28"),
        ownerId: users[1].id, // Sarah Johnson
        teamId: teams[0].id,
      },
    }),
    prisma.project.create({
      data: {
        name: "API v2 Migration",
        description: "Migrate to new API architecture",
        status: "AT_RISK" as ProjectStatus,
        startDate: new Date("2024-12-01"),
        endDate: new Date("2025-03-31"),
        ownerId: users[1].id, // Sarah Johnson
        teamId: teams[1].id,
      },
    }),
    prisma.project.create({
      data: {
        name: "Enterprise Sales Pipeline",
        description: "Build enterprise sales pipeline",
        status: "ON_TRACK" as ProjectStatus,
        startDate: new Date("2024-10-15"),
        endDate: new Date("2025-01-31"),
        ownerId: users[2].id, // Mike Chen
        teamId: teams[2].id,
      },
    }),
    prisma.project.create({
      data: {
        name: "Data Analytics Platform",
        description: "Internal analytics dashboard",
        status: "DELAYED" as ProjectStatus,
        startDate: new Date("2024-09-01"),
        endDate: new Date("2025-01-15"),
        ownerId: users[1].id, // Sarah Johnson
        teamId: teams[1].id,
      },
    }),
  ]);

  // 6. Create Timesheets
  console.log("⏱️ Creating timesheets...");
  const now = new Date();
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    await Promise.all(
      users.slice(5, 10).map((user) =>
        prisma.timesheet.create({
          data: {
            userId: user.id,
            weekStart: weekStart,
            weekEnd: weekEnd,
            status: "APPROVED",
            totalHours: 40 + Math.random() * 2,
          },
        })
      )
    );
  }

  // 7. Create Appraisal Cycle
  console.log("📋 Creating appraisal cycle...");
  const cycle = await prisma.appraisalCycle.create({
    data: {
      name: "Q4 2024 Appraisals",
      description: "Quarterly appraisal cycle",
      startDate: new Date("2024-10-01"),
      endDate: new Date("2024-12-31"),
      status: "IN_PROGRESS",
    },
  });

  // 8. Create Appraisal Reviews
  console.log("⭐ Creating appraisal reviews...");
  await Promise.all([
    prisma.appraisalReview.create({
      data: {
        cycleId: cycle.id,
        userId: users[5].id, // John
        selfReview: "Good performance on mobile projects",
        managerReview: "Excellent performance on mobile redesign project",
        rating: 4,
        status: "COMPLETED",
      },
    }),
    prisma.appraisalReview.create({
      data: {
        cycleId: cycle.id,
        userId: users[6].id, // Jane
        selfReview: "Solid work but need to improve communication",
        managerReview: "Good performance, needs improvement in communication",
        rating: 3,
        status: "COMPLETED",
      },
    }),
    prisma.appraisalReview.create({
      data: {
        cycleId: cycle.id,
        userId: users[7].id, // Alex
        selfReview: "Proud of technical leadership",
        managerReview: "Outstanding technical skills and leadership",
        rating: 5,
        status: "IN_PROGRESS",
      },
    }),
    prisma.appraisalReview.create({
      data: {
        cycleId: cycle.id,
        userId: users[8].id, // Lisa
        selfReview: "Met sales targets",
        managerReview: "Strong sales performance, exceeded targets",
        rating: 4,
        status: "COMPLETED",
      },
    }),
    prisma.appraisalReview.create({
      data: {
        cycleId: cycle.id,
        userId: users[9].id, // Tom
        selfReview: "Need to develop marketing skills",
        managerReview: "Meeting expectations, needs to develop marketing skills",
        rating: 3,
        status: "IN_PROGRESS",
      },
    }),
  ]);

  console.log("\n✅ Database seeded successfully!");
  console.log("\n📝 Test Credentials:");
  console.log("═".repeat(50));
  console.log("Admin Account:");
  console.log("  Email: admin@company.com");
  console.log("  Password: password123");
  console.log("\nManager Account (Engineering):");
  console.log("  Email: manager.eng@company.com");
  console.log("  Password: password123");
  console.log("\nEmployee Account:");
  console.log("  Email: john.doe@company.com");
  console.log("  Password: password123");
  console.log("═".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
