import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// API Route 에러 테스트 — Sentry API 계층 포착 확인용
// 프로덕션에서는 차단 (Preview/Development에서만 접근 허용)
export async function GET() {
  if (process.env.VERCEL_ENV === 'production') {
    return NextResponse.json({ error: 'debug endpoints disabled in production' }, { status: 404 })
  }
  throw new Error('[Sentry Test] API Route error at ' + new Date().toISOString())
}
