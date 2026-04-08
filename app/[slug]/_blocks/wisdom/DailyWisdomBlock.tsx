'use client'
// WISDOM-01: 오늘의 짬짜미 부처님말씀 (365일 자동 갱신 + ±7일 네비게이션)
import { useState, useCallback } from 'react'
import type { TempleData } from '../types'
import type { DailyWisdomData } from '@/lib/getDailyWisdom'

interface Props {
  wisdom: DailyWisdomData | null
  temple: TempleData
}

/** MM-DD 기준 ±offset일 날짜 계산 */
function getOffsetMonthDay(baseMonthDay: string, offset: number): string {
  const [mm, dd] = baseMonthDay.split('-').map(Number)
  const year = new Date().getFullYear()
  const base = new Date(year, mm - 1, dd)
  base.setDate(base.getDate() + offset)
  const newMm = String(base.getMonth() + 1).padStart(2, '0')
  const newDd = String(base.getDate()).padStart(2, '0')
  return `${newMm}-${newDd}`
}

/** MM-DD → 한국어 날짜 레이블 (예: 4월 7일 월요일) */
function formatKoreanDate(monthDay: string): string {
  const [mm, dd] = monthDay.split('-').map(Number)
  const year = new Date().getFullYear()
  const d = new Date(year, mm - 1, dd)
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })
}

export default function DailyWisdomBlock({ wisdom: initialWisdom, temple }: Props) {
  const [offset, setOffset] = useState(0)
  const [wisdom, setWisdom] = useState<DailyWisdomData | null>(initialWisdom)
  const [loading, setLoading] = useState(false)

  const baseMonthDay = initialWisdom?.monthDay ?? ''

  const navigate = useCallback(async (nextOffset: number) => {
    if (!baseMonthDay) return
    if (nextOffset === 0) {
      setOffset(0)
      setWisdom(initialWisdom)
      return
    }
    const targetMonthDay = getOffsetMonthDay(baseMonthDay, nextOffset)
    setLoading(true)
    try {
      const res = await fetch(
        `/api/wisdom?monthDay=${targetMonthDay}&slug=${temple.code}`
      )
      const data = res.ok ? await res.json() : null
      setWisdom(data)
      setOffset(nextOffset)
    } catch {
      setWisdom(null)
      setOffset(nextOffset)
    } finally {
      setLoading(false)
    }
  }, [baseMonthDay, initialWisdom, temple.code])

  if (!initialWisdom) return null

  const primary = temple.primaryColor || '#8B2500'
  const currentMonthDay = offset === 0 ? baseMonthDay : getOffsetMonthDay(baseMonthDay, offset)
  const dateLabel = currentMonthDay ? formatKoreanDate(currentMonthDay) : ''

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    padding: '6px 16px',
    borderRadius: 20,
    border: `1px solid ${disabled ? '#ccc' : primary}`,
    background: disabled ? '#f5f5f5' : '#fff',
    color: disabled ? '#bbb' : primary,
    fontSize: '.8rem',
    fontWeight: 600,
    cursor: disabled ? 'default' : 'pointer',
    transition: 'all .15s',
    opacity: disabled ? 0.5 : 1,
  })

  return (
    <section id="wisdom" className="bt-section" style={{ background: 'var(--color-bg-alt, #FFF8E7)' }}>
      <div className="bt-section-inner">
        <span className="bt-section-label">Daily Wisdom</span>
        <h2 className="bt-section-title">오늘의 짬짜미 부처님말씀</h2>

        {/* 날짜 네비게이션 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          marginTop: 24,
          marginBottom: -12,
        }}>
          <button
            style={btnStyle(offset <= -7 || loading)}
            disabled={offset <= -7 || loading}
            onClick={() => navigate(offset - 1)}
          >
            ← 이전
          </button>
          <span style={{ fontSize: '.85rem', color: 'var(--color-text-light, #8a7a6a)', minWidth: 120, textAlign: 'center' }}>
            {offset === 0 ? '오늘' : offset < 0 ? `${Math.abs(offset)}일 전` : `${offset}일 후`}
          </span>
          <button
            style={btnStyle(offset >= 7 || loading)}
            disabled={offset >= 7 || loading}
            onClick={() => navigate(offset + 1)}
          >
            다음 →
          </button>
        </div>

        <div style={{
          marginTop: 48,
          maxWidth: 720,
          margin: '32px auto 0',
          background: '#fff',
          borderRadius: 'var(--radius-lg, 16px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
          overflow: 'hidden',
          border: `1px solid ${primary}22`,
          opacity: loading ? 0.6 : 1,
          transition: 'opacity .2s',
        }}>
          {/* 상단 배지 */}
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
                {dateLabel}
              </p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                {wisdom?.title ?? '부처님말씀'}
              </p>
            </div>
          </div>

          {/* 본문 */}
          {loading ? (
            <div style={{ padding: '48px 28px', textAlign: 'center', color: 'var(--color-text-light, #8a7a6a)' }}>
              불러오는 중…
            </div>
          ) : wisdom ? (
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
          ) : (
            <div style={{ padding: '48px 28px', textAlign: 'center', color: 'var(--color-text-light, #8a7a6a)' }}>
              해당 날짜의 말씀이 없습니다.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
