-- 모델명: BelieverHaenghyo
-- 분류: TYPE-1 (TENANT_STRICT)
-- 테이블명: believers_haenghyo (@@map)
-- temple 컬럼: 없음 — believer_id FK로 간접 연결
-- TODO(C-3): temple_id 직접 추가 권장

ALTER TABLE believers_haenghyo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "believer_haenghyo_select_tenant" ON believers_haenghyo FOR SELECT
  USING (believer_id IN (
    SELECT id FROM believers WHERE temple_id IN (
      SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
    )
  ));

CREATE POLICY "believer_haenghyo_modify_tenant" ON believers_haenghyo FOR ALL
  USING (believer_id IN (
    SELECT id FROM believers WHERE temple_id IN (
      SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
    )
  ));
