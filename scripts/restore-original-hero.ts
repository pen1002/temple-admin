// 봉축 종료 후 원복 스크립트 — 봉축 기간 후 실행
// - H-10 블록 → isVisible:false, order:99
// - 기존 숨겨진 원래 히어로 블록 → isVisible:true, order:1 복원
import { PrismaClient } from '@prisma/client'
import { EXCLUDED_SLUGS } from './constants'
const prisma = new PrismaClient()

async function restoreFestival() {
  const temples = await prisma.temple.findMany({
    where: { code: { notIn: EXCLUDED_SLUGS } },
  })
  let count = 0

  for (const temple of temples) {
    // H-10 숨김 + 맨 뒤로
    await prisma.blockConfig.updateMany({
      where: { templeId: temple.id, blockType: 'H-10' },
      data:  { isVisible: false, order: 99 },
    })

    // 기존 원래 히어로 복원 (숨겨진 것 중 가장 낮은 order)
    const original = await prisma.blockConfig.findFirst({
      where: {
        templeId:  temple.id,
        blockType: { not: 'H-10' },
        isVisible: false,
      },
      orderBy: { order: 'asc' },
    })

    if (original) {
      await prisma.blockConfig.update({
        where: { id: original.id },
        data:  { isVisible: true, order: 1 },
      })
    }

    count++
    if (count % 100 === 0) console.log(`진행 중: ${count}/${temples.length}`)
  }

  console.log(`✅ 원복 완료: ${count}개 사찰`)
  await prisma.$disconnect()
}

restoreFestival().catch(e => { console.error(e); process.exit(1) })
