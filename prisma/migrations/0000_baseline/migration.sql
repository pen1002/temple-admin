-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Temple" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "description" TEXT,
    "logoUrl" TEXT,
    "heroImageUrl" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#8B2500',
    "secondaryColor" TEXT NOT NULL DEFAULT '#C5A572',
    "fontFamily" TEXT NOT NULL DEFAULT 'Pretendard',
    "customDomain" TEXT,
    "subdomain" TEXT,
    "denomination" TEXT,
    "foundedYear" INTEGER,
    "abbotName" TEXT,
    "tier" INTEGER NOT NULL DEFAULT 1,
    "themeType" TEXT NOT NULL DEFAULT 'theme-2',
    "themeColor" TEXT DEFAULT 'golden-lotus',
    "pageTemplate" TEXT NOT NULL DEFAULT 'standard',
    "pin" TEXT NOT NULL DEFAULT '0000',
    "admin_pin" TEXT NOT NULL DEFAULT '0000',
    "pin_changed" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "temple_type" TEXT NOT NULL DEFAULT 'offline',
    "temple_rank" TEXT NOT NULL DEFAULT 'malsa',
    "parent_temple_id" TEXT,
    "contact_monk" TEXT,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "kakao_notify_tel" TEXT,
    "bank_name" TEXT,
    "bank_account" TEXT,
    "bank_holder" TEXT,
    "contact_tel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Temple_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockConfig" (
    "id" TEXT NOT NULL,
    "templeId" TEXT NOT NULL,
    "blockType" TEXT NOT NULL,
    "label" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DharmaQuote" (
    "id" SERIAL NOT NULL,
    "dayIndex" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "source" TEXT,
    "category" TEXT,
    "isSpecial" BOOLEAN NOT NULL DEFAULT false,
    "specialDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DharmaQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyWisdom" (
    "id" TEXT NOT NULL,
    "monthDay" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "verse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyWisdom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TempleWisdomOverride" (
    "id" TEXT NOT NULL,
    "templeId" TEXT NOT NULL,
    "monthDay" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TempleWisdomOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockCatalog" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "blockType" TEXT NOT NULL,
    "blockVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "blockLabel" TEXT NOT NULL,
    "previewPath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'published',
    "siteId" TEXT,
    "defaultProps" JSONB NOT NULL DEFAULT '{}',
    "adminSchema" JSONB NOT NULL DEFAULT '{}',
    "seo" JSONB NOT NULL DEFAULT '{}',
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indung_donors" (
    "id" BIGSERIAL NOT NULL,
    "temple_slug" TEXT NOT NULL DEFAULT 'cheongwansa',
    "name" TEXT NOT NULL,
    "wish" TEXT,
    "amount" INTEGER NOT NULL DEFAULT 10000,
    "bank_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "lantern_count" INTEGER NOT NULL DEFAULT 1,
    "phase" INTEGER NOT NULL DEFAULT 1,
    "contact" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indung_donors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cyber_offerings" (
    "id" BIGSERIAL NOT NULL,
    "temple_slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL DEFAULT '',
    "deceased" TEXT,
    "relationship" TEXT,
    "prayer_kind" TEXT,
    "wish" TEXT,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "bank_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "vow_text" TEXT,
    "believer_offering_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cyber_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "families" (
    "id" TEXT NOT NULL,
    "temple_id" TEXT,
    "family_code" TEXT NOT NULL,
    "head_name" TEXT NOT NULL,
    "address" TEXT,
    "memo" TEXT,
    "sms_consent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "families_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "believers" (
    "id" TEXT NOT NULL,
    "temple_id" TEXT,
    "full_name" TEXT NOT NULL,
    "buddhist_name" TEXT,
    "gender" TEXT,
    "birth_date" DATE,
    "is_lunar" BOOLEAN NOT NULL DEFAULT true,
    "phone" TEXT,
    "address" TEXT,
    "families_id" TEXT,
    "family_id" TEXT,
    "family_relation" TEXT,
    "relation_type" TEXT NOT NULL DEFAULT 'self',
    "is_deceased" BOOLEAN NOT NULL DEFAULT false,
    "death_date" DATE,
    "ancestor_type" TEXT,
    "status" TEXT NOT NULL DEFAULT '활동',
    "initiation_date" DATE,
    "memo" TEXT,
    "extra_memo" TEXT,
    "prayer_tags" JSONB,
    "sms_consent" BOOLEAN NOT NULL DEFAULT false,
    "offering_total" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "gender_type" TEXT DEFAULT 'gonmyeong',
    "birth_year" TEXT,
    "birth_month" TEXT,
    "birth_day" TEXT,
    "address1" TEXT,
    "phone_land" TEXT,
    "chukwon_no" TEXT,

    CONSTRAINT "believers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "believers_family" (
    "id" TEXT NOT NULL,
    "believer_id" TEXT NOT NULL,
    "relation_type" TEXT NOT NULL,
    "gender_type" TEXT NOT NULL DEFAULT 'gonmyeong',
    "name" TEXT NOT NULL,
    "birth_year" TEXT,
    "birth_month" TEXT,
    "birth_day" TEXT,
    "is_lunar" BOOLEAN NOT NULL DEFAULT false,
    "birth_event" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "believers_family_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "believers_haenghyo" (
    "id" TEXT NOT NULL,
    "believer_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth_year" TEXT,
    "birth_month" TEXT,
    "birth_day" TEXT,
    "is_lunar" BOOLEAN NOT NULL DEFAULT false,
    "relation_type" TEXT NOT NULL DEFAULT '자',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "believers_haenghyo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "believers_youngga" (
    "id" TEXT NOT NULL,
    "believer_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birth_year" TEXT,
    "death_year" TEXT,
    "relation_type" TEXT,
    "memo" TEXT,
    "jesa_date" TEXT,
    "jesa_lunar" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "believers_youngga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "believers_offerings" (
    "id" TEXT NOT NULL,
    "believer_id" TEXT,
    "temple_id" TEXT NOT NULL,
    "offering_type" TEXT NOT NULL,
    "participant_name" TEXT NOT NULL,
    "vow_text" TEXT,
    "price" INTEGER,
    "period" TEXT,
    "cyber_offering_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "believers_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Temple_code_key" ON "Temple"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Temple_customDomain_key" ON "Temple"("customDomain");

-- CreateIndex
CREATE UNIQUE INDEX "Temple_subdomain_key" ON "Temple"("subdomain");

-- CreateIndex
CREATE INDEX "Temple_code_idx" ON "Temple"("code");

-- CreateIndex
CREATE INDEX "BlockConfig_templeId_order_idx" ON "BlockConfig"("templeId", "order");

-- CreateIndex
CREATE INDEX "BlockConfig_templeId_blockType_idx" ON "BlockConfig"("templeId", "blockType");

-- CreateIndex
CREATE UNIQUE INDEX "DharmaQuote_dayIndex_key" ON "DharmaQuote"("dayIndex");

-- CreateIndex
CREATE UNIQUE INDEX "DailyWisdom_monthDay_key" ON "DailyWisdom"("monthDay");

-- CreateIndex
CREATE UNIQUE INDEX "TempleWisdomOverride_templeId_monthDay_key" ON "TempleWisdomOverride"("templeId", "monthDay");

-- CreateIndex
CREATE UNIQUE INDEX "BlockCatalog_blockId_key" ON "BlockCatalog"("blockId");

-- CreateIndex
CREATE INDEX "BlockCatalog_blockType_idx" ON "BlockCatalog"("blockType");

-- CreateIndex
CREATE INDEX "BlockCatalog_siteId_idx" ON "BlockCatalog"("siteId");

-- CreateIndex
CREATE INDEX "cyber_offerings_temple_slug_type_created_at_idx" ON "cyber_offerings"("temple_slug", "type", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "families_family_code_key" ON "families"("family_code");

-- CreateIndex
CREATE INDEX "families_temple_id_idx" ON "families"("temple_id");

-- CreateIndex
CREATE INDEX "families_family_code_idx" ON "families"("family_code");

-- CreateIndex
CREATE INDEX "believers_full_name_idx" ON "believers"("full_name");

-- CreateIndex
CREATE INDEX "believers_phone_idx" ON "believers"("phone");

-- CreateIndex
CREATE INDEX "believers_temple_id_idx" ON "believers"("temple_id");

-- CreateIndex
CREATE INDEX "believers_family_id_idx" ON "believers"("family_id");

-- CreateIndex
CREATE INDEX "believers_families_id_idx" ON "believers"("families_id");

-- CreateIndex
CREATE INDEX "believers_family_believer_id_idx" ON "believers_family"("believer_id");

-- CreateIndex
CREATE INDEX "believers_haenghyo_believer_id_idx" ON "believers_haenghyo"("believer_id");

-- CreateIndex
CREATE INDEX "believers_youngga_believer_id_idx" ON "believers_youngga"("believer_id");

-- CreateIndex
CREATE INDEX "believers_offerings_offering_type_temple_id_status_idx" ON "believers_offerings"("offering_type", "temple_id", "status");

-- CreateIndex
CREATE INDEX "believers_offerings_believer_id_idx" ON "believers_offerings"("believer_id");

-- AddForeignKey
ALTER TABLE "BlockConfig" ADD CONSTRAINT "BlockConfig_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempleWisdomOverride" ADD CONSTRAINT "TempleWisdomOverride_templeId_fkey" FOREIGN KEY ("templeId") REFERENCES "Temple"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "families" ADD CONSTRAINT "families_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "Temple"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "believers" ADD CONSTRAINT "believers_temple_id_fkey" FOREIGN KEY ("temple_id") REFERENCES "Temple"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "believers" ADD CONSTRAINT "believers_families_id_fkey" FOREIGN KEY ("families_id") REFERENCES "families"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "believers_family" ADD CONSTRAINT "believers_family_believer_id_fkey" FOREIGN KEY ("believer_id") REFERENCES "believers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "believers_haenghyo" ADD CONSTRAINT "believers_haenghyo_believer_id_fkey" FOREIGN KEY ("believer_id") REFERENCES "believers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "believers_youngga" ADD CONSTRAINT "believers_youngga_believer_id_fkey" FOREIGN KEY ("believer_id") REFERENCES "believers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "believers_offerings" ADD CONSTRAINT "believers_offerings_believer_id_fkey" FOREIGN KEY ("believer_id") REFERENCES "believers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

