import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getTempleName } from '@/lib/kv'
import { db } from '@/lib/db'
import BigButton from '@/components/BigButton'
import ThemePicker from './_components/ThemePicker'

export default async function AdminHome({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSession()
  if (!session || session.slug !== slug) redirect('/login')

  const [templeName, templeRow] = await Promise.all([
    getTempleName(slug),
    db.temple.findUnique({ where: { code: slug }, select: { pageTemplate: true } }),
  ])
  const currentTheme = templeRow?.pageTemplate ?? 'standard'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #2C1810 0%, #3a2015 40%, #FFF8E7 40%)' }}>
      {/* Header */}
      <div className="pt-10 pb-20 px-6 text-center">
        <p className="text-temple-gold text-lg mb-1">환영합니다</p>
        <h1 className="text-3xl font-bold text-white">{templeName}</h1>
        <p className="text-gray-300 text-base mt-1">관리자 페이지</p>
      </div>

      {/* Button Grid */}
      <div className="flex-1 bg-temple-cream rounded-t-3xl px-5 pt-6 pb-8 -mt-4">
        {/* ── 테마 선택기 ── */}
        <ThemePicker slug={slug} currentTheme={currentTheme} />
        <div className="border-t border-gray-200 mb-4" />
        <p className="text-gray-500 text-base mb-4 text-center">무엇을 업데이트할까요?</p>
        <div className="space-y-3">
          <BigButton
            icon="📢"
            label="공지사항 올리기"
            description="새 공지를 홈페이지에 올립니다"
            color="#F97316"
            href={`/admin/${slug}/notice`}
          />
          <BigButton
            icon="📅"
            label="행사 날짜 변경"
            description="행사 일정을 업데이트합니다"
            color="#3B82F6"
            href={`/admin/${slug}/event`}
          />
          <BigButton
            icon="🔔"
            label="법회 시간 변경"
            description="정기 법회 시간을 수정합니다"
            color="#8B5CF6"
            href={`/admin/${slug}/ritual`}
          />
          <BigButton
            icon="📖"
            label="오늘의 법문"
            description="이번 주 법문을 입력합니다"
            color="#10B981"
            href={`/admin/${slug}/dharma`}
          />
          <BigButton
            icon="📷"
            label="사진 올리기"
            description="경내 사진을 갤러리에 올립니다"
            color="#6B7280"
            href={`/admin/${slug}/photo`}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-temple-cream px-5 pb-6 text-center border-t border-gray-200">
        <p className="text-gray-500 text-base">
          문의: {process.env.NEXT_PUBLIC_ADMIN_PHONE || '010-XXXX-XXXX'}
        </p>
        <form action="/api/auth/logout" method="POST" className="mt-2">
          <button type="submit" className="text-gray-400 text-base underline">
            로그아웃
          </button>
        </form>
      </div>
    </div>
  )
}
