// BlockCatalog H-05 표준 스펙 upsert
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  const result = await db.blockCatalog.upsert({
    where: { blockId: 'h05-lantern-hero-standard' },
    update: {
      blockType:    'TempleH05LanternHero',
      blockVersion: '1.0.0',
      blockLabel:   'H-05 연등 부유형 히어로 (표준)',
      previewPath:  '/block-preview/H-05',
      status:       'published',
      siteId:       null,
      defaultProps: {
        bgColor:         '#0a1020',
        lanternCount:    12,
        lanternColors:   ['#E53E3E', '#ED8936', '#C9A84C', '#C05621', '#9B2335'],
        templeName:      '사찰명',
        templeNameHanja: '漢字名',
        badge:           '● 사찰 소개 한 줄',
        taglines:        ['첫째 줄', '둘째 줄', '셋째 줄'],
        ctaPrimary:      { text: '주요 페이지 보기', href: '#heritage' },
        ctaSecondary:    { text: '안내 바로가기',    href: '#templestay' },
      },
      adminSchema: {
        templeName:      { type: 'text',     label: '사찰명 한글',  maxLength: 20 },
        templeNameHanja: { type: 'text',     label: '사찰명 한자',  maxLength: 20 },
        badge:           { type: 'text',     label: '배지 문구',    maxLength: 60 },
        taglines:        { type: 'textarea', label: '설명 3줄 (줄바꿈 구분)', maxLength: 200 },
        ctaPrimary:      { type: 'cta',      label: '주요 버튼' },
        ctaSecondary:    { type: 'cta',      label: '보조 버튼' },
        lanternCount:    { type: 'range',    label: '연등 수', min: 6, max: 20, step: 2 },
        bgColor:         { type: 'color',    label: '배경 최상단 색' },
      },
      seo: {
        ogImage:       '/images/og-h05-hero.jpg',
        ogTitle:       'H-05 연등 부유형 히어로',
        ogDescription: '연등 12개가 빛망울과 함께 흔들리며 부유하는 프리미엄 히어로 블록.',
      },
      meta: {
        description: '연등 12개가 빛망울과 함께 흔들리며 부유하는 프리미엄 히어로. 보림사 구현 검증 완료. 짙은 네이비 배경 + 금색 사찰명 + 5색 연등.',
        tags:        ['연등', '부유', '프리미엄', '보림사검증', '표준형', '네이비', '금빛'],
        createdAt:   '2026-04-06T00:00:00Z',
        createdBy:   'admin',
        updatedAt:   new Date().toISOString(),
      },
    },
    create: {
      blockId:      'h05-lantern-hero-standard',
      blockType:    'TempleH05LanternHero',
      blockVersion: '1.0.0',
      blockLabel:   'H-05 연등 부유형 히어로 (표준)',
      previewPath:  '/block-preview/H-05',
      status:       'published',
      siteId:       null,
      defaultProps: {
        bgColor:         '#0a1020',
        lanternCount:    12,
        lanternColors:   ['#E53E3E', '#ED8936', '#C9A84C', '#C05621', '#9B2335'],
        templeName:      '사찰명',
        templeNameHanja: '漢字名',
        badge:           '● 사찰 소개 한 줄',
        taglines:        ['첫째 줄', '둘째 줄', '셋째 줄'],
        ctaPrimary:      { text: '주요 페이지 보기', href: '#heritage' },
        ctaSecondary:    { text: '안내 바로가기',    href: '#templestay' },
      },
      adminSchema: {
        templeName:      { type: 'text',     label: '사찰명 한글',  maxLength: 20 },
        templeNameHanja: { type: 'text',     label: '사찰명 한자',  maxLength: 20 },
        badge:           { type: 'text',     label: '배지 문구',    maxLength: 60 },
        taglines:        { type: 'textarea', label: '설명 3줄 (줄바꿈 구분)', maxLength: 200 },
        ctaPrimary:      { type: 'cta',      label: '주요 버튼' },
        ctaSecondary:    { type: 'cta',      label: '보조 버튼' },
        lanternCount:    { type: 'range',    label: '연등 수', min: 6, max: 20, step: 2 },
        bgColor:         { type: 'color',    label: '배경 최상단 색' },
      },
      seo: {
        ogImage:       '/images/og-h05-hero.jpg',
        ogTitle:       'H-05 연등 부유형 히어로',
        ogDescription: '연등 12개가 빛망울과 함께 흔들리며 부유하는 프리미엄 히어로 블록.',
      },
      meta: {
        description: '연등 12개가 빛망울과 함께 흔들리며 부유하는 프리미엄 히어로. 보림사 구현 검증 완료. 짙은 네이비 배경 + 금색 사찰명 + 5색 연등.',
        tags:        ['연등', '부유', '프리미엄', '보림사검증', '표준형', '네이비', '금빛'],
        createdAt:   '2026-04-06T00:00:00Z',
        createdBy:   'admin',
        updatedAt:   new Date().toISOString(),
      },
    },
  })

  console.log('✅ H-05 BlockCatalog upsert 완료')
  console.log('  id:         ', result.id)
  console.log('  blockType:  ', result.blockType)
  console.log('  blockLabel: ', result.blockLabel)
  console.log('  tags:       ', (result.meta as Record<string, unknown>).tags)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => db.$disconnect())
