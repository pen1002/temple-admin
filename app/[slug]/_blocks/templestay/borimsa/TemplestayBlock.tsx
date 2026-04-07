// SEC13-01: 템플스테이 (보림사 전용)
import type { TempleData } from '../../types'

interface TSProgram {
  icon?: string
  name: string
  desc: string
}

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

export default function TemplestayBlock({ temple, config }: Props) {
  const title = typeof config.title === 'string' ? config.title : `${temple.name} 템플스테이`
  const desc = typeof config.desc === 'string' ? config.desc
    : '비자나무 숲 명상과 새벽 예불, 다선일미 차 명상 프로그램으로 도심의 피로를 씻어내세요.'
  const bookingUrl = typeof config.bookingUrl === 'string' ? config.bookingUrl : 'https://www.templestay.com'

  const defaultPrograms: TSProgram[] = [
    { icon: '🌿', name: '휴식형',     desc: '자유 명상 및 새벽 예불 참여' },
    { icon: '🍵', name: '체험형',     desc: '비자림 명상 + 다선일미 + 발우공양' },
    { icon: '🚶', name: '비자숲걷기', desc: '오전 프로그램 + 사찰 안내' },
  ]

  const programs: TSProgram[] = Array.isArray(config.programs) && (config.programs as TSProgram[]).length > 0
    ? (config.programs as TSProgram[])
    : defaultPrograms

  return (
    <section id="templestay" className="bt-section">
      <div className="bt-section-inner">
        <span className="bt-section-label">Temple Stay</span>
        <h2 className="bt-section-title">{title}</h2>
        <p className="bt-section-desc">{desc}</p>

        <div className="bt-templestay-grid">
          {programs.map((prog, i) => (
            <div key={i} className="bt-ts-card">
              {prog.icon && <div className="bt-ts-icon">{prog.icon}</div>}
              <h3>{prog.name}</h3>
              <p>{prog.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bt-visit-btn bt-visit-btn-primary"
          >
            템플스테이 예약하기
          </a>
          <p style={{ marginTop: 8, fontSize: '13px', color: '#666' }}>
            예약 문의: 061-864-2055
          </p>
        </div>
      </div>
    </section>
  )
}
