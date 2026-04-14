import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 설정됨 (' + process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 20) + '...)' : '❌ 없음',
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? '✅ 설정됨' : '❌ 없음',
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅ ' + process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME : '❌ 없음',
    DATABASE_URL: process.env.DATABASE_URL ? '✅ 설정됨' : '❌ 없음',
    SOLAPI_API_KEY: process.env.SOLAPI_API_KEY ? '✅ 설정됨' : '❌ 없음',
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN ? '✅ 설정됨' : '❌ 없음',
  })
}
