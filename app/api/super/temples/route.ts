/**
 * 1080사찰 대작불사 — 필수 블록 자동 삽입 원칙
 * 대표님 지시 2026.04.08 확정
 *
 * 사찰 등록 시 MANDATORY_BLOCKS는 반드시 DB에 자동 삽입되어야 한다.
 * 블록보물함 UI 표시만으로는 실제 홈피에 적용되지 않는다.
 * 새로운 필수 블록 추가 시 이 파일의 MANDATORY_BLOCKS 배열에 추가할 것.
 *
 * 코드 매핑 (어드민 UI 표기 → 실제 BlockRenderer 코드):
 *   GNB-01  = GNB 네비게이션
 *   I-01    → T-01  (공지 티커 배너)
 *   B-01    → WISDOM-01 (오늘의 짬짜미 부처님말씀)
 *   AB-01   → SEC06-01 (주지스님 인사말)
 *   NS-01   = 공지스와이프형
 *   TL-01   → SEC05-01 (우리절 연혁)
 *   G-01    = 우리절 갤러리
 *   DO-01   → V-01  (오시는 길)
 *   F-01    → FooterBlock (page.tsx 고정 렌더링 — DB 불필요)
 */
import { NextRequest, NextResponse } from 'next/server'
import { getSuperSession } from '@/lib/superAuth'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

// ── 필수 블록 10대 목록 (13대 절대배열 순서) ───────────────────────────────
const MANDATORY_BLOCKS = [
  { blockType: 'GNB-01',    order: 0,  isVisible: true, label: 'GNB 네비게이션',            config: {} },
  { blockType: 'T-01',      order: 1,  isVisible: true, label: '공지 티커 배너',             config: {} },
  { blockType: 'WISDOM-01', order: 2,  isVisible: true, label: '오늘의 짬짜미 부처님말씀',   config: {} },
  { blockType: 'SEC06-01',  order: 3,  isVisible: true, label: '주지스님 인사말',            config: {} },
  { blockType: 'E-01',      order: 4,  isVisible: true, label: '기도법회행사',               config: {} },
  { blockType: 'NS-01',     order: 5,  isVisible: true, label: '공지사항 스와이프',          config: {} },
  { blockType: 'SEC05-01',  order: 7,  isVisible: true, label: '우리절 연혁',               config: {} },
  { blockType: 'G-01',      order: 8,  isVisible: true, label: '우리절 갤러리',             config: {} },
  { blockType: 'V-01',      order: 9,  isVisible: true, label: '오시는 길',                 config: {} },
] as const

// ── 사찰 목록 조회 (페이지네이션 + 검색 + 필터) ────────────────────────────
export async function GET(req: NextRequest) {
  if (!await getSuperSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page  = Math.max(1, parseInt(searchParams.get('page')  ?? '1',  10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
  const search      = searchParams.get('search')?.trim()      ?? ''
  const tierParam   = searchParams.get('tier')?.trim()        ?? ''
  const denomination = searchParams.get('denomination')?.trim() ?? ''

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
      skip:  (page - 1) * limit,
      take:  limit,
    }),
    db.temple.count({ where }),
  ])

  return NextResponse.json({
    temples,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  })
}

// ── 사찰 등록 (upsert) ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!await getSuperSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { temple: t, blocks } = body

  if (!t?.code || !t?.name || !t?.tier) {
    return NextResponse.json({ error: '필수 필드 누락: code, name, tier' }, { status: 400 })
  }

  try {
    const temple = await db.temple.upsert({
      where: { code: t.code },
      update: {
        name: t.name,
        tier: Number(t.tier),
        ...(t.nameEn !== undefined && { nameEn: t.nameEn }),
        ...(t.description !== undefined && { description: t.description }),
        ...(t.address !== undefined && { address: t.address }),
        ...(t.phone !== undefined && { phone: t.phone }),
        ...(t.email !== undefined && { email: t.email }),
        ...(t.denomination !== undefined && { denomination: t.denomination }),
        ...(t.abbotName !== undefined && { abbotName: t.abbotName }),
        ...(t.foundedYear !== undefined && { foundedYear: Number(t.foundedYear) }),
        ...(t.primaryColor !== undefined && { primaryColor: t.primaryColor }),
        ...(t.secondaryColor !== undefined && { secondaryColor: t.secondaryColor }),
        ...(t.themeColor !== undefined && { themeColor: t.themeColor }),
        ...(t.isActive !== undefined && { isActive: Boolean(t.isActive) }),
        ...(t.temple_type !== undefined && { temple_type: t.temple_type }),
        ...(t.pageTemplate !== undefined && { pageTemplate: t.pageTemplate }),
        ...(t.kakao_notify_tel !== undefined && { kakao_notify_tel: t.kakao_notify_tel }),
        ...(t.bank_name !== undefined && { bank_name: t.bank_name }),
        ...(t.bank_account !== undefined && { bank_account: t.bank_account }),
        ...(t.bank_holder !== undefined && { bank_holder: t.bank_holder }),
      },
      create: {
        code: t.code,
        name: t.name,
        tier: Number(t.tier),
        nameEn: t.nameEn,
        description: t.description,
        address: t.address,
        phone: t.phone,
        email: t.email,
        denomination: t.denomination ?? '대한불교 조계종',
        abbotName: t.abbotName,
        foundedYear: t.foundedYear ? Number(t.foundedYear) : undefined,
        primaryColor: t.primaryColor ?? '#8B2500',
        secondaryColor: t.secondaryColor ?? '#C5A572',
        themeColor: t.themeColor ?? 'golden-lotus',
        isActive: t.isActive ?? true,
        temple_type: t.temple_type ?? 'offline',
        pageTemplate: t.pageTemplate ?? 'standard',
        kakao_notify_tel: t.kakao_notify_tel,
        bank_name: t.bank_name,
        bank_account: t.bank_account,
        bank_holder: t.bank_holder,
      },
    })

    // 블록 재생성 — 사용자 선택 + 필수 블록 자동 병합
    if (Array.isArray(blocks) && blocks.length > 0) {
      const userTypes = new Set(
        (blocks as { blockType: string }[]).map(b => b.blockType)
      )
      // 사용자가 선택하지 않은 필수 블록만 보충
      const missingMandatory = MANDATORY_BLOCKS.filter(b => !userTypes.has(b.blockType))
      const allBlocks = [
        ...(blocks as { blockType: string; label?: string; order: number; isVisible?: boolean; config?: object }[]),
        ...missingMandatory,
      ]
      await db.blockConfig.deleteMany({ where: { templeId: temple.id } })
      await db.blockConfig.createMany({
        data: allBlocks.map(b => ({
          templeId:  temple.id,
          blockType: b.blockType,
          label:     b.label,
          order:     b.order,
          isVisible: b.isVisible ?? true,
          config:    (b.config ?? {}) as object,
        })),
      })
    } else {
      // blocks 없이 사찰만 등록한 경우 → 필수 블록 전체 삽입 (없는 것만)
      const existing = await db.blockConfig.findMany({
        where: { templeId: temple.id },
        select: { blockType: true },
      })
      const existingTypes = new Set(existing.map(b => b.blockType))
      const toInsert = MANDATORY_BLOCKS.filter(b => !existingTypes.has(b.blockType))
      if (toInsert.length > 0) {
        await db.blockConfig.createMany({
          data: toInsert.map(b => ({ ...b, templeId: temple.id, config: b.config as object })),
        })
      }
    }

    const blockCount = blocks?.length ?? 0
    return NextResponse.json({ ok: true, id: temple.id, code: temple.code, name: temple.name, blockCount })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
