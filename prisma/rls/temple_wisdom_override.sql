-- 모델명: TempleWisdomOverride
-- 분류: TYPE-2 (TENANT_NORMAL)
-- 테이블명: TempleWisdomOverride
-- temple 컬럼: templeId (FK → Temple.id)

ALTER TABLE "TempleWisdomOverride" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wisdom_override_select" ON "TempleWisdomOverride" FOR SELECT
  USING ("templeId" IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));

CREATE POLICY "wisdom_override_modify" ON "TempleWisdomOverride" FOR ALL
  USING ("templeId" IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ))
  WITH CHECK ("templeId" IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));
