// G-01 / SEC07-*: 경내 갤러리
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

  if (gallery.length === 0) return null

  const displayed = gallery.slice(0, 10)

  return (
    <>
    <style>{`
      @media(max-width:640px){.gallery-grid-2col{grid-template-columns:1fr !important}}
    `}</style>
    <section id="gallery" className="bt-section">
      <div className="bt-section-inner">
        <span className="bt-section-label">Gallery</span>
        <h2 className="bt-section-title">경내 풍경</h2>

        <div className="gallery-grid-2col" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginTop: '48px',
        }}>
          {displayed.map((item, i) => (
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
                className="bt-gallery-overlay"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0)',
                  display: 'flex', alignItems: 'flex-end',
                  padding: '12px',
                  transition: 'background .25s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.45)'; const img = e.currentTarget.previousElementSibling as HTMLImageElement; if (img) img.style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0)'; const img = e.currentTarget.previousElementSibling as HTMLImageElement; if (img) img.style.transform = 'scale(1)'; }}
              >
                {item.caption && (
                  <span style={{ fontSize: '.75rem', color: '#fff', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                    {item.caption}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {gallery.length > 10 && (
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
