'use client'

import { useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function LoginForm() {
  const [slug, setSlug] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const pinRef = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  // URL 파라미터로 넘어온 에러 (세션 만료 등)
  const urlError = searchParams.get('error')
  const urlErrorMessages: Record<string, string> = {
    session_expired: '로그인이 만료되었습니다. 다시 로그인해주세요.',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slug.trim() || pin.length !== 4) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slug.trim().toLowerCase(), pin }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '로그인 중 오류가 발생했습니다.')
        setPin('')
        pinRef.current?.focus()
        setLoading(false)
        return
      }

      router.push(`/admin/${data.slug}`)
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#2C1810' }}>
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🙏</div>
          <p className="text-xl">잠시만 기다려주세요...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #2C1810 0%, #4a2c1a 100%)' }}>
      {/* Header */}
      <div className="flex flex-col items-center pt-14 pb-8 px-6">
        <div className="text-6xl mb-4">🏯</div>
        <h1 className="text-3xl font-bold text-temple-gold text-center leading-tight">
          사찰 관리자
        </h1>
        <p className="text-gray-300 text-lg mt-2 text-center">
          홈페이지 관리 시스템
        </p>
      </div>

      {/* Form Card */}
      <div className="flex-1 bg-temple-cream rounded-t-3xl px-6 pt-8 pb-10">
        {(error || urlError) && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6 text-red-700 text-lg leading-snug">
            ⚠️ {error || urlErrorMessages[urlError!] || '오류가 발생했습니다.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 사찰 코드 */}
          <div>
            <label className="block text-temple-brown font-bold text-lg mb-2">
              사찰 코드
            </label>
            <input
              type="text"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              onBlur={() => setSlug(s => s.trim().toLowerCase())}
              placeholder="예: munsusa"
              className="input-field"
              required
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
            />
            <p className="text-gray-500 text-base mt-1">실장님께 받은 사찰 코드를 입력하세요</p>
          </div>

          {/* PIN 입력 */}
          <div>
            <label className="block text-temple-brown font-bold text-lg mb-2">
              비밀번호 (4자리)
            </label>
            <input
              ref={pinRef}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="• • • •"
              className="input-field text-center text-2xl tracking-[0.5em]"
              required
              autoComplete="current-password"
            />
            <p className="text-gray-500 text-base mt-1">숫자 4자리를 입력하세요</p>
          </div>

          {/* PIN 숫자 패드 */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key) => (
              <button
                key={key}
                type="button"
                disabled={!key}
                onClick={() => {
                  if (key === '⌫') {
                    setPin(p => p.slice(0, -1))
                  } else if (key && pin.length < 4) {
                    setPin(p => p + key)
                  }
                }}
                className={`
                  rounded-2xl text-2xl font-bold min-h-[64px] transition-all active:scale-95
                  ${!key ? 'invisible' : key === '⌫'
                    ? 'bg-gray-200 text-gray-600 active:bg-gray-300'
                    : 'bg-white border-2 border-gray-200 text-temple-brown active:bg-temple-gold active:border-temple-gold'}
                `}
              >
                {key}
              </button>
            ))}
          </div>

          {/* PIN 인디케이터 */}
          <div className="flex justify-center gap-4 py-1">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  pin.length > i
                    ? 'bg-temple-gold border-temple-gold'
                    : 'bg-transparent border-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!slug.trim() || pin.length !== 4}
            className="btn-primary text-xl py-5 disabled:opacity-40"
          >
            🔓 로그인
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-base">
            비밀번호를 모르시면<br />실장님께 문의하세요
          </p>
          {process.env.NEXT_PUBLIC_ADMIN_PHONE && (
            <p className="text-temple-brown font-bold text-lg mt-1">
              {process.env.NEXT_PUBLIC_ADMIN_PHONE}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#2C1810' }}>
        <p className="text-white text-xl">잠시만 기다려주세요...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
