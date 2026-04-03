// components/ui/lamp.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   테마 1번 · 황금 연등 (Gold Lantern)
   파티클·빛 색상 변수 중앙 관리
───────────────────────────────────────────── */
export const LAMP_THEMES = {
  gold: {
    bgFrom:       "#3d1a00",
    bgMid:        "#1a0800",
    bgBase:       "#0a0500",
    glowColor:    "#ffd700",
    glowAccent:   "#ff8c00",
    barCenter:    "#fffbe0",
    coneRgba:     "255,165,0",
    particleColors: [
      "rgba(255,215,0,",
      "rgba(255,180,50,",
      "rgba(255,140,0,",
      "rgba(255,230,100,",
      "rgba(200,140,0,",
    ],
    lantern: {
      outer:        "#c85000",
      inner:        "#ffd700",
      highlight:    "#fffde0",
      stripe:       "#7a3d00",
      cap:          "#8B6914",
      capMid:       "#a07820",
      capTop:       "#c8960a",
      tassel:       "#c8960a",
      tasselAccent: "#ffd700",
      char:         "#7a3d00",
    },
  },
  red: {
    bgFrom:       "#3d0000",
    bgMid:        "#1a0000",
    bgBase:       "#050000",
    glowColor:    "#ff4444",
    glowAccent:   "#cc0000",
    barCenter:    "#ffe0e0",
    coneRgba:     "255,80,50",
    particleColors: [
      "rgba(255,80,50,",
      "rgba(255,50,30,",
      "rgba(200,30,10,",
      "rgba(255,120,80,",
      "rgba(180,20,0,",
    ],
    lantern: {
      outer:        "#8b0000",
      inner:        "#ff4500",
      highlight:    "#ffe0d0",
      stripe:       "#5a0000",
      cap:          "#6b1010",
      capMid:       "#8b2020",
      capTop:       "#c83030",
      tassel:       "#c83030",
      tasselAccent: "#ff6060",
      char:         "#5a0000",
    },
  },
} as const;

export type LampThemeKey = keyof typeof LAMP_THEMES;

