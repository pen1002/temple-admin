'use client'

import Link from 'next/link'

interface AdminLayoutProps {
  slug: string
  templeName: string
  title: string
  children: React.ReactNode
  showBack?: boolean
}

export default function AdminLayout({ slug, templeName, title, children, showBack = true }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-temple-cream flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-10" style={{ background: 'linear-gradient(135deg, #2C1810, #4a2c1a)' }}>
        <div className="flex items-center px-4 py-3 gap-3">
          {showBack && (
            <Link
              href={`/admin/${slug}`}
              className="text-temple-gold text-3xl w-12 h-12 flex items-center justify-center flex-shrink-0"
            >
              ←
            </Link>
          )}
          <div className="flex-1 min-w-0">
            {templeName && (
              <p className="text-temple-gold text-base opacity-80 truncate">{templeName}</p>
            )}
            <h1 className="text-white font-bold text-xl leading-tight">{title}</h1>
          </div>
          <Link href={`/admin/${slug}`} className="text-temple-gold text-2xl flex-shrink-0">
            🏯
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-5">
        {children}
      </div>
    </div>
  )
}
