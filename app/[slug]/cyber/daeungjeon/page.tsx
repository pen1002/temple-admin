'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

export default function DaeungjeonPage() {
  const { slug } = useParams<{ slug: string }>()
  const [bowCount, setBowCount] = useState(0)
  const [bowing, setBowing] = useState(false)
  const [recent, setRecent] = useState<{ name: string; created_at: string }[]>([])
  const [name, setName] = useState('')

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/cyber/offering?temple_slug=${slug}&type=bow&limit=10`)
    const data = await res.json()
    if (Array.isArray(data)) {
      setBowCount(data.length)
      setRecent(data.slice(0, 10))
    }
  }, [slug])

  useEffect(() => { fetchData() }, [fetchData])

  const handleBow = async () => {
    if (bowing) return
    setBowing(true)
    const bowName = name.trim() || '익명 불자'
    await fetch('/api/cyber/offering', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temple_slug: slug, type: 'bow', name: bowName }),
    })
    await fetchData()
    setTimeout(() => setBowing(false), 1500)
  }

  return (
    <div style={{ textAlign: 'center', padding: 'clamp(16px,4vw,20px) 16px 60px', maxWidth: 600, margin: '0 auto' }}>
      {/* 불상 */}
      <div style={{ position: 'relative', margin: '20px auto 30px', width: 200, height: 260 }}>
        {/* 후광 */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 220, height: 220, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0) 70%)',
          animation: bowing ? 'none' : undefined,
        }} />
        {/* 부처님 */}
        <div style={{
          fontSize: 120, lineHeight: 1, position: 'relative', zIndex: 1,
          transition: 'transform 0.6s ease-in-out',
          transform: bowing ? 'scale(1.08)' : 'scale(1)',
          filter: bowing ? 'brightness(1.3) drop-shadow(0 0 30px rgba(201,168,76,0.5))' : 'drop-shadow(0 0 12px rgba(201,168,76,0.2))',
          paddingTop: 40,
        }}>
          🙏
        </div>
        {/* 연꽃 대좌 */}
        <div style={{ fontSize: 40, marginTop: -10, position: 'relative', zIndex: 1 }}>🪷</div>
        {/* 좌우 촛불 */}
        <div style={{ position: 'absolute', left: -30, bottom: 20, fontSize: 28, filter: 'drop-shadow(0 0 8px rgba(255,200,50,0.4))' }}>🕯</div>
        <div style={{ position: 'absolute', right: -30, bottom: 20, fontSize: 28, filter: 'drop-shadow(0 0 8px rgba(255,200,50,0.4))' }}>🕯</div>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 600, color: '#fff', letterSpacing: 3, marginBottom: 6, fontFamily: '"Noto Serif KR",serif' }}>
        대웅전
      </h2>
      <p style={{ fontSize: 12, color: 'rgba(201,168,76,0.5)', marginBottom: 20 }}>
        누적 참배 {bowCount.toLocaleString()}회
      </p>

      {/* 이름 입력 */}
      <input
        value={name} onChange={e => setName(e.target.value)}
        placeholder="성함 (선택)"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '10px 14px', color: 'rgba(255,220,120,0.9)', fontSize: 14, outline: 'none', width: '100%', maxWidth: 320, marginBottom: 16, textAlign: 'center', boxSizing: 'border-box' }}
      />

      {/* 참배 버튼 */}
      <div>
        <button onClick={handleBow} disabled={bowing} style={{
          padding: 'clamp(14px,3vw,16px) clamp(32px,8vw,48px)', fontSize: 'clamp(16px,4vw,18px)', fontWeight: 700, borderRadius: 12, cursor: bowing ? 'default' : 'pointer', width: '100%', maxWidth: 320,
          background: bowing ? 'rgba(201,168,76,0.4)' : 'linear-gradient(135deg, #c9a84c, #e8c860)',
          color: '#1a1200', border: 'none', letterSpacing: 3,
          boxShadow: bowing ? '0 0 30px rgba(201,168,76,0.4)' : '0 4px 16px rgba(201,168,76,0.3)',
          transition: 'all 0.3s',
        }}>
          {bowing ? '🙏 참배 중...' : '🙏 참배하기'}
        </button>
      </div>

      {/* 최근 참배자 */}
      {recent.length > 0 && (
        <div style={{ marginTop: 36, textAlign: 'left', maxWidth: 320, margin: '36px auto 0' }}>
          <p style={{ fontSize: 11, color: 'rgba(201,168,76,0.4)', letterSpacing: 2, marginBottom: 10 }}>최근 참배</p>
          {recent.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(201,168,76,0.06)', fontSize: 13 }}>
              <span style={{ color: 'rgba(240,223,160,0.7)' }}>{r.name} 불자님</span>
              <span style={{ color: 'rgba(201,168,76,0.3)', fontSize: 11 }}>{new Date(r.created_at).toLocaleDateString('ko-KR')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
