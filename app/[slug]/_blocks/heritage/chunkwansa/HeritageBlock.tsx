// SEC05-04: 천관사 전용 Heritage — 국가 지정 문화재 없음 안내
import type { TempleData } from '../../types'

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

export default function ChunkwansaHeritageBlock({ temple, config }: Props) {
  const message = typeof config.emptyMessage === 'string'
    ? config.emptyMessage
    : `${temple.name}는 현재 국가 지정 국보·보물 지정 문화재가 없습니다.`

  return (
    <section id="heritage" className="bt-section">
      <div className="bt-section-inner" style={{ maxWidth: 700 }}>
        <span className="bt-section-label">Heritage</span>
        <h2 className="bt-section-title">국보 · 보물</h2>
        <div style={{
          marginTop: 40,
          padding: '40px 32px',
          textAlign: 'center',
          background: 'var(--color-bg-alt, #f8f4ee)',
          borderRadius: 12,
          border: '1px solid var(--color-border, #e8e0d0)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🏛️</div>
          <p style={{
            color: 'var(--color-text-light, #888)',
            fontSize: '1rem',
            lineHeight: 1.8,
          }}>
            {message}
          </p>
          <p style={{
            marginTop: 12,
            color: 'var(--color-text-lighter, #aaa)',
            fontSize: '0.85rem',
          }}>
            천관보살의 원력과 천관산의 자연이 이 도량의 진정한 유산입니다.
          </p>
        </div>
      </div>
    </section>
  )
}
