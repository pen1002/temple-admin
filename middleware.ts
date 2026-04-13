import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'temple-admin-secret-change-in-production'
)

// Vercel 기본 도메인 (경로 기반 → 서브도메인 리다이렉트 제외)
const VERCEL_DOMAINS = ['temple-admin-zeta.vercel.app', 'localhost']

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // ── 서브도메인 라우팅: {slug}.k-buddhism.kr ────────────────────────────────
  if (hostname.endsWith('.k-buddhism.kr')) {
    const slug = hostname.split('.')[0]

    // www/admin 제외
    if (slug === 'www' || slug === 'admin') {
      return NextResponse.next()
    }

    // 서브도메인 → /{slug}{pathname} 으로 rewrite
    // 이미 pathname이 /slug로 시작하면 이중 추가 방지
    const url = request.nextUrl.clone()
    if (pathname.startsWith(`/${slug}`)) {
      // 이미 slug 포함: miraesa.k-buddhism.kr/miraesa/dharma-wheel → /miraesa/dharma-wheel 그대로
      url.pathname = pathname
    } else {
      // slug 미포함: miraesa.k-buddhism.kr/cyber → /miraesa/cyber
      url.pathname = `/${slug}${pathname}`
    }
    return NextResponse.rewrite(url)
  }

  // ── 독립 도메인 지원 (customDomain): 예) haeinsa.org → /haeinsa ──────────
  // Vercel/localhost가 아니고 k-buddhism.kr도 아닌 경우
  if (!hostname.endsWith('.k-buddhism.kr') && !VERCEL_DOMAINS.some(d => hostname.includes(d))) {
    // 독립 도메인 → DB에서 customDomain 매칭 (Vercel DNS 연결 필요)
    // 현재는 hostname 전체를 slug로 사용하지 않고, 그대로 통과
    // TODO: customDomain → slug 매핑 API 또는 edge config 활용
    return NextResponse.next()
  }

  // ── 경로 기반 접근 시 서브도메인으로 리다이렉트 (k-buddhism.kr 도메인만) ────
  // 예: k-buddhism.kr/miraesa → miraesa.k-buddhism.kr
  // Vercel 도메인에서는 리다이렉트 하지 않음 (개발/미리보기용)
  if (hostname === 'k-buddhism.kr' || hostname === 'www.k-buddhism.kr') {
    const pathSlug = pathname.split('/')[1]
    if (pathSlug && !['_next', 'api', 'favicon.ico', 'super', 'login', 'admin', 'cyber', 'block-preview'].includes(pathSlug)) {
      const restPath = pathname.replace(`/${pathSlug}`, '') || '/'
      return NextResponse.redirect(new URL(`https://${pathSlug}.k-buddhism.kr${restPath}`))
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
  // _next, api, favicon 제외 → 서브도메인 요청 포함
  matcher: ['/((?!_next|api|favicon\\.ico).*)'],
}
