// SEC11-01: Stats Bar — 숫자 카운터 (창건연도·국보·보물 등)
'use client'
import { useEffect, useRef, useState } from 'react'
import type { TempleData } from './types'

interface StatItem {
  value: string
  label: string
  prefix?: string
  suffix?: string
}

interface Props {
  temple: TempleData
  config: Record<string, unknown>
}

function useCountUp(target: number, duration = 1400, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start || target === 0) return
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(target)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function StatItemComponent({ item, active }: { item: StatItem; active: boolean }) {
  const numMatch = item.value.match(/^(\d+)/)
  const numPart = numMatch ? parseInt(numMatch[1]) : 0
  const suffix = item.value.replace(/^\d+/, '')
  const count = useCountUp(numPart, 1400, active)
  const display = numPart > 0 ? `${count}${suffix}` : item.value

  return (
    <div className="bt-stat-item">
      <h3>{item.prefix}{display}</h3>
      <p>{item.label}</p>
    </div>
  )
}

export default function StatsBlock({ temple, config }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const defaultStats: StatItem[] = [
    { value: '759', label: 'AD 원표대덕 가지산사 창건' },
    { value: '2', label: '국보 (철조비로자나불·석탑석등)' },
    { value: '5+', label: '보물 (사천왕상·승탑·탑비)' },
    { value: '300년', label: '수령 비자나무 숲' },
  ]

  const stats: StatItem[] = Array.isArray(config.stats)
    ? (config.stats as StatItem[])
    : defaultStats

  return (
    <div ref={ref} className="bt-stats-bar">
      <div className="bt-stats-inner">
        {stats.map((item, i) => (
          <StatItemComponent key={i} item={item} active={active} />
        ))}
      </div>
    </div>
  )
}
