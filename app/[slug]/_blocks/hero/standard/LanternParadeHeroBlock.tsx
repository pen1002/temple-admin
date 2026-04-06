'use client'
// H-10: 연등행렬형 히어로 — 부처님오신날 종로 연등행렬
// Canvas 단일 구조: Sky→Stars→Buildings→Road+Lamps→Ropes→Lanterns→반영→5열 군중
import { useEffect, useRef } from 'react'

export interface LanternParadeHeroProps {
  mainTitle?:     string   // 기본 "부처님 오신 날"
  subtitle?:      string   // 기본 "서울 종로 연등축제 · 불기 2569년"
  lanternCount?:  number   // 15–60, 기본 35
  glowIntensity?: number   // 1–5, 기본 3
}

const GOLD = '#C9A84C'

// ── Palette ───────────────────────────────────────────────────────────────────
const SKIN  = ['#FDBCB4','#F1C27D','#E0AC69','#C68642','#8D5524','#FFDBAC','#F5CBA7']
const CLTHS = [
  '#C53030','#9B2C2C','#C05621','#B7791F','#975A16',
  '#276749','#2F855A','#2C7A7B','#2B6CB0','#2C5282',
  '#553C9A','#97266D','#2D3748','#4A5568','#F7FAFC',
]
const LAN_C  = ['#E53E3E','#ED8936','#C9A84C','#ECC94B','#68D391','#4299E1','#9F7AEA','#F687B3','#FED7AA']
const HAT_C  = ['#2D3748','#744210','#1A365D','#22543D','#553C9A','#702459','#7B341E']

// ── Layout constants ──────────────────────────────────────────────────────────
const LAMP_XR  = [0.18, 0.38, 0.62, 0.82] as const
const ROAD_YR  = 0.57
const LTOP_YR  = 0.14
const ROPE_YFR = [0, 0.333, 0.667]  // fraction of (lampTop→road) for each rope
const ROPE_SAG = [0.030, 0.044, 0.056]  // sag as fraction of canvas height

// 5열 원근 군중
const ROW_CFG = [
  { yR: 0.645, sc: 0.26, spd: 0.000260, n: 20, al: 0.70 },
  { yR: 0.698, sc: 0.36, spd: 0.000360, n: 15, al: 0.78 },
  { yR: 0.756, sc: 0.50, spd: 0.000500, n: 11, al: 0.86 },
  { yR: 0.820, sc: 0.66, spd: 0.000660, n:  8, al: 0.93 },
  { yR: 0.900, sc: 0.84, spd: 0.000840, n:  5, al: 1.00 },
]

