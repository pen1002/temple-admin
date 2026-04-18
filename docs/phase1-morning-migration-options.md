# 선결 3: Preview Branch Migration 적용 절차 비교

> 2026-04-18 오전 | feature/rls-poc

## 문제 정의

Supabase Preview Branch는 **빈 DB**로 생성됨 (스키마 미복제).
RLS 정책을 검증하려면 먼저 테이블 구조 + 테스트 데이터가 필요.

## 옵션 비교

### 옵션 A: Supabase CLI + Link

**실행 단계**:
```bash
# 1. CLI 설치 (macOS)
brew install supabase/tap/supabase

# 2. 로그인 (브라우저 OAuth)
supabase login

# 3. 프로젝트 연결
supabase link --project-ref dfjxtvsqqiydumgmbahk

# 4. 브랜치 목록 확인
supabase branches list

# 5. Preview Branch에 migration 적용
supabase db push --branch rls-poc
```

**필요 인증**: Supabase 개인 계정 OAuth (ACCESS_TOKEN 자동 생성)
**리스크**: `--branch` 플래그 누락 시 main DB에 push 가능 ⚠️
**대표님 개입**: CLI 설치 + 최초 OAuth 로그인 1회
**되돌리기**: Preview Branch 삭제 후 재생성

| 항목 | 평가 |
|------|------|
| 자동화 | 중 (수동 CLI 명령) |
| 안전성 | 중 (--branch 플래그 실수 가능) |
| 대표님 개입 | 최소 (설치+로그인 1회) |
| 오늘 바로 사용 | ⚠️ 설치 필요 (5~10분) |

---

### 옵션 B: GitHub Actions 자동화

**실행 단계**:
```yaml
# .github/workflows/preview-branch-migrate.yml
name: Preview Branch Migration
on:
  pull_request:
    branches: [main]
    types: [opened, synchronize]

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
      - run: supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      - run: supabase db push --branch ${{ github.head_ref }}
```

**필요 인증**: `SUPABASE_ACCESS_TOKEN` + `SUPABASE_PROJECT_REF` GitHub Secrets
**리스크**: 낮음 (PR 브랜치명 자동 사용, main 건드리지 않음)
**대표님 개입**: 없음 (PR 열면 자동)
**되돌리기**: PR Close → Branch 자동 삭제

| 항목 | 평가 |
|------|------|
| 자동화 | 높음 (완전 자동) |
| 안전성 | 높음 (브랜치명 자동 매칭) |
| 대표님 개입 | 없음 |
| 오늘 바로 사용 | ❌ 설정 복잡 (ACCESS_TOKEN 발급 + Secrets 등록) |

---

### 옵션 C: Supabase Dashboard 수동 실행

**실행 단계**:
1. Supabase Dashboard → SQL Editor
2. 우측 상단에서 **rls-poc 브랜치** 선택 확인
3. `prisma/migrations/0000_baseline/migration.sql` (384행) 복사·붙여넣기
4. Run 클릭
5. 테이블 생성 확인
6. 이후 RLS SQL 붙여넣기

**필요 인증**: 대표님 Supabase 로그인 (이미 완료)
**리스크**: 낮음 (브랜치 선택이 시각적으로 명확)
**대표님 개입**: SQL 복붙 1회 (384행)
**되돌리기**: Preview Branch 삭제 후 재생성

| 항목 | 평가 |
|------|------|
| 자동화 | 낮음 (수동) |
| 안전성 | 높음 (시각적 브랜치 확인) |
| 대표님 개입 | 필요 (복붙 1회) |
| 오늘 바로 사용 | ✅ 즉시 가능 |

---

## 비교 매트릭스

| 항목 | 옵션 A (CLI) | 옵션 B (Actions) | 옵션 C (Dashboard) |
|------|-------------|-----------------|-------------------|
| 자동화 | 중 | 높음 | 낮음 |
| 안전성 | 중 ⚠️ | 높음 | 높음 |
| 대표님 개입 | 최소 | 없음 | 필요 |
| 오늘 바로 사용 | ⚠️ 설치 필요 | ❌ 설정 복잡 | ✅ 즉시 |
| main DB 실수 가능성 | 있음 | 없음 | 없음 |
| 장기 운영 적합도 | 중 | 높음 | 낮음 |

## 도편수 권고안

### 오늘: 옵션 C (Dashboard 수동)
- 즉시 실행 가능, 추가 설치/설정 불필요
- 대표님 1회 복붙으로 완료 (384행 SQL)
- main DB 실수 가능성 없음 (시각적 브랜치 선택)

### Phase 2 이후: 옵션 B (GitHub Actions)
- PR 생성 시 자동으로 Preview Branch에 migration 적용
- 반복 작업 제거, 대표님 개입 불필요
- ACCESS_TOKEN 발급 + GitHub Secrets 등록이 선행 조건

### 옵션 A는 비권고
- `--branch` 플래그 누락 시 main DB에 push되는 위험
- CLI 설치가 옵션 C 대비 장점이 적음
