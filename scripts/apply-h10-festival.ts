// 봉축 연등행렬 H-10 전사찰 일괄 적용
// - 기존 order:1 히어로 블록 → isVisible:false (삭제 금지)
// - H-10 없으면 create, 있으면 order:1 + isVisible:true
import { PrismaClient } from '@prisma/client'
import { EXCLUDED_SLUGS } from './constants'
const prisma = new PrismaClient()

async function applyFestival() {
  const temples = await prisma.temple.findMany({
    where: { code: { notIn: EXCLUDED_SLUGS } },
  })
  let count = 0

  for (const temple of temples) {
    // 기존 히어로 블록 숨김 (H-10 제외, 삭제 금지)
    await prisma.blockConfig.updateMany({
      where: {
        templeId:  temple.id,
        order:     1,
        isVisible: true,
        blockType: { not: 'H-10' },
      },
      data: { isVisible: false },
    })

    // H-10 블록 확인
    const existing = await prisma.blockConfig.findFirst({
      where: { templeId: temple.id, blockType: 'H-10' },
    })

    if (!existing) {
      await prisma.blockConfig.create({
        data: {
          templeId:  temple.id,
          blockType: 'H-10',
          order:     1,
          isVisible: true,
          config:    {},
        },
      })
    } else {
      await prisma.blockConfig.update({
        where: { id: existing.id },
        data:  { order: 1, isVisible: true },
      })
    }

    count++
    if (count % 100 === 0) console.log(`진행 중: ${count}/${temples.length}`)
  }

  console.log(`✅ 봉축 적용 완료: ${count}개 사찰`)
  await prisma.$disconnect()
}

applyFestival().catch(e => { console.error(e); process.exit(1) })
