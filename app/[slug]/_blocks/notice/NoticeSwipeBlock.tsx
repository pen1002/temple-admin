'use client'
// NS-01: 공지스와이프형 — 3카드 스와이프 · 5초 자동전환 · 어드민 연동
import { useState, useEffect, useRef, useCallback } from 'react'
import type { TemplateContent, TempleData } from '../types'

interface Props {
  content: TemplateContent
  temple:  TempleData
  config:  Record<string, unknown>
}

const BODY_LIMIT = 200

export default function NoticeSwipeBlock({ content, temple, config }: Props) {
  const notices = content.notices.slice(0, 3)
  const primary = temple.primaryColor || '#8B2500'

  const [current, setCurrent]   = useState(0)
  const [paused,  setPaused]    = useState(false)
  const [touchX,  setTouchX]    = useState<number | null>(null)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = notices.length

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total])

  // 5초 자동전환
  useEffect(() => {
    if (total <= 1 || paused) return
    timerRef.current = setInterval(next, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [total, paused, next])

  // 터치 스와이프
  const handleTouchStart = (e: React.TouchEvent) => {
    setPaused(true)
    setTouchX(e.touches[0].clientX)
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX !== null) {
      const dx = e.changedTouches[0].clientX - touchX
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev() }
      setTouchX(null)
    }
    setPaused(false)
  }

  // 마우스 드래그
  const mouseX = useRef<number | null>(null)
  const handleMouseDown = (e: React.MouseEvent) => {
    setPaused(true)
    mouseX.current = e.clientX
  }
  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseX.current !== null) {
      const dx = e.clientX - mouseX.current
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev() }
      mouseX.current = null
    }
    setPaused(false)
  }

  if (notices.length === 0) {
    const aiText = (config.aiPlaceholder as string) ?? `${temple.name}의 공지사항이 없습니다. 곧 소식을 전해드리겠습니다.`
    return (
      <section id="notice" className="bt-section" style={{ background: 'var(--color-bg-alt, #F5F0E8)' }}>
        <div className="bt-section-inner">
          <span className="bt-section-label">Notice</span>
          <h2 className="bt-section-title">공지사항</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-text-light, #8a7a6a)', marginTop: 24 }}>{aiText}</p>
        </div>
      </section>
    )
  }

  return (
    <section id="notice" className="bt-section" style={{ background: 'var(--color-bg-alt, #F5F0E8)' }}>
      <div className="bt-section-inner">
        <span className="bt-section-label">Notice</span>
        <h2 className="bt-section-title">공지사항</h2>

        <div style={{ maxWidth: 720, margin: '40px auto 0', position: 'relative' }}>
          {/* 카드 캐러셀 */}
          <div
            style={{ overflow: 'hidden', borderRadius: 16, cursor: total > 1 ? 'grab' : 'default' }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <div style={{
              display:    'flex',
              transition: 'transform .35s ease',
              transform:  `translateX(-${current * 100}%)`,
            }}>
              {notices.map((notice, i) => {
                const isLong = notice.content.length > BODY_LIMIT
                const bodyText = isLong && !expanded[i]
                  ? notice.content.slice(0, BODY_LIMIT) + '…'
                  : notice.content

                return (
                  <div
                    key={notice.id}
                    style={{
                      minWidth:     '100%',
                      background:   '#fff',
                      borderRadius: 16,
                      padding:      '28px 28px 24px',
                      border:       `1.5px solid ${i === current ? primary + '55' : '#E8E0D0'}`,
                      boxSizing:    'border-box',
                      boxShadow:    '0 2px 14px rgba(0,0,0,0.07)',
                    }}
                  >
                    {/* 날짜 */}
                    <p style={{ fontSize: '.75rem', color: 'var(--color-text-light, #9a8060)', marginBottom: 10 }}>
                      {new Date(notice.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    {/* 제목 */}
                    <p style={{
                      fontSize:   '1.05rem',
                      fontWeight: 700,
                      color:      'var(--color-text, #1a1008)',
                      marginBottom: 14,
                      wordBreak:  'keep-all',
                      lineHeight: 1.5,
                    }}>
                      {notice.title}
                    </p>

                    {/* 본문 */}
                    {notice.content && (
                      <div>
                        <p style={{
                          fontSize:   '.9rem',
                          lineHeight: 1.8,
                          color:      'var(--color-text, #5a4a35)',
                          whiteSpace: 'pre-wrap',
                          wordBreak:  'keep-all',
                        }}>
                          {bodyText}
                        </p>
                        {isLong && (
                          <button
                            onClick={() => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
                            style={{
                              marginTop:  8,
                              background: 'none',
                              border:     'none',
                              color:      primary,
                              fontSize:   '.8rem',
                              fontWeight: 600,
                              cursor:     'pointer',
                              padding:    0,
                            }}
                          >
                            {expanded[i] ? '접기 ▲' : '더보기 ▼'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* 이전/다음 버튼 + Dot indicator */}
          {total > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 16 }}>
              <button
                onClick={() => { prev(); setPaused(true) }}
                style={{
                  background: '#fff',
                  border:     `1px solid ${primary}44`,
                  color:      primary,
                  borderRadius: 20,
                  padding:    '5px 14px',
                  fontSize:   '.8rem',
                  fontWeight: 600,
                  cursor:     'pointer',
                }}
              >
                ← 이전
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                {notices.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrent(i); setPaused(true) }}
                    aria-label={`${i + 1}번 공지`}
                    style={{
                      width:        i === current ? 20 : 8,
                      height:       8,
                      borderRadius: 4,
                      border:       'none',
                      background:   i === current ? primary : primary + '44',
                      cursor:       'pointer',
                      transition:   'width .2s, background .2s',
                      padding:      0,
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => { next(); setPaused(true) }}
                style={{
                  background: '#fff',
                  border:     `1px solid ${primary}44`,
                  color:      primary,
                  borderRadius: 20,
                  padding:    '5px 14px',
                  fontSize:   '.8rem',
                  fontWeight: 600,
                  cursor:     'pointer',
                }}
              >
                다음 →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
