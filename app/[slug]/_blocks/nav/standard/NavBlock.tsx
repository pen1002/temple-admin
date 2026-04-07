'use client'
import { useState } from 'react'

export interface NavBlockProps {
  temple: {
    name:          string
    nameHanja?:    string
    primaryColor?: string
    kakao?:        string
    blog?:         string
    youtube?:      string
  }
  menus?: { label: string; href: string }[]
}

const DEFAULT_MENUS = [
  { label: '사찰소개',    href: '#intro'    },
  { label: '공지사항',    href: '#notice'   },
  { label: '기도법회행사', href: '#events'   },
  { label: '오시는길',    href: '#location' },
]

export default function NavBlock({ temple, menus = DEFAULT_MENUS }: NavBlockProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const accent = temple.primaryColor ?? '#8B2500'

  const SNS_ITEMS = [
    { label: '카카오톡',    href: temple.kakao   ?? '#', bg: '#FEE500', color: '#3C1E1E', iconKey: 'kakao'   },
    { label: '유튜브',      href: temple.youtube ?? '#', bg: '#FF0000', color: '#ffffff', iconKey: 'youtube' },
    { label: '네이버 블로그', href: temple.blog    ?? '#', bg: '#03C75A', color: '#ffffff', iconKey: 'naver'   },
  ]

  return (
    <>
      <style>{`
        .nb-link {
          font-family: "Noto Sans KR", sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #333333;
          letter-spacing: 0.03em;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.15s;
        }
        .nb-link:hover {
          text-decoration: underline;
          color: ${accent};
        }
        @keyframes nb-slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @media (max-width: 640px) {
          .nb-menus { display: none !important; }
        }
      `}</style>

      {/* ── 네비게이션 바 ── */}
      <nav
        style={{
          position:       'fixed',
          top:            0, left: 0,
          width:          '100%',
          height:         '60px',
          zIndex:         100,
          background:     'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          boxShadow:      '0 1px 8px rgba(0,0,0,0.08)',
          display:        'flex',
          alignItems:     'center',
          padding:        '0 24px',
          boxSizing:      'border-box',
        }}
      >
        {/* 좌측: 사찰명 */}
        <a href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontFamily: '"Noto Serif KR","Nanum Myeongjo",serif', fontSize: '18px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.04em' }}>
            {temple.name}
          </span>
          {temple.nameHanja && (
            <span style={{ fontFamily: '"Noto Serif KR",serif', fontSize: '14px', color: '#888' }}>
              {temple.nameHanja}
            </span>
          )}
        </a>

        <div style={{ flex: 1 }} />

        {/* 우측: GNB 메뉴 (모바일 숨김) */}
        <div className="nb-menus" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2.5vw, 36px)', marginRight: '20px' }}>
          {menus.map(m => (
            <a key={m.label} href={m.href} className="nb-link"
              onClick={e => {
                const id = m.href.replace('#', '')
                const el = document.getElementById(id)
                if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }) }
              }}
            >
              {m.label}
            </a>
          ))}
        </div>

        {/* 우측 끝: 햄버거 버튼 */}
        <button
          onClick={() => setDrawerOpen(o => !o)}
          aria-label="SNS 메뉴"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: '#333', padding: '4px 8px', lineHeight: 1, flexShrink: 0 }}
        >
          {drawerOpen ? '✕' : '≡'}
        </button>
      </nav>

      {/* ── 우측 드로어: SNS 전용 ── */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.35)' }}
          />
          <div
            style={{
              position:      'fixed',
              top:           0, right: 0,
              width:         'min(260px, 78vw)',
              height:        '100vh',
              zIndex:        101,
              background:    'rgba(255,255,255,0.98)',
              boxShadow:     '-4px 0 24px rgba(0,0,0,0.14)',
              display:       'flex',
              flexDirection: 'column',
              justifyContent:'center',
              padding:       '0 28px',
              gap:           '14px',
              animation:     'nb-slide-in 0.22s ease-out both',
              boxSizing:     'border-box',
            }}
          >
            <p style={{ fontSize: '11px', color: '#aaa', letterSpacing: '0.12em', marginBottom: '4px' }}>SNS</p>
            {SNS_ITEMS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background:     s.bg,
                  color:          s.color,
                  height:         '56px',
                  borderRadius:   '12px',
                  fontSize:       '15px',
                  fontWeight:     700,
                  textDecoration: 'none',
                  display:        'flex',
                  alignItems:     'center',
                  gap:            '12px',
                  padding:        '0 20px',
                  boxShadow:      '0 2px 8px rgba(0,0,0,0.10)',
                }}
              >
                {s.iconKey === 'kakao' && (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <ellipse cx="11" cy="10" rx="9" ry="7.5" fill="#3C1E1E" opacity="0.85"/>
                    <path d="M7 8.5c-.3.6-.3 1.3 0 1.9.4.8 1.2 1.4 2.1 1.7l-.4 1.6 1.8-1.1c.3 0 .6.1.9.1 2.5 0 4.5-1.6 4.5-3.5S13.4 5.7 11 5.7 6.5 7.3 6.5 9.2c0 .5.2 1 .5 1.4z" fill="#FEE500"/>
                  </svg>
                )}
                {s.iconKey === 'youtube' && (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="2" y="5" width="18" height="12" rx="3" fill="#fff" opacity="0.9"/>
                    <polygon points="9,8 15,11 9,14" fill="#FF0000"/>
                  </svg>
                )}
                {s.iconKey === 'naver' && (
                  <span style={{ fontWeight: 900, fontSize: '18px', lineHeight: 1 }}>N</span>
                )}
                {s.label}
              </a>
            ))}
          </div>
        </>
      )}

      {/* NavBlock 높이만큼 페이지 상단 여백 */}
      <div style={{ height: '60px' }} />
    </>
  )
}
