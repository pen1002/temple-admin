# Phase 2 상세 설계서

## 1,080사찰 대작불사 · RLS 확산 + API 전환 + 감사 로그

---

## 문서 상태
- 작성일: 2026-04-18 토요일 밤
- 작성자: 기획실장 (Claude) + 도편수 (Claude Code)
- 전제: Phase 1 완결 보고서 (6c6a361), 안정화 계획서 (644b737)
- 승인: 대표님

## 1. Phase 2 목표

Phase 1에서 구축한 기초를 **실운영 전체에 확산 적용**하며 감사·모니터링 체계를 추가한다.

### 구체 목표 5가지

| # | 목표 | 범위 |
|---|------|------|
| 1 | **RLS를 실운영 DB에 적용** | 11개 테이블 (TYPE-1: 8, TYPE-2: 2, TYPE-3: 1) |
| 2 | **withTempleContext를 모든 관련 API에 전환** | 38개 API 중 RLS 관련 약 25개 |
| 3 | **인증 부재 중·저위험 4건 추가 패치** | sido, status, notice, indung |
| 4 | **감사 로그 시스템 구축** | EXCLUDED_SLUGS + super admin + 인증 실패 |
| 5 | **회귀 테스트 자동화** | 12개 크리티컬 경로 → GitHub Actions |

### Phase 1에서 인수받는 자산

| 자산 | 위치 | 수량 |
|------|------|------|
| withTempleContext 헬퍼 | `lib/db/with-temple-context.ts` | 47행 |
| RLS 정책 SQL | `prisma/rls/*.sql` | 14개 파일 |
| 검증 스크립트 | `scripts/test-with-temple-context.ts` | 86행 |
| 설계·회고 문서 | `docs/phase1-*.md` | 14개 파일 |
| rls-poc Preview Branch | Supabase | Active |
| feature/rls-poc 미반영 커밋 | GitHub | 20개 |

## 2. 예상 기간: 3~4주

| 주차 | 기간 | 핵심 활동 |
|------|------|----------|
| Week 1 | 4/21~4/25 | RLS 확산 (11개 테이블 순차 적용) |
| Week 2 | 4/26~5/2 | API 전환 (withTempleContext 약 25개) |
| Week 3 | 5/3~5/9 | 감사 로그 + 인증 보강 4건 |
| Week 4 | 5/10~5/17 | 회귀 자동화 + 안정화 + 완결 |

## 3. 10가지 Lesson의 Phase 2 반영

### 기술 Lesson → 구현 원칙

| Lesson | Phase 2 원칙 | 구현 |
|--------|-------------|------|
| L1 (Preview 빈 DB) | 각 테이블 RLS 적용 전 Preview 검증 필수 | PR마다 Preview Branch 생성 |
| L2 (모델명 ≠ 테이블명) | 작업 전 실제 DB 테이블명 재확인 | 세션 시작 시 `\dt` 출력 |
| L3 (RLS 순서) | 구조 변경 → RLS → 검증 순서 엄수 | 3단계 체크리스트 |
| L4 (BYPASSRLS) | 검증 시 `SET ROLE authenticated` 필수 | 표준 쿼리 템플릿 |
| L7 (Cherry-pick 의존성) | 병합 전 import 체인 분석 | 병합 지시서 필수 단계 |
| L8 (인증 함수 구현 확인) | 함수 선택 시 내부 로직 확인 | 권한 매트릭스에 함수명 명시 |
| L9 (배포 ≠ 효과) | 배포 후 실제 curl 검증 | 자동화 스크립트 포함 |

### 프로세스 Lesson → 작업 원칙

| Lesson | Phase 2 원칙 | 구현 |
|--------|-------------|------|
| L5 (감사 우선) | 새 작업 전 기존 코드 감사 | 세션 Step 1 = 현황 조사 |
| L6 (RLS + 인증) | 인증 없는 API에 RLS만 적용 금지 | 인증 확인 체크리스트 |
| L10 (확인 후 즉시) | 확인된 위험 즉시 대응 | 발견→분석→대응→검증 4단계 |

## 4. Week별 세부 계획

### Week 1: RLS 확산 (4/21~4/25)

#### Day 1~2: 준비 + Temple (PUBLIC_READ)
- rls-poc Preview Branch 상태 점검
- `Temple` 테이블 RLS 적용 (가장 단순, 위험 낮음)
- 검증: `SELECT * FROM "Temple"` — 공개 조회 정상, UPDATE 관리자만
- Sentry 24시간 모니터링

#### Day 3~5: TENANT_STRICT 핵심 (개인정보)
적용 순서 (위험도순):

| 순서 | 테이블 | 이유 |
|------|--------|------|
| 1 | `believers` | 개인정보 핵심 (이미 인증 패치됨) |
| 2 | `believers_family` | believers 하위 |
| 3 | `believers_haenghyo` | believers 하위 |
| 4 | `believers_youngga` | believers 하위 |
| 5 | `believers_offerings` | 결제 관련 |

각 테이블 적용 패턴:
```
1. Preview Branch에서 SQL 실행 + SET ROLE 검증
2. PR 생성 → CI 통과
3. PITR 스냅샷 확보
4. 실운영 적용
5. curl 12개 경로 검증
6. Sentry 1시간 모니터링
```

#### Day 6~7: TENANT_STRICT 나머지 + TYPE-2
- `cyber_offerings`, `families`, `indung_donors`
- `BlockConfig`, `TempleWisdomOverride`

