// components/blocks/TempleH06Hero.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LampContainer, LampThemeKey } from "@/components/ui/lamp";
import LanternLayer from "@/components/hero/LanternLayer";

/* ── Props 구조 (defaultProps와 1:1 일치) ── */
export interface TempleH06HeroProps {
  blockId:            string;
  denomination:       string;
  templeName:         string;
  subtitle:           string;
  description:        string;
  ctaLabel:           string;
  ctaHref:            string;
  theme:              LampThemeKey;
  mobileLanternScale: number;   // 0.0 ~ 1.0
}

/* ── defaultProps ── */
export const defaultProps: TempleH06HeroProps = {
  blockId:            "h06-default",
  denomination:       "대한불교조계종",
  templeName:         "천 관 사",
  subtitle:           "천년의 빛이 머무는 곳",
  description:        "마음의 등불을 밝혀\n진리의 길을 걷습니다",
  ctaLabel:           "홈페이지 바로가기",
  ctaHref:            "/about",
  theme:              "gold",
  mobileLanternScale: 0.8,
};

/* ── 컴포넌트 ── */
export default function TempleH06Hero(props: TempleH06HeroProps) {
  const {
    denomination, templeName, subtitle,
    description, ctaLabel, ctaHref,
    theme, mobileLanternScale,
  } = { ...defaultProps, ...props };

  return (
    <>
      {/* 모바일 스케일 CSS 변수 주입 */}
      <style>{`
        @media (max-width: 600px) {
          .lantern-mobile-scale {
            transform: scale(${mobileLanternScale}) !important;
            transform-origin: top center !important;
          }
        }
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&family=Noto+Sans+KR:wght@300;400;500&display=swap');
      `}</style>

      <LampContainer
        themeKey={theme}
        underlay={<LanternLayer count={6} opacity={0.5} />}
      >
        {/* 종단명 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: "clamp(11px, 2.5vw, 15px)",
            fontWeight: 300,
            color: "rgba(255,200,100,0.65)",
            letterSpacing: "0.25em",
            marginBottom: 6,
          }}
        >
          {denomination}
        </motion.p>

        {/* 사찰명 */}
        <motion.h1
          initial={{ opacity: 0.5, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: "clamp(22px, 5vw, 40px)",
            fontWeight: 700,
            color: "#ffeaa0",
            letterSpacing: "0.18em",
            textShadow: "0 0 30px rgba(255,180,0,0.8), 0 2px 8px rgba(0,0,0,0.6)",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {templeName}
        </motion.h1>

        {/* 구분선 */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            width: 60, height: 1,
            background: "linear-gradient(to right, transparent, #ffd700, transparent)",
            margin: "0 auto 16px",
            opacity: 0.7,
          }}
        />

        {/* 본문 설명 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: "clamp(12px, 2.2vw, 14px)",
            fontWeight: 400,
            color: "rgba(255,220,150,0.55)",
            lineHeight: 1.9,
            letterSpacing: "0.05em",
            maxWidth: 480,
            margin: "0 auto 6px",
            textAlign: "center",
            whiteSpace: "pre-line",
          }}
        >
          {description}
        </motion.p>

        {/* 부제 */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.7 }}
            style={{
              fontFamily: "'Noto Serif KR', serif",
              fontSize: "clamp(13px, 2.5vw, 16px)",
              color: "rgba(255,220,120,0.7)",
              letterSpacing: "0.1em",
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* CTA 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
        >
          <Link
            href={ctaHref}
            style={{
              display: "inline-block",
              padding: "12px 32px",
              border: "1px solid rgba(255,200,60,0.5)",
              color: "#ffd97d",
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: 13,
              letterSpacing: "0.2em",
              textDecoration: "none",
              background: "rgba(255,180,0,0.07)",
              transition: "all 0.3s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,180,0,0.15)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,215,0,0.8)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#fff5c0";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,180,0,0.07)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,200,60,0.5)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#ffd97d";
            }}
          >
            {ctaLabel} →
          </Link>
        </motion.div>
      </LampContainer>
    </>
  );
}
