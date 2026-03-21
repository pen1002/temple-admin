import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSession } from '@/lib/auth'
import { getTempleName } from '@/lib/kv'

async function getKakaoToken(code: string): Promise<string> {
  const res = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_REST_API_KEY || '',
      redirect_uri: process.env.KAKAO_REDIRECT_URI || '',
      code,
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error('Failed to get token')
  return data.access_token
}

async function getKakaoEmail(accessToken: string): Promise<string> {
  const res = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  const data = await res.json()
  return (data.kakao_account?.email as string) || ''
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const cookieStore = await cookies()
  const slug = cookieStore.get('pending_slug')?.value

  if (!code || !slug) {
    return NextResponse.redirect(new URL('/login?error=kakao_error', request.url))
  }

  try {
    const accessToken = await getKakaoToken(code)
    const email = await getKakaoEmail(accessToken)

    if (!email) {
      return NextResponse.redirect(new URL('/login?error=no_email', request.url))
    }

    // ADMIN_EMAILS=admin@munsusa.com,master@temple.com
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean)

    const isAdmin = adminEmails.includes(email.toLowerCase())

    if (!isAdmin) {
      const response = NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
      response.cookies.delete('pending_slug')
      return response
    }

    const templeName = await getTempleName(slug)
    const token = await createSession({ slug, email, templeName })

    const response = NextResponse.redirect(new URL(`/admin/${slug}`, request.url))
    response.cookies.set('temple_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    })
    response.cookies.delete('pending_slug')
    return response
  } catch (err) {
    console.error('Kakao callback error:', err)
    return NextResponse.redirect(new URL('/login?error=kakao_error', request.url))
  }
}
