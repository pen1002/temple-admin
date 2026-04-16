'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'

const A = '#C9A84C'

export default function SuperPage() {
  const { slug } = useParams<{ slug: string }>()
  const [auth, setAuth] = useState(false)
  const [pin, setPin] = useState('')
  const [temples, setTemples] = useState<any[]>([])
  const [view, setView] = useState<'list' | 'register' | 'stats'>('list')
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

  const fetchTemples = useCallback(async () => {
    const res = await fetch('/api/super/cyber/temples', { headers: { 'x-role': 'super' } })
    if (res.ok) setTemples(await res.json())
  }, [])

  useEffect(() => { if (auth) fetchTemples() }, [auth, fetchTemples])

  if (!auth) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#0a0205,#120308)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#F5E6C8', fontFamily: "'Noto Serif KR',serif", padding: '2rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />
      <div style={{ fontSize: 40, marginBottom: 8 }}>🏯</div>
      <h2 style={{ color: A, marginBottom: 24, fontSize: 18 }}>본사 관제 센터</h2>
      <input type="password" value={pin} onChange={e => setPin(e.target.value)} onKeyDown={e => e.key === 'Enter' && handlePin()} placeholder="슈퍼 PIN" maxLength={6} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}66`, borderRadius: 8, color: '#F5E6C8', fontSize: 18, textAlign: 'center', letterSpacing: 6, width: 220, marginBottom: 10 }} />
      <button onClick={handlePin} style={{ width: 220, padding: 12, background: A, color: '#0a0205', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>입장</button>
      {error && <div style={{ marginTop: 10, color: '#ef4444', fontSize: 13 }}>{error}</div>}
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

      <div style={{ display: 'flex', borderBottom: `1px solid ${A}22`, background: 'rgba(0,0,0,0.3)' }}>
        {[['list', '🏯 사찰 목록'], ['register', '➕ 말사 등록'], ['stats', '📊 통합 통계']].map(([v, l]) => (
          <button key={v} onClick={() => setView(v as any)} style={{ flex: 1, padding: '0.85rem 0.4rem', background: view === v ? `${A}11` : 'transparent', border: 'none', borderBottom: view === v ? `2px solid ${A}` : '2px solid transparent', color: view === v ? A : `${A}55`, cursor: 'pointer', fontSize: 13, fontWeight: view === v ? 700 : 400, fontFamily: "'Noto Serif KR',serif" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: '1rem' }}>
        {view === 'list' && <TempleList temples={temples} onRefresh={fetchTemples} />}
        {view === 'register' && <TempleRegister onSuccess={() => { fetchTemples(); setView('list') }} />}
        {view === 'stats' && <TempleStats stats={temples} />}
      </div>
    </div>
  )
}

function TempleList({ temples, onRefresh }: any) {
  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/super/cyber/temples/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-role': 'super' }, body: JSON.stringify({ isActive: !isActive }) })
    onRefresh()
  }
  const resetPin = async (id: string, name: string) => {
    if (!confirm(`${name} PIN을 0000으로 초기화하시겠습니까?`)) return
    await fetch(`/api/super/cyber/temples/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-role': 'super' }, body: JSON.stringify({ admin_pin: '0000', pin_changed: false }) })
    onRefresh()
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 560, margin: '0 auto' }}>
      {temples.map((t: any) => (
        <div key={t.id} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${t.isActive ? `${A}33` : 'rgba(239,68,68,0.25)'}`, borderRadius: 10, padding: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <span style={{ fontWeight: 700 }}>{t.name || t.code}</span>
              <span style={{ fontSize: 12, color: A, marginLeft: 6 }}>{t.temple_rank === 'bonsa' ? '🏯 본사' : '⛩️ 말사'}</span>
              {t.contact_monk && <div style={{ fontSize: 11, opacity: 0.55, marginTop: 2 }}>담당: {t.contact_monk}</div>}
            </div>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: t.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: t.isActive ? '#22c55e' : '#ef4444', border: `1px solid ${t.isActive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>{t.isActive ? '운영중' : '비활성'}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
            <span>👥 {t.believer_count}</span>
            <span>🏮 {t.yeondeung_count}</span>
            <span>🕯️ {t.indung_count}</span>
            <span>🪷 {t.avalokiteshvara_count}</span>
            <span style={{ color: A, fontWeight: 600 }}>💰 {t.total_amount.toLocaleString()}원</span>
          </div>
          <div style={{ fontSize: 11, marginBottom: 8, padding: '4px 8px', background: t.pin_changed ? 'rgba(34,197,94,0.08)' : 'rgba(251,191,36,0.08)', borderRadius: 4, border: `1px solid ${t.pin_changed ? 'rgba(34,197,94,0.2)' : 'rgba(251,191,36,0.2)'}` }}>
            🔑 PIN: {t.pin_changed ? '✅ 변경됨' : '⚠️ 초기값(0000) 미변경'}
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            <button onClick={() => toggleActive(t.id, t.isActive)} style={{ flex: 1, padding: 6, background: 'transparent', border: `1px solid ${t.isActive ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`, borderRadius: 6, color: t.isActive ? '#ef4444' : '#22c55e', cursor: 'pointer', fontSize: 11 }}>{t.isActive ? '⏸ 비활성화' : '▶ 활성화'}</button>
            <button onClick={() => resetPin(t.id, t.name)} style={{ flex: 1, padding: 6, background: 'transparent', border: `1px solid ${A}44`, borderRadius: 6, color: A, cursor: 'pointer', fontSize: 11 }}>🔑 PIN 초기화</button>
            <a href={`/${t.code}/cyber/jongmuso`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: 6, background: 'transparent', border: `1px solid ${A}44`, borderRadius: 6, color: A, textDecoration: 'none', fontSize: 11, textAlign: 'center' }}>🏯 종무소</a>
          </div>
        </div>
      ))}
      {temples.length === 0 && <div style={{ textAlign: 'center', opacity: 0.4, padding: '2rem' }}>등록된 사이버사찰이 없습니다</div>}
    </div>
  )
}

