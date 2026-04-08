import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import * as kv from './lib/kv'

const db = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } })

async function main() {
  const temple = await db.temple.findUnique({ where: { code: 'borimsa' }, select: { id: true } })
  if (!temple) throw new Error('NOT FOUND')
  const tid = temple.id

  // ── 1-1: H-01 → H-06 ─────────────────────────────
  const r1 = await db.blockConfig.updateMany({
    where: { templeId: tid, blockType: 'H-01' },
    data:  { blockType: 'H-06' },
  })
  console.log(`H-01→H-06: ${r1.count}건`)

  // ── 1-2: 블록 순서 재설정 ────────────────────────
  const orderMap: Record<string, number> = {
    'H-06': 1, 'T-01': 2, 'I-01': 3, 'SEC06-01': 4,
    'SEC03-01': 5, 'SEC11-01': 6, 'SEC05-01': 7, 'SEC05-04': 8,
    'SEC07-01': 9, 'SEC13-01': 10, 'QA-01': 11, 'SEC08-01': 12, 'V-01': 13,
  }
  for (const [blockType, order] of Object.entries(orderMap)) {
    const r = await db.blockConfig.updateMany({ where: { templeId: tid, blockType }, data: { order } })
    if (r.count > 0) console.log(`  ${blockType} → order ${order}`)
  }

  // ── 1-3: T-01 staticItems 국가지정문화재 ──────────
  const tickerItems = [
    '☸ 국보 제44호 — 장흥 보림사 남북 삼층석탑 및 석등',
    '국보 제117호 — 철조비로자나불좌상',
    '보물 제155호 — 동 승탑',
    '보물 제156호 — 서 승탑',
    '보물 제157호 — 보조선사탑',
    '보물 제158호 — 보조선사탑비',
    '보물 제745-9호 — 월인석보',
    '보물 제772-3호 — 금강경삼가해',
    '보물 제1252호 — 자비도량참법',
    '보물 제1254호 — 목조사천왕상 ☸',
  ]
  const t01 = await db.blockConfig.findFirst({ where: { templeId: tid, blockType: 'T-01' } })
  if (t01) {
    await db.blockConfig.update({
      where: { id: t01.id },
      data:  { config: { ...(t01.config as object ?? {}), staticItems: tickerItems } },
    })
    console.log('T-01 staticItems 업데이트 완료')
  }

  // ── 1-4: I-01 공지사항 블록 확인/생성 ─────────────
  const i01 = await db.blockConfig.findFirst({ where: { templeId: tid, blockType: 'I-01' } })
  if (!i01) {
    await db.blockConfig.create({
      data: { templeId: tid, blockType: 'I-01', order: 3, isVisible: true, config: {} }
    })
    console.log('I-01 신규 생성: order=3')
  } else {
    console.log(`I-01 이미 존재: order=${i01.order}`)
  }

  // ── 작업 3: 갤러리 4장 교체 ───────────────────────
  const now = new Date().toISOString()
  await kv.setRaw('borimsa:gallery_recent', [
    { url: 'https://res.cloudinary.com/db3izttcy/image/upload/brs-nt44_vmceyo',           caption: '남북 삼층석탑 및 석등',   location: 'borimsa', uploadedAt: now },
    { url: 'https://res.cloudinary.com/db3izttcy/image/upload/Borimsa_Iron_buddha_xf1xdm',caption: '철조비로자나불좌상',       location: 'borimsa', uploadedAt: now },
    { url: 'https://res.cloudinary.com/db3izttcy/image/upload/brs-t1254_xwgej6',          caption: '목조사천왕상',             location: 'borimsa', uploadedAt: now },
    { url: 'https://res.cloudinary.com/db3izttcy/image/upload/brs-dharmahall_jggvn9',     caption: '대웅전',                   location: 'borimsa', uploadedAt: now },
  ])
  const gallery = await kv.getGallery('borimsa')
  console.log(`갤러리 ${gallery.length}장:`, gallery.map(g => g.caption).join(' | '))

  // ── 최종 순서 확인 ────────────────────────────────
  const blocks = await db.blockConfig.findMany({
    where: { templeId: tid },
    select: { blockType: true, order: true, isVisible: true },
    orderBy: { order: 'asc' },
  })
  console.log('\n최종 블록 순서:')
  blocks.forEach(b => console.log(`  ${b.order}. ${b.blockType} (visible: ${b.isVisible})`))
}
main().catch(console.error).finally(() => db.$disconnect())
