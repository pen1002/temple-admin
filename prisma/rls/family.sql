-- 모델명: Family
-- 분류: TYPE-1 (TENANT_STRICT)
-- 테이블명: families (@@map)
-- temple 컬럼: temple_id (FK → Temple.id, nullable ⚠️)
-- TODO(W-1): temple_id NOT NULL 제약 추가 필요 (기존 null 레코드 정리 선행)

ALTER TABLE families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "family_select_tenant" ON families FOR SELECT
  USING (temple_id IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));

CREATE POLICY "family_insert_tenant" ON families FOR INSERT
  WITH CHECK (temple_id IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));

CREATE POLICY "family_update_tenant" ON families FOR UPDATE
  USING (temple_id IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));

CREATE POLICY "family_delete_tenant" ON families FOR DELETE
  USING (temple_id IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));
