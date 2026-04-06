// G-01 / SEC07-*: 사찰 갤러리
'use client'
import { useState } from 'react'
import type { TemplateContent, TempleData } from './types'

interface Props {
  content: TemplateContent
  temple: TempleData
}

export default function GalleryBlock({ content, temple }: Props) {
  const { gallery } = content
  const [lightbox, setLightbox] = useState<string | null>(null)

  // 갤러리 비어있으면 어드민 안내 문구 표시
  if (gallery.length === 0) {
    return (
      <section id="gallery" className="bt-section">
        <div className="bt-section-inner">
          <span className="bt-section-label">Gallery</span>
          <h2 className="bt-section-title">사찰 갤러리</h2>
          <div style={{
            marginTop: 48, padding: '60px 24px', textAlign: 'center',
            border: '2px dashed var(--color-border, #D4CEC4)',
            borderRadius: 'var(--radius-lg, 16px)',
            background: 'var(--color-bg-alt, #EDE7DB)',
          }}>
            <p style={{ fontSize: '2rem', marginBottom: 16 }}>📷</p>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-light)', fontWeight: 600 }}>
              사찰 어드민에서 사진을 올려주세요
            </p>
            <p style={{ fontSize: '.85rem', color: 'var(--color-text-light)', marginTop: 8 }}>
              관리자 페이지 → 사진 올리기에서 경내 사진을 등록하면 갤러리에 즉시 반영됩니다
            </p>
          </div>
        </div>
      </section>
    )
  }

  // 10칸 채우기 — 부족하면 플레이스홀더로 패딩
  const GRID_SIZE = 10
  const displayed = gallery.slice(0, GRID_SIZE)
  const padded: (typeof gallery[0] | null)[] = [
    ...displayed,
    ...Array<null>(Math.max(0, GRID_SIZE - displayed.length)).fill(null),
  ]

  return (
    <>
    <style>{`
      @media(max-width:640px){.gallery-grid-2col{grid-template-columns:1fr !important}}
    `}</style>
    <section id="gallery" className="bt-section">
      <div className="bt-section-inner">
        <span className="bt-section-label">Gallery</span>
        <h2 className="bt-section-title">사찰 갤러리</h2>

        <div className="gallery-grid-2col" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginTop: '48px',
        }}>
          {padded.map((item, i) => (
            item ? (
              <div
                key={i}
                onClick={() => setLightbox(item.url)}
                style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-lg, 12px)',
                  cursor: 'pointer',
                  background: 'var(--color-bg-alt, #eee)',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.caption ?? `${temple.name} 사진 ${i + 1}`}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .35s' }}
                />
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0)',
                    display: 'flex', alignItems: 'flex-end',
                    padding: '12px',
                    transition: 'background .25s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.45)'; const img = e.currentTarget.previousElementSibling as HTMLImageElement; if (img) img.style.transform = 'scale(1.03)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)'; const img = e.currentTarget.previousElementSibling as HTMLImageElement; if (img) img.style.transform = 'scale(1)'; }}
                >
                  {item.caption && (
                    <span style={{ fontSize: '.75rem', color: '#fff', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                      {item.caption}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* 플레이스홀더 */
              <div
                key={i}
                style={{
                  aspectRatio: '4/3',
                  borderRadius: 'var(--radius-lg, 12px)',
                  background: 'var(--color-bg-alt, #e8e3d8)',
                  border: '1px dashed var(--color-border, #ccc)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '1.5rem', opacity: 0.25 }}>📷</span>
              </div>
            )
          ))}
        </div>

        {gallery.length > GRID_SIZE && (
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '.85rem', color: 'var(--color-text-light)' }}>
            최근 {gallery.length}장 중 10장 표시
          </p>
        )}
      </div>

      {lightbox && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.92)' }}
          onClick={() => setLightbox(null)}
        >
          <button
            style={{ position: 'absolute', top: 20, right: 20, color: '#fff', fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}
            onClick={() => setLightbox(null)}
            aria-label="닫기"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="확대 보기"
            style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8 }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
    </>
  )
}
