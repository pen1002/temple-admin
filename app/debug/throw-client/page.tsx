'use client'

// Client 에러 테스트 — Sentry 클라이언트 계층 포착 확인용
export default function ThrowClientPage() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h2>Sentry Client Error Test</h2>
      <button
        onClick={() => { throw new Error('[Sentry Test] Client error at ' + new Date().toISOString()) }}
        style={{ padding: '12px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16 }}
      >
        Throw Client Error
      </button>
    </div>
  )
}
