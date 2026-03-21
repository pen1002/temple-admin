import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'temple-admin-secret-change-in-production'
)

export interface SessionPayload {
  slug: string
  email: string
  templeName: string
}

export async function createSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('temple_session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function requireSession(slug?: string): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) throw new Error('UNAUTHORIZED')
  if (slug && session.slug !== slug) throw new Error('FORBIDDEN')
  return session
}
