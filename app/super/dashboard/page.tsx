import { redirect } from 'next/navigation'
import { getSuperSession } from '@/lib/superAuth'
import { db } from '@/lib/db'
import TempleGrid from './TempleGrid'

export const dynamic = 'force-dynamic'

const TIER_LABEL: Record<number, string> = { 1: '기본', 2: '표준', 3: '프리미엄' }
const TIER_COLOR: Record<number, string> = {
  1: '#6B7280',
  2: '#3B82F6',
  3: '#D4AF37',
}

export default async function SuperDashboard() {
  const ok = await getSuperSession()
  if (!ok) redirect('/super/login')

  const temples = await db.temple.findMany({
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { blockConfigs: true } } },
  })

  const rows = temples.map(t => ({
    id: t.id,
    code: t.code,
    name: t.name,
    nameEn: t.nameEn ?? '',
    tier: t.tier,
    tierLabel: TIER_LABEL[t.tier] ?? `Tier ${t.tier}`,
    tierColor: TIER_COLOR[t.tier] ?? '#6B7280',
    isActive: t.isActive,
    address: t.address ?? '',
    phone: t.phone ?? '',
    denomination: t.denomination ?? '',
    abbotName: t.abbotName ?? '',
    primaryColor: t.primaryColor,
    blockCount: t._count.blockConfigs,
    createdAt: t.createdAt.toLocaleDateString('ko-KR'),
  }))

  return (
    <div className="min-h-screen" style={{ background: '#1a0f08' }}>
      {/* 헤더 */}
      <div className="px-5 pt-10 pb-6 flex items-center justify-between">
        <div>
          <p className="text-temple-gold text-base">108사찰 플랫폼</p>
          <h1 className="text-2xl font-bold text-white mt-1">통합 관제 시스템</h1>
          <p className="text-gray-400 text-base mt-0.5">등록 사찰 {temples.length}개</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <a
            href="/super/add"
            className="bg-temple-gold text-temple-brown font-bold px-4 py-2.5 rounded-xl text-base active:opacity-80 whitespace-nowrap"
          >
            + 새 사찰 등록
          </a>
          <form action="/api/super/auth" method="DELETE" className="inline">
            <button
              type="submit"
              onClick={async (e) => {
                e.preventDefault()
                await fetch('/api/super/auth', { method: 'DELETE' })
                window.location.href = '/super/login'
              }}
              className="text-gray-400 text-sm underline"
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>

      {/* 사찰 그리드 */}
      <div className="bg-temple-cream rounded-t-3xl px-4 pt-6 pb-20 min-h-[70vh]">
        <p className="text-gray-500 text-base mb-4 text-center">사찰을 선택해 관리하세요</p>
        <TempleGrid temples={rows} />
      </div>
    </div>
  )
}
