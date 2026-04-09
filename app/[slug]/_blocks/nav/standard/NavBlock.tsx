'use client'
import { useState } from 'react'

export interface NavBlockProps {
  temple: {
    name:          string
    nameHanja?:    string
    primaryColor?: string
    address?:      string
    phone?:        string
    kakao?:        string
    blog?:         string
    youtube?:      string
  }
  menus?: { label: string; href: string; icon?: string }[]
}

const DEFAULT_MENUS = [
  { label: '사찰소개',    href: '#intro',    icon: '🏛' },
  { label: '공지사항',    href: '#notice',   icon: '📢' },
  { label: '기도법회행사', href: '#events',   icon: '🙏' },
  { label: '오시는길',    href: '#location', icon: '🗺' },
]

export default function NavBlock({ temple, menus = DEFAULT_MENUS }: NavBlockProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const accent = temple.primaryColor ?? '#8B2500'

  const SNS_ITEMS = [
    { key: 'kakao',   label: '카카오', href: temple.kakao,   bg: 'rgba(254,229,0,0.12)',  border: 'rgba(254,229,0,0.25)', iconBg: '#FEE500', iconColor: '#3C1E1E' },
    { key: 'youtube', label: '유튜브', href: temple.youtube, bg: 'rgba(255,0,0,0.10)',    border: 'rgba(255,0,0,0.20)',   iconBg: '#FF0000', iconColor: '#ffffff' },
    { key: 'naver',   label: '네이버', href: temple.blog,    bg: 'rgba(3,199,90,0.10)',   border: 'rgba(3,199,90,0.20)',  iconBg: '#03C75A', iconColor: '#ffffff' },
  ].filter(s => s.href && s.href.length > 0)

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

      {/* ── 우측 드로어: 헤더 + 메뉴 + SNS + 푸터 (2026.04.09 대표님 승인) ── */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.55)' }}
          />
          <div
            style={{
              position:      'fixed',
              top:           0, right: 0,
              width:         'min(300px, 82vw)',
              height:        '100vh',
              zIndex:        101,
              background:    'rgba(10,8,0,0.97)',
              borderLeft:    '2px solid rgba(201,168,76,0.3)',
              boxShadow:     '-4px 0 24px rgba(0,0,0,0.5)',
              display:       'flex',
              flexDirection: 'column',
              animation:     'nb-slide-in 0.22s ease-out both',
              boxSizing:     'border-box',
              overflowY:     'auto',
            }}
          >
            {/* ① 헤더 */}
            <div style={{
              display:       'flex',
              alignItems:    'center',
              justifyContent:'space-between',
              padding:       '16px 18px 14px',
              borderBottom:  '0.5px solid rgba(201,168,76,0.15)',
            }}>
              <span style={{
                fontFamily:    '"Noto Serif KR","Nanum Myeongjo",serif',
                color:         '#f0dfa0',
                fontSize:      '15px',
                fontWeight:    600,
                letterSpacing: '0.04em',
              }}>{temple.name}</span>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="닫기"
                style={{
                  background:'none',
                  border:    'none',
                  cursor:    'pointer',
                  color:     'rgba(240,223,160,0.5)',
                  fontSize:  '18px',
                  padding:   '4px 6px',
                  lineHeight:1,
                }}
              >✕</button>
            </div>

            {/* ② 메뉴 섹션 */}
            <div style={{ padding: '14px 0 8px' }}>
              <p style={{
                fontSize:     '9px',
                color:        'rgba(201,168,76,0.5)',
                letterSpacing:'0.15em',
                padding:      '0 18px',
                margin:       '0 0 8px',
              }}>메뉴</p>
              {menus.map(m => (
                <a
                  key={m.label}
                  href={m.href}
                  onClick={e => {
                    const id = m.href.replace('#', '')
                    const el = typeof document !== 'undefined' ? document.getElementById(id) : null
                    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); setDrawerOpen(false) }
                  }}
                  style={{
                    display:       'flex',
                    alignItems:    'center',
                    padding:       '13px 18px',
                    borderBottom:  '0.5px solid rgba(201,168,76,0.07)',
                    textDecoration:'none',
                  }}
                >
                  <span style={{
                    width:         '28px',
                    height:        '28px',
                    borderRadius:  '8px',
                    background:    'rgba(201,168,76,0.12)',
                    display:       'flex',
                    alignItems:    'center',
                    justifyContent:'center',
                    fontSize:      '14px',
                    marginRight:   '12px',
                    flexShrink:    0,
                  }}>{m.icon ?? '·'}</span>
                  <span style={{
                    color:      '#f0dfa0',
                    fontSize:   '14px',
                    fontWeight: 500,
                    flex:       1,
                  }}>{m.label}</span>
                  <span style={{
                    color:     'rgba(201,168,76,0.4)',
                    fontSize:  '16px',
                    lineHeight:1,
                  }}>›</span>
                </a>
              ))}
            </div>

            {/* ③ SNS 섹션 */}
            {SNS_ITEMS.length > 0 && (
              <div style={{
                borderTop:  '0.5px solid rgba(201,168,76,0.12)',
                padding:    '12px 0 4px',
                marginTop:  '4px',
              }}>
                <p style={{
                  fontSize:     '9px',
                  color:        'rgba(201,168,76,0.5)',
                  letterSpacing:'0.15em',
                  padding:      '0 18px',
                  margin:       '0 0 10px',
                }}>SNS</p>
                <div style={{
                  display: 'flex',
                  gap:     '10px',
                  padding: '0 18px',
                }}>
                  {SNS_ITEMS.map(s => (
                    <a
                      key={s.key}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex:           1,
                        background:     s.bg,
                        border:         `0.5px solid ${s.border}`,
                        borderRadius:   '10px',
                        padding:        '10px 6px',
                        display:        'flex',
                        flexDirection:  'column',
                        alignItems:     'center',
                        gap:            '6px',
                        textDecoration: 'none',
                      }}
                    >
                      <span style={{
                        width:         '24px',
                        height:        '24px',
                        borderRadius:  '6px',
                        background:    s.iconBg,
                        color:         s.iconColor,
                        display:       'flex',
                        alignItems:    'center',
                        justifyContent:'center',
                        fontSize:      '12px',
                        fontWeight:    900,
                        lineHeight:    1,
                      }}>
                        {s.key === 'kakao' && '💬'}
                        {s.key === 'youtube' && '▶'}
                        {s.key === 'naver' && 'N'}
                      </span>
                      <span style={{
                        fontSize:     '9px',
                        color:        'rgba(201,168,76,0.6)',
                        letterSpacing:'0.05em',
                      }}>{s.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ④ 푸터: 사찰 정보 */}
            <div style={{ flex: 1 }} />
            {(temple.address || temple.phone) && (
              <div style={{
                padding:   '12px 18px 16px',
                fontSize:  '9px',
                color:     'rgba(240,223,160,0.3)',
                lineHeight:1.8,
              }}>
                {temple.address && <div>{temple.address}</div>}
                {temple.phone && <div>{temple.phone}</div>}
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
