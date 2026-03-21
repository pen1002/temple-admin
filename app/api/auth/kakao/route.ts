import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.redirect(new URL('/login?error=invalid_slug', request.url))
  }

  const cookieStore = await cookies()
  cookieStore.set('pending_slug', slug, { httpOnly: true, maxAge: 300, path: '/' })

  const kakaoAuthUrl = new URL('https://kauth.kakao.com/oauth/authorize')
  kakaoAuthUrl.searchParams.set('client_id', process.env.KAKAO_REST_API_KEY || '')
  kakaoAuthUrl.searchParams.set('redirect_uri', process.env.KAKAO_REDIRECT_URI || '')
  kakaoAuthUrl.searchParams.set('response_type', 'code')
  kakaoAuthUrl.searchParams.set('scope', 'phone_number')

  return NextResponse.redirect(kakaoAuthUrl.toString())
}