// ── Types ─────────────────────────────────────────────────────────────────────
interface Star     { xR: number; yR: number; r: number }
interface Building { xR: number; wR: number; hR: number; col: string; wr: number; wc: number; lit: boolean[][] }
interface Lantern  { rx: number; rope: 0|1|2; col: string; ph: number; sz: number; swayS: number }
interface Person   {
  x: number; row: number; wp: number; spd: number
  skin: string; cls: string; hat: 0|1|2; hatC: string
  scarf: boolean; scarfC: string
  hl: boolean; hlC: string; hlPh: number
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function hexRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function dk(h: string): string {
  const [r, g, b] = hexRgb(h)
  return `rgb(${Math.max(0,r-40)},${Math.max(0,g-40)},${Math.max(0,b-40)})`
}
function rnd(a: number, b: number) { return a + Math.random() * (b - a) }
function pick<T>(a: T[]): T { return a[Math.floor(Math.random() * a.length)] }
function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// ── Data generators ───────────────────────────────────────────────────────────
function makeStars(): Star[] {
  return Array.from({ length: 65 }, () => ({
    xR: Math.random(),
    yR: Math.random() * 0.54,
    r:  rnd(0.4, 1.7),
  }))
}

function makeBuildings(): Building[] {
  const ws = [0.065, 0.076, 0.055, 0.084, 0.070, 0.056, 0.080, 0.072, 0.062]
  const xs = [0.01,  0.09,  0.16,  0.23,  0.34,  0.44,  0.54,  0.64,  0.76 ]
  return ws.map((wR, i) => {
    const hR = rnd(0.14, 0.36)
    const wc = Math.max(2, Math.round(wR * 14))
    const wr = Math.max(3, Math.round(hR * 10))
    const lit: boolean[][] = Array.from({ length: wr }, () =>
      Array.from({ length: wc }, () => Math.random() < 0.52)
    )
    return {
      xR: xs[i], wR, hR,
      col: `hsl(220,${Math.round(rnd(5, 12))}%,${Math.round(rnd(8, 18))}%)`,
      wr, wc, lit,
    }
  })
}

function makeLanterns(count: number): Lantern[] {
  const result: Lantern[] = []
  const c0 = Math.ceil(count / 3)
  const c1 = Math.ceil(count / 3)
  const c2 = Math.max(4, count - c0 - c1)
  ;([c0, c1, c2] as [number, number, number]).forEach((n, ri) => {
    for (let i = 0; i < n; i++) {
      result.push({
        rx:    (i + 0.5) / n,
        rope:  ri as 0|1|2,
        col:   LAN_C[(ri * 5 + i) % LAN_C.length],
        ph:    Math.random() * Math.PI * 2,
        sz:    rnd(0.85, 1.15),
        swayS: 0.09 + Math.random() * 0.11,
      })
    }
  })
  return result
}

function makePeople(): Person[] {
  const out: Person[] = []
  ROW_CFG.forEach(({ n, spd }, row) => {
    for (let i = 0; i < n; i++) {
      const hl = Math.random() < 0.65
      out.push({
        x:    Math.random(),
        row,
        wp:   Math.random() * Math.PI * 2,
        spd:  spd * (0.88 + Math.random() * 0.24),
        skin: pick(SKIN), cls: pick(CLTHS),
        hat:  (Math.random() < 0.58 ? 0 : Math.random() < 0.5 ? 1 : 2) as 0|1|2,
        hatC: pick(HAT_C),
        scarf:  Math.random() < 0.40, scarfC: pick(LAN_C),
        hl, hlC: pick(LAN_C), hlPh: Math.random() * Math.PI * 2,
      })
    }
  })
  return out
}

// ── 1. Sky + Stars ────────────────────────────────────────────────────────────
function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, stars: Star[]) {
  const g = ctx.createLinearGradient(0, 0, 0, h * ROAD_YR)
  g.addColorStop(0,   '#04060e')
  g.addColorStop(0.6, '#060a18')
  g.addColorStop(1,   '#080c1e')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h * ROAD_YR)
  ctx.fillStyle = 'rgba(255,255,255,0.82)'
  for (const s of stars) {
    ctx.beginPath(); ctx.arc(s.xR * w, s.yR * h, s.r, 0, Math.PI * 2); ctx.fill()
  }
}

// ── 2. Buildings silhouette + 창문 불빛 ────────────────────────────────────────
function drawBuildings(ctx: CanvasRenderingContext2D, w: number, h: number, bs: Building[]) {
  const roadY = ROAD_YR * h
  for (const b of bs) {
    const bx = b.xR * w, bw = b.wR * w, bh = b.hR * h, by = roadY - bh
    ctx.fillStyle = b.col; ctx.fillRect(bx, by, bw, bh)
    const wW = bw / b.wc, wH = bh / b.wr
    for (let r = 0; r < b.wr; r++) {
      for (let c = 0; c < b.wc; c++) {
        const wx = bx + c * wW + wW * 0.22
        const wy = by + r * wH + wH * 0.18
        ctx.fillStyle = b.lit[r][c] ? 'rgba(255,185,80,0.92)' : 'rgba(8,8,20,0.80)'
        ctx.fillRect(wx, wy, wW * 0.56, wH * 0.64)
      }
    }
  }
}

// ── 3. Road + 가로등 4개 ──────────────────────────────────────────────────────
function drawRoad(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const roadY = ROAD_YR * h, roadH = h - roadY
  const rg = ctx.createLinearGradient(0, roadY, 0, h)
  rg.addColorStop(0, '#181826'); rg.addColorStop(1, '#0e0e1a')
  ctx.fillStyle = rg; ctx.fillRect(0, roadY, w, roadH)
  // 인도
  ctx.fillStyle = '#22223c'
  ctx.fillRect(0, roadY, w * 0.07, roadH)
  ctx.fillRect(w * 0.93, roadY, w * 0.07, roadH)
  // 중앙 점선
  ctx.strokeStyle = 'rgba(255,220,60,0.50)'; ctx.lineWidth = 2; ctx.setLineDash([18, 22])
  ctx.beginPath(); ctx.moveTo(w * 0.5, roadY); ctx.lineTo(w * 0.5, h); ctx.stroke()
  ctx.setLineDash([])
}

