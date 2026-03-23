import { NextRequest, NextResponse } from 'next/server'
import { getSuperSession } from '@/lib/superAuth'

const PROJECT_ID = process.env.TEMPLE_ADMIN_PROJECT_ID ?? 'prj_gd7hAE5VhKvmjrj3CwWFUHjJVoYo'
const TEAM_ID    = process.env.VERCEL_TEAM_ID ?? 'team_ans7ObJvQ8lTHHdtdg0qr9nc'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  if (!await getSuperSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { code } = await params
  const { pin } = await req.json()

  if (!pin || pin.length < 4) {
    return NextResponse.json({ error: 'PIN은 4자리 이상이어야 합니다.' }, { status: 400 })
  }

  const token = process.env.VERCEL_TOKEN
  if (!token) {
    return NextResponse.json({
      error: 'VERCEL_TOKEN 미설정. Vercel 대시보드에서 수동으로 변경하세요.',
      envKey: `${code.toUpperCase()}_PIN`,
    }, { status: 422 })
  }

  const envKey = `${code.toUpperCase()}_PIN`

  // 기존 env var ID 조회 후 삭제 → 재생성
  const listRes = await fetch(
    `https://api.vercel.com/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const listJson = await listRes.json() as { envs: Array<{ id: string; key: string }> }
  const existing = listJson.envs?.find((e) => e.key === envKey)

  if (existing?.id) {
    await fetch(
      `https://api.vercel.com/v10/projects/${PROJECT_ID}/env/${existing.id}?teamId=${TEAM_ID}`,
      { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
    )
  }

  const createRes = await fetch(
    `https://api.vercel.com/v10/projects/${PROJECT_ID}/env?teamId=${TEAM_ID}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: envKey, value: pin, type: 'encrypted',
        target: ['production', 'preview', 'development'],
      }),
    }
  )
  const result = await createRes.json() as { id?: string; created?: { id: string }; error?: string }
  const newId = result.id || result.created?.id

  if (newId) {
    return NextResponse.json({ ok: true, envKey, message: 'PIN이 변경되었습니다. 관리앱 재배포 후 적용됩니다.' })
  }
  return NextResponse.json({ error: 'PIN 변경 실패', detail: result }, { status: 500 })
}
