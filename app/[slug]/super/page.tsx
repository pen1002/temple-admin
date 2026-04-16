'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import SuperManagementPanel from '../_components/SuperManagementPanel'

const A = '#C9A84C'

export default function SuperPage() {
  const { slug } = useParams<{ slug: string }>()
  const [auth, setAuth] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('super_cyber_auth') === '1') setAuth(true)
  }, [])

  const handlePin = async () => {
    const res = await fetch('/api/cyber/members/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin, temple_slug: slug }) })
    if (res.ok) {
      const { role } = await res.json()
      if (role === 'super') {
        setAuth(true); sessionStorage.setItem('super_cyber_auth', '1'); setError('')
      } else { setError('슈퍼 PIN만 사용 가능합니다') }
    } else { setError('PIN 불일치') }
    setPin('')
  }

  if (!auth) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#0a0205,#120308)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#F5E6C8', fontFamily: "'Noto Serif KR',serif", padding: '2rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />
      <div style={{ fontSize: 40, marginBottom: 8 }}>🏯</div>
      <h2 style={{ color: A, marginBottom: 24, fontSize: 18 }}>본사 관제 센터</h2>
      <input type="password" value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === 'Enter' && handlePin()} placeholder="슈퍼 PIN" maxLength={6} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}66`, borderRadius: 8, color: '#F5E6C8', fontSize: 18, textAlign: 'center', letterSpacing: 6, width: 220, marginBottom: 10 }} />
      <button onClick={handlePin} style={{ width: 220, padding: 12, background: A, color: '#0a0205', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>입장</button>
      {error && <div style={{ marginTop: 10, color: '#ef4444', fontSize: 13 }}>{error}</div>}
      <div style={{ marginTop: 24, fontSize: 11, color: `${A}66`, textAlign: 'center', lineHeight: 1.6 }}>
        ℹ️ 미래사 종무소 내 <strong>말사관리</strong> 카드에서도 접근 가능합니다
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#0a0205,#120308)', color: '#F5E6C8', fontFamily: "'Noto Serif KR',serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />
      <div style={{ background: 'linear-gradient(90deg,#1a0408,#2d0a10)', borderBottom: `2px solid ${A}`, padding: '1rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: A, letterSpacing: '0.15em' }}>1080사찰 대작불사</div>
          <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>🔴 본사 관제 센터</h1>
        </div>
        <button onClick={() => { sessionStorage.removeItem('super_cyber_auth'); setAuth(false) }} style={{ background: 'transparent', border: `1px solid ${A}44`, borderRadius: 6, color: `${A}88`, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>로그아웃</button>
      </div>

      <SuperManagementPanel />
    </div>
  )
}
