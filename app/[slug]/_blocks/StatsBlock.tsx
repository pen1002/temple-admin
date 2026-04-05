// SEC11-01: Stats Bar — 숫자 카운터 (창건연도·국보·보물 등)
'use client'
import { useEffect, useRef, useState } from 'react'
import type { TempleData } from './types'

interface StatItem {
  value: string   // "759", "2", "5+", "300년" 등
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
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(target)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function StatItemComponent({ item, primary, active }: { item: StatItem; primary: string; active: boolean }) {
  // 숫자 부분 추출 ("759" → 759, "300년" → 300, "5+" → 5)
  const numMatch = item.value.match(/^(\d+)/)
  const numPart = numMatch ? parseInt(numMatch[1]) : 0
  const suffix = item.value.replace(/^\d+/, '') // "년", "+", "" 등

  const count = useCountUp(numPart, 1400, active)
  const display = numPart > 0 ? `${count}${suffix}` : item.value

  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <h3 style={{
        fontFamily: "'Playfair Display', 'Noto Serif KR', serif",
        fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
        fontWeight: 700,
        color: primary,
        lineHeight: 1,
        marginBottom: 8,
      }}>
        {item.prefix}{display}
      </h3>
      <p style={{ fontSize: '.78rem', color: '#6B6560', fontWeight: 500, lineHeight: 1.4 }}>
        {item.label}
      </p>
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

  const primary = temple.primaryColor ?? '#2C5F2D'

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
    <div
      ref={ref}
      style={{
        background: '#FDFBF7',
        borderBottom: '1px solid #D4CEC4',
        padding: '40px 24px',
      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
        gap: 24,
      }}>
        {stats.map((item, i) => (
          <StatItemComponent key={i} item={item} primary={primary} active={active} />
        ))}
      </div>
    </div>
  )
}
