'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SuperLoginPage() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const append = (k: string) => {
    if (k === '⌫') { setPin(p => p.slice(0, -1)); return }
    if (pin.length < 6) setPin(p => p + k)
  }

  const handleLogin = async () => {
    if (pin.length < 4) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/super/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      if (res.ok) { router.push('/super/dashboard') }
      else {
        const d = await res.json() as { error?: string }
        setError(d.error || '인증 실패')
        setPin('')
      }
    } catch { setError('네트워크 오류') }
    finally { setLoading(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: '#1a0f08' }}>
      <div className="text-center text-white"><div className="text-6xl mb-4">⚙️</div><p className="text-xl">인증 중...</p></div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #1a0f08 0%, #2C1810 100%)' }}>
      <div className="flex flex-col items-center pt-16 pb-8 px-6">
        <div className="text-7xl mb-4">☸️</div>
        <h1 className="text-3xl font-bold text-temple-gold text-center">통합 관제 시스템</h1>
        <p className="text-gray-400 text-lg mt-2 text-center">108사찰 플랫폼 · 실장 전용</p>
      </div>

      <div className="flex-1 bg-temple-cream rounded-t-3xl px-6 pt-8 pb-10">
        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6 text-red-700 text-lg">
            ⚠️ {error}
          </div>
        )}

        <p className="text-temple-brown font-bold text-lg mb-3 text-center">실장 전용 비밀번호</p>

        {/* PIN 표시기 */}
        <div className="flex justify-center gap-3 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`w-5 h-5 rounded-full border-2 transition-all ${
              pin.length > i ? 'bg-temple-gold border-temple-gold' : 'bg-transparent border-gray-400'
            }`} />
          ))}
        </div>

        {/* 숫자 패드 */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k) => (
            <button key={k} type="button" disabled={!k}
              onClick={() => append(k)}
              className={`rounded-2xl text-2xl font-bold min-h-[64px] transition-all active:scale-95 ${
                !k ? 'invisible' : k === '⌫'
                  ? 'bg-gray-200 text-gray-600 active:bg-gray-300'
                  : 'bg-white border-2 border-gray-200 text-temple-brown active:bg-temple-gold'
              }`}
            >{k}</button>
          ))}
        </div>

        <button
          onClick={handleLogin}
          disabled={pin.length < 4}
          className="btn-primary text-xl py-5 disabled:opacity-40"
        >
          🔐 관제실 입장
        </button>

        <p className="text-center text-gray-400 text-base mt-6">
          비밀번호 문의: 실장님께
        </p>
      </div>
    </div>
  )
}
