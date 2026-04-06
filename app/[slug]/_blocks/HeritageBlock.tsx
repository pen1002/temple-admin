// SEC05-04: 국보·보물 Heritage — 블로그 스타일 카드
import type { TempleData } from './types'

interface HeritageItem {
  name: string
  grade: string
  year: string
  desc: string
  detail?: string
  imageUrl?: string
  imageAlt?: string
  quote?: string
}

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

const BORIMSA_DEFAULTS: HeritageItem[] = [
  {
    name: '장흥 보림사 남북 삼층석탑 및 석등',
    grade: '국보 제44호',
    year: '870년 (경문왕 10년, 통일신라)',
    imageUrl: 'https://res.cloudinary.com/db3izttcy/image/upload/eastwest3rdtower_bnwfor',
    imageAlt: '장흥 보림사 남북 삼층석탑 및 석등',
    desc: '2기 한 쌍이 완전히 보존된 통일신라 석탑으로, 1933년 해체 복원 시 내부에서 납석제 석탑지가 발견되어 870년이라는 정확한 건립 연대가 확인되었습니다.',
    quote: '납석제 석탑지(石塔誌)에 870년(경문왕 10년)이라는 명확한 건립 연대가 기록되어 있어, 한국 석탑 연구의 타임캡슐이 되고 있습니다.',
    detail: '높이 5.4m · 화강암 · 남북 2기 한 쌍',
  },
  {
    name: '장흥 보림사 철조비로자나불좌상',
    grade: '국보 제117호',
    year: '858년 (헌안왕 2년, 통일신라)',
    imageUrl: 'https://res.cloudinary.com/db3izttcy/image/upload/Borimsa_Iron_buddha_xf1xdm',
    imageAlt: '장흥 보림사 철조비로자나불좌상',
    desc: '한국에서 제작 연대가 확실한 가장 오래된 철불입니다. 858년 김언경이 철 2,500근을 시주했다는 명문이 불상 뒷면에 새겨져 있어 한국 미술사의 절대 기준점이 됩니다.',
    quote: '지권인(智拳印)은 중생과 부처, 번뇌와 깨달음이 본래 하나라는 선종의 핵심 철학을 철로 주조해 시각화한 것입니다.',
    detail: '높이 약 2.5m · 철제 · 지권인(智拳印)',
  },
  {
    name: '장흥 보림사 동 승탑',
    grade: '보물 제155호',
    year: '통일신라',
    desc: '보림사 동쪽에 위치한 통일신라 시대의 승탑입니다. 팔각원당형의 전형적인 신라 승탑 양식을 보여주는 귀중한 유물입니다.',
    detail: '팔각원당형 · 화강암',
  },
  {
    name: '장흥 보림사 서 승탑',
    grade: '보물 제156호',
    year: '고려시대',
    desc: '보림사 서쪽에 위치한 고려시대의 승탑입니다. 동 승탑과 쌍을 이루며 보림사 승탑 문화의 연속성을 보여줍니다.',
    detail: '팔각원당형 · 화강암',
  },
  {
    name: '장흥보림사 보조선사탑',
    grade: '보물 제157호',
    year: '통일신라 (884년)',
    desc: '보림사를 창건한 보조선사 체징 스님의 사리를 봉안한 승탑입니다. 통일신라 승탑 건축의 정수를 보여주는 작품입니다.',
    detail: '팔각원당형 · 화강암 · 884년 건립',
  },
  {
    name: '장흥보림사 보조선사탑비',
    grade: '보물 제158호',
    year: '통일신라 (884년)',
    desc: '보조선사 체징의 생애와 행적을 기록한 탑비입니다. 가지산문 개창의 역사와 선종 전파의 기록이 담긴 역사적 자료입니다.',
    detail: '높이 약 2m · 화강암 · 884년 건립',
  },
  {
    name: '월인석보 권제25',
    grade: '보물 제745-9호',
    year: '조선시대 (1459년)',
    desc: '세조가 부모의 명복을 빌기 위해 편찬한 불교 경전입니다. 1995년 목조사천왕상 해체 시 내부에서 발견되어 보림사의 조선 전기 문화재 보존 가치를 높였습니다.',
    detail: '목판본 · 조선 전기 한글 불교문헌',
  },
  {
    name: '금강경삼가해 권1',
    grade: '보물 제772-3호',
    year: '조선시대',
    desc: '금강경의 주석서로, 목조사천왕상 내부에서 발견된 귀중한 조선 전기 불교 문헌입니다. 한국 불교 사상사 연구에 중요한 자료입니다.',
    detail: '목판본 · 조선 전기 불교 주석서',
  },
  {
    name: '상교정본자비도량참법 권9,10',
    grade: '보물 제1252호',
    year: '조선시대',
    desc: '참회를 위한 불교 의식 경전으로, 조선 전기의 불교 의례와 신앙 형태를 이해하는 데 중요한 문헌입니다.',
    detail: '목판본 · 조선 전기 불교 의식서',
  },
  {
    name: '장흥 보림사 목조사천왕상',
    grade: '보물 제1254호',
    year: '조선시대 (16세기, 임진왜란 이전)',
    imageUrl: 'https://res.cloudinary.com/db3izttcy/image/upload/brs-t1254_xwgej6',
    imageAlt: '장흥 보림사 목조사천왕상',
    desc: '임진왜란 이전에 제작된 유일한 목조 사천왕상입니다. 1995년 해체 보수 시 내부에서 227종 345권의 조선 전기 고문헌이 발견되어 학계를 놀라게 했습니다.',
    quote: '500년간 내부에 227종 345권의 고문헌을 품고 있었던 성스러운 도서관, 목조사천왕상이 전란의 시대에도 불교 문화의 정수를 지켜냈습니다.',
    detail: '높이 약 3.5m · 목조 채색 · 4구 한 조',
  },
]

