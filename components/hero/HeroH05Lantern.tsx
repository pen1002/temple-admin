"use client";

import LanternLayer from "@/components/hero/LanternLayer";
import type { TempleData } from "@/app/[slug]/_blocks/types";

/* ──────────────────────────────────────────────
   H-05 — 연등 부유형 (LanternLayer 단독)
   z-index 구조:
     LanternLayer  : 1  (배경 연등)
     텍스트 콘텐츠  : 2  (최상위)
────────────────────────────────────────────── */

interface Props {
  temple: TempleData;
}

export default function HeroH05Lantern({ temple }: Props) {
  const primary = temple.primaryColor ?? "#8B2500";

  return (
    <section
      style={{
        position:        "relative",
        minHeight:       "88vh",
        background:      "#0a1020",
        overflow:        "hidden",
        display:         "flex",
        flexDirection:   "column",
        alignItems:      "center",
        justifyContent:  "center",
      }}
    >
      {/* 연등 레이어 — z-index: 1 */}
      <LanternLayer count={12} opacity={1.0} />

      {/* 하단 배경 그라디언트 */}
      <div
        aria-hidden="true"
        style={{
          position:   "absolute",
          inset:      0,
          background: `radial-gradient(ellipse 80% 60% at 50% 80%, ${primary}18 0%, transparent 70%)`,
          zIndex:     1,
          pointerEvents: "none",
        }}
      />

      {/* 텍스트 콘텐츠 — z-index: 2 */}
      <div
        style={{
          position:   "relative",
          zIndex:     2,
          textAlign:  "center",
          padding:    "0 24px",
          animation:  "h05-text-in 1.2s ease-out 0.4s both",
        }}
      >
        <style>{`
          @keyframes h05-text-in {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* 법륜 아이콘 */}
        <div
          style={{
            fontSize:   "3rem",
            marginBottom: "1.5rem",
            filter:     "drop-shadow(0 0 14px #D4AF37)",
            color:      "#D4AF37",
          }}
        >
          ☸
        </div>

        {/* 종단명 */}
        {temple.denomination && (
          <p
            style={{
              fontSize:      "clamp(11px, 2.5vw, 14px)",
              letterSpacing: "0.30em",
              color:         "rgba(255,200,100,0.70)",
              marginBottom:  "0.6rem",
              fontWeight:    300,
            }}
          >
            {temple.denomination}
          </p>
        )}

        {/* 사찰명 */}
        <h1
          style={{
            fontSize:    "clamp(2rem, 8vw, 3.5rem)",
            fontWeight:  700,
            color:       "#FCD34D",
            letterSpacing: "0.12em",
            lineHeight:  1.2,
            marginBottom: "0.6rem",
            textShadow:  `0 0 32px rgba(252,211,77,0.55), 0 2px 8px rgba(0,0,0,0.8)`,
          }}
        >
          {temple.name}
        </h1>

        {/* 영문명 */}
        {temple.nameEn && (
          <p
            style={{
              fontSize:      "clamp(13px, 2.2vw, 16px)",
              letterSpacing: "0.20em",
              color:         "rgba(196,168,130,0.75)",
              marginBottom:  "0.5rem",
            }}
          >
            {temple.nameEn}
          </p>
        )}

        {/* 주지스님 */}
        {temple.abbotName && (
          <p
            style={{
              fontSize:      "clamp(13px, 2vw, 15px)",
              color:         "#D4AF37",
              marginBottom:  "2rem",
            }}
          >
            주지 {temple.abbotName}
          </p>
        )}

        {/* CTA 버튼 2개 */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#location"
            style={{
              padding:         "12px 28px",
              borderRadius:    "9999px",
              fontWeight:      700,
              fontSize:        "clamp(13px, 2vw, 15px)",
              background:      primary,
              color:           "#FFFAF0",
              border:          `2px solid ${primary}`,
              textDecoration:  "none",
              transition:      "opacity 0.2s",
            }}
          >
            📍 오시는 길
          </a>
          <a
            href="#notice"
            style={{
              padding:         "12px 28px",
              borderRadius:    "9999px",
              fontWeight:      600,
              fontSize:        "clamp(13px, 2vw, 15px)",
              background:      "transparent",
              color:           "#FCD34D",
              border:          "2px solid #FCD34D",
              textDecoration:  "none",
              transition:      "opacity 0.2s",
            }}
          >
            📢 공지사항
          </a>
        </div>
      </div>

      {/* 하단 스크롤 힌트 */}
      <div
        style={{
          position:  "absolute",
          bottom:    "2rem",
          left:      0,
          right:     0,
          textAlign: "center",
          color:     "#D4AF37",
          opacity:   0.45,
          zIndex:    2,
          animation: "h05-text-in 1s ease-in-out 1.5s both",
        }}
      >
        <span style={{ fontSize: "1.4rem" }}>↓</span>
      </div>
    </section>
  );
}
