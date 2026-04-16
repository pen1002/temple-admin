'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useCyberTemple } from '@/lib/useCyberTemple'
import { TEMPLE_OFFERINGS } from '@/lib/constants/templeOfferings'

const A = '#C9A84C'

// 60갑자 계산
const CHEON = ['갑','을','병','정','무','기','경','신','임','계']
const JI = ['자','축','인','묘','진','사','오','미','신','유','술','해']
const TTI = ['🐀쥐','🐂소','🐅범','🐇토끼','🐉용','🐍뱀','🐴말','🐏양','🐵원숭이','🐓닭','🐕개','🐖돼지']
function getGapja(dateStr: string): string {
  if (!dateStr || dateStr.length < 4) return ''
  const year = parseInt(dateStr.replace(/\D/g, '').slice(0, 4))
  if (isNaN(year) || year < 1900 || year > 2100) return ''
  const idx = (year - 4) % 60
  const c = CHEON[idx % 10]
  const j = JI[idx % 12]
  const t = TTI[idx % 12]
  return `${c}${j}년 ${t}`
}
type Tab = 'members' | 'offerings' | 'mycard'
type Role = 'super' | 'admin' | null
const RELS = ['부', '모', '건명', '곤명', '자', '녀', '손자', '손녀', '형', '제', '기타']

