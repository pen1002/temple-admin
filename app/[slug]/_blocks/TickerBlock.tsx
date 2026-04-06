// T-01: 공지 티커 (뉴스 스크롤 배너)
import type { TemplateContent, TempleData } from './types'

interface Props {
  content: TemplateContent
  temple: TempleData
  config: Record<string, unknown>
}

export default function TickerBlock({ content, temple, config }: Props) {
  const speed = (config.speed as number) ?? 40

  const items: string[] =
    content.notices.length > 0
      ? content.notices.map(n => `📢 ${n.title}`)
      : [
          `${temple.name} 홈페이지에 오신 것을 환영합니다`,
          '📅 법회 및 행사 일정은 아래를 확인해주세요',
        ]

  const doubled = [...items, ...items]
  const animDuration = `${Math.max(items.length * speed, 20)}s`

  return (
    <section aria-label="공지 티커" style={{ background: '#2C5F2D', overflow: 'hidden', padding: '12px 0', whiteSpace: 'nowrap' }}>
      <div className="bt-ticker" style={{ background: 'transparent' }}>
        <div
          className="bt-ticker-track"
          style={{ animationDuration: animDuration }}
        >
          {doubled.map((item, i) => (
            <span key={i}>
              {item}
              <span style={{ margin: '0 24px', opacity: 0.4 }}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
