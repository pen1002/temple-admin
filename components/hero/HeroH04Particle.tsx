"use client";

import { useEffect, useRef } from "react";
import type { TempleData } from "@/app/[slug]/_blocks/types";

/* ──────────────────────────────────────────────────────────────
   H-04 파티클 히어로 — Canvas RAF + ctx.clip() h1 Bounding Box
   z-index:  Canvas(2) / 텍스트 콘텐츠(3)
   기존 배지·버튼·텍스트 보존
────────────────────────────────────────────────────────────── */

const PARTICLE_COLORS = ["#D4AF37", "#F0D060", "#88ccdd", "#E8C840", "#FFE080", "#A0C8E8"];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; color: string;
  opacity: number; life: number; maxLife: number;
}

function spawnParticle(h1Rect: DOMRect, cvRect: DOMRect): Particle {
  const bx = h1Rect.left - cvRect.left;
  const by = h1Rect.top  - cvRect.top;
  return {
    x:       bx + Math.random() * h1Rect.width,
    y:       by + Math.random() * h1Rect.height,
    vx:      (Math.random() - 0.5) * 0.7,
    vy:      -(Math.random() * 0.55 + 0.1),
    size:    0.8 + Math.random() * 2,
    color:   PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    opacity: 0.45 + Math.random() * 0.5,
    life:    0,
    maxLife: 70 + Math.random() * 110,
  };
}

interface Props {
  temple: TempleData;
  config?: Record<string, unknown>;
}

export default function HeroH04Particle({ temple, config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const h1Ref     = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const h1El   = h1Ref.current;
    if (!canvas || !h1El) return;
    const cv  = canvas;
    const ctx = cv.getContext("2d")!;

    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    let particles: Particle[] = [];
    let rafId = 0;
    let frame = 0;

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, cv.width, cv.height);

      const h1Rect = h1El.getBoundingClientRect();
      const cvRect = cv.getBoundingClientRect();

      /* ── ctx.clip() — h1 bounding box ── */
      ctx.save();
      ctx.beginPath();
      ctx.rect(
        h1Rect.left - cvRect.left,
        h1Rect.top  - cvRect.top,
        h1Rect.width,
        h1Rect.height,
      );
      ctx.clip();

      /* 파티클 생성 */
      if (frame % 3 === 0 && particles.length < 65) {
        particles.push(spawnParticle(h1Rect, cvRect));
      }

      /* 업데이트 & 드로우 */
      particles = particles.filter(p => p.life <= p.maxLife);
      for (const p of particles) {
        p.x += p.vx + Math.sin(p.life * 0.06) * 0.25;
        p.y += p.vy;
        p.life++;
        const fade =
          p.life < 20             ? p.life / 20 :
          p.life > p.maxLife - 20 ? (p.maxLife - p.life) / 20 : 1;
        ctx.globalAlpha = p.opacity * fade;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, []);

  const primary = temple.primaryColor;

  /* config 타입 추출 */
  const badge       = config?.badge        as string   | undefined;
  const heroHanja   = config?.heroHanja    as string   | undefined;
  const heroDesc    = config?.heroDesc     as string   | undefined;
  const cta1Label   = config?.cta1Label    as string   | undefined;
  const cta1Href    = (config?.cta1Href    as string)  ?? "#notice";
  const cta2Label   = config?.cta2Label    as string   | undefined;
  const cta2Href    = (config?.cta2Href    as string)  ?? "#visit";

  return (
    <>
      {/* ── 메인 히어로 섹션 ─────────────────────── */}
      <section
        style={{
          position:       "relative",
          minHeight:      "88vh",
          background:     "#050810",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          overflow:       "hidden",
        }}
      >
        {/* Canvas — z-index: 2, h1 영역 내부만 파티클 */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position:      "absolute",
            inset:         0,
            width:         "100%",
            height:        "100%",
            zIndex:        2,
            pointerEvents: "none",
          }}
        />

        {/* 텍스트 콘텐츠 — z-index: 3 */}
        <div
          style={{
            position:  "relative",
            zIndex:    3,
            textAlign: "center",
            padding:   "0 24px",
          }}
        >
          {/* 배지 */}
          {badge && (
            <p
              style={{
                display:       "inline-block",
                fontSize:      "clamp(10px, 2vw, 13px)",
                letterSpacing: "0.15em",
                color:         "#88aacc",
                border:        "1px solid #88aacc44",
                borderRadius:  "9999px",
                padding:       "4px 16px",
                marginBottom:  "1.2rem",
              }}
            >
              {badge}
            </p>
          )}

          {/* 종단명 */}
          {temple.denomination && (
            <p
              style={{
                fontSize:      "clamp(11px, 2.5vw, 14px)",
                letterSpacing: "0.30em",
                color:         "#88aacc",
                marginBottom:  "0.6rem",
              }}
            >
              {temple.denomination}
            </p>
          )}

          {/* 한자 */}
          {heroHanja && (
            <p
              style={{
                fontSize:      "clamp(14px, 3vw, 18px)",
                color:         "rgba(212,175,55,0.55)",
                letterSpacing: "0.4em",
                marginBottom:  "0.3rem",
              }}
            >
              {heroHanja}
            </p>
          )}

          {/* 사찰명 h1 — RAF clip 타깃 */}
          <h1
            ref={h1Ref}
            style={{
              color:      "#FFFAF0",
              fontSize:   "clamp(2rem, 8vw, 3rem)",
              fontWeight: 700,
              marginBottom: "0.8rem",
              lineHeight: 1.2,
            }}
          >
            {temple.name}
          </h1>

          {/* 주지스님 */}
          {temple.abbotName && (
            <p style={{ color: "#D4AF37", marginBottom: "0.6rem" }}>
              주지 {temple.abbotName}
            </p>
          )}

          {/* heroDesc */}
          {heroDesc && (
            <p
              style={{
                fontSize:   "clamp(12px, 2.2vw, 14px)",
                color:      "rgba(196,168,130,0.75)",
                lineHeight: 1.8,
                maxWidth:   480,
                margin:     "0 auto 1.5rem",
                whiteSpace: "pre-line",
              }}
            >
              {heroDesc}
            </p>
          )}

          {/* CTA 버튼 */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={cta1Href}
              style={{
                display:        "inline-block",
                padding:        "12px 28px",
                borderRadius:   "9999px",
                fontWeight:     700,
                background:     "#D4AF37",
                color:          "#0d0a06",
                textDecoration: "none",
                fontSize:       "clamp(13px, 2vw, 15px)",
              }}
            >
              {cta1Label ?? "공지사항 보기"}
            </a>
            {cta2Label && (
              <a
                href={cta2Href}
                style={{
                  display:        "inline-block",
                  padding:        "12px 28px",
                  borderRadius:   "9999px",
                  fontWeight:     600,
                  background:     "transparent",
                  color:          "#D4AF37",
                  border:         "2px solid #D4AF37",
                  textDecoration: "none",
                  fontSize:       "clamp(13px, 2vw, 15px)",
                }}
              >
                {cta2Label}
              </a>
            )}
          </div>
        </div>
      </section>

    </>
  );
}
