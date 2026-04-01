// G-01: 3열 그리드 갤러리 (라이트박스 포함)
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

  const displayed = gallery.slice(0, 9)

  return (
    <section className="px-4 py-12" style={{ background: '#120d07' }}>
      <div className="max-w-xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">📸</span>
          <h2 className="font-bold text-xl" style={{ color: '#FFFAF0' }}>경내 풍경</h2>
          <div className="flex-1 h-px ml-2" style={{ background: '#D4AF37', opacity: 0.3 }} />
        </div>

        {/* 3열 그리드 */}
        <div className="grid grid-cols-3 gap-1.5">
          {displayed.map((item, i) => (
            <button
              key={i}
              onClick={() => setLightbox(item.url)}
              className="relative aspect-square overflow-hidden rounded-xl active:opacity-80 focus:outline-none"
              style={{ border: `1px solid ${temple.primaryColor}30` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.caption ?? `${temple.name} 사진 ${i + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* hover/focus overlay */}
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity" />
            </button>
          ))}
        </div>

        {gallery.length > 9 && (
          <p className="text-center mt-4 text-sm" style={{ color: '#6b5a40' }}>
            최근 {gallery.length}장 중 9장 표시
          </p>
        )}
      </div>

      {/* 라이트박스 */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)' }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 text-white text-3xl leading-none z-10"
            onClick={() => setLightbox(null)}
            aria-label="닫기"
          >
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="확대 보기"
            className="max-w-full max-h-[85vh] object-contain rounded-xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
