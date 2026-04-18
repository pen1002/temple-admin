# Phase 1 main 배포 후 안정화 계획서

> 2026-04-18 저녁 | 세션 6B
> 대상: main 브랜치 4개 커밋 (ed9e7a2 → 4d0a3e3 → 17ce23e → a8dc111)

## 배포 상태

| 커밋 | 배포 시각 | Vercel 상태 | 검증 |
|------|----------|-----------|------|
| `ed9e7a2` (offering 인증) | 20:50 | ✅ Production | 403 확인 |
| `4d0a3e3` (rate limit) | 20:50 | ✅ Production | — |
| `17ce23e` (believers/indung) | 20:50 | ✅ Production | — |
| `a8dc111` (believers JWT 핫픽스) | 21:10 | ✅ Production | 401 확인 |

## 관찰 기간

| 기간 | 구간 | 관찰 빈도 | 목적 |
|------|------|----------|------|
| 집중 관찰 | 0~24h (4/18 21:10 ~ 4/19 21:10) | 아침·저녁 2회 | 이상 징후 조기 발견 |
| 안정 관찰 | 24~72h (4/19 ~ 4/21 21:10) | 1일 1회 | 안정성 확인 |

## 모니터링 체크리스트 (curl)

```bash
#!/bin/bash
# Phase 1 안정화 모니터링 — 매일 실행
echo "=== $(date '+%Y-%m-%d %H:%M') 안정화 체크 ==="

echo -n "메인: "
curl -s -o /dev/null -w "%{http_code}" "https://miraesa.k-buddhism.kr/"

echo -n " | believers 보호: "
curl -s -o /dev/null -w "%{http_code}" \
  "https://miraesa.k-buddhism.kr/api/cyber/believers?temple_slug=miraesa"

echo -n " | offering evil: "
curl -s -o /dev/null -w "%{http_code}" \
  "https://miraesa.k-buddhism.kr/api/cyber/offering?temple_slug=miraesa" \
  -H "Origin: https://evil-site.com"

echo -n " | offering 정상: "
curl -s -o /dev/null -w "%{http_code}" \
  "https://miraesa.k-buddhism.kr/api/cyber/offering?temple_slug=miraesa&type=yeondeung" \
  -H "Origin: https://miraesa.k-buddhism.kr"

echo -n " | 문수사: "
curl -s -o /dev/null -w "%{http_code}" "https://munsusa.k-buddhism.kr/"

echo -n " | 보림사: "
curl -s -o /dev/null -w "%{http_code}" "https://borimsa.k-buddhism.kr/"

echo ""
echo "기대: 200 | 401 | 403 | 200 | 200 | 200"
```

## 롤백 트리거

### 트리거 1: 사용자 피해 (즉시 롤백)
- 미래사 종무소에서 신도카드 등록(POST) 실패 보고
- 공양 접수(연등/인등) 폼 제출 불가
- 대표님 직접 확인 불가 시 → 전체 롤백

### 트리거 2: 기술 지표 (1시간 관찰 후 판단)
- Sentry 500 에러 3건 이상/시간 발생
- 응답 시간 3초 이상 지속
- Vercel 배포 상태 Error

### 트리거 3: 의도 밖 차단 (부분 롤백)
- 정상 Origin에서 403 발생 (false positive)
- 관리자 JWT 인증 후에도 401 반환
- EXCLUDED_SLUGS 사찰에 영향 발견

## 롤백 절차

### 부분 롤백 (a8dc111 핫픽스만 되돌리기)

```bash
git checkout main
git revert a8dc111 --no-edit
git push origin main
# believers가 requireTempleAuth 상태로 복귀
# offering 인증은 유지
```

### 전체 롤백 (4개 커밋 모두 되돌리기)

```bash
git checkout main
git reset --hard 274b6ff190d626cfc783f49eee6bb897655ef97d
git push origin main --force-with-lease
```

⚠️ **전체 롤백 시 다음이 되돌아감:**
- 개인정보 보호 (believers JWT 검증)
- Origin 체크 강화 (offering)
- Rate Limit 수정
- indung/sync 인증

**즉, 전체 롤백 = 개인정보 노출 상태 복귀. 신중히 결정.**

## 롤백 결정 권한

| 역할 | 권한 |
|------|------|
| 대표님 | 모든 롤백 결정 |
| 기획실장 | 롤백 필요성 분석·제안 |
| 도편수 | 롤백 실행 (대표님 승인 후) |

## 모니터링 종료 조건

다음 중 하나 충족 시 집중 관찰 종료:
- 72시간 무이슈 경과 (4/21 21:10)
- Phase 2 착수 시점 도달
- 대표님의 "안정화 완료" 선언

## 이후 연계 사항

안정화 완료 후:
- feature/rls-poc 브랜치의 미반영 자산 (withTempleContext 등) Phase 2 확산 적용
- 인증 부재 중·저위험 4건 Phase 2 처리
- requireTempleAuth의 `allowPublic: false` 동작 재설계 (Lesson 8 반영)

---

작성: 도편수 (Claude Code)
관찰 기간: 2026-04-19 ~ 2026-04-21 (72시간)
