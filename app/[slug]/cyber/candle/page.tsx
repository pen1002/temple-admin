'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

const AMOUNTS = [{ label: '5천원', value: 5000 }, { label: '1만원', value: 10000 }, { label: '3만원', value: 30000 }]
const PER_ROUND = 30


const COLS = 5

export default function CandlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [candles, setCandles] = useState<{ id: string; name: string; wish: string }[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [contact, setContact] = useState('')
  const [amount, setAmount] = useState(10000)
  const [loading, setLoading] = useState(false)
  const [viewRound, setViewRound] = useState(1)
  const [touchStartX2, setTouchStartX2] = useState(0)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; wish: string } | null>(null)

  const totalRounds = Math.max(1, Math.ceil(candles.length / PER_ROUND) + 1)
  const roundStart = (viewRound - 1) * PER_ROUND
  const roundCount = Math.min(Math.max(0, candles.length - roundStart), PER_ROUND)
  
  
  
  

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/cyber/offering?temple_slug=${slug}&type=candle&limit=10000`)
    const data = await res.json()
    if (Array.isArray(data)) setCandles(data)
  }, [slug])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSubmit = async () => {
    if (!name.trim()) return
    setLoading(true)
    await fetch('/api/cyber/offering', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temple_slug: slug, type: 'candle', name: name.trim(), wish: wish.trim(), contact: contact.trim(), amount }),
    })
    await fetchData()
    setShowForm(false); setSubmitDone(true); setName(''); setWish(''); setContact('')
    setLoading(false)
  }
  const [submitDone, setSubmitDone] = useState(false)

  const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(240,192,96,0.25)', borderRadius: 8, padding: '10px 14px', color: 'rgba(255,220,120,0.9)', fontSize: 14, outline: 'none', width: '100%' }

  return (
    <div style={{ padding: '20px 20px 60px', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 48, marginBottom: 8, animation: 'cd-flicker 1.5s ease-in-out infinite alternate' }}>🕯</div>
        <style>{`@keyframes cd-flicker { 0% { transform: scale(1); filter: brightness(1); } 100% { transform: scale(1.08); filter: brightness(1.2) drop-shadow(0 0 8px rgba(255,200,50,0.5)); } }`}</style>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#f0c060', letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>초공양</h2>
        <p style={{ fontSize: 12, color: 'rgba(240,192,96,0.5)', marginTop: 4 }}>초를 밝혀 지혜의 빛을 공양합니다</p>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <span style={{ color: 'rgba(240,192,96,0.7)', fontSize: 13 }}>전체 {candles.length.toLocaleString()}초 점등</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <button onClick={() => setViewRound(Math.max(1, viewRound - 1))} disabled={viewRound <= 1} style={{ background: 'none', border: '1px solid rgba(240,192,96,0.2)', color: viewRound <= 1 ? 'rgba(240,192,96,0.2)' : '#f0c060', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 13 }}>◂</button>
        <span style={{ color: '#f0c060', fontSize: 14, fontWeight: 600 }}>{viewRound}차 ({roundCount}/{PER_ROUND})</span>
        <button onClick={() => setViewRound(viewRound + 1)} style={{ background: 'none', border: '1px solid rgba(240,192,96,0.2)', color: '#f0c060', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 13 }}>▸</button>
      </div>

      {/* 현재 차수 초 그리드 10×10 */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 4, marginBottom: 24 }}>
        {Array.from({ length: PER_ROUND }).map((_, i) => {
          const globalIdx = roundStart + i
          const lit = globalIdx < candles.length
          const c = lit ? candles[globalIdx] : null
          return (
            <div key={i}
              onClick={() => !lit && setShowForm(true)}
              onMouseEnter={e => c && setTooltip({ x: e.clientX, y: e.clientY, name: c.name, wish: c.wish || '' })}
              onMouseLeave={() => setTooltip(null)}
              style={{
                aspectRatio: '1', borderRadius: 6, cursor: lit ? 'default' : 'pointer',
                background: lit ? 'rgba(240,192,96,0.12)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${lit ? 'rgba(240,192,96,0.25)' : 'rgba(255,255,255,0.04)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ fontSize: lit ? 16 : 12, filter: lit ? 'drop-shadow(0 0 4px rgba(255,200,50,0.5))' : 'grayscale(1) opacity(0.15)' }}>
                🕯
              </div>
              {lit && <div style={{ fontSize: 7, color: 'rgba(240,192,96,0.6)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%', padding: '0 2px' }}>{c!.name.slice(0, 2)}</div>}
            </div>
          )
        })}
      </div>

      {/* 툴팁 */}
      {tooltip && (
        <div style={{ position: 'fixed', left: tooltip.x + 10, top: tooltip.y - 50, background: 'rgba(12,4,28,0.97)', border: '1px solid rgba(240,192,96,0.4)', borderRadius: 8, padding: '8px 12px', pointerEvents: 'none', zIndex: 100 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,235,150,0.95)', fontWeight: 700 }}>{tooltip.name} 불자님</div>
          {tooltip.wish && <div style={{ fontSize: 11, color: 'rgba(240,192,96,0.6)', marginTop: 2 }}>{tooltip.wish.slice(0, 30)}</div>}
        </div>
      )}

      {/* 신청 폼 */}
      {showForm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="성함 *" style={inp} />
          <textarea value={wish} onChange={e => setWish(e.target.value)} placeholder="발원문 (선택)" rows={2} style={{ ...inp, resize: 'none' }} />
          <input value={contact} onChange={e => setContact(e.target.value)} type="tel" placeholder="연락처 (010-0000-0000)" style={inp} />
          <div style={{ display: 'flex', gap: 8 }}>
            {AMOUNTS.map(a => (
              <button key={a.value} onClick={() => setAmount(a.value)} style={{
                flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                border: amount === a.value ? '2px solid rgba(240,192,96,0.8)' : '1px solid rgba(240,192,96,0.2)',
                background: amount === a.value ? 'rgba(240,192,96,0.2)' : 'rgba(255,255,255,0.04)',
                color: amount === a.value ? '#f0c060' : 'rgba(240,192,96,0.5)', fontWeight: amount === a.value ? 700 : 400,
              }}>{a.label}</button>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={loading || !name.trim()} style={{ background: loading ? 'rgba(180,140,40,0.3)' : 'rgba(240,192,96,0.22)', border: '1px solid rgba(240,192,96,0.55)', color: 'rgba(255,220,120,0.95)', borderRadius: 8, padding: 14, fontSize: 15, cursor: 'pointer', fontWeight: 500 }}>
            {loading ? '점등 중...' : `초 공양 — ${amount.toLocaleString()}원`}
          </button>
        </div>
      )}

      {submitDone && !showForm && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🕯</div>
          <p style={{ color: 'rgba(255,235,150,0.95)', fontSize: 16, fontWeight: 500, lineHeight: 1.9 }}>초가 점등되었습니다.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
            <button onClick={() => { setSubmitDone(false); setShowForm(true) }} style={{ background: 'rgba(240,192,96,0.15)', border: '1px solid rgba(240,192,96,0.4)', color: 'rgba(255,220,120,0.9)', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 13 }}>추가 공양</button>
            <a href={`/${slug}/cyber`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 20px', fontSize: 13, textDecoration: 'none' }}>☸ 도량으로</a>
          </div>
        </div>
      )}

      {!showForm && !submitDone && true && (
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => setShowForm(true)} style={{ background: 'rgba(240,192,96,0.15)', border: '1px solid rgba(240,192,96,0.4)', color: 'rgba(255,220,120,0.9)', borderRadius: 8, padding: '12px 28px', cursor: 'pointer', fontSize: 14 }}>
            🕯 초 밝히기
          </button>
        </div>
      )}

      {false && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✨</div>
          <p style={{ color: '#f0c060', fontSize: 16, fontWeight: 600 }}>2,000초 원만성취</p>
        </div>
      )}
    </div>
  )
}
