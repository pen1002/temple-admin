'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useCyberTemple } from '@/lib/useCyberTemple'

const ACCENT = '#C9A84C'
const RELATION_MAP: Record<string, string> = {
  self: '본인(세주)', father: '부(父)', mother: '모(母)',
  child: '자녀', grandchild: '손자녀', relative: '친인척',
}
const RELATION_ICONS: Record<string, string> = {
  self: '👤', father: '👨', mother: '👩', child: '👶', grandchild: '👧', relative: '🧑',
}
const RELATIONS = Object.entries(RELATION_MAP)
const ANCESTOR_TYPES = ['일반위패', '천도위패', '49재위패', '기타']

interface Family { id: string; family_code: string; head_name: string; address?: string; sms_consent: boolean }
interface FamilyMember { id: string; full_name: string; relation_type: string; gender?: string; is_deceased: boolean; status: string }
interface Believer {
  id: string; full_name: string; buddhist_name?: string; gender?: string
  birth_date?: string; is_lunar?: boolean; phone?: string; address?: string
  relation_type: string; sms_consent: boolean; initiation_date?: string
  memo?: string; status: string; offering_total: number; family?: Family
  is_deceased: boolean; death_date?: string; ancestor_type?: string
  families_id?: string
}

export default function MembersPage() {
  const { slug } = useParams<{ slug: string }>()
  const temple = useCyberTemple(slug)
  const tName = temple?.name || slug

  const [believers, setBelievers] = useState<Believer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'list' | 'register'>('list')
  const [selected, setSelected] = useState<string | null>(null)
  const [familyTree, setFamilyTree] = useState<FamilyMember[]>([])
  const [stickyPhone, setStickyPhone] = useState<string | null>(null)

  const fetchBelievers = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/cyber/members?temple_slug=${slug}&q=${encodeURIComponent(search)}`)
    const data = await res.json()
    setBelievers(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [slug, search])

  useEffect(() => { fetchBelievers() }, [fetchBelievers])

  // 카드 선택 시 가족 트리 로드
  const selectCard = async (b: Believer) => {
    if (selected === b.id) { setSelected(null); setFamilyTree([]); setStickyPhone(null); return }
    setSelected(b.id)
    setStickyPhone(b.phone || null)
    if (b.families_id) {
      const res = await fetch(`/api/cyber/members?temple_slug=${slug}&family_members=${b.families_id}`)
      const data = await res.json()
      setFamilyTree(Array.isArray(data) ? data : [])
    } else {
      setFamilyTree([])
    }
  }

  const stats = {
    total: believers.length,
    active: believers.filter(b => b.status === '활동').length,
    deceased: believers.filter(b => b.is_deceased).length,
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#0a0205 0%,#120308 100%)', color: '#F5E6C8', fontFamily: "'Noto Serif KR',serif", paddingBottom: stickyPhone ? '5rem' : '2rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />

      {/* 헤더 */}
      <div style={{ background: 'linear-gradient(90deg,#1a0408,#2d0a10)', borderBottom: `2px solid ${ACCENT}`, padding: '1.2rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: ACCENT, letterSpacing: '0.15em' }}>{tName} 온라인도량</div>
          <h1 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>신도대장</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button onClick={() => setView(view === 'list' ? 'register' : 'list')} style={{ background: view === 'register' ? 'rgba(201,168,76,0.15)' : ACCENT, color: view === 'register' ? ACCENT : '#0a0205', border: `1px solid ${ACCENT}`, borderRadius: 8, padding: '0.45rem 0.8rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
            {view === 'register' ? '← 목록' : '+ 등록'}
          </button>
          <a href={`/${slug}/dharma-wheel?grid=1`} style={{ display: 'flex', alignItems: 'center', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: ACCENT, borderRadius: 8, padding: '0.45rem 0.7rem', textDecoration: 'none', fontSize: '0.85rem' }}>☸</a>
        </div>
      </div>

      {view === 'list' ? (
        <div style={{ padding: '1rem', maxWidth: 600, margin: '0 auto' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="이름 · 법명 · 연락처 검색..." style={{ width: '100%', padding: '0.7rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, color: '#F5E6C8', fontSize: '0.9rem', marginBottom: '0.8rem', boxSizing: 'border-box' }} />

          <div style={{ display: 'flex', gap: 10, marginBottom: '1rem', fontSize: '0.78rem' }}>
            <span style={{ color: ACCENT }}>전체 {stats.total}</span>
            <span style={{ color: '#22c55e' }}>활동 {stats.active}</span>
            {stats.deceased > 0 && <span style={{ color: '#9b7acc' }}>영가 {stats.deceased}</span>}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: ACCENT }}>불러오는 중...</div>
          ) : believers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>등록된 신도가 없습니다</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {believers.map(b => (
                <div key={b.id} onClick={() => selectCard(b)} style={{ background: selected === b.id ? 'linear-gradient(135deg,#1a0408,#2d1008)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selected === b.id ? ACCENT : 'rgba(201,168,76,0.15)'}`, borderRadius: 12, padding: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>
                        {b.is_deceased && '🪷 '}{b.full_name}
                      </span>
                      {b.buddhist_name && <span style={{ color: ACCENT, fontSize: '0.82rem', marginLeft: '0.4rem' }}>({b.buddhist_name})</span>}
                      <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: 2 }}>
                        {RELATION_MAP[b.relation_type] || b.relation_type}
                        {b.gender && ` · ${b.gender}`}
                        {b.is_deceased && b.ancestor_type && ` · ${b.ancestor_type}`}
                        {b.status !== '활동' && !b.is_deceased && <span style={{ color: '#ef4444', marginLeft: 4 }}>[{b.status}]</span>}
                      </div>
                    </div>
                    {b.family?.family_code && <span style={{ fontSize: '0.65rem', color: ACCENT, border: `1px solid ${ACCENT}`, borderRadius: 4, padding: '1px 5px' }}>{b.family.family_code}</span>}
                  </div>

                  {/* 카드 펼침 */}
                  {selected === b.id && (
                    <div style={{ marginTop: '0.8rem', borderTop: '1px solid rgba(201,168,76,0.15)', paddingTop: '0.8rem' }}>
                      {/* 가족 트리 시각화 */}
                      {familyTree.length > 1 && (
                        <div style={{ marginBottom: '0.8rem', padding: '0.6rem', background: 'rgba(201,168,76,0.04)', borderRadius: 8, border: '1px solid rgba(201,168,76,0.1)' }}>
                          <div style={{ fontSize: '0.75rem', color: ACCENT, marginBottom: '0.4rem', fontWeight: 700 }}>가족 구성원</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {familyTree.map((m, i) => (
                              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
                                {i > 0 && <span style={{ color: 'rgba(201,168,76,0.3)', marginLeft: 4 }}>└</span>}
                                <span>{RELATION_ICONS[m.relation_type] || '🧑'}</span>
                                <span style={{ color: m.id === b.id ? ACCENT : '#F5E6C8', fontWeight: m.id === b.id ? 700 : 400 }}>{m.full_name}</span>
                                <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>({RELATION_MAP[m.relation_type] || m.relation_type})</span>
                                {m.is_deceased && <span style={{ fontSize: '0.65rem', color: '#9b7acc' }}>영가</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {b.birth_date && <InfoRow label="생년월일" value={`${new Date(b.birth_date).toLocaleDateString('ko-KR')}${b.is_lunar ? ' (음력)' : ''}`} />}
                      {b.phone && <InfoRow label="연락처" value={b.phone} />}
                      {b.address && <InfoRow label="주소" value={b.address} />}
                      {b.initiation_date && <InfoRow label="수계일" value={new Date(b.initiation_date).toLocaleDateString('ko-KR')} />}
                      {b.is_deceased && b.death_date && <InfoRow label="기일" value={new Date(b.death_date).toLocaleDateString('ko-KR')} />}
                      {b.offering_total > 0 && <InfoRow label="누적공양" value={`${b.offering_total.toLocaleString()}원`} />}
                      {b.memo && <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', opacity: 0.7, background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '0.4rem 0.6rem', whiteSpace: 'pre-wrap' }}>{b.memo}</div>}

                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.7rem' }}>
                        <button onClick={async (e) => { e.stopPropagation(); if (!confirm(`${b.full_name} 신도를 탈퇴 처리하시겠습니까?`)) return; await fetch('/api/cyber/members', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: b.id, temple_slug: slug }) }); fetchBelievers() }} style={{ flex: 1, padding: '0.4rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>탈퇴</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <RegisterSection slug={slug} tName={tName} onSuccess={() => { setView('list'); fetchBelievers() }} />
      )}

      {/* Sticky 원터치 사자후 바 */}
      {stickyPhone && selected && view === 'list' && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'linear-gradient(90deg,#1a0408,#2d0a10)', borderTop: `2px solid ${ACCENT}`, padding: '0.7rem 1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', zIndex: 50 }}>
          <a href={`tel:${stickyPhone}`} style={{ flex: 1, maxWidth: 200, textAlign: 'center', padding: '0.6rem', background: `${ACCENT}`, borderRadius: 8, color: '#0a0205', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>📞 전화</a>
          <a href={`sms:${stickyPhone}`} style={{ flex: 1, maxWidth: 200, textAlign: 'center', padding: '0.6rem', background: `${ACCENT}33`, border: `1px solid ${ACCENT}`, borderRadius: 8, color: ACCENT, fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none' }}>💬 문자</a>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.82rem', marginBottom: 3 }}><span style={{ opacity: 0.5, minWidth: 56 }}>{label}</span><span>{value}</span></div>
}

function RegisterSection({ slug, tName, onSuccess }: { slug: string; tName: string; onSuccess: () => void }) {
  const [isNewFamily, setIsNewFamily] = useState(true)
  const [isDeceased, setIsDeceased] = useState(false)
  const [form, setForm] = useState({ full_name: '', buddhist_name: '', gender: '', birth_date: '', is_lunar: true, phone: '', address: '', relation_type: 'self', sms_consent: false, head_name: '', family_address: '', initiation_date: '', vow_text: '', memo: '', death_date: '', ancestor_type: '' })
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')
  const u = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const inp: React.CSSProperties = { width: '100%', padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, color: '#F5E6C8', fontSize: '0.9rem', boxSizing: 'border-box' }

  const handleSubmit = async () => {
    if (!form.full_name.trim()) { setMsg('이름을 입력하세요'); return }
    setSubmitting(true)
    const res = await fetch('/api/cyber/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ temple_slug: slug, is_new_family: isNewFamily, is_deceased: isDeceased, ...form }) })
    setSubmitting(false)
    if (res.ok) { setMsg('나무아미타불 🙏 등록 완료'); setTimeout(onSuccess, 1200) }
    else { const d = await res.json(); setMsg(d.error || '등록 실패') }
  }

  return (
    <div style={{ padding: '1rem', maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ color: ACCENT, fontSize: '1.05rem', marginBottom: '1rem' }}>🪷 신도카드 등록 — {tName}</h2>

      {/* 생자/영가 구분 */}
      <SectionTitle title="구분" />
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {[{ v: false, l: '👤 생자(신도)' }, { v: true, l: '🪷 영가(위패)' }].map(o => (
          <button key={String(o.v)} onClick={() => setIsDeceased(o.v)} style={{ flex: 1, padding: '0.6rem', background: isDeceased === o.v ? `${ACCENT}33` : 'transparent', border: `1px solid ${isDeceased === o.v ? ACCENT : 'rgba(201,168,76,0.3)'}`, borderRadius: 8, color: isDeceased === o.v ? ACCENT : '#F5E6C8', cursor: 'pointer', fontWeight: isDeceased === o.v ? 700 : 400 }}>{o.l}</button>
        ))}
      </div>

      {/* 가족 구분 */}
      <SectionTitle title="가족 구분" />
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {[{ v: true, l: '신규 가족' }, { v: false, l: '기존 가족 추가' }].map(o => (
          <button key={String(o.v)} onClick={() => setIsNewFamily(o.v)} style={{ flex: 1, padding: '0.5rem', background: isNewFamily === o.v ? `${ACCENT}33` : 'transparent', border: `1px solid ${isNewFamily === o.v ? ACCENT : 'rgba(201,168,76,0.3)'}`, borderRadius: 8, color: isNewFamily === o.v ? ACCENT : '#F5E6C8', cursor: 'pointer', fontWeight: isNewFamily === o.v ? 700 : 400, fontSize: '0.85rem' }}>{o.l}</button>
        ))}
      </div>

      {isNewFamily && <>
        <Field label="세대주명"><input value={form.head_name} onChange={e => u('head_name', e.target.value)} placeholder="비우면 본인" style={inp} /></Field>
        <Field label="주소"><input value={form.family_address} onChange={e => u('family_address', e.target.value)} placeholder="주소" style={inp} /></Field>
      </>}

      {/* 인적 사항 */}
      <SectionTitle title={isDeceased ? '영가 정보' : '개인 정보'} />
      <Field label={isDeceased ? '영가 존함 *' : '이름 *'}><input value={form.full_name} onChange={e => u('full_name', e.target.value)} placeholder={isDeceased ? '영가 존함' : '홍길동'} style={inp} /></Field>
      <Field label="법명"><input value={form.buddhist_name} onChange={e => u('buddhist_name', e.target.value)} placeholder="선택" style={inp} /></Field>
      <Field label="성별">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[['여', '보살(여)'], ['남', '거사(남)']].map(([v, l]) => (
            <button key={v} onClick={() => u('gender', v)} style={{ flex: 1, padding: '0.45rem', background: form.gender === v ? `${ACCENT}33` : 'transparent', border: `1px solid ${form.gender === v ? ACCENT : 'rgba(201,168,76,0.3)'}`, borderRadius: 8, color: form.gender === v ? ACCENT : '#F5E6C8', cursor: 'pointer', fontSize: '0.85rem' }}>{l}</button>
          ))}
        </div>
      </Field>

      {isDeceased ? <>
        <Field label="기일"><input type="date" value={form.death_date} onChange={e => u('death_date', e.target.value)} style={inp} /></Field>
        <Field label="위패 종류">
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {ANCESTOR_TYPES.map(t => (
              <button key={t} onClick={() => u('ancestor_type', t)} style={{ padding: '0.4rem 0.7rem', background: form.ancestor_type === t ? `${ACCENT}33` : 'transparent', border: `1px solid ${form.ancestor_type === t ? ACCENT : 'rgba(201,168,76,0.3)'}`, borderRadius: 6, color: form.ancestor_type === t ? ACCENT : '#F5E6C8', cursor: 'pointer', fontSize: '0.8rem' }}>{t}</button>
            ))}
          </div>
        </Field>
      </> : <>
        <Field label="생년월일">
          <input type="date" value={form.birth_date} onChange={e => u('birth_date', e.target.value)} style={inp} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem', fontSize: '0.82rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_lunar} onChange={e => u('is_lunar', e.target.checked)} /> 음력
          </label>
        </Field>
        <Field label="연락처"><input type="tel" value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="010-0000-0000" style={inp} /></Field>
        <Field label="수계일"><input type="date" value={form.initiation_date} onChange={e => u('initiation_date', e.target.value)} style={inp} /></Field>
      </>}

      <Field label="관계">
        <select value={form.relation_type} onChange={e => u('relation_type', e.target.value)} style={{ ...inp, appearance: 'none' as const }}>
          {RELATIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </Field>

      <SectionTitle title="발원 · 비고" />
      <Field label="발원문"><textarea value={form.vow_text} onChange={e => u('vow_text', e.target.value)} placeholder="나무아미타불..." rows={3} style={{ ...inp, resize: 'vertical' as const, fontFamily: "'Noto Serif KR',serif" }} /></Field>
      <Field label="비고"><input value={form.memo} onChange={e => u('memo', e.target.value)} placeholder="특이사항" style={inp} /></Field>

      {!isDeceased && (
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', margin: '0.8rem 0', fontSize: '0.8rem', cursor: 'pointer', padding: '0.7rem', background: 'rgba(201,168,76,0.06)', borderRadius: 8, border: '1px solid rgba(201,168,76,0.2)' }}>
          <input type="checkbox" checked={form.sms_consent} onChange={e => u('sms_consent', e.target.checked)} style={{ marginTop: 2 }} />
          <span>{tName}의 법회·기도·행사 안내를 SMS/카카오로 받겠습니다.</span>
        </label>
      )}

      {msg && <div style={{ textAlign: 'center', padding: '0.6rem', color: msg.includes('완료') ? '#22c55e' : '#ef4444', fontSize: '0.85rem', fontWeight: 700 }}>{msg}</div>}

      <button onClick={handleSubmit} disabled={submitting} style={{ width: '100%', padding: '0.85rem', background: submitting ? 'rgba(201,168,76,0.15)' : 'linear-gradient(135deg,#8B6914,#C8961E)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', letterSpacing: 2, fontFamily: "'Noto Serif KR',serif" }}>
        {submitting ? '등록 중...' : isDeceased ? '🪷 영가 봉안' : '🪷 신도 등록'}
      </button>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return <div style={{ fontSize: '0.82rem', color: ACCENT, fontWeight: 700, margin: '1rem 0 0.5rem', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: 3 }}>{title}</div>
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: '0.7rem' }}><div style={{ fontSize: '0.78rem', color: 'rgba(201,168,76,0.7)', marginBottom: 3 }}>{label}</div>{children}</div>
}
