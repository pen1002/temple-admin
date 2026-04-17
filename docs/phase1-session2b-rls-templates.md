# RLS 정책 템플릿 4가지

> 작성일: 2026-04-18 | 브랜치: feature/rls-poc

## 공통 컨텍스트 변수

모든 정책은 `app.current_temple_slug` 세션 변수를 기준으로 격리한다.
Prisma 쿼리 전에 `SET app.current_temple_slug = '{slug}'` 실행 필요.

```sql
-- 컨텍스트 설정 예시 (Prisma $executeRaw로 호출)
SELECT set_config('app.current_temple_slug', 'miraesa', true);
```

## TYPE-1: TENANT_STRICT (엄격 격리)

대상: 신도카드, 결제기록, 영가, 가족 등 개인정보 포함 테이블.

```sql
ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;

-- SELECT: 자기 사찰 데이터만
CREATE POLICY "{table}_select_tenant" ON {table} FOR SELECT
  USING ({temple_col} = current_setting('app.current_temple_slug', true));

-- INSERT: 자기 사찰 컨텍스트로만
CREATE POLICY "{table}_insert_tenant" ON {table} FOR INSERT
  WITH CHECK ({temple_col} = current_setting('app.current_temple_slug', true));

-- UPDATE: 자기 사찰 데이터만
CREATE POLICY "{table}_update_tenant" ON {table} FOR UPDATE
  USING ({temple_col} = current_setting('app.current_temple_slug', true));

-- DELETE: 자기 사찰 데이터만
CREATE POLICY "{table}_delete_tenant" ON {table} FOR DELETE
  USING ({temple_col} = current_setting('app.current_temple_slug', true));
```

## TYPE-2: TENANT_NORMAL (일반 격리)

대상: 블록 설정, 법문 오버라이드 등 관리용 데이터.

```sql
ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;

-- SELECT: 자기 사찰 + 공개 데이터
CREATE POLICY "{table}_select" ON {table} FOR SELECT
  USING ({temple_col} = current_setting('app.current_temple_slug', true));

-- INSERT/UPDATE/DELETE: 자기 사찰만
CREATE POLICY "{table}_modify" ON {table} FOR ALL
  USING ({temple_col} = current_setting('app.current_temple_slug', true))
  WITH CHECK ({temple_col} = current_setting('app.current_temple_slug', true));
```

## TYPE-3: PUBLIC_READ (공개 조회)

대상: Temple 기본 정보 등.

```sql
ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;

-- SELECT: 누구나 조회 가능
CREATE POLICY "{table}_public_read" ON {table} FOR SELECT
  USING (true);

-- INSERT/UPDATE/DELETE: 해당 사찰 관리자 또는 super만
CREATE POLICY "{table}_admin_modify" ON {table} FOR ALL
  USING ({temple_col} = current_setting('app.current_temple_slug', true)
         OR current_setting('app.current_role', true) = 'super')
  WITH CHECK ({temple_col} = current_setting('app.current_temple_slug', true)
              OR current_setting('app.current_role', true) = 'super');
```

## TYPE-4: GLOBAL (공통 데이터)

대상: 일별 법문, 달력, 블록 카탈로그 등.

```sql
-- RLS 미적용 또는 super admin only
-- 현재 단계에서는 RLS ENABLE하지 않음
-- Phase 3에서 super_admin 정책 추가 검토
```

## 모델별 분포

| 분류 | 모델 수 | 해당 모델 |
|------|---------|----------|
| TYPE-1 (STRICT) | 8 | IndungDonor, CyberOffering, Family, Believer, BelieverFamily, BelieverHaenghyo, BelieverYoungga, BelieverOffering |
| TYPE-2 (NORMAL) | 2 | BlockConfig, TempleWisdomOverride |
| TYPE-3 (PUBLIC_READ) | 1 | Temple |
| TYPE-4 (GLOBAL) | 3 | DharmaQuote, DailyWisdom, BlockCatalog |
