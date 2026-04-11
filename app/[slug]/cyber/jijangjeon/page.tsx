'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

const RELATIONS = ['부', '모', '조부', '조모', '배우자', '자녀', '형제자매', '기타']
const PER_ROUND = 5, MAX_ROUND = 40, TOTAL = 2000

interface Memorial { id: string; name: string; deceased: string; relationship: string; wish: string }

export default function JijangjeonPage() {
  const { slug } = useParams<{ slug: string }>()
  const [memorials, setMemorials] = useState<Memorial[]>([])
  const [name, setName] = useState('')
  const [deceased, setDeceased] = useState('')
  const [relationship, setRelationship] = useState('부')
  const [wish, setWish] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; deceased: string; name: string; rel: string } | null>(null)

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/cyber/offering?temple_slug=${slug}&type=memorial&limit=${TOTAL}`)
    const data = await res.json()
    if (Array.isArray(data)) setMemorials(data)
  }, [slug])

  useEffect(() => { fetchData() }, [fetchData])

  const currentRound = Math.min(MAX_ROUND, Math.floor(memorials.length / PER_ROUND) + 1)
  const roundStart = (currentRound - 1) * PER_ROUND
  const roundCount = Math.min(memorials.length - roundStart, PER_ROUND)
  const pct = Math.min(100, Math.round((memorials.length / TOTAL) * 100))

  const handleSubmit = async () => {
    if (!name.trim() || !deceased.trim()) return
    setLoading(true)
    await fetch('/api/cyber/offering', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temple_slug: slug, type: 'memorial', name: name.trim(), deceased: deceased.trim(), relationship, wish: wish.trim(), contact: contact.trim(), amount: 10000 }),
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
        <div style={{ fontSize: 48, marginBottom: 8 }}>🪷</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#d4b8ff', letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>지장전</h2>
        <p style={{ fontSize: 12, color: `rgba(${accentRgb},0.5)`, marginTop: 4 }}>조상 영가의 극락왕생을 발원합니다</p>
      </div>

      {/* 프로그레스 */}
      <div style={{ maxWidth: 480, margin: '0 auto 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ color: `rgba(${accentRgb},0.7)`, fontSize: 13, minWidth: 90, textAlign: 'right' }}>{memorials.length.toLocaleString()} / {TOTAL.toLocaleString()}</span>
          <div style={{ flex: 1, height: 6, background: `rgba(${accentRgb},0.1)`, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${accent},#c4a0f0)`, borderRadius: 3, transition: 'width 0.8s' }} />
          </div>
          <span style={{ color: `rgba(${accentRgb},0.7)`, fontSize: 13, minWidth: 32 }}>{pct}%</span>
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 12, color: `rgba(${accentRgb},0.5)`, marginBottom: 16 }}>{currentRound}차 ({roundCount} / {PER_ROUND})</p>

      {/* 위패 격자 — 현재 차수 5개 */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PER_ROUND}, 1fr)`, gap: 6, marginBottom: 24 }}>
        {Array.from({ length: PER_ROUND }).map((_, i) => {
          const gi = roundStart + i
          const lit = gi < memorials.length
          const m = lit ? memorials[gi] : null
          return (
            <div key={i}
              onMouseEnter={e => m && setTooltip({ x: e.clientX, y: e.clientY, deceased: m.deceased, name: m.name, rel: m.relationship })}
              onMouseLeave={() => setTooltip(null)}
              style={{
                background: lit ? 'rgba(139,90,43,0.25)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${lit ? 'rgba(139,90,43,0.4)' : 'rgba(255,255,255,0.04)'}`,
                borderRadius: 6, padding: '10px 4px', textAlign: 'center', minHeight: 80,
                boxShadow: lit ? '0 0 6px rgba(155,122,204,0.15)' : 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
              {lit ? (
                <>
                  <div style={{ fontSize: 11, color: 'rgba(240,223,160,0.85)', writingMode: 'vertical-rl', letterSpacing: 2, lineHeight: 1.3 }}>
                    {m!.deceased}
                  </div>
                  <div style={{ fontSize: 8, color: `rgba(${accentRgb},0.45)`, marginTop: 4 }}>{m!.relationship}</div>
                </>
              ) : (
                <div style={{ fontSize: 20, opacity: 0.1 }}>🪧</div>
              )}
            </div>
          )
        })}
      </div>

      {tooltip && (
        <div style={{ position: 'fixed', left: tooltip.x + 10, top: tooltip.y - 60, background: 'rgba(12,4,28,0.97)', border: `1px solid rgba(${accentRgb},0.4)`, borderRadius: 8, padding: '8px 12px', pointerEvents: 'none', zIndex: 100 }}>
          <div style={{ fontSize: 13, color: 'rgba(220,200,255,0.95)', fontWeight: 700 }}>{tooltip.deceased} 영가지위</div>
          <div style={{ fontSize: 11, color: `rgba(${accentRgb},0.6)`, marginTop: 2 }}>신청: {tooltip.name} ({tooltip.rel})</div>
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

      {memorials.length >= TOTAL && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ color: '#d4b8ff', fontSize: 16, fontWeight: 600 }}>✨ 2,000위패 원만봉안</p>
        </div>
      )}
    </div>
  )
}
