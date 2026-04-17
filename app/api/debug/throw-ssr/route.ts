import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// SSR 에러 테스트 — Sentry 서버 계층 포착 확인용
// 프로덕션에서는 차단 (Preview/Development에서만 접근 허용)
export async function GET() {
  if (process.env.VERCEL_ENV === 'production') {
    return NextResponse.json({ error: 'debug endpoints disabled in production' }, { status: 404 })
  }
  throw new Error('[Sentry Test] SSR error at ' + new Date().toISOString())
}
