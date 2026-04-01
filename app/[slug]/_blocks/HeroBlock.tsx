// H-05: 연등 부유형 (기본) | H-01: 파티클형 | H-02: 정지 이미지형
import type { TempleData } from './types'

interface Props {
  blockType: string
  temple: TempleData
}

// H-05 — 연등 흔들림 부유 애니메이션
function LanternHero({ temple }: { temple: TempleData }) {
  const primary = temple.primaryColor
  const lanterns = [
    { x: 8,  size: 38, dur: 6.2, delay: 0,    color: '#E8341C', opacity: 0.85 },
    { x: 22, size: 28, dur: 7.8, delay: 1.5,  color: '#D4AF37', opacity: 0.70 },
    { x: 38, size: 44, dur: 5.5, delay: 0.8,  color: '#C41E3A', opacity: 0.90 },
    { x: 55, size: 32, dur: 8.1, delay: 2.3,  color: '#F0A830', opacity: 0.75 },
    { x: 68, size: 50, dur: 6.8, delay: 0.3,  color: '#E8341C', opacity: 0.95 },
    { x: 80, size: 30, dur: 7.2, delay: 1.8,  color: '#D4AF37', opacity: 0.65 },
    { x: 90, size: 36, dur: 5.9, delay: 3.1,  color: '#C41E3A', opacity: 0.80 },
    { x: 48, size: 24, dur: 9.0, delay: 4.0,  color: '#F0A830', opacity: 0.60 },
    { x: 15, size: 20, dur: 6.5, delay: 2.7,  color: '#E8341C', opacity: 0.55 },
    { x: 75, size: 42, dur: 7.5, delay: 1.2,  color: '#D4AF37', opacity: 0.88 },
  ]

  return (
    <>
      <style>{`
        @keyframes lantern-sway {
          0%, 100% { transform: translateY(0px) rotate(-3deg) scale(1); }
          25%       { transform: translateY(-18px) rotate(3deg) scale(1.03); }
          50%       { transform: translateY(-28px) rotate(-2deg) scale(0.98); }
          75%       { transform: translateY(-14px) rotate(2deg) scale(1.02); }
        }
        @keyframes lantern-glow {
          0%, 100% { filter: drop-shadow(0 0 8px currentColor) brightness(1); }
          50%       { filter: drop-shadow(0 0 16px currentColor) brightness(1.3); }
        }
        @keyframes hero-text-in {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(160deg, #0d0a06 0%, ${primary}22 40%, #100808 100%)`,
          minHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 배경 연등들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          {lanterns.map((l, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${l.x}%`,
                bottom: `${10 + (i % 3) * 15}%`,
                animation: `lantern-sway ${l.dur}s ease-in-out ${l.delay}s infinite, lantern-glow ${l.dur * 1.3}s ease-in-out ${l.delay}s infinite`,
                color: l.color,
              }}
            >
              {/* 연등 SVG */}
              <svg width={l.size} height={Math.round(l.size * 1.5)} viewBox="0 0 40 60" opacity={l.opacity}>
                {/* 상단 고리 */}
                <rect x="18" y="0" width="4" height="6" rx="2" fill="currentColor" opacity="0.8" />
                {/* 연등 몸통 */}
                <ellipse cx="20" cy="30" rx="15" ry="22" fill="currentColor" opacity="0.9" />
                {/* 내부 빛 */}
                <ellipse cx="20" cy="28" rx="8" ry="14" fill="#FFEB80" opacity="0.4" />
                {/* 테두리 링 */}
                <ellipse cx="20" cy="18" rx="15" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                <ellipse cx="20" cy="42" rx="15" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
                {/* 하단 술 */}
                <line x1="18" y1="52" x2="16" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.7" />
                <line x1="20" y1="52" x2="20" y2="62" stroke="currentColor" strokeWidth="1" opacity="0.7" />
                <line x1="22" y1="52" x2="24" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.7" />
              </svg>
            </div>
          ))}
          {/* 금빛 빛망울 */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`p${i}`}
              style={{
                position: 'absolute',
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                borderRadius: '50%',
                background: i % 2 === 0 ? '#D4AF37' : '#F0D060',
                left: `${(i * 17 + 5) % 95}%`,
                top:  `${(i * 13 + 8) % 90}%`,
                opacity: 0.3 + (i % 5) * 0.1,
                animation: `lantern-glow ${3 + (i % 4)}s ease-in-out ${(i % 6) * 0.5}s infinite`,
              }}
            />
          ))}
        </div>

        {/* 메인 텍스트 */}
        <div
          className="relative z-10 text-center px-6"
          style={{ animation: 'hero-text-in 1.2s ease-out 0.3s both' }}
        >
          {/* 로고/아이콘 */}
          <div className="text-5xl mb-6" style={{ filter: 'drop-shadow(0 0 12px #D4AF37)' }}>☸</div>

          {/* 종단 */}
          {temple.denomination && (
            <p className="text-sm tracking-[0.3em] mb-3" style={{ color: '#D4AF37' }}>
              {temple.denomination}
            </p>
          )}

          {/* 사찰명 */}
          <h1
            className="font-bold mb-2 tracking-tight"
            style={{
              color: '#FFFAF0',
              fontSize: 'clamp(2rem, 8vw, 3.5rem)',
              lineHeight: 1.2,
              textShadow: `0 0 30px ${primary}99, 0 2px 8px rgba(0,0,0,0.8)`,
            }}
          >
            {temple.name}
          </h1>

          {/* 영문명 */}
          {temple.nameEn && (
            <p className="text-base tracking-widest mb-4" style={{ color: '#C4A882', opacity: 0.8 }}>
              {temple.nameEn}
            </p>
          )}

          {/* 주지스님 */}
          {temple.abbotName && (
            <p className="text-base mb-8" style={{ color: '#D4AF37' }}>
              주지 {temple.abbotName}
            </p>
          )}

          {/* CTA 버튼 */}
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="#location"
              className="px-6 py-3 rounded-full font-bold text-base transition-opacity active:opacity-70"
              style={{ background: primary, color: '#FFFAF0', border: `2px solid ${primary}` }}
            >
              📍 오시는 길
            </a>
            <a
              href="#notice"
              className="px-6 py-3 rounded-full font-semibold text-base transition-opacity active:opacity-70"
              style={{ background: 'transparent', color: '#D4AF37', border: '2px solid #D4AF37' }}
            >
              📢 공지사항
            </a>
          </div>
        </div>

        {/* 하단 스크롤 힌트 */}
        <div
          className="absolute bottom-8 left-0 right-0 flex justify-center"
          style={{ animation: 'lantern-sway 2s ease-in-out infinite', color: '#D4AF37', opacity: 0.5 }}
        >
          <span className="text-2xl">↓</span>
        </div>
      </section>
    </>
  )
}

// H-01 — 파티클 히어로 (CSS-only)
function ParticleHero({ temple }: { temple: TempleData }) {
  return (
    <>
      <style>{`
        @keyframes particle-float {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: var(--op); }
          33%       { transform: translateY(-20px) translateX(8px) scale(1.2); opacity: calc(var(--op) * 1.4); }
          66%       { transform: translateY(-10px) translateX(-6px) scale(0.9); opacity: calc(var(--op) * 0.7); }
        }
      `}</style>
      <section
        className="relative overflow-hidden flex flex-col items-center justify-center"
        style={{ background: '#050810', minHeight: '88vh' }}
      >
        {/* 파티클 */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
                borderRadius: '50%',
                background: i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#88ccdd' : '#F0D060',
                left: `${(i * 11 + 3) % 96}%`,
                top:  `${(i * 7  + 5) % 92}%`,
                '--op': `${0.3 + (i % 7) * 0.1}`,
                opacity: `${0.3 + (i % 7) * 0.1}`,
                animation: `particle-float ${4 + (i % 5)}s ease-in-out ${(i % 8) * 0.4}s infinite`,
              } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="relative z-10 text-center px-6">
          <div className="text-4xl mb-5" style={{ color: '#D4AF37' }}>✦</div>
          {temple.denomination && (
            <p className="text-sm tracking-[0.3em] mb-3" style={{ color: '#88aacc' }}>{temple.denomination}</p>
          )}
          <h1 className="font-bold mb-4" style={{ color: '#FFFAF0', fontSize: 'clamp(2rem, 8vw, 3rem)' }}>
            {temple.name}
          </h1>
          {temple.abbotName && (
            <p style={{ color: '#D4AF37' }} className="mb-8">주지 {temple.abbotName}</p>
          )}
          <a
            href="#notice"
            className="inline-block px-7 py-3 rounded-full font-bold"
            style={{ background: '#D4AF37', color: '#0d0a06' }}
          >
            공지사항 보기
          </a>
        </div>
      </section>
    </>
  )
}

// H-02 — 정지 이미지형
function ImageHero({ temple }: { temple: TempleData }) {
  return (
    <section
      className="relative flex flex-col items-center justify-center"
      style={{
        minHeight: '75vh',
        backgroundImage: temple.heroImageUrl ? `url(${temple.heroImageUrl})` : undefined,
        backgroundColor: temple.heroImageUrl ? undefined : temple.primaryColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 100%)' }}
      />
      <div className="relative z-10 text-center px-6">
        <h1 className="font-bold mb-3" style={{ color: '#FFFAF0', fontSize: 'clamp(1.8rem, 7vw, 3rem)' }}>
          {temple.name}
        </h1>
        {temple.denomination && (
          <p style={{ color: '#D4AF37' }} className="mb-2">{temple.denomination}</p>
        )}
        {temple.abbotName && (
          <p style={{ color: '#e0d0b8' }}>주지 {temple.abbotName}</p>
        )}
      </div>
    </section>
  )
}

export default function HeroBlock({ blockType, temple }: Props) {
  if (blockType === 'H-01' || blockType === 'H-04') return <ParticleHero temple={temple} />
  if (blockType === 'H-02' || blockType === 'H-03') return <ImageHero temple={temple} />
  // H-05 기본값 (H-06 ~ H-10도 연등형으로 폴백)
  return <LanternHero temple={temple} />
}
