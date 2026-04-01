'use client'
import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface TempleRow {
  id: string; code: string; name: string; nameEn: string
  tier: number; tierLabel: string; tierColor: string
  isActive: boolean; address: string; phone: string
  denomination: string; abbotName: string; primaryColor: string
  blockCount: number; createdAt: string
}

interface Pagination {
  page: number
  totalPages: number
  totalCount: number
}

const SITE_BASE = 'https://munsusa-site-fmwyrdut3-bae-yeonams-projects.vercel.app'

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  if (current > 4) pages.push('...')
  for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) pages.push(i)
  if (current < total - 3) pages.push('...')
  pages.push(total)
  return pages
}

function Paginator({ pagination }: { pagination: Pagination }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { page, totalPages, totalCount } = pagination

  if (totalPages <= 1) return (
    <p className="text-center text-gray-400 text-sm mt-6">총 {totalCount.toLocaleString()}개</p>
  )

  const go = (p: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(p))
    router.push(`${pathname}?${params.toString()}`)
  }

  const pages = getPageNumbers(page, totalPages)

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-gray-500 text-sm">총 {totalCount.toLocaleString()}개 · {page}/{totalPages} 페이지</p>
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <button
          onClick={() => go(page - 1)} disabled={page === 1}
          className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 font-bold disabled:opacity-30 active:bg-gray-200 text-base"
        >‹</button>

        {pages.map((p, i) =>
          p === '...'
            ? <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400">…</span>
            : <button
                key={p}
                onClick={() => go(p as number)}
                className={`w-9 h-9 rounded-lg font-semibold text-sm transition-colors ${
                  p === page
                    ? 'bg-temple-brown text-temple-gold'
                    : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                }`}
              >{p}</button>
        )}

        <button
          onClick={() => go(page + 1)} disabled={page === totalPages}
          className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 font-bold disabled:opacity-30 active:bg-gray-200 text-base"
        >›</button>
      </div>
    </div>
  )
}

export default function TempleGrid({ temples, pagination }: { temples: TempleRow[], pagination: Pagination }) {
  const [pinModal, setPinModal] = useState<string | null>(null) // code
  const [newPin, setNewPin] = useState('')
  const [pinLoading, setPinLoading] = useState(false)
  const [pinMsg, setPinMsg] = useState('')

  const handlePinSave = async (code: string) => {
    if (newPin.length < 4) { setPinMsg('4자리 이상 입력하세요'); return }
    setPinLoading(true); setPinMsg('')
    try {
      const res = await fetch(`/api/super/temples/${code}/pin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: newPin }),
      })
      const d = await res.json() as { message?: string; error?: string; envKey?: string }
      if (res.ok) {
        setPinMsg(`✅ ${d.message}`)
        setTimeout(() => { setPinModal(null); setPinMsg(''); setNewPin('') }, 2000)
      } else {
        setPinMsg(`⚠️ ${d.error}${d.envKey ? ` (env: ${d.envKey})` : ''}`)
      }
    } catch { setPinMsg('네트워크 오류') }
    finally { setPinLoading(false) }
  }

  return (
    <>
      <div className="space-y-4">
        {temples.map(t => (
          <div key={t.id} className="card border border-gray-100 relative overflow-hidden">
            {/* 사찰 컬러 스트라이프 */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ background: t.primaryColor }} />
            <div className="pl-4">
              {/* 상단: 이름 + 배지 */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-temple-brown">{t.name}</h2>
                    <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full text-white"
                      style={{ background: t.tierColor }}>
                      Tier {t.tier} · {t.tierLabel}
                    </span>
                    {!t.isActive && (
                      <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-gray-400 text-white">
                        비활성
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-base mt-0.5">
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{t.code}</code>
                    {t.nameEn && <span className="ml-2">{t.nameEn}</span>}
                  </p>
                </div>
              </div>

              {/* 정보 */}
              <div className="text-gray-600 text-base space-y-0.5 mb-3">
                {t.denomination && <p>🏛 {t.denomination}{t.abbotName ? ` · ${t.abbotName}` : ''}</p>}
                {t.address && <p>📍 {t.address}</p>}
                {t.phone && <p>📞 {t.phone}</p>}
                <p>🧩 블록 {t.blockCount}개 · {t.createdAt} 등록</p>
              </div>

              {/* 액션 버튼 */}
              <div className="flex flex-wrap gap-2">
                <a
                  href={`${SITE_BASE}/${t.code}`}
                  target="_blank" rel="noopener"
                  className="bg-blue-50 text-blue-600 border border-blue-200 font-semibold px-3 py-2 rounded-xl text-base active:opacity-70"
                >
                  🌐 사이트 보기
                </a>
                <a
                  href={`/admin/${t.code}`}
                  className="bg-green-50 text-green-600 border border-green-200 font-semibold px-3 py-2 rounded-xl text-base active:opacity-70"
                >
                  ✏️ 콘텐츠 관리
                </a>
                <button
                  onClick={() => { setPinModal(t.code); setNewPin(''); setPinMsg('') }}
                  className="bg-amber-50 text-amber-700 border border-amber-200 font-semibold px-3 py-2 rounded-xl text-base active:opacity-70"
                >
                  🔑 PIN 변경
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <Paginator pagination={pagination} />

      {/* + 새 사찰 등록 */}
      <div className="fixed bottom-6 right-5 z-50">
        <a
          href="/super/add"
          className="flex items-center gap-2 bg-temple-brown text-temple-gold font-bold px-5 py-3.5 rounded-2xl shadow-lg text-lg active:opacity-80"
        >
          <span className="text-2xl">+</span> 새 사찰 등록
        </a>
      </div>

      {/* PIN 변경 모달 */}
      {pinModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={e => { if (e.target === e.currentTarget) setPinModal(null) }}>
          <div className="bg-temple-cream rounded-t-3xl w-full max-w-lg px-6 pt-6 pb-10">
            <h3 className="text-xl font-bold text-temple-brown mb-1">🔑 PIN 변경</h3>
            <p className="text-gray-500 text-base mb-4">
              <code className="bg-gray-100 px-1.5 py-0.5 rounded">{pinModal}</code> 사찰의 관리자 PIN
            </p>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              value={newPin}
              onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="새 PIN (4~8자리 숫자)"
              className="input-field mb-3"
              autoFocus
            />
            {pinMsg && (
              <p className={`text-base mb-3 ${pinMsg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {pinMsg}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => handlePinSave(pinModal)}
                disabled={pinLoading || newPin.length < 4}
                className="btn-primary flex-1 disabled:opacity-40"
              >
                {pinLoading ? '저장 중...' : '💾 PIN 저장'}
              </button>
              <button
                onClick={() => { setPinModal(null); setNewPin(''); setPinMsg('') }}
                className="btn-secondary flex-1"
              >
                취소
              </button>
            </div>
            <p className="text-gray-400 text-sm mt-3 text-center">
              저장 후 관리앱 재배포 시 적용됩니다
            </p>
          </div>
        </div>
      )}
    </>
  )
}
