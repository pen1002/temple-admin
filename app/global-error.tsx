'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', background: '#1a0f08', color: '#F5E6B8' }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>오류가 발생했습니다</h2>
        <p style={{ fontSize: 14, color: '#c9a84c', marginBottom: 20 }}>자동으로 관리자에게 알림이 전송되었습니다</p>
        <button onClick={reset} style={{ padding: '12px 24px', background: '#c9a84c', color: '#1a0f08', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          다시 시도
        </button>
      </body>
    </html>
  )
}
