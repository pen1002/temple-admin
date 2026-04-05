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
  const primary = temple.primaryColor ?? '#8B2500'
  const green = '#2C5F2D'

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
    <section
      id="templestay"
      style={{ background: '#EDE7DB', padding: '80px 24px' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* 헤더 */}
        <p style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.12em', color: green, marginBottom: 12, textTransform: 'uppercase' }}>
          Temple Stay
        </p>
        <h2 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#1A1A18', marginBottom: 12, lineHeight: 1.4 }}>
          {title}
        </h2>
        <p style={{ fontSize: '.92rem', color: '#6B6560', marginBottom: 48, maxWidth: 640 }}>
          {desc}
        </p>

        {/* 프로그램 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
          {programs.map((prog, i) => (
            <div
              key={i}
              style={{
                background: '#FDFBF7',
                border: '1px solid #D4CEC4',
                borderRadius: 16,
                padding: '32px 28px',
                transition: '.3s',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>{prog.icon}</div>
              <h3 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: '1.05rem', fontWeight: 700, color: '#1A1A18', marginBottom: 12, lineHeight: 1.4 }}>
                {prog.name}
              </h3>
              <p style={{ fontSize: '.88rem', color: '#6B6560', lineHeight: 1.8, marginBottom: prog.price ? 16 : 0 }}>
                {prog.desc}
              </p>
              {(prog.price || prog.duration) && (
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {prog.price && (
                    <span style={{ background: `${green}18`, color: green, padding: '4px 12px', borderRadius: 20, fontSize: '.78rem', fontWeight: 700 }}>
                      {prog.price}
                    </span>
                  )}
                  {prog.duration && (
                    <span style={{ background: '#EDE7DB', color: '#6B6560', padding: '4px 12px', borderRadius: 20, fontSize: '.78rem', fontWeight: 600 }}>
                      {prog.duration}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 예약 버튼 */}
        <div style={{ textAlign: 'center' }}>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '14px 36px',
              background: green,
              color: '#fff',
              borderRadius: 9999,
              fontWeight: 700,
              fontSize: '.95rem',
              textDecoration: 'none',
              letterSpacing: '.04em',
            }}
          >
            템플스테이 예약하기
          </a>
          <p style={{ marginTop: 12, fontSize: '.8rem', color: '#9B8654' }}>
            한국불교문화사업단 공식 예약 사이트 (templestay.com)
          </p>
        </div>
      </div>
    </section>
  )
}
