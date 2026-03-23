import { NextRequest, NextResponse } from 'next/server'
import { getSuperSession } from '@/lib/superAuth'
import { db } from '@/lib/db'

// ── 사찰 목록 조회 ──────────────────────────────────────────────────────────
export async function GET() {
  if (!await getSuperSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const temples = await db.temple.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      _count: { select: { blockConfigs: true } },
    },
  })

  return NextResponse.json(temples)
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
        ...(t.isActive !== undefined && { isActive: Boolean(t.isActive) }),
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
        isActive: t.isActive ?? true,
      },
    })

    // 블록 재생성
    if (Array.isArray(blocks) && blocks.length > 0) {
      await db.blockConfig.deleteMany({ where: { templeId: temple.id } })
      await db.blockConfig.createMany({
        data: blocks.map((b: { blockType: string; label?: string; order: number; isVisible?: boolean; config?: object }) => ({
          templeId: temple.id,
          blockType: b.blockType,
          label: b.label,
          order: b.order,
          isVisible: b.isVisible ?? true,
          config: (b.config ?? {}) as object,
        })),
      })
    }

    const blockCount = blocks?.length ?? 0
    return NextResponse.json({ ok: true, id: temple.id, code: temple.code, name: temple.name, blockCount })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
