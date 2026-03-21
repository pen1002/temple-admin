'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

export default function NoticePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, title: title.trim(), content: content.trim() }),
      })
      if (!res.ok) throw new Error('저장 실패')
      router.push(`/admin/${slug}/done?type=notice`)
    } catch {
      setError('저장 중 오류가 발생했습니다. 다시 시도해주세요.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">📢</div>
          <p className="text-xl text-temple-brown">잠시만 기다려주세요...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout slug={slug} templeName="" title="공지사항 올리기">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 text-lg">
            ⚠️ {error}
          </div>
        )}

        <div>
          <label className="block font-bold text-lg text-temple-brown mb-2">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="예: 2월 정기 법회 안내"
            className="input-field"
            required
            maxLength={50}
          />
          <p className="text-gray-400 text-base mt-1 text-right">{title.length}/50</p>
        </div>

        <div>
          <label className="block font-bold text-lg text-temple-brown mb-2">
            내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="공지 내용을 입력하세요.&#13;&#10;예: 2월 15일(목) 오전 10시에 정기 법회가 진행됩니다. 많은 참여 바랍니다."
            className="input-field resize-none"
            rows={6}
            required
            maxLength={500}
          />
          <p className="text-gray-400 text-base mt-1 text-right">{content.length}/500</p>
        </div>

        <button type="submit" className="btn-primary text-xl py-5 mt-4">
          📢 홈페이지에 올리기
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          취소
        </button>
      </form>
    </AdminLayout>
  )
}
