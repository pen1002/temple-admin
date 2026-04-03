/**
 * scripts/seed-block-catalog.ts
 * 실행: npx ts-node --project tsconfig.json -e "require('./scripts/seed-block-catalog.ts')"
 * 또는: npx tsx scripts/seed-block-catalog.ts
 *
 * BlockCatalog 테이블을 생성(없으면)하고 H-06 레코드를 Upsert합니다.
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const H06_RECORD = {
  blockId:      "h06-chunguansa-main",
  blockType:    "TempleH06Hero",
  blockVersion: "1.0.0",
  blockLabel:   "H-06 황금 연등 히어로",
  previewPath:  "/block-preview/H-06",
  status:       "published",
  siteId:       "chunguansa-official",

  defaultProps: {
    blockId:            "h06-chunguansa-main",
    denomination:       "대한불교조계종",
    templeName:         "천 관 사",
    subtitle:           "천년의 빛이 머무는 곳",
    description:        "마음의 등불을 밝혀 / 진리의 길을 걷습니다",
    ctaLabel:           "홈페이지 바로가기",
    ctaHref:            "/about",
    theme:              "gold",
    mobileLanternScale: 0.8,
  },

  adminSchema: {
    denomination:       { type: "text",     label: "종단명",        maxLength: 30  },
    templeName:         { type: "text",     label: "사찰명",        maxLength: 20  },
    subtitle:           { type: "text",     label: "부제",          maxLength: 40  },
    description:        { type: "textarea", label: "본문 설명",     maxLength: 100 },
    ctaLabel:           { type: "text",     label: "버튼 텍스트",   maxLength: 20  },
    ctaHref:            { type: "url",      label: "버튼 링크"                     },
    theme:              { type: "select",   label: "테마",          options: ["gold", "red"] },
    mobileLanternScale: { type: "range",    label: "모바일 연등 크기", min: 0.5, max: 1.0, step: 0.05 },
  },

  seo: {
    ogTitle:       "천관사 | 대한불교조계종",
    ogDescription: "천년의 빛이 머무는 곳, 천관사 공식 홈페이지입니다.",
    ogImage:       "/images/og-chunguansa.jpg",
  },

  meta: {
    createdAt:  "2026-04-03T00:00:00Z",
    updatedAt:  "2026-04-03T00:00:00Z",
    createdBy:  "admin",
    tags:       ["hero", "lamp", "temple", "gold-theme", "H-06"],
  },
}

async function main() {
  // BlockCatalog 테이블이 없으면 원시 SQL로 생성 (명령 분리)
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "BlockCatalog" (
      "id"           TEXT        NOT NULL,
      "blockId"      TEXT        NOT NULL,
      "blockType"    TEXT        NOT NULL,
      "blockVersion" TEXT        NOT NULL DEFAULT '1.0.0',
      "blockLabel"   TEXT        NOT NULL,
      "previewPath"  TEXT,
      "status"       TEXT        NOT NULL DEFAULT 'published',
      "siteId"       TEXT,
      "defaultProps" JSONB       NOT NULL DEFAULT '{}',
      "adminSchema"  JSONB       NOT NULL DEFAULT '{}',
      "seo"          JSONB       NOT NULL DEFAULT '{}',
      "meta"         JSONB       NOT NULL DEFAULT '{}',
      "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT "BlockCatalog_pkey" PRIMARY KEY ("id"),
      CONSTRAINT "BlockCatalog_blockId_key" UNIQUE ("blockId")
    )
  `)
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "BlockCatalog_blockType_idx" ON "BlockCatalog"("blockType")`)
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "BlockCatalog_siteId_idx"    ON "BlockCatalog"("siteId")`)
  console.log('✅ BlockCatalog 테이블 준비 완료')

  // Upsert
  const result = await (prisma as any).blockCatalog.upsert({
    where:  { blockId: H06_RECORD.blockId },
    create: {
      id: `bc_h06_${Date.now()}`,
      ...H06_RECORD,
    },
    update: {
      blockType:    H06_RECORD.blockType,
      blockVersion: H06_RECORD.blockVersion,
      blockLabel:   H06_RECORD.blockLabel,
      previewPath:  H06_RECORD.previewPath,
      status:       H06_RECORD.status,
      siteId:       H06_RECORD.siteId,
      defaultProps: H06_RECORD.defaultProps,
      adminSchema:  H06_RECORD.adminSchema,
      seo:          H06_RECORD.seo,
      meta:         { ...H06_RECORD.meta, updatedAt: new Date().toISOString() },
      updatedAt:    new Date(),
    },
  })

  console.log('✅ H-06 BlockCatalog Upsert 완료:', result.id, result.blockId)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
