'use client'
import { useEffect, useState, useRef, useCallback } from 'react'

interface Donor {
  id: string; name: string; wish: string
  lantern_count: number; bank_confirmed: boolean
  created_at: string; phase: number
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

const ROUND_TARGETS = [250, 500, 750, 1000, 1250]
const LANTERN_COLORS = ['#e53e3e','#ed8936','#c9a84c','#48bb78','#9f7aea','#4299e1','#f6ad55','#fc8181','#68d391']

function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

export default function CheopaIlYeongDeungHeroBlock({ config }: Props) {
  const slug = (config?.templeSlug as string) || 'bulyeonam'
  const tName = (config?.templeName as string) || '불연암'
  const currentRound = (config?.currentRound as number) || 1
  const MAX = (config?.targetCount as number) || ROUND_TARGETS[currentRound - 1] || 250
  const phase = currentRound

  const GRID_COLS = Math.min(25, Math.ceil(Math.sqrt(MAX * 2.5)))
  const GRID_ROWS = Math.ceil(MAX / GRID_COLS)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const animRef = useRef<number | undefined>(undefined)
  const tickRef = useRef(0)
  const donorsRef = useRef<Donor[]>([])
  const isDraggingRef = useRef(false)
  const lastParticleRef = useRef(0)
  const particlesRef = useRef<{ x: number; y: number; vy: number; life: number; name: string }[]>([])
  const myLanternIdxRef = useRef(-1)
  const myLanternHighlightRef = useRef(0)

  const [donors, setDonors] = useState<Donor[]>([])
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; wish: string; confirmed: boolean } | null>(null)
  const [selected, setSelected] = useState<Donor | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const CANVAS_H = Math.max(420, GRID_ROWS * 52 + 80)

  const fetchDonors = useCallback(async () => {
    try {
      const res = await fetch(`/api/indung?temple_slug=${slug}&phase=${phase}`)
      const data = await res.json()
      if (Array.isArray(data)) { setDonors(data); donorsRef.current = data }
    } catch {}
  }, [slug, phase])

  useEffect(() => {
    fetch('/api/indung/sync').catch(() => {})
    fetchDonors()
  }, [fetchDonors])

  // 연등 격자 정보
  const slotsRef = useRef<{ x: number; y: number; color: string; delay: number; phase: number }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    const W_CSS = container.getBoundingClientRect().width
    canvas.width = W_CSS * dpr; canvas.height = CANVAS_H * dpr
    canvas.style.width = W_CSS + 'px'; canvas.style.height = CANVAS_H + 'px'

    const W = canvas.width, H = canvas.height
    const padX = W * 0.06, padY = H * 0.08
    const cellW = (W - padX * 2) / GRID_COLS
    const cellH = (H - padY * 2) / GRID_ROWS
    const rx = Math.min(cellW * 0.32, 9 * dpr)
    const ry = rx * 1.45

    // 별
    const stars = Array.from({ length: 50 }, () => ({
      x: Math.random() * W, y: Math.random() * H * 0.6,
      r: 0.3 + Math.random() * 1.2, phase: Math.random() * Math.PI * 2,
    }))

    // 슬롯 생성
    slotsRef.current = Array.from({ length: MAX }, (_, i) => {
      const col = i % GRID_COLS, row = Math.floor(i / GRID_COLS)
      return {
        x: padX + (col + 0.5) * cellW,
        y: padY + (row + 0.5) * cellH,
        color: LANTERN_COLORS[i % LANTERN_COLORS.length],
        delay: (row * GRID_COLS + col) * 0.12,
        phase: Math.random() * Math.PI * 2,
      }
    })

