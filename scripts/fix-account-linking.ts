import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixAccountLinking() {
  try {
    console.log("Checking for duplicate OAuth accounts...");

    // Find all accounts and group by provider + providerAccountId
    const allAccounts = await prisma.account.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    console.log(`Found ${allAccounts.length} OAuth accounts total\n`);

    for (const account of allAccounts) {
      console.log(`Account: ${account.provider}`);
      console.log(`  User: ${account.user?.email || 'Unknown'} (ID: ${account.userId})`);
      console.log(`  Provider ID: ${account.providerAccountId}`);
      console.log("");
    }

    // Group by provider + providerAccountId
    const accountsByKey = new Map<string, typeof allAccounts>();

    for (const account of allAccounts) {
      const key = `${account.provider}:${account.providerAccountId}`;
      if (!accountsByKey.has(key)) {
        accountsByKey.set(key, []);
      }
      accountsByKey.get(key)!.push(account);
    }

    // Find duplicates
    const duplicates: string[] = [];
    for (const [key, accounts] of accountsByKey.entries()) {
      if (accounts.length > 1) {
        console.log(`⚠️  Duplicate found for ${key}:`);
        accounts.forEach((acc) => {
          console.log(
            `   - User: ${acc.user?.email || 'Unknown'} (${acc.userId})`
          );
        });
        duplicates.push(...accounts.map(a => a.id));
        console.log("");
      }
    }

    if (duplicates.length === 0) {
      console.log("✅ No duplicate OAuth accounts found!");
      return;
    }

    // Delete duplicates (keep the first one for each provider + providerAccountId)
    console.log(`\nRemoving ${duplicates.length} duplicate accounts...\n`);

    const toDelete = new Set<string>();
    for (const [key, accounts] of accountsByKey.entries()) {
      if (accounts.length > 1) {
        // Keep the first (oldest), delete the rest
        for (let i = 1; i < accounts.length; i++) {
          toDelete.add(accounts[i].id);
        }
      }
    }

    for (const accountId of toDelete) {
      const account = allAccounts.find((a) => a.id === accountId);
      if (account?.user) {
        await prisma.account.delete({
          where: { id: accountId },
        });
        console.log(
          `✅ Deleted: ${account.provider} account for ${account.user.email}`
        );
      }
    }

    console.log("\n✅ Account linking fixed!");
  } catch (error) {
    console.error("❌ Error fixing account linking:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixAccountLinking();
