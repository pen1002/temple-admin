'use client'
// H-08: 촛불법당형 히어로 — 1080 사찰 표준 (보림사 검증 완료)
// bgCanvas(정적 법당 배경) + fCanvas(촛불 RAF 애니메이션) 2-Canvas 구조
import { useEffect, useRef } from 'react'

export interface CandleHeroProps {
  /** 사찰명 한글 */
  templeName:      string
  /** 사찰명 한자 */
  templeNameHanja: string
  /** 배지 텍스트 */
  badge:           string
  /** 설명 3줄 */
  taglines:        string[]
  /** 상단 CTA */
  ctaPrimary:      { text: string; href: string }
  /** 보조 CTA */
  ctaSecondary:    { text: string; href: string }
  /** 촛불 수 (기본 7, 모바일 자동 4) */
  candleCount?:    number
  /** 배경 최상단 어두운 색 (기본 #070201) */
  bgColor?:        string
  /** 주불 타입 — 현재 'vairocana'만 지원 */
  buddhaType?:     string
}

const GOLD = '#C9A84C'

// ── Candle data ───────────────────────────────────────────────────────────────
interface Candle {
  xRatio: number
  yRatio: number
  h:      number
  w:      number
  phase:  number
  fspeed: number
  famp:   number
}

function makeCandles(count: number): Candle[] {
  const pos7 = [0.18, 0.28, 0.38, 0.50, 0.62, 0.72, 0.82]
  const pos4 = [0.25, 0.38, 0.62, 0.75]
  const pos  = count <= 4 ? pos4 : pos7.slice(0, count)
  return pos.map(xRatio => {
    const d = Math.abs(xRatio - 0.5)
    return {
      xRatio,
      yRatio:  0.616 - (d < 0.08 ? 0.006 : 0),
      h:       (d < 0.08 ? 54 : d < 0.2 ? 45 : 38) + Math.random() * 14,
      w:       d < 0.08 ? 11 : 9,
      phase:   Math.random() * Math.PI * 2,
      fspeed:  0.035 + Math.random() * 0.065,
      famp:    2.5 + Math.random() * 4.0,
    }
  })
}

