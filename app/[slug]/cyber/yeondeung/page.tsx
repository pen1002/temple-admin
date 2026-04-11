'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

const PER_ROUND = 100, MAX_ROUND = 20, TOTAL = 2000
const getMobileCols = () => typeof window !== 'undefined' && window.innerWidth < 480 ? 5 : 10
const AMOUNTS = [{ label: '1인 5만원', value: 50000 }, { label: '가족등 10만원', value: 100000 }]

interface Donor { id: string; name: string; wish: string }

export default function YeondeungPage() {
  const { slug } = useParams<{ slug: string }>()
  const [items, setItems] = useState<Donor[]>([])
  const [name, setName] = useState(''); const [wish, setWish] = useState(''); const [contact, setContact] = useState('')
  const [amount, setAmount] = useState(50000); const [loading, setLoading] = useState(false); const [submitted, setSubmitted] = useState(false)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; wish: string } | null>(null)

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/cyber/offering?temple_slug=${slug}&type=yeondeung&limit=${TOTAL}`)
    const data = await res.json()
    if (Array.isArray(data)) setItems(data)
  }, [slug])
  useEffect(() => { fetchData() }, [fetchData])

  const currentRound = Math.min(MAX_ROUND, Math.floor(items.length / PER_ROUND) + 1)
  const roundStart = (currentRound - 1) * PER_ROUND
  const roundCount = Math.min(items.length - roundStart, PER_ROUND)
  const pct = Math.min(100, Math.round((items.length / TOTAL) * 100))

  const handleSubmit = async () => {
    if (!name.trim()) return; setLoading(true)
    await fetch('/api/cyber/offering', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temple_slug: slug, type: 'yeondeung', name: name.trim(), wish: wish.trim(), contact: contact.trim(), amount }) })
    await fetchData(); setSubmitted(true); setLoading(false)
  }

  const accent = '#e06040', accentRgb = '224,96,64'
  const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(${accentRgb},0.25)`, borderRadius: 8, padding: '10px 14px', color: 'rgba(255,220,120,0.9)', fontSize: 14, outline: 'none', width: '100%' }

  return (
    <div style={{ padding: '20px 20px 60px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🏮</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: accent, letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>연등공양</h2>
        <p style={{ fontSize: 12, color: `rgba(${accentRgb},0.5)`, marginTop: 4 }}>부처님오신날 연등을 밝혀 공양합니다</p>
        <p style={{ fontSize: 11, color: `rgba(${accentRgb},0.4)`, marginTop: 6 }}>🏮 연등 신청자는 서울 불연암에 등을 달아드립니다</p>
      </div>

      {/* 프로그레스 */}
      <div style={{ maxWidth: 480, margin: '0 auto 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ color: `rgba(${accentRgb},0.7)`, fontSize: 13, minWidth: 90, textAlign: 'right' }}>{items.length.toLocaleString()} / {TOTAL.toLocaleString()}</span>
          <div style={{ flex: 1, height: 6, background: `rgba(${accentRgb},0.1)`, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#e06040,#f0a050)', borderRadius: 3, transition: 'width 0.8s' }} />
          </div>
          <span style={{ color: `rgba(${accentRgb},0.7)`, fontSize: 13, minWidth: 32 }}>{pct}%</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
        {Array.from({ length: MAX_ROUND }, (_, i) => i + 1).map(r => (
          <span key={r} style={{ width: r === currentRound ? 12 : 8, height: r === currentRound ? 12 : 8, borderRadius: '50%', display: 'inline-block', background: r < currentRound ? accent : r === currentRound ? '#fff' : 'rgba(255,255,255,0.08)', border: r === currentRound ? `2px solid ${accent}` : 'none', boxShadow: r === currentRound ? `0 0 6px rgba(${accentRgb},0.5)` : 'none' }} />
        ))}
      </div>
      <p style={{ textAlign: 'center', fontSize: 12, color: `rgba(${accentRgb},0.5)`, marginBottom: 16 }}>{currentRound}차 ({roundCount} / {PER_ROUND})</p>

      {/* 연등 격자 — 타원형 */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${getMobileCols()}, 1fr)`, gap: 4, marginBottom: 20, position: 'relative' }}>
        {Array.from({ length: PER_ROUND }).map((_, i) => {
          const gi = roundStart + i, lit = gi < items.length, c = lit ? items[gi] : null
          return (
            <div key={i} onMouseEnter={e => c && setTooltip({ x: e.clientX, y: e.clientY, name: c.name, wish: c.wish || '' })} onMouseLeave={() => setTooltip(null)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2px 0' }}>
              <svg viewBox="0 0 50 68" style={{ width: '100%', maxWidth: 40, filter: lit ? 'drop-shadow(0 0 6px rgba(240,150,180,0.4))' : 'grayscale(1) opacity(0.12)' }}>
                {/* 줄 */}
                <line x1="25" y1="0" x2="25" y2="10" stroke={lit ? '#666' : '#444'} strokeWidth="1" />
                {/* 상단 테 */}
                <rect x="13" y="9" width="24" height="4" rx="1.5" fill={lit ? '#c0392b' : '#555'} />
                {/* 연등 몸통 — 구형 */}
                <ellipse cx="25" cy="30" rx="18" ry="17" fill={lit ? '#f4b8cc' : '#555'} />
                {/* 살 (세로 곡선 4개) */}
                <path d="M25 13 Q25 30 25 47" stroke={lit ? '#e8a0b8' : '#666'} strokeWidth="1" fill="none" />
                <path d="M14 15 Q10 30 14 45" stroke={lit ? '#e8a0b8' : '#666'} strokeWidth="0.7" fill="none" />
                <path d="M36 15 Q40 30 36 45" stroke={lit ? '#e8a0b8' : '#666'} strokeWidth="0.7" fill="none" />
                <path d="M9 20 Q7 30 9 40" stroke={lit ? '#e8a0b8' : '#666'} strokeWidth="0.5" fill="none" />
                <path d="M41 20 Q43 30 41 40" stroke={lit ? '#e8a0b8' : '#666'} strokeWidth="0.5" fill="none" />
                {/* 중앙 띠 (세로) */}
                <rect x="23" y="13" width="4" height="34" rx="1" fill={lit ? '#e898b0' : '#555'} opacity="0.5" />
                {/* 하이라이트 */}
                <ellipse cx="20" cy="26" rx="5" ry="7" fill="rgba(255,255,255,0.15)" />
                {/* 하단 테 */}
                <rect x="13" y="45" width="24" height="4" rx="1.5" fill={lit ? '#c0392b' : '#555'} />
                {/* 하단 줄 */}
                <line x1="25" y1="49" x2="25" y2="56" stroke={lit ? '#666' : '#444'} strokeWidth="1" />
                {/* 발원문 패 */}
                <rect x="20" y="55" width="10" height="12" rx="1" fill={lit ? '#f0b0c8' : '#555'} />
                {/* 이름 */}
                {lit && c && (
                  <text x="25" y="33" textAnchor="middle" fill="rgba(140,50,80,0.7)" fontSize="7" fontWeight="700">{c.name.slice(0, 2)}</text>
                )}
              </svg>
            </div>
          )
        })}
      </div>
      {tooltip && (
        <div style={{ position: 'fixed', left: tooltip.x + 10, top: tooltip.y - 50, background: 'rgba(12,4,28,0.97)', border: `1px solid rgba(${accentRgb},0.4)`, borderRadius: 8, padding: '8px 12px', pointerEvents: 'none', zIndex: 100 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,235,150,0.95)', fontWeight: 700 }}>{tooltip.name} 불자님</div>
          {tooltip.wish && <div style={{ fontSize: 11, color: `rgba(${accentRgb},0.6)`, marginTop: 2 }}>{tooltip.wish.slice(0, 30)}</div>}
        </div>
      )}

      {/* 폼 */}
      {!submitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="성함 *" style={inp} />
          <textarea value={wish} onChange={e => setWish(e.target.value)} placeholder="발원문 (선택)" rows={2} style={{ ...inp, resize: 'none' }} />
          <input value={contact} onChange={e => setContact(e.target.value)} type="tel" placeholder="연락처 (010-0000-0000)" style={inp} />
          <div style={{ display: 'flex', gap: 8 }}>
            {AMOUNTS.map(a => (
              <button key={a.value} onClick={() => setAmount(a.value)} style={{ flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 13, cursor: 'pointer', border: amount === a.value ? `2px solid rgba(${accentRgb},0.8)` : `1px solid rgba(${accentRgb},0.2)`, background: amount === a.value ? `rgba(${accentRgb},0.2)` : 'rgba(255,255,255,0.04)', color: amount === a.value ? accent : `rgba(${accentRgb},0.5)`, fontWeight: amount === a.value ? 700 : 400 }}>{a.label}</button>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={loading || !name.trim()} style={{ background: loading ? `rgba(${accentRgb},0.15)` : `rgba(${accentRgb},0.22)`, border: `1px solid rgba(${accentRgb},0.55)`, color: 'rgba(255,220,120,0.95)', borderRadius: 8, padding: 14, fontSize: 15, cursor: 'pointer', fontWeight: 500 }}>
            {loading ? '접수 중...' : `연등 신청하기 — ${amount.toLocaleString()}원`}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🏮</div>
          <p style={{ color: 'rgba(255,235,150,0.95)', fontSize: 16, fontWeight: 500, lineHeight: 1.9 }}>연등이 점등되었습니다.</p>
          <p style={{ color: `rgba(${accentRgb},0.7)`, fontSize: 13, marginTop: 8, lineHeight: 1.8, background: `rgba(${accentRgb},0.06)`, border: `1px solid rgba(${accentRgb},0.15)`, borderRadius: 8, padding: '10px 14px' }}>
            🏮 연등 신청자는 서울 불연암에 등을 달아드립니다.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
            <button onClick={() => { setSubmitted(false); setName(''); setWish(''); setContact('') }} style={{ background: `rgba(${accentRgb},0.15)`, border: `1px solid rgba(${accentRgb},0.4)`, color: accent, borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 13 }}>추가 신청</button>
            <a href={`/${slug}/cyber`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 20px', fontSize: 13, textDecoration: 'none' }}>☸ 도량으로</a>
          </div>
        </div>
      )}
      {items.length >= TOTAL && <div style={{ textAlign: 'center', padding: '20px 0' }}><p style={{ color: accent, fontSize: 16, fontWeight: 600 }}>✨ 2,000등 원만성취</p></div>}
    </div>
  )
}
