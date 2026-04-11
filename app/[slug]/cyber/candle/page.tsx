'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

const AMOUNTS = [{ label: '5천원', value: 5000 }, { label: '1만원', value: 10000 }, { label: '3만원', value: 30000 }]

export default function CandlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [candles, setCandles] = useState<{ id: string; name: string; wish: string }[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [contact, setContact] = useState('')
  const [amount, setAmount] = useState(10000)
  const [loading, setLoading] = useState(false)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; wish: string } | null>(null)

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/cyber/offering?temple_slug=${slug}&type=candle&limit=36`)
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
    setShowForm(false); setName(''); setWish(''); setContact('')
    setLoading(false)
  }

  const TOTAL = 36
  const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(240,192,96,0.25)', borderRadius: 8, padding: '10px 14px', color: 'rgba(255,220,120,0.9)', fontSize: 14, outline: 'none', width: '100%' }

  return (
    <div style={{ padding: '20px 20px 60px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🕯</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#f0c060', letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>초공양</h2>
        <p style={{ fontSize: 12, color: 'rgba(240,192,96,0.5)', marginTop: 4 }}>초를 밝혀 지혜의 빛을 공양합니다</p>
        <p style={{ fontSize: 11, color: 'rgba(240,192,96,0.3)', marginTop: 4 }}>점등 {candles.length} / {TOTAL}</p>
      </div>

      {/* 초 그리드 6×6 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 24, position: 'relative' }}>
        {Array.from({ length: TOTAL }).map((_, i) => {
          const lit = i < candles.length
          const c = lit ? candles[i] : null
          return (
            <div key={i}
              onClick={() => !lit && setShowForm(true)}
              onMouseEnter={e => c && setTooltip({ x: e.clientX, y: e.clientY, name: c.name, wish: c.wish || '' })}
              onMouseLeave={() => setTooltip(null)}
              style={{
                aspectRatio: '1', borderRadius: 8, cursor: lit ? 'default' : 'pointer',
                background: lit ? 'rgba(240,192,96,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${lit ? 'rgba(240,192,96,0.3)' : 'rgba(255,255,255,0.06)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ fontSize: lit ? 24 : 18, filter: lit ? 'drop-shadow(0 0 6px rgba(255,200,50,0.5))' : 'grayscale(1) opacity(0.2)' }}>
                🕯
              </div>
              {lit && <div style={{ fontSize: 9, color: 'rgba(240,192,96,0.7)', marginTop: 2 }}>{c!.name.slice(0, 3)}</div>}
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

      {!showForm && candles.length < TOTAL && (
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => setShowForm(true)} style={{ background: 'rgba(240,192,96,0.15)', border: '1px solid rgba(240,192,96,0.4)', color: 'rgba(255,220,120,0.9)', borderRadius: 8, padding: '12px 28px', cursor: 'pointer', fontSize: 14 }}>
            🕯 초 밝히기
          </button>
        </div>
      )}
    </div>
  )
}
