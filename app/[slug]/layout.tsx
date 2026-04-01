// 퍼블릭 사찰 사이트 레이아웃 — 관리자 UI와 완전 분리
export default function TemplePublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#0d0a06', minHeight: '100vh' }}>
      {children}
    </div>
  )
}
