// WISDOM-01: 오늘의 부처님말씀 (365일 자동 갱신)
import type { TempleData } from '../types'
import type { DailyWisdomData } from '@/lib/getDailyWisdom'

interface Props {
  wisdom: DailyWisdomData | null
  temple: TempleData
}

export default function DailyWisdomBlock({ wisdom, temple }: Props) {
  if (!wisdom) return null

  const primary = temple.primaryColor || '#8B2500'

  return (
    <section id="wisdom" className="bt-section" style={{ background: 'var(--color-bg-alt, #FFF8E7)' }}>
      <div className="bt-section-inner">
        <span className="bt-section-label">Daily Wisdom</span>
        <h2 className="bt-section-title">오늘의 부처님말씀</h2>

        <div style={{
          marginTop: 48,
          maxWidth: 720,
          margin: '48px auto 0',
          background: '#fff',
          borderRadius: 'var(--radius-lg, 16px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          overflow: 'hidden',
          border: `1px solid ${primary}22`,
        }}>
          {/* 상단 골드 배지 */}
          <div style={{
            background: `linear-gradient(135deg, ${primary}, ${primary}cc)`,
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{ fontSize: '1.5rem' }}>🪷</span>
            <div>
              <p style={{ fontSize: '.75rem', color: 'rgba(255,255,255,0.75)', letterSpacing: '.08em', marginBottom: 2 }}>
                {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
              </p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{wisdom.title}</p>
            </div>
          </div>

          {/* 본문 */}
          <div style={{ padding: '28px 28px 24px' }}>
            {wisdom.verse && (
              <p style={{
                fontSize: '.85rem',
                fontWeight: 600,
                color: primary,
                marginBottom: 16,
                padding: '10px 14px',
                background: `${primary}0d`,
                borderRadius: 8,
                borderLeft: `3px solid ${primary}`,
              }}>
                {wisdom.verse}
              </p>
            )}

            <p style={{
              fontSize: '1rem',
              lineHeight: 1.9,
              color: 'var(--color-text, #3a2e22)',
              whiteSpace: 'pre-line',
            }}>
              {wisdom.content}
            </p>

            <p style={{
              marginTop: 20,
              fontSize: '.8rem',
              color: 'var(--color-text-light, #8a7a6a)',
              textAlign: 'right',
              fontStyle: 'italic',
            }}>
              — {wisdom.source}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
