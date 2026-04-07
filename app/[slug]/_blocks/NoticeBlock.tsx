// I-01: 공지사항 — 스와이프 캐러셀
'use client'
import { useState } from 'react'
import type { TemplateContent, TempleData } from './types'

interface Props {
  content: TemplateContent
  temple: TempleData
}

export default function NoticeBlock({ content, temple }: Props) {
  const { notices } = content
  const [current, setCurrent] = useState(0)

  // 터치 스와이프
  const [touchX, setTouchX] = useState<number | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => setTouchX(e.touches[0].clientX)
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchX === null) return
    const dx = e.changedTouches[0].clientX - touchX
    if (Math.abs(dx) > 40) {
      if (dx < 0) setCurrent(c => Math.min(c + 1, notices.length - 1))
      else        setCurrent(c => Math.max(c - 1, 0))
    }
    setTouchX(null)
  }

  return (
    <section
      id="notice"
      className="px-5 py-12"
      style={{ background: '#F5F0E8' }}
    >
      <div className="max-w-xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">📢</span>
          <h2 className="font-bold text-xl" style={{ color: '#2C1810' }}>공지사항</h2>
          <div className="flex-1 h-px ml-2" style={{ background: '#C9A84C', opacity: 0.4 }} />
        </div>

        {notices.length === 0 ? (
          <p className="text-center py-8 text-base" style={{ color: '#8B7355' }}>
            등록된 공지사항이 없습니다.
          </p>
        ) : (
          <>
            {/* 캐러셀 카드 */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <div
                style={{
                  display:    'flex',
                  transition: 'transform 0.30s ease',
                  transform:  `translateX(-${current * 100}%)`,
                }}
              >
                {notices.map((notice, i) => (
                  <div
                    key={notice.id}
                    style={{
                      minWidth:     '100%',
                      background:   '#fff',
                      borderRadius: '16px',
                      padding:      '24px 20px',
                      border:       `1.5px solid ${i === current ? temple.primaryColor + '55' : '#E8E0D0'}`,
                      boxSizing:    'border-box',
                      boxShadow:    '0 2px 12px rgba(0,0,0,0.06)',
                    }}
                  >
                    <p
                      className="font-semibold text-base leading-snug mb-3"
                      style={{ color: '#1a1008', wordBreak: 'keep-all' }}
                    >
                      {notice.title}
                    </p>
                    {notice.content && (
                      <p
                        className="text-sm leading-relaxed"
                        style={{
                          color:      '#5a4a35',
                          overflowY:  'auto',
                          maxHeight:  '160px',
                          whiteSpace: 'pre-wrap',
                          wordBreak:  'keep-all',
                        }}
                      >
                        {notice.content}
                      </p>
                    )}
                    <p className="text-xs mt-4" style={{ color: '#9a8060' }}>
                      {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dot 네비게이션 */}
            {notices.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                {notices.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`${i + 1}번 공지`}
                    style={{
                      width:        i === current ? '20px' : '8px',
                      height:       '8px',
                      borderRadius: '4px',
                      border:       'none',
                      background:   i === current ? temple.primaryColor : '#C9A84C55',
                      cursor:       'pointer',
                      transition:   'width 0.2s, background 0.2s',
                      padding:      0,
                    }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
