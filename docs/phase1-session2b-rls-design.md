# Phase 1 세션 2B — RLS 정책 설계

> 작성일: 2026-04-18 | 브랜치: feature/rls-poc

## 1. 정책 템플릿 요약

4가지 정책 유형을 정립, `app.current_temple_slug` 세션 변수 기반:

| 유형 | SELECT | INSERT/UPDATE/DELETE | 대상 모델 수 |
|------|--------|---------------------|-------------|
| TYPE-1 (STRICT) | 자기 사찰만 | 자기 사찰만 | 8 |
| TYPE-2 (NORMAL) | 자기 사찰만 | 자기 사찰만 | 2 |
| TYPE-3 (PUBLIC_READ) | 누구나 | 관리자/super만 | 1 |
| TYPE-4 (GLOBAL) | RLS 미적용 | RLS 미적용 | 3 |

## 2. 14개 모델별 SQL 파일

`prisma/rls/` 하위에 14개 파일 생성 완료. (README.md 참조)

TODO 주석이 달린 모델: **6개**
- C-1: IndungDonor, CyberOffering (FK 없는 temple_slug)
- C-2: BelieverOffering (temple_id FK 미정의)
- C-3: BelieverFamily, BelieverHaenghyo, BelieverYoungga (temple 필드 부재)
- W-1: Family, Believer (nullable temple_id)

## 3. rls-poc 브랜치 검증

**상태**: Supabase rls-poc 브랜치 미생성 (GitHub PR 트리거 필요).
대표님/기획실장 확인 후 BelieverCard 검증 진행 예정.

## 4. Week 2 적용 계획

1. Supabase rls-poc 브랜치 확보 (PR 생성 또는 수동)
2. BelieverCard(believers 테이블) 시험 적용 → 3가지 SELECT 검증
3. C-1~C-3 스키마 변경 설계 (rls-poc에서)
4. 전체 모델 순차 적용 + 회귀 테스트
5. main 병합 전 PITR 스냅샷 확보

## 5. 발견된 추가 이슈

- **templeId vs temple_id vs temple_slug**: 네이밍 3종 혼재. RLS 정책은 각각 대응하되, Phase 2에서 표준화 검토.
- **super admin bypass**: 현재 정책에 super admin 예외 없음. 세션 3(인증 플로우)에서 `app.current_role = 'super'` bypass 정책 추가 필요.
- **Prisma connection pooler + RLS**: Transaction Pooler(port 6543)에서 `SET` 명령이 트랜잭션 내에서만 유효. `set_config(..., true)` (트랜잭션 로컬)로 설정해야 함.
