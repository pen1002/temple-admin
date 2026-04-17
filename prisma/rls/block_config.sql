-- 모델명: BlockConfig
-- 분류: TYPE-2 (TENANT_NORMAL)
-- 테이블명: BlockConfig (Prisma 기본)
-- temple 컬럼: templeId (FK → Temple.id)
-- NOTE: templeId는 cuid이므로 slug→id 변환 서브쿼리 필요

ALTER TABLE "BlockConfig" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "block_config_select" ON "BlockConfig" FOR SELECT
  USING ("templeId" IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));

CREATE POLICY "block_config_modify" ON "BlockConfig" FOR ALL
  USING ("templeId" IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ))
  WITH CHECK ("templeId" IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));
