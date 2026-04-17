# Prisma Migration 전략

## 현황 (2026-04-17)

- 기존 방식: `prisma db push` (마이그레이션 이력 없음, 롤백 불가)
- 베이스라인: `prisma/migrations/0000_baseline/migration.sql` 생성 완료
- 베이스라인 적용(`migrate resolve`): **미실행** — 실운영 DB 보호 원칙에 따라 개발 DB 확보 후 진행

## 이관 계획

### Phase 0 (현재, 동결기간)
1. 베이스라인 SQL 파일 생성 ✅
2. Supabase `rls-poc` 브랜치 생성 후 해당 DB에서 `migrate resolve --applied 0000_baseline` 실행 예정
3. 이후 모든 스키마 변경은 `prisma migrate dev`로 마이그레이션 파일 생성

### Phase 1 (Week 3~4)
- `rls-poc` 브랜치 DB에서 RLS 관련 마이그레이션 개발
- 마이그레이션 파일 검증 후 PR에 포함

### Phase 2 (Week 5~6): 순차 이관
1. **미래사** — Supabase PITR 스냅샷 확보 → `migrate deploy` 실행
2. **문수사** — 미래사 성공 확인 후 동일 절차 (EXCLUDED_SLUGS 보호 하에)
3. **보림사** — 문수사 성공 확인 후 동일 절차

### 각 사찰별 이관 절차
```
1. Supabase PITR 스냅샷 생성 (복구 지점 확보)
2. Vercel 배포 일시 중지
3. npx prisma migrate resolve --applied 0000_baseline
4. npx prisma migrate deploy (신규 마이그레이션 적용)
5. 사이트 정상 동작 확인
6. Vercel 배포 재개
7. 문제 발생 시 → PITR로 스냅샷 시점 복구
```

## 롤백 절차

### 마이그레이션 실패 시
1. **즉시**: `prisma migrate resolve --rolled-back <migration_name>`
2. **DB 복구 필요 시**: Supabase PITR → 특정 시점으로 복원
3. **코드 롤백**: `git revert <commit>` + Vercel 재배포

### Supabase Branching 활용
- 모든 스키마 변경은 먼저 Supabase 브랜치에서 검증
- 브랜치 DB에서 `migrate deploy` 성공 확인 후 main 병합
- 브랜치 실패 시 삭제하면 원본에 영향 없음

## 절대 금지 사항

- 실운영 DB에 `prisma db push` 사용 금지 (이관 완료 후)
- `prisma migrate deploy`를 PITR 스냅샷 없이 실행 금지
- EXCLUDED_SLUGS 사찰 DB에 대한 임의 마이그레이션 금지