export default function JungmusoPage() {
  const { slug } = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const temple = useCyberTemple(slug)
  const tName = temple?.name || slug
  const config = TEMPLE_OFFERINGS[slug] || TEMPLE_OFFERINGS.miraesa

  const [role, setRole] = useState<Role>(null)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(0)
  const [pinLocked, setPinLocked] = useState(false)
  const [showChangePin, setShowChangePin] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [activeTab, setActiveTab] = useState<Tab | null>((searchParams.get('tab') as Tab) || null)
  const [pendingTab, setPendingTab] = useState<Tab | null>(null)
  const [activePanel, setActivePanel] = useState<string | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem(`${slug}_members_role`)
    if (saved === 'super' || saved === 'admin') setRole(saved)
  }, [slug])

  // PIN 필요한 탭 클릭 시 — 항상 PIN 확인
  const openProtectedTab = (tab: Tab) => {
    // sessionStorage에 role이 있어도 5분 경과 시 재인증
    const authTime = sessionStorage.getItem(`${slug}_members_auth_time`)
    const isExpired = !authTime || (Date.now() - parseInt(authTime)) > 5 * 60 * 1000
    if (role && !isExpired) { setActiveTab(tab); return }
    // 만료 시 role 초기화
    if (isExpired) { setRole(null); sessionStorage.removeItem(`${slug}_members_role`); sessionStorage.removeItem(`${slug}_members_auth_time`) }
    setPendingTab(tab)
  }

  const handlePin = async (input: string) => {
    if (pinLocked) return
    const res = await fetch('/api/cyber/members/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin: input, temple_slug: slug }) })
    if (res.ok) {
      const { role: r, pin_changed } = await res.json()
      setRole(r); sessionStorage.setItem(`${slug}_members_role`, r); sessionStorage.setItem(`${slug}_members_auth_time`, String(Date.now())); setPinError(0)
      if (pendingTab) { setActiveTab(pendingTab); setPendingTab(null) }
      if (!pin_changed && r === 'admin') setShowChangePin(true)
    } else {
      const next = pinError + 1; setPinError(next)
      if (next >= 3) { setPinLocked(true); setTimeout(() => { setPinLocked(false); setPinError(0) }, 30000) }
    }
    setPin('')
  }

  const handleChangePin = async () => {
    if (newPin.length < 4) return
    await fetch('/api/cyber/members/auth', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current_pin: '0000', new_pin: newPin, temple_slug: slug }) })
    setShowChangePin(false); setNewPin('')
  }

  const logout = () => { setRole(null); setActiveTab(null); sessionStorage.removeItem(`${slug}_members_role`); sessionStorage.removeItem(`${slug}_members_auth_time`) }

  // PIN 화면 (신도카드/기도접수 진입 시에만)
  if (pendingTab && !role) {
    const append = (d: string) => { if (pin.length < 6) setPin(p => p + d) }
    const del = () => setPin(p => p.slice(0, -1))
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#0a0205,#120308)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#F5E6C8', fontFamily: "'Noto Serif KR',serif", padding: '2rem' }}>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />
        <div style={{ fontSize: 40, marginBottom: 8 }}>🏯</div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{tName} 종무소</div>
        <div style={{ fontSize: 12, color: A, letterSpacing: '0.1em', marginBottom: 24 }}>PIN을 입력하세요</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[0, 1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: i < pin.length ? A : `${A}33`, border: `1px solid ${A}66`, transition: 'background 0.15s' }} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, width: 220 }}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '←', '0', '✓'].map(k => (
            <button key={k} disabled={pinLocked} onClick={() => { if (k === '←') del(); else if (k === '✓') { if (pin) handlePin(pin) } else append(k) }} style={{ padding: 14, background: k === '✓' ? `${A}33` : 'rgba(255,255,255,0.05)', border: `1px solid ${k === '✓' ? A : `${A}33`}`, borderRadius: 8, color: k === '✓' ? A : '#F5E6C8', fontSize: 18, fontWeight: 700, cursor: pinLocked ? 'not-allowed' : 'pointer', opacity: pinLocked ? 0.4 : 1 }}>{k}</button>
          ))}
        </div>
        {pinError > 0 && !pinLocked && <div style={{ marginTop: 12, color: '#ef4444', fontSize: 13 }}>PIN 불일치 ({pinError}/3)</div>}
        {pinLocked && <div style={{ marginTop: 12, color: '#ef4444', fontSize: 13 }}>30초 후 재시도</div>}
        <button onClick={() => setPendingTab(null)} style={{ marginTop: 20, padding: '8px 24px', background: 'transparent', border: `1px solid ${A}44`, borderRadius: 6, color: `${A}77`, cursor: 'pointer', fontSize: 12 }}>← 종무소로 돌아가기</button>
      </div>
    )
  }

  // PIN 변경 모달
  if (showChangePin) return (
    <div style={{ minHeight: '100vh', background: '#0a0205', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#F5E6C8', fontFamily: "'Noto Serif KR',serif", padding: '2rem' }}>
      <div style={{ fontSize: 24, marginBottom: 12 }}>🔐</div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: A }}>PIN 변경 필요</div>
      <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 20, textAlign: 'center' }}>처음 로그인하셨습니다.<br />보안을 위해 PIN을 변경해주세요.</div>
      <input value={newPin} onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))} type="password" placeholder="새 PIN (4~6자리)" style={{ width: 200, padding: 12, background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}55`, borderRadius: 8, color: '#F5E6C8', fontSize: 18, textAlign: 'center', letterSpacing: 8 }} />
      <button onClick={handleChangePin} disabled={newPin.length < 4} style={{ marginTop: 12, padding: '10px 40px', background: newPin.length >= 4 ? A : `${A}33`, color: '#0a0205', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>변경 완료</button>
    </div>
  )

  // 신도카드/기도접수 탭 (PIN 인증 후)
  if (activeTab && role) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#0a0205,#120308)', color: '#F5E6C8', fontFamily: "'Noto Serif KR',serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />
      <div style={{ background: 'linear-gradient(90deg,#1a0408,#2d0a10)', borderBottom: `2px solid ${A}`, padding: '0.9rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, color: A, letterSpacing: '0.12em' }}>{tName} 종무소</div>
          <span style={{ fontSize: 10, background: role === 'super' ? '#DC2626' : '#D97706', color: '#fff', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>{role === 'super' ? '슈퍼' : '관리자'}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setActiveTab(null)} style={{ background: 'transparent', border: `1px solid ${A}44`, borderRadius: 6, color: `${A}88`, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>← 종무소</button>
          <button onClick={logout} style={{ background: 'transparent', border: `1px solid ${A}44`, borderRadius: 6, color: `${A}88`, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>로그아웃</button>
        </div>
      </div>
      <div style={{ display: 'flex', borderBottom: `1px solid ${A}22`, background: 'rgba(0,0,0,0.3)' }}>
        {([{ key: 'members' as Tab, icon: '👥', label: '신도카드' }, { key: 'offerings' as Tab, icon: '🙏', label: '기도접수' }, { key: 'mycard' as Tab, icon: '🏅', label: '나의기도동참' }]).map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ flex: 1, padding: '0.8rem 0.4rem', background: activeTab === t.key ? `${A}11` : 'transparent', border: 'none', borderBottom: activeTab === t.key ? `2px solid ${A}` : '2px solid transparent', color: activeTab === t.key ? A : `${A}55`, cursor: 'pointer', fontSize: 13, fontWeight: activeTab === t.key ? 700 : 400, fontFamily: "'Noto Serif KR',serif" }}>{t.icon} {t.label}</button>
        ))}
      </div>
      {activeTab === 'members' && <MembersTab slug={slug} role={role} tName={tName} />}
      {activeTab === 'offerings' && <OfferingsTab slug={slug} config={config} tName={tName} />}
      {activeTab === 'mycard' && <MycardTab slug={slug} config={config} tName={tName} />}
    </div>
  )

  // 종무소 메인 — 7카드 책장
  return (
    <div className="jm-root">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />
      <div className="jm-header"><div className="jm-title">宗 務 所</div><div className="jm-sub">{temple?.denomination || '대한불교조계종'} {tName} 디지털 종무소</div></div>

      <div className="shelf">
        <div className="shelf-plank" />
        <div className="shelf-row">
          <div className="shelf-slot" onClick={() => openProtectedTab('members')}><div className="slot-icon">📋</div><div className="slot-label">신도카드</div><div className="slot-sub">등록/검색 🔐</div></div>
          <div className="shelf-slot" onClick={() => openProtectedTab('offerings')}><div className="slot-icon">🙏</div><div className="slot-label">기도접수</div><div className="slot-sub">기도/공양 🔐</div></div>
          <div className="shelf-slot" onClick={() => setActivePanel('status')}><div className="slot-icon">📊</div><div className="slot-label">접수현황</div><div className="slot-sub">기도/공양 현황</div></div>
        </div>
        <div className="shelf-plank" />
        <div className="shelf-row">
          <div className="shelf-slot" onClick={() => setActivePanel('media')}><div className="slot-icon">📺</div><div className="slot-label">사찰 홍보</div><div className="slot-sub">유튜브/블로그</div></div>
          <div className="shelf-slot" onClick={() => setActivePanel('info')}><div className="slot-icon">🏛️</div><div className="slot-label">사찰 안내</div><div className="slot-sub">소개/오시는길</div></div>
          <div className="shelf-slot" onClick={() => setActivePanel('cal')}><div className="slot-icon">📅</div><div className="slot-label">법회일정</div><div className="slot-sub">음력 기준</div></div>
        </div>
        <div className="shelf-plank" />
        <div className="shelf-row">
          <div className="shelf-slot" onClick={() => window.location.href = `/${slug}/cyber/mycard`}><div className="slot-icon">🏅</div><div className="slot-label">나의기도동참</div><div className="slot-sub">기도 현황 확인</div></div>
          <div className="shelf-slot" onClick={() => window.location.href = `/${slug}/cyber/notice`}><div className="slot-icon">🔔</div><div className="slot-label">공지사항</div><div className="slot-sub">{tName} 소식</div></div>
        </div>
        <div className="shelf-plank" />
      </div>

      {/* 패널 영역 */}
      {activePanel && (
        <div style={{ width: '100%', maxWidth: 520, margin: '12px auto 0', background: '#2a1a0a', border: '1px solid rgba(200,150,30,0.2)', borderRadius: 8, padding: 20, position: 'relative' }}>
          <button onClick={() => setActivePanel(null)} style={{ position: 'absolute', top: 12, right: 16, fontSize: 20, color: 'rgba(245,230,184,0.5)', cursor: 'pointer', background: 'none', border: 'none' }}>&times;</button>

          {activePanel === 'status' && (<>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F5D060', marginBottom: 12, letterSpacing: 2 }}>기도/공양 접수현황</div>
            <StatusPanel slug={slug} />
          </>)}

          {activePanel === 'media' && (<>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F5D060', marginBottom: 12, letterSpacing: 2 }}>사찰 홍보</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <a href="https://www.youtube.com/@108-forU" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 8px', background: 'rgba(255,0,0,0.08)', borderRadius: 10, border: '1px solid rgba(255,0,0,0.2)', textDecoration: 'none' }}><div style={{ fontSize: 24 }}>▶️</div><span style={{ fontSize: 12, color: '#F5E6B8', fontWeight: 700 }}>유튜브</span></a>
              <a href="https://blog.naver.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 8px', background: 'rgba(3,199,90,0.08)', borderRadius: 10, border: '1px solid rgba(3,199,90,0.2)', textDecoration: 'none' }}><div style={{ fontSize: 24 }}>📝</div><span style={{ fontSize: 12, color: '#F5E6B8', fontWeight: 700 }}>네이버 블로그</span></a>
              <a href="https://pf.kakao.com/_placeholder" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 8px', background: 'rgba(254,229,0,0.08)', borderRadius: 10, border: '1px solid rgba(254,229,0,0.2)', textDecoration: 'none' }}><div style={{ fontSize: 24 }}>💬</div><span style={{ fontSize: 12, color: '#F5E6B8', fontWeight: 700 }}>카카오톡</span></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 8px', background: 'rgba(225,48,108,0.08)', borderRadius: 10, border: '1px solid rgba(225,48,108,0.2)', textDecoration: 'none' }}><div style={{ fontSize: 24 }}>📷</div><span style={{ fontSize: 12, color: '#F5E6B8', fontWeight: 700 }}>인스타그램</span></a>
            </div>
          </>)}

          {activePanel === 'info' && (<>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F5D060', marginBottom: 12, letterSpacing: 2 }}>사찰 안내</div>
            {[['사찰명', tName], ['종단', temple?.denomination || '-'], ['주지스님', temple?.abbotName || '-'], ['연락처', temple?.phone || temple?.kakao_notify_tel || '-'], ['주소', temple?.address || '-']].map(([k, v], i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(200,150,30,0.1)', fontSize: 13 }}><span style={{ color: 'rgba(245,230,184,0.5)' }}>{k}</span><span style={{ color: '#F5E6B8', fontWeight: 500 }}>{v}</span></div>)}
          </>)}

          {activePanel === 'cal' && (<>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F5D060', marginBottom: 12, letterSpacing: 2 }}>법회/행사 일정</div>
            <div style={{ fontSize: 12, color: 'rgba(245,230,184,0.5)' }}>
              {[{ d: '매월 음력 1일', l: '초하루법회 새벽 5:30' }, { d: '매월 음력 15일', l: '보름법회 새벽 5:30' }, { d: '매월 음력 18일', l: '관음재일' }, { d: '매월 음력 24일', l: '지장재일' }, { d: '매주 일요일', l: '일요법회 10:30' }].map((e, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(200,150,30,0.1)' }}><span style={{ color: 'rgba(245,230,184,0.5)' }}>{e.d}</span><span style={{ color: '#F5E6B8', fontWeight: 500 }}>{e.l}</span></div>)}
            </div>
          </>)}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 16, paddingBottom: 40 }}>
        <a href={`/${slug}/dharma-wheel?grid=1`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${A}12`, border: `1px solid ${A}33`, color: A, borderRadius: 8, padding: '10px 24px', fontSize: 13, textDecoration: 'none' }}>☸ 도량으로 돌아가기</a>
      </div>

      <style>{`
        .jm-root{width:100%;min-height:100vh;display:flex;flex-direction:column;align-items:center;background:#1e140a;font-family:'Noto Serif KR',serif;color:#F5E6B8;padding:20px 12px;overflow-y:auto;-webkit-overflow-scrolling:touch}
        .jm-header{text-align:center;margin-bottom:16px}.jm-title{font-size:clamp(20px,5vw,24px);font-weight:900;color:#F5D060;letter-spacing:6px}.jm-sub{font-size:11px;color:rgba(245,230,184,0.4);letter-spacing:2px;margin-top:2px}
        .shelf{width:100%;max-width:520px}.shelf-plank{height:10px;background:linear-gradient(180deg,#8B6914,#6B4400);border-radius:2px;margin:0 -4px}
        .shelf-row{display:grid;grid-template-columns:repeat(3,1fr);gap:0}
        .shelf-slot{background:#2a1a0a;border-left:3px solid #5C3A1E;border-right:3px solid #5C3A1E;padding:16px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:130px;cursor:pointer;transition:background 0.3s}.shelf-slot:hover{background:#3a2a1a}.shelf-slot:active{transform:scale(0.97)}
        .slot-icon{font-size:32px;margin-bottom:6px}.slot-label{font-size:12px;font-weight:700;color:#F5D060;letter-spacing:1px;text-align:center}.slot-sub{font-size:9px;color:rgba(245,230,184,0.35);margin-top:2px;text-align:center}
        @media(max-width:500px){.shelf-row{grid-template-columns:repeat(2,1fr)}.shelf-slot{min-height:100px;padding:12px 6px}.jm-title{font-size:20px}}
      `}</style>
    </div>
  )
}

