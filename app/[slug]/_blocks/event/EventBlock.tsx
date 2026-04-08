// EV 행사 시리즈 — 풀와이드 배너형 (EV-01~03)
import type { TempleData } from '../types'

interface EventInfo {
  icon: string
  name: string
  dateLabel: string
  tagline: string
  desc: string
  bg: [string, string]        // gradient stop 1, 2
  accent: string              // accent / badge color
  pattern: 'lotus' | 'lantern' | 'leaf'
}

const EVENT_MAP: Record<string, EventInfo> = {
  'EV-01': {
    icon:      '🪷',
    name:      '부처님오신날 봉축 행사',
    dateLabel: '음력 4월 8일',
    tagline:   '연등으로 밝히는 천년 도량의 밤',
    desc:      '한 해 가장 큰 불교 명절인 부처님오신날을 온 가족과 함께 봉축하는 특별한 행사입니다. 연등 제작, 봉축 법요식, 연등행렬이 함께 진행됩니다.',
    bg:        ['#1a0a2e', '#2d1b6e'],
    accent:    '#f7c948',
    pattern:   'lantern',
  },
  'EV-02': {
    icon:      '🌸',
    name:      '봄 자연 명상 행사',
    dateLabel: '매년 봄 (3~5월)',
    tagline:   '꽃비 내리는 도량에서 마음을 비우다',
    desc:      '봄꽃이 만발하는 계절에 진행되는 자연 명상 행사입니다. 숲 명상, 다도, 발우공양 체험 등 다양한 프로그램으로 구성됩니다.',
    bg:        ['#1a0f1a', '#3d1c3d'],
    accent:    '#f4a0c8',
    pattern:   'lotus',
  },
  'EV-03': {
    icon:      '🍂',
    name:      '가을 산사 음악회',
    dateLabel: '매년 가을 (9~11월)',
    tagline:   '단풍 물든 산사에 울려 퍼지는 선율',
    desc:      '가을 단풍과 함께하는 산사 음악회입니다. 국악·명상 음악 공연과 함께 차담 및 야간 도량 산책이 진행됩니다.',
    bg:        ['#1a0800', '#3d1800'],
    accent:    '#f4a04c',
    pattern:   'leaf',
  },
}

// SVG 패턴 컴포넌트들
function LanternPattern() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, pointerEvents: 'none' }}
      viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      {[30, 110, 200, 290, 370].map((x, i) => (
        <g key={i} transform={`translate(${x}, ${20 + (i % 2) * 40})`}>
          <ellipse cx={0} cy={30} rx={10} ry={20} fill="#f7c948" />
          <line x1={0} y1={0} x2={0} y2={10} stroke="#f7c948" strokeWidth={1.5} />
          <line x1={0} y1={50} x2={0} y2={65} stroke="#f7c948" strokeWidth={1} />
        </g>
      ))}
      {[60, 160, 250, 340].map((x, i) => (
        <g key={i} transform={`translate(${x}, ${120 + (i % 2) * 50})`}>
          <ellipse cx={0} cy={30} rx={8} ry={16} fill="#f7c948" />
          <line x1={0} y1={0} x2={0} y2={8} stroke="#f7c948" strokeWidth={1.5} />
          <line x1={0} y1={46} x2={0} y2={58} stroke="#f7c948" strokeWidth={1} />
        </g>
      ))}
    </svg>
  )
}

function LotusPattern() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}
      viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      {[[80, 80], [240, 60], [340, 160], [120, 200], [300, 230]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx}, ${cy})`}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, j) => (
            <ellipse key={j}
              cx={Math.cos(angle * Math.PI / 180) * 18}
              cy={Math.sin(angle * Math.PI / 180) * 18}
              rx={7} ry={14}
              transform={`rotate(${angle})`}
              fill="#f4a0c8" />
          ))}
          <circle cx={0} cy={0} r={6} fill="#f4a0c8" />
        </g>
      ))}
    </svg>
  )
}

function LeafPattern() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08, pointerEvents: 'none' }}
      viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
      {[[50, 50, 20], [150, 30, -15], [280, 70, 25], [370, 40, -10],
        [90, 160, 30], [210, 140, -20], [330, 180, 15], [30, 240, -25], [180, 260, 10], [340, 250, -30]].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x}, ${y}) rotate(${r})`}>
          <path d="M0,-20 C15,-10 15,10 0,20 C-15,10 -15,-10 0,-20" fill="#f4a04c" />
          <line x1={0} y1={-20} x2={0} y2={20} stroke="#f4a04c" strokeWidth={1} opacity={0.5} />
        </g>
      ))}
    </svg>
  )
}

