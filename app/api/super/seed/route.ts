/**
 * 임시 시드 엔드포인트 — 1080 사찰 자동화 대작불사
 * POST /api/super/seed  → 더미 사찰 생성 (createMany 단일 쿼리)
 * DELETE /api/super/seed → 더미 사찰 삭제 (code: t-XXXX)
 *
 * ⚠️ 운영 배포 전 이 파일 삭제 필요
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSuperSession } from '@/lib/superAuth'
import { db } from '@/lib/db'

const PREFIXES = ['봉','화','법','영','선','불','통','해','금','용','만','극','관','백','청','흥','대','정','광','원','석','천','조','진','묘','안','동','장','명','신']
const SUFFIXES = ['은사','인사','국사','덕사','광사','원사','천사','수사','림사','정사']
const REGIONS  = ['서울','부산','대구','인천','광주','대전','울산','세종','경기','강원','충북','충남','전북','전남','경북','경남','제주','수원','성남','고양','용인','창원','청주','전주','천안','안산','안양','남양주','화성','평택','의정부','시흥','파주']
const DENOMS   = ['대한불교 조계종','한국불교 태고종','대한불교 천태종','대한불교 진각종','한국불교 법화종','대한불교 화엄종']
const ABBOTS   = ['혜원','법광','정각','지혜','무상','원각','법인','각성','지광','성혜','법성','진여','원명','각련','법운','도선']
const COLORS   = ['#8B2500','#1a3a5c','#1a4d2e','#4a1a6b','#5c3317','#2c4a1a','#6b1a1a','#1a4a4a','#4a3a1a','#1a2a6b','#6b4a1a','#2a1a6b']

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }

function makeTemple(i: number) {
  const code   = `t-${String(i).padStart(4, '0')}`
  const region = pick(REGIONS)
  const name   = `${region} ${pick(PREFIXES)}${pick(SUFFIXES)}`
  return {
    code,
    name,
    nameEn:        `${name} Temple`,
    description:   `${region} 소재 ${pick(DENOMS)} 소속 사찰`,
    address:       `${region} 산내로 ${Math.floor(Math.random() * 500 + 1)}`,
    phone:         `0${Math.floor(Math.random() * 9 + 1)}0-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    denomination:  pick(DENOMS),
    abbotName:     `${pick(ABBOTS)} 스님`,
    foundedYear:   400 + Math.floor(Math.random() * 1500),
    tier:          (i % 3) + 1,
    primaryColor:  pick(COLORS),
    secondaryColor: '#C5A572',
    isActive:      Math.random() > 0.05,
  }
}

// ── POST: createMany 단일 쿼리로 시드 생성 ───────────────────────────────────
export async function POST(req: NextRequest) {
  if (!await getSuperSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({})) as { count?: number; clean?: boolean }
  const total = Math.min(body.count ?? 1080, 1080)

  const start = Date.now()

  // 기존 더미 데이터 삭제 (code: t-XXXX)
  const deleted = await db.temple.deleteMany({ where: { code: { startsWith: 't-' } } })

  // 1080개 레코드 메모리에서 생성
  const temples = Array.from({ length: total }, (_, i) => makeTemple(i + 1))

  // 단일 createMany 쿼리 — 커넥션 1개만 사용
  const result = await db.temple.createMany({
    data:           temples,
    skipDuplicates: true,
  })

  // blockConfigs: 생성된 사찰 ID 조회 후 createMany
  const created = await db.temple.findMany({
    where:  { code: { startsWith: 't-' } },
    select: { id: true },
  })

  const blockData = created.flatMap(t => [
    { templeId: t.id, blockType: 'H-05', label: '메인 히어로', order: 0, isVisible: true, config: {} },
    { templeId: t.id, blockType: 'D-01', label: '오늘의 법문', order: 1, isVisible: true, config: {} },
    { templeId: t.id, blockType: 'I-01', label: '공지/행사',   order: 2, isVisible: true, config: {} },
    { templeId: t.id, blockType: 'V-01', label: '오시는 길',   order: 3, isVisible: true, config: {} },
  ])

  // blockConfigs도 단일 createMany
  await db.blockConfig.createMany({ data: blockData, skipDuplicates: true })

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  const total_db = await db.temple.count()
  const stats = await db.temple.groupBy({ by: ['tier'], _count: { id: true }, orderBy: { tier: 'asc' } })

  return NextResponse.json({
    ok:       true,
    deleted:  deleted.count,
    created:  result.count,
    blocks:   blockData.length,
    elapsed:  `${elapsed}s`,
    total_db,
    tier_stats: stats.map(s => ({ tier: s.tier, count: s._count.id })),
  })
}

// ── DELETE: 더미 사찰 전체 삭제 ─────────────────────────────────────────────
export async function DELETE() {
  if (!await getSuperSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const deleted = await db.temple.deleteMany({ where: { code: { startsWith: 't-' } } })
  return NextResponse.json({ ok: true, deleted: deleted.count })
}
