# Phase 1 세션 3B — withTempleContext 헬퍼 설계

> 2026-04-18 오후 | feature/rls-poc

## 1. 현재 Prisma 사용 패턴 조사 결과

### A) 클라이언트 구조: 싱글턴

```
lib/prisma.ts — new PrismaClient() (글로벌 캐시)
lib/db.ts — re-export: { prisma as db }
```

모든 API 라우트가 동일 인스턴스 사용. `withTempleContext`는 이 싱글턴을 그대로 활용.

### B) $transaction 사용 빈도: 0건

전체 코드베이스에서 `$transaction` 호출 0건.
`withTempleContext`가 첫 번째 트랜잭션 사용이 됨.

**영향**: 기존 코드에 트랜잭션 충돌 가능성 0. 도입 안전.

### C) RLS 관련 코드: 0건

`set_config`, `SET LOCAL`, `current_temple_slug` 검색 결과 0건.
완전히 새로 도입하는 계층.

## 2. withTempleContext 상세 설계

### 파일 경로 (세션 4에서 생성)

`lib/db/with-temple-context.ts`

### 프로토타입 코드

```typescript
import { prisma } from '@/lib/prisma'
import { Prisma, PrismaClient } from '@prisma/client'
import { EXCLUDED_SLUGS } from '@/lib/constants/excluded-slugs'

// Prisma interactive transaction client 타입
type TxClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

/**
 * 사찰 컨텍스트를 설정하고 RLS가 적용된 트랜잭션 내에서 쿼리 실행.
 *
 * @param templeSlug - 사찰 코드 (예: 'miraesa')
 * @param callback - 트랜잭션 클라이언트로 실행할 쿼리
 * @returns 콜백의 반환값
 *
 * @example
 * const believers = await withTempleContext('miraesa', async (tx) => {
 *   return tx.believer.findMany()  // RLS가 자동으로 필터링
 * })
 */
export async function withTempleContext<T>(
  templeSlug: string,
  callback: (tx: TxClient) => Promise<T>
): Promise<T> {
  // 요구사항 2: 입력 검증
  if (!templeSlug || typeof templeSlug !== 'string') {
    throw new Error('[withTempleContext] templeSlug is required')
  }

  // 요구사항 5: EXCLUDED_SLUGS 경고 (Phase 1 — 차단은 Phase 2)
  if ((EXCLUDED_SLUGS as readonly string[]).includes(templeSlug)) {
    console.warn(`[withTempleContext] ⚠️ EXCLUDED_SLUG access: ${templeSlug}`)
  }

  // 요구사항 1, 3, 4: 트랜잭션 내 파라미터 바인딩으로 안전 실행
  return prisma.$transaction(async (tx) => {
    // set_config 3번째 인자 true = 트랜잭션 로컬 (트랜잭션 종료 시 자동 해제)
    // Prisma.sql 태그드 템플릿으로 SQL injection 방지
    await tx.$executeRaw`
      SELECT set_config('app.current_temple_slug', ${templeSlug}, true)
    `
    return callback(tx)
  })
}

/**
 * super admin용 — 모든 사찰 데이터 접근 (RLS bypass).
 * set_config을 설정하지 않으므로 RLS 정책이 빈 문자열과 매칭 → 0건.
 * 대신 postgres role의 BYPASSRLS 속성을 활용.
 *
 * Phase 1에서는 super 호출 시 withTempleContext를 사용하지 않고
 * 기존 prisma 인스턴스를 직접 사용 (RLS bypass).
 */
// super admin은 기존 prisma 직접 사용 → 별도 헬퍼 불필요
```

### 요구사항 충족 매트릭스

| # | 요구사항 | 충족 | 방법 |
|---|---------|------|------|
| 1 | 타입 안전성 | ✅ | 제네릭 `<T>` + `TxClient` 타입 |
| 2 | 에러 처리 | ✅ | 빈 slug 거부, 콜백 에러 전파 (자동 롤백) |
| 3 | 성능 | ✅ | `set_config` 1회, 트랜잭션 로컬 (오버헤드 최소) |
| 4 | 보안 | ✅ | `Prisma.sql` 태그드 템플릿 (파라미터 바인딩) |
| 5 | EXCLUDED_SLUGS | ✅ | Phase 1: `console.warn`, Phase 2: throw |

### super admin 처리

```
관리자 (role=admin):
  → withTempleContext(auth.temple_slug, ...) 사용
  → RLS가 해당 사찰 데이터만 반환

슈퍼 (role=super):
  → 기존 prisma 직접 사용 (withTempleContext 미사용)
  → Supabase postgres role은 BYPASSRLS=true
  → 전체 사찰 데이터 접근 가능
```

