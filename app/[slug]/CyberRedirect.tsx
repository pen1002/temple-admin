'use client'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function CyberRedirect() {
  const { slug } = useParams<{ slug: string }>()
  useEffect(() => {
    // 세션에서 이미 법륜 돌린 적 있으면 그리드로, 아니면 법륜 애니메이션
    const done = sessionStorage.getItem(`dw_${slug}_done`) === '1'
    window.location.replace(`/${slug}/dharma-wheel${done ? '?grid=1' : ''}`)
  }, [slug])
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFEF5', color: '#888', fontFamily: 'system-ui, sans-serif' }}>
      🪷 온라인법당으로 이동 중...
    </div>
  )
}
