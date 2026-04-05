// SEC05-04: 국보·보물 Heritage — 블로그 스타일 카드
import type { TempleData } from '../../types'

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
    name: '절대 연대를 품은 최초의 철불\n— 철조비로자나불좌상',
    grade: '국보 제117호',
    year: '858년 (헌안왕 2년)',
    imageUrl: 'https://res.cloudinary.com/db3izttcy/image/upload/brs-nt44_vmceyo',
    imageAlt: '보림사 철조비로자나불좌상',
    desc: '한국에서 제작 연대가 확실한 가장 오래된 철불입니다. 858년 김언경이 철 2,500근을 시주했다는 명문이 불상 뒷면에 새겨져 있어 한국 미술사의 절대 기준점이 됩니다.',
    quote: '왼손 검지를 오른손으로 감싸 쥔 지권인(智拳印)은 중생과 부처, 번뇌와 깨달음이 본래 하나라는 선종의 핵심 철학을 철로 주조해 시각화한 것입니다.',
    detail: '높이 약 2.5m · 철제 · 지권인(智拳印)',
  },
  {
    name: '완벽한 비례미의 결정체\n— 남·북 삼층석탑과 석등',
    grade: '국보 제44호',
    year: '870년 (경문왕 10년)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Borimsa_Seoktap_11-05026.JPG/640px-Borimsa_Seoktap_11-05026.JPG',
    imageAlt: '보림사 삼층석탑',
    desc: '2기 한 쌍이 완전히 보존된 통일신라 석탑으로, 1933년 해체 복원 시 내부에서 납석제 석탑지가 발견되어 870년이라는 정확한 건립 연대가 확인되었습니다.',
    quote: '1933년 북탑 해체 보수 시 내부에서 발견된 납석제 석탑지(石塔誌)에 870년(경문왕 10년)이라는 명확한 건립 연대가 기록되어 있어, 타임캡슐과 같은 유물입니다.',
    detail: '높이 5.4m · 화강암 · 남북 2기 한 쌍',
  },
  {
    name: '조선 목조각의 걸작\n— 목조 사천왕상',
    grade: '보물 제1254호',
    year: '임진왜란 이전 (16세기)',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Borimsa_Sacheonwang_11-05168.JPG/640px-Borimsa_Sacheonwang_11-05168.JPG',
    imageAlt: '보림사 목조 사천왕상',
    desc: '1995년 해체 보수 시 내부에서 월인석보를 비롯한 227종 345권의 조선 전기 고문헌이 발견되었습니다. 임진왜란 이전의 유일한 목조 사천왕상입니다.',
    quote: '500년간 해체 보수 중 사천왕상 내부에서 《월인석보》 등 227종 345권의 조선 전기 고문헌이 발견되었습니다. 전란 속에서 불교 문화의 정수를 지켜낸 성스러운 도서관이었습니다.',
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
              <div className="bt-heritage-card-inner">
                <div className="bt-heritage-img">
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.imageAlt ?? item.name} />
                  )}
                  <div className="bt-heritage-badge">
                    <span>{item.grade}</span>
                  </div>
                </div>

                <div className="bt-heritage-body">
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