/* ━━ 신도카드 탭 ━━ */
function MembersTab({ slug, role, tName }: { slug: string; role: Role; tName: string }) {
  const [believers, setBelievers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [view, setView] = useState<'list' | 'form'>('list')
  const [page, setPage] = useState<'front' | 'back'>('front')
  const [form, setForm] = useState({ full_name: '', phone: '', phone_land: '', address1: '', sms_consent: false, vow_text: '', extra_memo: '' })
  const [familyRows, setFamilyRows] = useState<any[]>([{ relation_type: '건명', is_lunar: true, birth_date: '', name: '' }, { relation_type: '곤명', is_lunar: true, birth_date: '', name: '' }])
  const [haengRows, setHaengRows] = useState<any[]>([])
  const [younggaRows, setYounggaRows] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')
  const u = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))
  const inp: React.CSSProperties = { width: '100%', padding: '7px 9px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}44`, borderRadius: 6, color: '#F5E6C8', fontSize: 13, boxSizing: 'border-box' }
  const updateFam = (i: number, k: string, v: unknown) => { const n = [...familyRows]; n[i] = { ...n[i], [k]: v }; setFamilyRows(n) }
  const updateYg = (i: number, k: string, v: unknown) => { const n = [...younggaRows]; n[i] = { ...n[i], [k]: v }; setYounggaRows(n) }

  const fetchList = useCallback(async () => {
    setLoading(true)
    const r = await fetch(`/api/cyber/members?temple_slug=${slug}&q=${encodeURIComponent(search)}`)
    const d = await r.json(); setBelievers(Array.isArray(d) ? d : []); setLoading(false)
  }, [slug, search])
  useEffect(() => { fetchList() }, [fetchList])

  const handleSubmit = async () => {
    const firstName = familyRows.find((r: any) => r.name?.trim())?.name || form.full_name
    if (!firstName?.trim()) { setMsg('가족 축원에 성명을 입력하세요'); return }
    setSubmitting(true)
    const res = await fetch('/api/cyber/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ temple_slug: slug, ...form, full_name: firstName.trim(), family: familyRows.filter((r: any) => r.name?.trim()), haenghyo: haengRows, youngga: younggaRows }) })
    const result = await res.json(); setSubmitting(false)
    if (res.ok) { setMsg(`나무아미타불 🙏 축원번호 ${result.chukwon_no}`); setTimeout(() => { setView('list'); fetchList(); setMsg('') }, 1200) }
    else setMsg(result.error || '등록 실패')
  }

  if (view === 'form') return (
    <div style={{ padding: '1rem', maxWidth: 520, margin: '0 auto' }}>
      <div style={{ display: 'flex', marginBottom: 10 }}>
        {[['front', '앞면'] as const, ['back', '뒷면'] as const].map(([v, l]) => <button key={v} onClick={() => setPage(v)} style={{ flex: 1, padding: 8, background: page === v ? `${A}22` : 'transparent', borderBottom: page === v ? `2px solid ${A}` : '2px solid transparent', border: 'none', color: page === v ? A : '#F5E6C8', fontWeight: page === v ? 700 : 400, cursor: 'pointer', fontSize: 13 }}>{l}</button>)}
      </div>
      {page === 'front' ? (<>
        {/* 단청 헤더 */}
        <div style={{ textAlign: 'center', padding: '12px 0 16px', borderBottom: `1px solid ${A}33`, marginBottom: 12 }}>
          <div style={{ fontSize: 14, color: A, letterSpacing: 6 }}>卍 {tName} 축원문 卍</div>
          <div style={{ fontSize: 10, color: `${A}66`, marginTop: 4 }}>축원번호: 자동생성</div>
        </div>

        {/* 가족축원 테이블 */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}><table style={{ width: '100%', minWidth: 340, borderCollapse: 'collapse', marginBottom: 8 }}>
          <thead><tr style={{ background: `${A}11`, fontSize: 11, color: A }}>
            <th style={{ padding: '6px 4px', textAlign: 'center', width: 60 }}>관계</th>
            <th style={{ padding: '6px 4px', textAlign: 'center', width: 60 }}>음·양력</th>
            <th style={{ padding: '6px 4px', textAlign: 'center', width: 100 }}>생년월일</th>
            <th style={{ padding: '6px 4px', textAlign: 'center' }}>성명</th>
            <th style={{ width: 24 }}></th>
          </tr></thead>
          <tbody>
            {familyRows.map((m: any, i: number) => (
              <tr key={i} style={{ borderBottom: `1px solid ${A}11` }}>
                <td style={{ padding: 4 }}><select value={m.relation_type} onChange={e => updateFam(i, 'relation_type', e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}33`, borderRadius: 4, color: '#F5E6C8', padding: '4px 2px', fontSize: 12 }}>{RELS.map(r => <option key={r} value={r} style={{ background: '#1a0408' }}>{r}</option>)}</select></td>
                <td style={{ padding: 4 }}><div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>{['음', '양'].map(t => <button key={t} onClick={() => updateFam(i, 'is_lunar', t === '음')} style={{ padding: '3px 6px', background: (t === '음') === m.is_lunar ? `${A}33` : 'transparent', border: `1px solid ${A}33`, borderRadius: 3, color: (t === '음') === m.is_lunar ? A : '#F5E6C8', cursor: 'pointer', fontSize: 11 }}>{t}</button>)}</div></td>
                <td style={{ padding: 4 }}><input value={m.birth_date || ''} onChange={e => updateFam(i, 'birth_date', e.target.value)} placeholder="1960.01.15" style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}33`, borderRadius: 4, color: '#F5E6C8', padding: '4px 6px', fontSize: 12, boxSizing: 'border-box' }} />{getGapja(m.birth_date) && <div style={{ fontSize: 11, color: `${A}88`, marginTop: 1 }}>{getGapja(m.birth_date)}</div>}</td>
                <td style={{ padding: 4 }}><input value={m.name} onChange={e => updateFam(i, 'name', e.target.value)} placeholder="성명" style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}33`, borderRadius: 4, color: '#F5E6C8', padding: '4px 6px', fontSize: 12, boxSizing: 'border-box' }} /></td>
                <td style={{ padding: 4, textAlign: 'center' }}><button onClick={() => setFamilyRows(familyRows.filter((_, j) => j !== i))} style={{ background: 'transparent', border: 'none', color: `${A}44`, cursor: 'pointer', fontSize: 13 }}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <button onClick={() => setFamilyRows([...familyRows, { relation_type: '자', is_lunar: true, birth_date: '', name: '' }])} style={{ width: '100%', marginTop: 4, padding: 7, background: 'transparent', border: `1px dashed ${A}33`, borderRadius: 6, color: `${A}66`, cursor: 'pointer', fontSize: 12 }}>+ 가족 추가</button>

        {/* 연락처 */}
        <div style={{ display: 'flex', gap: 6, marginTop: 14, marginBottom: 8 }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 10, color: `${A}aa`, marginBottom: 2 }}>핸드폰</div><input value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="010-0000-0000" style={inp} /></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 10, color: `${A}aa`, marginBottom: 2 }}>집전화</div><input value={form.phone_land} onChange={e => u('phone_land', e.target.value)} placeholder="02-000-0000" style={inp} /></div>
        </div>
        <F label="주소"><input value={form.address1} onChange={e => u('address1', e.target.value)} style={inp} /></F>
        <F label="발원문"><textarea value={form.vow_text} onChange={e => u('vow_text', e.target.value)} rows={3} placeholder="나무아미타불..." style={{ ...inp, resize: 'vertical', fontFamily: "'Noto Serif KR',serif" }} /></F>
        <div style={{ marginTop: 12, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: A, fontWeight: 700, marginBottom: 4, borderBottom: `1px solid ${A}22`, paddingBottom: 3 }}><span>기타사항</span><span style={{ fontWeight: 400, opacity: 0.5, fontSize: 10 }}>{form.extra_memo.length}/1000</span></div>
          <textarea value={form.extra_memo} maxLength={1000} onChange={e => u('extra_memo', e.target.value)} placeholder={'신도 관련 특이사항, 상담 내용,\n스님 메모 등 (최대 1,000자)'} rows={4} style={{ ...inp, minHeight: 96, resize: 'vertical', fontFamily: "'Noto Serif KR',serif", lineHeight: 1.6 }} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, cursor: 'pointer', marginBottom: 10 }}><input type="checkbox" checked={form.sms_consent} onChange={e => u('sms_consent', e.target.checked)} />{tName} 법회·기도·행사 SMS/카카오 수신동의</label>
        <button onClick={() => setPage('back')} style={{ width: '100%', padding: 10, background: `${A}22`, border: `1px solid ${A}`, borderRadius: 8, color: A, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>뒷면으로 →</button>
      </>) : (<>
        {/* 뒷면: 행효 */}
        <Sec title="行孝 (최대 3)" />
        {haengRows.map((r: any, i: number) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 80px 1fr 36px', gap: 6, alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${A}11` }}>
            <div style={{ color: A, fontWeight: 700, fontSize: 13, textAlign: 'center', lineHeight: 1.3 }}>行<br/>孝</div>
            <div style={{ display: 'flex', gap: 3 }}>{['자', '녀'].map(t => <button key={t} onClick={() => { const n = [...haengRows]; n[i].relation_type = t; setHaengRows(n) }} style={{ flex: 1, padding: '5px 4px', background: r.relation_type === t ? `${A}33` : 'transparent', border: `1px solid ${A}33`, borderRadius: 4, color: r.relation_type === t ? A : '#F5E6C8', cursor: 'pointer', fontSize: 13, fontWeight: r.relation_type === t ? 700 : 400 }}>{t}</button>)}</div>
            <input value={r.name} onChange={e => { const n = [...haengRows]; n[i].name = e.target.value; setHaengRows(n) }} placeholder="성명" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}33`, borderRadius: 4, color: '#F5E6C8', padding: '5px 8px', fontSize: 13 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}><span style={{ color: `${A}66`, fontSize: 10, lineHeight: 1.2 }}>伏<br/>爲</span><button onClick={() => setHaengRows(haengRows.filter((_, j) => j !== i))} style={{ background: 'transparent', border: 'none', color: `${A}44`, cursor: 'pointer', fontSize: 12, padding: 0 }}>✕</button></div>
          </div>
        ))}
        {haengRows.length < 3 && <button onClick={() => setHaengRows([...haengRows, { name: '', birth_year: '', relation_type: '자' }])} style={{ width: '100%', padding: 6, background: `${A}11`, border: `1px dashed ${A}44`, borderRadius: 6, color: A, cursor: 'pointer', fontSize: 11, marginBottom: 14 }}>+ 행효 추가</button>}

        {/* 뒷면: 영가 */}
        <Sec title="亡 영가 (최대 10위)" />
        {younggaRows.map((y: any, i: number) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 60px 1fr 130px 36px', gap: 6, alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${A}11` }}>
            <div style={{ color: A, fontWeight: 700, fontSize: 14, textAlign: 'center' }}>亡</div>
            <select value={y.relation_type || ''} onChange={e => updateYg(i, 'relation_type', e.target.value)} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}33`, borderRadius: 4, color: '#F5E6C8', padding: '4px 2px', fontSize: 11 }}><option value="" style={{ background: '#1a0408' }}>관계</option>{['엄부','자모','조부','조모','형','제','자','매','친척','기타'].map(r => <option key={r} value={r} style={{ background: '#1a0408' }}>{r}</option>)}</select>
            <input value={y.name} onChange={e => updateYg(i, 'name', e.target.value)} placeholder="성명" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}33`, borderRadius: 4, color: '#F5E6C8', padding: '5px 8px', fontSize: 13 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ display: 'flex', gap: 3 }}>{['음', '양'].map(t => <button key={t} onClick={() => updateYg(i, 'jesa_lunar', t === '음')} style={{ flex: 1, padding: '2px 4px', background: (t === '음') === (y.jesa_lunar ?? true) ? `${A}33` : 'transparent', border: `1px solid ${A}33`, borderRadius: 3, color: (t === '음') === (y.jesa_lunar ?? true) ? A : '#F5E6C8', cursor: 'pointer', fontSize: 10 }}>{t}력</button>)}</div>
              <input value={y.jesa_date || ''} onChange={e => updateYg(i, 'jesa_date', e.target.value)} placeholder="월.일 (03.15)" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}33`, borderRadius: 4, color: '#F5E6C8', padding: '4px 6px', fontSize: 11 }} />
            </div>
            <div style={{ color: `${A}66`, fontSize: 10, textAlign: 'center', lineHeight: 1.3 }}>番<br />閔</div>
          </div>
        ))}
        {younggaRows.length < 10 && <button onClick={() => setYounggaRows([...younggaRows, { name: '', jesa_date: '', jesa_lunar: true }])} style={{ width: '100%', marginTop: 6, padding: 7, background: 'transparent', border: `1px dashed ${A}33`, borderRadius: 6, color: `${A}66`, cursor: 'pointer', fontSize: 12 }}>+ 영가 추가 (최대 10위)</button>}

        {msg && <div style={{ textAlign: 'center', padding: 8, color: msg.includes('나무') ? '#22c55e' : '#ef4444', fontWeight: 700, fontSize: 13 }}>{msg}</div>}
        <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
          <button onClick={() => setPage('front')} style={{ flex: 1, padding: 10, background: `${A}22`, border: `1px solid ${A}`, borderRadius: 8, color: A, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>← 앞면</button>
          <button onClick={handleSubmit} disabled={submitting} style={{ flex: 2, padding: 10, background: submitting ? `${A}33` : 'linear-gradient(135deg,#8B6914,#C8961E)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13, letterSpacing: 2 }}>{submitting ? '등록 중...' : '🪷 신도카드 안치'}</button>
        </div>
      </>)}
      <button onClick={() => { setView('list'); setMsg('') }} style={{ width: '100%', marginTop: 8, padding: 8, background: 'transparent', border: `1px solid ${A}33`, borderRadius: 6, color: `${A}77`, cursor: 'pointer', fontSize: 12 }}>← 목록으로</button>
    </div>
  )

  return (
    <div style={{ padding: '1rem', maxWidth: 560, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="이름·법명·연락처" style={{ flex: 1, padding: '7px 10px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${A}44`, borderRadius: 6, color: '#F5E6C8', fontSize: 13, boxSizing: 'border-box' }} />
        <button onClick={() => setView('form')} style={{ background: A, color: '#0a0205', border: 'none', borderRadius: 6, padding: '7px 14px', fontWeight: 700, cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' }}>+ 등록</button>
      </div>
      <div style={{ fontSize: 11, color: `${A}88`, marginBottom: 8 }}>전체 {believers.length}명</div>
      {loading ? <div style={{ textAlign: 'center', padding: '2rem', color: A }}>불러오는 중...</div> :
       believers.length === 0 ? <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.4, fontSize: 13 }}>등록된 신도가 없습니다</div> :
       believers.map((b: any) => (
        <div key={b.id} onClick={() => setSelected(selected === b.id ? null : b.id)} style={{ background: selected === b.id ? `${A}0a` : 'rgba(255,255,255,0.03)', border: `1px solid ${selected === b.id ? A : `${A}18`}`, borderRadius: 8, padding: '0.75rem', marginBottom: 6, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div><span style={{ fontWeight: 700, fontSize: 14 }}>{b.full_name}</span>{b.buddhist_name && <span style={{ color: A, fontSize: 12, marginLeft: 5 }}>({b.buddhist_name})</span>}{b.chukwon_no && <span style={{ fontSize: 11, color: `${A}66`, marginLeft: 6 }}>{b.chukwon_no}</span>}</div>
            {b.believerOfferings?.length > 0 && <div style={{ display: 'flex', gap: 2 }}>{b.believerOfferings.filter((o: any) => o.status === 'active').map((o: any) => <span key={o.id} style={{ fontSize: 11, background: `${A}22`, border: `1px solid ${A}33`, borderRadius: 3, padding: '0px 3px', color: A }}>{o.offering_type === 'yeondeung' ? '🏮' : o.offering_type === 'indung' ? '🕯️' : '🪷'}</span>)}</div>}
          </div>
          {b.phone && <div style={{ fontSize: 11, opacity: 0.4, marginTop: 1 }}>{b.phone}</div>}
          {selected === b.id && (
            <div style={{ marginTop: 8, borderTop: `1px solid ${A}18`, paddingTop: 8, fontSize: 12 }}>
              {b.familyMembers?.length > 0 && <div style={{ marginBottom: 6, padding: 6, background: `${A}06`, borderRadius: 6 }}><div style={{ fontSize: 10, color: A, fontWeight: 700, marginBottom: 3 }}>가족</div>{b.familyMembers.map((f: any) => <div key={f.id} style={{ fontSize: 11 }}>└ {f.name} ({f.relation_type})</div>)}</div>}
              {b.haenghyo?.length > 0 && <div style={{ marginBottom: 6, padding: 6, background: 'rgba(155,122,204,0.05)', borderRadius: 6 }}><div style={{ fontSize: 10, color: '#9b7acc', fontWeight: 700, marginBottom: 3 }}>行孝</div>{b.haenghyo.map((h: any) => <div key={h.id} style={{ fontSize: 11 }}>└ {h.name} ({h.relation_type})</div>)}</div>}
              {b.youngga?.length > 0 && <div style={{ marginBottom: 6, padding: 6, background: 'rgba(100,100,140,0.05)', borderRadius: 6 }}><div style={{ fontSize: 10, color: '#8888bb', fontWeight: 700, marginBottom: 3 }}>亡 영가</div>{b.youngga.map((y: any) => <div key={y.id} style={{ fontSize: 11 }}>└ {y.name} {y.death_year && `(→${y.death_year})`}</div>)}</div>}
              {b.memo && <div style={{ fontSize: 11, opacity: 0.5, padding: 4, marginBottom: 6, whiteSpace: 'pre-wrap' }}>{b.memo}</div>}
              <div style={{ display: 'flex', gap: 4 }}>
                {b.phone && <><a href={`tel:${b.phone}`} style={{ flex: 1, textAlign: 'center', padding: 5, background: A, borderRadius: 6, color: '#0a0205', fontWeight: 700, fontSize: 11, textDecoration: 'none' }}>📞</a><a href={`sms:${b.phone}`} style={{ flex: 1, textAlign: 'center', padding: 5, background: `${A}33`, border: `1px solid ${A}`, borderRadius: 6, color: A, fontWeight: 700, fontSize: 11, textDecoration: 'none' }}>💬</a></>}
                <button onClick={async (e) => { e.stopPropagation(); if (!confirm(`${b.full_name}님을 ${role === 'super' ? '완전 삭제' : '탈퇴 처리'}하시겠습니까?`)) return; await fetch('/api/cyber/members', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: b.id, temple_slug: slug, role }) }); fetchList() }} style={{ flex: 1, padding: 5, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{role === 'super' ? '🗑️ 삭제' : '탈퇴'}</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ━━ 기도접수 탭 ━━ */
function OfferingsTab({ slug, config, tName }: { slug: string; config: any; tName: string }) {
  const [list, setList] = useState<any[]>([])
  const [view, setView] = useState<'list' | 'form'>('list')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [offeringInputs, setOfferingInputs] = useState<Record<string, { name: string; vow: string }>>({})
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')
  const inp: React.CSSProperties = { width: '100%', padding: '7px 9px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}44`, borderRadius: 6, color: '#F5E6C8', fontSize: 13, boxSizing: 'border-box' }
  const toggleType = (t: string) => { setSelectedTypes(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]); if (!selectedTypes.includes(t)) setOfferingInputs(p => ({ ...p, [t]: { name: '', vow: '' } })) }
  const updateOI = (t: string, f: 'name' | 'vow', v: string) => setOfferingInputs(p => ({ ...p, [t]: { ...p[t], [f]: v } }))

  const fetchList = useCallback(async () => {
    const r = await fetch(`/api/cyber/members?temple_slug=${slug}&limit=200`)
    const d = await r.json(); const all: any[] = []
    if (Array.isArray(d)) d.forEach((b: any) => b.believerOfferings?.forEach((o: any) => all.push({ ...o, believer_name: b.full_name })))
    setList(all)
  }, [slug])
  useEffect(() => { fetchList() }, [fetchList])

  const stats = config.offerings.map((o: any) => { const items = list.filter((l: any) => l.offering_type === o.type && l.status === 'active'); return { ...o, count: items.length, total: items.length * o.price } })

  const handleSubmit = async () => {
    if (selectedTypes.length === 0) { setMsg('기도 유형을 선택하세요'); return }
    const errors: string[] = []
    selectedTypes.forEach(t => { if (!offeringInputs[t]?.name?.trim()) { const l = config.offerings.find((o: any) => o.type === t)?.label || t; errors.push(`${l} 성함 필수`) } })
    if (errors.length > 0) { setMsg(errors.join(', ')); return }
    setSubmitting(true); let ok = 0
    for (const t of selectedTypes) {
      const info = offeringInputs[t]
      const res = await fetch('/api/cyber/members/offerings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ temple_slug: slug, offering_type: t, participant_name: info.name.trim(), vow_text: info.vow?.trim() || null }) })
      if (res.ok) ok++
    }
    setSubmitting(false)
    if (ok === selectedTypes.length) { setMsg(`🙏 ${ok}건 접수 완료`); setTimeout(() => { setView('list'); fetchList(); setMsg(''); setSelectedTypes([]); setOfferingInputs({}) }, 1200) }
    else setMsg(`${ok}건 완료, 일부 실패`)
  }

  return (
    <div style={{ padding: '1rem', maxWidth: 520, margin: '0 auto' }}>
      {/* 통계는 접수현황 카드에서 표시 */}
      {view === 'list' ? (<>
        <button onClick={() => setView('form')} style={{ width: '100%', padding: 10, background: A, color: '#0a0205', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13, marginBottom: 10 }}>+ 기도 접수하기</button>
        {list.filter((l: any) => l.status === 'active').map((o: any) => (
          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: `1px solid ${A}11`, fontSize: 12 }}>
            <div><span>{config.offerings.find((c: any) => c.type === o.offering_type)?.icon} </span><span style={{ fontWeight: 600 }}>{o.participant_name}</span>{o.vow_text && <div style={{ fontSize: 10, opacity: 0.4 }}>{o.vow_text.slice(0, 25)}</div>}</div>
            <button onClick={async () => { if (!confirm('취소?')) return; await fetch('/api/cyber/members/offerings', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: o.id }) }); fetchList() }} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 4, color: '#ef4444', fontSize: 10, padding: '2px 6px', cursor: 'pointer' }}>취소</button>
          </div>
        ))}
      </>) : (<>
        <Sec title="기도 유형 (복수 선택 가능)" />
        {config.offerings.map((o: any) => (<div key={o.type}>
          <button onClick={() => toggleType(o.type)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: selectedTypes.includes(o.type) ? `${A}15` : 'transparent', border: `1px solid ${selectedTypes.includes(o.type) ? A : `${A}25`}`, borderRadius: selectedTypes.includes(o.type) ? '10px 10px 0 0' : 10, color: selectedTypes.includes(o.type) ? A : '#F5E6C8', cursor: 'pointer', marginBottom: selectedTypes.includes(o.type) ? 0 : 6, fontSize: 13 }}>
            <span style={{ fontWeight: 700 }}><span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: selectedTypes.includes(o.type) ? A : 'transparent', border: `1px solid ${selectedTypes.includes(o.type) ? A : `${A}44`}`, marginRight: 8, verticalAlign: 'middle', fontSize: 10, color: '#0a0205', textAlign: 'center', lineHeight: '16px' }}>{selectedTypes.includes(o.type) ? '✓' : ''}</span>{o.icon} {o.label}</span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>{o.period} · {o.price.toLocaleString()}원</span>
          </button>
          {selectedTypes.includes(o.type) && (
            <div style={{ background: `${A}08`, border: `1px solid ${A}`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '10px 12px', marginBottom: 6 }}>
              <div style={{ marginBottom: 6 }}><div style={{ fontSize: 11, opacity: 0.6, marginBottom: 3 }}>동참 성함 *</div><input value={offeringInputs[o.type]?.name || ''} onChange={e => updateOI(o.type, 'name', e.target.value)} placeholder="홍길동" style={inp} /></div>
              <div><div style={{ fontSize: 11, opacity: 0.6, marginBottom: 3 }}>발원내용</div><input value={offeringInputs[o.type]?.vow || ''} onChange={e => updateOI(o.type, 'vow', e.target.value)} placeholder="나무아미타불..." style={inp} /></div>
            </div>
          )}
        </div>))}
        <div style={{ padding: 8, background: `${A}08`, border: `1px solid ${A}33`, borderRadius: 8, marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: A, fontWeight: 700, marginBottom: 3 }}>입금 계좌</div>
          <div style={{ fontSize: 12 }}>{config.bank.name} {config.bank.account}</div>
          <div style={{ fontSize: 10, opacity: 0.5 }}>예금주: {config.bank.holder}</div>
          <button onClick={() => { navigator.clipboard.writeText(config.bank.account); alert('복사됨') }} style={{ marginTop: 3, padding: '3px 10px', background: `${A}22`, border: `1px solid ${A}`, borderRadius: 4, color: A, fontSize: 10, cursor: 'pointer' }}>복사</button>
        </div>
        {msg && <div style={{ textAlign: 'center', padding: 6, color: msg.includes('나무') ? '#22c55e' : '#ef4444', fontWeight: 700, fontSize: 12 }}>{msg}</div>}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => { setView('list'); setMsg('') }} style={{ flex: 1, padding: 10, background: `${A}22`, border: `1px solid ${A}`, borderRadius: 8, color: A, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>← 현황</button>
          <button onClick={handleSubmit} disabled={submitting} style={{ flex: 2, padding: 10, background: submitting ? `${A}33` : 'linear-gradient(135deg,#8B6914,#C8961E)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>{submitting ? '접수 중...' : '🙏 접수 완료'}</button>
        </div>
      </>)}
    </div>
  )
}

