'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

interface Notice { id: string; title: string; content: string; author: string; date: string }

export default function NoticePage() {
  const { slug } = useParams<{ slug: string }>()
  const [notices, setNotices] = useState<Notice[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)

  const fetchNotices = useCallback(async () => {
    const res = await fetch(`/api/cyber/notice?temple_slug=${slug}`)
    const data = await res.json()
    if (Array.isArray(data)) setNotices(data)
  }, [slug])

  useEffect(() => { fetchNotices() }, [fetchNotices])

  const handleSubmit = async () => {
    if (!title.trim()) return
    setLoading(true)
    await fetch('/api/cyber/notice', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temple_slug: slug, title: title.trim(), content: content.trim(), author: '관리자' }),
    })
    await fetchNotices()
    setTitle(''); setContent(''); setShowForm(false); setCurrentSlide(0)
    setLoading(false)
  }

  const shareKakao = (n: Notice) => {
    const text = `[${n.title}]\n${n.content}\n\n— 미래사 사이버법당`
    navigator.clipboard.writeText(text).then(() => alert('공지가 복사되었습니다.\n카카오톡에 붙여넣기하여 공유해 주세요.'))
  }

  // 3개씩 그룹화
  const pages: Notice[][] = []
  for (let i = 0; i < notices.length; i += 3) {
    pages.push(notices.slice(i, i + 3))
  }
  if (pages.length === 0) pages.push([])
  const totalPages = pages.length
  const currentPage = pages[Math.min(currentSlide, totalPages - 1)] || []

  const goNext = () => setCurrentSlide(prev => Math.min(prev + 1, totalPages - 1))
  const goPrev = () => setCurrentSlide(prev => Math.max(prev - 1, 0))

  const inp: React.CSSProperties = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 8, padding: '10px 14px', color: 'rgba(255,220,120,0.9)', fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box' }

  return (
    <div style={{ padding: 'clamp(20px,4vw,32px) 16px 60px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        {/* 에밀레종 SVG + 울림 애니메이션 */}
        <div style={{ display: 'inline-block', position: 'relative', width: 100, height: 120, marginBottom: 8 }}>
          <svg viewBox="0 0 100 130" style={{ width: '100%', animation: 'bell-swing 3s ease-in-out infinite' }}>
            <defs>
              <linearGradient id="bellBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8a8878" />
                <stop offset="30%" stopColor="#6b695a" />
                <stop offset="60%" stopColor="#7d7b6c" />
                <stop offset="100%" stopColor="#5a584a" />
              </linearGradient>
              <linearGradient id="bellTop" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4a5038" />
                <stop offset="100%" stopColor="#5a6048" />
              </linearGradient>
            </defs>
            {/* 고리 (용뉴) */}
            <ellipse cx="50" cy="8" rx="8" ry="5" fill="#4a5038" stroke="#3a4030" strokeWidth="0.8" />
            <rect x="46" y="10" width="8" height="6" rx="2" fill="#4a5038" />
            {/* 종 상단 어깨 */}
            <path d="M30 16 Q30 12 50 12 Q70 12 70 16 L72 28 Q73 32 73 36 L73 36" fill="url(#bellTop)" stroke="#3a4030" strokeWidth="0.5" />
            <path d="M27 16 Q27 10 50 10 Q73 10 73 16" fill="none" stroke="#6a6858" strokeWidth="1" />
            {/* 유곽 (9개 돌기) */}
            <rect x="33" y="20" width="34" height="18" rx="2" fill="none" stroke="#8a8070" strokeWidth="0.6" />
            {Array.from({length: 9}).map((_, i) => (
              <circle key={i} cx={38 + (i % 3) * 10} cy={25 + Math.floor(i / 3) * 5} r="2" fill="#7a7868" stroke="#6a6858" strokeWidth="0.3" />
            ))}
            {/* 종 몸통 */}
            <path d="M27 16 L24 95 Q22 105 18 112 L82 112 Q78 105 76 95 L73 16" fill="url(#bellBody)" stroke="#5a584a" strokeWidth="0.8" />
            {/* 비천상 (천녀 부조) */}
            <path d="M42 55 Q44 48 48 50 Q52 45 54 52 Q56 48 58 55 Q55 60 50 58 Q45 60 42 55" fill="#7a7868" stroke="#6a6858" strokeWidth="0.4" />
            <path d="M44 58 Q46 68 50 70 Q54 68 56 58" fill="none" stroke="#6a6858" strokeWidth="0.5" />
            {/* 당좌 (타종점) */}
            <circle cx="50" cy="85" r="6" fill="#6a6858" stroke="#5a584a" strokeWidth="0.5" />
            <circle cx="50" cy="85" r="3.5" fill="#7a7868" />
            {/* 하대 문양 */}
            <path d="M20 108 Q30 104 50 104 Q70 104 80 108" fill="none" stroke="#8a8070" strokeWidth="0.8" />
            <path d="M18 112 Q20 108 50 106 Q80 108 82 112" fill="#5a584a" stroke="#4a4838" strokeWidth="0.5" />
            {/* 연꽃 하대 */}
            {Array.from({length: 7}).map((_, i) => (
              <path key={i} d={`M${22 + i * 9} 112 Q${26 + i * 9} 108 ${30 + i * 9} 112`} fill="#6a6858" stroke="#5a584a" strokeWidth="0.3" />
            ))}
          </svg>
          {/* 울림 파장 */}
          <div style={{ position: 'absolute', top: '40%', left: '-15%', width: '130%', height: '40%', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(201,168,76,0.15)', borderRadius: '50%', animation: 'bell-wave 3s ease-out infinite' }} />
            <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(201,168,76,0.1)', borderRadius: '50%', animation: 'bell-wave 3s ease-out 0.5s infinite' }} />
            <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(201,168,76,0.05)', borderRadius: '50%', animation: 'bell-wave 3s ease-out 1s infinite' }} />
          </div>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#c9a84c', letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>공지사항</h2>
        <p style={{ fontSize: 12, color: 'rgba(201,168,76,0.4)', marginTop: 4 }}>미래사 소식을 전합니다</p>
        <style>{`
          @keyframes bell-swing { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
          @keyframes bell-wave { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
        `}</style>
      </div>

      {/* 스와이프 영역 */}
      <div
        style={{ position: 'relative', minHeight: 300, marginBottom: 16 }}
        onTouchStart={e => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={e => {
          const diff = touchStartX - e.changedTouches[0].clientX
          if (diff > 50) goNext()
          else if (diff < -50) goPrev()
        }}
      >
        {/* 공지 카드 3개 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {currentPage.length > 0 ? currentPage.map((n) => (
            <div key={n.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 12, padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#f0dfa0', flex: 1, wordBreak: 'keep-all' }}>{n.title}</span>
                <span style={{ fontSize: 10, color: 'rgba(201,168,76,0.35)', whiteSpace: 'nowrap' }}>{new Date(n.date).toLocaleDateString('ko-KR')}</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(240,223,160,0.6)', lineHeight: 1.8, margin: '0 0 10px', wordBreak: 'keep-all' }}>{n.content}</p>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => shareKakao(n)} style={{ background: '#FEE500', border: 'none', color: '#3A1D1D', borderRadius: 6, padding: '5px 12px', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>카톡 공유</button>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(201,168,76,0.3)', fontSize: 14 }}>등록된 공지사항이 없습니다</div>
          )}
        </div>
      </div>

      {/* 페이지 인디케이터 + 좌우 버튼 */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <button onClick={goPrev} disabled={currentSlide === 0} style={{ background: 'none', border: '1px solid rgba(201,168,76,0.2)', color: currentSlide === 0 ? 'rgba(201,168,76,0.2)' : '#c9a84c', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}>◂ 이전</button>
          <div style={{ display: 'flex', gap: 6 }}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <span key={i} onClick={() => setCurrentSlide(i)} style={{ width: i === currentSlide ? 20 : 8, height: 8, borderRadius: 4, background: i === currentSlide ? '#c9a84c' : 'rgba(201,168,76,0.2)', cursor: 'pointer', transition: 'width 0.3s' }} />
            ))}
          </div>
          <button onClick={goNext} disabled={currentSlide >= totalPages - 1} style={{ background: 'none', border: '1px solid rgba(201,168,76,0.2)', color: currentSlide >= totalPages - 1 ? 'rgba(201,168,76,0.2)' : '#c9a84c', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}>다음 ▸</button>
        </div>
      )}

      {/* 공지 작성 폼 */}
      {!showForm ? (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setShowForm(true)} style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 13 }}>공지 작성</button>
          <a href={`/${slug}/dharma-wheel?grid=1`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 24px', fontSize: 13, textDecoration: 'none' }}>☸ 도량으로</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div>
            <input value={title} onChange={e => setTitle(e.target.value.slice(0, 100))} placeholder="제목 (최대 100자)" style={inp} />
            <div style={{ textAlign: 'right', fontSize: 10, color: 'rgba(201,168,76,0.3)', marginTop: 2 }}>{title.length}/100</div>
          </div>
          <div>
            <textarea value={content} onChange={e => setContent(e.target.value.slice(0, 500))} placeholder="내용 (최대 500자)" rows={5} style={{ ...inp, resize: 'none' }} />
            <div style={{ textAlign: 'right', fontSize: 10, color: 'rgba(201,168,76,0.3)', marginTop: 2 }}>{content.length}/500</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSubmit} disabled={loading || !title.trim()} style={{ flex: 1, background: loading ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.22)', border: '1px solid rgba(201,168,76,0.5)', color: 'rgba(255,220,120,0.95)', borderRadius: 8, padding: 12, fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>
              {loading ? '등록 중...' : '공지 등록'}
            </button>
            <button onClick={() => setShowForm(false)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)', color: 'rgba(201,168,76,0.5)', borderRadius: 8, padding: '12px 20px', fontSize: 13, cursor: 'pointer' }}>취소</button>
          </div>
        </div>
      )}
    </div>
  )
}
