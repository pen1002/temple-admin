'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { use } from 'react'

interface EventItem {
  id: string
  name: string
  date: string
  memo?: string
}

export default function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [events, setEvents] = useState<EventItem[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [date, setDate] = useState('')
  const [memo, setMemo] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/temple/${slug}/public`)
      .then(r => r.json())
      .then(data => {
        setEvents(data.eventList || [])
        setLoading(false)
      })
      .catch(() => { setLoading(false) })
  }, [slug])

  const selectedEvent = events.find(e => e.id === selectedId)

  useEffect(() => {
    if (selectedEvent) {
      setDate(selectedEvent.date)
      setMemo(selectedEvent.memo || '')
    }
  }, [selectedId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId || !date) { setError('행사와 날짜를 선택해주세요.'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, eventId: selectedId, date, memo }),
      })
      if (!res.ok) throw new Error()
      router.push(`/admin/${slug}/done?type=event`)
    } catch {
      setError('저장 중 오류가 발생했습니다. 다시 시도해주세요.')
      setSaving(false)
    }
  }

  if (loading || saving) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">📅</div>
          <p className="text-xl text-temple-brown">잠시만 기다려주세요...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout slug={slug} templeName="" title="행사 날짜 변경">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 text-lg">⚠️ {error}</div>
        )}

        {events.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-2xl mb-3">📋</p>
            <p className="text-gray-500 text-lg">등록된 행사가 없습니다</p>
            <p className="text-gray-400 text-base mt-1">담당자에게 문의하세요</p>
          </div>
        ) : (
          <>
            <div>
              <label className="block font-bold text-lg text-temple-brown mb-2">
                행사 선택 <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
                className="input-field appearance-none bg-white"
                required
              >
                <option value="">-- 행사를 선택하세요 --</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-lg text-temple-brown mb-2">
                날짜 선택 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-lg text-temple-brown mb-2">
                메모 (선택)
              </label>
              <input
                type="text"
                value={memo}
                onChange={e => setMemo(e.target.value)}
                placeholder="예: 오전 10시 시작, 점심 공양 있음"
                className="input-field"
                maxLength={100}
              />
            </div>

            <button type="submit" className="btn-primary text-xl py-5">
              📅 저장하기
            </button>
          </>
        )}

        <button type="button" onClick={() => router.back()} className="btn-secondary">
          취소
        </button>
      </form>
    </AdminLayout>
  )
}
