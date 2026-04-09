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

const COLS = 55
const MAX = 3000

export default function H12IndungHero({ config }: Props) {
  const slug = (config?.templeSlug as string) || 'cheongwansa'
  const tName = (config?.templeName as string) || '천관사'
  const phase = (config?.currentPhase as number) || 1

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const animRef = useRef<number | undefined>(undefined)
  const tickRef = useRef(0)
  const slotsRef = useRef<{
    bx: number; by: number
    phase: number; speed: number; hue: number
    swayAmp: number; swayFreq: number
    litAt: number; isText: boolean
  }[]>([])
  const donorsRef = useRef<Donor[]>([])
  const particlesRef = useRef<{ x: number; y: number; vy: number; life: number; name: string }[]>([])
  const litCountRef = useRef(0)
  const isDraggingRef = useRef(false)
  const lastParticleRef = useRef(0)
  const myLanternIdxRef = useRef<number>(-1)
  const myLanternHighlightRef = useRef(0)

  const [donors, setDonors] = useState<Donor[]>([])
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; wish: string } | null>(null)
  const [selected, setSelected] = useState<Donor | null>(null)
  const [showForm, setShowForm] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const ROWS = Math.ceil(MAX / COLS)
  const CANVAS_H = Math.max(600, ROWS * 18 + 40)

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

    const PX = 0.015, PY = 0.03
    const CW = (1 - PX * 2) / COLS
    const CH = (1 - PY * 2) / ROWS

    // 슬롯 1차 초기화 (isText는 폰트 로드 후 재배정)
    slotsRef.current = Array.from({ length: MAX }, (_, i) => ({
      bx: PX + (i % COLS) * CW + CW * 0.5,
      by: PY + Math.floor(i / COLS) * CH + CH * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.8,
      hue: 26 + Math.random() * 28,
      swayAmp: (Math.random() - 0.5) * 0.002,
      swayFreq: 0.3 + Math.random() * 0.5,
      litAt: 0,
      isText: false,
    }))

    // 폰트 로딩 보장 후 텍스트 마스크 생성 (3배 캔버스 다운샘플링)
    document.fonts.ready.then(() => {
      const MASK_W = COLS * 3
      const MASK_H = ROWS * 3
      const offscreen = document.createElement('canvas')
      offscreen.width = MASK_W
      offscreen.height = MASK_H
      const octx = offscreen.getContext('2d')!

      octx.fillStyle = '#000000'
      octx.fillRect(0, 0, MASK_W, MASK_H)

      const fontSize = Math.floor(MASK_H * 0.65)
      octx.font = `900 ${fontSize}px 'Apple SD Gothic Neo','Malgun Gothic',sans-serif`
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      octx.fillStyle = '#ffffff'

      const measured = octx.measureText(tName)
      const textW = measured.width
      let finalFontSize = fontSize
      if (textW > MASK_W * 0.85) {
        finalFontSize = Math.floor(fontSize * (MASK_W * 0.85 / textW))
        octx.font = `900 ${finalFontSize}px 'Apple SD Gothic Neo','Malgun Gothic',sans-serif`
      }

      octx.fillText(tName, MASK_W / 2, MASK_H / 2)
      octx.fillText(tName, MASK_W / 2 + 0.5, MASK_H / 2)
      octx.fillText(tName, MASK_W / 2, MASK_H / 2 + 0.5)

      const imgData = octx.getImageData(0, 0, MASK_W, MASK_H).data

      const mask: boolean[] = new Array(COLS * ROWS).fill(false)
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const slotIdx = row * COLS + col
          const px = Math.floor((col + 0.5) * (MASK_W / COLS))
          const py = Math.floor((row + 0.5) * (MASK_H / ROWS))
          const pixelIdx = (py * MASK_W + px) * 4
          mask[slotIdx] = imgData[pixelIdx] > 30
        }
      }

      const trueCount = mask.filter(Boolean).length
      console.log(`천관사 마스크: ${trueCount}/${COLS * ROWS} = ${Math.round(trueCount / COLS / ROWS * 100)}%`)

      slotsRef.current.forEach((s, i) => {
        s.isText = mask[i] ?? false
      })
    })
    litCountRef.current = 0

    const LIT_PER_FRAME = 3

    const draw = (ts: number) => {
      tickRef.current = ts * 0.001
      const t = tickRef.current
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const sky = ctx.createLinearGradient(0, 0, 0, H)
      sky.addColorStop(0, '#03010a')
      sky.addColorStop(1, '#0d0420')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, W, H)

      const r = Math.min(CW * W, CH * H) * 0.38
      const cur = donorsRef.current

      if (litCountRef.current < MAX) {
        const next = Math.min(litCountRef.current + LIT_PER_FRAME, MAX)
        for (let i = litCountRef.current; i < next; i++) {
          slotsRef.current[i].litAt = t
          if (i < cur.length && i % 10 === 0) {
            particlesRef.current.push({
              x: slotsRef.current[i].bx,
              y: slotsRef.current[i].by,
              vy: -(0.0007 + Math.random() * 0.0005),
              life: 1,
              name: cur[i].name,
            })
          }
        }
        litCountRef.current = next
      }

      for (let i = 0; i < MAX; i++) {
        const s = slotsRef.current[i]
        const isLit = s.litAt > 0
        const isDonor = i < cur.length
        const px = (s.bx + Math.sin(t * s.swayFreq + s.phase) * s.swayAmp) * W
        const py = (s.by + Math.sin(t * s.speed * 0.2 + s.phase) * 0.001) * H

        const textWave = s.isText
          ? 0.5 + 0.5 * Math.sin(t * 0.9 + s.bx * 22)
          : 0

        if (!isLit) {
          ctx.beginPath()
          ctx.arc(px, py, r * 0.22, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,200,80,0.04)'
          ctx.fill()
          continue
        }

        const myHighlight = i === myLanternIdxRef.current
          ? Math.max(0, 1 - (t - myLanternHighlightRef.current) * 0.5)
          : 0

        const flicker = 0.78 + 0.22 * Math.sin(t * 8.5 + s.phase)
        const textBoost = s.isText ? 0.4 + 0.6 * textWave : 0
        const highlightBoost = myHighlight * 0.8
        const br = Math.min(1, flicker + textBoost + highlightBoost)

        if (!isDonor) {
          const dimBr = s.isText ? (0.22 + 0.22 * textWave) : 0.015
          ctx.beginPath()
          ctx.arc(px, py, r * 0.32, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(180,160,100,${dimBr})`
          ctx.fill()
          continue
        }

        const glowR = r * (s.isText ? 3.5 : 2.6) * (1 + highlightBoost)
        const glow = ctx.createRadialGradient(px, py, 0, px, py, glowR)
        const glowAlpha = s.isText
          ? Math.min(1, (0.65 + textBoost * 0.55) * br)
          : 0.25 * br
        glow.addColorStop(0, `hsla(${s.hue},100%,88%,${glowAlpha})`)
        glow.addColorStop(1, `hsla(${s.hue},80%,50%,0)`)
        ctx.fillStyle = glow
        ctx.beginPath(); ctx.arc(px, py, glowR, 0, Math.PI * 2); ctx.fill()

        const bodyR = r * (
          s.isText
            ? (1.2 + textWave * 0.5 + highlightBoost * 0.5)
            : (0.95 + highlightBoost * 0.5)
        )
        ctx.save(); ctx.translate(px, py); ctx.scale(1, 1.5)
        const bg = ctx.createRadialGradient(0, -bodyR * 0.15, 0, 0, 0, bodyR)
        bg.addColorStop(0, `hsla(${s.hue + 15},100%,94%,${br})`)
        bg.addColorStop(0.5, `hsla(${s.hue},88%,64%,${br})`)
        bg.addColorStop(1, `hsla(${s.hue - 12},78%,32%,${br})`)
        ctx.fillStyle = bg
        ctx.beginPath(); ctx.arc(0, 0, bodyR, 0, Math.PI * 2); ctx.fill()
        ctx.restore()

        ctx.strokeStyle = `hsla(${s.hue},75%,68%,${br * 0.4})`
        ctx.lineWidth = 0.6
        ctx.beginPath()
        ctx.moveTo(px, py + bodyR * 1.55)
        ctx.lineTo(px, py + bodyR * 2.3)
        ctx.stroke()

        if (bodyR > 4) {
          ctx.save()
          ctx.font = `${Math.max(7, bodyR * 0.82)}px 'Apple SD Gothic Neo',sans-serif`
          ctx.fillStyle = `hsla(30,50%,18%,${br * 0.8})`
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          ctx.fillText(cur[i].name.slice(0, 2), px, py)
          ctx.restore()
        }

        if (myHighlight > 0.1) {
          ctx.beginPath()
          ctx.arc(px, py, bodyR * 2.2, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255,235,150,${myHighlight * 0.8})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      const parts = particlesRef.current
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.y += p.vy; p.life -= 0.012
        if (p.life <= 0) { parts.splice(i, 1); continue }
        ctx.save()
        ctx.font = `bold ${Math.max(10, r * 0.85)}px 'Apple SD Gothic Neo',sans-serif`
        ctx.fillStyle = `rgba(255,225,130,${p.life * 0.9})`
        ctx.shadowColor = 'rgba(255,180,50,0.8)'; ctx.shadowBlur = 8 * dpr
        ctx.textAlign = 'center'
        ctx.fillText(p.name, p.x * W, p.y * H)
        ctx.restore()
      }

      if (cur.length >= MAX) {
        ctx.fillStyle = `rgba(255,200,80,${0.04 + 0.03 * Math.sin(t * 3)})`
        ctx.fillRect(0, 0, W, H)
        ctx.save()
        ctx.font = `bold ${Math.round(18 * dpr)}px 'Apple SD Gothic Neo',sans-serif`
        ctx.fillStyle = `rgba(255,235,150,${0.7 + 0.3 * Math.sin(t * 2)})`
        ctx.textAlign = 'center'
        ctx.shadowColor = 'rgba(255,180,50,0.9)'; ctx.shadowBlur = 14 * dpr
        ctx.fillText(`삼천인등 원만성취`, W / 2, H * 0.05)
        ctx.restore()
      }

      animRef.current = requestAnimationFrame(draw)
    }
    animRef.current = requestAnimationFrame(draw)
    return () => { if (animRef.current !== undefined) cancelAnimationFrame(animRef.current) }
  }, [ROWS, CANVAS_H, phase, tName])

  useEffect(() => { donorsRef.current = donors }, [donors])

  const getSlotIdx = (mx: number, my: number, cw: number, ch: number) => {
    const PX = 0.015
    const CW = (1 - PX * 2) / COLS
    let best = -1, bestD = 99
    const cap = Math.min(litCountRef.current, donorsRef.current.length)
    for (let i = 0; i < cap; i++) {
      const s = slotsRef.current[i]
      if (!s) continue
      const dx = s.bx - mx / cw, dy = s.by - my / ch
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < bestD && d < CW * 1.8) { bestD = d; best = i }
    }
    return best
  }

  const spawnDrag = (mx: number, my: number, cw: number, ch: number) => {
    if (tickRef.current - lastParticleRef.current < 0.1) return
    lastParticleRef.current = tickRef.current
    const PX = 0.015, CW = (1 - PX * 2) / COLS
    const cur = donorsRef.current
    let added = 0
    const cap = Math.min(litCountRef.current, cur.length)
    for (let i = 0; i < cap; i++) {
      const s = slotsRef.current[i]
      const dx = s.bx - mx / cw, dy = s.by - my / ch
      if (Math.sqrt(dx * dx + dy * dy) < CW * 3 && added < 4) {
        particlesRef.current.push({
          x: s.bx, y: s.by - 0.015,
          vy: -(0.0008 + Math.random() * 0.0005),
          life: 1, name: cur[i].name,
        })
        added++
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    if (isDraggingRef.current) { spawnDrag(mx, my, rect.width, rect.height); setTooltip(null); return }
    const idx = getSlotIdx(mx, my, rect.width, rect.height)
    if (idx >= 0) {
      const d = donorsRef.current[idx]
      setTooltip({ x: mx, y: my, name: d.name, wish: d.wish })
    } else setTooltip(null)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true
    const rect = canvasRef.current!.getBoundingClientRect()
    spawnDrag(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height)
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    const rect = canvasRef.current!.getBoundingClientRect()
    const idx = getSlotIdx(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height)
    if (idx >= 0) { setSelected(donorsRef.current[idx]); setTooltip(null) }
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true
    const rect = canvasRef.current!.getBoundingClientRect()
    const t = e.touches[0]
    spawnDrag(t.clientX - rect.left, t.clientY - rect.top, rect.width, rect.height)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const t = e.touches[0]
    spawnDrag(t.clientX - rect.left, t.clientY - rect.top, rect.width, rect.height)
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
          lantern_count: 1,
          phase,
        }),
      })
      await fetchDonors()
      myLanternIdxRef.current = donorsRef.current.length - 1
      myLanternHighlightRef.current = tickRef.current
      setSubmitted(true)
    } catch {}
    setLoading(false)
  }

  const handleConfirm = () => {
    setSubmitted(false)
    setShowForm(true)
    setName(''); setWish('')
    myLanternHighlightRef.current = tickRef.current
    setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const handleAddMore = () => {
    setSubmitted(false)
    setName(''); setWish('')
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
    <section ref={sectionRef} style={{ background: '#030108', paddingBottom: 48, ...sf }}>

      <div style={{ textAlign: 'center', padding: '32px 20px 12px' }}>
        <p style={{ color: 'rgba(255,200,80,0.45)', fontSize: 12, letterSpacing: 4, marginBottom: 8 }}>
          삼천인등불사 · 1구 30,000원 · 1년 점등
        </p>
        <h1 style={{ color: 'rgba(255,235,150,0.95)', fontSize: 26, fontWeight: 500, marginBottom: 14, letterSpacing: 3 }}>
          {tName} 삼천인등
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 500, margin: '0 auto 4px' }}>
          <span style={{ color: 'rgba(255,200,80,0.7)', fontSize: 13, minWidth: 80, textAlign: 'right' }}>
            {donors.length.toLocaleString()} / {MAX.toLocaleString()}
          </span>
          <div style={{ flex: 1, height: 7, background: 'rgba(255,200,80,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,rgba(255,140,30,0.7),rgba(255,220,80,0.85))', borderRadius: 4, transition: 'width 0.8s' }} />
          </div>
          <span style={{ color: 'rgba(255,200,80,0.7)', fontSize: 13, minWidth: 32 }}>{pct}%</span>
        </div>
        <p style={{ color: 'rgba(255,200,80,0.28)', fontSize: 11, marginTop: 4 }}>
          마우스를 클릭·드래그하면 동참자 이름이 피어오릅니다
        </p>
      </div>

      <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: 980, margin: '0 auto' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', cursor: 'grab' }}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { isDraggingRef.current = false; setTooltip(null) }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => { isDraggingRef.current = false; setTooltip(null) }}
        />

        {tooltip && (
          <div style={{
            position: 'absolute',
            left: Math.min(tooltip.x + 14, contW - 170),
            top: Math.max(tooltip.y - 62, 8),
            background: 'rgba(12,4,28,0.97)',
            border: '1px solid rgba(255,200,80,0.45)',
            borderRadius: 8, padding: '9px 14px',
            pointerEvents: 'none', zIndex: 20, minWidth: 148,
          }}>
            <div style={{ color: 'rgba(255,235,150,0.95)', fontSize: 14, fontWeight: 700, marginBottom: 3 }}>
              {tooltip.name} 불자님
            </div>
            <div style={{ color: 'rgba(255,200,80,0.6)', fontSize: 11, lineHeight: 1.5 }}>
              {(tooltip.wish || '').slice(0, 26)}{(tooltip.wish?.length || 0) > 26 ? '…' : ''}
            </div>
          </div>
        )}

        {selected && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}
            onClick={() => setSelected(null)}>
            <div style={{ background: '#1a0d2e', border: '1px solid rgba(255,200,80,0.4)', borderRadius: 14, padding: '26px 30px', maxWidth: 290, width: '88%', textAlign: 'center' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: 34, marginBottom: 8 }}>🕯</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,235,150,0.95)', letterSpacing: 2, marginBottom: 4 }}>
                {selected.name} 불자님
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,200,80,0.4)', marginBottom: 6 }}>
                {new Date(selected.created_at).toLocaleDateString('ko-KR')} · {phase}차
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,220,140,0.85)', lineHeight: 1.9, borderTop: '1px solid rgba(255,200,80,0.15)', paddingTop: 12, wordBreak: 'keep-all' }}>
                {selected.wish}
              </div>
              <button onClick={() => setSelected(null)} style={{ marginTop: 16, background: 'rgba(255,180,50,0.15)', border: '1px solid rgba(255,180,50,0.4)', color: 'rgba(255,220,100,0.9)', borderRadius: 6, padding: '7px 22px', cursor: 'pointer', fontSize: 13 }}>
                닫기
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 460, margin: '28px auto 0', padding: '0 20px' }}>
        {!submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="성함을 입력하세요" style={inp} />
            <textarea value={wish} onChange={e => setWish(e.target.value)}
              placeholder="발원문 (예: 가족 모두 건강하기를...)" rows={3}
              style={{ ...inp, resize: 'none' }} />

            <div style={{ textAlign: 'center', padding: '6px 0' }}>
              <span style={{ color: 'rgba(255,200,80,0.5)', fontSize: 13 }}>인등 1구 </span>
              <span style={{ color: 'rgba(255,235,150,0.95)', fontSize: 22, fontWeight: 700 }}>30,000원</span>
            </div>

            <div style={{ background: 'rgba(255,200,80,0.05)', border: '1px solid rgba(255,200,80,0.14)', borderRadius: 8, padding: '13px 15px', fontSize: 13, color: 'rgba(255,200,80,0.75)', lineHeight: 2.2 }}>
              농협 351-0950-2778-43 천관사
              <button onClick={() => { navigator.clipboard.writeText('351-0950-2778-43'); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                style={{ marginLeft: 8, background: 'rgba(255,180,50,0.15)', border: '1px solid rgba(255,180,50,0.35)', color: 'rgba(255,210,80,0.9)', borderRadius: 4, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}>
                {copied ? '복사됨' : '복사'}
              </button><br />
              우체국 500678-01-001511 천관사<br />
              <span style={{ fontSize: 11, color: 'rgba(255,200,80,0.38)' }}>입금자명을 신청자 성함과 동일하게 입금해 주세요.</span>
            </div>

            <button onClick={handleSubmit} disabled={loading || !name.trim()}
              style={{ background: loading ? 'rgba(60,40,20,0.3)' : 'rgba(255,180,50,0.22)', border: '1px solid rgba(255,180,50,0.55)', color: 'rgba(255,220,100,0.95)', borderRadius: 8, padding: 14, fontSize: 15, cursor: loading ? 'default' : 'pointer', fontWeight: 500 }}>
              {loading ? '접수 중...' : '인등 신청하기 — 30,000원'}
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>🕯</div>
            <p style={{ color: 'rgba(255,235,150,0.95)', fontSize: 16, fontWeight: 500, marginBottom: 8, lineHeight: 1.9, wordBreak: 'keep-all' }}>
              당신의 소원이 인등공양을 통해<br />성취되기를 기도합니다.
            </p>
            <p style={{ color: 'rgba(255,200,80,0.5)', fontSize: 13, marginBottom: 22, lineHeight: 1.8 }}>
              입금 확인 후 {tName} 법당에<br />인등이 점등됩니다.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={shareKakao}
                style={{ background: '#FEE500', border: 'none', color: '#3A1D1D', borderRadius: 8, padding: '11px 20px', fontSize: 13, cursor: 'pointer', fontWeight: 700 }}>
                카카오톡 공유
              </button>
              <button onClick={handleAddMore}
                style={{ background: 'rgba(255,180,50,0.15)', border: '1px solid rgba(255,180,50,0.4)', color: 'rgba(255,220,100,0.9)', borderRadius: 8, padding: '11px 20px', fontSize: 13, cursor: 'pointer' }}>
                추가 신청
              </button>
              <button onClick={handleConfirm}
                style={{ background: 'rgba(100,200,150,0.15)', border: '1px solid rgba(100,200,150,0.4)', color: 'rgba(150,255,200,0.9)', borderRadius: 8, padding: '11px 20px', fontSize: 13, cursor: 'pointer' }}>
                동참 확인 🕯
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
