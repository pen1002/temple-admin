'use client'
import { useEffect, useState, useRef, useCallback } from 'react'

interface Donor {
  id: string; name: string; wish: string
  lantern_count: number; created_at: string; phase: number
}
interface Props { config?: Record<string, unknown> }

const WISHES_DEFAULT = [
  '가족 모두 건강하고 행복하기를 발원합니다',
  '선망 부모님의 극락왕생을 발원합니다',
  '자녀들의 학업성취를 발원합니다',
  '모든 중생이 고통에서 벗어나기를 원합니다',
  '부처님 법 안에서 늘 평화롭기를 발원합니다',
  '사업 번창과 가정 화목을 발원합니다',
]
const COLS = 50
const MAX = 1000
const PRICE_PER = 30000

export default function H12IndungHero({ config }: Props) {
  const slug = (config?.templeSlug as string) || 'cheongwansa'
  const tName = (config?.templeName as string) || '천관사'
  const phase = (config?.currentPhase as number) || 1

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number | undefined>(undefined)
  const slotsRef = useRef<{
    bx:number; by:number; phase:number; speed:number
    hue:number; swayAmp:number; swayFreq:number
  }[]>([])
  const donorsRef = useRef<Donor[]>([])

  const [donors, setDonors] = useState<Donor[]>([])
  const [tooltip, setTooltip] = useState<{x:number;y:number;donor:Donor}|null>(null)
  const [selected, setSelected] = useState<Donor|null>(null)
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [lanternCount, setLanternCount] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<'nh'|'post'|null>(null)

  const ROWS = Math.ceil(MAX / COLS)
  const CANVAS_H = ROWS * 22 + 40
  const totalAmount = lanternCount * PRICE_PER

  const fetchDonors = useCallback(async () => {
    try {
      const res = await fetch(`/api/indung?temple_slug=${slug}&phase=${phase}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setDonors(data)
        donorsRef.current = data
      }
    } catch {}
  }, [slug, phase])

  useEffect(() => { fetchDonors() }, [fetchDonors])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const W_CSS = container.getBoundingClientRect().width
    canvas.width = W_CSS * dpr
    canvas.height = CANVAS_H * dpr
    canvas.style.width = W_CSS + 'px'
    canvas.style.height = CANVAS_H + 'px'

    const PX = 0.015, PY = 0.02
    const CW = (1 - PX * 2) / COLS
    const CH = (1 - PY * 2) / ROWS

    slotsRef.current = Array.from({ length: MAX }, (_, i) => ({
      bx: PX + (i % COLS) * CW + CW * 0.5,
      by: PY + Math.floor(i / COLS) * CH + CH * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.8,
      hue: 26 + Math.random() * 28,
      swayAmp: (Math.random() - 0.5) * 0.002,
      swayFreq: 0.3 + Math.random() * 0.5,
    }))

    const draw = (ts: number) => {
      const t = ts * 0.001
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#030108'
      ctx.fillRect(0, 0, W, H)

      const r = Math.min(CW * W, CH * H) * 0.38
      const cur = donorsRef.current

      for (let i = 0; i < MAX; i++) {
        const s = slotsRef.current[i]
        if (!s) continue
        const isLit = i < cur.length
        const px = (s.bx + Math.sin(t * s.swayFreq + s.phase) * s.swayAmp) * W
        const py = (s.by + Math.sin(t * s.speed * 0.2 + s.phase) * 0.001) * H

        if (!isLit) {
          ctx.beginPath()
          ctx.arc(px, py, r * 0.3, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,200,80,0.05)'
          ctx.fill()
          continue
        }

        const br = 0.82 + 0.18 * Math.sin(t * 8.5 + s.phase)
        const glow = ctx.createRadialGradient(px, py, 0, px, py, r * 2.8)
        glow.addColorStop(0, `hsla(${s.hue},95%,78%,${0.25*br})`)
        glow.addColorStop(1, `hsla(${s.hue},80%,50%,0)`)
        ctx.fillStyle = glow
        ctx.beginPath(); ctx.arc(px, py, r*2.8, 0, Math.PI*2); ctx.fill()

        ctx.save(); ctx.translate(px, py); ctx.scale(1, 1.5)
        const bg = ctx.createRadialGradient(0, -r*0.15, 0, 0, 0, r)
        bg.addColorStop(0, `hsla(${s.hue+15},100%,93%,${br})`)
        bg.addColorStop(0.5, `hsla(${s.hue},88%,62%,${br})`)
        bg.addColorStop(1, `hsla(${s.hue-12},78%,32%,${br})`)
        ctx.fillStyle = bg
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2); ctx.fill()
        ctx.restore()

        ctx.strokeStyle = `hsla(${s.hue},75%,68%,${br*0.45})`
        ctx.lineWidth = 0.6
        ctx.beginPath()
        ctx.moveTo(px, py + r*1.55)
        ctx.lineTo(px, py + r*2.3)
        ctx.stroke()

        if (r > 5) {
          ctx.save()
          ctx.font = `${Math.max(7, r*0.82)}px 'Apple SD Gothic Neo',sans-serif`
          ctx.fillStyle = `hsla(30,50%,18%,${br*0.8})`
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          ctx.fillText(cur[i].name.slice(0, 2), px, py)
          ctx.restore()
        }
      }

      if (cur.length >= MAX) {
        ctx.fillStyle = `rgba(255,200,80,${0.04+0.03*Math.sin(t*3)})`
        ctx.fillRect(0, 0, W, H)
        ctx.save()
        ctx.font = `bold ${Math.round(20*dpr)}px 'Apple SD Gothic Neo',sans-serif`
        ctx.fillStyle = `rgba(255,235,150,${0.7+0.3*Math.sin(t*2)})`
        ctx.textAlign = 'center'
        ctx.shadowColor = 'rgba(255,180,50,0.9)'; ctx.shadowBlur = 14*dpr
        ctx.fillText(`${phase}차 1,000등 원만성취`, W/2, H*0.06)
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(draw)
    }
    animRef.current = requestAnimationFrame(draw)
    return () => { if (animRef.current !== undefined) cancelAnimationFrame(animRef.current) }
  }, [ROWS, CANVAS_H, phase])

  useEffect(() => { donorsRef.current = donors }, [donors])

  const getSlotIdx = (mx: number, my: number, cw: number, ch: number) => {
    const PX = 0.015, PY = 0.02
    const CW = (1 - PX*2) / COLS
    let best = -1, bestD = 99
    for (let i = 0; i < donorsRef.current.length; i++) {
      const s = slotsRef.current[i]
      if (!s) continue
      const dx = s.bx - mx/cw, dy = s.by - my/ch
      const d = Math.sqrt(dx*dx + dy*dy)
      if (d < bestD && d < CW*1.5) { bestD = d; best = i }
    }
    return best
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    const idx = getSlotIdx(mx, my, rect.width, rect.height)
    if (idx >= 0) setTooltip({ x: mx, y: my, donor: donorsRef.current[idx] })
    else setTooltip(null)
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const idx = getSlotIdx(e.clientX-rect.left, e.clientY-rect.top, rect.width, rect.height)
    if (idx >= 0) { setSelected(donorsRef.current[idx]); setTooltip(null) }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const t = e.touches[0]
    const idx = getSlotIdx(t.clientX-rect.left, t.clientY-rect.top, rect.width, rect.height)
    if (idx >= 0) setTooltip({ x: t.clientX-rect.left, y: t.clientY-rect.top, donor: donorsRef.current[idx] })
    else setTooltip(null)
  }

  const handleSubmit = async () => {
    if (!name.trim()) return
    setLoading(true)
    try {
      await fetch('/api/indung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          temple_slug: slug,
          name: name.trim(),
          wish: wish.trim() || WISHES_DEFAULT[donors.length % WISHES_DEFAULT.length],
          lantern_count: lanternCount,
          phase,
        }),
      })
      await fetchDonors()
      setSubmitted(true)
    } catch {}
    setLoading(false)
  }

  const copyText = (text: string, key: 'nh'|'post') => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key); setTimeout(() => setCopied(null), 2000)
    })
  }

  const shareKakao = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const text = `${tName} 삼천인등 ${phase}차 불사에 동참했습니다.\n\n함께 소원을 빌어요 🕯\n${url}`
    navigator.clipboard.writeText(text).then(() =>
      alert('링크가 복사되었습니다.\n카카오톡에 붙여넣기하여 공유해 주세요.')
    )
  }

  const pct = Math.min(100, Math.round((donors.length / MAX) * 100))
  const sf = { fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }
  const inp: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,200,80,0.25)',
    borderRadius: 8, padding: '11px 14px',
    color: 'rgba(255,220,120,0.9)',
    fontSize: 14, outline: 'none', width: '100%',
  }
  const contW = containerRef.current?.offsetWidth || 600

  return (
    <section style={{ background: '#030108', paddingBottom: 56, ...sf }}>

      <div style={{ textAlign: 'center', padding: '36px 20px 16px' }}>
        <p style={{ color: 'rgba(255,200,80,0.45)', fontSize: 12, letterSpacing: 4, marginBottom: 8 }}>
          {phase}차 인등불사 · 1구 30,000원 · 1년 점등
        </p>
        <h1 style={{ color: 'rgba(255,235,150,0.95)', fontSize: 28, fontWeight: 500, marginBottom: 16, letterSpacing: 3 }}>
          {tName} 삼천인등
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 520, margin: '0 auto 6px' }}>
          <span style={{ color: 'rgba(255,200,80,0.7)', fontSize: 13, minWidth: 90, textAlign: 'right' }}>
            {donors.length.toLocaleString()} / {MAX.toLocaleString()}
          </span>
          <div style={{ flex: 1, height: 8, background: 'rgba(255,200,80,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,rgba(255,150,30,0.7),rgba(255,220,80,0.8))', borderRadius: 4, transition: 'width 0.8s' }} />
          </div>
          <span style={{ color: 'rgba(255,200,80,0.7)', fontSize: 13, minWidth: 36 }}>{pct}%</span>
        </div>
        <p style={{ color: 'rgba(255,200,80,0.3)', fontSize: 11 }}>
          인등 위에 마우스를 올리면 동참자 이름이 나타납니다 · 클릭하면 발원문을 볼 수 있습니다
        </p>
      </div>

      <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: 960, margin: '0 auto' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', cursor: 'pointer' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
          onClick={handleClick}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setTooltip(null)}
        />

        {tooltip && (
          <div style={{
            position: 'absolute',
            left: Math.min(tooltip.x + 14, contW - 170),
            top: Math.max(tooltip.y - 60, 8),
            background: 'rgba(15,6,30,0.97)',
            border: '1px solid rgba(255,200,80,0.45)',
            borderRadius: 8, padding: '9px 15px',
            pointerEvents: 'none', zIndex: 20, minWidth: 150,
          }}>
            <div style={{ color: 'rgba(255,235,150,0.95)', fontSize: 14, fontWeight: 700, marginBottom: 3 }}>
              {tooltip.donor.name} 보살
            </div>
            <div style={{ color: 'rgba(255,200,80,0.6)', fontSize: 11, lineHeight: 1.5 }}>
              {(tooltip.donor.wish||'').slice(0,26)}{(tooltip.donor.wish?.length||0)>26?'…':''}
            </div>
            <div style={{ color: 'rgba(255,200,80,0.35)', fontSize: 10, marginTop: 3 }}>
              인등 {tooltip.donor.lantern_count}구
            </div>
          </div>
        )}

        {selected && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}
            onClick={() => setSelected(null)}>
            <div style={{ background: '#1a0d2e', border: '1px solid rgba(255,200,80,0.4)', borderRadius: 14, padding: '28px 32px', maxWidth: 300, width: '88%', textAlign: 'center' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🕯</div>
              <div style={{ fontSize: 21, fontWeight: 700, color: 'rgba(255,235,150,0.95)', letterSpacing: 2, marginBottom: 4 }}>
                {selected.name} 보살
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,200,80,0.4)', marginBottom: 6 }}>
                {new Date(selected.created_at).toLocaleDateString('ko-KR')} · {phase}차 · 인등 {selected.lantern_count}구
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,220,140,0.85)', lineHeight: 1.95, borderTop: '1px solid rgba(255,200,80,0.15)', paddingTop: 13, wordBreak: 'keep-all' }}>
                {selected.wish}
              </div>
              <button onClick={() => setSelected(null)} style={{ marginTop: 18, background: 'rgba(255,180,50,0.15)', border: '1px solid rgba(255,180,50,0.4)', color: 'rgba(255,220,100,0.9)', borderRadius: 6, padding: '8px 24px', cursor: 'pointer', fontSize: 13 }}>
                닫기
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 480, margin: '32px auto 0', padding: '0 20px' }}>
        {!submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="성함을 입력하세요" style={inp} />
            <textarea value={wish} onChange={e => setWish(e.target.value)}
              placeholder="발원문 (예: 가족 모두 건강하기를...)" rows={3}
              style={{ ...inp, resize: 'none' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setLanternCount(n)}
                  style={{
                    padding: '10px 0', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                    border: lanternCount===n ? '2px solid rgba(255,200,80,0.85)' : '1px solid rgba(255,200,80,0.2)',
                    background: lanternCount===n ? 'rgba(255,180,50,0.25)' : 'rgba(255,255,255,0.04)',
                    color: lanternCount===n ? 'rgba(255,235,150,0.95)' : 'rgba(255,200,80,0.55)',
                    fontWeight: lanternCount===n ? 700 : 400,
                  }}>
                  {n}구
                </button>
              ))}
            </div>

            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <span style={{ color: 'rgba(255,200,80,0.5)', fontSize: 13 }}>합계 </span>
              <span style={{ color: 'rgba(255,235,150,0.95)', fontSize: 24, fontWeight: 700 }}>
                {totalAmount.toLocaleString()}원
              </span>
              <span style={{ color: 'rgba(255,200,80,0.4)', fontSize: 12, marginLeft: 6 }}>
                ({lanternCount}구 × 30,000원)
              </span>
            </div>

            <div style={{ background: 'rgba(255,200,80,0.05)', border: '1px solid rgba(255,200,80,0.15)', borderRadius: 8, padding: '14px 16px', fontSize: 13, color: 'rgba(255,200,80,0.75)', lineHeight: 2.3 }}>
              농협 351-0950-2778-43 천관사
              <button onClick={() => copyText('351-0950-2778-43','nh')}
                style={{ marginLeft: 8, background: 'rgba(255,180,50,0.15)', border: '1px solid rgba(255,180,50,0.35)', color: 'rgba(255,210,80,0.9)', borderRadius: 4, padding: '2px 9px', fontSize: 11, cursor: 'pointer' }}>
                {copied==='nh' ? '복사됨' : '복사'}
              </button><br/>
              우체국 500678-01-001511 천관사
              <button onClick={() => copyText('500678-01-001511','post')}
                style={{ marginLeft: 8, background: 'rgba(255,180,50,0.15)', border: '1px solid rgba(255,180,50,0.35)', color: 'rgba(255,210,80,0.9)', borderRadius: 4, padding: '2px 9px', fontSize: 11, cursor: 'pointer' }}>
                {copied==='post' ? '복사됨' : '복사'}
              </button><br/>
              <span style={{ fontSize: 11, color: 'rgba(255,200,80,0.38)' }}>
                입금자명을 신청자 성함과 동일하게 입금해 주세요.
              </span>
            </div>

            <button onClick={handleSubmit} disabled={loading || !name.trim()}
              style={{ background: loading ? 'rgba(60,40,20,0.3)' : 'rgba(255,180,50,0.22)', border: '1px solid rgba(255,180,50,0.55)', color: 'rgba(255,220,100,0.95)', borderRadius: 8, padding: 15, fontSize: 15, cursor: loading ? 'default' : 'pointer', fontWeight: 500 }}>
              {loading ? '접수 중...' : `인등 ${lanternCount}구 신청하기 — ${totalAmount.toLocaleString()}원`}
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 46, marginBottom: 14 }}>🕯</div>
            <p style={{ color: 'rgba(255,235,150,0.95)', fontSize: 17, fontWeight: 500, marginBottom: 10, lineHeight: 1.95, wordBreak: 'keep-all' }}>
              당신의 소원이 인등공양을 통해<br/>성취되기를 기도합니다.
            </p>
            <p style={{ color: 'rgba(255,200,80,0.5)', fontSize: 13, marginBottom: 26, lineHeight: 1.85 }}>
              입금 확인 후 {tName} 법당에<br/>인등 {lanternCount}구가 점등됩니다.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={shareKakao}
                style={{ background: '#FEE500', border: 'none', color: '#3A1D1D', borderRadius: 8, padding: '12px 26px', fontSize: 14, cursor: 'pointer', fontWeight: 700 }}>
                카카오톡 공유
              </button>
              <button onClick={() => { setSubmitted(false); setName(''); setWish(''); setLanternCount(1) }}
                style={{ background: 'rgba(255,180,50,0.15)', border: '1px solid rgba(255,180,50,0.4)', color: 'rgba(255,220,100,0.9)', borderRadius: 8, padding: '12px 26px', fontSize: 14, cursor: 'pointer' }}>
                추가 신청
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
