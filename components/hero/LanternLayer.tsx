"use client";

import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────
   LanternLayer — Canvas RAF 연등 레이어
   position: absolute / width·height 100% / z-index: 1
   Props:
     count   — 연등 수 (기본 12 / 모바일 <768px 자동 절반)
     opacity — 전체 투명도 (기본 1.0)
────────────────────────────────────────────── */

const COLORS = [
  "#E53E3E", // 적색
  "#ED8936", // 주황
  "#D69E2E", // 금황
  "#C05621", // 진주황
  "#9B2335", // 심홍
  "#DD6B20", // 진주황-주황
] as const;

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

interface Lantern {
  baseX:      number;   // 0–1 비율
  y:          number;   // px (캔버스 좌표)
  size:       number;   // 연등 너비 px
  color:      string;
  rgb:        [number, number, number];
  swayAmp:    number;   // 좌우 진폭 px
  swaySpeed:  number;   // rad/s
  swayOffset: number;   // 초기 위상
  speed:      number;   // 부유 속도 px/frame
  alpha:      number;   // 개별 불투명도
}

function makeLanterns(cv: HTMLCanvasElement, count: number): Lantern[] {
  return Array.from({ length: count }, (_, i) => {
    const color = COLORS[i % COLORS.length];
    return {
      baseX:      (i + 0.5) / count + (Math.random() * 0.12 - 0.06),
      y:          i < count / 2
                    ? Math.random() * cv.height           // 초기 일부는 화면 안
                    : cv.height + Math.random() * cv.height * 0.5,
      size:       22 + Math.random() * 22,
      color,
      rgb:        hexToRgb(color),
      swayAmp:    14 + Math.random() * 22,
      swaySpeed:  0.45 + Math.random() * 0.75,
      swayOffset: Math.random() * Math.PI * 2,
      speed:      0.35 + Math.random() * 0.55,
      alpha:      0.55 + Math.random() * 0.4,
    };
  });
}

function drawLantern(
  ctx: CanvasRenderingContext2D,
  l: Lantern,
  cv: HTMLCanvasElement,
  t: number,
  globalOpacity: number,
) {
  const x = l.baseX * cv.width + l.swayAmp * Math.sin(t * l.swaySpeed + l.swayOffset);
  const y = l.y;
  const w = l.size;
  const h = w * 1.65;
  const [r, g, b] = l.rgb;

  ctx.save();
  ctx.globalAlpha = l.alpha * globalOpacity;

  /* 매달린 줄 */
  ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(x, y - h * 0.5 - 10);
  ctx.lineTo(x, y - h * 0.5);
  ctx.stroke();

  /* 외부 글로우 — 몸통 위에 shadowBlur 적용 */
  const r2 = Math.min(r + 55, 255), g2 = Math.min(g + 35, 255), b2 = Math.min(b + 15, 255);
  const grad = ctx.createRadialGradient(x - w * 0.14, y - h * 0.1, w * 0.04, x, y, w * 0.62);
  grad.addColorStop(0,   `rgba(${r2},${g2},${b2},0.95)`);
  grad.addColorStop(0.5, `rgba(${r},${g},${b},0.90)`);
  grad.addColorStop(1,   `rgba(${Math.round(r * 0.55)},${Math.round(g * 0.55)},${Math.round(b * 0.55)},0.82)`);

  ctx.shadowColor = `rgb(${r},${g},${b})`;
  ctx.shadowBlur  = w * 0.85;
  ctx.fillStyle   = grad;
  ctx.beginPath();
  ctx.ellipse(x, y, w * 0.42, h * 0.50, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  /* 내부 불빛 glow — rgba(255,220,120,0.22) */
  const glow = ctx.createRadialGradient(x, y - h * 0.07, 0, x, y - h * 0.07, w * 0.38);
  glow.addColorStop(0, "rgba(255,220,120,0.22)");
  glow.addColorStop(1, "rgba(255,220,120,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(x, y - h * 0.05, w * 0.38, h * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();

  /* 하이라이트 */
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.beginPath();
  ctx.ellipse(x - w * 0.12, y - h * 0.16, w * 0.11, h * 0.17, -0.3, 0, Math.PI * 2);
  ctx.fill();

  /* 상단 캡 */
  const capColor = `rgba(${Math.round(r * 0.65)},${Math.round(g * 0.65)},${Math.round(b * 0.65)},0.88)`;
  ctx.fillStyle = capColor;
  ctx.beginPath();
  ctx.ellipse(x, y - h * 0.46, w * 0.38, h * 0.065, 0, 0, Math.PI * 2);
  ctx.fill();

  /* 하단 캡 */
  ctx.fillStyle = capColor;
  ctx.beginPath();
  ctx.ellipse(x, y + h * 0.44, w * 0.30, h * 0.055, 0, 0, Math.PI * 2);
  ctx.fill();

  /* 술 장식 (3가닥) */
  const tasselOffsets = [-0.22, 0, 0.22];
  tasselOffsets.forEach((off, ti) => {
    const tx  = x + off * w;
    const ty  = y + h * 0.47;
    const len = 9 + (ti === 1 ? 4 : 0);
    ctx.strokeStyle = `rgba(${r},${g},${b},0.75)`;
    ctx.lineWidth   = 0.8;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx + off * 2.5, ty + len);
    ctx.stroke();
    ctx.fillStyle = `rgba(${r},${g},${b},0.88)`;
    ctx.beginPath();
    ctx.arc(tx + off * 2.5, ty + len + 1.5, 1.4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

export interface LanternLayerProps {
  count?:   number;
  opacity?: number;
}

export default function LanternLayer({ count = 12, opacity = 1.0 }: LanternLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cv = canvas;

    /* 캔버스 크기 동기화 */
    const setSize = () => {
      cv.width  = cv.offsetWidth;
      cv.height = cv.offsetHeight;
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(cv);

    /* 모바일(768px 미만) 자동 절반 조정 */
    const isMobile = () => window.innerWidth < 768;
    const resolvedCount = () => (isMobile() ? Math.min(count, 6) : count);

    const ctx = cv.getContext("2d")!;
    let lanterns = makeLanterns(cv, resolvedCount());

    /* 창 크기 변경 시 count 재계산 */
    let prevMobile = isMobile();
    const onResize = () => {
      const mobile = isMobile();
      if (mobile !== prevMobile) {
        prevMobile = mobile;
        lanterns = makeLanterns(cv, resolvedCount());
      }
    };
    window.addEventListener("resize", onResize);

    let t      = 0;
    let rafId  = 0;

    const animate = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      t += 0.016;

      lanterns.forEach(l => {
        l.y -= l.speed;
        /* 화면 위로 사라지면 맨 아래에서 재시작 */
        if (l.y < -(l.size * 2)) {
          l.y      = cv.height + l.size;
          l.baseX  = Math.random();
        }
        drawLantern(ctx, l, cv, t, opacity);
      });

      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [count, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
        zIndex:        1,
      }}
    />
  );
}
