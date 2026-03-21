'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { use } from 'react'

interface RitualTime {
  id: string
  name: string
  time: string
}

export default function RitualPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [rituals, setRituals] = useState<RitualTime[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/temple/${slug}/public`)
      .then(r => r.json())
      .then(data => { setRituals(data.ritualTimes || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  const selectedRitual = rituals.find(r => r.id === selectedId)
  useEffect(() => { if (selectedRitual) setTime(selectedRitual.time) }, [selectedId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId || !time) { setError('법회와 시간을 선택해주세요.'); return }
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/admin/ritual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, ritualId: selectedId, time }),
      })
      if (!res.ok) throw new Error()
      router.push(`/admin/${slug}/done?type=ritual`)
    } catch {
      setError('저장 중 오류가 발생했습니다.')
      setSaving(false)
    }
  }

  if (loading || saving) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🔔</div>
          <p className="text-xl text-temple-brown">잠시만 기다려주세요...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout slug={slug} templeName="" title="법회 시간 변경">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 text-lg">⚠️ {error}</div>}

        {rituals.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-2xl mb-3">🔔</p>
            <p className="text-gray-500 text-lg">등록된 법회가 없습니다</p>
          </div>
        ) : (
          <>
            <div>
              <label className="block font-bold text-lg text-temple-brown mb-2">법회 선택 <span className="text-red-500">*</span></label>
              <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="input-field appearance-none bg-white" required>
                <option value="">-- 법회를 선택하세요 --</option>
                {rituals.map(r => <option key={r.id} value={r.id}>{r.name} (현재: {r.time})</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold text-lg text-temple-brown mb-2">시간 선택 <span className="text-red-500">*</span></label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="input-field" required />
              {time && <p className="text-gray-500 text-base mt-1">선택한 시간: {time}</p>}
            </div>
            <button type="submit" className="btn-primary text-xl py-5">🔔 저장하기</button>
          </>
        )}
        <button type="button" onClick={() => router.back()} className="btn-secondary">취소</button>
      </form>
    </AdminLayout>
  )
}
