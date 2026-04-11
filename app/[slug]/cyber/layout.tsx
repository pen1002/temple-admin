import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

export default async function CyberLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const temple = await db.temple.findUnique({ where: { code: slug, isActive: true }, select: { name: true, code: true } })
  if (!temple) notFound()

  return (
    <div style={{ minHeight: '100vh', background: '#06050f', color: '#f0dfa0', fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }}>
      {/* 상단 네비 */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(6,5,15,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(201,168,76,0.12)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <a href={`/${slug}`} style={{ color: 'rgba(201,168,76,0.6)', fontSize: 13, textDecoration: 'none' }}>← {temple.name}</a>
        <span style={{ color: 'rgba(201,168,76,0.3)', fontSize: 11 }}>|</span>
        <a href={`/${slug}/cyber`} style={{ color: '#c9a84c', fontSize: 14, fontWeight: 600, textDecoration: 'none', letterSpacing: 1 }}>사이버법당</a>
      </nav>
      {children}
    </div>
  )
}
