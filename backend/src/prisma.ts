import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// ===== ตรวจสอบ DATABASE_URL =====
if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL is not defined in .env')
}

// ===== Prisma Adapter (Postgres / Supabase) =====
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

// ===== Global singleton (กัน Prisma client ซ้ำตอน dev) =====
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

// ===== Export prisma instance =====
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

