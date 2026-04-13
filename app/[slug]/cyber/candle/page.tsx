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
    <div style={{ padding: '20px 20px 60px', maxWidth: 640, margin: '0 auto' }}
      onTouchStart={e => setTouchStartX2(e.touches[0].clientX)}
      onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touchStartX2; if (Math.abs(dx) > 50) { if (dx < 0 && viewRound < totalRounds) setViewRound(viewRound + 1); if (dx > 0 && viewRound > 1) setViewRound(viewRound - 1) } }}
    >
      <style>{`
        @keyframes cardHalo { 0%,100%{opacity:0.5} 50%{opacity:0.9} }
        @keyframes cardFlame { 0%,100%{transform:scaleY(1) scaleX(1)} 50%{transform:scaleY(1.2) scaleX(0.85)} }
      `}</style>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        {/* 전각 스타일 헤더 카드 — 그리드 카드와 100% 동일 */}
        <div style={{ width: 80, height: 106, margin: '0 auto 8px', borderRadius: 6, background: '#0d0608', position: 'relative', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)' }}>
          {/* 천장 + 단청 + 수막새 */}
          <div style={{ position:'absolute',top:0,left:0,right:0,height:'12%',background:'linear-gradient(180deg,#1a0408,#2d0a10)',borderBottom:'1.5px solid #C9A84C',zIndex:6,overflow:'visible' }}>
            <div style={{ position:'absolute',inset:0,background:'repeating-linear-gradient(90deg,#8B1A00 0,#8B1A00 4px,#C9A84C 4px,#C9A84C 7px,#1a5c20 7px,#1a5c20 11px,#1a3a8c 11px,#1a3a8c 15px,#C9A84C 15px,#C9A84C 18px)',opacity:0.8 }} />
            <div style={{ position:'absolute',bottom:-4,left:'8%',right:'8%',display:'flex',justifyContent:'space-around',zIndex:7 }}>
              {[0,1,2,3,4].map(k => <svg key={k} viewBox="0 0 10 10" width="7" height="7"><circle cx="5" cy="5" r="4.5" fill="#C9A84C" stroke="#FFD700" strokeWidth=".8"/><circle cx="5" cy="5" r="2" fill="#8B5C00"/></svg>)}
            </div>
          </div>
          {/* 기둥 + 중앙 */}
          <div style={{ display:'flex',width:'100%',height:'88%',marginTop:'12%',position:'relative' }}>
            <div style={{ width:'9%',flexShrink:0,background:'linear-gradient(90deg,#5C1010,#8B2200,#5C1010)',borderRight:'1px solid rgba(201,168,76,0.45)',zIndex:5 }} />
            <div style={{ flex:1,position:'relative' }}>
              <div style={{ position:'absolute',top:'8%',left:'50%',transform:'translateX(-50%)',width:36,height:36,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,210,80,0.3) 0%,transparent 70%)',animation:'cardHalo 3s ease-in-out infinite',zIndex:3 }} />
              <img src="https://res.cloudinary.com/db3izttcy/image/upload/bodisatt_quikgz" alt="관세음보살" style={{ position:'absolute',top:'2%',left:0,right:0,width:'100%',height:'79%',objectFit:'contain',mixBlendMode:'lighten',filter:'drop-shadow(0 0 5px rgba(255,200,80,0.65)) brightness(1.1)',zIndex:4 }} />
              <div style={{ position:'absolute',top:'3%',left:0,right:0,textAlign:'center',fontSize:'6.5px',color:'rgba(201,168,76,0.85)',letterSpacing:'0.04em',zIndex:8 }}>초공양</div>
              <div style={{ position:'absolute',bottom:'5%',left:0,right:0,display:'flex',justifyContent:'space-around',padding:'0 14%',zIndex:8 }}>
                {[0,1].map(k => <div key={k} style={{ display:'flex',flexDirection:'column',alignItems:'center' }}><div style={{ width:4,height:6,background:'linear-gradient(180deg,#fff8e0,#FFD700,#FF6600)',borderRadius:'50% 50% 30% 30%',boxShadow:'0 0 3px rgba(255,200,50,0.9)',animation:`cardFlame ${1.1+k*0.2}s ease-in-out infinite ${k*0.2}s` }} /><div style={{ width:3,height:9,background:'linear-gradient(90deg,#e0c880,#fff8e0)',borderRadius:1 }} /><div style={{ width:5,height:2,background:'#C9A84C',borderRadius:1 }} /></div>)}
              </div>
            </div>
            <div style={{ width:'9%',flexShrink:0,background:'linear-gradient(270deg,#5C1010,#8B2200,#5C1010)',borderLeft:'1px solid rgba(201,168,76,0.45)',zIndex:5 }} />
          </div>
        </div>
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
              {/* 천장 + 단청 + 수막새 */}
              <div style={{ position:'absolute',top:0,left:0,right:0,height:'12%',background:lit?'linear-gradient(180deg,#1a0408,#2d0a10)':'linear-gradient(180deg,#0f0206,#1a0408)',borderBottom:lit?'1.5px solid #C9A84C':'1px solid rgba(201,168,76,0.25)',zIndex:6,overflow:'visible' }}>
                <div style={{ position:'absolute',inset:0,background:lit?'repeating-linear-gradient(90deg,#8B1A00 0,#8B1A00 4px,#C9A84C 4px,#C9A84C 7px,#1a5c20 7px,#1a5c20 11px,#1a3a8c 11px,#1a3a8c 15px,#C9A84C 15px,#C9A84C 18px)':'repeating-linear-gradient(90deg,#3a0800 0,#3a0800 4px,#5a4010 4px,#5a4010 7px,#0a2010 7px,#0a2010 11px,#0a1040 11px,#0a1040 15px,#5a4010 15px,#5a4010 18px)',opacity:lit?0.8:0.45 }} />
                <div style={{ position:'absolute',bottom:-4,left:'8%',right:'8%',display:'flex',justifyContent:'space-around',zIndex:7 }}>
                  {[0,1,2,3,4].map(k => <svg key={k} viewBox="0 0 10 10" width="7" height="7"><circle cx="5" cy="5" r="4.5" fill={lit?'#C9A84C':'#5a4010'} stroke={lit?'#FFD700':'#8B6914'} strokeWidth=".8"/><circle cx="5" cy="5" r="2" fill={lit?'#8B5C00':'#3a2808'}/></svg>)}
                </div>
              </div>
              {/* 기둥+중앙 */}
              <div style={{ display:'flex',width:'100%',height:'88%',marginTop:'12%',position:'relative' }}>
                <div style={{ width:'9%',flexShrink:0,background:lit?'linear-gradient(90deg,#5C1010,#8B2200,#5C1010)':'linear-gradient(90deg,#200808,#350e0e,#200808)',borderRight:lit?'1px solid rgba(201,168,76,0.45)':'1px solid rgba(201,168,76,0.1)',zIndex:5 }} />
                <div style={{ flex:1,position:'relative' }}>
                  {lit && <div style={{ position:'absolute',top:'8%',left:'50%',transform:'translateX(-50%)',width:36,height:36,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,210,80,0.3) 0%,transparent 70%)',animation:'cardHalo 3s ease-in-out infinite',zIndex:3 }} />}
                  <img src="https://res.cloudinary.com/db3izttcy/image/upload/bodisatt_quikgz" alt="" style={{ position:'absolute',top:'2%',left:0,right:0,width:'100%',height:'79%',objectFit:'contain',mixBlendMode:'lighten',filter:lit?'drop-shadow(0 0 5px rgba(255,200,80,0.65)) brightness(1.1)':'none',opacity:lit?1:0.1,zIndex:4 }} />
                  <div style={{ position:'absolute',top:'3%',left:0,right:0,textAlign:'center',fontSize:'6.5px',color:lit?'rgba(201,168,76,0.85)':'rgba(201,168,76,0.3)',letterSpacing:'0.04em',zIndex:8 }}>초공양</div>
                  {lit && <div style={{ position:'absolute',bottom:'5%',left:0,right:0,display:'flex',justifyContent:'space-around',padding:'0 14%',zIndex:8 }}>
                    {[0,1].map(k => <div key={k} style={{ display:'flex',flexDirection:'column',alignItems:'center' }}><div style={{ width:4,height:6,background:'linear-gradient(180deg,#fff8e0,#FFD700,#FF6600)',borderRadius:'50% 50% 30% 30%',boxShadow:'0 0 3px rgba(255,200,50,0.9)',animation:`cardFlame ${1.1+k*0.2}s ease-in-out infinite ${k*0.2}s` }} /><div style={{ width:3,height:9,background:'linear-gradient(90deg,#e0c880,#fff8e0)',borderRadius:1 }} /><div style={{ width:5,height:2,background:'#C9A84C',borderRadius:1 }} /></div>)}
                  </div>}
                  {lit ? <div style={{ position:'absolute',bottom:'1%',left:0,right:0,textAlign:'center',zIndex:8,fontSize:'6.5px',color:'rgba(255,210,100,0.9)' }}><span style={{ background:'rgba(0,0,0,0.5)',padding:'1px 3px',borderRadius:2 }}>{c!.name.slice(0,3)}</span></div>
                    : <div style={{ position:'absolute',bottom:'8%',left:0,right:0,textAlign:'center',fontSize:6,color:'rgba(255,255,255,0.2)',zIndex:8 }}>신청하기</div>}
                </div>
                <div style={{ width:'9%',flexShrink:0,background:lit?'linear-gradient(270deg,#5C1010,#8B2200,#5C1010)':'linear-gradient(270deg,#200808,#350e0e,#200808)',borderLeft:lit?'1px solid rgba(201,168,76,0.45)':'1px solid rgba(201,168,76,0.1)',zIndex:5 }} />
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
