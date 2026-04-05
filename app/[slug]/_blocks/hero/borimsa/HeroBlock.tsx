// H-05: 연등 부유형 (기본) | H-01: 파티클형 | H-02: 정지 이미지형
import type { TempleData } from '../../types'
import LanternLayer from '@/components/hero/LanternLayer'
import HeroH04Particle from '@/components/hero/HeroH04Particle'

interface Props {
  blockType: string
  temple: TempleData
  config?: Record<string, unknown>
}

// ── H-05 — LanternLayer 단독 (공통 컴포넌트 사용) ─────────────────────────────
function LanternHero({ temple }: { temple: TempleData }) {
  const primary = temple.primaryColor

  return (
    <>
      <style>{`
        @keyframes hero-text-in {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <section
        className="relative overflow-hidden"
        style={{
          background:     '#0a1020',
          minHeight:      '88vh',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        {/* 연등 레이어 — z-index: 1 */}
        <LanternLayer count={12} opacity={1.0} />

        {/* 배경 그라디언트 보조 */}
        <div
          aria-hidden
          style={{
            position:   'absolute',
            inset:      0,
            background: `radial-gradient(ellipse 80% 55% at 50% 80%, ${primary}18 0%, transparent 70%)`,
            zIndex:     1,
            pointerEvents: 'none',
          }}
        />

        {/* 메인 텍스트 — z-index: 2 */}
        <div
          className="relative text-center px-6"
          style={{ zIndex: 2, animation: 'hero-text-in 1.2s ease-out 0.3s both' }}
        >
          <div className="text-5xl mb-6" style={{ filter: 'drop-shadow(0 0 12px #D4AF37)' }}>☸</div>

          {temple.denomination && (
            <p className="text-sm tracking-[0.3em] mb-3" style={{ color: '#D4AF37' }}>
              {temple.denomination}
            </p>
          )}

          <h1
            className="font-bold mb-2 tracking-tight"
            style={{
              color:      '#FCD34D',
              fontSize:   'clamp(2rem, 8vw, 3.5rem)',
              lineHeight: 1.2,
              textShadow: `0 0 32px rgba(252,211,77,0.55), 0 2px 8px rgba(0,0,0,0.8)`,
            }}
          >
            {temple.name}
          </h1>

          {temple.nameEn && (
            <p className="text-base tracking-widest mb-4" style={{ color: '#C4A882', opacity: 0.8 }}>
              {temple.nameEn}
            </p>
          )}

          {temple.abbotName && (
            <p className="text-base mb-8" style={{ color: '#D4AF37' }}>
              주지 {temple.abbotName}
            </p>
          )}

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
              style={{ background: 'transparent', color: '#FCD34D', border: '2px solid #FCD34D' }}
            >
              📢 공지사항
            </a>
          </div>
        </div>

        {/* 하단 스크롤 힌트 */}
        <div
          className="absolute bottom-8 left-0 right-0 flex justify-center"
          style={{ color: '#D4AF37', opacity: 0.45, zIndex: 2 }}
        >
          <span className="text-2xl">↓</span>
        </div>
      </section>
    </>
  )
}

// ── H-01 — 파티클 + LanternLayer 합성형 ──────────────────────────────────────
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
        {/* 파티클 — z-index: 2 */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden style={{ zIndex: 2 }}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              style={{
                position:     'absolute',
                width:        `${1 + (i % 3)}px`,
                height:       `${1 + (i % 3)}px`,
                borderRadius: '50%',
                background:   i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#88ccdd' : '#F0D060',
                left:         `${(i * 11 + 3) % 96}%`,
                top:          `${(i * 7  + 5) % 92}%`,
                '--op':       `${0.3 + (i % 7) * 0.1}`,
                opacity:      `${0.3 + (i % 7) * 0.1}`,
                animation:    `particle-float ${4 + (i % 5)}s ease-in-out ${(i % 8) * 0.4}s infinite`,
              } as React.CSSProperties}
            />
          ))}
        </div>
        {/* 텍스트 — z-index: 3 */}
        <div className="relative text-center px-6" style={{ zIndex: 3 }}>
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

// ── H-02 — 정지 이미지형 ─────────────────────────────────────────────────────
function ImageHero({ temple }: { temple: TempleData }) {
  return (
    <section
      className="relative flex flex-col items-center justify-center"
      style={{
        minHeight:           '75vh',
        backgroundImage:     temple.heroImageUrl ? `url(${temple.heroImageUrl})` : undefined,
        backgroundColor:     temple.heroImageUrl ? undefined : temple.primaryColor,
        backgroundSize:      'cover',
        backgroundPosition:  'center',
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

// ── H-01 — LanternLayer(z:1) + 파티클(z:2) + 텍스트(z:3) ──────────────────
export function CombinedHero({ temple }: { temple: TempleData }) {
  const primary = temple.primaryColor

  return (
    <>
      <style>{`
        @keyframes combined-particle {
          0%,100%{transform:translateY(0) scale(1);opacity:var(--op)}
          50%{transform:translateY(-18px) scale(1.3);opacity:calc(var(--op)*1.5)}
        }
        @keyframes combined-text-in {
          from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)}
        }
      `}</style>
      <section
        className="relative overflow-hidden"
        style={{
          background:     `linear-gradient(160deg,#0d0a06,${primary}22,#100808)`,
          minHeight:      '88vh',
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
        }}
      >
        {/* 연등 레이어 — z-index: 1 */}
        <LanternLayer count={8} opacity={0.7} />

        {/* 파티클 — z-index: 2 */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{ zIndex: 2 }}
        >
          {[...Array(25)].map((_, i) => (
            <div
              key={`p${i}`}
              style={{
                position:     'absolute',
                width:        `${1 + (i % 3)}px`,
                height:       `${1 + (i % 3)}px`,
                borderRadius: '50%',
                background:   i % 3 === 0 ? '#D4AF37' : i % 3 === 1 ? '#88ccdd' : '#F0D060',
                left:         `${(i * 11 + 3) % 96}%`,
                top:          `${(i * 7 + 5) % 92}%`,
                '--op':       `${0.3 + (i % 7) * 0.1}`,
                opacity:      `${0.3 + (i % 7) * 0.1}`,
                animation:    `combined-particle ${4 + (i % 5)}s ease-in-out ${(i % 8) * 0.4}s infinite`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* 텍스트 — z-index: 3 */}
        <div
          className="relative text-center px-6"
          style={{ zIndex: 3, animation: 'combined-text-in 1.2s ease-out 0.3s both' }}
        >
          <div className="text-5xl mb-6" style={{ filter: 'drop-shadow(0 0 12px #D4AF37)' }}>☸</div>
          {temple.denomination && (
            <p className="text-sm tracking-[0.3em] mb-3" style={{ color: '#D4AF37' }}>
              {temple.denomination}
            </p>
          )}
          <h1
            className="font-bold mb-2"
            style={{
              color:      '#FFFAF0',
              fontSize:   'clamp(2rem,8vw,3.5rem)',
              textShadow: `0 0 30px ${primary}99`,
            }}
          >
            {temple.name}
          </h1>
          {temple.abbotName && (
            <p className="text-base mb-8" style={{ color: '#D4AF37' }}>주지 {temple.abbotName}</p>
          )}
          <div className="flex gap-3 justify-center">
            <a
              href="#location"
              className="px-6 py-3 rounded-full font-bold text-base"
              style={{ background: primary, color: '#FFFAF0' }}
            >
              📍 오시는 길
            </a>
            <a
              href="#notice"
              className="px-6 py-3 rounded-full font-semibold text-base"
              style={{ background: 'transparent', color: '#D4AF37', border: '2px solid #D4AF37' }}
            >
              📢 공지사항
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

// named exports
export { LanternHero, ParticleHero, ImageHero }

export default function HeroBlock({ blockType, temple, config }: Props) {
  if (blockType === 'H-01') return <CombinedHero temple={temple} />
  if (blockType === 'H-04') return <HeroH04Particle temple={temple} config={config} />
  if (blockType === 'H-02' || blockType === 'H-03') return <ImageHero temple={temple} />
  // H-05 기본값 (H-06 ~ H-10도 연등형으로 폴백)
  return <LanternHero temple={temple} />
}
