'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useCyberTemple } from '@/lib/useCyberTemple'
import { TEMPLE_OFFERINGS } from '@/lib/constants/templeOfferings'

const A = '#C9A84C'
const GENDERS = [['gonmyeong', '건명(男)'], ['gonmyeong_f', '곤명(女)']] as const
const RELS = ['부', '모', '자', '녀', '손자', '손녀', '배우자', '형제', '기타']

export default function MembersPage() {
  const { slug } = useParams<{ slug: string }>()
  const temple = useCyberTemple(slug)
  const tName = temple?.name || slug
  const config = TEMPLE_OFFERINGS[slug]

  const [authed, setAuthed] = useState(false)
  const [pin, setPin] = useState('')
  const [view, setView] = useState<'list' | 'form'>('list')
  const [believers, setBelievers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  // PIN 인증
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(`${slug}_members_auth`) === '1') setAuthed(true)
  }, [slug])
  const tPin = temple?.pin || '1080'
  const doAuth = () => { if (pin === tPin) { setAuthed(true); sessionStorage.setItem(`${slug}_members_auth`, '1') } else alert('비밀번호가 일치하지 않습니다.') }

  const fetchList = useCallback(async () => {
    setLoading(true)
    const r = await fetch(`/api/cyber/members?temple_slug=${slug}&q=${encodeURIComponent(search)}`)
    const d = await r.json()
    setBelievers(Array.isArray(d) ? d : [])
    setLoading(false)
  }, [slug, search])
  useEffect(() => { if (authed) fetchList() }, [authed, fetchList])

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#0a0205', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Noto Serif KR',serif", color: '#F5E6C8' }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: A, marginBottom: 8 }}>{tName} 신도대장</div>
      <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 20 }}>스님 전용 · 비밀번호를 입력하세요</div>
      <input value={pin} onChange={e => setPin(e.target.value)} type="password" maxLength={8} placeholder="비밀번호" onKeyDown={e => e.key === 'Enter' && doAuth()} style={{ width: 200, padding: '12px 16px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}55`, borderRadius: 8, color: '#F5E6C8', fontSize: 18, textAlign: 'center', letterSpacing: 8 }} />
      <button onClick={doAuth} style={{ marginTop: 12, padding: '10px 40px', background: A, color: '#0a0205', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>인증</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#0a0205,#120308)', color: '#F5E6C8', fontFamily: "'Noto Serif KR',serif", paddingBottom: '2rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />

      {/* 단청 헤더 */}
      <div style={{ background: 'linear-gradient(90deg,#1a0408,#2d0a10)', borderBottom: `2px solid ${A}`, padding: '1rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: A, letterSpacing: '0.15em' }}>卍 {tName} 축원문 卍</div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>신도대장</h1>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setView(view === 'form' ? 'list' : 'form')} style={{ background: view === 'form' ? `${A}22` : A, color: view === 'form' ? A : '#0a0205', border: `1px solid ${A}`, borderRadius: 8, padding: '6px 12px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>{view === 'form' ? '← 목록' : '+ 등록'}</button>
          <a href={`/${slug}/dharma-wheel?grid=1`} style={{ display: 'flex', alignItems: 'center', background: `${A}22`, border: `1px solid ${A}44`, color: A, borderRadius: 8, padding: '6px 10px', textDecoration: 'none' }}>☸</a>
        </div>
      </div>

      {view === 'list' ? (
        <ListView believers={believers} loading={loading} search={search} setSearch={setSearch} selected={selected} setSelected={setSelected} slug={slug} fetchList={fetchList} />
      ) : (
        <FormView slug={slug} tName={tName} config={config} onSuccess={() => { setView('list'); fetchList() }} />
      )}
    </div>
  )
}

/* ━━ 목록 ━━ */
function ListView({ believers, loading, search, setSearch, selected, setSelected, slug, fetchList }: any) {
  return (
    <div style={{ padding: '1rem', maxWidth: 600, margin: '0 auto' }}>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="이름 · 법명 · 연락처" style={{ width: '100%', padding: '0.65rem 0.9rem', background: 'rgba(255,255,255,0.05)', border: `1px solid ${A}44`, borderRadius: 8, color: '#F5E6C8', fontSize: 14, marginBottom: 10, boxSizing: 'border-box' }} />
      <div style={{ fontSize: 12, color: `${A}99`, marginBottom: 10 }}>전체 {believers.length}명</div>
      {loading ? <div style={{ textAlign: 'center', padding: '3rem', color: A }}>불러오는 중...</div> :
       believers.length === 0 ? <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.4 }}>등록된 신도가 없습니다</div> :
       believers.map((b: any) => (
        <div key={b.id} onClick={() => setSelected(selected === b.id ? null : b.id)} style={{ background: selected === b.id ? `${A}11` : 'rgba(255,255,255,0.03)', border: `1px solid ${selected === b.id ? A : `${A}22`}`, borderRadius: 10, padding: '0.85rem', marginBottom: 8, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontWeight: 700 }}>{b.is_deceased ? '🪷 ' : ''}{b.full_name}</span>
              {b.buddhist_name && <span style={{ color: A, fontSize: 13, marginLeft: 6 }}>({b.buddhist_name})</span>}
              {b.chukwon_no && <span style={{ fontSize: 10, color: `${A}77`, marginLeft: 8 }}>{b.chukwon_no}</span>}
            </div>
            {/* 기도접수 뱃지 */}
            {b.believerOfferings?.length > 0 && (
              <div style={{ display: 'flex', gap: 3 }}>
                {b.believerOfferings.map((o: any) => <span key={o.id} style={{ fontSize: 10, background: `${A}22`, border: `1px solid ${A}44`, borderRadius: 4, padding: '1px 4px', color: A }}>{o.offering_type === 'yeondeung' ? '🏮' : o.offering_type === 'indung' ? '🕯️' : '🪷'}</span>)}
              </div>
            )}
          </div>
          {b.phone && <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>{b.phone}</div>}

          {/* 펼침 */}
          {selected === b.id && (
            <div style={{ marginTop: 10, borderTop: `1px solid ${A}22`, paddingTop: 10, fontSize: 13 }}>
              {/* 가족 */}
              {b.familyMembers?.length > 0 && (
                <div style={{ marginBottom: 8, padding: 8, background: `${A}08`, borderRadius: 6 }}>
                  <div style={{ fontSize: 11, color: A, fontWeight: 700, marginBottom: 4 }}>가족 구성원</div>
                  {b.familyMembers.map((f: any) => <div key={f.id} style={{ fontSize: 12, marginBottom: 2 }}>└ {f.name} ({f.relation_type}) {f.birth_year && `${f.birth_year}년`}</div>)}
                </div>
              )}
              {/* 행효 */}
              {b.haenghyo?.length > 0 && (
                <div style={{ marginBottom: 8, padding: 8, background: 'rgba(155,122,204,0.06)', borderRadius: 6 }}>
                  <div style={{ fontSize: 11, color: '#9b7acc', fontWeight: 700, marginBottom: 4 }}>行孝</div>
                  {b.haenghyo.map((h: any) => <div key={h.id} style={{ fontSize: 12 }}>└ {h.name} ({h.relation_type}) {h.birth_year && `${h.birth_year}년`}</div>)}
                </div>
              )}
              {/* 영가 */}
              {b.youngga?.length > 0 && (
                <div style={{ marginBottom: 8, padding: 8, background: 'rgba(100,100,140,0.06)', borderRadius: 6 }}>
                  <div style={{ fontSize: 11, color: '#8888bb', fontWeight: 700, marginBottom: 4 }}>亡 영가</div>
                  {b.youngga.map((y: any) => <div key={y.id} style={{ fontSize: 12 }}>└ {y.name} {y.birth_year && `(${y.birth_year})`} {y.death_year && `→ ${y.death_year}`}</div>)}
                </div>
              )}
              {b.memo && <div style={{ fontSize: 12, opacity: 0.6, background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 6, marginBottom: 8, whiteSpace: 'pre-wrap' }}>{b.memo}</div>}
              <div style={{ display: 'flex', gap: 6 }}>
                {b.phone && <><a href={`tel:${b.phone}`} style={{ flex: 1, textAlign: 'center', padding: 6, background: A, borderRadius: 6, color: '#0a0205', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>📞 전화</a><a href={`sms:${b.phone}`} style={{ flex: 1, textAlign: 'center', padding: 6, background: `${A}33`, border: `1px solid ${A}`, borderRadius: 6, color: A, fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>💬 문자</a></>}
                <button onClick={async (e) => { e.stopPropagation(); if (!confirm(`${b.full_name} 탈퇴?`)) return; await fetch('/api/cyber/members', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: b.id, temple_slug: slug }) }); fetchList() }} style={{ flex: 1, padding: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>탈퇴</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ━━ 등록 폼 (앞면+뒷면) ━━ */
function FormView({ slug, tName, config, onSuccess }: any) {
  const [page, setPage] = useState<'front' | 'back'>('front')
  const [form, setForm] = useState({ full_name: '', buddhist_name: '', gender_type: 'gonmyeong', birth_year: '', birth_month: '', birth_day: '', is_lunar: true, phone: '', phone_land: '', address1: '', sms_consent: false, vow_text: '', is_new_family: true, head_name: '', family_address: '' })
  const [familyRows, setFamilyRows] = useState<any[]>([])
  const [haengRows, setHaengRows] = useState<any[]>([])
  const [younggaRows, setYounggaRows] = useState<any[]>([])
  const [offeringChecks, setOfferingChecks] = useState<Record<string, { checked: boolean; name: string; vow: string }>>({})
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')
  const u = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))
  const inp: React.CSSProperties = { width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}44`, borderRadius: 6, color: '#F5E6C8', fontSize: 13, boxSizing: 'border-box' }
  const sInp: React.CSSProperties = { ...inp, width: 'auto', flex: 1, minWidth: 0 }

  const offerings = config?.offerings || TEMPLE_OFFERINGS.miraesa.offerings
  const bank = config?.bank || TEMPLE_OFFERINGS.miraesa.bank

  const handleSubmit = async () => {
    if (!form.full_name.trim()) { setMsg('이름을 입력하세요'); return }
    setSubmitting(true)

    // 1. 신도 등록
    const res = await fetch('/api/cyber/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ temple_slug: slug, ...form, family: familyRows, haenghyo: haengRows, youngga: younggaRows }) })
    const result = await res.json()
    if (!res.ok) { setMsg(result.error || '등록 실패'); setSubmitting(false); return }

    // 2. 기도접수 연동
    for (const [type, o] of Object.entries(offeringChecks)) {
      if (o.checked && o.name.trim()) {
        await fetch('/api/cyber/members/offerings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ believer_id: result.id, temple_slug: slug, offering_type: type, participant_name: o.name.trim(), vow_text: o.vow.trim() || null }) })
      }
    }

    setMsg(`나무아미타불 🙏 축원번호 ${result.chukwon_no}`)
    setSubmitting(false)
    setTimeout(onSuccess, 1500)
  }

  return (
    <div style={{ padding: '1rem', maxWidth: 500, margin: '0 auto' }}>
      {/* 탭 */}
      <div style={{ display: 'flex', marginBottom: 12 }}>
        {[['front', '앞면 (인적사항)'] as const, ['back', '뒷면 (행효·영가·기도)'] as const].map(([v, l]) => (
          <button key={v} onClick={() => setPage(v)} style={{ flex: 1, padding: 10, background: page === v ? `${A}22` : 'transparent', borderBottom: page === v ? `2px solid ${A}` : '2px solid transparent', border: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none', color: page === v ? A : '#F5E6C8', fontWeight: page === v ? 700 : 400, cursor: 'pointer', fontSize: 13 }}>{l}</button>
        ))}
      </div>

      {page === 'front' ? (<>
        {/* 앞면 */}
        <Sec title="개인 정보" />
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {GENDERS.map(([v, l]) => <button key={v} onClick={() => u('gender_type', v)} style={{ flex: 1, padding: 8, background: form.gender_type === v ? `${A}33` : 'transparent', border: `1px solid ${form.gender_type === v ? A : `${A}44`}`, borderRadius: 6, color: form.gender_type === v ? A : '#F5E6C8', cursor: 'pointer', fontSize: 13 }}>{l}</button>)}
        </div>
        <F label="성명 *"><input value={form.full_name} onChange={e => u('full_name', e.target.value)} placeholder="홍길동" style={inp} /></F>
        <F label="법명"><input value={form.buddhist_name} onChange={e => u('buddhist_name', e.target.value)} placeholder="선택" style={inp} /></F>
        <F label="생년월일">
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <input value={form.birth_year} onChange={e => u('birth_year', e.target.value)} placeholder="년" style={{ ...sInp, maxWidth: 80 }} />
            <input value={form.birth_month} onChange={e => u('birth_month', e.target.value)} placeholder="월" style={{ ...sInp, maxWidth: 60 }} />
            <input value={form.birth_day} onChange={e => u('birth_day', e.target.value)} placeholder="일" style={{ ...sInp, maxWidth: 60 }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer' }}><input type="checkbox" checked={form.is_lunar} onChange={e => u('is_lunar', e.target.checked)} />음력</label>
          </div>
        </F>
        <F label="주소"><input value={form.address1} onChange={e => u('address1', e.target.value)} placeholder="주소" style={inp} /></F>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: `${A}aa`, marginBottom: 3 }}>집전화</div><input value={form.phone_land} onChange={e => u('phone_land', e.target.value)} placeholder="02-000-0000" style={inp} /></div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 11, color: `${A}aa`, marginBottom: 3 }}>핸드폰</div><input value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="010-0000-0000" style={inp} /></div>
        </div>

        {/* 가족 축원 테이블 */}
        <Sec title="가족 축원" />
        {familyRows.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 6, alignItems: 'center' }}>
            <select value={r.relation_type} onChange={e => { const n = [...familyRows]; n[i].relation_type = e.target.value; setFamilyRows(n) }} style={{ ...sInp, maxWidth: 60 }}>{RELS.map(r => <option key={r} value={r}>{r}</option>)}</select>
            <select value={r.gender_type} onChange={e => { const n = [...familyRows]; n[i].gender_type = e.target.value; setFamilyRows(n) }} style={{ ...sInp, maxWidth: 70 }}><option value="gonmyeong">건명</option><option value="gonmyeong_f">곤명</option></select>
            <input value={r.name} onChange={e => { const n = [...familyRows]; n[i].name = e.target.value; setFamilyRows(n) }} placeholder="성명" style={{ ...sInp, maxWidth: 90 }} />
            <input value={r.birth_year} onChange={e => { const n = [...familyRows]; n[i].birth_year = e.target.value; setFamilyRows(n) }} placeholder="년" style={{ ...sInp, maxWidth: 55 }} />
            <button onClick={() => setFamilyRows(familyRows.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
          </div>
        ))}
        <button onClick={() => setFamilyRows([...familyRows, { relation_type: '자', gender_type: 'gonmyeong', name: '', birth_year: '', birth_month: '', birth_day: '', is_lunar: false }])} style={{ width: '100%', padding: 8, background: `${A}11`, border: `1px dashed ${A}44`, borderRadius: 6, color: A, cursor: 'pointer', fontSize: 12, marginBottom: 12 }}>+ 가족 추가</button>

        <F label="발원문"><textarea value={form.vow_text} onChange={e => u('vow_text', e.target.value)} placeholder="나무아미타불..." rows={3} style={{ ...inp, resize: 'vertical', fontFamily: "'Noto Serif KR',serif" }} /></F>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', marginBottom: 12 }}>
          <input type="checkbox" checked={form.sms_consent} onChange={e => u('sms_consent', e.target.checked)} />
          {tName} 법회·기도·행사 SMS/카카오 수신동의
        </label>

        <button onClick={() => setPage('back')} style={{ width: '100%', padding: 12, background: `${A}22`, border: `1px solid ${A}`, borderRadius: 8, color: A, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>뒷면으로 →</button>
      </>) : (<>
        {/* 뒷면 */}
        <Sec title="行孝 (최대 3명)" />
        {haengRows.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: `${A}88`, minWidth: 28 }}>行孝</span>
            <input value={r.name} onChange={e => { const n = [...haengRows]; n[i].name = e.target.value; setHaengRows(n) }} placeholder="성명" style={{ ...sInp, maxWidth: 100 }} />
            <input value={r.birth_year} onChange={e => { const n = [...haengRows]; n[i].birth_year = e.target.value; setHaengRows(n) }} placeholder="년" style={{ ...sInp, maxWidth: 60 }} />
            <select value={r.relation_type} onChange={e => { const n = [...haengRows]; n[i].relation_type = e.target.value; setHaengRows(n) }} style={{ ...sInp, maxWidth: 50 }}><option value="자">자</option><option value="녀">녀</option></select>
            <button onClick={() => setHaengRows(haengRows.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
          </div>
        ))}
        {haengRows.length < 3 && <button onClick={() => setHaengRows([...haengRows, { name: '', birth_year: '', birth_month: '', birth_day: '', is_lunar: false, relation_type: '자' }])} style={{ width: '100%', padding: 7, background: `${A}11`, border: `1px dashed ${A}44`, borderRadius: 6, color: A, cursor: 'pointer', fontSize: 12, marginBottom: 16 }}>+ 행효 추가</button>}

        <Sec title="亡 영가 (최대 10위)" />
        {younggaRows.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#8888bb', minWidth: 20 }}>亡</span>
            <input value={r.name} onChange={e => { const n = [...younggaRows]; n[i].name = e.target.value; setYounggaRows(n) }} placeholder="존함" style={{ ...sInp, maxWidth: 90 }} />
            <input value={r.birth_year} onChange={e => { const n = [...younggaRows]; n[i].birth_year = e.target.value; setYounggaRows(n) }} placeholder="생년" style={{ ...sInp, maxWidth: 55 }} />
            <input value={r.death_year} onChange={e => { const n = [...younggaRows]; n[i].death_year = e.target.value; setYounggaRows(n) }} placeholder="기년" style={{ ...sInp, maxWidth: 55 }} />
            <button onClick={() => setYounggaRows(younggaRows.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
          </div>
        ))}
        {younggaRows.length < 10 && <button onClick={() => setYounggaRows([...younggaRows, { name: '', birth_year: '', death_year: '', relation_type: '', memo: '' }])} style={{ width: '100%', padding: 7, background: 'rgba(100,100,140,0.08)', border: '1px dashed rgba(100,100,140,0.3)', borderRadius: 6, color: '#8888bb', cursor: 'pointer', fontSize: 12, marginBottom: 16 }}>+ 영가 추가</button>}

        {/* 기도접수 */}
        <Sec title="기도접수" />
        {offerings.map((o: any) => {
          const oc = offeringChecks[o.type] || { checked: false, name: '', vow: '' }
          return (
            <div key={o.type} style={{ border: `1px solid ${oc.checked ? A : `${A}22`}`, borderRadius: 8, padding: 10, marginBottom: 8, background: oc.checked ? `${A}08` : 'transparent' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: oc.checked ? 8 : 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
                  <input type="checkbox" checked={oc.checked} onChange={e => setOfferingChecks({ ...offeringChecks, [o.type]: { ...oc, checked: e.target.checked } })} />
                  <span>{o.icon} {o.label}</span>
                </label>
                <span style={{ fontSize: 12, color: A }}>{o.period} {o.price.toLocaleString()}원</span>
              </div>
              {oc.checked && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <input value={oc.name} onChange={e => setOfferingChecks({ ...offeringChecks, [o.type]: { ...oc, name: e.target.value } })} placeholder="성함" style={{ ...sInp, maxWidth: 120 }} />
                  <input value={oc.vow} onChange={e => setOfferingChecks({ ...offeringChecks, [o.type]: { ...oc, vow: e.target.value } })} placeholder="발원내용" style={sInp} />
                </div>
              )}
            </div>
          )
        })}

        {/* 계좌 안내 */}
        <div style={{ marginTop: 12, padding: 12, background: `${A}08`, border: `1px solid ${A}33`, borderRadius: 8 }}>
          <div style={{ fontSize: 12, color: A, fontWeight: 700, marginBottom: 6 }}>입금 계좌</div>
          <div style={{ fontSize: 13 }}>{bank.name} {bank.account}</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>예금주: {bank.holder}</div>
          <button onClick={() => { navigator.clipboard.writeText(bank.account); alert('계좌번호 복사됨') }} style={{ marginTop: 6, padding: '5px 14px', background: `${A}22`, border: `1px solid ${A}`, borderRadius: 6, color: A, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>계좌번호 복사</button>
        </div>

        {msg && <div style={{ textAlign: 'center', padding: 10, color: msg.includes('나무') ? '#22c55e' : '#ef4444', fontWeight: 700, fontSize: 14 }}>{msg}</div>}

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={() => setPage('front')} style={{ flex: 1, padding: 12, background: `${A}22`, border: `1px solid ${A}`, borderRadius: 8, color: A, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>← 앞면</button>
          <button onClick={handleSubmit} disabled={submitting} style={{ flex: 2, padding: 12, background: submitting ? `${A}33` : 'linear-gradient(135deg,#8B6914,#C8961E)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14, letterSpacing: 2 }}>{submitting ? '등록 중...' : '🪷 신도카드 안치'}</button>
        </div>
      </>)}
    </div>
  )
}

function Sec({ title }: { title: string }) { return <div style={{ fontSize: 13, color: A, fontWeight: 700, margin: '14px 0 8px', borderBottom: `1px solid ${A}22`, paddingBottom: 3 }}>{title}</div> }
function F({ label, children }: { label: string; children: React.ReactNode }) { return <div style={{ marginBottom: 8 }}><div style={{ fontSize: 11, color: `${A}aa`, marginBottom: 3 }}>{label}</div>{children}</div> }
