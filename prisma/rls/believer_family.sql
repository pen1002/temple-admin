-- 모델명: BelieverFamily
-- 분류: TYPE-1 (TENANT_STRICT)
-- 테이블명: believers_family (@@map)
-- temple 컬럼: 없음 — believer_id FK를 통해 Believer.temple_id로 간접 연결
-- TODO(C-3): temple_id 직접 추가 권장 (JOIN 비용 회피)
-- 현재 정책: Believer JOIN으로 격리

ALTER TABLE believers_family ENABLE ROW LEVEL SECURITY;

CREATE POLICY "believer_family_select_tenant" ON believers_family FOR SELECT
  USING (believer_id IN (
    SELECT id FROM believers WHERE temple_id IN (
      SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
    )
  ));

CREATE POLICY "believer_family_insert_tenant" ON believers_family FOR INSERT
  WITH CHECK (believer_id IN (
    SELECT id FROM believers WHERE temple_id IN (
      SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
    )
  ));

CREATE POLICY "believer_family_modify_tenant" ON believers_family FOR ALL
  USING (believer_id IN (
    SELECT id FROM believers WHERE temple_id IN (
      SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
    )
  ));
