// SEC05-04: 천관사 전용 Heritage — 보물·지방문화재
import type { TempleData } from '../../types'

interface HeritageItem {
  name:        string
  grade:       string
  number?:     string
  era?:        string
  description: string
}

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

const GRADE_COLOR: Record<string, { bg: string; text: string }> = {
  '보물':                   { bg: '#8B2500', text: '#fff' },
  '국보':                   { bg: '#1B3A6B', text: '#fff' },
  '전라남도 유형문화유산': { bg: '#2d5016', text: '#fff' },
}

function getBadgeStyle(grade: string) {
  for (const key of Object.keys(GRADE_COLOR)) {
    if (grade.includes(key)) return GRADE_COLOR[key]
  }
  return { bg: '#555', text: '#fff' }
}

export default function ChunkwansaHeritageBlock({ temple, config }: Props) {
  const heritages = Array.isArray(config.heritages) && (config.heritages as HeritageItem[]).length > 0
    ? (config.heritages as HeritageItem[])
    : null

  if (!heritages) {
    // 문화재 없음 표시
    const message = typeof config.emptyMessage === 'string'
      ? config.emptyMessage
      : `${temple.name}는 현재 국가 지정 국보·보물 지정 문화재가 없습니다.`
    return (
      <section id="heritage" className="bt-section">
        <div className="bt-section-inner" style={{ maxWidth: 700 }}>
          <span className="bt-section-label">Heritage</span>
          <h2 className="bt-section-title">국보 · 보물</h2>
          <div style={{
            marginTop: 40, padding: '40px 32px', textAlign: 'center',
            background: 'var(--color-bg-alt, #f8f4ee)', borderRadius: 12,
            border: '1px solid var(--color-border, #e8e0d0)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🏛️</div>
            <p style={{ color: 'var(--color-text-light, #888)', fontSize: '1rem', lineHeight: 1.8 }}>
              {message}
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="heritage" className="bt-section">
      <div className="bt-section-inner">
        <span className="bt-section-label">Heritage</span>
        <h2 className="bt-section-title">문화유산</h2>
        <p className="bt-section-desc">천관사가 품은 소중한 문화유산</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginTop: '40px',
        }}>
          {heritages.map((item, i) => {
            const badge = getBadgeStyle(item.grade)
            return (
              <div key={i} style={{
                background: 'var(--color-bg-alt, #f8f4ee)',
                borderRadius: '10px',
                border: '1px solid var(--color-border, #e8e0d0)',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}>
                {/* Grade badge header */}
                <div style={{
                  padding: '12px 20px',
                  background: badge.bg,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{
                    color: badge.text,
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em',
                  }}>
                    {item.grade}{item.number ? ` ${item.number}` : ''}
                  </span>
                  {item.era && (
                    <span style={{
                      color: badge.text,
                      opacity: 0.75,
                      fontSize: '0.75rem',
                      marginLeft: 'auto',
                    }}>
                      {item.era}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{
                    margin: '0 0 10px',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    fontFamily: 'serif',
                    color: 'var(--color-text, #1a1a1a)',
                    lineHeight: 1.4,
                  }}>
                    🏛️ {item.name}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '0.88rem',
                    color: 'var(--color-text-light, #666)',
                    lineHeight: 1.7,
                  }}>
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
