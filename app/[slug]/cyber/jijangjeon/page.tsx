'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

const RELATIONS = ['부', '모', '조부', '조모', '배우자', '자녀', '형제자매', '기타']

export default function JijangjeonPage() {
  const { slug } = useParams<{ slug: string }>()
  const [memorials, setMemorials] = useState<{ id: string; name: string; deceased: string; relationship: string; wish: string }[]>([])
  const [name, setName] = useState('')
  const [deceased, setDeceased] = useState('')
  const [relationship, setRelationship] = useState('부')
  const [wish, setWish] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/cyber/offering?temple_slug=${slug}&type=memorial&limit=50`)
    const data = await res.json()
    if (Array.isArray(data)) setMemorials(data)
  }, [slug])

  useEffect(() => { fetchData() }, [fetchData])

  const handleSubmit = async () => {
    if (!name.trim() || !deceased.trim()) return
    setLoading(true)
    await fetch('/api/cyber/offering', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temple_slug: slug, type: 'memorial', name: name.trim(), deceased: deceased.trim(), relationship, wish: wish.trim(), contact: contact.trim(), amount: 30000 }),
    })
    await fetchData()
    setSubmitted(true)
    setLoading(false)
  }

  const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(155,122,204,0.25)', borderRadius: 8, padding: '10px 14px', color: 'rgba(220,200,255,0.9)', fontSize: 14, outline: 'none', width: '100%' }

  return (
    <div style={{ padding: '20px 20px 60px', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🪷</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#d4b8ff', letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>지장전</h2>
        <p style={{ fontSize: 12, color: 'rgba(155,122,204,0.5)', marginTop: 4 }}>조상 영가의 극락왕생을 발원합니다</p>
      </div>

      {/* 위패 벽 */}
      {memorials.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, color: 'rgba(155,122,204,0.4)', letterSpacing: 2, marginBottom: 10 }}>봉안된 위패 {memorials.length}위</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
            {memorials.map(m => (
              <div key={m.id} style={{ background: 'rgba(139,90,43,0.2)', border: '1px solid rgba(139,90,43,0.3)', borderRadius: 6, padding: '12px 6px', textAlign: 'center', minHeight: 80 }}>
                <div style={{ fontSize: 11, color: 'rgba(240,223,160,0.8)', writingMode: 'vertical-rl', margin: '0 auto', letterSpacing: 2 }}>
                  {m.deceased}
                </div>
                <div style={{ fontSize: 9, color: 'rgba(155,122,204,0.4)', marginTop: 6 }}>{m.relationship}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 위패 봉안 폼 */}
      {!submitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="신청자 성함 *" style={inp} />
          <input value={deceased} onChange={e => setDeceased(e.target.value)} placeholder="영가 존함 *" style={inp} />
          <select value={relationship} onChange={e => setRelationship(e.target.value)} style={{ ...inp, appearance: 'none' }}>
            {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <textarea value={wish} onChange={e => setWish(e.target.value)} placeholder="발원문 (선택)" rows={3} style={{ ...inp, resize: 'none' }} />
          <input value={contact} onChange={e => setContact(e.target.value)} type="tel" placeholder="연락처 (010-0000-0000)" style={inp} />
          <button onClick={handleSubmit} disabled={loading || !name.trim() || !deceased.trim()} style={{ background: loading ? 'rgba(100,80,150,0.3)' : 'rgba(155,122,204,0.25)', border: '1px solid rgba(155,122,204,0.5)', color: 'rgba(220,200,255,0.95)', borderRadius: 8, padding: 14, fontSize: 15, cursor: 'pointer', fontWeight: 500 }}>
            {loading ? '접수 중...' : '위패 봉안 신청'}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🪷</div>
          <p style={{ color: 'rgba(220,200,255,0.95)', fontSize: 16, fontWeight: 500, lineHeight: 1.9 }}>위패가 봉안되었습니다.</p>
          <p style={{ color: 'rgba(155,122,204,0.5)', fontSize: 13, marginTop: 8 }}>조상 영가의 극락왕생을 기원합니다.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}><button onClick={() => { setSubmitted(false); setName(""); setDeceased(""); setWish(""); setContact("") }} style={{ background: "rgba(155,122,204,0.15)", border: "1px solid rgba(155,122,204,0.4)", color: "rgba(220,200,255,0.9)", borderRadius: 8, padding: "10px 24px", cursor: "pointer", fontSize: 13 }}>추가 봉안</button><a href={"/" + slug + "/cyber"} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", color: "#c9a84c", borderRadius: 8, padding: "10px 24px", fontSize: 13, textDecoration: "none" }}>☸ 도량으로 돌아가기</a></div>
        </div>
      )}
    </div>
  )
}
