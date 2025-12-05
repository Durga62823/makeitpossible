import { prisma } from "../lib/prisma";

async function setupLeadUser() {
  try {
    // Get the specific user
    const user = await prisma.user.findUnique({
      where: { email: "psivadurgaprasad88@gmail.com" },
    });

    if (!user) {
      console.error("User psivadurgaprasad88@gmail.com not found. Please login first.");
      process.exit(1);
    }

    console.log(`Found user: ${user.email}`);

    // Check if departments exist
    let department = await prisma.department.findFirst();
    
    if (!department) {
      console.log("Creating Engineering department...");
      department = await prisma.department.create({
        data: {
          name: "Engineering",
          description: "Engineering Department",
        },
      });
      console.log(`✅ Created department: ${department.name}`);
    }

    // Check if team exists
    let team = await prisma.team.findFirst({
      where: { departmentId: department.id },
    });

    if (!team) {
      console.log("Creating Engineering Team...");
      team = await prisma.team.create({
        data: {
          name: "Engineering Team",
          description: "Core Engineering Team",
          departmentId: department.id,
        },
      });
      console.log(`✅ Created team: ${team.name}`);
    }

    // Update user to LEAD role and assign to team
    console.log(`Updating ${user.email} to LEAD role...`);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: "LEAD",
        teamId: team.id,
        departmentId: department.id,
      },
    });

    console.log("\n🎉 Success! User setup complete:");
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Role: ${updatedUser.role}`);
    console.log(`   Team: ${team.name}`);
    console.log(`   Department: ${department.name}`);
    console.log("\n✅ You can now access the Lead dashboard at /lead");
    console.log("⚠️  Please logout and login again to refresh your session");

  } catch (error) {
    console.error("Error setting up lead user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupLeadUser();
