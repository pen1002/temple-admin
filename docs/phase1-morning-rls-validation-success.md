# Phase 1 오전 RLS 검증 성공 보고

> 2026-04-18 오전 | feature/rls-poc
> Supabase Preview Branch: rls-poc

## 검증 결과 요약

| 시나리오 | 쿼리 | 기대 | 실제 | 판정 |
|---------|------|------|------|------|
| postgres role 직접 조회 | `SELECT count(*) FROM believers` | 전체 (bypass) | 전체 반환 | ✅ 예상대로 |
| authenticated role 컨텍스트 없이 | `SET ROLE authenticated; SELECT count(*)` | 0건 | 0건 | ✅ 격리 동작 |
| authenticated + miraesa 컨텍스트 | `SET app.current_temple_slug='miraesa'; SELECT count(*)` | 미래사만 | 1건 (테스트 데이터) | ✅ 격리 성공 |

## Lesson 4: postgres role의 rolbypassrls=true

### 발견 내용
Supabase SQL Editor는 기본적으로 `postgres` role로 실행됨.
`postgres`는 `rolbypassrls=true` 속성을 가지므로 **RLS를 무시**함.

### 올바른 검증 방법
```sql
-- Step 1: RLS를 postgres에도 강제 적용 (테스트용)
ALTER TABLE believers FORCE ROW LEVEL SECURITY;

-- Step 2: authenticated role로 전환하여 시뮬레이션
SET ROLE authenticated;

-- Step 3: 컨텍스트 설정
SELECT set_config('app.current_temple_slug', 'miraesa', true);

-- Step 4: 격리 확인
SELECT count(*) FROM believers;  -- 미래사 데이터만 반환
```

### Phase 2 표준 적용 템플릿
```sql
-- 1. RLS 활성화 + FORCE
ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;
ALTER TABLE {table} FORCE ROW LEVEL SECURITY;

-- 2. 정책 생성
CREATE POLICY "{table}_select_tenant" ON {table} FOR SELECT
  USING ({temple_col} = current_setting('app.current_temple_slug', true));

CREATE POLICY "{table}_insert_tenant" ON {table} FOR INSERT
  WITH CHECK ({temple_col} = current_setting('app.current_temple_slug', true));

CREATE POLICY "{table}_update_tenant" ON {table} FOR UPDATE
  USING ({temple_col} = current_setting('app.current_temple_slug', true));

CREATE POLICY "{table}_delete_tenant" ON {table} FOR DELETE
  USING ({temple_col} = current_setting('app.current_temple_slug', true));
```

**핵심 변경**: 기존 `ENABLE ROW LEVEL SECURITY`만으로는 불충분.
`FORCE ROW LEVEL SECURITY`를 추가해야 테이블 소유자(postgres)에게도 적용됨.

## 적용 대상 11개 테이블

### TYPE-1 (TENANT_STRICT, 8개)
| 테이블 | temple 컬럼 | 연결 방식 |
|--------|-----------|----------|
| believers | temple_id | FK → Temple.id (서브쿼리) |
| believers_family | — | believer_id JOIN (서브쿼리 2단) |
| believers_haenghyo | — | believer_id JOIN (서브쿼리 2단) |
| believers_youngga | — | believer_id JOIN (서브쿼리 2단) |
| believers_offerings | temple_id | 문자열 (서브쿼리) |
| cyber_offerings | temple_slug | 직접 비교 |
| families | temple_id | FK → Temple.id (서브쿼리) |
| indung_donors | temple_slug | 직접 비교 |

### TYPE-2 (TENANT_NORMAL, 2개)
| 테이블 | temple 컬럼 |
|--------|-----------|
| BlockConfig | templeId (FK) |
| TempleWisdomOverride | templeId (FK) |

### TYPE-3 (PUBLIC_READ, 1개)
| 테이블 | 정책 |
|--------|------|
| Temple | SELECT 공개, UPDATE/DELETE 관리자만 |

### 적용 제외 3개 (TYPE-4 GLOBAL)
- BlockCatalog, DailyWisdom, DharmaQuote

## 검증 체크리스트 (Phase 2 적용 시)

- [ ] main DB 백업 완료 (PITR 스냅샷)
- [ ] Preview Branch에서 먼저 전체 적용 테스트
- [ ] SET ROLE authenticated 시뮬레이션으로 검증
- [ ] 각 사찰별 교차 조회 차단 확인
- [ ] 실제 앱 배포 후 Sentry 모니터링 24시간

## 오늘 오전 커밋 이력
- a8fb74d: 실제 DB 테이블 전수 대조 완료
- dc89bd9: 선결 2+3 준비 (테이블 매핑 + migration 옵션)
- 본 문서: RLS 검증 성공 + Lesson 4

## 오후·저녁 계획
- 세션 3: 인증 플로우 설계 (JWT claim + 미들웨어)
- 세션 4: Prisma 리팩터 (withTempleAuth 헬퍼)
- 각 세션에서 rls-poc Preview Branch 활용
