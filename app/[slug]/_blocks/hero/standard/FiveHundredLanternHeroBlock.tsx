'use client'
import { useEffect, useRef } from 'react'

interface Props { config?: Record<string, unknown> }

const ROUND_TARGETS = [500, 1000, 1500, 2000, 2500, 3000]

export default function FiveHundredLanternHeroBlock({ config }: Props) {
  const templeName = (config?.templeName as string) || '사찰명'
  const templeNameHanja = (config?.templeNameHanja as string) || ''
  const currentRound = (config?.currentRound as number) || 1
  const targetCount = (config?.targetCount as number) || ROUND_TARGETS[currentRound - 1] || 500
  const currentCount = (config?.currentCount as number) || 0
  const ctaLink = (config?.ctaLink as string) || '#'
  const tagline = (config?.tagline as string) || '부처님오신날 인등 공양 동참 불사'

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | undefined>(undefined)

  const pct = Math.min(100, Math.round((currentCount / targetCount) * 100))
  const LANTERN_COUNT = Math.max(40, Math.min(120, Math.round(60 + (currentCount / targetCount) * 60)))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const p = canvas.parentElement!
      const w = p.getBoundingClientRect().width
      canvas.width = w * dpr
      canvas.height = 420 * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = '420px'
    }
    resize()
    window.addEventListener('resize', resize)

    const lanterns = Array.from({ length: LANTERN_COUNT }, () => ({
      x: 0.05 + Math.random() * 0.9,
      y: 0.08 + Math.random() * 0.84,
      r: 3 + Math.random() * 5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.7,
      hue: Math.random() < 0.7
        ? 36 + Math.random() * 16   // 황금빛 70%
        : 42 + Math.random() * 12,  // 밝은빛 30%
      swayAmp: 0.001 + Math.random() * 0.002,
      swayFreq: 0.2 + Math.random() * 0.5,
    }))

    const draw = (ts: number) => {
      const t = ts * 0.001
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // 배경
      const sky = ctx.createLinearGradient(0, 0, 0, H)
      sky.addColorStop(0, '#02020a')
      sky.addColorStop(0.6, '#06041a')
      sky.addColorStop(1, '#0a0620')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, W, H)

      // 연등
      const litRatio = currentCount / targetCount
      const litCount = Math.round(lanterns.length * Math.min(1, litRatio))

      for (let i = 0; i < lanterns.length; i++) {
        const l = lanterns[i]
        const isLit = i < litCount
        const px = (l.x + Math.sin(t * l.swayFreq + l.phase) * l.swayAmp) * W
        const py = (l.y + Math.sin(t * l.speed * 0.3 + l.phase) * 0.001) * H
        const br = isLit ? (0.75 + 0.25 * Math.sin(t * 6 + l.phase)) : 0.08
        const sz = l.r * dpr

        if (isLit) {
          // 글로우
          const glow = ctx.createRadialGradient(px, py, 0, px, py, sz * 5)
          glow.addColorStop(0, `hsla(${l.hue},90%,75%,${0.22 * br})`)
          glow.addColorStop(1, `hsla(${l.hue},80%,50%,0)`)
          ctx.fillStyle = glow
          ctx.beginPath(); ctx.arc(px, py, sz * 5, 0, Math.PI * 2); ctx.fill()

          // 몸체
          ctx.save(); ctx.translate(px, py); ctx.scale(1, 1.4)
          const bg = ctx.createRadialGradient(0, -sz * 0.1, 0, 0, 0, sz)
          bg.addColorStop(0, `hsla(${l.hue + 10},100%,92%,${br})`)
          bg.addColorStop(0.5, `hsla(${l.hue},85%,60%,${br})`)
          bg.addColorStop(1, `hsla(${l.hue - 8},75%,35%,${br})`)
          ctx.fillStyle = bg
          ctx.beginPath(); ctx.arc(0, 0, sz, 0, Math.PI * 2); ctx.fill()
          ctx.restore()

          // 줄
          ctx.strokeStyle = `hsla(${l.hue},70%,65%,${br * 0.35})`
          ctx.lineWidth = 0.5
          ctx.beginPath(); ctx.moveTo(px, py + sz * 1.4); ctx.lineTo(px, py + sz * 2.5); ctx.stroke()
        } else {
          // 미점등 — 희미
          ctx.beginPath()
          ctx.arc(px, py, sz * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(200,180,120,0.06)'
          ctx.fill()
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }
    animRef.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current !== undefined) cancelAnimationFrame(animRef.current)
    }
  }, [LANTERN_COUNT, currentCount, targetCount])

  const sf: React.CSSProperties = { fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif" }

  return (
    <section style={{ background: '#02020a', position: 'relative', overflow: 'hidden', ...sf }}>
      {/* 캔버스 */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 960, margin: '0 auto' }}>
        <canvas ref={canvasRef} style={{ display: 'block' }} />
      </div>

      {/* 텍스트 오버레이 — 하단 정렬 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '0 20px 32px', pointerEvents: 'none',
      }}>
        {/* ① 차수 뱃지 */}
        <span style={{
          fontSize: 11, color: '#c9a84c', letterSpacing: '0.1em',
          border: '0.5px solid rgba(201,168,76,0.4)',
          padding: '3px 14px', borderRadius: 20, marginBottom: 10,
        }}>
          {currentRound}차 인등 점등 불사
        </span>

        {/* ② 사찰명 */}
        <h1 style={{
          fontSize: 'clamp(40px,8vw,80px)', fontWeight: 700, color: '#ffffff',
          letterSpacing: '0.14em', lineHeight: 1, margin: 0, marginBottom: 6,
          textShadow: '0 2px 20px rgba(0,0,0,0.9)',
          fontFamily: '"Noto Serif KR","Nanum Myeongjo",serif',
        }}>
          {templeName}
        </h1>

        {/* ③ 한자명 */}
        {templeNameHanja && (
          <p style={{
            fontSize: 'clamp(14px,2.5vw,22px)', color: 'rgba(201,168,76,0.85)',
            letterSpacing: '0.25em', margin: 0, marginBottom: 12,
            fontFamily: '"Noto Serif KR",serif',
          }}>
            {templeNameHanja}
          </p>
        )}

        {/* ④ 프로그레스 바 */}
        <div style={{ width: '100%', maxWidth: 360, marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: 'rgba(240,223,160,0.85)', marginBottom: 5 }}>
            {currentCount.toLocaleString()}기 / {targetCount.toLocaleString()}기 점등
          </div>
          <div style={{
            width: '100%', height: 6, background: 'rgba(255,255,255,0.1)',
            borderRadius: 3, overflow: 'hidden',
          }}>
            <div style={{
              width: `${pct}%`, height: '100%', borderRadius: 3,
              background: 'linear-gradient(90deg, #c9a84c, #f6e05e)',
              transition: 'width 0.8s',
            }} />
          </div>
        </div>

        {/* ⑤ 차수 진행 표시 */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 12 }}>
          {[1, 2, 3, 4, 5, 6].map(r => {
            const done = r < currentRound
            const active = r === currentRound
            return (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{
                  width: active ? 14 : 10, height: active ? 14 : 10,
                  borderRadius: '50%', display: 'inline-block',
                  background: done ? '#c9a84c' : active ? '#ffffff' : 'rgba(255,255,255,0.15)',
                  border: active ? '2px solid #c9a84c' : done ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  boxShadow: active ? '0 0 8px rgba(201,168,76,0.6)' : 'none',
                }} />
                <span style={{
                  fontSize: 9, color: active ? '#c9a84c' : done ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.25)',
                  fontWeight: active ? 700 : 400,
                }}>
                  {r}차
                </span>
                {r < 6 && <span style={{ width: 8, height: 1, background: done ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.1)' }} />}
              </div>
            )
          })}
        </div>

        {/* ⑥ 부제 */}
        <p style={{ fontSize: 13, color: 'rgba(240,223,160,0.8)', margin: 0, marginBottom: 16 }}>
          {tagline}
        </p>

        {/* ⑦ CTA */}
        <a href={ctaLink} style={{
          display: 'inline-block', pointerEvents: 'auto',
          padding: '12px 28px', background: '#c9a84c', color: '#1a1200',
          fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none',
          letterSpacing: '0.04em',
        }}>
          인등 동참하기 →
        </a>
      </div>
    </section>
  )
}
