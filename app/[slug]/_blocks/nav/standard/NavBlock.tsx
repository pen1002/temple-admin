'use client'
import { useState } from 'react'

export interface NavBlockProps {
  temple: {
    name:        string
    nameHanja?:  string
    primaryColor?: string
    kakao?:      string
    blog?:       string
    youtube?:    string
  }
  menus?: { label: string; href: string }[]
}

const DEFAULT_MENUS = [
  { label: '사찰소개',    href: '#about'  },
  { label: '공지사항',    href: '#notice' },
  { label: '기도법회행사', href: '#events' },
  { label: '오시는길',    href: '#visit'  },
]

export default function NavBlock({ temple, menus = DEFAULT_MENUS }: NavBlockProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const accent = temple.primaryColor ?? '#8B2500'

  const SNS = [
    temple.kakao   && { label: '카카오톡',    href: temple.kakao,   bg: '#FEE500', color: '#3A1D1D' },
    temple.blog    && { label: '네이버 블로그', href: temple.blog,    bg: '#03C75A', color: '#fff'    },
    temple.youtube && { label: '유튜브',      href: temple.youtube, bg: '#FF0000', color: '#fff'    },
  ].filter(Boolean) as { label: string; href: string; bg: string; color: string }[]

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
          color: var(--nb-accent);
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
          position:        'fixed',
          top:             0, left: 0,
          width:           '100%',
          height:          '60px',
          zIndex:          100,
          background:      'rgba(255,255,255,0.95)',
          backdropFilter:  'blur(8px)',
          boxShadow:       '0 1px 8px rgba(0,0,0,0.08)',
          display:         'flex',
          alignItems:      'center',
          padding:         '0 24px',
          boxSizing:       'border-box',
          // CSS 변수로 accent 전달
          ['--nb-accent' as string]: accent,
        }}
      >
        {/* 좌측: 사찰명 */}
        <a
          href="/"
          style={{
            display:        'flex',
            alignItems:     'baseline',
            gap:            '8px',
            textDecoration: 'none',
            flexShrink:     0,
          }}
        >
          <span
            style={{
              fontFamily:    '"Noto Serif KR","Nanum Myeongjo",serif',
              fontSize:      '18px',
              fontWeight:    700,
              color:         '#1a1a1a',
              letterSpacing: '0.04em',
            }}
          >
            {temple.name}
          </span>
          {temple.nameHanja && (
            <span
              style={{
                fontFamily: '"Noto Serif KR",serif',
                fontSize:   '14px',
                color:      '#888',
              }}
            >
              {temple.nameHanja}
            </span>
          )}
        </a>

        {/* 스페이서 */}
        <div style={{ flex: 1 }} />

        {/* 우측: GNB 메뉴 (모바일 숨김) */}
        <div
          className="nb-menus"
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        'clamp(16px, 2.5vw, 36px)',
            marginRight:'20px',
          }}
        >
          {menus.map(m => (
            <a key={m.label} href={m.href} className="nb-link">
              {m.label}
            </a>
          ))}
        </div>

        {/* 우측 끝: 햄버거 버튼 */}
        <button
          onClick={() => setDrawerOpen(o => !o)}
          aria-label="메뉴 열기"
          style={{
            background: 'none',
            border:     'none',
            cursor:     'pointer',
            fontSize:   '22px',
            color:      '#333',
            padding:    '4px 8px',
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {drawerOpen ? '✕' : '≡'}
        </button>
      </nav>

      {/* ── 우측 드로어 ── */}
      {drawerOpen && (
        <>
          {/* 오버레이 */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position:   'fixed',
              inset:      0,
              zIndex:     99,
              background: 'rgba(0,0,0,0.35)',
            }}
          />
          {/* 드로어 패널 */}
          <div
            style={{
              position:        'fixed',
              top:             0,
              right:           0,
              width:           'min(280px, 80vw)',
              height:          '100vh',
              zIndex:          101,
              background:      '#fff',
              boxShadow:       '-4px 0 24px rgba(0,0,0,0.14)',
              display:         'flex',
              flexDirection:   'column',
              padding:         '72px 28px 40px',
              animation:       'nb-slide-in 0.22s ease-out both',
              boxSizing:       'border-box',
            }}
          >
            {/* 모바일용 메뉴 목록 */}
            <div style={{ marginBottom: '32px' }}>
              {menus.map(m => (
                <a
                  key={m.label}
                  href={m.href}
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    display:       'block',
                    fontFamily:    '"Noto Sans KR",sans-serif',
                    fontSize:      '15px',
                    fontWeight:    400,
                    color:         '#333',
                    letterSpacing: '0.03em',
                    textDecoration:'none',
                    padding:       '12px 0',
                    borderBottom:  '1px solid #f0f0f0',
                  }}
                >
                  {m.label}
                </a>
              ))}
            </div>

            {/* SNS 버튼 */}
            {SNS.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p
                  style={{
                    fontSize:      '11px',
                    color:         '#aaa',
                    letterSpacing: '0.1em',
                    marginBottom:  '4px',
                  }}
                >
                  SNS
                </p>
                {SNS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background:     s.bg,
                      color:          s.color,
                      padding:        '10px 18px',
                      borderRadius:   '8px',
                      fontSize:       '13px',
                      fontWeight:     700,
                      textDecoration: 'none',
                      display:        'block',
                      textAlign:      'center',
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* NavBlock 높이만큼 페이지 상단 여백 */}
      <div style={{ height: '60px' }} />
    </>
  )
}
