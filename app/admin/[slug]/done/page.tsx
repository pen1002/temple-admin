'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import DoneScreen from '@/components/DoneScreen'

const typeMessages: Record<string, string> = {
  notice: '공지사항이 올라갔습니다! 🙏',
  event: '행사 날짜가 변경되었습니다! 📅',
  ritual: '법회 시간이 변경되었습니다! 🔔',
  dharma: '오늘의 법문이 올라갔습니다! 📖',
  photo: '사진이 올라갔습니다! 📷',
}

function DoneContent({ slug }: { slug: string }) {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'notice'
  const message = typeMessages[type] || '반영 완료!'

  const handleUndo = async () => {
    const res = await fetch('/api/admin/undo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    if (!res.ok) throw new Error('취소 실패')
  }

  return (
    <DoneScreen
      slug={slug}
      message={message}
      onUndo={handleUndo}
    />
  )
}

export default function DonePage({ params }: { params: { slug: string } }) {
  const { slug } = params
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-temple-brown flex items-center justify-center">
        <p className="text-white text-xl">잠시만 기다려주세요...</p>
      </div>
    }>
      <DoneContent slug={slug} />
    </Suspense>
  )
}
