import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function GET() {
  const start = Date.now()
  const report = {
    status: '🌕 만월(Healthy)',
    timestamp: new Date().toISOString(),
    latency: '',
    checks: { database: '⌛ 진맥 중', cloudinary: '⌛ 진맥 중' },
  }

  try {
    // 🔍 [DB 진맥]
    const { error: dbError } = await supabase.from('temples').select('id').limit(1)
    report.checks.database = dbError ? '🌑 막힘(Error)' : '🌕 통함(OK)'

    // 🔍 [Cloudinary 진맥] — REST API ping (SDK 불필요)
    let cloudinaryOk = false
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    if (cloudName) {
      try {
        const res = await fetch(`https://res.cloudinary.com/${cloudName}/image/upload/w_1/sample.jpg`, { method: 'HEAD' })
        cloudinaryOk = res.ok
      } catch {}
    }
    report.checks.cloudinary = cloudinaryOk ? '🌕 통함(OK)' : cloudName ? '🌑 막힘(Error)' : '⚪ 미설정(Skip)'

    const isHealthy = !dbError && (cloudinaryOk || !cloudName)
    report.status = isHealthy ? '🌕 만월(Healthy)' : '🌘 하현(Unhealthy)'
    report.latency = `${Date.now() - start}ms`

    return NextResponse.json(report, { status: isHealthy ? 200 : 500 })
  } catch (error) {
    console.error('[health] Critical error:', error)
    return NextResponse.json({ status: '🌑 개기월식(Critical)', error: String(error) }, { status: 500 })
  }
}
