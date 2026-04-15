'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useCyberTemple } from '@/lib/useCyberTemple'
import { TEMPLE_OFFERINGS } from '@/lib/constants/templeOfferings'

const A = '#C9A84C'

export default function OfferingsPage() {
  const { slug } = useParams<{ slug: string }>()
  const temple = useCyberTemple(slug)
  const tName = temple?.name || slug
  const config = TEMPLE_OFFERINGS[slug] || TEMPLE_OFFERINGS.miraesa
  const [list, setList] = useState<any[]>([])
  const [view, setView] = useState<'list' | 'form'>('list')
  const [selType, setSelType] = useState('')
  const [tab, setTab] = useState<'direct' | 'linked'>('direct')
  const [name, setName] = useState('')
  const [vow, setVow] = useState('')
  const [searchQ, setSearchQ] = useState('')
  const [searchR, setSearchR] = useState<any[]>([])
  const [believerId, setBelieverId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  const fetchList = useCallback(async () => {
    const r = await fetch(`/api/cyber/members?temple_slug=${slug}&limit=200`)
    const d = await r.json()
    const allOfferings: any[] = []
    if (Array.isArray(d)) d.forEach((b: any) => b.believerOfferings?.forEach((o: any) => allOfferings.push({ ...o, believer_name: b.full_name })))
    setList(allOfferings)
  }, [slug])
  useEffect(() => { fetchList() }, [fetchList])

  const stats = config.offerings.map(o => {
    const items = list.filter(l => l.offering_type === o.type && l.status === 'active')
    return { ...o, count: items.length, total: items.length * o.price }
  })

  const searchBelievers = async (q: string) => {
    setSearchQ(q)
    if (!q.trim()) { setSearchR([]); return }
    const r = await fetch(`/api/cyber/members?temple_slug=${slug}&q=${encodeURIComponent(q)}&limit=10`)
    const d = await r.json()
    setSearchR(Array.isArray(d) ? d : [])
  }

  const handleSubmit = async () => {
    if (!selType || !name.trim()) { setMsg('유형과 성함을 입력하세요'); return }
    setSubmitting(true)
    const res = await fetch('/api/cyber/members/offerings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ temple_slug: slug, offering_type: selType, participant_name: name.trim(), vow_text: vow.trim() || null, believer_id: believerId }) })
    setSubmitting(false)
    if (res.ok) { setMsg('나무아미타불 🙏 접수 완료'); setName(''); setVow(''); setSelType(''); setBelieverId(null); setTimeout(() => { setView('list'); fetchList(); setMsg('') }, 1200) }
    else { const d = await res.json(); setMsg(d.error || '접수 실패') }
  }

  const cancelOffering = async (id: string) => {
    if (!confirm('기도접수를 취소하시겠습니까?')) return
    await fetch('/api/cyber/members/offerings', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    fetchList()
  }

  const inp: React.CSSProperties = { width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}44`, borderRadius: 6, color: '#F5E6C8', fontSize: 13, boxSizing: 'border-box' }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#0a0205,#120308)', color: '#F5E6C8', fontFamily: "'Noto Serif KR',serif", padding: '0 0 3rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />
      <div style={{ background: 'linear-gradient(90deg,#1a0408,#2d0a10)', borderBottom: `2px solid ${A}`, padding: '1rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div style={{ fontSize: 11, color: A, letterSpacing: '0.15em' }}>{tName}</div><h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>🙏 기도접수</h1></div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setView(view === 'form' ? 'list' : 'form')} style={{ background: view === 'form' ? `${A}22` : A, color: view === 'form' ? A : '#0a0205', border: `1px solid ${A}`, borderRadius: 8, padding: '6px 12px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>{view === 'form' ? '← 현황' : '+ 접수'}</button>
          <a href={`/${slug}/dharma-wheel?grid=1`} style={{ display: 'flex', alignItems: 'center', background: `${A}22`, border: `1px solid ${A}44`, color: A, borderRadius: 8, padding: '6px 10px', textDecoration: 'none' }}>☸</a>
        </div>
      </div>

      <div style={{ padding: '1rem', maxWidth: 520, margin: '0 auto' }}>
        {/* 통계 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {stats.map(s => (
            <div key={s.type} style={{ flex: 1, padding: 10, background: `${A}08`, border: `1px solid ${A}22`, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: A }}>{s.count}건</div>
              <div style={{ fontSize: 10, opacity: 0.5 }}>{s.total.toLocaleString()}원</div>
              <div style={{ fontSize: 10, opacity: 0.4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {view === 'list' ? (
          <div>
            {list.filter(l => l.status === 'active').length === 0 ? <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.4 }}>접수 내역이 없습니다</div> :
            list.filter(l => l.status === 'active').map((o: any) => (
              <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${A}11`, fontSize: 13 }}>
                <div>
                  <span style={{ marginRight: 6 }}>{config.offerings.find(c => c.type === o.offering_type)?.icon || '🙏'}</span>
                  <span style={{ fontWeight: 600 }}>{o.participant_name}</span>
                  <span style={{ fontSize: 11, opacity: 0.5, marginLeft: 6 }}>{config.offerings.find(c => c.type === o.offering_type)?.label}</span>
                  {o.vow_text && <div style={{ fontSize: 11, opacity: 0.4, marginTop: 2 }}>{o.vow_text.slice(0, 30)}</div>}
                </div>
                <button onClick={() => cancelOffering(o.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 4, color: '#ef4444', fontSize: 10, padding: '3px 8px', cursor: 'pointer' }}>취소</button>
              </div>
            ))}
          </div>
        ) : (<>
          {/* 기도 유형 선택 */}
          <div style={{ fontSize: 13, color: A, fontWeight: 700, marginBottom: 8 }}>기도 유형</div>
          {config.offerings.map(o => (
            <button key={o.type} onClick={() => setSelType(o.type)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', marginBottom: 6, background: selType === o.type ? `${A}22` : 'rgba(255,255,255,0.03)', border: `1px solid ${selType === o.type ? A : `${A}22`}`, borderRadius: 8, color: '#F5E6C8', cursor: 'pointer', textAlign: 'left' }}>
              <span>{o.icon} {o.label}</span>
              <span style={{ color: A, fontSize: 12 }}>{o.period} {o.price.toLocaleString()}원</span>
            </button>
          ))}

          {/* 신도 연결 */}
          <div style={{ display: 'flex', gap: 6, margin: '12px 0 8px' }}>
            {[['direct', '직접 입력'] as const, ['linked', '신도카드 연동'] as const].map(([v, l]) => (
              <button key={v} onClick={() => { setTab(v); setBelieverId(null) }} style={{ flex: 1, padding: 7, background: tab === v ? `${A}22` : 'transparent', border: `1px solid ${tab === v ? A : `${A}44`}`, borderRadius: 6, color: tab === v ? A : '#F5E6C8', cursor: 'pointer', fontSize: 12 }}>{l}</button>
            ))}
          </div>

          {tab === 'direct' ? (
            <div style={{ marginBottom: 8 }}><input value={name} onChange={e => setName(e.target.value)} placeholder="성함" style={inp} /></div>
          ) : (
            <div style={{ marginBottom: 8 }}>
              <input value={searchQ} onChange={e => searchBelievers(e.target.value)} placeholder="신도 검색..." style={{ ...inp, marginBottom: 4 }} />
              {searchR.map((b: any) => (
                <button key={b.id} onClick={() => { setName(b.full_name); setBelieverId(b.id); setSearchR([]) }} style={{ display: 'block', width: '100%', padding: 6, background: `${A}08`, border: `1px solid ${A}22`, borderRadius: 4, color: '#F5E6C8', cursor: 'pointer', textAlign: 'left', fontSize: 12, marginBottom: 2 }}>{b.full_name} {b.buddhist_name && `(${b.buddhist_name})`}</button>
              ))}
              {name && <div style={{ fontSize: 12, color: A, marginTop: 4 }}>선택: {name}</div>}
            </div>
          )}

          <div style={{ marginBottom: 8 }}><textarea value={vow} onChange={e => setVow(e.target.value)} placeholder="발원내용 (선택)" rows={2} style={{ ...inp, resize: 'vertical', fontFamily: "'Noto Serif KR',serif" }} /></div>

          {/* 계좌 */}
          <div style={{ padding: 10, background: `${A}08`, border: `1px solid ${A}33`, borderRadius: 8, marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: A, fontWeight: 700, marginBottom: 4 }}>입금 계좌</div>
            <div style={{ fontSize: 13 }}>{config.bank.name} {config.bank.account}</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>예금주: {config.bank.holder}</div>
            <button onClick={() => { navigator.clipboard.writeText(config.bank.account); alert('복사됨') }} style={{ marginTop: 4, padding: '4px 12px', background: `${A}22`, border: `1px solid ${A}`, borderRadius: 6, color: A, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>계좌번호 복사</button>
          </div>

          {selType && <div style={{ textAlign: 'center', fontSize: 14, color: A, fontWeight: 700, marginBottom: 8 }}>{config.offerings.find(o => o.type === selType)?.price.toLocaleString()}원</div>}

          {msg && <div style={{ textAlign: 'center', padding: 8, color: msg.includes('나무') ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{msg}</div>}

          <button onClick={handleSubmit} disabled={submitting || !selType || !name.trim()} style={{ width: '100%', padding: 12, background: submitting ? `${A}33` : 'linear-gradient(135deg,#8B6914,#C8961E)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14, letterSpacing: 2 }}>{submitting ? '접수 중...' : '🙏 기도 접수 완료'}</button>
        </>)}
      </div>
    </div>
  )
}
