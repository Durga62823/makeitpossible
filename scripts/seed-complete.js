const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting comprehensive data seeding...\n");

  try {
    // 1. Create Users
    console.log("📝 Creating users...");
    const admin = await prisma.user.upsert({
      where: { email: "admin@company.com" },
      update: {},
      create: {
        email: "admin@company.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "Admin",
        lastName: "User",
        name: "Admin User",
        role: "ADMIN",
        status: "ACTIVE",
        emailVerified: new Date(),
        phoneNumber: "+1-555-0001",
      },
    });

    const manager1 = await prisma.user.upsert({
      where: { email: "manager1@company.com" },
      update: {},
      create: {
        email: "manager1@company.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "Manager",
        lastName: "One",
        name: "Manager One",
        role: "MANAGER",
        status: "ACTIVE",
        emailVerified: new Date(),
        phoneNumber: "+1-555-0002",
      },
    });

    const manager2 = await prisma.user.upsert({
      where: { email: "manager2@company.com" },
      update: {},
      create: {
        email: "manager2@company.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "Manager",
        lastName: "Two",
        name: "Manager Two",
        role: "MANAGER",
        status: "ACTIVE",
        emailVerified: new Date(),
        phoneNumber: "+1-555-0003",
      },
    });

    const lead1 = await prisma.user.upsert({
      where: { email: "lead1@company.com" },
      update: {},
      create: {
        email: "lead1@company.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "Lead",
        lastName: "One",
        name: "Lead One",
        role: "LEAD",
        status: "ACTIVE",
        emailVerified: new Date(),
        phoneNumber: "+1-555-0004",
      },
    });

    const lead2 = await prisma.user.upsert({
      where: { email: "lead2@company.com" },
      update: {},
      create: {
        email: "lead2@company.com",
        password: await bcrypt.hash("password123", 10),
        firstName: "Lead",
        lastName: "Two",
        name: "Lead Two",
        role: "LEAD",
        status: "ACTIVE",
        emailVerified: new Date(),
        phoneNumber: "+1-555-0005",
      },
    });

    const employees = [];
    for (let i = 1; i <= 10; i++) {
      const emp = await prisma.user.upsert({
        where: { email: `employee${i}@company.com` },
        update: {},
        create: {
          email: `employee${i}@company.com`,
          password: await bcrypt.hash("password123", 10),
          firstName: `Employee`,
          lastName: `${i}`,
          name: `Employee ${i}`,
          role: "EMPLOYEE",
          status: "ACTIVE",
          emailVerified: new Date(),
          phoneNumber: `+1-555-00${10 + i}`,
          managerId: i <= 5 ? manager1.id : manager2.id,
        },
      });
      employees.push(emp);
    }

    console.log(`✅ Created ${1 + 2 + 2 + 10} users\n`);

    // 2. Create Projects
    console.log("🚀 Creating projects...");
    const projects = [];
    const projectNames = [
      "Mobile App Redesign",
      "AI Analytics Platform",
      "Cloud Migration",
      "Security Audit",
      "Customer Portal",
    ];

    for (let i = 0; i < projectNames.length; i++) {
      const projectStatus =
        i % 2 === 0 ? "ON_TRACK" : i % 3 === 0 ? "AT_RISK" : "DELAYED";
      const project = await prisma.project.upsert({
        where: { id: `project-${i}` },
        update: { status: projectStatus },
        create: {
          id: `project-${i}`,
          name: projectNames[i],
          description: `Strategic initiative for ${projectNames[i]}`,
          status: projectStatus,
          startDate: new Date(2025, Math.floor(i / 2), 1),
          endDate: new Date(2025, Math.floor(i / 2) + 3, 30),
          ownerId: i % 2 === 0 ? lead1.id : lead2.id,
          completionRate: 10 + i * 15,
        },
      });
      projects.push(project);
    }

    console.log(`✅ Created ${projects.length} projects\n`);

    // 3. Create Appraisal Cycle and Reviews
    console.log("📊 Creating appraisal cycles and reviews...");
    const cycle = await prisma.appraisalCycle.upsert({
      where: { id: "cycle-q1-2025" },
      update: {},
      create: {
        id: "cycle-q1-2025",
        name: "Q1 2025 Performance Review",
        description: "First quarter 2025 appraisal cycle",
        startDate: new Date(2025, 0, 1),
        endDate: new Date(2025, 2, 31),
        status: "COMPLETED",
      },
    });

    let appraisalCount = 0;
    for (const emp of employees.slice(0, 5)) {
      await prisma.appraisalReview.upsert({
        where: {
          cycleId_userId: {
            cycleId: cycle.id,
            userId: emp.id,
          },
        },
        update: { status: "COMPLETED" },
        create: {
          cycleId: cycle.id,
          userId: emp.id,
          selfReview: "Great performance and learning opportunities",
          managerReview:
            "Excellent work on projects. Shows strong technical skills and leadership potential.",
          rating: 4.0 + Math.random() * 1.0,
          finalRating: 4.0 + Math.random() * 1.0,
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
      appraisalCount++;
    }

    console.log(`✅ Created ${appraisalCount} appraisal reviews\n`);

    // 4. Create PTO Requests
    console.log("🏖️  Creating PTO requests...");
    const ptoTypes = ["VACATION", "SICK_LEAVE", "PERSONAL"];
    const ptoStatuses = ["PENDING", "APPROVED", "REJECTED"];
    let ptoCount = 0;

    for (let i = 0; i < employees.slice(0, 8).length; i++) {
      const emp = employees[i];
      const ptoType = ptoTypes[Math.floor(Math.random() * ptoTypes.length)];
      const status =
        ptoStatuses[Math.floor(Math.random() * ptoStatuses.length)];
      const daysRequested = Math.floor(Math.random() * 5) + 1;

      await prisma.pTORequest.create({
        data: {
          userId: emp.id,
          type: ptoType,
          startDate: new Date(
            2025,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          endDate: new Date(
            2025,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 5
          ),
          days: daysRequested,
          reason: "Taking time off",
          status: status,
          approverId: emp.managerId || manager1.id,
          approvedAt: status === "APPROVED" ? new Date() : null,
          rejectionReason: status === "REJECTED" ? "Business needs" : null,
        },
      });
      ptoCount++;
    }

    console.log(`✅ Created ${ptoCount} PTO requests\n`);

    // 5. Create Timesheets
    console.log("⏱️  Creating timesheets...");
    let timesheetCount = 0;

    for (let i = 0; i < employees.slice(0, 6).length; i++) {
      const emp = employees[i];
      const weekStart = new Date(2025, 0, 1 + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const timesheet = await prisma.timesheet.upsert({
        where: {
          userId_weekStart: {
            userId: emp.id,
            weekStart: weekStart,
          },
        },
        update: { status: "APPROVED" },
        create: {
          userId: emp.id,
          weekStart: weekStart,
          weekEnd: weekEnd,
          totalHours: 40,
          status: "APPROVED",
          approverId: emp.managerId || manager1.id,
          approvedAt: new Date(),
          comments: "Weekly hours submitted",
        },
      });

      // Add timesheet entries for each day
      for (let day = 0; day < 5; day++) {
        const entryDate = new Date(weekStart);
        entryDate.setDate(entryDate.getDate() + day);

        await prisma.timesheetEntry.create({
          data: {
            timesheetId: timesheet.id,
            date: entryDate,
            projectId: projects[day % projects.length].id,
            hours: 8,
            description: `Work on ${projects[day % projects.length].name}`,
            billable: true,
          },
        });
      }

      timesheetCount++;
    }

    console.log(`✅ Created ${timesheetCount} timesheets with entries\n`);

    // 6. Create Audit Logs
    console.log("📋 Creating audit logs...");
    const auditActions = [
      "USER_CREATED",
      "USER_UPDATED",
      "ROLE_CHANGED",
      "APPRAISAL_CREATED",
      "APPRAISAL_COMPLETED",
      "DATA_EXPORTED",
      "SETTINGS_UPDATED",
    ];

    let auditCount = 0;
    for (let i = 0; i < 20; i++) {
      const action = auditActions[i % auditActions.length];
      await prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: action,
          entity: ["User", "Project", "Appraisal", "Settings"][i % 4],
          entityId: [admin.id, projects[0].id][i % 2],
          details: `${action} performed on ${new Date().toISOString()}`,
          ipAddress: "192.168.1.1",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
      });
      auditCount++;
    }

    console.log(`✅ Created ${auditCount} audit logs\n`);

    // Summary
    console.log("═══════════════════════════════════════════════════");
    console.log("✅ DATABASE SEEDING COMPLETE!\n");
    console.log("📊 Summary:");
    console.log(`  👥 Users: 15 (1 Admin, 2 Managers, 2 Leads, 10 Employees)`);
    console.log(`  📁 Projects: ${projects.length}`);
    console.log(`  ⭐ Appraisal Reviews: ${appraisalCount}`);
    console.log(`  🏖️  PTO Requests: ${ptoCount}`);
    console.log(`  ⏱️  Timesheets: ${timesheetCount}`);
    console.log(`  📋 Audit Logs: ${auditCount}`);
    console.log("\n🔐 Test Credentials:");
    console.log("  Email: admin@company.com");
    console.log("  Password: password123");
    console.log("\n  Email: manager1@company.com");
    console.log("  Password: password123");
    console.log("\n  Email: employee1@company.com");
    console.log("  Password: password123");
    console.log("═══════════════════════════════════════════════════\n");

    await prisma.$disconnect();
  } catch (e) {
    console.error("❌ Error seeding database:", e.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