/* ─────────────────────────────────────────────
   파티클 캔버스
───────────────────────────────────────────── */
function ParticleCanvas({ colors }: { colors: readonly string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const cv = canvas;
    const ctx = cv.getContext("2d")!;

    const resize = () => {
      cv.width  = cv.offsetWidth;
      cv.height = cv.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    class Particle {
      x = 0; y = 0; size = 1;
      speedX = 0; speedY = 0;
      opacity = 0.5; color = "";
      life = 0; maxLife = 150; currentOpacity = 0;

      constructor(init = false) { this.reset(init); }

      reset(init: boolean) {
        this.x        = Math.random() * cv.width;
        this.y        = init ? Math.random() * cv.height : cv.height + 10;
        this.size     = Math.random() * 2.5 + 0.5;
        this.speedY   = -(Math.random() * 0.8 + 0.2);
        this.speedX   = (Math.random() - 0.5) * 0.4;
        this.opacity  = Math.random() * 0.7 + 0.2;
        this.color    = colors[Math.floor(Math.random() * colors.length)];
        this.life     = 0;
        this.maxLife  = Math.random() * 200 + 100;
        if (!init && Math.random() > 0.3) {
          this.x = cv.width / 2 + (Math.random() - 0.5) * 200;
          this.y = cv.height * 0.35 + (Math.random() - 0.5) * 80;
        }
      }

      update() {
        this.x += this.speedX + Math.sin(this.life * 0.05) * 0.3;
        this.y += this.speedY;
        this.life++;
        if (this.y < -10 || this.life > this.maxLife) this.reset(false);
        const fade =
          this.life < 20             ? this.life / 20
          : this.life > this.maxLife - 30 ? (this.maxLife - this.life) / 30
          : 1;
        this.currentOpacity = this.opacity * fade;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${this.currentOpacity})`;
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 120 }, (_, i) => new Particle(i < 60));
    let rafId: number;
    const animate = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      particles.forEach(p => { p.update(); p.draw(); });
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, [colors]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 1,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   연등 SVG
───────────────────────────────────────────── */
type LanternColors = { outer: string; inner: string; highlight: string; stripe: string; cap: string; capMid: string; capTop: string; tassel: string; tasselAccent: string; char: string };
function LanternSvg({ c }: { c: LanternColors }) {
  const WRINKLES = [100, 120, 140, 158, 176, 194, 210];
  const TASSELS  = [
    { x1: 96,  x2: 88,  ey: 285 },
    { x1: 105, x2: 100, ey: 288 },
    { x1: 110, x2: 110, ey: 292 },
    { x1: 115, x2: 120, ey: 288 },
    { x1: 124, x2: 132, ey: 285 },
  ];

  return (
    <svg width="220" height="300" viewBox="0 0 220 300"
      xmlns="http://www.w3.org/2000/svg" aria-label="황금 연등" role="img">
      <defs>
        <radialGradient id="lg" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor={c.highlight} stopOpacity="1" />
          <stop offset="40%"  stopColor={c.inner}     stopOpacity="1" />
          <stop offset="100%" stopColor={c.outer}      stopOpacity="1" />
        </radialGradient>
        <radialGradient id="ig" cx="50%" cy="45%" r="45%">
          <stop offset="0%"   stopColor={c.highlight} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c.highlight} stopOpacity="0"   />
        </radialGradient>
        <filter id="lg-glow">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* 줄 */}
      <line x1="110" y1="0" x2="110" y2="30" stroke={c.capTop} strokeWidth="1.5" opacity="0.8" />

      {/* 상단 캡 */}
      <rect x="82" y="28" width="56" height="8" rx="2" fill={c.cap}    opacity="0.9" />
      <rect x="88" y="23" width="44" height="7" rx="2" fill={c.capMid} opacity="0.8" />
      <rect x="98" y="18" width="24" height="7" rx="2" fill={c.capTop} opacity="0.7" />

      {/* 외광 */}
      <ellipse cx="110" cy="155" rx="72" ry="88"
        fill="url(#lg)" filter="url(#lg-glow)" opacity="0.45" />
      {/* 본체 */}
      <ellipse cx="110" cy="155" rx="62" ry="78" fill="url(#lg)" />
      {/* 내광 */}
      <ellipse cx="110" cy="145" rx="42" ry="55" fill="url(#ig)" opacity="0.7" />

      {/* 가로 주름 */}
      <g opacity="0.35" stroke={c.stripe} strokeWidth="0.8" fill="none">
        {WRINKLES.map((y, i) => (
          <path key={y} d={`M ${50 + i * 2} ${y} Q 110 ${y - 5} ${170 - i * 2} ${y}`} />
        ))}
      </g>

      {/* 세로 주름 */}
      <g opacity="0.2" stroke={c.stripe} strokeWidth="0.6" fill="none">
        <path d="M 90 37 Q 85 155 92 232" />
        <path d="M 110 36 L 110 234" />
        <path d="M 130 37 Q 135 155 128 232" />
      </g>

      {/* 한자 */}
      <text x="110" y="163" textAnchor="middle"
        fontFamily="serif" fontSize="36" fontWeight="900"
        fill={c.char} opacity="0.25">佛</text>

      {/* 하단 캡 */}
      <rect x="84" y="230" width="52" height="7" rx="2" fill={c.cap}    opacity="0.8" />
      <rect x="90" y="237" width="40" height="6" rx="2" fill={c.capMid} opacity="0.7" />

      {/* 술 장식 */}
      {TASSELS.map((t, i) => (
        <g key={i}>
          <line x1={t.x1} y1="243" x2={t.x2} y2={t.ey - 4}
            stroke={i % 2 === 0 ? c.tassel : c.tasselAccent}
            strokeWidth={i === 2 ? 1.5 : 1} opacity="0.85" />
          <ellipse cx={t.x2} cy={t.ey}
            rx={i === 2 ? 3.5 : 3} ry={i === 2 ? 5 : 4}
            fill={i % 2 === 0 ? c.tassel : c.tasselAccent} opacity="0.9" />
        </g>
      ))}

      {/* 하이라이트 */}
      <ellipse cx="85" cy="120" rx="12" ry="20" fill="white" opacity="0.12" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   LampContainer — 원본 구조 유지 + 테마 변수 적용
───────────────────────────────────────────── */
export interface LampContainerProps {
  children: React.ReactNode;
  className?: string;
  themeKey?: LampThemeKey;
}

export const LampContainer = ({
  children,
  className,
  themeKey = "gold",
}: LampContainerProps) => {
  const t = LAMP_THEMES[themeKey];

  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden w-full rounded-md z-0",
        className
      )}
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${t.bgFrom} 0%, ${t.bgMid} 40%, ${t.bgBase} 100%)`,
      }}
    >
      {/* 파티클 */}
      <ParticleCanvas colors={t.particleColors} />

      {/* 수직 줄기 */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 4, height: 80, filter: "blur(1px)",
        background: `linear-gradient(to bottom, ${t.glowColor}, ${t.glowAccent}88 60%, transparent)`,
        zIndex: 3, pointerEvents: "none",
      }} />

      {/* 수평 빛줄기 바 */}
      <motion.div
        initial={{ opacity: 0.5, width: "15rem" }}
        whileInView={{ opacity: 1, width: "min(500px, 85vw)" }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
        style={{
          position: "absolute", top: 78, left: "50%", transform: "translateX(-50%)",
          height: 3, filter: "blur(0.5px)",
          background: `linear-gradient(to right, transparent, ${t.glowColor} 20%, ${t.barCenter} 50%, ${t.glowColor} 80%, transparent)`,
          zIndex: 5, pointerEvents: "none",
        }}
      />

      {/* 빛 확산 */}
      <div style={{
        position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)",
        width: "min(600px, 95vw)", height: 400,
        background: `radial-gradient(ellipse 100% 60% at 50% 0%, ${t.glowColor}38 0%, ${t.glowColor}18 40%, transparent 80%)`,
        zIndex: 2, pointerEvents: "none",
      }} />

      {/* 중앙 글로우 */}
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [1, 0.75, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)",
          width: "min(320px, 55vw)", height: 200,
          background: `radial-gradient(ellipse 100% 80% at 50% 0%, ${t.glowColor}55 0%, transparent 70%)`,
          zIndex: 3, pointerEvents: "none",
        }}
      />

      {/* 좌측 빛살 */}
      <div style={{
        position: "absolute", top: 80, right: "50%",
        width: "min(300px, 42vw)", height: 600,
        background: `conic-gradient(from 250deg at 100% 0%, transparent 0deg, rgba(${t.coneRgba},0.18) 12deg, rgba(${t.coneRgba},0.08) 22deg, transparent 35deg)`,
        transformOrigin: "top right", zIndex: 2, pointerEvents: "none",
      }} />

      {/* 우측 빛살 */}
      <div style={{
        position: "absolute", top: 80, left: "50%",
        width: "min(300px, 42vw)", height: 600,
        background: `conic-gradient(from 110deg at 0% 0%, transparent 0deg, rgba(${t.coneRgba},0.18) 12deg, rgba(${t.coneRgba},0.08) 22deg, transparent 35deg)`,
        transformOrigin: "top left", zIndex: 2, pointerEvents: "none",
      }} />

      {/* 연등 */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "relative", zIndex: 5, marginTop: 20 }}
        className="lantern-mobile-scale"
      >
        <LanternSvg c={t.lantern} />
      </motion.div>

      {/* 하단 반사 */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
        background: `linear-gradient(to top, ${t.glowColor}0f, transparent)`,
        zIndex: 2, pointerEvents: "none",
      }} />

      {/* 슬롯 */}
      <div className="relative z-50 flex flex-col items-center px-5 mt-7">
        {children}
      </div>
    </div>
  );
};