function TempleRegister({ onSuccess }: any) {
  const [form, setForm] = useState({ code: '', name: '', contact_monk: '', phone: '', address: '' })
  const [msg, setMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const u = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const handleSubmit = async () => {
    if (!form.code || !form.name) { setMsg('코드와 사찰명 필수'); return }
    setSubmitting(true)
    const res = await fetch('/api/super/cyber/temples', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-role': 'super' }, body: JSON.stringify(form) })
    setSubmitting(false)
    if (res.ok) { setMsg('✅ 말사 등록 완료'); setTimeout(onSuccess, 1200) }
    else { const e = await res.json(); setMsg('등록 실패: ' + e.error) }
  }
  const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}44`, borderRadius: 8, color: '#F5E6C8', fontSize: 14, boxSizing: 'border-box' }
  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ color: A, fontSize: 16, marginBottom: 16 }}>➕ 말사 신규 등록</h2>
      {[['code', '사찰 코드 *', 'iloam (영문 소문자)'], ['name', '사찰명 *', '일오암'], ['contact_monk', '담당 스님', '○○ 스님'], ['phone', '연락처', '010-0000-0000'], ['address', '주소', '주소']].map(([k, l, p]) => (
        <div key={k} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: `${A}aa`, marginBottom: 3 }}>{l}</div>
          <input value={(form as any)[k]} onChange={e => u(k, e.target.value)} placeholder={p} style={inp} />
        </div>
      ))}
      <div style={{ padding: 10, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 8, fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>
        ⚠️ 초기 PIN은 <strong>0000</strong>으로 발급됩니다.<br />스님 최초 로그인 시 자동 변경 안내됩니다.
      </div>
      {msg && <div style={{ textAlign: 'center', color: msg.includes('✅') ? '#22c55e' : '#ef4444', padding: 8, fontSize: 13 }}>{msg}</div>}
      <button onClick={handleSubmit} disabled={submitting} style={{ width: '100%', padding: 14, background: submitting ? `${A}33` : A, color: '#0a0205', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer' }}>{submitting ? '등록 중...' : '⛩️ 말사 등록'}</button>
    </div>
  )
}

function TempleStats({ stats }: any) {
  const total = {
    temples: stats.length,
    believers: stats.reduce((s: number, t: any) => s + t.believer_count, 0),
    yeondeung: stats.reduce((s: number, t: any) => s + t.yeondeung_count, 0),
    indung: stats.reduce((s: number, t: any) => s + t.indung_count, 0),
    avalokiteshvara: stats.reduce((s: number, t: any) => s + t.avalokiteshvara_count, 0),
    amount: stats.reduce((s: number, t: any) => s + t.total_amount, 0),
  }
  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 20 }}>
        {[['🏯', total.temples + '개', '도량 수'], ['👥', total.believers + '명', '전체 신도'], ['💰', total.amount.toLocaleString() + '원', '누적 보시'], ['🏮', total.yeondeung + '건', '초파일등'], ['🕯️', total.indung + '건', '인등'], ['🪷', total.avalokiteshvara + '건', '원불']].map(([icon, val, label], i) => (
          <div key={i} style={{ background: `${A}08`, border: `1px solid ${A}22`, borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: A, marginTop: 3 }}>{val}</div>
            <div style={{ fontSize: 10, opacity: 0.55, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {stats.map((t: any) => (
          <div key={t.id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${A}18`, borderRadius: 8, padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><span style={{ fontWeight: 700 }}>{t.name}</span><span style={{ fontSize: 11, color: A, marginLeft: 6 }}>{t.temple_rank === 'bonsa' ? '본사' : '말사'}</span></div>
            <div style={{ display: 'flex', gap: 10, fontSize: 12, opacity: 0.7 }}><span>👥{t.believer_count}</span><span>🏮{t.yeondeung_count}</span><span>🕯️{t.indung_count}</span><span>🪷{t.avalokiteshvara_count}</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}
