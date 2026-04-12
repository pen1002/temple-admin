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
    if (Array.isArray(data)) { setBowCount(data.length); setRecent(data.slice(0, 10)) }
  }, [slug])

  useEffect(() => { fetchData() }, [fetchData])

  const handleBow = async () => {
    if (bowing) return; setBowing(true)
    await fetch('/api/cyber/offering', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ temple_slug: slug, type: 'bow', name: name.trim() || '익명 불자' }) })
    await fetchData()
    setTimeout(() => { setBowing(false); window.location.href = `/${slug}/cyber` }, 2000)
  }

  return (
    <div style={{ textAlign: 'center', padding: 'clamp(12px,3vw,20px) 16px 60px', maxWidth: 600, margin: '0 auto' }}>
      {/* 법당 내부 */}
      <div style={{ position: 'relative', background: 'linear-gradient(180deg, #0a0605 0%, #1a1008 40%, #120a04 100%)', borderRadius: 16, padding: '24px 16px 16px', marginBottom: 20, overflow: 'hidden', border: '1px solid rgba(139,105,20,0.2)' }}>
        {/* 기둥 */}
        <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 14, background: 'linear-gradient(180deg, #5a3a1a, #4a2a10)', borderRadius: '0 0 4px 4px' }} />
        <div style={{ position: 'absolute', right: 8, top: 0, bottom: 0, width: 14, background: 'linear-gradient(180deg, #5a3a1a, #4a2a10)', borderRadius: '0 0 4px 4px' }} />
        {/* 현판 */}
        <div style={{ background: '#2a1508', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 6, padding: '4px 16px', display: 'inline-block', marginBottom: 16 }}>
          <span style={{ color: '#c9a84c', fontSize: 16, fontWeight: 700, letterSpacing: 6, fontFamily: '"Noto Serif KR",serif' }}>大 雄 殿</span>
        </div>

        {/* 후광 */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-55%)', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.04) 40%, transparent 70%)', animation: bowing ? 'dj-halo-burst 2s ease-out' : 'dj-halo 4s ease-in-out infinite alternate' }} />
          {/* 좌우 촛불 */}
          <div style={{ position: 'absolute', left: -20, bottom: 30, fontSize: 24, animation: 'dj-candle 1.5s ease-in-out infinite alternate' }}>🕯</div>
          <div style={{ position: 'absolute', right: -20, bottom: 30, fontSize: 24, animation: 'dj-candle 1.5s ease-in-out 0.5s infinite alternate' }}>🕯</div>

          {/* 불상 SVG */}
          <svg viewBox="0 0 200 230" fill="none" style={{
            width: 'clamp(140px, 28vw, 200px)', height: 'auto', position: 'relative', zIndex: 1,
            transition: 'transform 1s ease-in-out, filter 1s',
            transform: bowing ? 'scale(1.06)' : 'scale(1)',
            filter: bowing ? 'brightness(1.3) drop-shadow(0 0 30px rgba(201,168,76,0.5))' : 'drop-shadow(0 0 8px rgba(201,168,76,0.15))',
          }}>
            <circle cx="100" cy="68" r="62" stroke="#C9A84C" strokeWidth="2" strokeOpacity="0.42"/>
            <circle cx="100" cy="68" r="56" fill="rgba(201,168,76,0.06)"/>
            <circle cx="100" cy="68" r="51" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.26" strokeDasharray="3 2"/>
            <ellipse cx="100" cy="37" rx="12" ry="10" fill="#B8960A"/>
            <ellipse cx="100" cy="61" rx="24" ry="26" fill="#C9A84C"/>
            <ellipse cx="82" cy="52" rx="4" ry="3" fill="#B8960A" opacity="0.44"/>
            <ellipse cx="90" cy="47" rx="4" ry="3" fill="#B8960A" opacity="0.44"/>
            <ellipse cx="100" cy="45" rx="4" ry="3" fill="#B8960A" opacity="0.44"/>
            <ellipse cx="110" cy="47" rx="4" ry="3" fill="#B8960A" opacity="0.44"/>
            <ellipse cx="118" cy="52" rx="4" ry="3" fill="#B8960A" opacity="0.44"/>
            <path d="M88 63 Q92.5 60 97 63" stroke="#5A3800" strokeWidth="2" strokeLinecap="round"/>
            <path d="M103 63 Q107.5 60 112 63" stroke="#5A3800" strokeWidth="2" strokeLinecap="round"/>
            <ellipse cx="92.5" cy="63.5" rx="2" ry="1.5" fill="#3A2000" opacity="0.72"/>
            <ellipse cx="107.5" cy="63.5" rx="2" ry="1.5" fill="#3A2000" opacity="0.72"/>
            <circle cx="100" cy="58" r="2.5" fill="#FFE080" opacity="0.92"/>
            <path d="M97 69 Q95 73 93 74" stroke="#9A7820" strokeWidth="1" strokeLinecap="round"/>
            <path d="M103 69 Q105 73 107 74" stroke="#9A7820" strokeWidth="1" strokeLinecap="round"/>
            <path d="M93 79 Q100 83 107 79" stroke="#9A7820" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M76 62 Q70 68 71 80 Q73 87 78 84 Q81 80 80 72" fill="#C9A84C"/>
            <path d="M124 62 Q130 68 129 80 Q127 87 122 84 Q119 80 120 72" fill="#C9A84C"/>
            <rect x="90" y="85" width="20" height="13" rx="2" fill="#B8960A"/>
            <path d="M74 97 Q70 128 68 172 L132 172 Q130 128 126 97 Q113 107 100 107 Q87 107 74 97Z" fill="#C9A84C"/>
            <path d="M74 97 Q63 105 60 119 Q62 130 72 128" fill="#C9A84C"/>
            <path d="M126 97 Q137 105 140 119 Q138 130 128 128" fill="#C9A84C"/>
            <ellipse cx="92" cy="137" rx="13" ry="11" fill="#C9A84C"/>
            <rect x="96" y="120" width="8" height="18" rx="4" fill="#C9A84C"/>
            <ellipse cx="109" cy="130" rx="14" ry="12" fill="#B8960A"/>
            <path d="M68 172 Q64 182 68 190 L132 190 Q136 182 132 172Z" fill="#C9A84C"/>
            <ellipse cx="100" cy="197" rx="46" ry="10" fill="#8B6810"/>
            <ellipse cx="100" cy="193" rx="40" ry="8" fill="#9A7820"/>
            <text x="100" y="220" textAnchor="middle" fontSize="11" fontFamily="'Noto Serif KR',serif" fill="#C9A84C" letterSpacing="2" opacity="0.88">南無毘盧遮那佛</text>
          </svg>
        </div>

        {/* 공양대 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
          <span style={{ fontSize: 18 }}>🪷</span>
          <span style={{ fontSize: 18, animation: 'dj-candle 1.2s ease-in-out infinite alternate' }}>🕯</span>
          <span style={{ fontSize: 14, color: 'rgba(201,168,76,0.4)' }}>향</span>
          <span style={{ fontSize: 18, animation: 'dj-candle 1.2s ease-in-out 0.3s infinite alternate' }}>🕯</span>
          <span style={{ fontSize: 18 }}>🪷</span>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'rgba(201,168,76,0.5)', marginBottom: 16 }}>누적 참배 {bowCount.toLocaleString()}회</p>

      <input value={name} onChange={e => setName(e.target.value)} placeholder="성함 (선택)"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, padding: '10px 14px', color: 'rgba(255,220,120,0.9)', fontSize: 14, outline: 'none', width: '100%', maxWidth: 320, marginBottom: 16, textAlign: 'center', boxSizing: 'border-box' }} />

      <div>
        <button onClick={handleBow} disabled={bowing} style={{
          padding: 'clamp(14px,3vw,16px) clamp(32px,8vw,48px)', fontSize: 'clamp(16px,4vw,18px)', fontWeight: 700, borderRadius: 12, cursor: bowing ? 'default' : 'pointer', width: '100%', maxWidth: 320,
          background: bowing ? 'rgba(201,168,76,0.4)' : 'linear-gradient(135deg, #c9a84c, #e8c860)',
          color: '#1a1200', border: 'none', letterSpacing: 3,
          boxShadow: bowing ? '0 0 30px rgba(201,168,76,0.4)' : '0 4px 16px rgba(201,168,76,0.3)',
        }}>
          {bowing ? '🙏 참배 중...' : '🙏 참배하기'}
        </button>
      </div>

      {recent.length > 0 && (
        <div style={{ marginTop: 28, textAlign: 'left', maxWidth: 320, margin: '28px auto 0' }}>
          <p style={{ fontSize: 11, color: 'rgba(201,168,76,0.4)', letterSpacing: 2, marginBottom: 8 }}>최근 참배</p>
          {recent.map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(201,168,76,0.06)', fontSize: 13 }}>
              <span style={{ color: 'rgba(240,223,160,0.7)' }}>{r.name} 불자님</span>
              <span style={{ color: 'rgba(201,168,76,0.3)', fontSize: 11 }}>{new Date(r.created_at).toLocaleDateString('ko-KR')}</span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes dj-halo { 0%{opacity:0.6;transform:translate(-50%,-55%) scale(1)} 100%{opacity:1;transform:translate(-50%,-55%) scale(1.08)} }
        @keyframes dj-halo-burst { 0%{opacity:0.5;transform:translate(-50%,-55%) scale(1)} 50%{opacity:1;transform:translate(-50%,-55%) scale(1.3)} 100%{opacity:0.3;transform:translate(-50%,-55%) scale(1.5)} }
        @keyframes dj-candle { 0%{filter:brightness(0.8)} 100%{filter:brightness(1.3) drop-shadow(0 0 4px rgba(255,200,50,0.4))} }
      `}</style>
    </div>
  )
}
