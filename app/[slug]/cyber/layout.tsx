import { notFound } from 'next/navigation'
import { prisma as db } from '@/lib/prisma'

export default async function CyberLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const temple = await db.temple.findUnique({ where: { code: slug, isActive: true }, select: { name: true, code: true } })
  if (!temple) notFound()

  return (
    <div style={{ minHeight: '100vh', background: '#06050f', color: '#f0dfa0', fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      {/* 상단 네비 */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(6,5,15,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(201,168,76,0.12)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <a href={`/${slug}`} style={{ color: 'rgba(201,168,76,0.6)', fontSize: 12, textDecoration: 'none', whiteSpace: 'nowrap' }}>← {temple.name}</a>
        <span style={{ color: 'rgba(201,168,76,0.3)', fontSize: 10 }}>|</span>
        <a href={`/${slug}/cyber`} style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600, textDecoration: 'none', letterSpacing: 1 }}>온라인법당</a>
      </nav>
      {children}
    </div>
  )
}
