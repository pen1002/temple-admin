-- 모델명: IndungDonor
-- 분류: TYPE-1 (TENANT_STRICT)
-- 테이블명: indung_donors (@@map)
-- temple 컬럼: temple_slug (문자열, FK 아님)
-- TODO(C-1): temple_slug에 FK 추가 필요 — 참조무결성 미보장 상태

ALTER TABLE indung_donors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "indung_select_tenant" ON indung_donors FOR SELECT
  USING (temple_slug = current_setting('app.current_temple_slug', true));

CREATE POLICY "indung_insert_tenant" ON indung_donors FOR INSERT
  WITH CHECK (temple_slug = current_setting('app.current_temple_slug', true));

CREATE POLICY "indung_update_tenant" ON indung_donors FOR UPDATE
  USING (temple_slug = current_setting('app.current_temple_slug', true));

CREATE POLICY "indung_delete_tenant" ON indung_donors FOR DELETE
  USING (temple_slug = current_setting('app.current_temple_slug', true));
