// SEC13-*: 천관사 전용 템플스테이 — 가격 미표시, 연락처 061-867-2954
import type { TempleData } from '../../types'

interface TSProgram {
  icon: string
  name: string
  desc: string
}

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

const DEFAULT_PROGRAMS: TSProgram[] = [
  {
    icon: '🌿',
    name: '휴식형',
    desc: '천관산 기암괴석 트레킹과 대나무숲 포행. 일상의 소음을 내려놓고 자연의 고요 속에서 쉬어가는 자유로운 힐링 프로그램.',
  },
  {
    icon: '🧘',
    name: '전통형',
    desc: '새벽 예불·108배·참선·공양 등 전통 수행을 직접 체험. 천관보살의 원력이 깃든 도량에서 불교의 정수를 만납니다.',
  },
  {
    icon: '👥',
    name: '단체형',
    desc: '기업 연수·학교·단체 맞춤 프로그램. 명상·울력·다도 체험을 결합한 단체 힐링 프로그램으로 사전 문의 후 일정 조율.',
  },
  {
    icon: '🌺',
    name: '동백순례 (12~2월)',
    desc: '동백 군락지 순례와 선명상을 결합한 시즌 특별 프로그램. 눈 속에 피어난 동백꽃과 함께하는 겨울 수행의 특별한 경험.',
  },
]

export default function ChunkwansaTemplestayBlock({ temple, config }: Props) {
  const title      = typeof config.title === 'string' ? config.title : `${temple.name} 템플스테이`
  const desc       = typeof config.desc  === 'string' ? config.desc
    : '천관산 기암괴석과 대나무숲, 동백 군락 속에서 천관보살의 원력을 만나는 청정 수행 체험'
  const contactPhone = typeof config.contactPhone === 'string' ? config.contactPhone : '061-867-2954'

  const programs: TSProgram[] = Array.isArray(config.programs) && (config.programs as TSProgram[]).length > 0
    ? (config.programs as TSProgram[])
    : DEFAULT_PROGRAMS

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
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a
            href={`tel:${contactPhone}`}
            className="bt-visit-btn bt-visit-btn-primary"
          >
            템플스테이 예약 문의
          </a>
          <p style={{ marginTop: 8, fontSize: '13px', color: '#666' }}>
            예약 문의: {contactPhone}
          </p>
        </div>
      </div>
    </section>
  )
}
