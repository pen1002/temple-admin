# Phase 1 세션 3C — 권한 매트릭스 + 세션 관리 전략

> 2026-04-18 오후 | feature/rls-poc

## 1. 3계층 권한 체계 현황 감사

### 인증 체크 방식 2가지 병존

| 방식 | 위치 | 보호 대상 | 메커니즘 |
|------|------|----------|----------|
| **미들웨어** | `middleware.ts` | `/admin/*`, `/super/*` | 쿠키 JWT 검증 (temple_session, super_session) |
| **인라인 체크** | 각 API route | `/api/cyber/members/*`, `/api/cyber/offering/*` | `checkTempleAuth()`, `requireTempleAuth()` |

### 인증 현황 분류 (36개 API route)

| 분류 | 수량 | 보호 방식 | 파일 |
|------|------|----------|------|
| 미들웨어 보호 | 9 | `middleware.ts` 쿠키 검증 | `admin/*`, `super/temples/*` |
| 인라인 보호 | 4 | `checkTempleAuth` / `requireTempleAuth` | `members/route`, `members/offerings`, `offering/route`, `super/cyber/temples` |
| 의도적 공개 | 10 | 인증 불필요 (공개 데이터) | `auth/*`, `health`, `temple-info`, `wisdom`, `mycard`, `temple/public` |
| **인증 부재 ⚠️** | 7 | 보호 없음 | `believers`, `sido`, `status`, `notice`, `indung`, `indung/sync`, `super/seed` |
| 디버그/시스템 | 6 | 프로덕션 차단 또는 무관 | `debug/*`, `env-check`, `sentry-test`, `revalidate` |

### 인증 부재 7건 상세

| API | Prisma 사용 | 위험도 | 비고 |
|-----|-----------|--------|------|
| `/api/cyber/believers` | ✅ | 🔴 | 신도 데이터 무인증 조회 가능 |
| `/api/cyber/sido` | ✅ | 🟡 | 기본값 fallback 있음 (세션 2A requireTempleAuth 미적용) |
| `/api/cyber/status` | ✅ | 🟡 | 통계 데이터만 (개인정보 없음) |
| `/api/cyber/notice` | ✅ | 🟢 | 공지사항 (공개 의도일 수 있음) |
| `/api/indung` | ✅ | 🟡 | 인등 접수 (공개 의도) |
| `/api/indung/sync` | ✅ | 🔴 | 동기화 API — 인증 필수 |
| `/api/super/seed` | ✅ | 🔴 | 시드 데이터 — super 인증 필수 |

## 2. 권한 매트릭스 (11 테이블 × 3 레이어)

### TYPE-1: TENANT_STRICT (8개)

| 테이블 | 공개(anon) | admin | super | withTempleContext | RLS 동작 |
|--------|-----------|-------|-------|-------------------|----------|
| **believers** SELECT | ❌ | ✅ 자기 사찰 | ✅ 전체 | ✅ admin / ❌ super | STRICT |
| **believers** INSERT | ✅ 접수 폼 | ✅ 자기 사찰 | ✅ | ✅ | STRICT |
| **believers** UPDATE | ❌ | ✅ 자기 사찰 | ✅ | ✅ admin | STRICT |
| **believers** DELETE | ❌ | ✅ 자기 사찰 | ✅ | ✅ admin | STRICT |
| **believers_family** * | ❌ | ✅ 자기 사찰 | ✅ | ✅ admin | STRICT (JOIN) |
| **believers_haenghyo** * | ❌ | ✅ 자기 사찰 | ✅ | ✅ admin | STRICT (JOIN) |
| **believers_youngga** * | ❌ | ✅ 자기 사찰 | ✅ | ✅ admin | STRICT (JOIN) |
| **believers_offerings** * | ❌ | ✅ 자기 사찰 | ✅ | ✅ admin | STRICT |
| **cyber_offerings** SELECT | ✅ 자기 접수 | ✅ 자기 사찰 | ✅ | ✅ | STRICT |
| **cyber_offerings** INSERT | ✅ 접수 | ✅ | ✅ | ✅ | STRICT |
| **families** * | ❌ | ✅ 자기 사찰 | ✅ | ✅ admin | STRICT |
| **indung_donors** SELECT | ✅ 목록 | ✅ | ✅ | ✅ | STRICT |
| **indung_donors** INSERT | ✅ 접수 | ✅ | ✅ | ✅ | STRICT |

### TYPE-2: TENANT_NORMAL (2개)

| 테이블 | 공개(anon) | admin | super | withTempleContext | RLS 동작 |
|--------|-----------|-------|-------|-------------------|----------|
| **BlockConfig** SELECT | ✅ 페이지 렌더 | ✅ | ✅ | ✅ | NORMAL |
| **BlockConfig** MODIFY | ❌ | ✅ 자기 사찰 | ✅ | ✅ admin | NORMAL |
| **TempleWisdomOverride** SELECT | ✅ | ✅ | ✅ | ✅ | NORMAL |
| **TempleWisdomOverride** MODIFY | ❌ | ✅ 자기 사찰 | ✅ | ✅ admin | NORMAL |

### TYPE-3: PUBLIC_READ (1개)

