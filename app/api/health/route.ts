import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

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
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) {
      report.checks.database = '⚪ 미설정(Skip)'
    } else {
      const supabase = createClient(url, key)
      const { error: dbError } = await supabase.from('Temple').select('id').limit(1)
      report.checks.database = dbError ? `🌑 막힘(${dbError.message})` : '🌕 통함(OK)'
    }

    // 🔍 [Cloudinary 진맥]
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    if (!cloudName) {
      report.checks.cloudinary = '⚪ 미설정(Skip)'
    } else {
      try {
        const ctrl = new AbortController()
        const timer = setTimeout(() => ctrl.abort(), 5000)
        const res = await fetch(`https://res.cloudinary.com/${cloudName}/image/upload/w_1/sample.jpg`, { method: 'HEAD', signal: ctrl.signal })
        clearTimeout(timer)
        report.checks.cloudinary = res.ok ? '🌕 통함(OK)' : '🌑 막힘(Error)'
      } catch {
        report.checks.cloudinary = '🌑 막힘(Timeout)'
      }
    }

    const dbOk = report.checks.database.includes('통함') || report.checks.database.includes('미설정')
    const cdnOk = report.checks.cloudinary.includes('통함') || report.checks.cloudinary.includes('미설정')
    const isHealthy = dbOk && cdnOk
    report.status = isHealthy ? '🌕 만월(Healthy)' : '🌘 하현(Unhealthy)'
    report.latency = `${Date.now() - start}ms`

    return NextResponse.json(report, { status: isHealthy ? 200 : 500 })
  } catch (error) {
    console.error('[health] Critical:', error)
    return NextResponse.json({ status: '🌑 개기월식(Critical)', error: String(error) }, { status: 500 })
  }
}
