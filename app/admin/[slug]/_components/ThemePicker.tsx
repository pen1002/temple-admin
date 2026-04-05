'use client'
import { useState } from 'react'

interface Theme {
  id: string
  label: string
  desc: string
  color: string
  bg: string
}

const THEMES: Theme[] = [
  { id: 'borimsa-type',  label: '🌿 보림사형', desc: '크림 아이보리 · 초록 포인트',  color: '#2C5F2D', bg: '#F5F0E8' },
  { id: 'seonunsa-type', label: '🌸 선운사형', desc: '따뜻한 분홍 · 자연 테마',       color: '#8B3A3A', bg: '#FFF5F0' },
  { id: 'standard',      label: '⚫ 기본형',   desc: '다크 배경 · 골드 포인트',       color: '#D4AF37', bg: '#0d0a06' },
]

export default function ThemePicker({
  slug,
  currentTheme,
}: {
  slug: string
  currentTheme: string
}) {
  const [active, setActive] = useState(currentTheme)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function select(themeId: string) {
    if (themeId === active || loading) return
    setLoading(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, theme: themeId }),
      })
      if (res.ok) {
        setActive(themeId)
        setMsg('✅ 테마 적용 완료')
      } else {
        const data = await res.json()
        setMsg(`❌ ${data.error ?? '오류'}`)
      }
    } catch {
      setMsg('❌ 네트워크 오류')
    } finally {
      setLoading(false)
      setTimeout(() => setMsg(null), 3000)
    }
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontSize: '.78rem', fontWeight: 600, color: '#9a7a50', marginBottom: 10, letterSpacing: '.04em' }}>
        🎨 홈페이지 테마 선택
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {THEMES.map(t => {
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              disabled={loading}
              onClick={() => select(t.id)}
              style={{
                flex: '1 1 140px',
                padding: '14px 12px',
                borderRadius: 14,
                border: isActive ? `2.5px solid ${t.color}` : '2px solid #e8dcc8',
                background: isActive ? t.bg : '#fff',
                cursor: loading ? 'wait' : 'pointer',
                textAlign: 'left',
                transition: '.2s',
                boxShadow: isActive ? `0 0 0 4px ${t.color}20` : 'none',
                opacity: loading && !isActive ? 0.5 : 1,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '.88rem', color: isActive ? t.color : '#2C1810', marginBottom: 3 }}>
                {t.label}
              </div>
              <div style={{ fontSize: '.72rem', color: '#9a7a50' }}>{t.desc}</div>
              {isActive && (
                <div style={{ marginTop: 6, fontSize: '.68rem', fontWeight: 700, color: t.color }}>
                  ● 현재 적용 중
                </div>
              )}
            </button>
          )
        })}
      </div>
      {msg && (
        <p style={{ marginTop: 8, fontSize: '.8rem', fontWeight: 600, color: msg.startsWith('✅') ? '#2C5F2D' : '#c0392b' }}>
          {msg}
        </p>
      )}
    </div>
  )
}
