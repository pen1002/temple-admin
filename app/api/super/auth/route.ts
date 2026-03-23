import { NextRequest, NextResponse } from 'next/server'
import { createSuperSession, SUPER_COOKIE } from '@/lib/superAuth'

export async function POST(req: NextRequest) {
  const { pin } = await req.json()
  const correct = process.env.SUPER_PIN
  if (!correct) {
    return NextResponse.json({ error: 'SUPER_PIN 환경변수가 설정되지 않았습니다.' }, { status: 500 })
  }
  if (pin !== correct) {
    return NextResponse.json({ error: '비밀번호가 틀렸습니다.' }, { status: 401 })
  }
  const token = await createSuperSession()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SUPER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
    path: '/',
    sameSite: 'lax',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(SUPER_COOKIE)
  return res
}
