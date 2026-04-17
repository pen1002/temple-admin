'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useCyberTemple } from '@/lib/useCyberTemple'
import { TEMPLE_OFFERINGS } from '@/lib/constants/templeOfferings'
import ConsentCheckbox from '@/components/common/ConsentCheckbox'

const A = '#C9A84C'

export default function MyCardPage() {
  const { slug } = useParams<{ slug: string }>()
  const temple = useCyberTemple(slug)
  const tName = temple?.name || slug
  const config = TEMPLE_OFFERINGS[slug] || Object.values(TEMPLE_OFFERINGS)[0]
  const [nameInput, setNameInput] = useState('')
  const [phoneLast4, setPhoneLast4] = useState('')
  const [multiple, setMultiple] = useState(false)
  const [data, setData] = useState<any>(null)
  const [agreedPrivacy, setAgreedPrivacy] = useState(false)
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!agreedPrivacy || !agreedTerms) { alert('개인정보 처리방침 및 이용약관에 동의해 주세요.'); return }
    if (!nameInput.trim()) return
    const params = new URLSearchParams({ name: nameInput.trim(), temple: slug })
    if (phoneLast4) params.set('phone_last4', phoneLast4)
    const r = await fetch(`/api/cyber/mycard?${params}`)
    const d = await r.json()
    if (d.multiple) { setMultiple(true); setError(''); setData(null) }
    else if (r.ok) { setData(d); setError(''); setMultiple(false) }
    else { setData(null); setError(d.error || '조회 결과 없음') }
  }

  useEffect(() => { if (data?.full_name) { const iv = setInterval(handleSearch, 30000); return () => clearInterval(iv) } }, [data?.full_name])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#0a0205,#120308)', color: '#F5E6C8', fontFamily: "'Noto Serif KR',serif", display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 1rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700;900&display=swap" rel="stylesheet" />
      {!data ? (<>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🏅</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: A, marginBottom: 4 }}>나의 기도동참</div>
        <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 20 }}>{tName}</div>
        <div style={{ fontSize: 12, opacity: 0.4, marginBottom: 12, textAlign: 'center' }}>성함을 입력하시면<br/>기도 접수 현황을 확인하실 수 있습니다.</div>
        <input value={nameInput} onChange={e => setNameInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="성함을 입력하세요" style={{ width: '100%', maxWidth: 280, padding: '12px 14px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}44`, borderRadius: 8, color: '#F5E6C8', fontSize: 16, textAlign: 'center', marginBottom: 8, boxSizing: 'border-box' }} />
        {multiple && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, color: A, marginBottom: 6 }}>동명이인이 있습니다.<br/>연락처 뒷 4자리를 입력해주세요.</div>
            <input value={phoneLast4} onChange={e => setPhoneLast4(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="뒷 4자리" maxLength={4} style={{ width: '100%', maxWidth: 200, padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${A}44`, borderRadius: 8, color: '#F5E6C8', fontSize: 16, textAlign: 'center', letterSpacing: 4 }} />
          </div>
        )}
        <div style={{ marginTop: 12, marginBottom: 8, maxWidth: 280, width: '100%' }}>
          <ConsentCheckbox id="privacy-consent" required checked={agreedPrivacy} onChange={setAgreedPrivacy} label="개인정보 수집·이용에 동의합니다 (필수)" linkHref="/privacy" linkLabel="[전문 보기]" />
          <ConsentCheckbox id="terms-consent" required checked={agreedTerms} onChange={setAgreedTerms} label="이용약관에 동의합니다 (필수)" linkHref="/terms" linkLabel="[전문 보기]" />
        </div>
        <button onClick={handleSearch} style={{ display: 'block', width: '100%', maxWidth: 280, margin: '10px auto 0', padding: 10, background: A, color: '#0a0205', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>🔍 확인하기</button>
        {error && <div style={{ marginTop: 8, color: '#ef4444', fontSize: 13 }}>{error}</div>}
      </>) : (<>
        <div style={{ width: '100%', maxWidth: 400, background: `${A}08`, border: `1px solid ${A}33`, borderRadius: 12, padding: '1.2rem', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: A }}>🏯 {tName}</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{data.full_name} {data.buddhist_name ? `(${data.buddhist_name})` : ''}</div>
          <div style={{ fontSize: 12, color: `${A}88`, marginTop: 2 }}>{data.chukwon_no && `${data.chukwon_no} · `}가족 {data.family_count}인</div>
          <div style={{ marginTop: 16, textAlign: 'left' }}>
            <div style={{ fontSize: 13, color: A, fontWeight: 700, marginBottom: 8 }}>기도 접수 현황</div>
            {config.offerings.map(o => {
              const active = data.offerings.find((of: any) => of.type === o.type && of.status === 'active')
              return <div key={o.type} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${A}11`, fontSize: 13 }}><span>{o.icon} {o.label}</span><span style={{ color: active ? '#22c55e' : `${A}44`, fontWeight: 700 }}>{active ? '✅ 점등중' : '─ 미접수'}</span></div>
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
            {config.offerings.map(o => {
              const paths: Record<string, string> = { yeondeung: 'yeondeung', indung: 'indung', avalokiteshvara: 'avalokiteshvara' }
              return <a key={o.type} href={`/${slug}/cyber/${paths[o.type] || o.type}`} style={{ display: 'block', padding: 8, background: `${A}11`, border: `1px solid ${A}22`, borderRadius: 8, color: A, textAlign: 'center', textDecoration: 'none', fontSize: 13 }}>{o.icon} {o.label} 카드 보러가기 →</a>
            })}
          </div>
        </div>
        <button onClick={() => { setData(null); setNameInput(''); setPhoneLast4(''); setMultiple(false) }} style={{ marginTop: 16, padding: '8px 20px', background: `${A}22`, border: `1px solid ${A}`, borderRadius: 8, color: A, cursor: 'pointer', fontSize: 12 }}>다른 분 조회</button>
      </>)}
      <a href={`/${slug}/dharma-wheel?grid=1`} style={{ marginTop: 20, color: `${A}66`, textDecoration: 'none', fontSize: 12 }}>☸ 도량으로</a>
    </div>
  )
}
