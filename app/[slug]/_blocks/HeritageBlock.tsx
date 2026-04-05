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

  const primary = temple.primaryColor ?? '#8B2500'
  const gold = '#9B8654'

  return (
    <section
      id="heritage"
      style={{ background: '#F5F0E8', padding: '80px 24px' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 64px' }}>
          <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', color: primary, marginBottom: 12, textTransform: 'uppercase' }}>
            National Treasures & Heritage
          </p>
          <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#1A1A18', marginBottom: 16, lineHeight: 1.4 }}>
            천년을 건너온 국보급 문화유산
          </h2>
          <p style={{ fontSize: '.92rem', color: '#6B6560', lineHeight: 1.8, margin: '0 auto' }}>
            제작 연대가 확실한 9세기 유물들이 한국 불교 미술 연구의 절대적 기준점이 되고 있습니다
          </p>
        </div>

        {/* 카드 목록 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {items.map((item, idx) => {
            const isEven = idx % 2 === 1
            return (
              <div
                key={idx}
                style={{
                  background: '#FDFBF7',
                  border: '1px solid #D4CEC4',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,.06)',
                }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'clamp(280px, 35%, 420px) 1fr',
                  minHeight: 320,
                  direction: isEven ? 'rtl' : 'ltr',
                }}>
                  {/* 이미지 */}
                  <div style={{ position: 'relative', overflow: 'hidden', minHeight: 280, background: '#ddd', direction: 'ltr' }}>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.imageAlt ?? item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    )}
                    {/* 등급 뱃지 */}
                    <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 2, direction: 'ltr' }}>
                      <span style={{
                        background: 'rgba(0,0,0,.65)',
                        color: '#fff',
                        padding: '5px 14px',
                        borderRadius: 20,
                        fontSize: '.7rem',
                        fontWeight: 700,
                        letterSpacing: '.04em',
                        backdropFilter: 'blur(6px)',
                      }}>
                        {item.grade}
                      </span>
                    </div>
                  </div>

                  {/* 본문 */}
                  <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', direction: 'ltr' }}>
                    <p style={{ fontSize: '.78rem', color: gold, fontWeight: 700, letterSpacing: '.06em', marginBottom: 10 }}>
                      {item.year}
                    </p>
                    <h3 style={{
                      fontFamily: "'Noto Serif KR', serif",
                      fontSize: 'clamp(1rem, 2vw, 1.35rem)',
                      fontWeight: 700,
                      color: '#1A1A18',
                      marginBottom: 16,
                      lineHeight: 1.5,
                      whiteSpace: 'pre-line',
                    }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '.9rem', color: '#6B6560', lineHeight: 1.85, marginBottom: 12 }}>
                      {item.desc}
                    </p>
                    {item.quote && (
                      <blockquote style={{
                        borderLeft: `3px solid ${gold}`,
                        padding: '12px 20px',
                        margin: '16px 0',
                        background: `rgba(155,134,84,.06)`,
                        borderRadius: '0 8px 8px 0',
                        fontFamily: "'Noto Serif KR', serif",
                        fontStyle: 'italic',
                        color: '#2E2B26',
                        fontSize: '.88rem',
                        lineHeight: 1.8,
                      }}>
                        {item.quote}
                      </blockquote>
                    )}
                    {item.detail && (
                      <p style={{ fontSize: '.78rem', color: '#9a8060', marginTop: 8, fontWeight: 500 }}>
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
