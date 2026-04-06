'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

interface GalleryItem {
  url: string
  caption?: string
  location: string
  uploadedAt: string
}

export default function GalleryEditPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const router = useRouter()

  const [items, setItems]     = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState<number | null>(null)   // 저장 중인 인덱스
  const [deleting, setDeleting] = useState<number | null>(null) // 삭제 중인 인덱스
  const [captions, setCaptions] = useState<string[]>([])
  const [error, setError]     = useState('')
  const [saved, setSaved]     = useState<number | null>(null)   // 저장 완료 표시

  useEffect(() => {
    fetch(`/api/admin/gallery?slug=${slug}`)
      .then(r => r.json())
      .then(d => {
        setItems(d.gallery ?? [])
        setCaptions((d.gallery ?? []).map((g: GalleryItem) => g.caption ?? ''))
      })
      .catch(() => setError('갤러리를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleSave = async (index: number) => {
    setSaving(index)
    setError('')
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, index, caption: captions[index] }),
      })
      if (!res.ok) throw new Error('저장 실패')
      // 로컬 상태 동기화
      setItems(prev => prev.map((item, i) => i === index ? { ...item, caption: captions[index] } : item))
      setSaved(index)
      setTimeout(() => setSaved(null), 1800)
    } catch {
      setError('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(null)
    }
  }

  const handleDelete = async (index: number) => {
    if (!confirm('이 사진을 갤러리에서 삭제하시겠습니까?')) return
    setDeleting(index)
    setError('')
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, index }),
      })
      if (!res.ok) throw new Error('삭제 실패')
      setItems(prev => prev.filter((_, i) => i !== index))
      setCaptions(prev => prev.filter((_, i) => i !== index))
    } catch {
      setError('삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleting(null)
    }
  }

  const LOCATION_LABEL: Record<string, string> = {
    gallery: '갤러리',
    today:   '오늘의 경내',
    event:   '행사 스케치',
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <p className="text-xl text-temple-brown animate-pulse">불러오는 중...</p>
      </div>
    )
  }

  return (
    <AdminLayout slug={slug} templeName="" title="갤러리 제목 수정">
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 text-base mb-4">
          ⚠️ {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🖼️</p>
          <p className="text-lg">등록된 갤러리 사진이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((item, i) => (
            <div key={item.uploadedAt + i} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm">
              {/* 사진 */}
              <img
                src={item.url}
                alt={item.caption ?? ''}
                className="w-full object-cover"
                style={{ maxHeight: '220px', background: '#f5f5f5' }}
              />

              <div className="p-4 space-y-3">
                {/* 위치 뱃지 */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-temple-gold/20 text-temple-brown">
                    {LOCATION_LABEL[item.location] ?? item.location}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.uploadedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>

                {/* 제목 입력 */}
                <div>
                  <label className="block text-sm font-bold text-temple-brown mb-1">사진 제목</label>
                  <input
                    type="text"
                    value={captions[i]}
                    onChange={e => setCaptions(prev => prev.map((c, idx) => idx === i ? e.target.value : c))}
                    placeholder="사진 제목을 입력하세요"
                    className="input-field text-base"
                    maxLength={60}
                  />
                </div>

                {/* 저장 / 삭제 버튼 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(i)}
                    disabled={saving === i || captions[i] === (item.caption ?? '')}
                    className="flex-1 py-3 rounded-xl font-bold text-base transition-all disabled:opacity-40"
                    style={{ background: '#D4AF37', color: '#3a1a00' }}
                  >
                    {saving === i ? '저장 중...' : saved === i ? '✓ 저장됨' : '저장'}
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    disabled={deleting === i}
                    className="px-4 py-3 rounded-xl font-bold text-base border-2 border-red-200 text-red-500 bg-white transition-all disabled:opacity-40"
                  >
                    {deleting === i ? '...' : '삭제'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => router.back()}
        className="btn-secondary mt-6"
      >
        돌아가기
      </button>
    </AdminLayout>
  )
}
