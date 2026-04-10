import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    has_GOOGLE_SERVICE_ACCOUNT_JSON: !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON,
    len_GOOGLE_SERVICE_ACCOUNT_JSON: process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.length ?? 0,
    starts_with: process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.slice(0, 10) ?? 'EMPTY',
    env_keys_with_google: Object.keys(process.env).filter(k => k.toLowerCase().includes('google')),
  })
}
