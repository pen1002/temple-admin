import * as Sentry from '@sentry/nextjs'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    throw new Error('1080사찰 Sentry 테스트 에러 — 이 메시지가 보이면 정상 작동 중입니다')
  } catch (e) {
    Sentry.captureException(e)
    return NextResponse.json({ ok: true, message: 'Sentry 테스트 에러가 전송되었습니다. 이메일을 확인하세요.' })
  }
}
