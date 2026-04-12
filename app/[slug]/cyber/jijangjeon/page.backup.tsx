'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

const RELATIONS = ['부', '모', '조부', '조모', '배우자', '자녀', '형제자매', '기타']
const PER_ROUND = 30, COLS = 5

interface Memorial { id: string; name: string; deceased: string; relationship: string; wish: string; created_at: string }

export default function JijangjeonPage() {
  const { slug } = useParams<{ slug: string }>()
  const [memorials, setMemorials] = useState<Memorial[]>([])
  const [name, setName] = useState('')
  const [deceased, setDeceased] = useState('')
  const [relationship, setRelationship] = useState('부')
  const [wish, setWish] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false); const [kakaoText, setKakaoText] = useState("")
  const [viewRound, setViewRound] = useState(1)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; deceased: string; name: string; rel: string; wish?: string; date?: string } | null>(null)

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/cyber/offering?temple_slug=${slug}&type=memorial&limit=10000`)
    const data = await res.json()
    if (Array.isArray(data)) setMemorials(data)
  }, [slug])

  useEffect(() => { fetchData() }, [fetchData])

  const totalRounds = Math.max(1, Math.ceil(memorials.length / PER_ROUND) + 1)
  const roundStart = (viewRound - 1) * PER_ROUND
  const roundCount = Math.min(Math.max(0, memorials.length - roundStart), PER_ROUND)

  const handleSubmit = async () => {
    if (!name.trim() || !deceased.trim()) return
    setLoading(true)
    await fetch('/api/cyber/offering', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temple_slug: slug, type: 'memorial', name: name.trim(), deceased: deceased.trim(), relationship, wish: wish.trim(), contact: contact.trim(), amount: 5000 }),
    })
    await fetchData()
    setSubmitted(true)
    setLoading(false)
  }

  const accent = '#9b7acc', accentRgb = '155,122,204'
  const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(${accentRgb},0.25)`, borderRadius: 8, padding: '10px 14px', color: 'rgba(220,200,255,0.9)', fontSize: 14, outline: 'none', width: '100%' }

  return (
    <div style={{ padding: 'clamp(16px,4vw,20px) 16px 60px', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 48, marginBottom: 8, animation: 'jj-float 3s ease-in-out infinite' }}>🪷</div>
        <style>{`@keyframes jj-float { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-6px) scale(1.05); } }`}</style>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#d4b8ff', letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>지장전</h2>
        <p style={{ fontSize: 12, color: `rgba(${accentRgb},0.5)`, marginTop: 4 }}>조상 영가의 극락왕생을 발원합니다</p>
        <p style={{ fontSize: 11, color: `rgba(${accentRgb},0.35)`, marginTop: 4 }}>위패 1위 봉안 1년 5,000원</p>
      </div>

      {/* 프로그레스 */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <span style={{ color: `rgba(${accentRgb},0.7)`, fontSize: 13 }}>전체 {memorials.length.toLocaleString()}위 봉안</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <button onClick={() => setViewRound(Math.max(1, viewRound - 1))} disabled={viewRound <= 1} style={{ background: 'none', border: `1px solid rgba(${accentRgb},0.2)`, color: viewRound <= 1 ? `rgba(${accentRgb},0.2)` : accent, borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 13 }}>◂</button>
        <span style={{ color: accent, fontSize: 14, fontWeight: 600 }}>{viewRound}차 ({roundCount}/{PER_ROUND})</span>
        <button onClick={() => setViewRound(viewRound + 1)} style={{ background: 'none', border: `1px solid rgba(${accentRgb},0.2)`, color: accent, borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontSize: 13 }}>▸</button>
      </div>

      {/* 위패 격자 — 현재 차수 50위 (10×5) */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 5, marginBottom: 24 }}>
        {Array.from({ length: PER_ROUND }).map((_, i) => {
          const gi = roundStart + i
          const lit = gi < memorials.length
          const m = lit ? memorials[gi] : null
          return (
            <div key={i}
              onMouseEnter={e => m && setTooltip({ x: e.clientX, y: e.clientY, deceased: m.deceased, name: m.name, rel: m.relationship, wish: m.wish || '', date: m.created_at })}
              onMouseLeave={() => setTooltip(null)} onClick={e => m && setTooltip({ x: e.clientX, y: e.clientY, deceased: m.deceased, name: m.name, rel: m.relationship, wish: m.wish || "", date: m.created_at })}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2px 0' }}>
              {/* 광배 */}
              {lit && (
                <div style={{ position: 'absolute', top: -2, left: '50%', transform: 'translateX(-50%)', width: '120%', height: '80%', background: 'radial-gradient(ellipse at 50% 40%, rgba(212,184,255,0.3) 0%, rgba(201,168,76,0.1) 50%, transparent 75%)', borderRadius: '50%', animation: 'jj-glow 3s ease-in-out infinite alternate', pointerEvents: 'none' }} />
              )}
              {/* 위패 본체 — CSS로 그린 위패 모형 */}
              <svg viewBox="0 0 40 70" style={{ width: '100%', maxWidth: 40, position: 'relative', zIndex: 1, filter: lit ? 'drop-shadow(0 0 4px rgba(212,184,255,0.3))' : 'grayscale(1) opacity(0.15)' }}>
                {/* 검정 받침대 */}
                <rect x="4" y="60" width="32" height="8" rx="1.5" fill={lit ? '#1a1a2e' : '#222'} stroke={lit ? '#c9a84c' : '#333'} strokeWidth="0.5" />
                {/* 받침 다리 곡선 */}
                <path d="M8 68 Q6 70 4 70 L4 68 Z" fill={lit ? '#c9a84c' : '#444'} />
                <path d="M32 68 Q34 70 36 70 L36 68 Z" fill={lit ? '#c9a84c' : '#444'} />
                {/* 연꽃 대좌 */}
                <ellipse cx="20" cy="58" rx="14" ry="4" fill={lit ? '#e8a88c' : '#555'} />
                <path d="M8 56 Q11 52 14 56" fill={lit ? '#f0b8a0' : '#555'} />
                <path d="M12 56 Q15 51 18 56" fill={lit ? '#e8a088' : '#555'} />
                <path d="M16 56 Q19 50 22 56" fill={lit ? '#f0b8a0' : '#555'} />
                <path d="M20 56 Q23 51 26 56" fill={lit ? '#e8a088' : '#555'} />
                <path d="M24 56 Q27 52 30 56" fill={lit ? '#f0b8a0' : '#555'} />
                <ellipse cx="20" cy="56" rx="13" ry="2.5" fill={lit ? '#d4956c' : '#444'} opacity="0.5" />
                {/* 위패 몸통 — 상단 아치형 */}
                <path d="M11 54 L11 16 Q11 6 20 6 Q29 6 29 16 L29 54 Z" fill={lit ? '#2a1a10' : '#1a1a1a'} stroke={lit ? '#c9a84c' : '#333'} strokeWidth="0.8" />
                {/* 금테 안쪽 선 */}
                <path d="M13 52 L13 18 Q13 9 20 9 Q27 9 27 18 L27 52 Z" fill="none" stroke={lit ? 'rgba(201,168,76,0.5)' : '#333'} strokeWidth="0.4" />
                {/* 영가 존함 (세로) */}
                {lit && m && (
                  <text x="20" y="34" textAnchor="middle" fill="#c9a84c" fontSize="7" fontWeight="700" writingMode="tb" style={{ textShadow: '0 0 4px rgba(201,168,76,0.5)' }}>
                    {m.deceased.slice(0, 4)}
                  </text>
                )}
              </svg>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes jj-glow { 0% { opacity: 0.5; } 100% { opacity: 1; } }`}</style>

      {tooltip && (
        <div style={{ position: 'fixed', left: tooltip.x + 10, top: tooltip.y - 60, background: 'rgba(12,4,28,0.97)', border: `1px solid rgba(${accentRgb},0.4)`, borderRadius: 8, padding: '8px 12px', pointerEvents: 'none', zIndex: 100 }}>
          <div style={{ fontSize: 13, color: 'rgba(220,200,255,0.95)', fontWeight: 700 }}>{tooltip.deceased} 영가지위</div>
          <div style={{ fontSize: 11, color: `rgba(${accentRgb},0.6)`, marginTop: 2 }}>신청: {tooltip.name} ({tooltip.rel})</div>
          {tooltip.wish && <div style={{ fontSize: 10, color: `rgba(${accentRgb},0.45)`, marginTop: 2 }}>{tooltip.wish.slice(0, 30)}</div>}
          {tooltip.date && <div style={{ fontSize: 10, color: `rgba(${accentRgb},0.3)`, marginTop: 2 }}>{new Date(tooltip.date).toLocaleDateString('ko-KR')}</div>}
        </div>
      )}

      {/* 폼 */}
      {!submitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="신청자 성함 *" style={inp} />
          <input value={deceased} onChange={e => setDeceased(e.target.value)} placeholder="영가 존함 *" style={inp} />
          <select value={relationship} onChange={e => setRelationship(e.target.value)} style={{ ...inp, appearance: 'none' }}>
            {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <textarea value={wish} onChange={e => setWish(e.target.value)} placeholder="발원문 (선택)" rows={3} style={{ ...inp, resize: 'none' }} />
          <input value={contact} onChange={e => setContact(e.target.value)} type="tel" placeholder="연락처 (010-0000-0000)" style={inp} />
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <span style={{ color: 'rgba(220,200,255,0.95)', fontSize: 15, fontWeight: 600 }}>위패 1위 봉안 1년 5,000원</span>
          </div>
          <button onClick={handleSubmit} disabled={loading || !name.trim() || !deceased.trim()} style={{ background: loading ? `rgba(${accentRgb},0.15)` : `rgba(${accentRgb},0.25)`, border: `1px solid rgba(${accentRgb},0.5)`, color: 'rgba(220,200,255,0.95)', borderRadius: 8, padding: 14, fontSize: 15, cursor: 'pointer', fontWeight: 500 }}>
            {loading ? '접수 중...' : '위패 봉안 신청'}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🪷</div>
          <p style={{ color: 'rgba(220,200,255,0.95)', fontSize: 16, fontWeight: 500, lineHeight: 1.9 }}>위패가 봉안되었습니다.</p>
          <p style={{ color: `rgba(${accentRgb},0.5)`, fontSize: 13, marginTop: 8 }}>조상 영가의 극락왕생을 기원합니다.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            <button onClick={() => { setSubmitted(false); setName(''); setDeceased(''); setWish(''); setContact('') }} style={{ background: `rgba(${accentRgb},0.15)`, border: `1px solid rgba(${accentRgb},0.4)`, color: 'rgba(220,200,255,0.9)', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 13 }}>추가 봉안</button>
            <a href={`/${slug}/cyber`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 20px', fontSize: 13, textDecoration: 'none' }}>☸ 도량으로</a>
          </div>
        </div>
      )}

      {false && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ color: '#d4b8ff', fontSize: 16, fontWeight: 600 }}>✨ 2,000위패 원만봉안</p>
        </div>
      )}
    </div>
  )
}
