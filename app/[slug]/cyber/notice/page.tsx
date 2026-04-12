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
        <div style={{ fontSize: 48, marginBottom: 8 }}>📋</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#c9a84c', letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>공지사항</h2>
        <p style={{ fontSize: 12, color: 'rgba(201,168,76,0.4)', marginTop: 4 }}>미래사 소식을 전합니다</p>
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
          <a href={`/${slug}/cyber`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', borderRadius: 8, padding: '10px 24px', fontSize: 13, textDecoration: 'none' }}>☸ 도량으로</a>
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
