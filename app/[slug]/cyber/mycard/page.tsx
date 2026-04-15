'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useCyberTemple } from '@/lib/useCyberTemple'
import { TEMPLE_OFFERINGS } from '@/lib/constants/templeOfferings'

const A = '#C9A84C'
const TYPE_ICONS: Record<string, string> = { yeondeung: '🏮', indung: '🕯️', avalokiteshvara: '🪷', lantern: '🏮', wonbul: '🪷' }

export default function MyCardPage() {
  const { slug } = useParams<{ slug: string }>()
  const temple = useCyberTemple(slug)
  const tName = temple?.name || slug
  const config = TEMPLE_OFFERINGS[slug] || TEMPLE_OFFERINGS.miraesa
  const [code, setCode] = useState('')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')

  const fetchCard = async (c: string) => {
    const r = await fetch(`/api/cyber/mycard?code=${encodeURIComponent(c)}&temple=${slug}`)
    if (r.ok) { setData(await r.json()); setError('') }
    else { setData(null); setError('조회 결과가 없습니다. 축원번호를 확인해주세요.') }
  }

  // 30초 폴링
  useEffect(() => {
    if (!data?.chukwon_no) return
    const iv = setInterval(() => fetchCard(data.chukwon_no), 30000)
    return () => clearInterval(iv)
  }, [data?.chukwon_no])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#0a0205,#120308)', color: '#F5E6C8', fontFamily: "'Noto Serif KR',serif", display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />

      {!data ? (<>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🪷</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: A, marginBottom: 4 }}>나의 공덕카드</div>
        <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 20 }}>{tName}</div>
        <div style={{ fontSize: 12, opacity: 0.4, marginBottom: 12 }}>축원번호를 입력해주세요 (종무소 스님께 문의)</div>
        <div style={{ display: 'flex', gap: 6, width: '100%', maxWidth: 320 }}>
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="MIR-2026-0001" onKeyDown={e => e.key === 'Enter' && fetchCard(code)} style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}44`, borderRadius: 8, color: '#F5E6C8', fontSize: 14, letterSpacing: 1 }} />
          <button onClick={() => fetchCard(code)} style={{ padding: '10px 18px', background: A, color: '#0a0205', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>확인</button>
        </div>
        {error && <div style={{ marginTop: 10, color: '#ef4444', fontSize: 13 }}>{error}</div>}
      </>) : (<>
        <div style={{ width: '100%', maxWidth: 400, background: `${A}08`, border: `1px solid ${A}33`, borderRadius: 12, padding: '1.2rem', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: A, letterSpacing: '0.15em' }}>🏯 {tName}</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{data.head_name} {data.buddhist_name ? `(${data.buddhist_name})` : ''}</div>
          <div style={{ fontSize: 12, color: `${A}88`, marginTop: 2 }}>{data.chukwon_no} · 가족 {data.family_count}인</div>

          <div style={{ marginTop: 16, textAlign: 'left' }}>
            <div style={{ fontSize: 13, color: A, fontWeight: 700, marginBottom: 8 }}>기도 접수 현황</div>
            {config.offerings.map(o => {
              const active = data.offerings.find((of: any) => of.type === o.type && of.status === 'active')
              return (
                <div key={o.type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${A}11` }}>
                  <span>{o.icon} {o.label}</span>
                  <span style={{ color: active ? '#22c55e' : `${A}44`, fontWeight: 700, fontSize: 13 }}>{active ? '✅ 점등중' : '─ 미접수'}</span>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
            {config.offerings.map(o => {
              const paths: Record<string, string> = { yeondeung: 'yeondeung', indung: 'indung', avalokiteshvara: 'avalokiteshvara', lantern: 'yeondeung', wonbul: 'avalokiteshvara' }
              return <a key={o.type} href={`/${slug}/cyber/${paths[o.type] || o.type}`} style={{ display: 'block', padding: 8, background: `${A}11`, border: `1px solid ${A}22`, borderRadius: 8, color: A, textAlign: 'center', textDecoration: 'none', fontSize: 13 }}>{o.icon} {o.label} 카드 보러가기 →</a>
            })}
          </div>
        </div>
        <button onClick={() => setData(null)} style={{ marginTop: 16, padding: '8px 20px', background: `${A}22`, border: `1px solid ${A}`, borderRadius: 8, color: A, cursor: 'pointer', fontSize: 12 }}>다른 축원번호 조회</button>
      </>)}

      <a href={`/${slug}/dharma-wheel?grid=1`} style={{ marginTop: 20, color: `${A}66`, textDecoration: 'none', fontSize: 12 }}>☸ 도량으로</a>
    </div>
  )
}
