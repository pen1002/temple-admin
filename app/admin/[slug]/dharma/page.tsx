'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { use } from 'react'

interface DharmaHistory {
  text: string
  source: string
  savedAt: string
}

export default function DharmaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [text, setText] = useState('')
  const [source, setSource] = useState('')
  const [history, setHistory] = useState<DharmaHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/temple/${slug}/public`)
      .then(r => r.json())
      .then(data => {
        setText(data.dharmaText || '')
        setSource(data.dharmaSource || '')
        setHistory(data.dharmaHistory || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) { setError('법문 내용을 입력해주세요.'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/dharma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, text: text.trim(), source: source.trim() }),
      })
      if (!res.ok) throw new Error()
      router.push(`/admin/${slug}/done?type=dharma`)
    } catch {
      setError('저장 중 오류가 발생했습니다.')
      setSaving(false)
    }
  }

  if (loading || saving) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">📖</div>
          <p className="text-xl text-temple-brown">잠시만 기다려주세요...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout slug={slug} templeName="" title="오늘의 법문">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 text-lg">⚠️ {error}</div>}

        <div>
          <label className="block font-bold text-lg text-temple-brown mb-2">
            법문 내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="이번 주 법문 내용을 입력하세요.&#13;&#10;예: 마음이 고요하면 지혜가 샘솟는다."
            className="input-field resize-none"
            rows={5}
            maxLength={200}
            required
          />
          <p className="text-gray-400 text-base mt-1 text-right">{text.length}/200</p>
        </div>

        <div>
          <label className="block font-bold text-lg text-temple-brown mb-2">출처 (선택)</label>
          <input
            type="text"
            value={source}
            onChange={e => setSource(e.target.value)}
            placeholder="예: 금강경 / 주지스님 법어"
            className="input-field"
            maxLength={100}
          />
        </div>

        <button type="submit" className="btn-primary text-xl py-5">📖 법문 올리기</button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">취소</button>
      </form>

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="font-bold text-lg text-temple-brown mb-3">이전 법문</h2>
          <div className="space-y-3">
            {history.map((h, i) => (
              <div key={i} className="card border-l-4 border-temple-gold">
                <p className="text-base text-gray-700 leading-relaxed">{h.text}</p>
                {h.source && <p className="text-sm text-gray-400 mt-1">— {h.source}</p>}
                <p className="text-xs text-gray-300 mt-2">
                  {new Date(h.savedAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
