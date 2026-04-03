import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'temple-admin-secret-change-in-production'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''

  // ── 서브도메인 라우팅: {slug}.k-buddhism.kr → /{slug} ──────────────────────
  // borimsa.k-buddhism.kr/ → 내부적으로 /borimsa 로 rewrite
  const subdomainMatch = host.match(/^([^.]+)\.k-buddhism\.kr$/)
  if (subdomainMatch) {
    const subdomain = subdomainMatch[1]
    // www나 API 경로는 제외
    if (subdomain !== 'www' && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
      const url = request.nextUrl.clone()
      // /  →  /borimsa   |   /about → /borimsa/about
      url.pathname = `/${subdomain}${pathname === '/' ? '' : pathname}`
      return NextResponse.rewrite(url)
    }
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
  // _next/static, _next/image, favicon 제외한 모든 경로에 미들웨어 적용
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}
