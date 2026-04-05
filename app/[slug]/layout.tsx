// 퍼블릭 사찰 사이트 레이아웃 — 테마 CSS 로드
import '../../styles/themes/borimsa-type.css'

export default function TemplePublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
