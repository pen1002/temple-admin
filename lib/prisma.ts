// 전역 단일 Prisma 인스턴스 — 모든 API에서 공유
// 이것을 import 하면 커넥션 풀 하나만 사용
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient }

export const prisma = globalForPrisma.__prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.__prisma = prisma
