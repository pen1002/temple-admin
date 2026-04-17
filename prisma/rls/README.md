# RLS 정책 SQL 파일 목록

> Phase 1 세션 2B 작성 | 2026-04-18 | feature/rls-poc

## 개요

14개 Prisma 모델에 대한 PostgreSQL Row Level Security 정책 초안.
`app.current_temple_slug` 세션 변수 기반 멀티테넌트 격리.

## 파일 목록

| 파일 | 모델 | 분류 | TODO |
|------|------|------|------|
| temple.sql | Temple | TYPE-3 | — |
| block_config.sql | BlockConfig | TYPE-2 | — |
| dharma_quote.sql | DharmaQuote | TYPE-4 | RLS 미적용 |
| daily_wisdom.sql | DailyWisdom | TYPE-4 | RLS 미적용 |
| temple_wisdom_override.sql | TempleWisdomOverride | TYPE-2 | — |
| block_catalog.sql | BlockCatalog | TYPE-4 | RLS 미적용 |
| indung_donor.sql | IndungDonor | TYPE-1 | C-1: FK 추가 |
| cyber_offering.sql | CyberOffering | TYPE-1 | C-1: FK 추가 |
| family.sql | Family | TYPE-1 | W-1: NOT NULL |
| believer.sql | Believer | TYPE-1 | W-1: NOT NULL |
| believer_family.sql | BelieverFamily | TYPE-1 | C-3: temple_id 추가 |
| believer_haenghyo.sql | BelieverHaenghyo | TYPE-1 | C-3: temple_id 추가 |
| believer_youngga.sql | BelieverYoungga | TYPE-1 | C-3: temple_id 추가 |
| believer_offering.sql | BelieverOffering | TYPE-1 | C-2: FK 추가 |

## 적용 순서 (Week 2 계획)

1. rls-poc 브랜치에서 전체 모델 적용 + 회귀 테스트
2. C-1~C-3 스키마 변경 선행 (FK 추가, NOT NULL)
3. main 병합 전 PITR 스냅샷 확보
4. 순차 적용: Believer → CyberOffering → IndungDonor → 나머지

## 주의사항

- EXCLUDED_SLUGS(munsusa, borimsa) 예외 처리는 별도 검토 (Week 2)
- Prisma 쿼리에 `SET app.current_temple_slug` 컨텍스트 전파 필요 (세션 3)
- super admin은 모든 테넌트 접근 필요 → role 기반 bypass 정책 추가 예정
