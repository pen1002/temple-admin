import { NextResponse } from 'next/server'

export async function GET() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? ''
  let pkPreview = ''
  try {
    const parsed = JSON.parse(raw)
    const pk = parsed.private_key ?? ''
    pkPreview = pk.slice(0, 40) + '...' + pk.slice(-20)
    const hasRealNewlines = pk.includes('\n')
    const hasLiteralBackslashN = pk.includes('\\n')
    return NextResponse.json({
      has: true,
      len: raw.length,
      pkLen: pk.length,
      pkPreview,
      hasRealNewlines,
      hasLiteralBackslashN,
      startsCorrectly: pk.startsWith('-----BEGIN'),
    })
  } catch (e: unknown) {
    return NextResponse.json({
      has: !!raw,
      len: raw.length,
      parseError: e instanceof Error ? e.message : 'unknown',
      first50: raw.slice(0, 50),
    })
  }
}
