import { NextRequest, NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import { getTempleName } from '@/lib/kv'

export async function POST(request: NextRequest) {
  const { slug, pin } = await request.json()

  if (!slug || !pin) {
    return NextResponse.json({ error: '사찰 코드와 PIN을 입력해주세요.' }, { status: 400 })
  }

  // 환경변수에서 PIN 조회: MUNSUSA_PIN=1234 형식
  const envKey = `${slug.toUpperCase()}_PIN`
  const correctPin = process.env[envKey]

  if (!correctPin) {
    return NextResponse.json({ error: '등록되지 않은 사찰 코드입니다. 실장님께 문의하세요.' }, { status: 401 })
  }

  if (pin !== correctPin) {
    return NextResponse.json({ error: '비밀번호가 틀렸습니다. 실장님께 문의하세요.' }, { status: 401 })
  }

  const templeName = await getTempleName(slug)
  const token = await createSession({ slug, templeName })

  const response = NextResponse.json({ ok: true, slug })
  response.cookies.set('temple_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24시간
    path: '/',
    sameSite: 'lax',
  })
  return response
}
