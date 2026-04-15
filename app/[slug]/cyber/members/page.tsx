'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useCyberTemple } from '@/lib/useCyberTemple'

const ACCENT = '#C9A84C'
const RELATION_MAP: Record<string, string> = {
  self: '본인(세주)', father: '부(父)', mother: '모(母)',
  child: '자녀', grandchild: '손자녀', relative: '친인척',
}
const RELATIONS = Object.entries(RELATION_MAP)

interface Family { id: string; family_code: string; head_name: string; address?: string; sms_consent: boolean; memo?: string }
interface Believer {
  id: string; full_name: string; buddhist_name?: string; gender?: string
  birth_date?: string; is_lunar?: boolean; phone?: string; address?: string
  relation_type: string; sms_consent: boolean; initiation_date?: string
  memo?: string; status: string; offering_total: number; family?: Family
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

  const fetchBelievers = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/cyber/members?temple_slug=${slug}&q=${encodeURIComponent(search)}`)
    const data = await res.json()
    setBelievers(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [slug, search])

  useEffect(() => { fetchBelievers() }, [fetchBelievers])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#0a0205 0%,#120308 100%)', color: '#F5E6C8', fontFamily: "'Noto Serif KR',serif", paddingBottom: '4rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />

      {/* 헤더 */}
      <div style={{ background: 'linear-gradient(90deg,#1a0408,#2d0a10)', borderBottom: `2px solid ${ACCENT}`, padding: '1.2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: ACCENT, letterSpacing: '0.15em' }}>{tName} 온라인도량</div>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>신도대장</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setView(view === 'list' ? 'register' : 'list')} style={{ background: view === 'register' ? 'rgba(201,168,76,0.15)' : ACCENT, color: view === 'register' ? ACCENT : '#0a0205', border: `1px solid ${ACCENT}`, borderRadius: 8, padding: '0.5rem 1rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
            {view === 'register' ? '← 목록' : '+ 신도 등록'}
          </button>
          <a href={`/${slug}/dharma-wheel?grid=1`} style={{ display: 'flex', alignItems: 'center', background: 'rgba(201,168,76,0.12)', border: `1px solid rgba(201,168,76,0.3)`, color: ACCENT, borderRadius: 8, padding: '0.5rem 0.8rem', textDecoration: 'none', fontSize: '0.85rem' }}>☸</a>
        </div>
      </div>

      {view === 'list' ? (
        <div style={{ padding: '1.2rem 1rem', maxWidth: 600, margin: '0 auto' }}>
          {/* 검색 */}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="이름 · 법명 · 연락처 검색..." style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, color: '#F5E6C8', fontSize: '0.95rem', marginBottom: '1rem', boxSizing: 'border-box' }} />

          {/* 통계 */}
          <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', fontSize: '0.8rem', color: 'rgba(201,168,76,0.6)' }}>
            <span>전체 {believers.length}명</span>
            <span>·</span>
            <span>활동 {believers.filter(b => b.status === '활동').length}명</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: ACCENT }}>불러오는 중...</div>
          ) : believers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>등록된 신도가 없습니다</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {believers.map(b => (
                <div key={b.id} onClick={() => setSelected(selected === b.id ? null : b.id)} style={{ background: selected === b.id ? 'linear-gradient(135deg,#1a0408,#2d1008)' : 'rgba(255,255,255,0.04)', border: `1px solid ${selected === b.id ? ACCENT : 'rgba(201,168,76,0.2)'}`, borderRadius: 12, padding: '1rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {/* 상단 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{b.full_name}</span>
                      {b.buddhist_name && <span style={{ color: ACCENT, fontSize: '0.85rem', marginLeft: '0.5rem' }}>({b.buddhist_name})</span>}
                      <div style={{ fontSize: '0.78rem', opacity: 0.6, marginTop: 2 }}>
                        {RELATION_MAP[b.relation_type] || b.relation_type}
                        {b.gender && ` · ${b.gender}`}
                        {b.status !== '활동' && <span style={{ color: '#ef4444', marginLeft: 6 }}>[{b.status}]</span>}
                      </div>
                    </div>
                    {b.family?.family_code && <span style={{ fontSize: '0.7rem', color: ACCENT, border: `1px solid ${ACCENT}`, borderRadius: 4, padding: '2px 6px' }}>{b.family.family_code}</span>}
                  </div>

                  {/* 상세 펼침 */}
                  {selected === b.id && (
                    <div style={{ marginTop: '0.8rem', borderTop: '1px solid rgba(201,168,76,0.2)', paddingTop: '0.8rem' }}>
                      {b.birth_date && <InfoRow label="생년월일" value={`${new Date(b.birth_date).toLocaleDateString('ko-KR')}${b.is_lunar ? ' (음력)' : ''}`} />}
                      {b.phone && <InfoRow label="연락처" value={b.phone} />}
                      {b.address && <InfoRow label="주소" value={b.address} />}
                      {b.initiation_date && <InfoRow label="수계일" value={new Date(b.initiation_date).toLocaleDateString('ko-KR')} />}
                      <InfoRow label="누적공양" value={`${b.offering_total.toLocaleString()}원`} />
                      {b.memo && <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', opacity: 0.7, background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '0.5rem' }}>{b.memo}</div>}

                      {/* 연락 버튼 */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                        {b.phone && <>
                          <a href={`tel:${b.phone}`} style={{ flex: 1, textAlign: 'center', padding: '0.45rem', background: `${ACCENT}22`, border: `1px solid ${ACCENT}`, borderRadius: 8, color: ACCENT, fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>📞 전화</a>
                          <a href={`sms:${b.phone}`} style={{ flex: 1, textAlign: 'center', padding: '0.45rem', background: `${ACCENT}22`, border: `1px solid ${ACCENT}`, borderRadius: 8, color: ACCENT, fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>💬 문자</a>
                        </>}
                        <button onClick={async (e) => { e.stopPropagation(); if (!confirm(`${b.full_name} 신도를 탈퇴 처리하시겠습니까?`)) return; await fetch('/api/cyber/members', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: b.id }) }); fetchBelievers() }} style={{ flex: 1, textAlign: 'center', padding: '0.45rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>탈퇴</button>
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
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', marginBottom: 4 }}><span style={{ opacity: 0.5, minWidth: 60 }}>{label}</span><span>{value}</span></div>
}

function RegisterSection({ slug, tName, onSuccess }: { slug: string; tName: string; onSuccess: () => void }) {
  const [isNewFamily, setIsNewFamily] = useState(true)
  const [form, setForm] = useState({ full_name: '', buddhist_name: '', gender: '', birth_date: '', is_lunar: true, phone: '', address: '', relation_type: 'self', sms_consent: false, head_name: '', family_address: '', initiation_date: '', vow_text: '', memo: '' })
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')
  const u = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const inp = { width: '100%' as const, padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 8, color: '#F5E6C8', fontSize: '0.9rem', boxSizing: 'border-box' as const }

  const handleSubmit = async () => {
    if (!form.full_name.trim()) { setMsg('이름을 입력하세요'); return }
    setSubmitting(true)
    const res = await fetch('/api/cyber/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ temple_slug: slug, is_new_family: isNewFamily, ...form }) })
    setSubmitting(false)
    if (res.ok) { setMsg('나무아미타불 🙏 등록 완료'); setTimeout(onSuccess, 1200) }
    else { const d = await res.json(); setMsg(d.error || '등록 실패') }
  }

  return (
    <div style={{ padding: '1.2rem 1rem', maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ color: ACCENT, fontSize: '1.1rem', marginBottom: '1.2rem' }}>🪷 신도카드 등록 — {tName}</h2>

      {/* 가족 구분 */}
      <SectionTitle title="가족 구분" />
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {[{ v: true, l: '신규 가족 등록' }, { v: false, l: '기존 가족에 추가' }].map(o => (
          <button key={String(o.v)} onClick={() => setIsNewFamily(o.v)} style={{ flex: 1, padding: '0.6rem', background: isNewFamily === o.v ? `${ACCENT}33` : 'transparent', border: `1px solid ${isNewFamily === o.v ? ACCENT : 'rgba(201,168,76,0.3)'}`, borderRadius: 8, color: isNewFamily === o.v ? ACCENT : '#F5E6C8', cursor: 'pointer', fontWeight: isNewFamily === o.v ? 700 : 400 }}>{o.l}</button>
        ))}
      </div>

      {isNewFamily && <>
        <Field label="세대주명"><input value={form.head_name} onChange={e => u('head_name', e.target.value)} placeholder="세대주 이름 (비우면 본인)" style={inp} /></Field>
        <Field label="가족 주소"><input value={form.family_address} onChange={e => u('family_address', e.target.value)} placeholder="주소" style={inp} /></Field>
      </>}

      {/* 개인 정보 */}
      <SectionTitle title="개인 정보" />
      <Field label="이름 *"><input value={form.full_name} onChange={e => u('full_name', e.target.value)} placeholder="홍길동" style={inp} /></Field>
      <Field label="법명"><input value={form.buddhist_name} onChange={e => u('buddhist_name', e.target.value)} placeholder="법명 (선택)" style={inp} /></Field>
      <Field label="성별">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[['여', '보살(여)'], ['남', '거사(남)']].map(([v, l]) => (
            <button key={v} onClick={() => u('gender', v)} style={{ flex: 1, padding: '0.5rem', background: form.gender === v ? `${ACCENT}33` : 'transparent', border: `1px solid ${form.gender === v ? ACCENT : 'rgba(201,168,76,0.3)'}`, borderRadius: 8, color: form.gender === v ? ACCENT : '#F5E6C8', cursor: 'pointer' }}>{l}</button>
          ))}
        </div>
      </Field>
      <Field label="생년월일">
        <input type="date" value={form.birth_date} onChange={e => u('birth_date', e.target.value)} style={inp} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.85rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.is_lunar} onChange={e => u('is_lunar', e.target.checked)} /> 음력
        </label>
      </Field>
      <Field label="연락처"><input type="tel" value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="010-0000-0000" style={inp} /></Field>
      <Field label="주소"><input value={form.address} onChange={e => u('address', e.target.value)} placeholder="주소" style={inp} /></Field>
      <Field label="가족 내 관계">
        <select value={form.relation_type} onChange={e => u('relation_type', e.target.value)} style={{ ...inp, appearance: 'none' as const }}>
          {RELATIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </Field>

      {/* 수계 + 발원 */}
      <SectionTitle title="수계 · 발원" />
      <Field label="수계일"><input type="date" value={form.initiation_date} onChange={e => u('initiation_date', e.target.value)} style={inp} /></Field>
      <Field label="발원문">
        <textarea value={form.vow_text} onChange={e => u('vow_text', e.target.value)} placeholder="나무아미타불... 원하옵건대..." rows={3} style={{ ...inp, resize: 'vertical' as const, fontFamily: "'Noto Serif KR',serif" }} />
      </Field>
      <Field label="비고"><input value={form.memo} onChange={e => u('memo', e.target.value)} placeholder="특이사항, 기도 성취 이력 등" style={inp} /></Field>

      {/* SMS 동의 */}
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', margin: '1rem 0', fontSize: '0.83rem', cursor: 'pointer', padding: '0.8rem', background: 'rgba(201,168,76,0.06)', borderRadius: 8, border: '1px solid rgba(201,168,76,0.2)' }}>
        <input type="checkbox" checked={form.sms_consent} onChange={e => u('sms_consent', e.target.checked)} style={{ marginTop: 2 }} />
        <span>{tName}의 법회·기도·행사 안내를 SMS/카카오로 받겠습니다. (정보통신망법 제50조에 따른 수신 동의)</span>
      </label>

      {msg && <div style={{ textAlign: 'center', padding: '0.8rem', color: msg.includes('완료') ? '#22c55e' : '#ef4444', fontSize: '0.9rem', fontWeight: 700 }}>{msg}</div>}

      <button onClick={handleSubmit} disabled={submitting} style={{ width: '100%', padding: '0.9rem', background: submitting ? 'rgba(201,168,76,0.15)' : `linear-gradient(135deg,#8B6914,#C8961E)`, color: '#fff', border: 'none', borderRadius: 10, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', letterSpacing: 2, fontFamily: "'Noto Serif KR',serif" }}>
        {submitting ? '등록 중...' : '🪷 신도 등록'}
      </button>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return <div style={{ fontSize: '0.85rem', color: ACCENT, fontWeight: 700, margin: '1.2rem 0 0.6rem', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: 4 }}>{title}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: '0.8rem' }}><div style={{ fontSize: '0.8rem', color: 'rgba(201,168,76,0.7)', marginBottom: 4 }}>{label}</div>{children}</div>
}
