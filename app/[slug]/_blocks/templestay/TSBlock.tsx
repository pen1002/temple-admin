// TS 템플스테이 시리즈 — 사진형 카드 + 컬러 오버레이 (TS-01~03)
import type { TempleData } from '../types'

interface TSInfo {
  icon: string
  name: string
  subtitle: string
  duration: string
  tags: string[]
  desc: string
  highlights: string[]
  colorFrom: string
  colorTo: string
}

const TS_MAP: Record<string, TSInfo> = {
  'TS-01': {
    icon:       '🌿',
    name:       '자연 힐링 템플스테이',
    subtitle:   'Cool Green Retreat',
    duration:   '1박 2일',
    tags:       ['산림욕', '명상', '발우공양', '새벽예불'],
    desc:       '도시의 번잡함을 내려놓고 맑은 공기와 초록의 자연 속에서 몸과 마음을 회복하는 1박 2일 힐링 프로그램입니다.',
    highlights: ['새벽 4시 예불 체험', '108배 정진', '숲 걷기 명상', '스님과의 차담'],
    colorFrom:  '#2D6A4F',
    colorTo:    '#52B788',
  },
  'TS-02': {
    icon:       '🔥',
    name:       '발원 정진 템플스테이',
    subtitle:   'Warm Orange Journey',
    duration:   '2박 3일',
    tags:       ['기도정진', '참선', '경전공부', '울력'],
    desc:       '집중적인 기도와 참선 정진으로 자신을 돌아보는 2박 3일 심화 프로그램입니다. 소원 발원과 함께 새로운 원력을 세웁니다.',
    highlights: ['기도정진 3일', '오체투지 체험', '경전 사경', '소원지 봉안'],
    colorFrom:  '#F4A261',
    colorTo:    '#E76F51',
  },
  'TS-03': {
    icon:       '🏔️',
    name:       '산사 묵언 템플스테이',
    subtitle:   'Deep Forest Silence',
    duration:   '3박 4일',
    tags:       ['묵언수행', '좌선', '단식', '사경'],
    desc:       '깊은 산사의 고요 속에서 말과 생각을 내려놓는 3박 4일 묵언 수행 프로그램입니다. 자신의 본래면목을 마주하는 시간입니다.',
    highlights: ['24시간 묵언', '새벽 좌선 2시간', '산행 걷기 명상', '참선 지도'],
    colorFrom:  '#1B4332',
    colorTo:    '#2D6A4F',
  },
}

interface Props { blockType: string; temple: TempleData; config: Record<string, unknown> }

export default function TSBlock({ blockType, temple, config }: Props) {
  const info = TS_MAP[blockType]
  if (!info) return null

  const name       = (config.name       as string)   ?? info.name
  const subtitle   = (config.subtitle   as string)   ?? info.subtitle
  const duration   = (config.duration   as string)   ?? info.duration
  const desc       = (config.desc       as string)   ?? info.desc
  const icon       = (config.icon       as string)   ?? info.icon
  const tags       = (config.tags       as string[]) ?? info.tags
  const highlights = (config.highlights as string[]) ?? info.highlights
  const ctaText    = (config.ctaText    as string)   ?? '신청하기'
  const ctaHref    = (config.ctaHref    as string)   ?? '#templestay'
  const from       = (config.colorFrom  as string)   ?? info.colorFrom
  const to         = (config.colorTo    as string)   ?? info.colorTo

  return (
    <section
      id={`ts-${blockType}`}
      className="bt-section"
      style={{ background: 'var(--color-bg, #f8f4ee)' }}
    >
      <div className="bt-section-inner">
        <span className="bt-section-label">Temple Stay</span>
        <h2 className="bt-section-title">{name}</h2>

        <div style={{
          maxWidth: 660, margin: '40px auto 0',
          borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 8px 48px rgba(0,0,0,0.18)',
        }}>
          {/* 상단: 컬러 오버레이 히어로 */}
          <div style={{
            background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)`,
            padding: '48px 32px 40px',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* 추상 원형 장식 */}
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 200, height: 200, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: -20, left: -20,
              width: 120, height: 120, borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              pointerEvents: 'none',
            }} />

            {/* 아이콘 + 뱃지 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: '2.4rem', lineHeight: 1 }}>{icon}</span>
              <div>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.2)', color: '#fff',
                  fontSize: '.65rem', fontWeight: 700,
                  padding: '3px 10px', borderRadius: 20,
                  letterSpacing: '.08em', marginBottom: 4,
                }}>
                  {duration}
                </div>
                <p style={{ fontSize: '.72rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '.06em' }}>
                  {subtitle}
                </p>
              </div>
            </div>

            <h3 style={{
              fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', fontWeight: 900,
              color: '#fff', marginBottom: 12, letterSpacing: '-.01em',
              wordBreak: 'keep-all',
            }}>
              {name}
            </h3>
            <p style={{
              fontSize: '.88rem', lineHeight: 1.8,
              color: 'rgba(255,255,255,0.80)',
              wordBreak: 'keep-all', maxWidth: 460,
            }}>
              {desc}
            </p>

            {/* 태그 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
              {tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '.68rem', fontWeight: 700,
                  padding: '4px 12px', borderRadius: 20,
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 하단: 하이라이트 + CTA */}
          <div style={{ background: '#fff', padding: '28px 32px' }}>
            <p style={{
              fontSize: '.7rem', fontWeight: 800, color: from,
              letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 16,
            }}>
              프로그램 하이라이트
            </p>
            <ul style={{ margin: '0 0 24px', padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
              {highlights.map(h => (
                <li key={h} style={{
                  fontSize: '.84rem', color: '#3a3027',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${from}, ${to})`,
                    flexShrink: 0,
                  }} />
                  {h}
                </li>
              ))}
            </ul>
            <a href={ctaHref} style={{
              display: 'block', textAlign: 'center',
              padding: '13px 0', borderRadius: 14,
              background: `linear-gradient(90deg, ${from}, ${to})`,
              color: '#fff', fontWeight: 800, fontSize: '.95rem',
              textDecoration: 'none',
              boxShadow: `0 4px 20px ${from}40`,
            }}>
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