interface Props { blockType: string; temple: TempleData; config: Record<string, unknown> }

export default function EventBannerBlock({ blockType, temple, config }: Props) {
  const info = EVENT_MAP[blockType]
  if (!info) return null

  const name      = (config.name      as string) ?? info.name
  const dateLabel = (config.dateLabel as string) ?? info.dateLabel
  const tagline   = (config.tagline   as string) ?? info.tagline
  const desc      = (config.desc      as string) ?? info.desc
  const icon      = (config.icon      as string) ?? info.icon
  const ctaText   = (config.ctaText   as string) ?? '행사 자세히 보기'
  const ctaHref   = (config.ctaHref   as string) ?? '#event'
  const [g1, g2]  = info.bg

  return (
    <section
      id={`ev-${blockType}`}
      style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${g1} 0%, ${g2} 60%, ${g1} 100%)`,
        overflow: 'hidden',
        padding: '80px 24px',
      }}
    >
      {/* 배경 패턴 */}
      {info.pattern === 'lantern' && <LanternPattern />}
      {info.pattern === 'lotus'   && <LotusPattern />}
      {info.pattern === 'leaf'    && <LeafPattern />}

      {/* 상단 광선 오버레이 */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '120%', height: '60%',
        background: `radial-gradient(ellipse at 50% 0%, ${info.accent}18 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        {/* 날짜 뱃지 */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: `${info.accent}25`, border: `1px solid ${info.accent}50`,
          borderRadius: 24, padding: '6px 18px', marginBottom: 24,
        }}>
          <span style={{ fontSize: '1.1rem' }}>{icon}</span>
          <span style={{ fontSize: '.75rem', fontWeight: 700, color: info.accent, letterSpacing: '.1em' }}>
            {dateLabel}
          </span>
        </div>

        {/* 메인 타이틀 */}
        <h2 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight: 900, color: '#fff',
          lineHeight: 1.25, letterSpacing: '-.01em',
          marginBottom: 16, wordBreak: 'keep-all',
        }}>
          {name}
        </h2>

        {/* 태그라인 */}
        <p style={{
          fontSize: 'clamp(.9rem, 2vw, 1.1rem)',
          color: info.accent, fontWeight: 600,
          letterSpacing: '.04em', marginBottom: 20,
          wordBreak: 'keep-all',
        }}>
          {tagline}
        </p>

        {/* 구분선 */}
        <div style={{
          width: 48, height: 2,
          background: `linear-gradient(90deg, transparent, ${info.accent}, transparent)`,
          margin: '0 auto 24px',
        }} />

        {/* 설명 */}
        <p style={{
          fontSize: '.92rem', lineHeight: 1.9,
          color: 'rgba(255,255,255,0.72)',
          marginBottom: 36, wordBreak: 'keep-all',
          maxWidth: 540, margin: '0 auto 36px',
        }}>
          {desc}
        </p>

        {/* CTA */}
        <a
          href={ctaHref}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 50,
            background: `linear-gradient(90deg, ${info.accent}, ${info.accent}cc)`,
            color: g1, fontWeight: 800, fontSize: '.95rem',
            textDecoration: 'none',
            boxShadow: `0 4px 24px ${info.accent}50`,
            letterSpacing: '.02em',
          }}
        >
          {ctaText}
          <span style={{ fontSize: '1rem' }}>→</span>
        </a>
      </div>
    </section>
  )
}
