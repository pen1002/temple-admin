# Phase 1 세션 1 — 스키마 인벤토리 및 현황 진단

> 작성일: 2026-04-18
> 브랜치: feature/rls-poc
> 작성자: 도편수 (Claude Code)

## Step 1: 전체 모델 인벤토리

| # | 모델명 | templeSlug 필드 | 연결 방식 | 격리 필요도 | 분류 |
|---|--------|----------------|----------|-----------|------|
| 1 | Temple | (자기 자신) | — | — | PUBLIC_READ |
| 2 | BlockConfig | `templeId` | FK → Temple.id | ★★★ | TENANT_NORMAL |
| 3 | DharmaQuote | 없음 | 없음 | — | GLOBAL |
| 4 | DailyWisdom | 없음 | 없음 | — | GLOBAL |
| 5 | TempleWisdomOverride | `templeId` | FK → Temple.id | ★★ | TENANT_NORMAL |
| 6 | BlockCatalog | `siteId` (nullable) | 간접 참조 | ★ | GLOBAL |
| 7 | IndungDonor | `temple_slug` | slug 문자열 | ★★★★ | TENANT_STRICT |
| 8 | CyberOffering | `temple_slug` | slug 문자열 | ★★★★★ | TENANT_STRICT |
| 9 | Family | `temple_id` | FK → Temple.id (nullable) | ★★★★★ | TENANT_STRICT |
| 10 | Believer | `temple_id` | FK → Temple.id (nullable) | ★★★★★ | TENANT_STRICT |
| 11 | BelieverFamily | 없음 (Believer 경유) | Believer.id 간접 | ★★★★★ | TENANT_STRICT |
| 12 | BelieverHaenghyo | 없음 (Believer 경유) | Believer.id 간접 | ★★★★★ | TENANT_STRICT |
| 13 | BelieverYoungga | 없음 (Believer 경유) | Believer.id 간접 | ★★★★★ | TENANT_STRICT |
| 14 | BelieverOffering | `temple_id` | 직접 FK 없음 (문자열) | ★★★★★ | TENANT_STRICT |

### 분류 요약

| 분류 | 모델 수 | 모델 목록 |
|------|---------|----------|
| TENANT_STRICT | 8 | IndungDonor, CyberOffering, Family, Believer, BelieverFamily, BelieverHaenghyo, BelieverYoungga, BelieverOffering |
| TENANT_NORMAL | 2 | BlockConfig, TempleWisdomOverride |
| PUBLIC_READ | 1 | Temple |
| GLOBAL | 3 | DharmaQuote, DailyWisdom, BlockCatalog |

## Step 2: 템플 연관 관계 매핑

```
Temple (id, code)
├── BlockConfig         → templeId FK (직접)
├── TempleWisdomOverride → templeId FK (직접)
├── Family              → temple_id FK (직접, nullable ⚠️)
├── Believer            → temple_id FK (직접, nullable ⚠️)
│   ├── BelieverFamily    → believer_id FK (간접 — Temple 연결 없음 ⚠️)
│   ├── BelieverHaenghyo  → believer_id FK (간접 — Temple 연결 없음 ⚠️)
│   ├── BelieverYoungga   → believer_id FK (간접 — Temple 연결 없음 ⚠️)
│   └── BelieverOffering  → temple_id 문자열 (FK 아님 ⚠️), believer_id FK
├── IndungDonor         → temple_slug 문자열 (FK 아님 ⚠️)
└── CyberOffering       → temple_slug 문자열 (FK 아님 ⚠️)
```

### 연결 방식 불일치 문제

| 패턴 | 사용 모델 | 문제점 |
|------|----------|--------|
| `templeId` (cuid FK) | BlockConfig, TempleWisdomOverride | ✅ 정상 — Prisma relation 보호 |
| `temple_id` (cuid FK) | Family, Believer | ⚠️ nullable — 무소속 레코드 가능 |
| `temple_slug` (문자열) | IndungDonor, CyberOffering | ❌ FK 없음 — DB 레벨 참조무결성 없음 |
| `temple_id` (문자열, FK 아님) | BelieverOffering | ❌ FK 없음 — Prisma relation 미정의 |
| 없음 (부모 경유) | BelieverFamily/Haenghyo/Youngga | ⚠️ RLS 적용 시 JOIN 필요 |

