'use client'
import { useEffect, useState, useRef, useCallback } from 'react'

interface Donor {
  id: string; name: string; wish: string
  lantern_count: number; bank_confirmed: boolean
  created_at: string; phase: number
}
interface Props {
  config?: Record<string, unknown>
  templeSlug?: string
  templeName?: string
  bankInfo?: string
  currentPhase?: number
}

const WISHES = [
  '가족 모두 건강하고 행복하기를 발원합니다',
  '선망 부모님의 극락왕생을 발원합니다',
  '자녀들의 학업성취를 발원합니다',
  '모든 중생이 고통에서 벗어나기를 원합니다',
  '부처님 법 안에서 늘 평화롭기를 발원합니다',
  '사업 번창과 가정 화목을 발원합니다',
]

const BANK_INFO = `농협 351-0950-2778-43 천관사\n우체국 500678-01-001511 천관사`
const MAX_PHASE = 1000

export default function L01IndungBlock({
  config,
  templeSlug,
  templeName,
  bankInfo,
  currentPhase = 1,
}: Props) {
  const slug = (config?.templeSlug as string) || templeSlug || 'cheongwansa'
  const tName = (config?.templeName as string) || templeName || '천관사'
  const bank = (config?.bankInfo as string) || bankInfo || BANK_INFO
  const phase = (config?.currentPhase as number) || currentPhase

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | undefined>(undefined)
  const tickRef = useRef(0)
  const [donors, setDonors] = useState<Donor[]>([])
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [amount, setAmount] = useState(10000)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null)
  const [copyDone, setCopyDone] = useState(false)

  const fetchDonors = useCallback(async () => {
    try {
      const res = await fetch(`/api/indung?temple_slug=${slug}&phase=${phase}`)
      const data = await res.json()
      if (Array.isArray(data)) setDonors(data)
    } catch {}
  }, [slug, phase])

  useEffect(() => { fetchDonors() }, [fetchDonors])

  const handleSubmit = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      const lc = amount >= 70000 ? 7 : amount >= 30000 ? 3 : 1
      await fetch('/api/indung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temple_slug: slug, name: name.trim(),
          wish: wish.trim() || WISHES[donors.length % WISHES.length],
          amount, lantern_count: lc, phase,
        }),
      })
      await fetchDonors()
      setSubmitted(true)
    } catch {}
    setLoading(false)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyDone(true); setTimeout(() => setCopyDone(false), 2000)
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const COLS = 40, ROWS = 25
    const PX = 0.02, PY = 0.04
    const CW = (1 - PX * 2) / COLS, CH = (1 - PY * 2) / ROWS

    const resize = () => {
      const r = canvas.parentElement!.getBoundingClientRect()
      canvas.width = r.width * dpr; canvas.height = 360 * dpr
      canvas.style.width = r.width + 'px'; canvas.style.height = '360px'
    }
    resize(); window.addEventListener('resize', resize)

    const slots = Array.from({ length: COLS * ROWS }, (_, i) => ({
      bx: PX + (i % COLS) * CW + CW * 0.5,
      by: PY + Math.floor(i / COLS) * CH + CH * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.9,
      hue: 26 + Math.random() * 28,
      swayAmp: (Math.random() - 0.5) * 0.003,
      swayFreq: 0.3 + Math.random() * 0.5,
    }))

    const draw = (ts: number) => {
      tickRef.current = ts * 0.001
      const t = tickRef.current
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#030108'; ctx.fillRect(0, 0, W, H)
      const r = Math.min(CW * W, CH * H) * 0.4

      donors.forEach((d, i) => {
        if (i >= slots.length) return
        const s = slots[i]
        const px = (s.bx + Math.sin(t * s.swayFreq + s.phase) * s.swayAmp) * W
        const py = (s.by + Math.sin(t * s.speed * 0.25 + s.phase) * 0.002) * H
        const br = 0.82 + 0.18 * Math.sin(t * 8.5 + s.phase)

        const glow = ctx.createRadialGradient(px, py, 0, px, py, r * 3)
        glow.addColorStop(0, `hsla(${s.hue},95%,78%,${0.22 * br})`)
        glow.addColorStop(1, `hsla(${s.hue},80%,50%,0)`)
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(px, py, r * 3, 0, Math.PI * 2); ctx.fill()

        ctx.save(); ctx.translate(px, py); ctx.scale(1, 1.55)
        const bg = ctx.createRadialGradient(0, -r * 0.2, 0, 0, 0, r)
        bg.addColorStop(0, `hsla(${s.hue + 15},100%,93%,${br})`)
        bg.addColorStop(0.5, `hsla(${s.hue},88%,62%,${br})`)
        bg.addColorStop(1, `hsla(${s.hue - 12},78%,32%,${br})`)
        ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill()
        ctx.restore()

        ctx.strokeStyle = `hsla(${s.hue},75%,68%,${br * 0.5})`
        ctx.lineWidth = 0.8
        ctx.beginPath(); ctx.moveTo(px, py + r * 1.6); ctx.lineTo(px, py + r * 2.5); ctx.stroke()

        if (r > 5) {
          ctx.save()
          ctx.font = `${Math.max(8, r * 0.85)}px 'Apple SD Gothic Neo',sans-serif`
          ctx.fillStyle = `hsla(30,50%,18%,${br * 0.8})`
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          ctx.fillText(d.name.slice(0, 2), px, py)
          ctx.restore()
        }
      })

      if (donors.length >= MAX_PHASE) {
        ctx.fillStyle = `rgba(255,200,80,${0.04 + 0.03 * Math.sin(t * 3)})`
        ctx.fillRect(0, 0, W, H)
        ctx.save()
        ctx.font = `bold ${Math.round(18 * dpr)}px 'Apple SD Gothic Neo',sans-serif`
        ctx.fillStyle = `rgba(255,235,150,${0.7 + 0.3 * Math.sin(t * 2)})`
        ctx.textAlign = 'center'
        ctx.shadowColor = 'rgba(255,180,50,0.9)'; ctx.shadowBlur = 14 * dpr
        ctx.fillText(`${phase}차 1,000등 원만성취`, W / 2, H * 0.1)
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(draw)
    }
    animRef.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current !== undefined) cancelAnimationFrame(animRef.current)
    }
  }, [donors, phase])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const mx = (e.clientX - rect.left) / rect.width
    const my = (e.clientY - rect.top) / rect.height
    const COLS = 40, PX = 0.02, PY = 0.04
    const CW = (1 - PX * 2) / COLS, CH = (1 - PY * 2) / 25
    let best: Donor | null = null, bestD = 99
    donors.forEach((d, i) => {
      const bx = PX + (i % COLS) * CW + CW * 0.5
      const by = PY + Math.floor(i / COLS) * CH + CH * 0.5
      const dist = Math.sqrt((bx - mx) ** 2 + (by - my) ** 2)
      if (dist < bestD && dist < CW * 1.4) { bestD = dist; best = d }
    })
    if (best) setSelectedDonor(best)
  }

  const st = { fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }
  const inp: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,200,80,0.25)',
    borderRadius: 8, padding: '10px 14px', color: 'rgba(255,220,120,0.9)',
    fontSize: 14, outline: 'none', width: '100%',
  }

  return (
    <section style={{ background: '#08030f', padding: '36px 0', borderRadius: 12, ...st }}>
      <h2 style={{ color: 'rgba(255,235,150,0.9)', textAlign: 'center', fontSize: 22, fontWeight: 500, marginBottom: 4 }}>
        {tName} 인등불사 {phase}차
      </h2>
      <p style={{ color: 'rgba(255,200,80,0.5)', textAlign: 'center', fontSize: 13, marginBottom: 6 }}>
        점등 {donors.length.toLocaleString()} / 1,000 · 인등을 클릭하면 발원문을 볼 수 있습니다
      </p>
      <div style={{ width: '100%', maxWidth: 700, margin: '0 auto', height: 12, background: 'rgba(255,200,80,0.08)', borderRadius: 6, overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ height: '100%', width: `${Math.min(100, (donors.length / MAX_PHASE) * 100).toFixed(1)}%`, background: 'rgba(255,180,50,0.5)', borderRadius: 6, transition: 'width 0.5s' }} />
      </div>

      <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
        <canvas ref={canvasRef} onClick={handleCanvasClick} style={{ cursor: 'pointer', display: 'block', borderRadius: 8 }} />
        {selectedDonor && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}
            onClick={() => setSelectedDonor(null)}>
            <div style={{ background: '#1a0d2e', border: '1px solid rgba(255,200,80,0.4)', borderRadius: 12, padding: '24px 28px', maxWidth: 280, textAlign: 'center' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🕯</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,235,150,0.95)', marginBottom: 4, letterSpacing: 2 }}>{selectedDonor.name} 보살</div>
              <div style={{ fontSize: 11, color: 'rgba(255,200,80,0.4)', marginBottom: 14 }}>
                {new Date(selectedDonor.created_at).toLocaleDateString('ko-KR')} 점등 · {phase}차
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,220,140,0.82)', lineHeight: 1.9, borderTop: '1px solid rgba(255,200,80,0.15)', paddingTop: 12, wordBreak: 'keep-all' }}>
                {selectedDonor.wish}
              </div>
              <button onClick={() => setSelectedDonor(null)} style={{ marginTop: 16, background: 'rgba(255,180,50,0.15)', border: '1px solid rgba(255,180,50,0.4)', color: 'rgba(255,220,100,0.9)', borderRadius: 6, padding: '6px 20px', cursor: 'pointer', fontSize: 13 }}>닫기</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 480, margin: '28px auto 0', padding: '0 20px' }}>
        {!submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="성함을 입력하세요" style={inp} />
            <textarea value={wish} onChange={e => setWish(e.target.value)} placeholder="발원문 (예: 가족 모두 건강하기를...)" rows={3}
              style={{ ...inp, resize: 'none' }} />
            <select value={amount} onChange={e => setAmount(Number(e.target.value))} style={inp}>
              <option value={10000}>인등 1구 — 1만원</option>
              <option value={30000}>인등 3구 — 3만원</option>
              <option value={70000}>인등 7구 — 7만원</option>
            </select>
            <div style={{ background: 'rgba(255,200,80,0.06)', border: '1px solid rgba(255,200,80,0.18)', borderRadius: 8, padding: '14px 16px', fontSize: 13, color: 'rgba(255,200,80,0.75)', lineHeight: 2 }}>
              농협 351-0950-2778-43 천관사
              <button onClick={() => handleCopy('351-0950-2778-43')} style={{ marginLeft: 8, background: 'rgba(255,180,50,0.15)', border: '1px solid rgba(255,180,50,0.35)', color: 'rgba(255,210,80,0.9)', borderRadius: 4, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}>
                {copyDone ? '복사됨' : '복사'}
              </button>
              <br/>우체국 500678-01-001511 천관사<br/>
              <span style={{ fontSize: 11, color: 'rgba(255,200,80,0.45)' }}>입금자명을 신청자 성함과 동일하게 입금해 주세요.</span>
            </div>
            <button onClick={handleSubmit} disabled={loading || !name.trim()}
              style={{ background: loading ? 'rgba(80,60,30,0.3)' : 'rgba(255,180,50,0.22)', border: '1px solid rgba(255,180,50,0.55)', color: 'rgba(255,220,100,0.95)', borderRadius: 8, padding: 14, fontSize: 15, cursor: 'pointer', fontWeight: 500 }}>
              {loading ? '접수 중...' : '인등 신청하기'}
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 42, marginBottom: 14 }}>🕯</div>
            <p style={{ color: 'rgba(255,235,150,0.95)', fontSize: 16, fontWeight: 500, marginBottom: 10, lineHeight: 1.8, wordBreak: 'keep-all' }}>
              당신의 소원이 인등공양을 통해<br/>성취되기를 기도합니다.
            </p>
            <p style={{ color: 'rgba(255,200,80,0.5)', fontSize: 13, marginBottom: 22, lineHeight: 1.8 }}>
              입금 확인 후 {tName} 법당에<br/>인등이 점등됩니다.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => {
                const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
                const shareText = `${tName} 인등불사에 동참했습니다.\n함께 소원을 빌어요.\n\n${shareUrl}`
                navigator.clipboard.writeText(shareText).then(() => {
                  alert('링크가 복사되었습니다.\n카카오톡에 붙여넣기하여 공유해 주세요.')
                })
              }} style={{ background: '#FEE500', border: 'none', color: '#3A1D1D', borderRadius: 8, padding: '10px 22px', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
                링크 복사 후 카톡 공유
              </button>
              <button onClick={() => { setSubmitted(false); setName(''); setWish('') }}
                style={{ background: 'rgba(255,180,50,0.15)', border: '1px solid rgba(255,180,50,0.4)', color: 'rgba(255,220,100,0.9)', borderRadius: 8, padding: '10px 22px', fontSize: 13, cursor: 'pointer' }}>
                추가 신청
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
