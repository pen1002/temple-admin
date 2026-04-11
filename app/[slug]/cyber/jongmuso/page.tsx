'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

const PRAYERS = [
  { id: 'PR-01', name: '초하루기도', icon: '🌙' },
  { id: 'PR-02', name: '백일기도', icon: '📿' },
  { id: 'PR-06', name: '49재', icon: '🪷' },
  { id: 'PR-07', name: '천도재', icon: '🕯' },
  { id: 'PR-08', name: '정초기도', icon: '🎍' },
  { id: 'PR-09', name: '산신기도', icon: '⛰' },
]
const PER_ROUND = 100, MAX_ROUND = 20, TOTAL = 2000, AMOUNT = 2000
const getMobileCols = () => typeof window !== 'undefined' && window.innerWidth < 480 ? 5 : 10

interface Donor { id: string; name: string; wish: string }

export default function JongmusoPage() {
  const { slug } = useParams<{ slug: string }>()
  const [selectedPrayer, setSelectedPrayer] = useState<typeof PRAYERS[0] | null>(null)
  const [items, setItems] = useState<Donor[]>([])
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [wish, setWish] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; wish: string } | null>(null)

  const fetchData = useCallback(async () => {
    if (!selectedPrayer) return
    const res = await fetch(`/api/cyber/offering?temple_slug=${slug}&type=prayer_${selectedPrayer.id}&limit=${TOTAL}`)
    const data = await res.json()
    if (Array.isArray(data)) setItems(data)
  }, [slug, selectedPrayer])

  useEffect(() => { if (selectedPrayer) fetchData() }, [fetchData, selectedPrayer])

  const currentRound = Math.min(MAX_ROUND, Math.floor(items.length / PER_ROUND) + 1)
  const roundStart = (currentRound - 1) * PER_ROUND
  const roundCount = Math.min(items.length - roundStart, PER_ROUND)
  const pct = Math.min(100, Math.round((items.length / TOTAL) * 100))

  const handleSubmit = async () => {
    if (!name.trim() || !selectedPrayer) return
    setLoading(true)
    await fetch('/api/cyber/offering', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temple_slug: slug, type: `prayer_${selectedPrayer.id}`, name: name.trim(), prayer_kind: selectedPrayer.id, wish: wish.trim(), contact: contact.trim(), amount: AMOUNT }),
    })
    await fetchData()
    setSubmitted(true)
    setLoading(false)
  }

  const accent = '#e8a050', accentRgb = '232,160,80'
  const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(${accentRgb},0.25)`, borderRadius: 8, padding: '10px 14px', color: 'rgba(255,220,120,0.9)', fontSize: 14, outline: 'none', width: '100%' }

  // 기도 선택 화면
  if (!selectedPrayer) {
    return (
      <div style={{ padding: 'clamp(16px,4vw,20px) 16px 60px', maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📿</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: accent, letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>종무소</h2>
          <p style={{ fontSize: 12, color: `rgba(${accentRgb},0.5)`, marginTop: 4 }}>기도를 접수하고 불사에 동참합니다</p>
          <p style={{ fontSize: 11, color: `rgba(${accentRgb},0.35)`, marginTop: 4 }}>각 기도 1년 2,000원 · 100등×20차 = 2,000등</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
          {PRAYERS.map(p => (
            <button key={p.id} onClick={() => { setSelectedPrayer(p); setSubmitted(false); setItems([]) }} style={{
              background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(${accentRgb},0.15)`, borderRadius: 10,
              padding: '18px 12px', cursor: 'pointer', textAlign: 'center',
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{p.icon}</div>
              <div style={{ fontSize: 14, color: accent, fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: `rgba(${accentRgb},0.45)` }}>1년 2,000원</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // 기도 상세 — 격자 + 폼
  return (
    <div style={{ padding: 'clamp(16px,4vw,20px) 16px 60px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 40, marginBottom: 6 }}>{selectedPrayer.icon}</div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: accent, letterSpacing: 2, fontFamily: '"Noto Serif KR",serif' }}>{selectedPrayer.name}</h2>
        <button onClick={() => { setSelectedPrayer(null); setSubmitted(false) }} style={{ marginTop: 8, background: 'none', border: `1px solid rgba(${accentRgb},0.25)`, color: `rgba(${accentRgb},0.6)`, borderRadius: 6, padding: '4px 14px', cursor: 'pointer', fontSize: 11 }}>← 다른 기도 선택</button>
      </div>

      {/* 프로그레스 */}
      <div style={{ maxWidth: 480, margin: '0 auto 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ color: `rgba(${accentRgb},0.7)`, fontSize: 13, minWidth: 90, textAlign: 'right' }}>{items.length.toLocaleString()} / {TOTAL.toLocaleString()}</span>
          <div style={{ flex: 1, height: 6, background: `rgba(${accentRgb},0.1)`, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${accent},#f6c860)`, borderRadius: 3, transition: 'width 0.8s' }} />
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

      {/* 격자 — 원형 기도등 */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${getMobileCols()}, 1fr)`, gap: 4, marginBottom: 20 }}>
        {Array.from({ length: PER_ROUND }).map((_, i) => {
          const gi = roundStart + i, lit = gi < items.length, c = lit ? items[gi] : null
          return (
            <div key={i}
              onMouseEnter={e => c && setTooltip({ x: e.clientX, y: e.clientY, name: c.name, wish: c.wish || '' })}
              onMouseLeave={() => setTooltip(null)}
              style={{
                aspectRatio: '1', borderRadius: '50%',
                background: lit ? `radial-gradient(circle, rgba(${accentRgb},0.25) 0%, rgba(${accentRgb},0.06) 70%)` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${lit ? `rgba(${accentRgb},0.3)` : 'rgba(255,255,255,0.04)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: lit ? `0 0 6px rgba(${accentRgb},0.2)` : 'none',
              }}>
              <div style={{
                width: '55%', height: '55%', borderRadius: '50%',
                background: lit ? `radial-gradient(circle at 40% 35%, rgba(255,230,180,0.9), rgba(${accentRgb},0.7) 60%)` : 'rgba(100,80,50,0.08)',
                boxShadow: lit ? `0 0 5px rgba(${accentRgb},0.4)` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {lit && <span style={{ fontSize: 7, color: 'rgba(100,60,10,0.8)', fontWeight: 700 }}>{c!.name.slice(0, 2)}</span>}
              </div>
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
          <input value={name} onChange={e => setName(e.target.value)} placeholder="신청자 성함 *" style={inp} />
          <input value={contact} onChange={e => setContact(e.target.value)} type="tel" placeholder="연락처 (010-0000-0000)" style={inp} />
          <textarea value={wish} onChange={e => setWish(e.target.value)} placeholder="발원문 (선택)" rows={3} style={{ ...inp, resize: 'none' }} />
          <div style={{ textAlign: 'center', padding: '4px 0' }}>
            <span style={{ color: `rgba(${accentRgb},0.95)`, fontSize: 15, fontWeight: 600 }}>{selectedPrayer.name} 1년 2,000원</span>
          </div>
          <div style={{ background: `rgba(${accentRgb},0.05)`, border: `1px solid rgba(${accentRgb},0.14)`, borderRadius: 8, padding: '13px 15px', fontSize: 13, color: `rgba(${accentRgb},0.75)`, lineHeight: 2.2 }}>
            시티은행 261-0359-626501 배연암
            <button onClick={() => { navigator.clipboard.writeText('261-0359-626501'); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
              style={{ marginLeft: 8, background: `rgba(${accentRgb},0.15)`, border: `1px solid rgba(${accentRgb},0.35)`, color: 'rgba(255,210,80,0.9)', borderRadius: 4, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}>
              {copied ? '복사됨' : '복사'}
            </button><br />
            <span style={{ fontSize: 11, color: `rgba(${accentRgb},0.38)` }}>입금자명을 신청자 성함과 동일하게 입금해 주세요.</span>
          </div>
          <button onClick={handleSubmit} disabled={loading || !name.trim()} style={{ background: loading ? `rgba(${accentRgb},0.15)` : `rgba(${accentRgb},0.22)`, border: `1px solid rgba(${accentRgb},0.55)`, color: 'rgba(255,220,120,0.95)', borderRadius: 8, padding: 14, fontSize: 15, cursor: 'pointer', fontWeight: 500 }}>
            {loading ? '접수 중...' : `${selectedPrayer.name} 접수하기`}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>{selectedPrayer.icon}</div>
          <p style={{ color: 'rgba(255,220,120,0.95)', fontSize: 16, fontWeight: 500, lineHeight: 1.9 }}>{selectedPrayer.name} 접수가 완료되었습니다.</p>
          <p style={{ color: `rgba(${accentRgb},0.5)`, fontSize: 13, marginTop: 8 }}>입금 확인 후 기도가 시작됩니다.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            <button onClick={() => { setSubmitted(false); setName(''); setWish(''); setContact('') }} style={{ background: `rgba(${accentRgb},0.15)`, border: `1px solid rgba(${accentRgb},0.4)`, color: 'rgba(255,220,120,0.9)', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 13 }}>추가 접수</button>
            <button onClick={() => { setSelectedPrayer(null); setSubmitted(false) }} style={{ background: `rgba(${accentRgb},0.1)`, border: `1px solid rgba(${accentRgb},0.3)`, color: `rgba(${accentRgb},0.7)`, borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontSize: 13 }}>다른 기도</button>
            <a href={`/${slug}/cyber`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 20px', fontSize: 13, textDecoration: 'none' }}>☸ 도량으로</a>
          </div>
        </div>
      )}

      {items.length >= TOTAL && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ color: accent, fontSize: 16, fontWeight: 600 }}>✨ {selectedPrayer.name} 2,000등 원만성취</p>
        </div>
      )}
    </div>
  )
}
