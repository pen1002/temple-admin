'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useTransition, useEffect, useRef } from 'react'

interface Props {
  denominationList: string[]
  currentSearch: string
  currentTier: string
  currentDenomination: string
}

const TIER_OPTIONS = [
  { value: '',  label: '전체 티어' },
  { value: '1', label: 'Tier 1 · 기본' },
  { value: '2', label: 'Tier 2 · 표준' },
  { value: '3', label: 'Tier 3 · 프리미엄' },
]

export default function DashboardControls({
  denominationList,
  currentSearch,
  currentTier,
  currentDenomination,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [searchInput, setSearchInput] = useState(currentSearch)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // searchInput이 URL과 달라지면 디바운스 후 push
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (searchInput !== currentSearch) {
        pushParams({ search: searchInput })
      }
    }, 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  function pushParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    params.delete('page') // 필터 변경 시 항상 1페이지로
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  const hasFilter = currentSearch || currentTier || currentDenomination

  return (
    <div className="space-y-2">
      {/* 검색창 */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="사찰명, slug 검색..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-temple-gold text-base"
        />
        {searchInput && (
          <button
            onClick={() => { setSearchInput(''); pushParams({ search: '' }) }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* 필터 행 */}
      <div className="flex gap-2 flex-wrap">
        {/* 티어 필터 */}
        <select
          value={currentTier}
          onChange={e => pushParams({ tier: e.target.value })}
          className="flex-1 min-w-[130px] bg-white/10 text-white border border-white/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-temple-gold"
        >
          {TIER_OPTIONS.map(o => (
            <option key={o.value} value={o.value} className="bg-gray-800 text-white">
              {o.label}
            </option>
          ))}
        </select>

        {/* 종파 필터 */}
        <select
          value={currentDenomination}
          onChange={e => pushParams({ denomination: e.target.value })}
          className="flex-1 min-w-[150px] bg-white/10 text-white border border-white/20 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-temple-gold"
        >
          <option value="" className="bg-gray-800 text-white">전체 종파</option>
          {denominationList.map(d => (
            <option key={d} value={d} className="bg-gray-800 text-white">{d}</option>
          ))}
        </select>

        {/* 초기화 */}
        {hasFilter && (
          <a
            href="/super/dashboard"
            className="flex items-center gap-1 bg-red-500/20 text-red-300 border border-red-400/30 rounded-xl px-3 py-2.5 text-sm whitespace-nowrap active:opacity-70"
          >
            ✕ 초기화
          </a>
        )}
      </div>
    </div>
  )
}
