'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DoneScreenProps {
  slug: string
  message?: string
  templeUrl?: string
  onUndo?: () => Promise<void>
}

export default function DoneScreen({ slug, message = '반영 완료!', templeUrl, onUndo }: DoneScreenProps) {
  const [undoTimeLeft, setUndoTimeLeft] = useState(30)
  const [undoDone, setUndoDone] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (undoTimeLeft <= 0) return
    const timer = setInterval(() => {
      setUndoTimeLeft(t => {
        if (t <= 1) { clearInterval(timer); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleUndo = async () => {
    if (!onUndo) return
    setLoading(true)
    try {
      await onUndo()
      setUndoDone(true)
    } catch {
      alert('취소 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8"
      style={{ background: 'linear-gradient(180deg, #2C1810 0%, #4a2c1a 60%, #FFF8E7 100%)' }}>
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-28 h-28 rounded-full bg-temple-gold flex items-center justify-center text-6xl mb-6 shadow-lg">
          {undoDone ? '↩️' : '✓'}
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {undoDone ? '취소되었습니다' : message}
        </h1>
        <p className="text-gray-300 text-lg">
          {undoDone ? '이전 내용으로 되돌렸습니다' : '홈페이지에 반영되었습니다'}
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {templeUrl && (
          <a
            href={templeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center justify-center gap-2"
          >
            🔗 홈페이지에서 확인하기
          </a>
        )}

        <Link href={`/admin/${slug}`} className="btn-secondary block text-center">
          🏠 홈으로 돌아가기
        </Link>

        {onUndo && !undoDone && undoTimeLeft > 0 && (
          <button
            onClick={handleUndo}
            disabled={loading}
            className="w-full min-h-[48px] rounded-xl border-2 border-red-300 text-red-600 bg-red-50 text-lg font-semibold active:opacity-80 transition-opacity"
          >
            {loading ? '취소 중...' : `↩️ 취소하기 (${undoTimeLeft}초)`}
          </button>
        )}
      </div>
    </div>
  )
}