/* ━━ 공덕카드 탭 ━━ */
function MycardTab({ slug, config, tName }: { slug: string; config: any; tName: string }) {
  const [nameInput, setNameInput] = useState('')
  const [phoneLast4, setPhoneLast4] = useState('')
  const [multiple, setMultiple] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')
  const handleSearch = async () => {
    if (!nameInput.trim()) return
    const params = new URLSearchParams({ name: nameInput.trim(), temple: slug })
    if (phoneLast4) params.set('phone_last4', phoneLast4)
    const r = await fetch(`/api/cyber/mycard?${params}`)
    const d = await r.json()
    if (d.multiple) { setMultiple(true); setError(''); setData(null) }
    else if (r.ok) { setData(d); setError(''); setMultiple(false) }
    else { setData(null); setError(d.error || '조회 결과 없음') }
  }
  useEffect(() => { if (data?.full_name) { const iv = setInterval(() => handleSearch(), 30000); return () => clearInterval(iv) } }, [data?.full_name])

  return (
    <div style={{ padding: '1.5rem 1rem', maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      {!data ? (<>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🏅</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: A, marginBottom: 4 }}>나의 기도동참</div>
        <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 16 }}>성함을 입력하시면<br/>기도 접수 현황을 확인하실 수 있습니다.</div>
        <input value={nameInput} onChange={e => setNameInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="성함을 입력하세요" style={{ width: 240, padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}44`, borderRadius: 8, color: '#F5E6C8', fontSize: 15, textAlign: 'center', marginBottom: 8 }} />
        {multiple && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, color: A, marginBottom: 6 }}>동명이인이 있습니다.<br/>연락처 뒷 4자리를 입력해주세요.</div>
            <input value={phoneLast4} onChange={e => setPhoneLast4(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="뒷 4자리" maxLength={4} style={{ width: 160, padding: '8px 12px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}44`, borderRadius: 8, color: '#F5E6C8', fontSize: 16, textAlign: 'center', letterSpacing: 4 }} />
          </div>
        )}
        <button onClick={handleSearch} style={{ display: 'block', width: 240, margin: '10px auto 0', padding: 10, background: A, color: '#0a0205', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>🔍 확인하기</button>
        {error && <div style={{ marginTop: 8, color: '#ef4444', fontSize: 12 }}>{error}</div>}
      </>) : (<>
        <div style={{ background: `${A}08`, border: `1px solid ${A}33`, borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: A }}>🏯 {tName}</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 3 }}>{data.full_name} {data.buddhist_name ? `(${data.buddhist_name})` : ''}</div>
          <div style={{ fontSize: 11, color: `${A}88`, marginTop: 2 }}>{data.chukwon_no && `${data.chukwon_no} · `}가족 {data.family_count}인</div>
          <div style={{ marginTop: 12, textAlign: 'left' }}>
            {config.offerings.map((o: any) => {
              const active = data.offerings.find((of: any) => of.type === o.type && of.status === 'active')
              return <div key={o.type} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${A}11`, fontSize: 13 }}><span>{o.icon} {o.label}</span><span style={{ color: active ? '#22c55e' : `${A}44`, fontWeight: 700 }}>{active ? '✅ 점등' : '─'}</span></div>
            })}
          </div>
        </div>
        <button onClick={() => { setData(null); setNameInput(''); setPhoneLast4(''); setMultiple(false) }} style={{ marginTop: 12, padding: '6px 16px', background: `${A}22`, border: `1px solid ${A}`, borderRadius: 6, color: A, cursor: 'pointer', fontSize: 11 }}>다른 분 조회</button>
      </>)}
    </div>
  )
}

function Sec({ title }: { title: string }) { return <div style={{ fontSize: 12, color: A, fontWeight: 700, margin: '12px 0 6px', borderBottom: `1px solid ${A}22`, paddingBottom: 2 }}>{title}</div> }
function F({ label, children }: { label: string; children: React.ReactNode }) { return <div style={{ marginBottom: 7 }}><div style={{ fontSize: 10, color: `${A}aa`, marginBottom: 2 }}>{label}</div>{children}</div> }

function StatusPanel({ slug }: { slug: string }) {
  const [data, setData] = useState<any[]>([])
  useEffect(() => { fetch(`/api/cyber/status?temple_slug=${slug}`).then(r => r.json()).then(d => { if (Array.isArray(d)) setData(d) }).catch(() => {}) }, [slug])
  if (data.length === 0) return <div style={{ color: 'rgba(245,230,184,0.3)', textAlign: 'center', padding: 12, fontSize: 12 }}>데이터 없음</div>
  return <>{data.map((item, i) => <div key={i}><div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(200,150,30,0.1)', fontSize: 13 }}><span style={{ color: 'rgba(245,230,184,0.5)' }}>{item.name}</span><span style={{ color: '#F5E6B8', fontWeight: 500 }}>{item.current}/{item.total}{item.unit}</span></div><div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 8px' }}><div style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(200,150,30,0.15)' }}><div style={{ height: 8, borderRadius: 4, background: '#C8961E', width: `${item.total > 0 ? Math.round(item.current / item.total * 100) : 0}%` }} /></div><span style={{ fontSize: 10, color: 'rgba(245,230,184,0.5)', minWidth: 36, textAlign: 'right' }}>{item.total > 0 ? Math.round(item.current / item.total * 100) : 0}%</span></div></div>)}</>
}
