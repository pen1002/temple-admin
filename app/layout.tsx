import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '사찰 관리자',
  description: '사찰 홈페이지 관리 시스템',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen bg-temple-cream">{children}</body>
    </html>
  )
}
