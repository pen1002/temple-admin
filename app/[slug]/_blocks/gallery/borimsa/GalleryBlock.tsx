// G-01 / SEC07-*: 경내 갤러리
'use client'
import { useState } from 'react'
import type { TemplateContent, TempleData } from '../../types'

interface Props {
  content: TemplateContent
  temple: TempleData
}

export default function GalleryBlock({ content, temple }: Props) {
  const { gallery } = content
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (gallery.length === 0) return null

  const displayed = gallery.slice(0, 9)

  return (
    <section id="gallery" className="bt-section">
      <div className="bt-section-inner">
        <span className="bt-section-label">Gallery</span>
        <h2 className="bt-section-title">경내 풍경</h2>

        <div className="bt-gallery-grid">
          {displayed.map((item, i) => (
            <div
              key={i}
              className="bt-gallery-item"
              onClick={() => setLightbox(item.url)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.caption ?? `${temple.name} 사진 ${i + 1}`}
                loading="lazy"
              />
              <div className="bt-gallery-overlay">
                {item.caption && <span>{item.caption}</span>}
              </div>
            </div>
          ))}
        </div>

        {gallery.length > 9 && (
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '.85rem', color: 'var(--color-text-light)' }}>
            최근 {gallery.length}장 중 9장 표시
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
  )
}
