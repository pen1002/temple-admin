import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getSuperSession } from '@/lib/superAuth'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'
import TempleGrid from './TempleGrid'
import LogoutButton from './LogoutButton'
import DashboardControls from './DashboardControls'

export const dynamic = 'force-dynamic'

const TIER_LABEL: Record<number, string> = { 1: '기본', 2: '표준', 3: '프리미엄' }
const TIER_COLOR: Record<number, string> = {
  1: '#6B7280',
  2: '#3B82F6',
  3: '#D4AF37',
}

const LIMIT = 20

interface PageProps {
  searchParams: {
    page?: string
    search?: string
    tier?: string
    denomination?: string
  }
}

export default async function SuperDashboard({ searchParams }: PageProps) {
  const ok = await getSuperSession()
  if (!ok) redirect('/super/login')

  const page   = Math.max(1, parseInt(searchParams.page ?? '1', 10))
  const search = searchParams.search?.trim() ?? ''
  const tierParam = searchParams.tier?.trim() ?? ''
  const denomination = searchParams.denomination?.trim() ?? ''

  const where: Prisma.TempleWhereInput = {
    ...(search && {
      OR: [
        { name:   { contains: search, mode: 'insensitive' } },
        { code:   { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(tierParam && { tier: parseInt(tierParam, 10) }),
    ...(denomination && { denomination: { contains: denomination, mode: 'insensitive' } }),
  }

  const [temples, totalCount] = await Promise.all([
    db.temple.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { blockConfigs: true } } },
      skip:  (page - 1) * LIMIT,
      take:  LIMIT,
    }),
    db.temple.count({ where }),
  ])

  // 종파 목록 (필터 드롭다운용) - 전체 고유값
  const denominations = await db.temple.findMany({
    select: { denomination: true },
    distinct: ['denomination'],
    where: { denomination: { not: null } },
    orderBy: { denomination: 'asc' },
  })

  const rows = temples.map(t => ({
    id:           t.id,
    code:         t.code,
    name:         t.name,
    nameEn:       t.nameEn ?? '',
    tier:         t.tier,
    tierLabel:    TIER_LABEL[t.tier] ?? `Tier ${t.tier}`,
    tierColor:    TIER_COLOR[t.tier] ?? '#6B7280',
    isActive:     t.isActive,
    address:      t.address ?? '',
    phone:        t.phone ?? '',
    denomination: t.denomination ?? '',
    abbotName:    t.abbotName ?? '',
    primaryColor: t.primaryColor,
    blockCount:   t._count.blockConfigs,
    createdAt:    t.createdAt.toLocaleDateString('ko-KR'),
  }))

  const totalPages = Math.ceil(totalCount / LIMIT)
  const denominationList = denominations
    .map(d => d.denomination)
    .filter((d): d is string => !!d)

  return (
    <div className="min-h-screen" style={{ background: '#1a0f08' }}>
      {/* 헤더 */}
      <div className="px-5 pt-10 pb-6 flex items-center justify-between">
        <div>
          <p className="text-temple-gold text-base">1080 사찰 자동화 대작불사</p>
          <h1 className="text-2xl font-bold text-white mt-1">통합 관제 시스템</h1>
          <p className="text-gray-400 text-base mt-0.5">
            전체 {totalCount.toLocaleString()}개
            {search || tierParam || denomination ? ` · 검색 결과 ${totalCount.toLocaleString()}개` : ''}
          </p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <a
            href="/super/add"
            className="bg-temple-gold text-temple-brown font-bold px-4 py-2.5 rounded-xl text-base active:opacity-80 whitespace-nowrap"
          >
            + 새 사찰 등록
          </a>
          <LogoutButton />
        </div>
      </div>

      {/* 검색 + 필터 */}
      <div className="px-4 pb-4">
        <Suspense fallback={null}>
          <DashboardControls
            denominationList={denominationList}
            currentSearch={search}
            currentTier={tierParam}
            currentDenomination={denomination}
          />
        </Suspense>
      </div>

      {/* 사찰 그리드 */}
      <div className="bg-temple-cream rounded-t-3xl px-4 pt-6 pb-28 min-h-[70vh]">
        {rows.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-xl">검색 결과가 없습니다</p>
            <a href="/super/dashboard" className="inline-block mt-4 text-temple-gold underline text-lg">
              전체 목록 보기 →
            </a>
          </div>
        ) : (
          <TempleGrid
            temples={rows}
            pagination={{ page, totalPages, totalCount }}
          />
        )}
      </div>
    </div>
  )
}