export default function HeritageBlock({ temple, config }: Props) {
  const items: HeritageItem[] =
    Array.isArray(config.items) && (config.items as HeritageItem[]).length > 0
      ? (config.items as HeritageItem[])
      : BORIMSA_DEFAULTS

  return (
    <section id="heritage" className="bt-section">
      <div className="bt-section-inner">
        <div className="bt-heritage-intro">
          <span className="bt-section-label">National Treasures &amp; Heritage</span>
          <h2 className="bt-section-title">천년을 건너온 국보급 문화유산</h2>
          <p className="bt-section-desc">
            제작 연대가 확실한 9세기 유물들이 한국 불교 미술 연구의 절대적 기준점이 되고 있습니다
          </p>
        </div>

        <div className="bt-heritage-grid">
          {items.map((item, idx) => (
            <div key={idx} className="bt-heritage-card">
              {/* 이미지 있을 때: 40/60 그리드. 없을 때: 텍스트 전체 폭 */}
              <div
                className="bt-heritage-card-inner"
                style={item.imageUrl ? {
                  display: 'grid',
                  gridTemplateColumns: '40% 60%',
                  minHeight: 320,
                } : {
                  display: 'block',
                }}
              >
                {/* 이미지 컬럼 */}
                {item.imageUrl ? (
                  <div
                    className="bt-heritage-img"
                    style={{ position: 'relative', overflow: 'hidden', minHeight: 280 }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt ?? item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <div className="bt-heritage-badge">
                      <span>{item.grade}</span>
                    </div>
                  </div>
                ) : (
                  /* 이미지 없을 때: 회색 플레이스홀더 없이 배지만 텍스트 위에 표시 */
                  null
                )}

                <div className="bt-heritage-body" style={!item.imageUrl ? { padding: '32px 28px' } : undefined}>
                  {/* 이미지 없는 항목: 등급 배지를 텍스트 영역 상단에 표시 */}
                  {!item.imageUrl && (
                    <div className="bt-heritage-badge" style={{ position: 'static', marginBottom: 12 }}>
                      <span>{item.grade}</span>
                    </div>
                  )}
                  <p style={{ fontSize: '.78rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '.06em', marginBottom: 10 }}>
                    {item.year}
                  </p>
                  <h3 style={{ whiteSpace: 'pre-line' }}>{item.name}</h3>
                  <p>{item.desc}</p>
                  {item.quote && <blockquote>{item.quote}</blockquote>}
                  {item.detail && (
                    <div className="bt-heritage-detail">
                      <span>{item.detail}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
