'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'

const PRAYERS = [
  { id: 'PR-01', name: '인등기도', amount: 10000 },
  { id: 'PR-02', name: '백일기도', amount: 10000 },
  { id: 'PR-03', name: '1년기도', amount: 10000 },
  { id: 'PR-06', name: '49재', amount: 10000 },
  { id: 'PR-07', name: '천도재', amount: 10000 },
  { id: 'PR-08', name: '정초기도', amount: 10000 },
  { id: 'PR-09', name: '산신기도', amount: 10000 },
  { id: 'PR-05', name: '수험생 정진기도', amount: 10000 },
]

export default function JongmusoPage() {
  const { slug } = useParams<{ slug: string }>()
  const [selected, setSelected] = useState<typeof PRAYERS[0] | null>(null)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [wish, setWish] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !selected) return
    setLoading(true)
    await fetch('/api/cyber/offering', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temple_slug: slug, type: 'prayer', name: name.trim(), prayer_kind: selected.id, wish: wish.trim(), contact: contact.trim(), amount: selected.amount }),
    })
    setSubmitted(true)
    setLoading(false)
  }

  const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(232,160,80,0.25)', borderRadius: 8, padding: '10px 14px', color: 'rgba(255,220,120,0.9)', fontSize: 14, outline: 'none', width: '100%' }

  return (
    <div style={{ padding: '20px 20px 60px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>📿</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#e8a050', letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>종무소</h2>
        <p style={{ fontSize: 12, color: 'rgba(232,160,80,0.5)', marginTop: 4 }}>기도를 접수하고 불사에 동참합니다</p>
      </div>

      {!submitted ? (
        <>
          {/* 기도 종류 선택 */}
          {!selected ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {PRAYERS.map(p => (
                <button key={p.id} onClick={() => setSelected(p)} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(232,160,80,0.15)', borderRadius: 10,
                  padding: '16px 12px', cursor: 'pointer', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 15, color: '#e8a050', fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(232,160,80,0.45)' }}>{p.amount.toLocaleString()}원</div>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <div style={{ background: 'rgba(232,160,80,0.08)', border: '1px solid rgba(232,160,80,0.2)', borderRadius: 10, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, color: '#e8a050', fontWeight: 600 }}>{selected.name}</div>
                  <div style={{ fontSize: 13, color: 'rgba(232,160,80,0.5)', marginTop: 2 }}>{selected.amount.toLocaleString()}원</div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: '1px solid rgba(232,160,80,0.3)', color: 'rgba(232,160,80,0.6)', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 12 }}>변경</button>
              </div>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="신청자 성함 *" style={inp} />
              <input value={contact} onChange={e => setContact(e.target.value)} type="tel" placeholder="연락처 (010-0000-0000)" style={inp} />
              <textarea value={wish} onChange={e => setWish(e.target.value)} placeholder="발원문 (선택)" rows={3} style={{ ...inp, resize: 'none' }} />
              {/* 계좌 안내 */}
              <div style={{ background: 'rgba(232,160,80,0.05)', border: '1px solid rgba(232,160,80,0.14)', borderRadius: 8, padding: '13px 15px', fontSize: 13, color: 'rgba(232,160,80,0.75)', lineHeight: 2.2 }}>
                시티은행 261-0359-626501 배연암
                <button onClick={() => { navigator.clipboard.writeText('261-0359-626501'); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                  style={{ marginLeft: 8, background: 'rgba(232,160,80,0.15)', border: '1px solid rgba(232,160,80,0.35)', color: 'rgba(255,210,80,0.9)', borderRadius: 4, padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}>
                  {copied ? '복사됨' : '복사'}
                </button><br />
                <span style={{ fontSize: 11, color: 'rgba(232,160,80,0.38)' }}>입금자명을 신청자 성함과 동일하게 입금해 주세요.</span>
              </div>
              <button onClick={handleSubmit} disabled={loading || !name.trim()} style={{ background: loading ? 'rgba(180,120,40,0.3)' : 'rgba(232,160,80,0.25)', border: '1px solid rgba(232,160,80,0.55)', color: 'rgba(255,220,120,0.95)', borderRadius: 8, padding: 14, fontSize: 15, cursor: 'pointer', fontWeight: 500 }}>
                {loading ? '접수 중...' : `${selected.name} 접수하기`}
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>📿</div>
          <p style={{ color: 'rgba(255,220,120,0.95)', fontSize: 16, fontWeight: 500, lineHeight: 1.9 }}>기도 접수가 완료되었습니다.</p>
          <p style={{ color: 'rgba(232,160,80,0.5)', fontSize: 13, marginTop: 8, lineHeight: 1.8 }}>입금 확인 후 기도가 시작됩니다.</p>
          <button onClick={() => { setSubmitted(false); setSelected(null); setName(''); setWish(''); setContact('') }} style={{ marginTop: 20, background: 'rgba(232,160,80,0.15)', border: '1px solid rgba(232,160,80,0.4)', color: 'rgba(255,220,120,0.9)', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 13 }}>추가 접수</button>
        </div>
      )}
    </div>
  )
}
