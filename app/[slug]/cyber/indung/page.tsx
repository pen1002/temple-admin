'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import L01IndungBlock from '../../_blocks/indung/L01IndungBlock'

export default function CyberIndungPage() {
  const { slug } = useParams<{ slug: string }>()
  const [tab, setTab] = useState<'indung' | 'yeondeung'>('indung')

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '12px 0', fontSize: 14, fontWeight: active ? 700 : 400, cursor: 'pointer',
    background: active ? 'rgba(224,96,64,0.15)' : 'transparent',
    color: active ? '#e06040' : 'rgba(224,96,64,0.4)',
    border: 'none', borderBottom: active ? '2px solid #e06040' : '2px solid transparent',
  })

  return (
    <div style={{ padding: '20px 0 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: 20, padding: '0 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🏮</div>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#e06040', letterSpacing: 3, fontFamily: '"Noto Serif KR",serif' }}>인등 · 연등</h2>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', maxWidth: 400, margin: '0 auto 20px', borderBottom: '1px solid rgba(224,96,64,0.1)' }}>
        <button onClick={() => setTab('indung')} style={tabStyle(tab === 'indung')}>🕯 인등 (상시)</button>
        <button onClick={() => setTab('yeondeung')} style={tabStyle(tab === 'yeondeung')}>🏮 연등 (초파일)</button>
      </div>

      <L01IndungBlock
        config={{
          templeSlug: slug,
          templeName: tab === 'indung' ? '인등불사' : '연등공양',
          currentPhase: 1,
        }}
      />
    </div>
  )
}
