-- 모델명: BelieverYoungga
-- 분류: TYPE-1 (TENANT_STRICT)
-- 테이블명: believers_youngga (@@map)
-- temple 컬럼: 없음 — believer_id FK로 간접 연결
-- TODO(C-3): temple_id 직접 추가 권장

ALTER TABLE believers_youngga ENABLE ROW LEVEL SECURITY;

CREATE POLICY "believer_youngga_select_tenant" ON believers_youngga FOR SELECT
  USING (believer_id IN (
    SELECT id FROM believers WHERE temple_id IN (
      SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
    )
  ));

CREATE POLICY "believer_youngga_modify_tenant" ON believers_youngga FOR ALL
  USING (believer_id IN (
    SELECT id FROM believers WHERE temple_id IN (
      SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
    )
  ));
