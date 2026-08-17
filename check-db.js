const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const users = await p.user.findMany();
  console.log('Users in database:', JSON.stringify(users, null, 2));
  console.log('Total users:', users.length);
}

main()
  .then(() => p.$disconnect())
  .catch(e => { console.error('DB Error:', e); p.$disconnect(); });
