import { prisma } from "@/lib/prisma";

async function checkUser() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      managerId: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  console.log("\n📋 Recent Users:\n");
  users.forEach((user) => {
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${user.firstName} ${user.lastName}`);
    console.log(`Role: ${user.role}`);
    console.log(`Status: ${user.status}`);
    console.log(`Manager ID: ${user.managerId || "None"}`);
    console.log("---\n");
  });

  await prisma.$disconnect();
}

checkUser().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
