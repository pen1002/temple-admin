# Phase 1 세션 2 회고 — 2026-04-18

## 달성
- 세션 1: 14개 모델 인벤토리 (222fa18)
- 세션 2A: C-4 보안 패치 — offering/route.ts 인증 추가 (386b78e)
- Part A: Rate Limit off-by-one 수정 (2f805a7)
- 세션 2B: RLS 정책 설계 17개 파일 (8b02e3f)
- PR #1 생성 → Supabase Preview Branch 자동 생성 트리거 성공
- Preview Branch "rls-poc" 생성 성공

## 미달성
- Believer RLS 정책 적용 검증 (Preview DB 비어있음)
- 3가지 격리 시나리오 검증

## 발견한 Lesson 3건

### Lesson 1: Supabase Preview Branch는 스키마 자동 복제하지 않음
- Preview Branch는 main DB의 스냅샷이 아닌 "빈 DB + migration 이력" 복제
- 실제 테이블을 생성하려면 해당 브랜치에 migration을 별도 적용 필요
- 증거: Branch 생성 직후 "LAST MIGRATION: No migrations" 표시

### Lesson 2: 세션 1 조사는 "Prisma 스키마 기준"만으로 불충분
- Prisma 모델명 ≠ PostgreSQL 테이블명 (@@map 존재 시)
- 14개 모델 중 8개가 @@map으로 테이블명 재정의 → RLS SQL 테이블명 교정 필요
- 실제 DB의 테이블명 확인이 선행되어야 RLS SQL 정확

### Lesson 3: POC 브랜치에 migration 적용 사전 계획 필요
- Phase 0+ 브랜치 개설 시 "껍데기만" 만든 것이 한계
- 검증하려면 migration 적용까지 계획에 포함했어야 함

## 내일 재개 시 선결 사항

### 선결 1: RLS SQL 테이블명 교정
prisma/rls/*.sql의 테이블명을 부록 A 매핑표 기준으로 교정.
세션 2B에서 작성한 SQL 중 @@map 모델 8개의 테이블명이 부정확할 수 있음.

### 선결 2: 실제 main DB 테이블 목록 확인
대표님께 main DB SQL Editor에서 다음 실행 요청 (read-only):
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
```

### 선결 3: Preview Branch migration 적용 절차 확립
- 옵션 A: supabase CLI (ACCESS_TOKEN 필요)
- 옵션 B: Dashboard SQL Editor에서 수동 실행
- 옵션 C: GitHub Action 자동화
- 각 옵션 비교 문서 작성 예정

## 오늘 커밋된 자산 (feature/rls-poc)
| 커밋 | 내용 |
|------|------|
| 222fa18 | 세션 1 스키마 인벤토리 |
| 386b78e | C-4 보안 패치 (require-temple-auth.ts) |
| 2f805a7 | Rate limit off-by-one 수정 |
| 8b02e3f | RLS 정책 설계 17개 파일 |

## 내일 Phase 1 재개 계획
1. 선결 1~3 완료
2. prisma/rls/*.sql 테이블명 교정
3. Preview Branch 재생성 + migration 적용
4. Believer 테이블 RLS 검증 (3가지 시나리오)
5. 성공 시 세션 3(인증 플로우) 진입

## 부록 A: Prisma 모델명 → PostgreSQL 테이블명 매핑

| # | Prisma 모델 | @@map | 실제 테이블명 | RLS SQL 파일 교정 필요 |
|---|------------|-------|-------------|---------------------|
| 1 | Temple | — | Temple | ❌ |
| 2 | BlockConfig | — | BlockConfig | ❌ |
| 3 | DharmaQuote | — | DharmaQuote | ❌ (TYPE-4, RLS 미적용) |
| 4 | DailyWisdom | — | DailyWisdom | ❌ (TYPE-4, RLS 미적용) |
| 5 | TempleWisdomOverride | — | TempleWisdomOverride | ❌ |
| 6 | BlockCatalog | — | BlockCatalog | ❌ (TYPE-4, RLS 미적용) |
| 7 | IndungDonor | `indung_donors` | indung_donors | ✅ (현재 정확) |
| 8 | CyberOffering | `cyber_offerings` | cyber_offerings | ✅ (현재 정확) |
| 9 | Family | `families` | families | ✅ (현재 정확) |
| 10 | Believer | `believers` | believers | ✅ (현재 정확) |
| 11 | BelieverFamily | `believers_family` | believers_family | ✅ (현재 정확) |
| 12 | BelieverHaenghyo | `believers_haenghyo` | believers_haenghyo | ✅ (현재 정확) |
| 13 | BelieverYoungga | `believers_youngga` | believers_youngga | ✅ (현재 정확) |
| 14 | BelieverOffering | `believers_offerings` | believers_offerings | ✅ (현재 정확) |

**결론**: @@map이 있는 8개 모델의 SQL 파일은 이미 @@map 테이블명으로 작성됨 (정확).
@@map이 없는 6개 모델은 Prisma 기본 네이밍(모델명 그대로 + 큰따옴표)으로 작성됨 (정확).
**교정 불필요** — 내일 실제 DB 테이블 목록 대조로 최종 확인.
