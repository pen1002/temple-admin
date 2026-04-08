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

  return (
    <section
      aria-label="공지 티커"
      style={{
        background:    '#0a0800',
        overflow:      'hidden',
        height:        '44px',
        display:       'flex',
        alignItems:    'center',
        whiteSpace:    'nowrap',
        position:      'relative',
        flexShrink:    0,
      }}
    >
      <style>{`
        @keyframes bt-ticker-22s {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* 좌측 레이블 — 고정 */}
      <div style={{
        flexShrink:   0,
        padding:      '0 14px',
        fontSize:     '.7rem',
        fontWeight:   700,
        color:        '#c9a84c',
        letterSpacing:'.06em',
        borderRight:  '1px solid rgba(201,168,76,0.3)',
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
          animation: 'bt-ticker-22s 22s linear infinite',
        }}>
          {doubled.map((item, i) => (
            <span
              key={i}
              style={{
                fontSize:      '.78rem',
                color:         '#f0dfa0',
                letterSpacing: '.03em',
                whiteSpace:    'nowrap',
              }}
            >
              {item}
              <span style={{ margin: '0 20px', color: '#c9a84c', opacity: 0.6 }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
