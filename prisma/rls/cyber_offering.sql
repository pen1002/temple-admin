-- 모델명: CyberOffering
-- 분류: TYPE-1 (TENANT_STRICT)
-- 테이블명: cyber_offerings (@@map)
-- temple 컬럼: temple_slug (문자열, FK 아님)
-- TODO(C-1): temple_slug에 FK 추가 필요

ALTER TABLE cyber_offerings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cyber_offering_select_tenant" ON cyber_offerings FOR SELECT
  USING (temple_slug = current_setting('app.current_temple_slug', true));

CREATE POLICY "cyber_offering_insert_tenant" ON cyber_offerings FOR INSERT
  WITH CHECK (temple_slug = current_setting('app.current_temple_slug', true));

CREATE POLICY "cyber_offering_update_tenant" ON cyber_offerings FOR UPDATE
  USING (temple_slug = current_setting('app.current_temple_slug', true));

CREATE POLICY "cyber_offering_delete_tenant" ON cyber_offerings FOR DELETE
  USING (temple_slug = current_setting('app.current_temple_slug', true));
