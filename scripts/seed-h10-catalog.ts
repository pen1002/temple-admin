// BlockCatalog H-10 연등행렬형 표준 스펙 upsert
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  const result = await db.blockCatalog.upsert({
    where: { blockId: 'h10-lantern-parade-standard' },
    update: {
      blockType:    'TempleH10LanternParade',
      blockVersion: '1.0.0',
      blockLabel:   'H-10 연등행렬형 히어로 (표준)',
      previewPath:  '/block-preview/H-10',
      status:       'published',
      siteId:       null,
      defaultProps: {
        mainTitle:    '부처님 오신 날',
        subtitle:     '연등행렬 · 불기 2569년',
        lanternCount: 35,
        glowIntensity: 3,
      },
      adminSchema: {
        mainTitle:     { type: 'text',  label: '메인 타이틀',   maxLength: 30 },
        subtitle:      { type: 'text',  label: '서브타이틀',    maxLength: 60 },
        lanternCount:  { type: 'range', label: '연등 수',       min: 15, max: 60, step: 5 },
        glowIntensity: { type: 'range', label: '발광 강도',     min: 1,  max: 5,  step: 0.5 },
      },
      seo: {
        ogImage:       '/images/og-h10-parade.jpg',
        ogTitle:       'H-10 연등행렬형 히어로',
        ogDescription: '부처님오신날 도심 연등행렬 군중과 9색 연등이 어우러지는 축제 히어로 블록.',
      },
      meta: {
        description: '야경 빌딩+도로+전깃줄 3열 연등+원근감 5열 군중(걷기 애니). 보림사 구현 검증 완료.',
        tags:        ['연등행렬', '부처님오신날', '축제', '도심', '군중', '종로', '화려'],
        createdAt:   '2026-04-06T00:00:00Z',
        createdBy:   'admin',
        updatedAt:   new Date().toISOString(),
      },
    },
    create: {
      blockId:      'h10-lantern-parade-standard',
      blockType:    'TempleH10LanternParade',
      blockVersion: '1.0.0',
      blockLabel:   'H-10 연등행렬형 히어로 (표준)',
      previewPath:  '/block-preview/H-10',
      status:       'published',
      siteId:       null,
      defaultProps: {
        mainTitle:    '부처님 오신 날',
        subtitle:     '연등행렬 · 불기 2569년',
        lanternCount: 35,
        glowIntensity: 3,
      },
      adminSchema: {
        mainTitle:     { type: 'text',  label: '메인 타이틀',   maxLength: 30 },
        subtitle:      { type: 'text',  label: '서브타이틀',    maxLength: 60 },
        lanternCount:  { type: 'range', label: '연등 수',       min: 15, max: 60, step: 5 },
        glowIntensity: { type: 'range', label: '발광 강도',     min: 1,  max: 5,  step: 0.5 },
      },
      seo: {
        ogImage:       '/images/og-h10-parade.jpg',
        ogTitle:       'H-10 연등행렬형 히어로',
        ogDescription: '부처님오신날 도심 연등행렬 군중과 9색 연등이 어우러지는 축제 히어로 블록.',
      },
      meta: {
        description: '야경 빌딩+도로+전깃줄 3열 연등+원근감 5열 군중(걷기 애니). 보림사 구현 검증 완료.',
        tags:        ['연등행렬', '부처님오신날', '축제', '도심', '군중', '종로', '화려'],
        createdAt:   '2026-04-06T00:00:00Z',
        createdBy:   'admin',
        updatedAt:   new Date().toISOString(),
      },
    },
  })

  console.log('✅ H-10 BlockCatalog upsert 완료')
  console.log('  id:        ', result.id)
  console.log('  blockType: ', result.blockType)
  console.log('  blockLabel:', result.blockLabel)
  console.log('  tags:      ', (result.meta as Record<string, unknown>).tags)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => db.$disconnect())
