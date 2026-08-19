const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);
  
  const superAdmin = await prisma.user.upsert({
    where: { username: 'sadmin' },
    update: {},
    create: {
      username: 'sadmin',
      name: 'Super Admin',
      passwordHash: passwordHash,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Super Admin seeded successfully:', superAdmin.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