// ── 정적 법당 배경 ─────────────────────────────────────────────────────────────
function drawHall(ctx: CanvasRenderingContext2D, w: number, h: number, baseBg = '#070201') {
  const bgG = ctx.createLinearGradient(0, 0, 0, h)
  bgG.addColorStop(0,    baseBg)
  bgG.addColorStop(0.55, '#0f0503')
  bgG.addColorStop(1,    '#1a0a06')
  ctx.fillStyle = bgG
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = '#110503'
  ctx.fillRect(0, 0, w, h * 0.09)

  ctx.fillStyle = '#250e07'
  const bW = Math.max(8, w * 0.014)
  for (let i = 1; i < 4; i++) {
    ctx.fillRect((w / 4) * i - bW / 2, 0, bW, h * 0.09)
  }

  const pW  = Math.max(22, w * 0.032)
  const pXs = [0.05, 0.165, 0.28]
  for (const xr of pXs) {
    const lx = xr * w
    const lg = ctx.createLinearGradient(lx, 0, lx + pW, 0)
    lg.addColorStop(0, '#2c1208'); lg.addColorStop(0.28, '#5a2612')
    lg.addColorStop(0.65, '#481e0e'); lg.addColorStop(1, '#1e0c06')
    ctx.fillStyle = lg
    ctx.fillRect(lx, 0, pW, h)
    ctx.fillStyle = 'rgba(105,45,14,0.25)'
    ctx.fillRect(lx + pW * 0.30, 0, 1.5, h)
    ctx.fillStyle = '#7a3016'
    ctx.fillRect(lx - 4, 0, pW + 8, 9)

    const rx = w - xr * w - pW
    const rg = ctx.createLinearGradient(rx, 0, rx + pW, 0)
    rg.addColorStop(0, '#1e0c06'); rg.addColorStop(0.35, '#481e0e')
    rg.addColorStop(0.72, '#5a2612'); rg.addColorStop(1, '#2c1208')
    ctx.fillStyle = rg
    ctx.fillRect(rx, 0, pW, h)
    ctx.fillStyle = 'rgba(105,45,14,0.25)'
    ctx.fillRect(rx + pW * 0.58, 0, 1.5, h)
    ctx.fillStyle = '#7a3016'
    ctx.fillRect(rx - 4, 0, pW + 8, 9)
  }

  const fy = h * 0.70
  const fG = ctx.createLinearGradient(0, fy, 0, h)
  fG.addColorStop(0, '#130803'); fG.addColorStop(1, '#1d0e07')
  ctx.fillStyle = fG
  ctx.fillRect(0, fy, w, h - fy)

  ctx.strokeStyle = 'rgba(88,34,10,0.20)'
  ctx.lineWidth = 0.7
  for (let i = 1; i <= 3; i++) {
    const y = fy + (h - fy) * (i / 3)
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
  }
  for (let i = 0; i <= 10; i++) {
    const x = (w / 10) * i
    ctx.beginPath(); ctx.moveTo(x, fy); ctx.lineTo(x, h); ctx.stroke()
  }

  const aW = Math.min(w * 0.54, 480)
  const aX = (w - aW) / 2
  const aY = h * 0.62
  const aH = h * 0.08
  const aG = ctx.createLinearGradient(aX, aY, aX, aY + aH)
  aG.addColorStop(0, '#4a2010'); aG.addColorStop(1, '#261208')
  ctx.fillStyle = aG
  ctx.fillRect(aX, aY, aW, aH)
  const aeG = ctx.createLinearGradient(aX, aY, aX + aW, aY)
  aeG.addColorStop(0, '#683010'); aeG.addColorStop(0.5, '#964e24'); aeG.addColorStop(1, '#683010')
  ctx.fillStyle = aeG
  ctx.fillRect(aX, aY, aW, 4)
  ctx.fillStyle = 'rgba(108,42,12,0.5)'
  ctx.fillRect(aX, aY + aH - 9, aW, 9)

  const cgY = h * 0.35
  const cg  = ctx.createRadialGradient(w * 0.5, cgY, 0, w * 0.5, cgY, w * 0.45)
  cg.addColorStop(0, 'rgba(150,100,25,0.10)'); cg.addColorStop(0.5, 'rgba(120,75,15,0.05)'); cg.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = cg
  ctx.fillRect(0, 0, w, h)
}

