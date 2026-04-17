-- 모델명: Believer
-- 분류: TYPE-1 (TENANT_STRICT)
-- 테이블명: believers (@@map)
-- temple 컬럼: temple_id (FK → Temple.id, nullable ⚠️)
-- TODO(W-1): temple_id NOT NULL 제약 추가 필요

ALTER TABLE believers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "believer_select_tenant" ON believers FOR SELECT
  USING (temple_id IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));

CREATE POLICY "believer_insert_tenant" ON believers FOR INSERT
  WITH CHECK (temple_id IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));

CREATE POLICY "believer_update_tenant" ON believers FOR UPDATE
  USING (temple_id IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));

CREATE POLICY "believer_delete_tenant" ON believers FOR DELETE
  USING (temple_id IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));