function drawLamps(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const roadY = ROAD_YR * h, ltY = LTOP_YR * h
  for (const xR of LAMP_XR) {
    const lx = xR * w
    ctx.strokeStyle = '#3a3a5c'; ctx.lineWidth = 3; ctx.lineCap = 'round'
    ctx.beginPath(); ctx.moveTo(lx, roadY); ctx.lineTo(lx, ltY + 6); ctx.stroke()
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(lx, ltY + 6); ctx.lineTo(lx - 14, ltY + 8); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(lx, ltY + 6); ctx.lineTo(lx + 14, ltY + 8); ctx.stroke()
    ctx.fillStyle = '#dcc870'; ctx.fillRect(lx - 6, ltY + 8, 12, 5)
    const gg = ctx.createRadialGradient(lx, ltY + 14, 0, lx, ltY + 14, 28)
    gg.addColorStop(0, 'rgba(230,195,90,0.45)'); gg.addColorStop(1, 'rgba(230,195,90,0)')
    ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(lx, ltY + 14, 28, 18, 0, 0, Math.PI * 2); ctx.fill()
  }
}

// ── 4. 로프 catenary (quadraticBezier 근사) ────────────────────────────────────
function ropeYAt(rx: number, ri: number, h: number): number {
  const roadY = ROAD_YR * h, ltY = LTOP_YR * h
  const baseY = ltY + (roadY - ltY) * ROPE_YFR[ri]
  const sag   = ROPE_SAG[ri] * h
  const anch  = [0, ...LAMP_XR, 1]
  for (let i = 0; i < anch.length - 1; i++) {
    if (rx >= anch[i] && rx <= anch[i + 1]) {
      const t = (rx - anch[i]) / (anch[i + 1] - anch[i])
      return baseY + Math.sin(t * Math.PI) * sag
    }
  }
  return baseY
}

function drawRopes(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const roadY = ROAD_YR * h, ltY = LTOP_YR * h
  const anchPx = [0, ...LAMP_XR.map(x => x * w), w]
  for (let ri = 0; ri < 3; ri++) {
    const baseY = ltY + (roadY - ltY) * ROPE_YFR[ri]
    const sag   = ROPE_SAG[ri] * h
    ctx.strokeStyle = 'rgba(90,70,50,0.80)'; ctx.lineWidth = 1.4
    ctx.beginPath(); ctx.moveTo(0, baseY)
    for (let i = 0; i < anchPx.length - 1; i++) {
      const x1 = anchPx[i], x2 = anchPx[i + 1], mx = (x1 + x2) / 2
      ctx.quadraticCurveTo(mx, baseY + sag, x2, baseY)
    }
    ctx.stroke()
  }
}