// ── 촛불 프레임 드로우 ─────────────────────────────────────────────────────────
function drawCandle(ctx: CanvasRenderingContext2D, c: Candle, cw: number, ch: number) {
  c.phase += c.fspeed
  const cx    = c.xRatio * cw
  const yB    = c.yRatio * ch
  const flk   = Math.sin(c.phase) * c.famp
              + Math.sin(c.phase * 2.1) * c.famp * 0.42
              + Math.sin(c.phase * 0.67) * c.famp * 0.18
  const fH    = 20 + Math.abs(flk) * 0.45
  const ftx   = cx + flk * 0.55
  const fBase = yB - c.h - 3
  const fTop  = fBase - fH

  const rg = ctx.createRadialGradient(cx, yB + 8, 0, cx, yB + 8, c.w * 3.8)
  rg.addColorStop(0, 'rgba(190,130,42,0.22)'); rg.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = rg
  ctx.beginPath(); ctx.ellipse(cx, yB + 8, c.w * 3.8, 7, 0, 0, Math.PI * 2); ctx.fill()

  const gy = yB - c.h - fH * 0.5
  const ag = ctx.createRadialGradient(cx, gy, 0, cx, gy, c.w * 6.2)
  ag.addColorStop(0, 'rgba(255,182,60,0.52)'); ag.addColorStop(0.25, 'rgba(218,125,35,0.30)')
  ag.addColorStop(0.6, 'rgba(172,72,16,0.12)'); ag.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = ag
  ctx.beginPath(); ctx.ellipse(cx, gy, c.w * 6.2, c.w * 5.2, 0, 0, Math.PI * 2); ctx.fill()

  const bG = ctx.createLinearGradient(cx - c.w / 2, 0, cx + c.w / 2, 0)
  bG.addColorStop(0, '#b09070'); bG.addColorStop(0.28, '#ecdcc4')
  bG.addColorStop(0.72, '#d8c8a4'); bG.addColorStop(1, '#a07848')
  ctx.fillStyle = bG
  ctx.fillRect(cx - c.w / 2, yB - c.h, c.w, c.h)
  ctx.fillStyle = '#c0a878'
  ctx.beginPath(); ctx.ellipse(cx, yB - c.h, c.w / 2 + 1, 3.5, 0, 0, Math.PI * 2); ctx.fill()

  ctx.strokeStyle = '#1a0c04'; ctx.lineWidth = 1.2
  ctx.beginPath(); ctx.moveTo(cx, yB - c.h); ctx.lineTo(cx + flk * 0.22, yB - c.h - 5); ctx.stroke()

  ctx.fillStyle = 'rgba(255,125,12,0.92)'
  ctx.beginPath()
  ctx.moveTo(cx - c.w * 0.38, fBase)
  ctx.bezierCurveTo(cx - c.w * 0.54, fBase - fH * 0.52, ftx - c.w * 0.22, fTop, ftx, fTop - 4)
  ctx.bezierCurveTo(ftx + c.w * 0.22, fTop, cx + c.w * 0.54, fBase - fH * 0.52, cx + c.w * 0.38, fBase)
  ctx.closePath(); ctx.fill()

  ctx.fillStyle = 'rgba(255,208,48,0.88)'
  ctx.beginPath()
  ctx.moveTo(cx - c.w * 0.24, fBase - 2)
  ctx.bezierCurveTo(cx - c.w * 0.32, fBase - fH * 0.58, ftx - c.w * 0.14, fTop + 4, ftx, fTop + 2)
  ctx.bezierCurveTo(ftx + c.w * 0.14, fTop + 4, cx + c.w * 0.32, fBase - fH * 0.58, cx + c.w * 0.24, fBase - 2)
  ctx.closePath(); ctx.fill()

  ctx.fillStyle = 'rgba(255,255,238,0.88)'
  ctx.beginPath()
  ctx.ellipse(cx + flk * 0.18, fBase - fH * 0.32, c.w * 0.14, fH * 0.25, 0, 0, Math.PI * 2)
  ctx.fill()
}

