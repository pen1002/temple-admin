import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'temple-admin-secret-change-in-production')

export interface TempleAuthPayload {
  role: 'super' | 'admin'
  temple_slug: string
  temple_id: string
}

export async function issueTempleToken(payload: TempleAuthPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // 2시간 유효
    .sign(SECRET)
}

export async function verifyTempleToken(token: string): Promise<TempleAuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as TempleAuthPayload
  } catch {
    return null
  }
}

/**
 * API에서 temple 격리 검증
 * - 쿠키/헤더의 토큰 검증
 * - 요청한 temple_slug와 토큰의 temple_slug 일치 확인
 * - super는 모든 사찰 접근 허용
 *
 * @returns auth 객체 또는 NextResponse 에러
 */
export async function checkTempleAuth(req: NextRequest, requestedSlug: string): Promise<{ role: 'super' | 'admin'; temple_slug: string; temple_id: string } | NextResponse> {
  const token = req.cookies.get('temple_auth')?.value || req.headers.get('x-temple-auth') || ''
  if (!token) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const payload = await verifyTempleToken(token)
  if (!payload) return NextResponse.json({ error: '토큰 무효/만료' }, { status: 401 })

  // super는 모든 사찰 접근
  if (payload.role === 'super') return payload

  // admin은 자기 사찰만
  if (payload.temple_slug !== requestedSlug) {
    return NextResponse.json({ error: '타 사찰 데이터 접근 불가' }, { status: 403 })
  }
  return payload
}
