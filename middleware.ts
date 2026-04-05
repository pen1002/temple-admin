import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'temple-admin-secret-change-in-production'
)

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl
  const slug = hostname.split('.')[0] // 'borimsa', 'www', 'admin', ...

  // ── 서브도메인 라우팅: {slug}.k-buddhism.kr ────────────────────────────────
  if (hostname.endsWith('.k-buddhism.kr') && slug !== 'www' && slug !== 'admin') {
    // 모든 사찰: DB 블록 템플릿 렌더링 (app/[slug]/page.tsx)
    const url = request.nextUrl.clone()
    url.pathname = `/${slug}${request.nextUrl.pathname}`
    return NextResponse.rewrite(url)
  }

  // ── 개별 사찰 관리자 (/admin/*) ─────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('temple_session')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      const slugMatch = pathname.match(/^\/admin\/([^/]+)/)
      if (slugMatch && payload.slug !== slugMatch[1]) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('temple_session')
      return response
    }
  }

  // ── 통합 관제 실장 (/super/*) ────────────────────────────────────────────────
  if (pathname.startsWith('/super') && !pathname.startsWith('/super/login')) {
    const token = request.cookies.get('super_session')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/super/login', request.url))
    }
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      if (payload.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/super/login', request.url))
      }
    } catch {
      const response = NextResponse.redirect(new URL('/super/login', request.url))
      response.cookies.delete('super_session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  // _next 전체, api, favicon 제외 → 서브도메인 요청 포함
  matcher: ['/((?!_next|api|favicon\\.ico).*)'],
}
