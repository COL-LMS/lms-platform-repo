const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);
  
  const superAdmin = await prisma.user.upsert({
    where: { username: 'sadmin' },
    update: {
      passwordHash: passwordHash,
    },
    create: {
      username: 'sadmin',
      name: 'Super Admin',
      passwordHash: passwordHash,
      role: 'SUPER_ADMIN',
    },
  });

  console.log('Super Admin seeded successfully:', superAdmin.username);
  await prisma.$disconnect();

  // Copy dev.db to seed.db for Vercel deployment support
  const devDbPath = path.join(__dirname, 'dev.db');
  const seedDbPath = path.join(__dirname, 'seed.db');
  
  if (fs.existsSync(devDbPath)) {
    fs.copyFileSync(devDbPath, seedDbPath);
    console.log('Successfully created prisma/seed.db for deployment!');
  } else {
    console.error('dev.db not found at', devDbPath);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