| 테이블 | 공개(anon) | admin | super | withTempleContext | RLS 동작 |
|--------|-----------|-------|-------|-------------------|----------|
| **Temple** SELECT | ✅ | ✅ | ✅ | ❌ 불필요 | PUBLIC_READ |
| **Temple** UPDATE | ❌ | ✅ 자기 사찰 | ✅ | ✅ admin | PUBLIC_READ |
| **Temple** INSERT | ❌ | ❌ | ✅ | ❌ super 전용 | super only |
| **Temple** DELETE | ❌ | ❌ | ✅ | ❌ super 전용 | super only |

## 3. 핵심 질문 Q1~Q3

### Q1. super admin은 RLS를 어떻게 우회하는가?

**답변**: `withTempleContext`를 호출하지 않고 기존 `prisma` 인스턴스를 직접 사용.

```typescript
if (auth.role === 'super') {
  // RLS bypass — postgres role의 BYPASSRLS=true 활용
  return prisma.believer.findMany()
} else {
  // RLS 적용 — 자기 사찰만
  return withTempleContext(auth.temple_slug, tx => tx.believer.findMany())
}
```

Phase 2에서 감사 로그 추가 예정 (super가 어떤 사찰 데이터를 조회했는지 기록).

### Q2. 공개 접근자가 자기가 등록한 데이터만 보려면?

**답변**: 현재 `mycard` 라우트가 이 패턴을 구현 — 성명 + 전화번호 뒤 4자리로 본인 확인.
RLS 추가 정책 불필요 — 앱 레벨 필터(`WHERE full_name = ? AND phone LIKE ?`)로 충분.
이유: 공개 접근자는 인증 없이 자기 이름으로만 조회하므로 RLS 컨텍스트 설정이 의미 없음.

### Q3. 사찰 admin이 다른 사찰 데이터에 실수로 접근하면?

**답변**: 3중 보호.
1. **JWT 검증** (`checkTempleAuth`): `temple_slug !== requestedSlug` → 403
2. **RLS 정책**: `set_config`에 설정된 slug 외 데이터는 DB가 차단
3. **withTempleContext 경고**: EXCLUDED_SLUGS 접근 시 `console.warn` + Phase 2 Sentry

## 4. 세션 관리 표준 3가지 타입

### 타입 1: anon (공개 접근자)

```
조건: JWT 없음
인증: requireTempleAuth(req, { allowPublic: true })
Prisma: withTempleContext(auth.templeSlug, ...)
접근: 공개 허용 리소스만 (INSERT 위주)
예: 연등 접수, 인등 신청, 나의기도동참 조회
```

### 타입 2: authenticated (사찰 관리자)

```
조건: JWT 유효 (role=admin, temple_slug=miraesa)
인증: checkTempleAuth(req, slug)
Prisma: withTempleContext(auth.temple_slug, ...)
접근: 자기 사찰 전체 (CRUD)
예: 종무소 신도카드, 기도접수
```

### 타입 3: super admin

```
조건: JWT 유효 (role=super)
인증: checkTempleAuth → role === 'super' 분기
Prisma: prisma 직접 사용 (RLS bypass)
접근: 전체 사찰 (감사 로그 Phase 2)
예: /super 대시보드, 말사관리
```

## 5. EXCLUDED_SLUGS 4중 보호 체계

| # | 보호 계층 | 상태 | 구현 위치 |
|---|----------|------|----------|
| 1 | CI 보호 | ✅ 구현됨 | `.github/workflows/ci.yml` |
| 2 | 코드 상수 | ✅ 구현됨 | `lib/constants/excluded-slugs.ts` |
| 3 | withTempleContext 경고 | ✅ 설계됨 (세션 4 구현) | `lib/db/with-temple-context.ts` |
| 4 | RLS 적용 | ⏳ Phase 2 | 미정 |

### 최종 권고: **옵션 A (Phase 1에서 RLS 미적용)**

근거:
- EXCLUDED_SLUGS 사찰은 별도 코드베이스(`munsusa-site`)에서 운영 중
- 이 프로젝트의 RLS는 `temple-admin` 관리 사찰(미래사, 일오암 등)에만 적용
- Phase 2에서 통합 시점에 B(RLS 예외 정책) 재검토

## 6. 세션 4 TODO (실제 구현 시 유의사항)

| # | 유의사항 | 설명 |
|---|---------|------|
| 1 | **super 분기 일관성** | 모든 API에서 `role === 'super'` 분기를 표준 패턴으로 통일 |
| 2 | **인증 부재 7건 중 believers, indung/sync, super/seed** | RLS 도입과 별개로 인라인 인증 추가 필요 (C-4 확장) |
| 3 | **트랜잭션 타임아웃** | `$transaction` 기본 5초 → 대량 데이터 쿼리 시 `{ timeout: 10000 }` 설정 검토 |
| 4 | **SSR 컴포넌트에서의 Prisma 호출** | `app/[slug]/page.tsx`는 서버 컴포넌트 → `withTempleContext` 적용 가능 여부 확인 |
| 5 | **BlockConfig/Temple SELECT** | 공개 페이지 렌더 시 RLS 컨텍스트 없이 조회해야 함 → 별도 공개 쿼리 경로 유지 |