### Week 2: API 전환 (4/26~5/2)

#### withTempleContext 적용 우선순위

| 우선순위 | API | 현재 인증 | 전환 복잡도 |
|---------|-----|----------|-----------|
| 1 | `cyber/believers` | checkTempleAuth ✅ | Low |
| 2 | `cyber/offering` | requireTempleAuth ✅ | Low |
| 3 | `cyber/members` | checkTempleAuth ✅ | Medium |
| 4 | `cyber/members/offerings` | checkTempleAuth ✅ | Medium |
| 5 | `cyber/sido` | 없음 ❌ → 인증 추가 | Medium |
| 6 | `cyber/status` | 없음 ❌ → 인증 추가 | Low |
| 7 | `cyber/notice` | 없음 ❌ → 인증 추가 | Low |
| 8 | `indung` | 없음 ❌ → 인증 추가 | Low |
| 9 | `cyber/mycard` | 없음 (공개 의도) | Low |
| 10~25 | `admin/*` 9개 | middleware 보호 | Low |

#### super admin 분기 표준 패턴
```typescript
if (auth.role === 'super') {
  // BYPASSRLS — prisma 직접 사용
  return prisma.believer.findMany()
} else {
  // RLS 적용
  return withTempleContext(auth.temple_slug, tx => tx.believer.findMany())
}
```

### Week 3: 감사 로그 + 인증 보강 (5/3~5/9)

#### 감사 로그 테이블 설계
```sql
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT now(),
  actor_role TEXT,        -- 'super' | 'admin' | 'anon'
  actor_slug TEXT,        -- JWT의 temple_slug
  action TEXT,            -- 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'
  target_table TEXT,      -- 'believers' 등
  target_slug TEXT,       -- 대상 사찰
  is_excluded BOOLEAN,    -- EXCLUDED_SLUGS 접근 여부
  metadata JSONB
);
```

#### 인증 부재 4건 패치

| API | 위험도 | 조치 |
|-----|--------|------|
| `cyber/sido` | 중 | requireTempleAuth + withTempleContext |
| `cyber/status` | 중 | requireTempleAuth (공개 통계) |
| `cyber/notice` | 저 | requireTempleAuth (공개 의도 확인 후) |
| `indung` | 중 | requireTempleAuth + rateLimit |

### Week 4: 자동화 + 안정화 (5/10~5/17)

#### 회귀 테스트 자동화
```yaml
# .github/workflows/regression.yml
name: Regression Test
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 9,21 * * *'  # 매일 아침·저녁
jobs:
  curl-check:
    runs-on: ubuntu-latest
    steps:
      - run: |
          # 12개 크리티컬 경로 자동 검증
          # docs/phase1-session5a 체크리스트 기반
```

#### Phase 2 완결 조건
- [ ] 11개 테이블 RLS 실운영 적용 완료
- [ ] 25개+ API withTempleContext 전환 완료
- [ ] 인증 부재 4건 전량 패치
- [ ] 감사 로그 실운영 작동
- [ ] 회귀 테스트 GitHub Actions 자동 실행
- [ ] hotfix 비율 10% 미만 4주 유지
- [ ] Sentry 심각 이슈 0건 2주 유지

## 5. 위험 관리

### 최우선 위험 3가지

| # | 위험 | 대응 | 롤백 |
|---|------|------|------|
| 1 | RLS 적용 중 데이터 조회 실패 | 테이블별 즉시 curl 검증 | `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` |
| 2 | withTempleContext 전환 중 회귀 | API 하나씩 전환, Preview 검증 | `git revert` |
| 3 | EXCLUDED_SLUGS 사찰 영향 | 매 작업 후 문수사·보림사 curl | 절대 변경 금지 원칙 |

### 오늘 저녁 위기 재발 방지

| 위기 | 재발 방지 |
|------|----------|
| 의존성 누락 (위기 2) | 병합 전 import 체인 분석 필수 (L7) |
| 설계 오류 (위기 3) | 함수 내부 로직 확인 의무 (L8) |
| 배포 후 미검증 | 실제 curl 검증 의무 (L9) |

## 6. Phase 2 착수 체크리스트

Phase 2 첫 세션 시작 전 확인:

- [ ] Phase 1 72시간 관찰 완료 (4/21 21:10, 무이슈)
- [ ] 대표님 Phase 2 착수 승인
- [ ] rls-poc Preview Branch 상태 양호
- [ ] main 브랜치 안정 (a8dc111 기반)
- [ ] feature/rls-poc 브랜치 최신 상태
- [ ] EXCLUDED_SLUGS 사찰 200 OK 재확인

## 7. Phase 2 예상 산출물

| 산출물 | 상태 |
|--------|------|
| main: 11개 테이블 RLS 적용 | Phase 2 완료 시 |
| main: 25개+ API withTempleContext | Phase 2 완료 시 |
| feature/rls-poc → main 완전 병합 | 브랜치 삭제 가능 |
| 감사 로그 시스템 | 실운영 작동 |
| 회귀 테스트 자동화 | GitHub Actions |
| Phase 2 완결 보고서 | 최종 문서 |

## 8. Phase 3 예고

Phase 2 완결 후:
- 1,080사찰 확산 자동화 (템플릿 기반 온보딩)
- 사찰별 약관 버전 관리
- 운영 대시보드 (간이과세자 모니터링 포함)
- 예상 기간: 2~3개월

---

작성: 도편수 (Claude Code) + 기획실장 (Claude)
날짜: 2026-04-18