    const draw = (ts: number) => {
      const t = ts * 0.001
      tickRef.current = t
      ctx.clearRect(0, 0, W, H)

      // 배경
      ctx.fillStyle = '#020209'; ctx.fillRect(0, 0, W, H)

      // 별
      for (const s of stars) {
        const br = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.8 + s.phase))
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,240,${br * 0.6})`; ctx.fill()
      }

      const cur = donorsRef.current

      // 가로 줄 (행별)
      for (let row = 0; row < GRID_ROWS; row++) {
        const lineY = padY + (row + 0.5) * cellH - ry - 6 * dpr
        ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 0.5 * dpr
        ctx.beginPath(); ctx.moveTo(padX, lineY); ctx.lineTo(W - padX, lineY); ctx.stroke()
      }

      // 연등 렌더링
      for (let i = 0; i < MAX; i++) {
        const sl = slotsRef.current[i]
        const isLit = i < cur.length
        const swing = Math.sin(t * 0.022 + sl.delay) * 5 * dpr
        const lx = sl.x + swing
        const ly = sl.y
        const lineY = ly - ry - 6 * dpr

        // 수직 줄
        ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 0.5 * dpr
        ctx.beginPath(); ctx.moveTo(lx, lineY); ctx.lineTo(lx, ly - ry); ctx.stroke()

        if (!isLit) {
          // 미점등
          ctx.save(); ctx.globalAlpha = 0.1
          ctx.fillStyle = '#333'
          ctx.beginPath(); ctx.ellipse(lx, ly, rx, ry, 0, 0, Math.PI * 2); ctx.fill()
          ctx.restore()
          continue
        }

        const confirmed = cur[i].bank_confirmed
        const flicker = 0.85 + 0.15 * Math.sin(t * 0.07 + sl.phase)
        const myH = i === myLanternIdxRef.current ? Math.max(0, 1 - (t - myLanternHighlightRef.current) * 0.5) : 0
        const br = Math.min(1, flicker + (confirmed ? 0.1 : 0) + myH * 0.5)
        const [cr, cg, cb] = hexRgb(sl.color)

        // 글로우
        const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, rx * 2.5)
        glow.addColorStop(0, `rgba(${cr},${cg},${cb},${0.2 * br})`)
        glow.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(lx, ly, rx * 2.5, 0, Math.PI * 2); ctx.fill()

        // 몸통 (타원)
        const bg = ctx.createRadialGradient(lx, ly - ry * 0.2, 0, lx, ly, ry)
        bg.addColorStop(0, `rgba(${Math.min(255, cr + 60)},${Math.min(255, cg + 40)},${Math.min(255, cb + 30)},${br})`)
        bg.addColorStop(0.6, `rgba(${cr},${cg},${cb},${br})`)
        bg.addColorStop(1, `rgba(${Math.max(0, cr - 40)},${Math.max(0, cg - 40)},${Math.max(0, cb - 30)},${br})`)
        ctx.fillStyle = bg
        ctx.beginPath(); ctx.ellipse(lx, ly, rx, ry, 0, 0, Math.PI * 2); ctx.fill()

        // 상단 마개
        ctx.fillStyle = `rgba(255,255,255,${0.3 * br})`
        ctx.beginPath(); ctx.ellipse(lx, ly - ry, rx, rx * 0.3, 0, 0, Math.PI * 2); ctx.fill()

        // 하단 술 (5가닥)
        for (let k = 0; k < 5; k++) {
          const sx = lx + (k - 2) * rx * 0.4
          const tSwing = Math.sin(t * 0.03 + sl.phase + k * 0.5) * 2 * dpr
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${0.4 * br})`
          ctx.lineWidth = 0.5 * dpr
          ctx.beginPath(); ctx.moveTo(sx, ly + ry); ctx.lineTo(sx + tSwing, ly + ry + 8 * dpr); ctx.stroke()
        }

        // 이름
        if (rx > 3 * dpr) {
          ctx.save()
          ctx.font = `${Math.max(7 * dpr, rx * 0.7)}px 'Apple SD Gothic Neo',sans-serif`
          ctx.fillStyle = `rgba(255,255,255,${br * 0.75})`
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          ctx.fillText(cur[i].name.slice(0, 2), lx, ly)
          ctx.restore()
        }

        // 입금확인 초록 링
        if (confirmed) {
          ctx.beginPath(); ctx.ellipse(lx, ly, rx * 1.5, ry * 1.3, 0, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(100,220,150,${0.3 + 0.15 * Math.sin(t * 2 + sl.phase)})`
          ctx.lineWidth = 0.8 * dpr; ctx.stroke()
        }

        // 내 인등 강조 링
        if (myH > 0.1) {
          ctx.beginPath(); ctx.ellipse(lx, ly, rx * 1.8, ry * 1.5, 0, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255,235,150,${myH * 0.8})`
          ctx.lineWidth = 1.5 * dpr; ctx.stroke()
        }
      }

      // 파티클
      const parts = particlesRef.current
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]; p.y -= 0.8 * dpr; p.life -= 0.012
        if (p.life <= 0) { parts.splice(i, 1); continue }
        ctx.save()
        ctx.font = `bold ${Math.max(10, rx * 0.9)}px 'Apple SD Gothic Neo',sans-serif`
        ctx.fillStyle = `rgba(255,225,130,${p.life * 0.9})`
        ctx.shadowColor = 'rgba(255,180,50,0.8)'; ctx.shadowBlur = 8 * dpr
        ctx.textAlign = 'center'; ctx.fillText(p.name, p.x, p.y); ctx.restore()
      }

      // 원만성취
      if (cur.length >= MAX) {
        ctx.fillStyle = `rgba(255,200,80,${0.04 + 0.03 * Math.sin(t * 3)})`; ctx.fillRect(0, 0, W, H)
        ctx.save()
        ctx.font = `bold ${Math.round(18 * dpr)}px 'Apple SD Gothic Neo',sans-serif`
        ctx.fillStyle = `rgba(255,235,150,${0.7 + 0.3 * Math.sin(t * 2)})`
        ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(255,180,50,0.9)'; ctx.shadowBlur = 14 * dpr
        ctx.fillText(`${currentRound}차 ${MAX.toLocaleString()}등 원만성취`, W / 2, H * 0.05); ctx.restore()
      }

      animRef.current = requestAnimationFrame(draw)
    }
    animRef.current = requestAnimationFrame(draw)
    return () => { if (animRef.current !== undefined) cancelAnimationFrame(animRef.current) }
  }, [GRID_COLS, GRID_ROWS, CANVAS_H, MAX, currentRound])

  useEffect(() => { donorsRef.current = donors }, [donors])

  // 인터랙션 핸들러
  const getSlotIdx = (mx: number, my: number, cw: number, ch: number) => {
    const cur = donorsRef.current; let best = -1, bestD = 999
    for (let i = 0; i < Math.min(slotsRef.current.length, cur.length); i++) {
      const s = slotsRef.current[i]
      const dx = s.x / cw - mx / cw, dy = s.y / ch - my / ch
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < bestD && d < 0.03) { bestD = d; best = i }
    }
    return best
  }

  const spawnDrag = (mx: number, my: number, cw: number, ch: number) => {
    if (tickRef.current - lastParticleRef.current < 0.1) return
    lastParticleRef.current = tickRef.current
    const cur = donorsRef.current; let added = 0
    for (let i = 0; i < Math.min(slotsRef.current.length, cur.length); i++) {
      const s = slotsRef.current[i]
      const dx = s.x - mx * (cw > 0 ? cw / cw : 1), dy = s.y - my * (ch > 0 ? ch / ch : 1)
      if (Math.sqrt(dx * dx + dy * dy) < 60 && added < 4) {
        particlesRef.current.push({ x: s.x, y: s.y - 20, vy: 0, life: 1, name: cur[i].name })
        added++
      }
    }
  }

  const getCanvasCoords = (e: { clientX: number; clientY: number }) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    return { mx: (e.clientX - rect.left) * dpr, my: (e.clientY - rect.top) * dpr, cw: rect.width * dpr, ch: rect.height * dpr, rx: e.clientX - rect.left, ry: e.clientY - rect.top }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { mx, my, cw, ch, rx: ex, ry: ey } = getCanvasCoords(e)
    if (isDraggingRef.current) { spawnDrag(mx, my, cw, ch); setTooltip(null); return }
    const idx = getSlotIdx(mx, my, cw, ch)
    if (idx >= 0) {
      const d = donorsRef.current[idx]
      setTooltip({ x: ex, y: ey, name: d.name, wish: d.wish, confirmed: d.bank_confirmed })
    } else setTooltip(null)
  }
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true; const { mx, my, cw, ch } = getCanvasCoords(e); spawnDrag(mx, my, cw, ch)
  }
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return; isDraggingRef.current = false
    const { mx, my, cw, ch } = getCanvasCoords(e)
    const idx = getSlotIdx(mx, my, cw, ch)
    if (idx >= 0) { setSelected(donorsRef.current[idx]); setTooltip(null) }
  }
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true; const t = e.touches[0]
    const { mx, my, cw, ch } = getCanvasCoords(t); spawnDrag(mx, my, cw, ch)
  }
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const t = e.touches[0]; const { mx, my, cw, ch } = getCanvasCoords(t); spawnDrag(mx, my, cw, ch)
  }

  const handleSubmit = async () => {
    if (!name.trim()) return; setLoading(true)
    try {
      await fetch('/api/indung', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temple_slug: slug, name: name.trim(), wish: wish.trim() || WISHES_DEFAULT[donors.length % WISHES_DEFAULT.length], lantern_count: 1, phase }),
      })
      await fetchDonors()
      myLanternIdxRef.current = donorsRef.current.length - 1
      myLanternHighlightRef.current = tickRef.current
      setSubmitted(true)
    } catch {}
    setLoading(false)
  }
  const handleConfirm = () => { setSubmitted(false); setName(''); setWish(''); myLanternHighlightRef.current = tickRef.current; setTimeout(() => containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100) }
  const handleAddMore = () => { setSubmitted(false); setName(''); setWish('') }
  const shareKakao = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    navigator.clipboard.writeText(`${tName} 연등불사 ${currentRound}차에 동참했습니다.\n\n함께 소원을 빌어요 🏮\n${url}`).then(() => alert('링크가 복사되었습니다.\n카카오톡에 붙여넣기하여 공유해 주세요.'))
  }

  const pct = Math.min(100, Math.round((donors.length / MAX) * 100))
  const sf = { fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }
  const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,200,80,0.25)', borderRadius: 8, padding: '11px 14px', color: 'rgba(255,220,120,0.9)', fontSize: 14, outline: 'none', width: '100%' }
  const contW = containerRef.current?.offsetWidth || 600

  return (
    <section ref={sectionRef} style={{ background: '#020209', paddingBottom: 48, ...sf }}>
      <div style={{ textAlign: 'center', padding: '32px 20px 12px' }}>
        <span style={{ display: 'inline-block', fontSize: 11, color: '#c9a84c', letterSpacing: '0.1em', border: '0.5px solid rgba(201,168,76,0.4)', padding: '3px 14px', borderRadius: 20, marginBottom: 10 }}>
          {currentRound}차 연등 점등 불사
        </span>
        <h1 style={{ color: 'rgba(255,235,150,0.95)', fontSize: 26, fontWeight: 500, marginBottom: 14, letterSpacing: 3 }}>{tName} 연등공양</h1>
        <div style={{ maxWidth: 420, margin: '0 auto 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ color: 'rgba(255,200,80,0.7)', fontSize: 13, minWidth: 80, textAlign: 'right' }}>{donors.length.toLocaleString()} / {MAX.toLocaleString()}</span>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,200,80,0.1)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#c9a84c,#f6e05e)', borderRadius: 3, transition: 'width 0.8s' }} />
            </div>
            <span style={{ color: 'rgba(255,200,80,0.7)', fontSize: 13, minWidth: 32 }}>{pct}%</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
          {[1,2,3,4,5].map(r => {
            const done = r < currentRound, active = r === currentRound
            return (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: active?13:9, height: active?13:9, borderRadius: '50%', display: 'inline-block', background: done?'#c9a84c':active?'#fff':'rgba(255,255,255,0.12)', border: active?'2px solid #c9a84c':done?'none':'1px solid rgba(255,255,255,0.18)', boxShadow: active?'0 0 8px rgba(201,168,76,0.6)':'none' }} />
                <span style={{ fontSize: 9, color: active?'#c9a84c':done?'rgba(201,168,76,0.55)':'rgba(255,255,255,0.2)', fontWeight: active?700:400 }}>{r}차</span>
                {r < 5 && <span style={{ width: 6, height: 1, background: done?'rgba(201,168,76,0.35)':'rgba(255,255,255,0.08)' }} />}
              </div>
            )
          })}
        </div>
        <p style={{ color: 'rgba(255,200,80,0.28)', fontSize: 11 }}>연등을 클릭하면 발원문을 볼 수 있습니다</p>
      </div>

      <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: 980, margin: '0 auto' }}>
        <canvas ref={canvasRef} style={{ display: 'block', cursor: 'grab' }}
          onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
          onMouseLeave={() => { isDraggingRef.current = false; setTooltip(null) }}
          onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}
          onTouchEnd={() => { isDraggingRef.current = false; setTooltip(null) }} />
        {tooltip && (
          <div style={{ position: 'absolute', left: Math.min(tooltip.x + 14, contW - 170), top: Math.max(tooltip.y - 62, 8), background: 'rgba(12,4,28,0.97)', border: '1px solid rgba(255,200,80,0.45)', borderRadius: 8, padding: '9px 14px', pointerEvents: 'none', zIndex: 20, minWidth: 148 }}>
            <div style={{ color: 'rgba(255,235,150,0.95)', fontSize: 14, fontWeight: 700, marginBottom: 3 }}>
              {tooltip.name} 불자님 {tooltip.confirmed && <span style={{ color: 'rgba(100,220,150,0.9)', fontSize: 10, marginLeft: 6 }}>✓ 점등</span>}
            </div>
            <div style={{ color: 'rgba(255,200,80,0.6)', fontSize: 11, lineHeight: 1.5 }}>{(tooltip.wish||'').slice(0,26)}{(tooltip.wish?.length||0)>26?'…':''}</div>
          </div>
        )}
        {selected && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }} onClick={() => setSelected(null)}>
            <div style={{ background: '#1a0d2e', border: '1px solid rgba(255,200,80,0.4)', borderRadius: 14, padding: '26px 30px', maxWidth: 290, width: '88%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 34, marginBottom: 8 }}>🏮</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,235,150,0.95)', letterSpacing: 2, marginBottom: 4 }}>{selected.name} 불자님</div>
              <div style={{ fontSize: 11, color: 'rgba(255,200,80,0.4)', marginBottom: 6 }}>
                {new Date(selected.created_at).toLocaleDateString('ko-KR')} · {phase}차
                {selected.bank_confirmed && <span style={{ color: 'rgba(100,220,150,0.9)', marginLeft: 6 }}>✓ 입금확인</span>}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,220,140,0.85)', lineHeight: 1.9, borderTop: '1px solid rgba(255,200,80,0.15)', paddingTop: 12, wordBreak: 'keep-all' }}>{selected.wish}</div>
              <button onClick={() => setSelected(null)} style={{ marginTop: 16, background: 'rgba(255,180,50,0.15)', border: '1px solid rgba(255,180,50,0.4)', color: 'rgba(255,220,100,0.9)', borderRadius: 6, padding: '7px 22px', cursor: 'pointer', fontSize: 13 }}>닫기</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 460, margin: '28px auto 0', padding: '0 20px' }}>
        {!submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="성함을 입력하세요" style={inp} />
            <textarea value={wish} onChange={e => setWish(e.target.value)} placeholder="발원문 (예: 가족 모두 건강하기를...)" rows={3} style={{ ...inp, resize: 'none' }} />
            <div style={{ textAlign: 'center', padding: '6px 0' }}>
              <span style={{ color: 'rgba(255,200,80,0.5)', fontSize: 13 }}>연등 1구 </span>
              <span style={{ color: 'rgba(255,235,150,0.95)', fontSize: 22, fontWeight: 700 }}>30,000원</span>
            </div>
            <div style={{ background: 'rgba(255,200,80,0.05)', border: '1px solid rgba(255,200,80,0.14)', borderRadius: 8, padding: '13px 15px', fontSize: 13, color: 'rgba(255,200,80,0.75)', lineHeight: 2.2 }}>
              농협 351-0950-2778-43 천관사
              <button onClick={() => { navigator.clipboard.writeText('351-0950-2778-43'); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                style={{ marginLeft: 8, background: 'rgba(255,180,50,0.15)', border: '1px solid rgba(255,180,50,0.35)', color: 'rgba(255,210,80,0.9)', borderRadius: 4, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}>{copied ? '복사됨' : '복사'}</button><br />
              우체국 500678-01-001511 천관사<br />
              <span style={{ fontSize: 11, color: 'rgba(255,200,80,0.38)' }}>입금자명을 신청자 성함과 동일하게 입금해 주세요.</span>
            </div>
            <button onClick={handleSubmit} disabled={loading || !name.trim()}
              style={{ background: loading ? 'rgba(60,40,20,0.3)' : 'rgba(255,180,50,0.22)', border: '1px solid rgba(255,180,50,0.55)', color: 'rgba(255,220,100,0.95)', borderRadius: 8, padding: 14, fontSize: 15, cursor: loading ? 'default' : 'pointer', fontWeight: 500 }}>
              {loading ? '접수 중...' : '연등 달기 — 30,000원'}
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>🏮</div>
            <p style={{ color: 'rgba(255,235,150,0.95)', fontSize: 16, fontWeight: 500, marginBottom: 8, lineHeight: 1.9, wordBreak: 'keep-all' }}>당신의 소원이 연등공양을 통해<br />성취되기를 기도합니다.</p>
            <p style={{ color: 'rgba(255,200,80,0.5)', fontSize: 13, marginBottom: 22, lineHeight: 1.8 }}>입금 확인 후 {tName} 법당에<br />연등이 점등됩니다.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={shareKakao} style={{ background: '#FEE500', border: 'none', color: '#3A1D1D', borderRadius: 8, padding: '11px 20px', fontSize: 13, cursor: 'pointer', fontWeight: 700 }}>카카오톡 공유</button>
              <button onClick={handleAddMore} style={{ background: 'rgba(255,180,50,0.15)', border: '1px solid rgba(255,180,50,0.4)', color: 'rgba(255,220,100,0.9)', borderRadius: 8, padding: '11px 20px', fontSize: 13, cursor: 'pointer' }}>추가 신청</button>
              <button onClick={handleConfirm} style={{ background: 'rgba(100,200,150,0.15)', border: '1px solid rgba(100,200,150,0.4)', color: 'rgba(150,255,200,0.9)', borderRadius: 8, padding: '11px 20px', fontSize: 13, cursor: 'pointer' }}>동참 확인 🏮</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