// ── 주불 SVG (비로자나불 지권인 — 기본) ──────────────────────────────────────
function BuddhaSVG() {
  return (
    <svg
      viewBox="0 0 200 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 'clamp(136px, 20vw, 180px)', height: 'auto' }}
      aria-label="주불 좌상"
    >
      <circle cx="100" cy="68" r="62" stroke="#C9A84C" strokeWidth="2" strokeOpacity="0.42"/>
      <circle cx="100" cy="68" r="56" fill="rgba(201,168,76,0.06)"/>
      <circle cx="100" cy="68" r="51" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.26" strokeDasharray="3 2"/>
      <ellipse cx="100" cy="37" rx="12" ry="10" fill="#B8960A"/>
      <ellipse cx="100" cy="61" rx="24" ry="26" fill="#C9A84C"/>
      <ellipse cx="82"  cy="52" rx="4" ry="3" fill="#B8960A" opacity="0.44"/>
      <ellipse cx="90"  cy="47" rx="4" ry="3" fill="#B8960A" opacity="0.44"/>
      <ellipse cx="100" cy="45" rx="4" ry="3" fill="#B8960A" opacity="0.44"/>
      <ellipse cx="110" cy="47" rx="4" ry="3" fill="#B8960A" opacity="0.44"/>
      <ellipse cx="118" cy="52" rx="4" ry="3" fill="#B8960A" opacity="0.44"/>
      <path d="M88 63 Q92.5 60 97 63" stroke="#5A3800" strokeWidth="2" strokeLinecap="round"/>
      <path d="M103 63 Q107.5 60 112 63" stroke="#5A3800" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="92.5"  cy="63.5" rx="2" ry="1.5" fill="#3A2000" opacity="0.72"/>
      <ellipse cx="107.5" cy="63.5" rx="2" ry="1.5" fill="#3A2000" opacity="0.72"/>
      <circle cx="100" cy="58" r="2.5" fill="#FFE080" opacity="0.92"/>
      <path d="M97 69 Q95 73 93 74" stroke="#9A7820" strokeWidth="1" strokeLinecap="round"/>
      <path d="M103 69 Q105 73 107 74" stroke="#9A7820" strokeWidth="1" strokeLinecap="round"/>
      <path d="M93 79 Q100 83 107 79" stroke="#9A7820" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M76 62 Q70 68 71 80 Q73 87 78 84 Q81 80 80 72" fill="#C9A84C"/>
      <path d="M124 62 Q130 68 129 80 Q127 87 122 84 Q119 80 120 72" fill="#C9A84C"/>
      <rect x="90" y="85" width="20" height="13" rx="2" fill="#B8960A"/>
      <path d="M88 89 Q100 87 112 89" stroke="#8A6810" strokeWidth="1"/>
      <path d="M87 93 Q100 91 113 93" stroke="#8A6810" strokeWidth="1"/>
      <path d="M88 97 Q100 95 112 97" stroke="#8A6810" strokeWidth="1"/>
      <path d="M74 97 Q63 105 60 119 Q62 130 72 128" fill="#C9A84C"/>
      <path d="M126 97 Q137 105 140 119 Q138 130 128 128" fill="#C9A84C"/>
      <path d="M74 97 Q70 128 68 172 L132 172 Q130 128 126 97 Q113 107 100 107 Q87 107 74 97Z" fill="#C9A84C"/>
      <path d="M85 107 Q82 132 80 168" stroke="#9A7820" strokeWidth="1" opacity="0.48"/>
      <path d="M115 107 Q118 132 120 168" stroke="#9A7820" strokeWidth="1" opacity="0.48"/>
      <path d="M72 128 Q70 136 76 142 Q83 147 89 138" fill="#C9A84C"/>
      <path d="M128 128 Q130 136 124 142 Q117 147 111 138" fill="#C9A84C"/>
      <ellipse cx="92" cy="137" rx="13" ry="11" fill="#C9A84C"/>
      <rect x="96" y="120" width="8" height="18" rx="4" fill="#C9A84C"/>
      <line x1="97" y1="124" x2="103" y2="123" stroke="#9A7820" strokeWidth="0.8" opacity="0.65"/>
      <line x1="97" y1="128" x2="103" y2="127" stroke="#9A7820" strokeWidth="0.8" opacity="0.65"/>
      <line x1="97" y1="132" x2="103" y2="131" stroke="#9A7820" strokeWidth="0.8" opacity="0.65"/>
      <ellipse cx="109" cy="130" rx="14" ry="12" fill="#B8960A"/>
      <path d="M102 124 Q109 121 116 126" stroke="#9A7820" strokeWidth="0.8" opacity="0.65"/>
      <path d="M100 130 Q109 127 118 132" stroke="#9A7820" strokeWidth="0.8" opacity="0.65"/>
      <path d="M68 172 Q64 182 68 190 L132 190 Q136 182 132 172Z" fill="#C9A84C"/>
      <path d="M68 172 Q57 180 62 192 Q76 200 96 194" fill="#B8960A" opacity="0.70"/>
      <path d="M132 172 Q143 180 138 192 Q124 200 104 194" fill="#B8960A" opacity="0.70"/>
      <path d="M56 196 Q52 186 62 183 Q72 180 76 190Z" fill="#C9A84C"/>
      <path d="M76 190 Q74 180 84 178 Q94 176 94 187Z" fill="#B8960A"/>
      <path d="M94 187 Q94 177 100 176 Q106 177 106 187Z" fill="#C9A84C"/>
      <path d="M106 187 Q106 176 116 178 Q126 180 124 190Z" fill="#B8960A"/>
      <path d="M124 190 Q128 180 138 183 Q148 186 144 196Z" fill="#C9A84C"/>
      <ellipse cx="100" cy="197" rx="46" ry="10" fill="#8B6810"/>
      <path d="M58 197 Q56 187 65 185 Q74 183 76 193Z"    fill="#C9A84C" opacity="0.85"/>
      <path d="M76 193 Q76 183 85 182 Q94 181 94 191Z"    fill="#C9A84C" opacity="0.85"/>
      <path d="M94 191 Q95 182 100 181 Q105 182 106 191Z"  fill="#C9A84C"/>
      <path d="M106 191 Q106 181 115 182 Q124 183 124 193Z" fill="#C9A84C" opacity="0.85"/>
      <path d="M124 193 Q126 183 135 185 Q144 187 142 197Z" fill="#C9A84C" opacity="0.85"/>
      <ellipse cx="100" cy="193" rx="40" ry="8" fill="#9A7820"/>
      <text
        x="100" y="220"
        textAnchor="middle"
        fontSize="11"
        fontFamily="'Noto Serif KR', serif"
        fill="#C9A84C"
        letterSpacing="2"
        opacity="0.88"
      >
        南無毘盧遮那佛
      </text>
    </svg>
  )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function CandleHeroBlock({
  templeName,
  templeNameHanja,
  badge,
  taglines,
  ctaPrimary,
  ctaSecondary,
  candleCount = 7,
  bgColor     = '#070201',
}: CandleHeroProps) {
  const bgRef = useRef<HTMLCanvasElement>(null)
  const fgRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return
    const ctx = bg.getContext('2d')!
    const resize = () => {
      bg.width  = bg.offsetWidth
      bg.height = bg.offsetHeight
      drawHall(ctx, bg.width, bg.height, bgColor)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(bg)
    return () => ro.disconnect()
  }, [bgColor])

  useEffect(() => {
    const fc = fgRef.current
    if (!fc) return
    const ctx = fc.getContext('2d')!

    const isMobile  = () => window.innerWidth < 768
    let prevMobile  = isMobile()
    let candles     = makeCandles(isMobile() ? Math.min(candleCount, 4) : candleCount)

    const resize = () => {
      fc.width  = fc.offsetWidth
      fc.height = fc.offsetHeight
      const mobile = isMobile()
      if (mobile !== prevMobile) {
        prevMobile = mobile
        candles = makeCandles(mobile ? Math.min(candleCount, 4) : candleCount)
      }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(fc)

    let rafId: number
    const tick = () => {
      ctx.clearRect(0, 0, fc.width, fc.height)
      for (const c of candles) drawCandle(ctx, c, fc.width, fc.height)
      rafId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [candleCount])

  return (
    <>
      <style>{`
        @keyframes cdl-in {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cdl-badge {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cdl-btn:hover  { opacity: 0.84; }
        .cdl-btn:active { opacity: 0.68; }
      `}</style>

      <section
        style={{
          position:       'relative',
          minHeight:      '88vh',
          overflow:       'hidden',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'flex-start',
          paddingTop:     '2.5%',
          paddingBottom:  '5%',
        }}
      >
        <canvas ref={bgRef} aria-hidden style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }}/>
        <canvas ref={fgRef} aria-hidden style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:1, pointerEvents:'none' }}/>

        {/* 주불 SVG */}
        <div
          style={{
            position:  'relative',
            zIndex:    2,
            filter:    'drop-shadow(0 0 18px rgba(201,168,76,0.30)) drop-shadow(0 0 50px rgba(201,168,76,0.12))',
            animation: 'cdl-in 1.5s ease-out 0.2s both',
          }}
        >
          <BuddhaSVG />
        </div>

        {/* 텍스트 */}
        <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'0 24px', marginTop:'0.8rem' }}>
          <div
            style={{
              display:'inline-block', marginBottom:'0.75rem',
              padding:'5px 16px', borderRadius:9999,
              border:`1px solid ${GOLD}66`, background:`${GOLD}18`,
              fontSize:'clamp(10px,2vw,13px)', letterSpacing:'0.08em',
              color:GOLD, fontWeight:500,
              animation:'cdl-badge 0.8s ease-out 0.5s both',
            }}
          >
            {badge}
          </div>

          <div style={{ fontSize:'2.0rem', color:GOLD, marginBottom:'0.5rem', filter:`drop-shadow(0 0 9px ${GOLD})`, animation:'cdl-in 1s ease-out 0.6s both' }}>
            ☸
          </div>

          <h1
            style={{
              fontSize:'clamp(2.6rem,10.5vw,64px)', fontWeight:700,
              color:'#FFFFFF', letterSpacing:'0.15em', lineHeight:1.1,
              marginBottom:'0.3rem',
              textShadow:'0 0 36px rgba(255,255,255,0.18), 0 2px 12px rgba(0,0,0,0.92)',
              fontFamily:'"Noto Serif KR","Nanum Myeongjo",serif',
              animation:'cdl-in 1.2s ease-out 0.7s both',
            }}
          >
            {templeName}
          </h1>

          <p
            style={{
              fontSize:'clamp(0.95rem,2.8vw,1.35rem)', letterSpacing:'0.6em',
              color:GOLD, marginBottom:'1.1rem', fontWeight:300, opacity:0.88,
              animation:'cdl-in 1.2s ease-out 0.82s both',
            }}
          >
            {templeNameHanja}
          </p>

          <div style={{ marginBottom:'1.5rem', animation:'cdl-in 1.2s ease-out 0.95s both' }}>
            {taglines.map((line, i) => (
              <p
                key={i}
                style={{
                  fontSize:'clamp(12px,2vw,15px)',
                  color: i === 0 ? 'rgba(255,255,255,0.84)' : 'rgba(255,255,255,0.50)',
                  lineHeight:1.7, letterSpacing:'0.04em',
                  fontWeight: i === 0 ? 500 : 400,
                }}
              >
                {line}
              </p>
            ))}
          </div>

          <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', animation:'cdl-in 1.2s ease-out 1.1s both' }}>
            <a
              href={ctaPrimary.href}
              className="cdl-btn"
              style={{
                padding:'12px 26px', borderRadius:9999, fontWeight:700,
                fontSize:'clamp(13px,2vw,15px)', background:GOLD, color:'#1a1a1a',
                border:`2px solid ${GOLD}`, textDecoration:'none',
                transition:'opacity 0.2s', letterSpacing:'0.03em',
              }}
            >
              {ctaPrimary.text}
            </a>
            <a
              href={ctaSecondary.href}
              className="cdl-btn"
              style={{
                padding:'12px 26px', borderRadius:9999, fontWeight:600,
                fontSize:'clamp(13px,2vw,15px)', background:'transparent', color:'#FFFFFF',
                border:`2px solid ${GOLD}88`, textDecoration:'none',
                transition:'opacity 0.2s', letterSpacing:'0.03em',
              }}
            >
              {ctaSecondary.text}
            </a>
          </div>
        </div>

        <div
          style={{
            position:'absolute', bottom:'2rem', left:0, right:0,
            textAlign:'center', color:GOLD, opacity:0.38, zIndex:2,
            animation:'cdl-in 1s ease-out 1.8s both',
          }}
        >
          <span style={{ fontSize:'1.3rem' }}>↓</span>
        </div>
      </section>
    </>
  )
}
