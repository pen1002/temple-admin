import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Sentry 클라이언트 모니터링 활성 중. 브라우저 에러 발생 시 자동 전송됩니다.',
  })
}
