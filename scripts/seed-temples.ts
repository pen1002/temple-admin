/**
 * 1080 사찰 자동화 대작불사 - 더미 데이터 시드 스크립트
 *
 * 사용법:
 *   npx tsx scripts/seed-temples.ts           → 1080개 생성
 *   npx tsx scripts/seed-temples.ts --count=50 → 50개만 생성
 *   npx tsx scripts/seed-temples.ts --clean    → 더미 데이터 전체 삭제 (code: t-XXXX)
 */

import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// .env.local 명시적 로드 (tsx는 자동 로드 안 함)
config({ path: resolve(process.cwd(), '.env.local') })

// 시드 스크립트는 pgbouncer 풀러를 우회해 DIRECT_URL 직접 연결
const db = new PrismaClient({
  datasources: {
    db: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL },
  },
})

// ── 사찰명 생성 재료 ────────────────────────────────────────────────────────
const PREFIXES = [
  '봉', '화', '법', '영', '선', '불', '통', '해', '금', '용',
  '만', '극', '관', '백', '청', '흥', '대', '정', '광', '원',
  '석', '천', '조', '진', '묘', '안', '동', '장', '명', '신',
]
const SUFFIXES = ['은사', '인사', '국사', '덕사', '광사', '원사', '천사', '수사', '림사', '정사']
const REGIONS  = [
  '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
  '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
  '수원', '성남', '고양', '용인', '창원', '청주', '전주', '천안',
  '안산', '안양', '남양주', '화성', '평택', '의정부', '시흥', '파주',
]
const DENOMINATIONS = [
  '대한불교 조계종',
  '한국불교 태고종',
  '대한불교 천태종',
  '대한불교 진각종',
  '한국불교 법화종',
  '대한불교 화엄종',
]
const ABBOTS = [
  '혜원', '법광', '정각', '지혜', '무상', '원각', '법인', '각성',
  '지광', '성혜', '법성', '진여', '원명', '각련', '법운', '도선',
]
const COLORS = [
  '#8B2500', '#1a3a5c', '#1a4d2e', '#4a1a6b', '#5c3317', '#2c4a1a',
  '#6b1a1a', '#1a4a4a', '#4a3a1a', '#1a2a6b', '#6b4a1a', '#2a1a6b',
]
const DEFAULT_BLOCKS = [
  { blockType: 'H-01', label: '메인 히어로',  order: 0 },
  { blockType: 'D-01', label: '오늘의 법문',  order: 1 },
  { blockType: 'I-01', label: '공지/행사',    order: 2 },
  { blockType: 'V-01', label: '오시는 길',    order: 3 },
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateTemple(index: number) {
  const code    = `t-${String(index).padStart(4, '0')}`
  const region  = pick(REGIONS)
  const prefix  = pick(PREFIXES)
  const suffix  = pick(SUFFIXES)
  const name    = `${region} ${prefix}${suffix}`
  const nameEn  = `${prefix}${suffix.replace('사', '')} Temple`
  const tier    = (index % 3) + 1 // 1,2,3 균등 분배
  const denomination = pick(DENOMINATIONS)
  const abbotName    = pick(ABBOTS) + ' 스님'
  const primaryColor = pick(COLORS)
  const foundedYear  = 400 + Math.floor(Math.random() * 1500) // 400~1900년

  return {
    code,
    name,
    nameEn,
    description: `${region} 소재 ${denomination} 소속 사찰입니다.`,
    address:     `${region} 산내로 ${Math.floor(Math.random() * 500 + 1)}`,
    phone:       `0${Math.floor(Math.random() * 9 + 1)}0-${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    denomination,
    abbotName,
    foundedYear,
    tier,
    primaryColor,
    secondaryColor: '#C5A572',
    isActive: Math.random() > 0.05, // 95% 활성
  }
}

async function main() {
  const args = process.argv.slice(2)
  const isClean = args.includes('--clean')
  const countArg = args.find(a => a.startsWith('--count='))
  const count = countArg ? parseInt(countArg.split('=')[1], 10) : 1080

  if (isClean) {
    console.log('🗑  더미 데이터 삭제 중 (code: t-XXXX)...')
    // blockConfigs는 cascade delete
    const deleted = await db.temple.deleteMany({
      where: { code: { startsWith: 't-' } },
    })
    console.log(`✅ ${deleted.count}개 삭제 완료`)
    return
  }

  console.log(`🏯 ${count}개 더미 사찰 생성 시작...`)
  const start = Date.now()

  // 배치 처리 (100개 단위)
  const BATCH = 100
  let created = 0

  for (let i = 1; i <= count; i += BATCH) {
    const batch = []
    for (let j = i; j < Math.min(i + BATCH, count + 1); j++) {
      batch.push(generateTemple(j))
    }

    // upsert로 중복 안전하게
    await db.$transaction(
      batch.map(t =>
        db.temple.upsert({
          where: { code: t.code },
          update: t,
          create: t,
        })
      )
    )

    // blockConfigs 생성
    const temples = await db.temple.findMany({
      where: { code: { in: batch.map(t => t.code) } },
      select: { id: true, code: true },
    })

    for (const temple of temples) {
      await db.blockConfig.deleteMany({ where: { templeId: temple.id } })
      await db.blockConfig.createMany({
        data: DEFAULT_BLOCKS.map(b => ({ ...b, templeId: temple.id, isVisible: true, config: {} })),
      })
    }

    created += batch.length
    process.stdout.write(`\r  진행: ${created}/${count}개 (${Math.round(created / count * 100)}%)`)
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1)
  console.log(`\n✅ ${created}개 생성 완료 (${elapsed}초)`)

  // 통계 출력
  const stats = await db.temple.groupBy({ by: ['tier'], _count: { id: true } })
  console.log('\n📊 티어 분포:')
  stats.sort((a, b) => a.tier - b.tier)
       .forEach(s => console.log(`   Tier ${s.tier}: ${s._count.id}개`))

  const total = await db.temple.count()
  console.log(`\n   DB 총 사찰 수: ${total.toLocaleString()}개`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect())
