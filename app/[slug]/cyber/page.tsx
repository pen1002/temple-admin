import { notFound } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaCyberPage?: PrismaClient }
const db = globalForPrisma.prismaCyberPage ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaCyberPage = db

const HALLS = [
  { id: 'daeungjeon', icon: '🙏', name: '대웅전', desc: '부처님께 참배하고 마음을 가다듬습니다', color: '#c9a84c' },
  { id: 'jijangjeon', icon: '🪷', name: '지장전', desc: '조상 영가의 극락왕생을 발원합니다', color: '#9b7acc' },
  { id: 'jongmuso',   icon: '📿', name: '종무소', desc: '기도를 접수하고 불사에 동참합니다', color: '#e8a050' },
  { id: 'candle',     icon: '🕯', name: '초공양', desc: '초를 밝혀 지혜의 빛을 공양합니다', color: '#f0c060' },
  { id: 'indung',     icon: '🕯', name: '인등불사', desc: '인등을 밝혀 소원을 발원합니다', color: '#f0c060' },
  { id: 'yeondeung',  icon: '🏮', name: '연등공양', desc: '부처님오신날 연등을 밝혀 공양합니다', color: '#e06040' },
]

export default async function CyberEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const temple = await db.temple.findUnique({ where: { code: slug, isActive: true }, select: { name: true, code: true, denomination: true } })
  if (!temple) notFound()

  return (
    <div style={{ padding: '40px 20px 60px', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
      {/* 일주문 */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>☸</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: 4, marginBottom: 6, fontFamily: '"Noto Serif KR",serif' }}>
          {temple.name}
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(201,168,76,0.6)', letterSpacing: 3 }}>
          사이버법당
        </p>
        {temple.denomination && (
          <p style={{ fontSize: 11, color: 'rgba(201,168,76,0.35)', marginTop: 4 }}>{temple.denomination}</p>
        )}
      </div>

      <p style={{ fontSize: 14, color: 'rgba(240,223,160,0.7)', lineHeight: 1.9, marginBottom: 36, wordBreak: 'keep-all' }}>
        바쁜 일상 속에서도 잠시 발걸음을 멈추고<br />
        마음의 안식을 찾으시기 바랍니다.
      </p>

      {/* 전각 카드 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {HALLS.map(h => (
          <a key={h.id} href={`/${slug}/cyber/${h.id}`} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '28px 16px 24px', borderRadius: 14, textDecoration: 'none',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,168,76,0.12)',
            transition: 'border-color 0.2s, background 0.2s',
          }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{h.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: h.color, letterSpacing: 2, marginBottom: 6 }}>{h.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(240,223,160,0.55)', lineHeight: 1.6 }}>{h.desc}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
