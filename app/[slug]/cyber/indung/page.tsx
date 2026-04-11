'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

const PER_ROUND = 100, MAX_ROUND = 20, TOTAL = 2000
const getMobileCols = () => typeof window !== 'undefined' && window.innerWidth < 480 ? 5 : 10
const AMOUNTS = [{ label: '1만원', value: 10000 }, { label: '3만원', value: 30000 }, { label: '7만원', value: 70000 }]

interface Donor { id: string; name: string; wish: string }

export default function IndungPage() {
  const { slug } = useParams<{ slug: string }>()
  const [items, setItems] = useState<Donor[]>([])
  const [name, setName] = useState(''); const [wish, setWish] = useState(''); const [contact, setContact] = useState('')
  const [amount, setAmount] = useState(30000); const [loading, setLoading] = useState(false); const [submitted, setSubmitted] = useState(false)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; wish: string } | null>(null)

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/cyber/offering?temple_slug=${slug}&type=indung&limit=${TOTAL}`)
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
      body: JSON.stringify({ temple_slug: slug, type: 'indung', name: name.trim(), wish: wish.trim(), contact: contact.trim(), amount }) })
    await fetchData(); setSubmitted(true); setLoading(false)
  }

  const accent = '#f0c060', accentRgb = '240,192,96'
  const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(${accentRgb},0.25)`, borderRadius: 8, padding: '10px 14px', color: 'rgba(255,220,120,0.9)', fontSize: 14, outline: 'none', width: '100%' }

  return (
    <div style={{ padding: '20px 20px 60px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🕯</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: accent, letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>인등불사</h2>
        <p style={{ fontSize: 12, color: `rgba(${accentRgb},0.5)`, marginTop: 4 }}>인등을 밝혀 소원을 발원합니다</p>
      </div>

      {/* 프로그레스 */}
      <div style={{ maxWidth: 480, margin: '0 auto 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ color: `rgba(${accentRgb},0.7)`, fontSize: 13, minWidth: 90, textAlign: 'right' }}>{items.length.toLocaleString()} / {TOTAL.toLocaleString()}</span>
          <div style={{ flex: 1, height: 6, background: `rgba(${accentRgb},0.1)`, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#c9a84c,#f6e05e)', borderRadius: 3, transition: 'width 0.8s' }} />
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

      {/* 인등 격자 — 원형 */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${getMobileCols()}, 1fr)`, gap: 4, marginBottom: 20, position: 'relative' }}>
        {Array.from({ length: PER_ROUND }).map((_, i) => {
          const gi = roundStart + i, lit = gi < items.length, c = lit ? items[gi] : null
          return (
            <div key={i} onMouseEnter={e => c && setTooltip({ x: e.clientX, y: e.clientY, name: c.name, wish: c.wish || '' })} onMouseLeave={() => setTooltip(null)}
              style={{ aspectRatio: '1', borderRadius: '50%', background: lit ? 'radial-gradient(circle, rgba(255,220,80,0.25) 0%, rgba(201,168,76,0.08) 70%)' : 'rgba(255,255,255,0.02)', border: `1px solid ${lit ? 'rgba(255,220,80,0.35)' : 'rgba(255,255,255,0.04)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: lit ? '0 0 8px rgba(255,200,50,0.2)' : 'none' }}>
              <div style={{ width: '60%', height: '60%', borderRadius: '50%', background: lit ? 'radial-gradient(circle at 40% 35%, rgba(255,240,180,0.95), rgba(255,200,50,0.8) 50%, rgba(201,150,40,0.6))' : 'rgba(100,90,60,0.1)', boxShadow: lit ? '0 0 6px rgba(255,200,50,0.5)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {lit && <span style={{ fontSize: 7, color: 'rgba(100,60,10,0.8)', fontWeight: 700 }}>{c!.name.slice(0, 2)}</span>}
              </div>
            </div>
          )
        })}
      </div>
      {tooltip && (
        <div style={{ position: 'fixed', left: tooltip.x + 10, top: tooltip.y - 50, background: 'rgba(12,4,28,0.97)', border: '1px solid rgba(240,192,96,0.4)', borderRadius: 8, padding: '8px 12px', pointerEvents: 'none', zIndex: 100 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,235,150,0.95)', fontWeight: 700 }}>{tooltip.name} 불자님</div>
          {tooltip.wish && <div style={{ fontSize: 11, color: 'rgba(240,192,96,0.6)', marginTop: 2 }}>{tooltip.wish.slice(0, 30)}</div>}
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
            {loading ? '접수 중...' : `인등 신청하기 — ${amount.toLocaleString()}원`}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🕯</div>
          <p style={{ color: 'rgba(255,235,150,0.95)', fontSize: 16, fontWeight: 500, lineHeight: 1.9 }}>인등이 점등되었습니다.</p>
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
