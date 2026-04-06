"use client";
// H-06: Lamp 광명형 — 원뿔 빛줄기 + 치유 산림 테마 (#047857)
import type { TempleData } from "@/app/[slug]/_blocks/types";
import { LampContainer } from "@/components/ui/lamp";

interface Props {
  temple: TempleData;
  config?: Record<string, unknown>;
}

export default function HeroH06Lamp({ temple, config }: Props) {
  const badge     = config?.badge    as string | undefined;
  const heroHanja = config?.heroHanja as string | undefined;
  const heroDesc  = config?.heroDesc  as string | undefined;
  const cta1Label = config?.cta1Label as string | undefined;
  const cta1Href  = (config?.cta1Href as string) ?? "#notice";
  const cta2Label = config?.cta2Label as string | undefined;
  const cta2Href  = (config?.cta2Href as string) ?? "#visit";

  return (
    <LampContainer themeKey="forest">
      <div
        style={{
          position:  "relative",
          zIndex:    10,
          textAlign: "center",
          padding:   "0 24px",
          marginTop: "60px",
        }}
      >
        {/* 배지 */}
        {badge && (
          <p style={{
            display:       "inline-block",
            fontSize:      "clamp(10px,2vw,13px)",
            letterSpacing: "0.15em",
            color:         "#6ee7b7",
            border:        "1px solid #6ee7b744",
            borderRadius:  "9999px",
            padding:       "4px 16px",
            marginBottom:  "1.2rem",
          }}>
            {badge}
          </p>
        )}

        {/* 종단명 */}
        {temple.denomination && (
          <p style={{
            fontSize:      "clamp(11px,2.5vw,14px)",
            letterSpacing: "0.30em",
            color:         "#6ee7b7",
            marginBottom:  "0.6rem",
          }}>
            {temple.denomination}
          </p>
        )}

        {/* 한자 */}
        {heroHanja && (
          <p style={{
            fontSize:      "clamp(14px,3vw,18px)",
            color:         "rgba(110,231,183,0.55)",
            letterSpacing: "0.4em",
            marginBottom:  "0.3rem",
          }}>
            {heroHanja}
          </p>
        )}

        {/* 사찰명 */}
        <h1 style={{
          color:        "#FFFAF0",
          fontSize:     "clamp(2rem,8vw,3rem)",
          fontWeight:   700,
          marginBottom: "0.8rem",
          lineHeight:   1.2,
          textShadow:   "0 0 30px rgba(4,120,87,0.7)",
        }}>
          {temple.name}
        </h1>

        {/* heroDesc */}
        {heroDesc && (
          <p style={{
            fontSize:     "clamp(12px,2.2vw,14px)",
            color:        "rgba(209,250,229,0.75)",
            lineHeight:   1.8,
            maxWidth:     480,
            margin:       "0 auto 1.5rem",
            whiteSpace:   "pre-line",
          }}>
            {heroDesc}
          </p>
        )}

        {/* CTA */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={cta1Href} style={{
            display:        "inline-block",
            padding:        "12px 28px",
            borderRadius:   "9999px",
            fontWeight:     700,
            background:     "#047857",
            color:          "#d1fae5",
            textDecoration: "none",
            fontSize:       "clamp(13px,2vw,15px)",
          }}>
            {cta1Label ?? "공지사항 보기"}
          </a>
          {cta2Label && (
            <a href={cta2Href} style={{
              display:        "inline-block",
              padding:        "12px 28px",
              borderRadius:   "9999px",
              fontWeight:     600,
              background:     "transparent",
              color:          "#6ee7b7",
              border:         "2px solid #6ee7b7",
              textDecoration: "none",
              fontSize:       "clamp(13px,2vw,15px)",
            }}>
              {cta2Label}
            </a>
          )}
        </div>

        {/* 하단 바 */}
        <p style={{
          marginTop:     "3rem",
          fontSize:      12,
          color:         "rgba(110,231,183,0.4)",
          letterSpacing: "0.15em",
        }}>
          ☸ {temple.denomination} {temple.name}
        </p>
      </div>
    </LampContainer>
  );
}
