import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { getNotices, getEventList, getRitualTimes, getDharma, getGallery } from '@/lib/kv'
import { getDailyWisdom } from '@/lib/getDailyWisdom'
import BlockRenderer from './_blocks/BlockRenderer'
import FooterBlock from './_blocks/FooterBlock'
import type { TempleData, TemplateContent } from './_blocks/types'

// ISR: 1분마다 재생성 (on-demand revalidation 병행)
export const revalidate = 60
// 정적 목록에 없는 slug도 요청 시 생성 허용
export const dynamicParams = true

// ── generateStaticParams: 전량 ISR on-demand ────────────────────────────────
// 1080개 규모에서 빌드 시 정적 생성 → Supabase 세션 풀 초과.
// 빈 배열 반환 + dynamicParams=true → 첫 요청 시 생성 후 revalidate=3600 캐시.
// 이것이 1000+ 사찰 규모의 올바른 아키텍처.
export async function generateStaticParams() {
  return []
}

// ── generateMetadata: SEO 최적화 ────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const temple = await db.temple.findUnique({
    where: { code: slug },
    select: { name: true, nameEn: true, description: true, heroImageUrl: true, address: true, denomination: true },
  })
  if (!temple) return { title: '사찰을 찾을 수 없습니다' }

  const desc = temple.description
    ?? `${temple.denomination ?? '불교'} ${temple.name} 공식 홈페이지입니다.${temple.address ? ` ${temple.address}` : ''}`

  return {
    title: `${temple.name} | 1080 사찰 자동화 대작불사`,
    description: desc,
    openGraph: {
      title: temple.name,
      description: desc,
      images: temple.heroImageUrl
        ? [{ url: temple.heroImageUrl, alt: temple.name }]
        : [],
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: temple.name,
      description: desc,
    },
  }
}

// ── 메인 페이지 ──────────────────────────────────────────────────────────────
export default async function TemplePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  // DB: 사찰 기본 정보 + 노출 블록 목록 (order 정렬, visible만)
  const temple = await db.temple.findUnique({
    where: { code: slug, isActive: true },
    select: {
      id: true, code: true, name: true, nameEn: true, description: true,
      address: true, phone: true, email: true, heroImageUrl: true, logoUrl: true,
      primaryColor: true, secondaryColor: true, denomination: true,
      abbotName: true, foundedYear: true, tier: true, isActive: true,
      pageTemplate: true, temple_type: true,
      blockConfigs: {
        where: { isVisible: true },
        orderBy: { order: 'asc' },
      },
    },
  })
  if (!temple) notFound()

  // 사이버사찰: 법륜바퀴를 첫 화면으로 즉시 이동 (블록 렌더링 스킵)
  if (temple.temple_type === 'cyber') {
    redirect(`/${slug}/dharma-wheel`)
  }

  // Redis: 동적 콘텐츠 (병렬 fetch)
  const [notices, eventList, ritualTimes, dharma, gallery, dailyWisdom] = await Promise.all([
    getNotices(slug),
    getEventList(slug),
    getRitualTimes(slug),
    getDharma(slug),
    getGallery(slug),
    getDailyWisdom(slug),
  ])

  const content: TemplateContent = { notices, eventList, ritualTimes, dharma, gallery }

  // Prisma 모델 → TempleData (직렬화 안전)
  const templeData: TempleData = {
    id:           temple.id,
    code:         temple.code,
    name:         temple.name,
    nameEn:       temple.nameEn,
    description:  temple.description,
    address:      temple.address,
    phone:        temple.phone,
    email:        temple.email,
    heroImageUrl: temple.heroImageUrl,
    logoUrl:      temple.logoUrl,
    primaryColor: temple.primaryColor,
    secondaryColor: temple.secondaryColor,
    denomination: temple.denomination,
    abbotName:    temple.abbotName,
    foundedYear:  temple.foundedYear,
    tier:         temple.tier,
  }

  // 블록이 없으면 기본 구성으로 폴백 (H-05, D-01, I-01, V-01)
  const blocks = (temple.blockConfigs.length > 0
    ? [...temple.blockConfigs].sort((a, b) => a.order - b.order)
    : [
        { id: 'default-hero',     blockType: 'H-05', order: 0, config: {}, isVisible: true },
        { id: 'default-dharma',   blockType: 'D-01', order: 1, config: {}, isVisible: true },
        { id: 'default-notice',   blockType: 'I-01', order: 2, config: {}, isVisible: true },
        { id: 'default-location', blockType: 'V-01', order: 3, config: {}, isVisible: true },
      ])

  return (
    <div data-theme={temple.pageTemplate} style={{ minHeight: '100vh' }}>
      {blocks.map(block => (
        <BlockRenderer
          key={block.id}
          blockType={block.blockType}
          config={(block.config ?? {}) as Record<string, unknown>}
          temple={templeData}
          content={content}
          dailyWisdom={dailyWisdom}
        />
      ))}
      {temple.code !== 'miraesa' && <FooterBlock temple={templeData} />}
    </div>
  )
}
