'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'

interface DharmaHistory {
  text: string
  source: string
  savedAt: string
}

interface DailyWisdom {
  title: string
  content: string
  source: string
  verse?: string | null
}

interface WisdomOverride {
  content: string
  isActive: boolean
}

export default function DharmaPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [text, setText] = useState('')
  const [source, setSource] = useState('')
  const [history, setHistory] = useState<DharmaHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // 오늘의 부처님말씀 상태
  const [todayWisdom, setTodayWisdom] = useState<DailyWisdom | null>(null)
  const [wisdomOverride, setWisdomOverride] = useState<WisdomOverride | null>(null)
  const [overrideText, setOverrideText] = useState('')
  const [savingOverride, setSavingOverride] = useState(false)
  const [overrideMode, setOverrideMode] = useState(false)
  const [overrideMsg, setOverrideMsg] = useState('')

  useEffect(() => {
    // 기존 부처님말씀 데이터
    fetch(`/api/temple/${slug}/public`)
      .then(r => r.json())
      .then(data => {
        setText(data.dharmaText || '')
        setSource(data.dharmaSource || '')
        setHistory(data.dharmaHistory || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // 오늘의 부처님말씀 (365일 공통)
    fetch(`/api/admin/wisdom-override?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        setTodayWisdom(data.wisdom ?? null)
        setWisdomOverride(data.override ?? null)
        if (data.override?.isActive) {
          setOverrideText(data.override.content)
          setOverrideMode(true)
        }
      })
      .catch(() => {})
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) { setError('부처님말씀 내용을 입력해주세요.'); return }
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

  const handleSaveOverride = async () => {
    if (!overrideText.trim()) { setOverrideMsg('내용을 입력해주세요.'); return }
    setSavingOverride(true)
    setOverrideMsg('')
    try {
      const res = await fetch('/api/admin/wisdom-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, content: overrideText.trim() }),
      })
      if (!res.ok) throw new Error()
      setOverrideMsg('✅ 오늘의 부처님말씀이 저장되었습니다!')
      setWisdomOverride({ content: overrideText.trim(), isActive: true })
    } catch {
      setOverrideMsg('저장 중 오류가 발생했습니다.')
    } finally {
      setSavingOverride(false)
    }
  }

  const handleResetOverride = async () => {
    setSavingOverride(true)
    setOverrideMsg('')
    try {
      await fetch('/api/admin/wisdom-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, isActive: false }),
      })
      setWisdomOverride(null)
      setOverrideText('')
      setOverrideMode(false)
      setOverrideMsg('✅ 공통 말씀으로 복귀했습니다.')
    } catch {
      setOverrideMsg('오류가 발생했습니다.')
    } finally {
      setSavingOverride(false)
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
    <AdminLayout slug={slug} templeName="" title="오늘의 부처님말씀">

      {/* ── 섹션 1: 365일 자동 말씀 미리보기 ── */}
      {todayWisdom && (
        <div className="card mb-6" style={{ background: '#FFF8E7', border: '2px solid #D4AF37' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 className="font-bold text-lg text-temple-brown">📅 오늘의 공통 부처님말씀</h2>
            <span style={{
              fontSize: '.7rem', fontWeight: 700, padding: '3px 8px',
              borderRadius: 999, background: wisdomOverride?.isActive ? '#f3f4f6' : '#10B981',
              color: wisdomOverride?.isActive ? '#6b7280' : '#fff',
            }}>
              {wisdomOverride?.isActive ? '숨김 중' : '표시 중'}
            </span>
          </div>
          <p className="font-bold text-base text-temple-brown mb-1">{todayWisdom.title}</p>
          {todayWisdom.verse && (
            <p className="text-sm text-yellow-700 italic mb-2">{todayWisdom.verse}</p>
          )}
          <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line line-clamp-4">
            {todayWisdom.content}
          </p>
          <p className="text-sm text-gray-400 mt-2 text-right">— {todayWisdom.source}</p>
        </div>
      )}

      {/* ── 섹션 2: 사찰 Override ── */}
      <div className="card mb-8" style={{ border: '2px solid #10B981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 className="font-bold text-lg text-temple-brown">✏️ 사찰 전용 말씀 (오늘만 적용)</h2>
          {wisdomOverride?.isActive && (
            <button
              onClick={handleResetOverride}
              disabled={savingOverride}
              className="text-sm text-gray-500 underline"
            >
              공통 말씀으로 복귀
            </button>
          )}
        </div>

        {!overrideMode && !wisdomOverride?.isActive ? (
          <button
            onClick={() => setOverrideMode(true)}
            className="btn-secondary"
            style={{ width: '100%' }}
          >
            + 오늘 특별 말씀 직접 입력하기
          </button>
        ) : (
          <div className="space-y-3">
            <textarea
              value={overrideText}
              onChange={e => setOverrideText(e.target.value)}
              placeholder="오늘 특별히 전하고 싶은 부처님말씀을 입력하세요."
              className="input-field resize-none"
              rows={6}
              maxLength={1000}
            />
            <p className="text-gray-400 text-sm text-right">{overrideText.length}/1000</p>
            {overrideMsg && (
              <p className={`text-sm font-bold ${overrideMsg.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}>
                {overrideMsg}
              </p>
            )}
            <button
              onClick={handleSaveOverride}
              disabled={savingOverride}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              {savingOverride ? '저장 중...' : '📖 오늘 특별 말씀 저장'}
            </button>
          </div>
        )}
      </div>

      {/* ── 섹션 3: 기존 부처님말씀 (수동 입력) ── */}
      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 24 }}>
        <h2 className="font-bold text-lg text-temple-brown mb-4">📝 부처님말씀 직접 입력 (D-01 블록용)</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-red-700 text-lg">⚠️ {error}</div>}

          <div>
            <label className="block font-bold text-lg text-temple-brown mb-2">
              부처님말씀 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="오늘의 부처님말씀을 입력하세요.&#13;&#10;예: 마음이 고요하면 지혜가 샘솟는다."
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
              placeholder="예: 법구경 / 숫타니파타 / 주지스님 법어"
              className="input-field"
              maxLength={100}
            />
          </div>

          <button type="submit" className="btn-primary text-xl py-5">📖 부처님말씀 올리기</button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">취소</button>
        </form>

        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="font-bold text-lg text-temple-brown mb-3">이전 부처님말씀</h2>
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
      </div>
    </AdminLayout>
  )
}
