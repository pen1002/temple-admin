'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useCyberTemple } from '@/lib/useCyberTemple'
import ConsentCheckbox from '@/components/common/ConsentCheckbox'

const PER_ROUND = 30, COLS = 5
const AMOUNT = 10000

interface Donor { id: string; name: string; wish: string; created_at: string }

export default function IndungPage() {
  const { slug } = useParams<{ slug: string }>()
  const temple = useCyberTemple(slug)
  const tName = temple?.name || slug
  const [items, setItems] = useState<Donor[]>([])
  const [name, setName] = useState(''); const [wish, setWish] = useState(''); const [contact, setContact] = useState('')
  const [loading, setLoading] = useState(false); const [submitted, setSubmitted] = useState(false); const [kakaoText, setKakaoText] = useState("")
  const [agreedPrivacy, setAgreedPrivacy] = useState(false)
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; wish: string; date?: string } | null>(null)

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/cyber/offering?temple_slug=${slug}&type=indung&limit=10000`)
    const data = await res.json()
    if (Array.isArray(data)) setItems(data)
  }, [slug])
  useEffect(() => { fetchData() }, [fetchData])

  const [viewRound, setViewRound] = useState(1)
  const [touchStartX, setTouchStartX] = useState(0)
  const totalRounds = Math.max(1, Math.ceil(items.length / PER_ROUND) + 1)
  const roundStart = (viewRound - 1) * PER_ROUND
  const roundCount = Math.min(Math.max(0, items.length - roundStart), PER_ROUND)

  const handleSubmit = async () => {
    if (!agreedPrivacy || !agreedTerms) { alert('개인정보 처리방침 및 이용약관에 동의해 주세요.'); return }
    if (!name.trim()) return; setLoading(true)
    const res = await fetch("/api/cyber/offering", { method: "POST", headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temple_slug: slug, type: "indung", name: name.trim(), wish: wish.trim(), contact: contact.trim(), amount: AMOUNT }) }); const result = await res.json(); if (result.kakaoText) setKakaoText(result.kakaoText)
    await fetchData(); setSubmitted(true); setLoading(false)
  }

  const accent = '#f0c060', accentRgb = '240,192,96'
  const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(${accentRgb},0.25)`, borderRadius: 8, padding: '10px 14px', color: 'rgba(255,220,120,0.9)', fontSize: 14, outline: 'none', width: '100%' }

  return (
    <div style={{ padding: '20px 20px 60px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ width: 120, height: 140, margin: '0 auto 8px', position: 'relative', animation: 'id-pulse 2s ease-in-out infinite alternate' }}>
          {/* 불꽃 */}
          <div style={{ position: 'absolute', top: -10, left: '46%', transform: 'translateX(-50%)', width: 16, height: 28, background: 'radial-gradient(ellipse at 50% 80%, rgba(255,220,80,1), rgba(255,160,30,0.9) 60%, transparent)', borderRadius: '50% 50% 40% 40%', boxShadow: '0 0 20px rgba(255,200,50,0.9), 0 0 40px rgba(255,180,40,0.4)', animation: 'id-flame 0.8s ease-in-out infinite alternate', zIndex: 2 }} />
          {/* 인등 */}
          <svg viewBox="0 0 44 50" style={{ width: '100%', height: '100%', marginTop: 20, filter: 'drop-shadow(0 0 16px rgba(255,200,50,0.6))' }}>
            <rect x="19" y="2" width="6" height="6" rx="1.5" fill="#d4c8a0" />
            <path d="M16 8 Q16 4 22 4 Q28 4 28 8 L30 16 Q32 20 32 24 L32 38 Q32 42 28 42 L16 42 Q12 42 12 38 L12 24 Q12 20 14 16 Z" fill="url(#idHeroGrad)" stroke="rgba(220,210,190,0.4)" strokeWidth="0.5" />
            <path d="M32 22 Q38 22 38 30 Q38 36 32 36" fill="none" stroke="#c8bda0" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="11" y="42" width="22" height="3" rx="1" fill="#b8a888" />
            <ellipse cx="20" cy="20" rx="4" ry="6" fill="rgba(255,255,255,0.15)" />
            <text x="22" y="30" textAnchor="middle" fill="rgba(100,70,30,0.6)" fontSize="6" fontWeight="700">{tName}</text>
            <defs><radialGradient id="idHeroGrad" cx="40%" cy="35%"><stop offset="0%" stopColor="#f0e8d8" /><stop offset="50%" stopColor="#ddd4c0" /><stop offset="100%" stopColor="#c8bda0" /></radialGradient></defs>
          </svg>
        </div>
        <style>{`@keyframes id-pulse { 0% { transform: scale(1); filter: drop-shadow(0 0 8px rgba(255,200,50,0.4)); } 100% { transform: scale(1.06); filter: drop-shadow(0 0 20px rgba(255,200,50,0.8)); } }`}</style>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: accent, letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>인등불사</h2>
        <p style={{ fontSize: 12, color: `rgba(${accentRgb},0.5)`, marginTop: 4 }}>인등을 밝혀 소원을 발원합니다</p>
      </div>

      {/* 차수 + 스와이프 네비 */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <span style={{ color: `rgba(${accentRgb},0.7)`, fontSize: 13 }}>전체 {items.length.toLocaleString()}등 점등</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <button onClick={() => setViewRound(Math.max(1, viewRound - 1))} disabled={viewRound <= 1} style={{ background: 'none', border: `1px solid rgba(${accentRgb},0.2)`, color: viewRound <= 1 ? `rgba(${accentRgb},0.2)` : accent, borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 13 }}>◂</button>
        <span style={{ color: accent, fontSize: 14, fontWeight: 600 }}>{viewRound}차 ({roundCount}/{PER_ROUND})</span>
        <button onClick={() => setViewRound(viewRound + 1)} style={{ background: 'none', border: `1px solid rgba(${accentRgb},0.2)`, color: accent, borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 13 }}>▸</button>
      </div>

      {/* 인등 격자 — 원형 */}
      <div onTouchStart={e => setTouchStartX(e.touches[0].clientX)} onTouchEnd={e => { const d = touchStartX - e.changedTouches[0].clientX; if (d > 50) setViewRound(viewRound + 1); else if (d < -50) setViewRound(Math.max(1, viewRound - 1)); }} style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 10, marginBottom: 20, position: 'relative' }}>
        {Array.from({ length: PER_ROUND }).map((_, i) => {
          const gi = roundStart + i, lit = gi < items.length, c = lit ? items[gi] : null
          return (
            <div key={i} onMouseEnter={e => c && setTooltip({ x: e.clientX, y: e.clientY, name: c.name, wish: c.wish || '', date: c.created_at })} onMouseLeave={() => setTooltip(null)} onClick={e => c && setTooltip({ x: e.clientX, y: e.clientY, name: c.name, wish: c.wish || "", date: c.created_at })}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2px 0' }}>
              {/* 불꽃 */}
              {lit && (
                <div style={{ width: 8, height: 14, background: 'radial-gradient(ellipse at 50% 80%, rgba(255,220,80,1), rgba(255,160,30,0.9) 60%, transparent)', borderRadius: '50% 50% 40% 40%', marginBottom: -2, filter: 'blur(0.5px)', boxShadow: '0 0 12px rgba(255,200,50,0.8), 0 0 24px rgba(255,180,40,0.4)', animation: 'id-flame 0.8s ease-in-out infinite alternate' }} />
              )}
              {/* 인등 SVG — 도자기 모형 */}
              <svg viewBox="0 0 44 50" style={{ width: '100%', maxWidth: 44, filter: lit ? 'drop-shadow(0 0 15px rgba(255,200,50,0.9)) drop-shadow(0 0 30px rgba(255,180,40,0.5))' : 'grayscale(1) opacity(0.12)' }}>
                {/* 심지 목 */}
                <rect x="19" y="2" width="6" height="6" rx="1.5" fill={lit ? '#d4c8a0' : '#888'} />
                {/* 어깨 (좁은 목에서 넓어지는 곡선) */}
                <path d="M16 8 Q16 4 22 4 Q28 4 28 8 L30 16 Q32 20 32 24 L32 38 Q32 42 28 42 L16 42 Q12 42 12 38 L12 24 Q12 20 14 16 Z"
                  fill={lit ? 'url(#idBodyGrad)' : '#666'} stroke={lit ? 'rgba(220,210,190,0.4)' : '#555'} strokeWidth="0.5" />
                {/* 손잡이 */}
                <path d="M32 22 Q38 22 38 30 Q38 36 32 36" fill="none" stroke={lit ? '#c8bda0' : '#666'} strokeWidth="2.5" strokeLinecap="round" />
                {/* 바닥 */}
                <rect x="11" y="42" width="22" height="3" rx="1" fill={lit ? '#b8a888' : '#555'} />
                {/* 하이라이트 */}
                <ellipse cx="20" cy="20" rx="4" ry="6" fill="rgba(255,255,255,0.15)" />
                {/* 이름 */}
                {lit && c && (
                  <text x="22" y="33" textAnchor="middle" fill="rgba(100,70,30,0.7)" fontSize="7" fontWeight="700">{c.name.slice(0, 3)}</text>
                )}
                <defs>
                  <radialGradient id="idBodyGrad" cx="40%" cy="35%">
                    <stop offset="0%" stopColor="#f0e8d8" />
                    <stop offset="50%" stopColor="#ddd4c0" />
                    <stop offset="100%" stopColor="#c8bda0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes id-flame { 0% { transform: scaleY(0.85) scaleX(0.9); opacity:0.8; } 100% { transform: scaleY(1.1) scaleX(1.05); opacity:1; } }`}</style>
      {tooltip && (
        <div style={{ position: 'fixed', left: tooltip.x + 10, top: tooltip.y - 50, background: 'rgba(12,4,28,0.97)', border: '1px solid rgba(240,192,96,0.4)', borderRadius: 8, padding: '8px 12px', pointerEvents: 'none', zIndex: 100 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,235,150,0.95)', fontWeight: 700 }}>{tooltip.name} 불자님</div>
          {tooltip.wish && <div style={{ fontSize: 11, color: "rgba(240,192,96,0.6)", marginTop: 2 }}>{tooltip.wish.slice(0, 30)}</div>}
          {tooltip.date && <div style={{ fontSize: 10, color: "rgba(240,192,96,0.35)", marginTop: 2 }}>{new Date(tooltip.date).toLocaleDateString("ko-KR")}</div>}
        </div>
      )}

      {/* 폼 */}
      {!submitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="성함 *" style={inp} />
          <textarea value={wish} onChange={e => setWish(e.target.value)} placeholder="발원문 (선택)" rows={2} style={{ ...inp, resize: 'none' }} />
          <input value={contact} onChange={e => setContact(e.target.value)} type="tel" placeholder="연락처 (010-0000-0000)" style={inp} />
          <div style={{ textAlign: 'center', padding: '6px 0' }}>
            <span style={{ color: `rgba(${accentRgb},0.95)`, fontSize: 15, fontWeight: 600 }}>인등 1년 10,000원</span>
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: 12, marginTop: 12, fontSize: 11, color: 'rgba(255,235,150,0.6)', lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700, marginBottom: 4, color: 'rgba(255,235,150,0.85)' }}>사업자 정보</div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2px 8px' }}>
              <span>상호</span><span>미래사</span>
              <span>대표</span><span>미래사 주지스님</span>
              <span>사업자번호</span><span>667-47-01068 (간이과세자)</span>
              <span>연락처</span><span>010-5145-5589</span>
              <span>이메일</span><span>miraesa108@gmail.com</span>
              <span>통신판매업</span><span>신고 면제 <span style={{ fontSize: 10, opacity: 0.7 }}>(공정위 고시 「통신판매업 신고 면제 기준」 · 간이과세자)</span></span>
            </div>
            <div style={{ marginTop: 6, fontSize: 10 }}>• 결제 전 <a href="/terms#refund" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,235,150,0.8)', textDecoration: 'underline' }}>환불 규정</a>을 확인해 주십시오.</div>
          </div>
          <div style={{ marginTop: 12, marginBottom: 8 }}>
            <ConsentCheckbox id="privacy-consent" required checked={agreedPrivacy} onChange={setAgreedPrivacy} label="개인정보 수집·이용에 동의합니다 (필수)" linkHref="/privacy" linkLabel="[전문 보기]" />
            <ConsentCheckbox id="terms-consent" required checked={agreedTerms} onChange={setAgreedTerms} label="이용약관에 동의합니다 (필수)" linkHref="/terms" linkLabel="[전문 보기]" />
          </div>
          <button onClick={handleSubmit} disabled={loading || !name.trim()} style={{ background: loading ? `rgba(${accentRgb},0.15)` : `rgba(${accentRgb},0.22)`, border: `1px solid rgba(${accentRgb},0.55)`, color: 'rgba(255,220,120,0.95)', borderRadius: 8, padding: 14, fontSize: 15, cursor: 'pointer', fontWeight: 500 }}>
            {loading ? '접수 중...' : '인등 신청하기'}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🕯</div>
          <p style={{ color: "rgba(255,235,150,0.95)", fontSize: 16, fontWeight: 500, lineHeight: 1.9 }}>인등이 점등되었습니다.</p>
          {kakaoText && <button onClick={() => { navigator.clipboard.writeText(kakaoText); alert("카카오톡에 붙여넣기하여 공유해 주세요.") }} style={{ marginTop: 10, background: "#FEE500", border: "none", color: "#3A1D1D", borderRadius: 8, padding: "8px 20px", fontSize: 13, cursor: "pointer", fontWeight: 700 }}>카카오톡 공유</button>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
            <button onClick={() => { setSubmitted(false); setName(''); setWish(''); setContact('') }} style={{ background: `rgba(${accentRgb},0.15)`, border: `1px solid rgba(${accentRgb},0.4)`, color: accent, borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 13 }}>추가 신청</button>
            <a href={`/${slug}/dharma-wheel?grid=1`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 20px', fontSize: 13, textDecoration: 'none' }}>☸ 도량으로</a>
          </div>
        </div>
      )}
    </div>
  )
}
