/**
 * 문수사 원본 히어로(H-01) 복원 스크립트
 * 실행: npx ts-node scripts/restore-munsusa-hero.ts
 *
 * 동작:
 *   1. H-10 → isVisible:false, order:99
 *   2. H-01 → isVisible:true, order:1
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function restoreMunsusa() {
  const temple = await prisma.temple.findFirst({
    where: { code: 'munsusa' },
    select: { id: true },
  })
  if (!temple) throw new Error('munsusa 사찰을 찾을 수 없습니다')

  const tid = temple.id

  // H-10 숨김
  const h10 = await prisma.blockConfig.updateMany({
    where: { templeId: tid, blockType: 'H-10' },
    data: { isVisible: false, order: 99 },
  })
  console.log(`H-10 숨김: ${h10.count}개`)

  // H-01 원본 복원
  const h01 = await prisma.blockConfig.updateMany({
    where: { templeId: tid, blockType: 'H-01', order: 98 },
    data: { isVisible: true, order: 1 },
  })
  console.log(`H-01 복원: ${h01.count}개`)

  console.log('✅ 문수사 원본 히어로 복원 완료')
  await prisma.$disconnect()
}

restoreMunsusa().catch(e => {
  console.error(e)
  process.exit(1)
})
