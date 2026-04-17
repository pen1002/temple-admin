-- 모델명: BelieverOffering
-- 분류: TYPE-1 (TENANT_STRICT)
-- 테이블명: believers_offerings (@@map)
-- temple 컬럼: temple_id (문자열, FK 아님 ⚠️)
-- TODO(C-2): temple_id를 Temple FK로 변경 필요 — 현재 Prisma relation 미정의
-- 현재 정책: temple_id 문자열을 Temple.id 서브쿼리로 매칭

ALTER TABLE believers_offerings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "believer_offering_select_tenant" ON believers_offerings FOR SELECT
  USING (temple_id IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));

CREATE POLICY "believer_offering_insert_tenant" ON believers_offerings FOR INSERT
  WITH CHECK (temple_id IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));

CREATE POLICY "believer_offering_update_tenant" ON believers_offerings FOR UPDATE
  USING (temple_id IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));

CREATE POLICY "believer_offering_delete_tenant" ON believers_offerings FOR DELETE
  USING (temple_id IN (
    SELECT id FROM "Temple" WHERE code = current_setting('app.current_temple_slug', true)
  ));
