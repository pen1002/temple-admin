// T-01: 공지 티커 (뉴스 스크롤 배너)
import type { TemplateContent, TempleData } from './types'

interface Props {
  content: TemplateContent
  temple: TempleData
  config: Record<string, unknown>
}

export default function TickerBlock({ content, temple, config }: Props) {
  const speed = (config.speed as number) ?? 40

  // Redis 공지사항이 있으면 사용, 없으면 기본 텍스트
  const items: string[] =
    content.notices.length > 0
      ? content.notices.map(n => `📢 ${n.title}`)
      : [
          `${temple.name} 홈페이지에 오신 것을 환영합니다`,
          '📅 법회 및 행사 일정은 아래를 확인해주세요',
        ]

  // 무한 루프를 위해 2배로 복제
  const doubled = [...items, ...items]

  const animDuration = `${Math.max(items.length * speed, 20)}s`

  return (
    <div
      className="overflow-hidden"
      style={{
        background: temple.primaryColor ?? '#2C5F2D',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      <div className="flex items-center">
        {/* 고정 라벨 */}
        <div
          className="flex-shrink-0 px-4 py-2 text-xs font-bold tracking-widest uppercase"
          style={{
            background: 'rgba(0,0,0,0.25)',
            color: '#fff',
            borderRight: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          NOTICE
        </div>

        {/* 스크롤 트랙 */}
        <div className="flex-1 overflow-hidden relative">
          <style>{`
            @keyframes ticker-scroll {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .ticker-track {
              display: flex;
              width: max-content;
              animation: ticker-scroll ${animDuration} linear infinite;
            }
            .ticker-track:hover { animation-play-state: paused; }
          `}</style>
          <div className="ticker-track">
            {doubled.map((item, i) => (
              <span
                key={i}
                className="inline-block whitespace-nowrap px-8 py-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.92)' }}
              >
                {item}
                <span className="mx-6 opacity-40">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
