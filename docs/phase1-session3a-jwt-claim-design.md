# Phase 1 세션 3A — JWT claim 설계

> 2026-04-18 오후 | feature/rls-poc

## 1. 현재 인증 플로우 감사 결과

### 핵심 발견: Supabase Auth 미사용

미래사는 **Supabase Auth를 사용하지 않는다.** 자체 JWT 체계로 운영 중.

| 영역 | 방식 | 파일 |
|------|------|------|
| 사이버사찰 관리자 | PIN → 자체 JWT (`jose`) → `temple_auth` 쿠키 | `lib/auth/templeAuth.ts` |
| 사찰 관리자 (오프라인) | PIN → 자체 JWT → `temple_session` 쿠키 | `lib/auth.ts` |
| 슈퍼 관리자 | PIN (108108) → 자체 JWT → `super_session` 쿠키 | `lib/superAuth.ts` |
| 공개 페이지 (공양접수) | 인증 없음 | — |

### 인증 체계 3계층

```
계층 1: 슈퍼 (PIN 108108)
  → 쿠키: temple_auth (role=super, temple_slug, temple_id)
  → 모든 사찰 접근 허용

계층 2: 사찰 관리자 (사찰별 admin_pin)
  → 쿠키: temple_auth (role=admin, temple_slug, temple_id)
  → 자기 사찰만 접근

계층 3: 공개 (미인증)
  → 공양 접수, 법륜바퀴 등 공개 페이지
  → API에 temple_slug를 직접 전달
```

### JWT 페이로드 (현재)

```typescript
interface TempleAuthPayload {
  role: 'super' | 'admin'
  temple_slug: string  // ← 이미 포함!
  temple_id: string    // ← 이미 포함!
}
```

**결론: JWT에 temple_slug가 이미 들어있다. Supabase Auth custom claim 논의는 불필요.**

## 2. RLS 연동 설계 — Supabase Auth 대신 기존 JWT 활용

### 기존 Supabase Auth 옵션 (A/B/C) 평가

| 옵션 | 적용 가능성 | 이유 |
|------|-----------|------|
| A: user_metadata | ❌ | Supabase Auth 자체를 안 씀 |
| B: app_metadata | ❌ | 동일 |
| C: Auth Hook | ❌ | 동일 |

**3가지 모두 해당 없음** — Supabase Auth를 도입하려면 전체 인증 체계 교체 필요 (Phase 2+ 범위).

### 실용적 대안: Prisma 쿼리 레벨 컨텍스트 주입

RLS를 Supabase Auth JWT와 연결하는 대신, **Prisma 쿼리 실행 전 `SET` 명령으로 컨텍스트 주입**.

```typescript
// lib/prisma-rls.ts (Phase 1 세션 3B에서 구현)
async function withTempleContext<T>(
  templeSlug: string,
  fn: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  // 트랜잭션 내에서 컨텍스트 설정 + 쿼리 실행
  return prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      `SELECT set_config('app.current_temple_slug', $1, true)`,
      templeSlug
    )
    return fn(tx as unknown as PrismaClient)
  })
}
```

### API 적용 예시

```typescript
// app/api/cyber/members/route.ts (변경 후)
export async function GET(req: NextRequest) {
  const auth = await checkTempleAuth(req, slug)
  if (auth instanceof NextResponse) return auth

  // RLS가 자동으로 필터링 — WHERE temple_id 조건 불필요
  const believers = await withTempleContext(auth.temple_slug, async (db) => {
    return db.believer.findMany({ orderBy: { created_at: 'desc' } })
  })
  return NextResponse.json(believers)
}
```

## 3. 사찰 판정 로직

### 인증된 요청 (관리자)

**판정 방식 1: JWT claim 기반** ← Phase 1 선택

```
PIN 입력 → /api/cyber/members/auth (POST)
  → temple_slug 검증 + JWT 발급 (temple_slug 포함)
    → 이후 API 호출 시 JWT에서 temple_slug 추출
      → withTempleContext(temple_slug, ...) 로 RLS 적용
```

장점: 기존 코드와 100% 호환. 변경 최소.
단점: 다중 사찰 관리 시 재로그인 필요.

### 공개 요청 (미인증)

**판정 방식: 서브도메인 + 요청 파라미터 기반**

```
miraesa.k-buddhism.kr/api/cyber/offering (POST)
  → body.temple_slug = 'miraesa'
    → requireTempleAuth() 검증 (세션 2A에서 구현 완료)
      → withTempleContext('miraesa', ...) 로 RLS 적용
```

공개 API는 temple_slug를 body/query에서 수신하므로 기존 흐름 유지.

### Phase 2 확장: 방식 3 (하이브리드)

```
계층 | Phase 1 (지금)           | Phase 2 (향후)
-----|-------------------------|---------------------------
관리자 | JWT claim의 temple_slug  | + 다중 사찰 membership 테이블
공개   | body/query의 temple_slug | + Supabase Auth anonymous
```

## 4. 세션 3B로 넘길 TODO 목록

| # | TODO | 복잡도 | 파일 |
|---|------|--------|------|
| 1 | `withTempleContext()` 헬퍼 함수 구현 | Low | `lib/prisma-rls.ts` (신규) |
| 2 | 인증된 API 5개에 `withTempleContext` 적용 | Medium | `app/api/cyber/members/`, `offering/`, etc. |
| 3 | 공개 API에 `withTempleContext` 적용 | Medium | `requireTempleAuth` 결과 연계 |
| 4 | super role bypass 처리 | Low | `withTempleContext` 내부 분기 |
| 5 | rls-poc Preview Branch에서 통합 테스트 | Medium | curl 시나리오 5개 |

**예상 구현 복잡도: Medium** (기존 인증 체계 변경 없이 래퍼 추가만)

## 5. 설계 결정 요약

| 항목 | 결정 | 근거 |
|------|------|------|
| Supabase Auth 도입 | ❌ 보류 (Phase 2+) | 전체 인증 교체 필요, 리스크 과대 |
| Custom claim 방식 | 해당 없음 | Supabase Auth 미사용 |
| RLS 컨텍스트 주입 | `$executeRaw` + `set_config` | Prisma $transaction 내 트랜잭션 로컬 |
| 사찰 판정 (관리자) | JWT의 `temple_slug` | 이미 구현됨, 변경 불필요 |
| 사찰 판정 (공개) | body/query의 `temple_slug` | `requireTempleAuth`로 검증 완료 |
| super bypass | `set_config` 생략 또는 전체 접근 role 설정 | Phase 1에서 구현 |
