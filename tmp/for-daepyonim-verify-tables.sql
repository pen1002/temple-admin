-- ============================================
-- 대표님께서 main DB SQL Editor에서 실행할 쿼리
-- ⚠️ rls-poc 브랜치 아님! main 브랜치에서 실행 ⚠️
-- 100% read-only, 데이터 변경 없음
-- ============================================

SELECT
  table_name,
  (SELECT count(*) FROM information_schema.columns
   WHERE table_schema = 'public' AND columns.table_name = t.table_name) AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
