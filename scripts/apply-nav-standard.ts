// 1080사찰 표준 NavBlock N-01 일괄 적용 — 대표 승인 후 실행
// order:0 고정, isVisible:true
// 이미 N-01 있으면 update, 없으면 create
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function applyNavStandard() {
  const temples = await db.temple.findMany()
  let created = 0, updated = 0

  for (const temple of temples) {
    const existing = await db.blockConfig.findFirst({
      where: { templeId: temple.id, blockType: 'N-01' },
    })

    if (existing) {
      await db.blockConfig.update({
        where: { id: existing.id },
        data:  { order: 0, isVisible: true },
      })
      updated++
    } else {
      await db.blockConfig.create({
        data: {
          templeId:  temple.id,
          blockType: 'N-01',
          order:     0,
          isVisible: true,
          config:    {},
        },
      })
      created++
    }

    const total = created + updated
    if (total % 100 === 0) console.log(`진행 중: ${total}/${temples.length}`)
  }

  console.log(`✅ NavBlock 적용 완료: 신규 ${created}개 | 업데이트 ${updated}개 | 합계 ${created + updated}개`)
  await db.$disconnect()
}

applyNavStandard().catch(e => { console.error(e); process.exit(1) })