## 3. Before/After 사용 예시

### 예시 1: offering/route.ts GET

**Before** (현재 — 앱 레벨 필터링):
```typescript
export async function GET(req: NextRequest) {
  const auth = await requireTempleAuth(req, { allowPublic: true })
  if (auth instanceof NextResponse) return auth

  const rows = await prisma.cyberOffering.findMany({
    where: { temple_slug: auth.templeSlug, type },  // 앱에서 필터
    orderBy: { created_at: 'desc' },
  })
  return NextResponse.json(rows)
}
```

**After** (RLS — DB 레벨 필터링):
```typescript
export async function GET(req: NextRequest) {
  const auth = await requireTempleAuth(req, { allowPublic: true })
  if (auth instanceof NextResponse) return auth

  const rows = await withTempleContext(auth.templeSlug, async (tx) => {
    return tx.cyberOffering.findMany({
      // where: { temple_slug: ... } 제거! RLS가 자동 필터링
      orderBy: { created_at: 'desc' },
    })
  })
  return NextResponse.json(rows)
}
```

### 예시 2: members/route.ts GET (인증된 관리자)

**Before**:
```typescript
const auth = await checkTempleAuth(req, slug)
if (auth instanceof NextResponse) return auth

const believers = await prisma.believer.findMany({
  where: { temple_id: temple.id },  // 앱에서 필터
})
```

**After**:
```typescript
const auth = await checkTempleAuth(req, slug)
if (auth instanceof NextResponse) return auth

if (auth.role === 'super') {
  // super: RLS bypass — 기존 prisma 직접 사용
  const believers = await prisma.believer.findMany()
} else {
  // admin: RLS 적용
  const believers = await withTempleContext(auth.temple_slug, async (tx) => {
    return tx.believer.findMany()  // where 불필요
  })
}
```

### Before/After 차이점 3가지

| # | Before | After |
|---|--------|-------|
| 1 | `where: { temple_slug }` 필수 — 누락 시 전체 노출 | `where` 불필요 — DB가 자동 필터링 |
| 2 | 앱 코드 버그로 데이터 유출 가능 | DB 레벨 보호 — 코드 버그 무관 |
| 3 | 모든 쿼리에 필터 조건 반복 | `withTempleContext` 한 번 감싸면 내부 모든 쿼리 자동 적용 |

## 4. 트랜잭션 + Transaction Pooler 호환성

### 주의사항

현재 DATABASE_URL은 Transaction Pooler (port 6543) 사용.
PgBouncer Transaction Mode에서:
- `SET` 명령은 트랜잭션 내에서만 유효 (트랜잭션 종료 시 연결 반환)
- `set_config(..., true)`의 3번째 인자 `true` = 트랜잭션 로컬

→ `withTempleContext`가 `$transaction` 내에서 `set_config`을 호출하므로 **PgBouncer Transaction Mode와 완벽 호환**.

### 검증 포인트 (세션 4)

```sql
-- rls-poc Preview Branch에서 테스트:
BEGIN;
  SELECT set_config('app.current_temple_slug', 'miraesa', true);
  SELECT current_setting('app.current_temple_slug', true);  -- 'miraesa'
COMMIT;
SELECT current_setting('app.current_temple_slug', true);  -- '' (트랜잭션 종료 후 해제)
```

## 5. TODO — 세션 3C (권한 매트릭스)

| # | TODO | 설명 |
|---|------|------|
| 1 | API별 권한 매트릭스 작성 | 어떤 API가 public/admin/super인지 정리 |
| 2 | withTempleContext vs 기존 prisma 사용 기준 | role별 분기 표준화 |
| 3 | EXCLUDED_SLUGS 차단 정책 상세 설계 | Phase 2 차단 조건 |

## 6. TODO — 세션 4 (실제 구현 + 테스트)

| # | TODO | 예상 복잡도 |
|---|------|-----------|
| 1 | `lib/db/with-temple-context.ts` 파일 생성 | Low |
| 2 | `offering/route.ts` 적용 (첫 번째 대상) | Low |
| 3 | `members/route.ts` 적용 (super 분기 포함) | Medium |
| 4 | `sido/route.ts`, `status/route.ts`, `mycard/route.ts` 적용 | Medium |
| 5 | rls-poc Preview Branch에서 통합 테스트 (curl 5개 시나리오) | Medium |
| 6 | Sentry 모니터링 | Low |

**전체 예상 구현 복잡도: Medium** (약 60~90분)
