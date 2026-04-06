// BlockCatalog H-08 촛불법당형 표준 스펙 upsert
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  const result = await db.blockCatalog.upsert({
    where: { blockId: 'h08-candle-hall-standard' },
    update: {
      blockType:    'TempleH08CandleHero',
      blockVersion: '1.0.0',
      blockLabel:   'H-08 촛불법당형 히어로 (표준)',
      previewPath:  '/block-preview/H-08',
      status:       'published',
      siteId:       null,
      defaultProps: {
        bgColor:         '#070201',
        candleCount:     7,
        buddhaType:      'vairocana',
        templeName:      '사찰명',
        templeNameHanja: '漢字名',
        badge:           '● 천년의 고요 속에서 부처님을 만나다',
        taglines:        ['촛불 한 자루에 담긴 천 년의 기도', '법당 안에서 마음을 내려놓으세요', '부처님의 자비광명이 함께합니다'],
        ctaPrimary:   { text: '기도 동참하기', href: '#offering' },
        ctaSecondary: { text: '오시는 길',     href: '#location' },
      },
      adminSchema: {
        templeName:      { type: 'text',   label: '사찰명 한글',  maxLength: 20 },
        templeNameHanja: { type: 'text',   label: '사찰명 한자',  maxLength: 20 },
        badge:           { type: 'text',   label: '배지 문구',    maxLength: 60 },
        taglines:        { type: 'textarea', label: '설명 3줄 (줄바꿈 구분)', maxLength: 200 },
        ctaPrimary:      { type: 'cta',    label: '주요 버튼' },
        ctaSecondary:    { type: 'cta',    label: '보조 버튼' },
        candleCount:     { type: 'range',  label: '촛불 수', min: 4, max: 12, step: 1 },
        bgColor:         { type: 'color',  label: '배경 기본 색' },
        buddhaType:      { type: 'select', label: '주불 타입', options: ['vairocana'] },
      },
      seo: {
        ogImage:       '/images/og-h08-candle.jpg',
        ogTitle:       'H-08 촛불법당형 히어로',
        ogDescription: '법당 기둥과 촛불 flicker, 중앙 주불 SVG가 어우러지는 프리미엄 히어로 블록.',
      },
      meta: {
        description: '법당 기둥 6개+촛불 flicker+중앙 주불 SVG. 보림사 구현 검증 완료. 사찰별 주불 교체 가능.',
        tags:        ['촛불', '법당', '주불', '플리커', '장엄', '프리미엄', '보림사검증'],
        createdAt:   '2026-04-06T00:00:00Z',
        createdBy:   'admin',
        updatedAt:   new Date().toISOString(),
      },
    },
    create: {
      blockId:      'h08-candle-hall-standard',
      blockType:    'TempleH08CandleHero',
      blockVersion: '1.0.0',
      blockLabel:   'H-08 촛불법당형 히어로 (표준)',
      previewPath:  '/block-preview/H-08',
      status:       'published',
      siteId:       null,
      defaultProps: {
        bgColor:         '#070201',
        candleCount:     7,
        buddhaType:      'vairocana',
        templeName:      '사찰명',
        templeNameHanja: '漢字名',
        badge:           '● 천년의 고요 속에서 부처님을 만나다',
        taglines:        ['촛불 한 자루에 담긴 천 년의 기도', '법당 안에서 마음을 내려놓으세요', '부처님의 자비광명이 함께합니다'],
        ctaPrimary:   { text: '기도 동참하기', href: '#offering' },
        ctaSecondary: { text: '오시는 길',     href: '#location' },
      },
      adminSchema: {
        templeName:      { type: 'text',   label: '사찰명 한글',  maxLength: 20 },
        templeNameHanja: { type: 'text',   label: '사찰명 한자',  maxLength: 20 },
        badge:           { type: 'text',   label: '배지 문구',    maxLength: 60 },
        taglines:        { type: 'textarea', label: '설명 3줄 (줄바꿈 구분)', maxLength: 200 },
        ctaPrimary:      { type: 'cta',    label: '주요 버튼' },
        ctaSecondary:    { type: 'cta',    label: '보조 버튼' },
        candleCount:     { type: 'range',  label: '촛불 수', min: 4, max: 12, step: 1 },
        bgColor:         { type: 'color',  label: '배경 기본 색' },
        buddhaType:      { type: 'select', label: '주불 타입', options: ['vairocana'] },
      },
      seo: {
        ogImage:       '/images/og-h08-candle.jpg',
        ogTitle:       'H-08 촛불법당형 히어로',
        ogDescription: '법당 기둥과 촛불 flicker, 중앙 주불 SVG가 어우러지는 프리미엄 히어로 블록.',
      },
      meta: {
        description: '법당 기둥 6개+촛불 flicker+중앙 주불 SVG. 보림사 구현 검증 완료. 사찰별 주불 교체 가능.',
        tags:        ['촛불', '법당', '주불', '플리커', '장엄', '프리미엄', '보림사검증'],
        createdAt:   '2026-04-06T00:00:00Z',
        createdBy:   'admin',
        updatedAt:   new Date().toISOString(),
      },
    },
  })

  console.log('✅ H-08 BlockCatalog upsert 완료')
  console.log('  id:        ', result.id)
  console.log('  blockType: ', result.blockType)
  console.log('  blockLabel:', result.blockLabel)
  console.log('  tags:      ', (result.meta as Record<string, unknown>).tags)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => db.$disconnect())
