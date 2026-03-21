'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    unauthorized: '등록되지 않은 이메일입니다. 담당자에게 문의하세요.',
    invalid_slug: '잘못된 사찰 코드입니다. 다시 확인해주세요.',
    kakao_error: '카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
    no_email: '카카오 계정에 이메일이 없습니다. 카카오 설정에서 이메일을 확인해주세요.',
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!slug.trim()) return
    setLoading(true)
    window.location.href = `/api/auth/kakao?slug=${encodeURIComponent(slug.trim())}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-temple-brown">
        <div className="text-center text-white">
          <div className="text-5xl mb-4">🙏</div>
          <p className="text-xl">잠시만 기다려주세요...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #2C1810 0%, #4a2c1a 100%)' }}>
      {/* Header */}
      <div className="flex flex-col items-center pt-16 pb-8 px-6">
        <div className="text-6xl mb-4">🏯</div>
        <h1 className="text-3xl font-bold text-temple-gold text-center leading-tight">
          사찰 관리자
        </h1>
        <p className="text-gray-300 text-lg mt-2 text-center">
          홈페이지 관리 시스템
        </p>
      </div>

      {/* Form Card */}
      <div className="flex-1 bg-temple-cream rounded-t-3xl px-6 pt-8 pb-6">
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6 text-red-700 text-lg">
            ⚠️ {errorMessages[error] || '오류가 발생했습니다. 다시 시도해주세요.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-temple-brown font-bold text-lg mb-2">
              사찰 코드
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="예: jogyesa, haeinsa"
              className="input-field"
              required
              autoCapitalize="none"
              autoCorrect="off"
            />
            <p className="text-gray-500 text-base mt-1">담당자에게 받은 코드를 입력하세요</p>
          </div>

          <button
            type="submit"
            disabled={!slug.trim()}
            className="w-full min-h-[64px] rounded-2xl font-bold text-xl flex items-center justify-center gap-3 disabled:opacity-50 transition-opacity active:opacity-80"
            style={{ backgroundColor: '#FEE500', color: '#3C1E1E' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 5.92 2 10.67c0 2.97 1.77 5.58 4.44 7.18L5.5 21.5l4.27-2.27C10.46 19.4 11.22 19.5 12 19.5c5.52 0 10-3.92 10-8.83C22 5.92 17.52 2 12 2z"/>
            </svg>
            카카오로 로그인
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-base">
            로그인에 어려움이 있으시면<br />담당자에게 문의하세요
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-temple-brown">
        <p className="text-white text-xl">잠시만 기다려주세요...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
