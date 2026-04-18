# Phase 1 세션 5A — 회귀 테스트 체크리스트

> 2026-04-18 저녁 | feature/rls-poc
> 전체 API: 38개 엔드포인트 (73개 HTTP 메서드)
> 크리티컬 경로: 12개

## 카테고리 1: 공개 접근 경로 (4개)

### 경로 1: 미래사 메인 페이지 로딩
- **URL**: `https://miraesa.k-buddhism.kr/`
- **기대**: 200 OK
- **검증**: `curl -s -o /dev/null -w "%{http_code}" "https://miraesa.k-buddhism.kr/"`
- **주의**: DharmaWheelView + Suspense 래핑 정상 동작

### 경로 2: 연등 접수 폼 제출
- **URL**: `https://miraesa.k-buddhism.kr/miraesa/cyber/yeondeung`
- **API**: `POST /api/cyber/offering` (type=yeondeung)
- **기대**: 접수 성공, 카카오 공유 텍스트 반환
- **검증**:
```bash
curl -s -X POST "https://miraesa.k-buddhism.kr/api/cyber/offering" \
  -H "Content-Type: application/json" \
  -H "Origin: https://miraesa.k-buddhism.kr" \
  -d '{"temple_slug":"miraesa","type":"yeondeung","name":"회귀테스트","contact":"010-0000-0000"}'
```
- **주의**: ConsentCheckbox 동의 후 제출 + requireTempleAuth 통과

### 경로 3: 인등불사 신청
- **URL**: `https://miraesa.k-buddhism.kr/miraesa/cyber/indung`
- **API**: `POST /api/cyber/offering` (type=indung)
- **기대**: 200, 사업자 정보 블록 + 환불 규정 링크 표시
- **검증**:
```bash
curl -s -X POST "https://miraesa.k-buddhism.kr/api/cyber/offering" \
  -H "Content-Type: application/json" \
  -H "Origin: https://miraesa.k-buddhism.kr" \
  -d '{"temple_slug":"miraesa","type":"indung","name":"회귀테스트","amount":10000}'
```

### 경로 4: 나의기도동참 조회
- **URL**: `https://miraesa.k-buddhism.kr/miraesa/cyber/mycard`
- **API**: `GET /api/cyber/mycard?name=테스트&temple=miraesa`
- **기대**: ConsentCheckbox 동의 후 조회 가능
- **검증**:
```bash
curl -s "https://miraesa.k-buddhism.kr/api/cyber/mycard?name=테스트&temple=miraesa"
```

## 카테고리 2: 관리자 경로 (5개)

### 경로 5: 사찰 관리자 PIN 인증
- **API**: `POST /api/cyber/members/auth`
- **기대**: JWT 발급 + `temple_auth` 쿠키 설정
- **검증**:
```bash
curl -s -X POST "https://miraesa.k-buddhism.kr/api/cyber/members/auth" \
  -H "Content-Type: application/json" \
  -d '{"pin":"0000","temple_slug":"miraesa"}'
# 기대: {"role":"admin","pin_changed":...,"token":"..."}
```

### 경로 6: 신도 목록 조회 (admin)
- **API**: `GET /api/cyber/believers?temple_slug=miraesa`
- **인증**: `requireTempleAuth` (세션 4A 패치)
- **기대**: Origin 검증 통과 시 미래사 신도 반환
- **검증**:
```bash
# 인증 없이 → 400 (Origin 누락 시)
curl -s "https://miraesa.k-buddhism.kr/api/cyber/believers?temple_slug=miraesa"

# Origin 포함
curl -s "https://miraesa.k-buddhism.kr/api/cyber/believers?temple_slug=miraesa" \
  -H "Origin: https://miraesa.k-buddhism.kr"
```

### 경로 7: 공양 내역 조회 (admin)
- **API**: `GET /api/cyber/offering?temple_slug=miraesa&type=indung`
- **인증**: `requireTempleAuth` (세션 2A 패치)
- **기대**: 미래사 인등 내역만 반환
- **검증**:
```bash
curl -s "https://miraesa.k-buddhism.kr/api/cyber/offering?temple_slug=miraesa&type=indung" \
  -H "Origin: https://miraesa.k-buddhism.kr"
```

### 경로 8: 신도카드 등록 (종무소)
- **API**: `POST /api/cyber/members`
- **인증**: `checkTempleAuth` (기존)
- **기대**: PIN 인증 후 신도 등록 성공, 축원번호 반환
- **주의**: 4개 체크박스 동의 + consent 객체 포함

### 경로 9: Sentry 이슈 부재 확인
- **검증**: Sentry Dashboard → 최근 1시간 새 이슈 0건
- **기대**: 500 에러 미발생

