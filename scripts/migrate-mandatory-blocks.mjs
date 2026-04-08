/**
 * 기존 사찰 필수 블록 일괄 보정 스크립트
 * 대표님 지시 2026.04.08
 *
 * munsusa · borimsa 제외한 전체 사찰에
 * MANDATORY_BLOCKS가 없는 경우만 삽입 (기존 블록 유지)
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const MANDATORY_BLOCKS = [
  { blockType: 'GNB-01',    order: 0,  isVisible: true, label: 'GNB 네비게이션',           config: {} },
  { blockType: 'T-01',      order: 1,  isVisible: true, label: '공지 티커 배너',            config: {} },
  { blockType: 'WISDOM-01', order: 2,  isVisible: true, label: '오늘의 짬짜미 부처님말씀',  config: {} },
  { blockType: 'SEC06-01',  order: 3,  isVisible: true, label: '주지스님 인사말',           config: {} },
  { blockType: 'E-01',      order: 4,  isVisible: true, label: '기도법회행사',              config: {} },
  { blockType: 'NS-01',     order: 5,  isVisible: true, label: '공지사항 스와이프',         config: {} },
  { blockType: 'SEC05-01',  order: 7,  isVisible: true, label: '우리절 연혁',              config: {} },
  { blockType: 'G-01',      order: 8,  isVisible: true, label: '우리절 갤러리',            config: {} },
  { blockType: 'V-01',      order: 9,  isVisible: true, label: '오시는 길',                config: {} },
]

const EXCLUDED = ['munsusa', 'borimsa']

async function main() {
  const temples = await db.temple.findMany({
    where: { code: { notIn: EXCLUDED } },
    select: { id: true, code: true, name: true },
  })

  console.log(`\n대상 사찰: ${temples.length}개 (munsusa·borimsa 제외)`)
  console.log('─'.repeat(60))

  let totalInserted = 0

  for (const temple of temples) {
    const existing = await db.blockConfig.findMany({
      where: { templeId: temple.id },
      select: { blockType: true },
    })
    const existingTypes = new Set(existing.map(b => b.blockType))
    const toInsert = MANDATORY_BLOCKS.filter(b => !existingTypes.has(b.blockType))

    if (toInsert.length === 0) {
      console.log(`✅ ${temple.code} (${temple.name}): 이미 완비`)
      continue
    }

    await db.blockConfig.createMany({
      data: toInsert.map(b => ({
        templeId:  temple.id,
        blockType: b.blockType,
        label:     b.label,
        order:     b.order,
        isVisible: b.isVisible,
        config:    b.config,
      })),
    })

    totalInserted += toInsert.length
    console.log(`➕ ${temple.code} (${temple.name}): ${toInsert.length}개 삽입 [${toInsert.map(b => b.blockType).join(', ')}]`)
  }

  console.log('─'.repeat(60))
  console.log(`\n완료. 총 삽입: ${totalInserted}개 블록 / ${temples.length}개 사찰`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
