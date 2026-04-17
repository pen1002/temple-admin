-- 모델명: Temple
-- 분류: TYPE-3 (PUBLIC_READ)
-- 테이블명: Temple (Prisma 기본 매핑)
-- temple 컬럼: code (자기 자신)

ALTER TABLE "Temple" ENABLE ROW LEVEL SECURITY;

-- SELECT: 누구나 조회 가능 (공개 사찰 정보)
CREATE POLICY "temple_public_read" ON "Temple" FOR SELECT
  USING (true);

-- INSERT: super admin만
CREATE POLICY "temple_insert_super" ON "Temple" FOR INSERT
  WITH CHECK (current_setting('app.current_role', true) = 'super');

-- UPDATE: 해당 사찰 관리자 또는 super
CREATE POLICY "temple_update_admin" ON "Temple" FOR UPDATE
  USING (code = current_setting('app.current_temple_slug', true)
         OR current_setting('app.current_role', true) = 'super');

-- DELETE: super만
CREATE POLICY "temple_delete_super" ON "Temple" FOR DELETE
  USING (current_setting('app.current_role', true) = 'super');
