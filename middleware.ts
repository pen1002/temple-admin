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
    // 보림사: 완성본 HTML(929줄)을 k-buddhism.vercel.app에서 프록시
    // — DB 템플릿 4섹션이 아닌 완성된 전체 페이지 서빙
    if (slug === 'borimsa' && pathname === '/') {
      const upstream = await fetch('https://k-buddhism.vercel.app/borimsa', {
        headers: { 'User-Agent': 'temple-admin-proxy/1.0' },
      })
      const html = await upstream.text()
      return new NextResponse(html, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    }
    // 그 외 사찰: DB 템플릿 라우팅
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
