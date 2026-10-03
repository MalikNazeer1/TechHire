const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.user.create({
    data: {
      email: "example@example.com",
      passwordHash: "hashedpassword",
      name: "John Doe",
      role: "user",
      createdAt: new Date(),
      isActive: true,
      supportedLinks: null,
    },
  });

  console.log("User created:", newUser);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// use `prisma` in your application to read and write data in your DB
