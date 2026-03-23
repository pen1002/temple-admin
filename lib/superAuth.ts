import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'temple-admin-secret-change-in-production'
)
const COOKIE = 'super_session'

export async function createSuperSession(): Promise<string> {
  return await new SignJWT({ role: 'super_admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(SECRET)
}

export async function getSuperSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE)?.value
  if (!token) return false
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload.role === 'super_admin'
  } catch {
    return false
  }
}

export { COOKIE as SUPER_COOKIE }