## 카테고리 3: EXCLUDED_SLUGS 보호 (2개)

### 경로 10: 문수사 홈페이지 정상 로딩
- **URL**: `https://munsusa.k-buddhism.kr/`
- **기대**: 200 OK, 골든 체크포인트 변경 없음
- **검증**:
```bash
curl -s -o /dev/null -w "%{http_code}" "https://munsusa.k-buddhism.kr/"
```
- **주의**: RLS 영향 0%, 코드 변경 0%

### 경로 11: 보림사 홈페이지 정상 로딩
- **URL**: `https://borimsa.k-buddhism.kr/`
- **기대**: 200 OK
- **검증**:
```bash
curl -s -o /dev/null -w "%{http_code}" "https://borimsa.k-buddhism.kr/"
```

## 카테고리 4: 슈퍼 관리자 (1개)

### 경로 12: /super 대시보드
- **URL**: `https://miraesa.k-buddhism.kr/miraesa/super`
- **기대**: PIN 108108 → 전체 사찰 관리 진입
- **주의**: BYPASSRLS 경로, withTempleContext 미사용
- **검증**: 수동 브라우저 확인 (PIN 입력 필요)

## 자동화 curl 스크립트

```bash
#!/bin/bash
# Phase 1 회귀 테스트 — 자동화 가능한 경로
echo "=== 카테고리 1: 공개 접근 ==="
echo -n "경로 1 (미래사 메인): "
curl -s -o /dev/null -w "%{http_code}" "https://miraesa.k-buddhism.kr/"

echo ""
echo -n "경로 2 (연등 API): "
curl -s -o /dev/null -w "%{http_code}" -X POST \
  "https://miraesa.k-buddhism.kr/api/cyber/offering" \
  -H "Content-Type: application/json" \
  -H "Origin: https://miraesa.k-buddhism.kr" \
  -d '{"temple_slug":"miraesa","type":"bow","name":"regression-test"}'

echo ""
echo -n "경로 4 (나의기도 API): "
curl -s -o /dev/null -w "%{http_code}" \
  "https://miraesa.k-buddhism.kr/api/cyber/mycard?name=없는이름&temple=miraesa"

echo ""
echo "=== 카테고리 2: 관리자 ==="
echo -n "경로 5 (PIN 인증): "
curl -s -o /dev/null -w "%{http_code}" -X POST \
  "https://miraesa.k-buddhism.kr/api/cyber/members/auth" \
  -H "Content-Type: application/json" \
  -d '{"pin":"invalid","temple_slug":"miraesa"}'
# 기대: 401 (잘못된 PIN)

echo ""
echo -n "경로 7 (공양 조회): "
curl -s -o /dev/null -w "%{http_code}" \
  "https://miraesa.k-buddhism.kr/api/cyber/offering?temple_slug=miraesa&type=indung" \
  -H "Origin: https://miraesa.k-buddhism.kr"

echo ""
echo "=== 카테고리 3: EXCLUDED_SLUGS ==="
echo -n "경로 10 (문수사): "
curl -s -o /dev/null -w "%{http_code}" "https://munsusa.k-buddhism.kr/"

echo ""
echo -n "경로 11 (보림사): "
curl -s -o /dev/null -w "%{http_code}" "https://borimsa.k-buddhism.kr/"

echo ""
echo "=== 법적 페이지 ==="
echo -n "개인정보처리방침: "
curl -s -o /dev/null -w "%{http_code}" "https://miraesa.k-buddhism.kr/privacy"

echo ""
echo -n "이용약관: "
curl -s -o /dev/null -w "%{http_code}" "https://miraesa.k-buddhism.kr/terms"

echo ""
echo "=== 완료 ==="
```

## 세션 5B 수정 대상 API 확인

withTempleContext 적용 대상 (Phase 2에서 순차 전환):

| API | 현재 인증 | withTempleContext 적용 | 우선순위 |
|-----|----------|----------------------|---------|
| `cyber/offering/route.ts` | ✅ requireTempleAuth | Phase 2 | 중 |
| `cyber/believers/route.ts` | ✅ requireTempleAuth | Phase 2 | 중 |
| `cyber/members/route.ts` | ✅ checkTempleAuth | Phase 2 | 높 |
| `cyber/sido/route.ts` | ❌ 없음 | Phase 2 + 인증 추가 | 높 |
| `indung/route.ts` | ❌ 없음 | Phase 2 + 인증 추가 | 중 |

**세션 5B에서는 코드 수정 대신 현재 상태의 회귀 테스트 실행에 집중.**
withTempleContext 실제 전환은 Phase 2 범위 (main 병합 후).
