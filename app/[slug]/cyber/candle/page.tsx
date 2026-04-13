'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

const AMOUNTS = [{ label: '5천원', value: 5000 }, { label: '1만원', value: 10000 }, { label: '3만원', value: 30000 }]
const PER_ROUND = 30


const COLS = 5

export default function CandlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [candles, setCandles] = useState<{ id: string; name: string; wish: string; created_at: string }[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [contact, setContact] = useState('')
  const [amount, setAmount] = useState(10000)
  const [loading, setLoading] = useState(false); const [kakaoText, setKakaoText] = useState("")
  const [viewRound, setViewRound] = useState(1)
  const [touchStartX2, setTouchStartX2] = useState(0)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; wish: string; date?: string } | null>(null)

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
        <div style={{ width: 80, height: 80, margin: '0 auto 8px', borderRadius: '50%', overflow: 'hidden', background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'cd-flicker 3s ease-in-out infinite alternate' }}>
          <img src="https://res.cloudinary.com/db3izttcy/image/upload/bodisatt_quikgz" alt="관세음보살" style={{ height: 70, objectFit: 'contain', mixBlendMode: 'multiply', filter: 'brightness(0.9) contrast(1.1)' }} />
        </div>
        <style>{`@keyframes cd-flicker { 0% { filter: drop-shadow(0 0 4px rgba(201,168,76,0.2)); } 100% { filter: drop-shadow(0 0 12px rgba(201,168,76,0.5)); } }`}</style>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#f0c060', letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>원불모시기</h2>
        <p style={{ fontSize: 12, color: 'rgba(240,192,96,0.5)', marginTop: 4 }}>관세음보살 원불을 모십니다</p>
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
              onMouseEnter={e => c && setTooltip({ x: e.clientX, y: e.clientY, name: c.name, wish: c.wish || '', date: c.created_at })}
              onMouseLeave={() => setTooltip(null)}
              style={{
                aspectRatio: '3/4', borderRadius: 6, cursor: lit ? 'default' : 'pointer',
                background: '#0d0608', position: 'relative', overflow: 'hidden',
                border: `1px solid ${lit ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)'}`,
              }}
            >
              {/* 단청 천장 */}
              <div style={{ position:'absolute',top:0,left:0,right:0,height:'20%',background:'linear-gradient(180deg,#1a0408,#2d0a10)',opacity:lit?1:0.4,zIndex:2 }}>
                <div style={{ position:'absolute',bottom:0,left:0,right:0,height:2,background:'linear-gradient(90deg,#8B2200,#C9A84C,#8B2200)' }} />
              </div>
              {/* 기둥 */}
              <div style={{ position:'absolute',top:0,bottom:0,left:0,width:'9%',background:'#8B2200',opacity:lit?1:0.3,zIndex:3,borderRight:'1px solid rgba(201,168,76,0.2)' }} />
              <div style={{ position:'absolute',top:0,bottom:0,right:0,width:'9%',background:'#8B2200',opacity:lit?1:0.3,zIndex:3,borderLeft:'1px solid rgba(201,168,76,0.2)' }} />
              {/* 관세음보살 */}
              <div style={{ position:'absolute',top:'16%',left:'50%',transform:'translateX(-50%)',width:'60%',zIndex:5,display:'flex',justifyContent:'center' }}>
                <img src="https://res.cloudinary.com/db3izttcy/image/upload/bodisatt_quikgz" alt="" style={{ width:'100%',objectFit:'contain',mixBlendMode:'multiply',filter:lit?'brightness(0.95) contrast(1.1)':'brightness(0.3)',opacity:lit?1:0.12 }} />
              </div>
              {/* 촛불+향로 (점등 시) */}
              {lit && (
                <div style={{ position:'absolute',bottom:'12%',left:0,right:0,display:'flex',justifyContent:'center',alignItems:'flex-end',gap:4,zIndex:8 }}>
                  <svg viewBox="0 0 14 42" width="10" height="32"><rect x="4" y="10" width="6" height="26" rx="2" fill="#f5f0e0"/><rect x="6" y="6" width="2" height="5" fill="#e8dcc0"/><ellipse cx="7" cy="4" rx="3" ry="5" fill="#FFD700" opacity="0.9"><animate attributeName="ry" values="4;6;4" dur="2s" repeatCount="indefinite"/></ellipse><ellipse cx="7" cy="3" rx="1.5" ry="3" fill="#fff" opacity="0.8"/><rect x="2" y="36" width="10" height="3" rx="1" fill="#C9A84C"/></svg>
                  <svg viewBox="0 0 16 28" width="10" height="20"><rect x="7" y="10" width="1.5" height="10" fill="#7a5c1e"/><ellipse cx="8" cy="21" rx="6" ry="3" fill="#C9A84C" opacity="0.8"/><path d="M6 10 Q5 5 7 0" stroke="rgba(200,180,140,0.5)" strokeWidth="0.6" fill="none"><animate attributeName="d" values="M6 10 Q5 5 7 0;M6 10 Q8 5 6 0;M6 10 Q5 5 7 0" dur="2.5s" repeatCount="indefinite"/></path><path d="M10 10 Q11 5 9 0" stroke="rgba(200,180,140,0.4)" strokeWidth="0.6" fill="none"><animate attributeName="d" values="M10 10 Q11 5 9 0;M10 10 Q8 5 10 0;M10 10 Q11 5 9 0" dur="3s" repeatCount="indefinite"/></path></svg>
                  <svg viewBox="0 0 14 42" width="10" height="32"><rect x="4" y="10" width="6" height="26" rx="2" fill="#f5f0e0"/><rect x="6" y="6" width="2" height="5" fill="#e8dcc0"/><ellipse cx="7" cy="4" rx="3" ry="5" fill="#FFD700" opacity="0.9"><animate attributeName="ry" values="4;6;4" dur="2.2s" repeatCount="indefinite"/></ellipse><ellipse cx="7" cy="3" rx="1.5" ry="3" fill="#fff" opacity="0.8"/><rect x="2" y="36" width="10" height="3" rx="1" fill="#C9A84C"/></svg>
                </div>
              )}
              {/* 이름 or 빈자리 */}
              <div style={{ position:'absolute',bottom:'3%',left:0,right:0,textAlign:'center',zIndex:10,fontSize:7,color:lit?'rgba(255,210,100,0.9)':'rgba(255,255,255,0.2)',background:'rgba(0,0,0,0.4)',padding:'1px 4px',borderRadius:3,width:'fit-content',margin:'0 auto' }}>
                {lit ? c!.name.slice(0,3) : '초공양'}
              </div>
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
            <a href={`/${slug}/dharma-wheel?grid=1`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 20px', fontSize: 13, textDecoration: 'none' }}>☸ 도량으로</a>
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
