// T-01: 공지 티커 — 2단계 자동전환 (국가유산 1순위 / 공지행사 2순위)
import type { TemplateContent, TempleData } from './types'

interface Props {
  content: TemplateContent
  temple: TempleData
  config: Record<string, unknown>
}

interface HeritageTickerItem {
  grade: string  // 예: "국보 제44호"
  name:  string  // 예: "보림사 철조비로자나불좌상"
}

export default function TickerBlock({ content, temple, config }: Props) {
  // ── 1순위: 국가유산 ──────────────────────────────────────────────────────────
  // config.heritageItems: [{ grade, name }] 형식
  // config.staticItems:   string[] 형식 (기존 방식, 하위 호환)
  const heritageItems = config.heritageItems as HeritageTickerItem[] | undefined
  const staticItems   = config.staticItems   as string[]             | undefined

  let label: string
  let items: string[]

  if (heritageItems && heritageItems.length > 0) {
    label = '🏛 국가유산'
    items = heritageItems.map(h => `${h.grade} — ${h.name}`)
  } else if (staticItems && staticItems.length > 0) {
    label = '🏛 국가유산'
    items = staticItems
  } else {
    // ── 2순위: 공지 + 행사 ──────────────────────────────────────────────────
    label = '📢 공지·행사'
    const noticeItems = content.notices.slice(0, 3).map(n => `📢 ${n.title}`)
    const eventItems  = content.eventList.slice(0, 3).map(e => `🙏 ${e.name}`)
    items = [...noticeItems, ...eventItems]
    if (items.length === 0) {
      items = [
        `${temple.name} 홈페이지에 오신 것을 환영합니다`,
        '📅 법회 및 행사 일정은 아래를 확인해주세요',
      ]
    }
  }

  const doubled = [...items, ...items]

  // 사찰별 색상 분기 (2026.04.09 확정판) — borimsa는 기존 다크골드 유지
  const isHaeinsa  = temple.code === 'haeinsa'
  const bg         = isHaeinsa ? '#0a1a0a'              : '#0a0800'
  const labelColor = isHaeinsa ? '#4ade80'              : '#c9a84c'
  const itemColor  = isHaeinsa ? '#d1fae5'              : '#f0dfa0'
  const divider    = isHaeinsa ? 'rgba(74,222,128,0.3)' : 'rgba(201,168,76,0.3)'
  const sepColor   = isHaeinsa ? '#4ade80'              : '#c9a84c'

  return (
    <section
      aria-label="공지 티커"
      style={{
        background:    bg,
        overflow:      'hidden',
        height:        '56px',
        display:       'flex',
        alignItems:    'center',
        whiteSpace:    'nowrap',
        position:      'relative',
        flexShrink:    0,
      }}
    >
      <style>{`
        @keyframes bt-ticker-44s {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* 좌측 레이블 — 고정 */}
      <div style={{
        flexShrink:   0,
        padding:      '0 14px',
        fontSize:     '.85rem',
        fontWeight:   700,
        color:        labelColor,
        letterSpacing:'.06em',
        borderRight:  `1px solid ${divider}`,
        height:       '100%',
        display:      'flex',
        alignItems:   'center',
      }}>
        {label}
      </div>

      {/* 티커 트랙 */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{
          display:   'inline-flex',
          animation: 'bt-ticker-44s 44s linear infinite',
        }}>
          {doubled.map((item, i) => (
            <span
              key={i}
              style={{
                fontSize:      '.92rem',
                color:         itemColor,
                letterSpacing: '.03em',
                whiteSpace:    'nowrap',
              }}
            >
              {item}
              <span style={{ margin: '0 20px', color: sepColor, opacity: 0.6 }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
