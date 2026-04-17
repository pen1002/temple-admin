import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type AuthResult = { templeSlug: string; templeName: string } | NextResponse

const ALLOWED_ORIGINS = [
  '.k-buddhism.kr',
  'temple-admin',          // Vercel preview
  'localhost',
]

// 간단한 in-memory rate limiter (서버리스 인스턴스 단위)
const hits = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(key: string, max: number): boolean {
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + 60_000 })
    return true
  }
  entry.count++
  if (entry.count > max) return false
  return true
}

export async function requireTempleAuth(
  req: NextRequest,
  options: { allowPublic?: boolean; rateLimit?: number } = {}
): Promise<AuthResult> {
  const { allowPublic = false, rateLimit = 30 } = options

  // 1. templeSlug 추출 (query 또는 body clone)
  let templeSlug = req.nextUrl.searchParams.get('temple_slug') || ''
  if (!templeSlug && req.method === 'POST') {
    try {
      const cloned = req.clone()
      const body = await cloned.json()
      templeSlug = body.temple_slug || ''
    } catch { /* body parse 실패 시 빈 값 */ }
  }

  if (!templeSlug) {
    return NextResponse.json({ error: 'temple_slug 필수' }, { status: 400 })
  }

  // 2. 사찰 존재 검증
  const temple = await prisma.temple.findUnique({
    where: { code: templeSlug },
    select: { name: true, isActive: true },
  })
  if (!temple) {
    return NextResponse.json({ error: '존재하지 않는 사찰' }, { status: 404 })
  }
  if (!temple.isActive) {
    return NextResponse.json({ error: '비활성 사찰' }, { status: 403 })
  }

  // 3. Origin 체크 (공개 플로우에서도 악의적 외부 호출 차단)
  if (allowPublic) {
    const origin = req.headers.get('origin') || req.headers.get('referer') || ''
    const isAllowed = !origin || ALLOWED_ORIGINS.some(d => origin.includes(d))
    if (!isAllowed) {
      return NextResponse.json({ error: 'origin not allowed' }, { status: 403 })
    }
  }

  // 4. Rate limit (IP 기반)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const rateLimitKey = `${ip}:${templeSlug}`
  if (!checkRateLimit(rateLimitKey, rateLimit)) {
    return NextResponse.json({ error: '요청 한도 초과. 잠시 후 다시 시도해주세요.' }, { status: 429 })
  }

  return { templeSlug, templeName: temple.name }
}