// ── 5. 연등 (9색 + glow + 술 장식) ────────────────────────────────────────────
function drawLanterns(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  lns: Lantern[], t: number, gm: number,
) {
  for (const ln of lns) {
    const sw = Math.sin(t * 0.00025 * ln.swayS + ln.ph) * 3
    const lx = ln.rx * w + sw
    const ly = ropeYAt(ln.rx, ln.rope, h) + 6
    const lw = 10 * ln.sz, lh = lw * 1.65
    const [r, g, b] = hexRgb(ln.col)
    const r2 = Math.max(0, r - 45), g2 = Math.max(0, g - 45), b2 = Math.max(0, b - 45)
    const r3 = Math.min(255, r + 35), g3 = Math.min(255, g + 35), b3 = Math.min(255, b + 35)

    // 줄
    ctx.strokeStyle = 'rgba(80,65,45,0.6)'; ctx.lineWidth = 0.9
    ctx.beginPath(); ctx.moveTo(lx, ly - 2); ctx.lineTo(lx, ly + 2); ctx.stroke()

    // glow
    const gr = ctx.createRadialGradient(lx, ly + lh / 2, 0, lx, ly + lh / 2, lw * 2.6 * gm)
    gr.addColorStop(0,   `rgba(${r},${g},${b},${0.48 * gm})`)
    gr.addColorStop(0.4, `rgba(${r},${g},${b},${0.22 * gm})`)
    gr.addColorStop(1,   `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = gr
    ctx.beginPath(); ctx.ellipse(lx, ly + lh / 2, lw * 2.6 * gm, lw * 2.4 * gm, 0, 0, Math.PI * 2); ctx.fill()

    // 몸통
    const bg = ctx.createLinearGradient(lx - lw / 2, 0, lx + lw / 2, 0)
    bg.addColorStop(0,    `rgba(${r2},${g2},${b2},0.9)`)
    bg.addColorStop(0.35, `rgba(${r3},${g3},${b3},0.95)`)
    bg.addColorStop(0.70, ln.col)
    bg.addColorStop(1,    `rgba(${r2},${g2},${b2},0.88)`)
    ctx.fillStyle = bg
    ctx.beginPath(); ctx.ellipse(lx, ly + lh / 2, lw / 2, lh / 2, 0, 0, Math.PI * 2); ctx.fill()

    // 내부 하이라이트
    ctx.fillStyle = 'rgba(255,240,200,0.14)'
    ctx.beginPath(); ctx.ellipse(lx - lw * 0.13, ly + lh * 0.35, lw * 0.18, lh * 0.22, 0, 0, Math.PI * 2); ctx.fill()

    // 상단 캡
    ctx.fillStyle = `rgba(${r2},${g2},${b2},0.9)`
    ctx.beginPath(); ctx.ellipse(lx, ly + 6, lw * 0.44, lh * 0.07, 0, 0, Math.PI * 2); ctx.fill()
    // 하단 캡
    ctx.beginPath(); ctx.ellipse(lx, ly + lh - 3, lw * 0.34, lh * 0.06, 0, 0, Math.PI * 2); ctx.fill()

    // 술 장식 3개
    ctx.lineWidth = 0.7
    for (const dx of [-lw * 0.22, 0, lw * 0.22]) {
      ctx.strokeStyle = ln.col
      ctx.beginPath(); ctx.moveTo(lx + dx, ly + lh - 2); ctx.lineTo(lx + dx * 1.2, ly + lh + 8); ctx.stroke()
      ctx.fillStyle = ln.col
      ctx.beginPath(); ctx.arc(lx + dx * 1.2, ly + lh + 9.5, 1.4, 0, Math.PI * 2); ctx.fill()
    }
  }
}

// ── 6. 노면 반영광 ─────────────────────────────────────────────────────────────
function drawLanternReflect(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  lns: Lantern[], t: number, gm: number,
) {
  const roadY = ROAD_YR * h
  ctx.save(); ctx.globalAlpha = 0.15 * gm
  for (const ln of lns) {
    const sw = Math.sin(t * 0.00025 * ln.swayS + ln.ph) * 3
    const lx = ln.rx * w + sw
    const [r, g, b] = hexRgb(ln.col)
    const rfl = ctx.createRadialGradient(lx, roadY, 0, lx, roadY, 22)
    rfl.addColorStop(0, `rgba(${r},${g},${b},0.6)`); rfl.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = rfl
    ctx.beginPath(); ctx.ellipse(lx, roadY, 22, 6, 0, 0, Math.PI * 2); ctx.fill()
  }
  ctx.restore()
}

// ── 7. 군중 — 단일 인물 드로잉 ────────────────────────────────────────────────
function drawPerson(
  ctx: CanvasRenderingContext2D,
  px: number, py: number, sc: number,
  p: Person, t: number, al: number,
) {
  // 보행: Math.sin(t*0.003+walkPhase)*2
  const wk  = Math.sin(t * 0.00075 + p.wp) * 2
  const bob = Math.abs(wk) * 0.9 * sc
  const fy  = py - bob

  ctx.save(); ctx.globalAlpha = al

  // 다리 (좌우 대칭 흔들기)
  const legA = wk * 0.38 * 0.5
  ctx.strokeStyle = dk(p.cls); ctx.lineWidth = 5 * sc; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(px, fy - 14 * sc)
  ctx.lineTo(px - Math.sin(legA) * 16 * sc, fy + Math.cos(legA) * 2 * sc); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(px, fy - 14 * sc)
  ctx.lineTo(px + Math.sin(legA) * 16 * sc, fy + Math.cos(legA) * 2 * sc); ctx.stroke()

  // 몸통
  ctx.fillStyle = p.cls; rrect(ctx, px - 9 * sc, fy - 36 * sc, 18 * sc, 22 * sc, 3 * sc); ctx.fill()

  // 목도리 (40% 확률)
  if (p.scarf) { ctx.fillStyle = p.scarfC; ctx.fillRect(px - 9 * sc, fy - 38 * sc, 18 * sc, 5 * sc) }

  // 팔
  const armA = -wk * 0.32 * 0.5
  ctx.lineWidth = 4 * sc; ctx.strokeStyle = p.cls
  const lAng = armA + Math.PI + 0.3
  ctx.beginPath(); ctx.moveTo(px - 8 * sc, fy - 31 * sc)
  ctx.lineTo(px - 8 * sc + Math.cos(lAng) * 14 * sc, fy - 31 * sc + Math.sin(lAng) * 14 * sc); ctx.stroke()
  const rAng = p.hl ? -0.80 : -armA - 0.3
  const rEx  = px + 8 * sc + Math.cos(rAng) * 14 * sc
  const rEy  = fy - 31 * sc + Math.sin(rAng) * 14 * sc
  ctx.beginPath(); ctx.moveTo(px + 8 * sc, fy - 31 * sc); ctx.lineTo(rEx, rEy); ctx.stroke()

  // 머리
  ctx.fillStyle = p.skin; ctx.beginPath(); ctx.arc(px, fy - 44 * sc, 7 * sc, 0, Math.PI * 2); ctx.fill()

  // 얼굴 (sc >= 0.42에서만)
  if (sc >= 0.42) {
    ctx.fillStyle = '#2D3748'
    ctx.beginPath(); ctx.arc(px - 2.5 * sc, fy - 45.5 * sc, 1.2 * sc, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(px + 2.5 * sc, fy - 45.5 * sc, 1.2 * sc, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#4A5568'; ctx.lineWidth = 1.2 * sc
    ctx.beginPath(); ctx.arc(px, fy - 42.8 * sc, 2.8 * sc, 0.15, Math.PI - 0.15); ctx.stroke()
  }

  // 모자 — 0:없음 / 1:중절모 / 2:비니
  if (p.hat === 1) {
    ctx.fillStyle = p.hatC
    ctx.beginPath(); ctx.ellipse(px, fy - 51 * sc, 7 * sc, 2.5 * sc, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillRect(px - 4.5 * sc, fy - 55 * sc, 9 * sc, 4.5 * sc)
    ctx.fillStyle = dk(p.hatC); ctx.fillRect(px - 4.5 * sc, fy - 51.2 * sc, 9 * sc, 1.4 * sc)
  } else if (p.hat === 2) {
    ctx.fillStyle = p.hatC
    ctx.beginPath(); ctx.ellipse(px, fy - 49 * sc, 7.5 * sc, 5.5 * sc, 0, Math.PI, Math.PI * 2); ctx.fill()
    ctx.fillRect(px - 7.5 * sc, fy - 50 * sc, 15 * sc, 6 * sc)
    ctx.fillStyle = 'rgba(255,255,255,0.28)'; ctx.fillRect(px - 7.5 * sc, fy - 52.5 * sc, 15 * sc, 2.2 * sc)
  }

  // 손 연등 (65% 확률) — pulse glow + 9색 랜덤
  if (p.hl) {
    const pulse = 1 + Math.sin(p.hlPh + t * 0.001) * 0.18
    const hx = rEx + 1 * sc, hy = rEy - 4 * sc
    const [r, g, b] = hexRgb(p.hlC)
    const gg = ctx.createRadialGradient(hx, hy, 0, hx, hy, 7 * sc * pulse)
    gg.addColorStop(0, `rgba(${r},${g},${b},0.68)`); gg.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(hx, hy, 7 * sc * pulse, 7 * sc * pulse, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = p.hlC; ctx.beginPath(); ctx.ellipse(hx, hy, 4 * sc, 6 * sc, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = 'rgba(0,0,0,0.32)'
    ctx.beginPath(); ctx.ellipse(hx, hy - 5.5 * sc, 3.5 * sc, 1.2 * sc, 0, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = p.hlC; ctx.lineWidth = 0.8 * sc
    ctx.beginPath(); ctx.moveTo(hx, hy + 6 * sc); ctx.lineTo(hx, hy + 10 * sc); ctx.stroke()
  }

  ctx.restore()
}

// ── 5열 원근 군중 (뒤→앞 순서) ───────────────────────────────────────────────
function drawPeople(ctx: CanvasRenderingContext2D, w: number, h: number, people: Person[], t: number) {
  for (let row = 0; row < 5; row++) {
    const { yR, sc, al } = ROW_CFG[row]
    for (const p of people) {
      if (p.row !== row) continue
      p.x += p.spd
      if (p.x > 1.08) p.x = -0.08
      drawPerson(ctx, p.x * w, yR * h, sc, p, t, al)
    }
  }
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LanternParadeHeroBlock({
  mainTitle     = '부처님 오신 날',
  subtitle      = '서울 종로 연등축제 · 불기 2569년',
  lanternCount  = 35,
  glowIntensity = 3,
}: LanternParadeHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    // Scene data init
    let stars     = makeStars()
    let buildings = makeBuildings()
    const lanterns = makeLanterns(lanternCount)
    const people   = makePeople()
    const glowMult = Math.max(0.5, Math.min(2.0, glowIntensity / 3))

    // Resize handler
    const resize = () => {
      if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) return
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      stars     = makeStars()
      buildings = makeBuildings()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let t = 0, rafId = 0
    const tick = () => {
      t++
      const cw = canvas.width, ch = canvas.height
      if (cw === 0 || ch === 0) { rafId = requestAnimationFrame(tick); return }

      drawSky(ctx, cw, ch, stars)
      drawBuildings(ctx, cw, ch, buildings)
      drawRoad(ctx, cw, ch)
      drawLamps(ctx, cw, ch)
      drawRopes(ctx, cw, ch)
      drawLanterns(ctx, cw, ch, lanterns, t, glowMult)
      drawLanternReflect(ctx, cw, ch, lanterns, t, glowMult)
      drawPeople(ctx, cw, ch, people, t)

      rafId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
    }
  }, [lanternCount, glowIntensity])

  return (
    <>
      <style>{`
        @keyframes ph-in {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ph-sub {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <section
        style={{
          position:  'relative',
          minHeight: '88vh',
          overflow:  'hidden',
          background:'#04060e',
        }}
      >
        {/* Canvas 단일 */}
        <canvas
          ref={canvasRef}
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            zIndex: 0,
          }}
        />

        {/* 텍스트 오버레이 */}
        <div
          style={{
            position:      'absolute',
            top:           '5%',
            left:          '50%',
            transform:     'translateX(-50%)',
            zIndex:        2,
            textAlign:     'center',
            pointerEvents: 'none',
            whiteSpace:    'nowrap',
          }}
        >
          <p
            style={{
              fontSize:      'clamp(0.62rem, 1.4vw, 0.86rem)',
              letterSpacing: '0.22em',
              color:         `${GOLD}cc`,
              marginBottom:  '0.35rem',
              fontWeight:    600,
              animation:     'ph-sub 1.2s ease-out 0.6s both',
            }}
          >
            ● 불기 2569년
          </p>
          <h1
            style={{
              fontSize:      'clamp(2.4rem, 7.5vw, 4.8rem)',
              fontWeight:    800,
              color:         GOLD,
              letterSpacing: '0.08em',
              lineHeight:    1.0,
              textShadow:    `0 0 28px ${GOLD}70, 0 0 72px ${GOLD}28, 0 2px 12px rgba(0,0,0,0.95)`,
              fontFamily:    '"Noto Serif KR","Nanum Myeongjo",serif',
              animation:     'ph-in 1.2s ease-out 0.2s both',
            }}
          >
            {mainTitle}
          </h1>
          <p
            style={{
              fontSize:      'clamp(0.76rem, 1.8vw, 1.04rem)',
              color:         'rgba(255,255,255,0.68)',
              letterSpacing: '0.08em',
              marginTop:     '0.5rem',
              textShadow:    '0 1px 6px rgba(0,0,0,0.88)',
              animation:     'ph-sub 1.2s ease-out 0.9s both',
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* 스크롤 힌트 */}
        <div
          style={{
            position:      'absolute',
            bottom:        '2rem',
            left:          0, right: 0,
            textAlign:     'center',
            color:         GOLD,
            opacity:       0.35,
            zIndex:        2,
            pointerEvents: 'none',
            animation:     'ph-sub 1s ease-out 2s both',
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>↓</span>
        </div>
      </section>
    </>
  )
}
