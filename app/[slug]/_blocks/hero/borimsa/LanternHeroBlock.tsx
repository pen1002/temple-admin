'use client'
// H-05: 보림사 전용 연등 부유형 히어로
// 문수사와 동일한 색상·구조, 보림사 전용 텍스트 적용
import LanternLayer from '@/components/hero/LanternLayer'
import type { TempleData } from '../../types'

interface Props {
  temple: TempleData
}

export default function LanternHeroBlock({ temple }: Props) {
  const GOLD = '#C9A84C'

  return (
    <>
      <style>{`
        @keyframes brs-text-in {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes brs-badge-in {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .brs-cta:hover { opacity: 0.85; }
        .brs-cta:active { opacity: 0.7; }
      `}</style>

      <section
        style={{
          position:       'relative',
          minHeight:      '88vh',
          background:     'linear-gradient(180deg, #0a1a2e 0%, #1a3a4a 100%)',
          overflow:       'hidden',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        {/* 연등 레이어 — z-index: 1 */}
        <LanternLayer count={10} opacity={1.0} />

        {/* 배경 그라디언트 보조 */}
        <div
          aria-hidden
          style={{
            position:      'absolute',
            inset:         0,
            background:    `radial-gradient(ellipse 80% 55% at 50% 80%, ${GOLD}15 0%, transparent 70%)`,
            zIndex:        1,
            pointerEvents: 'none',
          }}
        />

        {/* 텍스트 콘텐츠 — z-index: 2 */}
        <div
          style={{
            position:  'relative',
            zIndex:    2,
            textAlign: 'center',
            padding:   '0 24px',
          }}
        >
          {/* 배지 */}
          <div
            style={{
              display:       'inline-block',
              marginBottom:  '1.2rem',
              padding:       '5px 16px',
              borderRadius:  9999,
              border:        `1px solid ${GOLD}66`,
              background:    `${GOLD}18`,
              fontSize:      'clamp(10px, 2vw, 13px)',
              letterSpacing: '0.08em',
              color:         GOLD,
              fontWeight:    500,
              animation:     'brs-badge-in 0.8s ease-out 0.2s both',
            }}
          >
            ● 한국 선종의 종가(宗家) · 천년 가지산문
          </div>

          {/* 법륜 아이콘 */}
          <div
            style={{
              fontSize:     '2.8rem',
              marginBottom: '1rem',
              filter:       `drop-shadow(0 0 14px ${GOLD})`,
              color:        GOLD,
              animation:    'brs-text-in 1s ease-out 0.3s both',
            }}
          >
            ☸
          </div>

          {/* 사찰명 — 한글 */}
          <h1
            style={{
              fontSize:     'clamp(3rem, 12vw, 72px)',
              fontWeight:   700,
              color:        '#FFFFFF',
              letterSpacing: '0.15em',
              lineHeight:   1.1,
              marginBottom: '0.3rem',
              textShadow:   `0 0 40px rgba(255,255,255,0.25), 0 2px 12px rgba(0,0,0,0.8)`,
              fontFamily:   '"Noto Serif KR", "Nanum Myeongjo", serif',
              animation:    'brs-text-in 1.2s ease-out 0.4s both',
            }}
          >
            {temple.name}
          </h1>

          {/* 한자 — 寶 林 寺 */}
          <p
            style={{
              fontSize:     'clamp(1rem, 3vw, 1.4rem)',
              letterSpacing: '0.6em',
              color:        GOLD,
              marginBottom: '1.4rem',
              fontWeight:   300,
              opacity:      0.9,
              animation:    'brs-text-in 1.2s ease-out 0.5s both',
            }}
          >
            寶 林 寺
          </p>

          {/* 설명 3줄 */}
          <div
            style={{
              marginBottom: '2rem',
              animation:    'brs-text-in 1.2s ease-out 0.6s both',
            }}
          >
            {[
              '천년의 깨달음에서 현대의 치유로',
              '한국 조계종의 모태, 동양 3보림의 하나',
              '가지산 깊은 숲에서 선(禪)의 향기를 만나다',
            ].map((line, i) => (
              <p
                key={i}
                style={{
                  fontSize:     'clamp(12px, 2vw, 15px)',
                  color:        i === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
                  lineHeight:   1.7,
                  letterSpacing: '0.04em',
                  fontWeight:   i === 0 ? 500 : 400,
                }}
              >
                {line}
              </p>
            ))}
          </div>

          {/* CTA 버튼 2개 */}
          <div
            style={{
              display:        'flex',
              gap:            '12px',
              justifyContent: 'center',
              flexWrap:       'wrap',
              animation:      'brs-text-in 1.2s ease-out 0.75s both',
            }}
          >
            <a
              href="#heritage"
              className="brs-cta"
              style={{
                padding:        '13px 28px',
                borderRadius:   9999,
                fontWeight:     700,
                fontSize:       'clamp(13px, 2vw, 15px)',
                background:     GOLD,
                color:          '#1a1a1a',
                border:         `2px solid ${GOLD}`,
                textDecoration: 'none',
                transition:     'opacity 0.2s',
                letterSpacing:  '0.03em',
              }}
            >
              국보·보물 보기
            </a>
            <a
              href="#templestay"
              className="brs-cta"
              style={{
                padding:        '13px 28px',
                borderRadius:   9999,
                fontWeight:     600,
                fontSize:       'clamp(13px, 2vw, 15px)',
                background:     'transparent',
                color:          '#FFFFFF',
                border:         '2px solid rgba(255,255,255,0.65)',
                textDecoration: 'none',
                transition:     'opacity 0.2s',
                letterSpacing:  '0.03em',
              }}
            >
              템플스테이 안내
            </a>
          </div>
        </div>

        {/* 하단 스크롤 힌트 */}
        <div
          style={{
            position:  'absolute',
            bottom:    '2rem',
            left:      0,
            right:     0,
            textAlign: 'center',
            color:     GOLD,
            opacity:   0.45,
            zIndex:    2,
            animation: 'brs-text-in 1s ease-out 1.5s both',
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>↓</span>
        </div>
      </section>
    </>
  )
}