## Step 3: 현재 쿼리 패턴 샘플 조사

### 1. app/api/cyber/members/route.ts
- **slug 획득**: query param `temple_slug` → `getTemple()` 헬퍼로 `temple.id` 조회
- **인증**: `checkTempleAuth(req, slug)` 호출 (JWT 기반)
- **위험**: PATCH/DELETE에서 `temple_slug` 미제공 시 테넌트 검증 건너뜀

### 2. app/api/cyber/offering/route.ts ⚠️ 위험
- **slug 획득**: POST에서 body의 `temple_slug` 직접 DB 저장, 존재 검증 없음
- **인증**: 없음
- **위험**: **인증 없이 임의 slug로 offering 생성 가능, 크로스 테넌트 데이터 노출**

### 3. app/api/cyber/status/route.ts
- **slug 획득**: query param `temple_slug` 직접 where절 사용
- **인증**: 없음
- **위험**: 인증 없이 모든 사찰 offering 통계 조회 가능 (데이터 누출)

### 4. app/api/cyber/mycard/route.ts
- **slug 획득**: query param → `findUnique(code)` 로 temple.id 확인
- **인증**: 없음 (의도적 — 신도 본인 조회용)
- **위험**: 공개 설계이므로 수용 가능. temple_id 스코프 정상

### 5. app/api/super/cyber/temples/route.ts
- **slug 획득**: N/A (전체 사찰 반환)
- **인증**: `checkSuper(req)` — JWT role=super 검증
- **위험**: 적절하게 보호됨

## Step 4: RLS 도입 전 선행 해결 필수 이슈

### 🔴 Critical (RLS 전에 반드시 해결)

| # | 이슈 | 영향 모델 | 해결 방안 |
|---|------|----------|----------|
| C-1 | `temple_slug` 문자열 필드에 FK 없음 | IndungDonor, CyberOffering | `temple_id` FK 추가 또는 RLS에서 slug 기반 정책 작성 |
| C-2 | `BelieverOffering.temple_id`가 FK 아닌 순수 문자열 | BelieverOffering | Prisma relation 추가 필요 |
| C-3 | BelieverFamily/Haenghyo/Youngga에 temple 필드 없음 | 3개 모델 | RLS 적용 시 Believer JOIN 필수 → 성능 고려 또는 `temple_id` 직접 추가 |
| C-4 | `offering/route.ts` 인증 완전 부재 | CyberOffering | `checkTempleAuth` 추가 필수 (RLS와 무관하게 즉시 필요) |

### 🟡 Warning (Phase 1 내 해결 권장)

| # | 이슈 | 영향 모델 | 해결 방안 |
|---|------|----------|----------|
| W-1 | Family.temple_id, Believer.temple_id nullable | Family, Believer | `NOT NULL` 제약 추가 (기존 null 레코드 정리 선행) |
| W-2 | `members/route.ts` PATCH/DELETE slug 검증 선택적 | Believer | `temple_slug` 필수 파라미터화 |
| W-3 | temple 연결 방식 혼재 (templeId vs temple_id vs temple_slug) | 전체 | 네이밍 표준화 (Phase 2에서) |

### 🟢 Info (Phase 2 이후)

| # | 이슈 | 비고 |
|---|------|------|
| I-1 | BlockCatalog.siteId는 temple 연결이 아닌 독립 식별자 | RLS 불필요 (GLOBAL) |
| I-2 | DharmaQuote/DailyWisdom은 전체 공유 | RLS 불필요 (GLOBAL) |

## 다음 세션 권장 사항

1. **세션 2**: C-4 (offering 인증 부재) 긴급 수정 — RLS 전에 API 레벨에서 즉시 보호
2. **세션 3**: C-1~C-3 스키마 변경 설계 (rls-poc 브랜치에서)
3. **세션 4**: RLS SQL 정책 초안 작성
