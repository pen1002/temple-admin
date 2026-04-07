// SEC13-01: 템플스테이
import type { TempleData } from './types'

interface TSProgram {
  icon: string
  name: string
  desc: string
  price?: string
  duration?: string
}

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

export default function TemplestayBlock({ temple, config }: Props) {
  const title = typeof config.title === 'string' ? config.title : `${temple.name} 템플스테이`
  const desc = typeof config.desc === 'string' ? config.desc
    : '비자나무 숲과 야생 차향이 어우러진 가지산 자연 속에서 비움과 쉼을 경험하세요'
  const bookingUrl = typeof config.bookingUrl === 'string' ? config.bookingUrl : 'https://www.templestay.com'

  const defaultPrograms: TSProgram[] = [
    { icon: '🌿', name: '비자숲길 걷기 (휴식형)', desc: '일상에 지친 몸과 마음을 달래는 호젓한 자유 포행. 수령 300년 비자나무 숲이 사찰을 병풍처럼 감싸 안고 있습니다.', price: '₩40,000~', duration: '1박 2일' },
    { icon: '🍵', name: '다담과 사찰 음식', desc: '자연이 주는 가장 순수한 맛의 식사와 스님과의 차담. 야생 차나무에서 얻은 차로 다선일미(茶禪一味)를 체험합니다.', price: '₩55,000~', duration: '1박 2일' },
    { icon: '🧘', name: '선명상 (체험형)', desc: '타종, 108배, 참선을 통해 번뇌를 비우고 내면을 채우는 전통 수행 체험. 새벽 예불 참여 가능.', price: '₩55,000~', duration: '1박 2일' },
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
              <div className="bt-ts-icon">{prog.icon}</div>
              <h3>{prog.name}</h3>
              <p>{prog.desc}</p>
              {(prog.price || prog.duration) && (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 }}>
                  {prog.price && (
                    <span style={{ background: 'rgba(44,95,45,.12)', color: 'var(--color-accent)', padding: '4px 14px', borderRadius: 20, fontSize: '.78rem', fontWeight: 700 }}>
                      {prog.price}
                    </span>
                  )}
                  {prog.duration && (
                    <span style={{ background: 'var(--color-bg-alt)', color: 'var(--color-text-light)', padding: '4px 14px', borderRadius: 20, fontSize: '.78rem', fontWeight: 600 }}>
                      {prog.duration}
                    </span>
                  )}
                </div>
              )}
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
          <p style={{ marginTop: 12, fontSize: '.8rem', color: 'var(--color-gold)' }}>
            한국불교문화사업단 공식 예약 사이트 (templestay.com)
          </p>
          <p style={{ marginTop: 8, fontSize: '13px', color: '#666' }}>
            예약 문의: 061-864-2055
          </p>
        </div>
      </div>
    </section>
  )
}
