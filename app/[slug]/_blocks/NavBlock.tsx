'use client'
// N-01: GNB 네비게이션 — 3행 구조 (로고 | 섹션 | SNS)
import { useState } from 'react'
import type { TempleData } from './types'

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

const NAV_SECTIONS = [
  { label: '주지인사말', href: '#intro' },
  { label: '행사·법회',   href: '#events' },
  { label: '국보·보물',   href: '#heritage' },
  { label: '역사',         href: '#history' },
  { label: '갤러리',       href: '#gallery' },
  { label: '템플스테이',   href: '#templestay' },
  { label: '학습관',       href: '#components' },
  { label: '인등불사',     href: '#offering' },
  { label: '오시는길',     href: '#visit' },
]

export default function NavBlock({ temple, config }: Props) {
  const [snsOpen, setSnsOpen] = useState(false)

  const kakao  = (config.kakaoUrl  as string) ?? 'https://open.kakao.com/'
  const youtube = (config.youtubeUrl as string) ?? 'https://youtube.com/'
  const naver  = (config.naverUrl   as string) ?? 'https://blog.naver.com/'
  const tiktok = (config.tiktokUrl  as string) ?? 'https://tiktok.com/'

  return (
    <nav
      style={{
        position:    'sticky',
        top:          0,
        zIndex:       100,
        background:  'rgba(5,8,16,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(212,175,55,0.15)',
      }}
    >
      {/* ── 1행: 로고 + SNS 토글 ─────────────────────── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '12px 20px 8px',
        maxWidth:        1200,
        margin:          '0 auto',
      }}>
        <a href="#" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily:    '"Noto Serif KR", serif',
            fontSize:      'clamp(15px, 3vw, 18px)',
            fontWeight:    700,
            color:         '#FFFAF0',
            letterSpacing: '-0.01em',
          }}>
            {temple.name}
          </span>
          <span style={{
            marginLeft:    8,
            fontSize:      'clamp(11px, 2vw, 13px)',
            color:         'rgba(212,175,55,0.7)',
            fontFamily:    '"Noto Serif KR", serif',
            letterSpacing: '0.05em',
          }}>
            寶林寺
          </span>
        </a>

        <button
          onClick={() => setSnsOpen(v => !v)}
          aria-label="SNS 링크 열기"
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          6,
            fontSize:     12,
            color:        snsOpen ? '#D4AF37' : 'rgba(255,250,240,0.55)',
            background:   'none',
            border:       'none',
            cursor:       'pointer',
            padding:      '4px 8px',
            borderRadius: 6,
            transition:   'color .2s',
          }}
        >
          <span style={{ fontSize: 16 }}>☰</span>
          <span>SNS</span>
        </button>
      </div>

      {/* ── 2행: 섹션 찾아가기 (가로 스크롤) ────────── */}
      <div style={{
        overflowX:    'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        padding:      '0 16px 10px',
        maxWidth:      1200,
        margin:        '0 auto',
      }}>
        <div style={{
          display:   'flex',
          gap:        8,
          whiteSpace: 'nowrap',
        }}>
          {NAV_SECTIONS.map(s => (
            <a
              key={s.href}
              href={s.href}
              style={{
                display:       'inline-block',
                padding:       '6px 14px',
                borderRadius:  20,
                fontSize:      'clamp(11px, 2vw, 13px)',
                fontWeight:    500,
                color:         'rgba(255,250,240,0.7)',
                border:        '1px solid rgba(212,175,55,0.2)',
                textDecoration: 'none',
                transition:    'all .2s',
                flexShrink:    0,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = '#D4AF37'
                el.style.borderColor = 'rgba(212,175,55,0.6)'
                el.style.background = 'rgba(212,175,55,0.08)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.color = 'rgba(255,250,240,0.7)'
                el.style.borderColor = 'rgba(212,175,55,0.2)'
                el.style.background = 'transparent'
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── 3행: SNS 링크 (펼치기) ────────────────────── */}
      {snsOpen && (
        <div style={{
          borderTop:   '1px solid rgba(212,175,55,0.12)',
          padding:     '10px 20px',
          display:     'flex',
          gap:         12,
          flexWrap:    'wrap',
          maxWidth:     1200,
          margin:      '0 auto',
        }}>
          {[
            { label: '💬 카카오톡', href: kakao,   color: '#FEE500' },
            { label: '▶ 유튜브',   href: youtube,  color: '#FF0000' },
            { label: '📝 네이버블로그', href: naver, color: '#03C75A' },
            { label: '♪ 틱톡',    href: tiktok,   color: '#69C9D0' },
          ].map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:       'inline-flex',
                alignItems:    'center',
                gap:           6,
                padding:       '5px 14px',
                borderRadius:  20,
                fontSize:      12,
                fontWeight:    600,
                color:         s.color,
                border:        `1px solid ${s.color}33`,
                background:    `${s.color}0d`,
                textDecoration: 'none',
                transition:    'opacity .2s',
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
