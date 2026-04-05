// 퍼블릭 사찰 사이트 레이아웃 — DB themeType → data-theme 바인딩
import { db } from '@/lib/db'
import './styles/borimsa-type.css'

export default async function TemplePublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const temple = await db.temple.findUnique({
    where: { code: slug },
    select: { themeType: true },
  })

  // themeType이 없거나 DB 조회 실패 시 standard 폴백
  const theme = temple?.themeType ?? 'standard'

  return (
    <div data-theme={theme} style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {children}
    </div>
  )
}
