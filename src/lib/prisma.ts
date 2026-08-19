import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function initDatabaseUrl() {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpDbPath = '/tmp/dev.db';
    const seedDbPath = path.join(process.cwd(), 'prisma', 'seed.db');

    try {
      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(seedDbPath)) {
          fs.copyFileSync(seedDbPath, tmpDbPath);
          console.log('Successfully copied seed database to /tmp/dev.db');
        } else {
          console.warn('Seed database file not found at:', seedDbPath);
        }
      }
      return `file:${tmpDbPath}`;
    } catch (e) {
      console.error('Error preparing SQLite database on Vercel:', e);
    }
  }
  return process.env.DATABASE_URL || 'file:./dev.db';
}

process.env.DATABASE_URL = initDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
