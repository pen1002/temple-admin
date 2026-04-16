'use client'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function CyberRedirect() {
  const { slug } = useParams<{ slug: string }>()
  useEffect(() => {
    window.location.replace(`/${slug}/dharma-wheel`)
  }, [slug])
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFEF5', color: '#888', fontFamily: 'system-ui, sans-serif' }}>
      🪷 온라인법당으로 이동 중...
    </div>
  )
}
