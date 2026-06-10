const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: "admin@jomoro.com" },
  });
  if (admin) {
    console.log("Admin account already exists, skipping seed.");
    return;
  }

  await prisma.user.create({
    data: {
      firstName: "Jomoro",
      lastName: "Admin",
      email: "admin@jomoro.com",
      password: "admin123",
      role: "ADMIN",
    },
  });

  console.log("Seeded default admin: admin@jomoro.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
