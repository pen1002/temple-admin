# 1080사찰 대작불사 — 블록 표준 규격서

> 전수조사 일자: 2026-04-15
> 정화 완료일: 2026-04-15
> DB 블록 총 수: **15,500개 / 76종 정수(正數)**
> 코드 정합성: **76종 전량 일치 — 불일치 0건**
>
> **[인장] SEC04-04 소멸 확인 — 76종 표준 확정**
> 통도사 소속 유령 블록 SEC04-04(1건)를 2026-04-15 영구 삭제 완료.
> 이로써 DB와 코드 간 불일치율 0%, 도량 순도 100% 달성.

---

## 미처리 블록 보고: SEC04-04

| 항목 | 내용 |
|------|------|
| 블록코드 | `SEC04-04` |
| 소속 사찰 | 통도사 (tongdosa) |
| DB 수량 | 1개 |
| label | null (미지정) |
| config | `{}` (빈 설정) |
| isVisible | true |
| 코드 컴포넌트 | **없음** (전체 코드에 SEC04 참조 0건) |
| 카탈로그 등록 | **없음** (seed-block-catalog에 미등록) |
| **판정** | **고아 블록 — 렌더링 불가, 삭제 권고** |

SEC04 계열은 설계 단계에서 계획되었으나 구현되지 않은 블록으로 추정됩니다.
통도사 페이지에서 `return null`로 조용히 스킵되어 실질적 피해는 없습니다.

---

## H 계열 — 히어로 블록 (12종)

| 코드 | 명칭 | 컴포넌트 | DB 수량 | 비고 |
|------|------|----------|---------|------|
| `H-01` | 기본 히어로 | HeroBlock | 3 | |
| `H-02` | 히어로 변형2 | HeroBlock | 2 | |
| `H-03` | 히어로 변형3 | HeroBlock | 1 | |
| `H-05` | 표준 히어로 | HeroBlock | 1,088 | **기본값** |
| `H-06` | 히어로 변형6 | HeroBlock | 1 | |
| `H-07` | 히어로 변형7 | HeroBlock | 1 | |
| `H-08` | 히어로 변형8 | HeroBlock | 2 | |
| `H-09` | 히어로 변형9 | HeroBlock | 5 | |
| `H-10` | 연등행렬형 | StandardParadeHero | 1,087 | 해인사 특별 설정 포함 |
| `H-11` | 봉축의 하루 | H11BonchukHaroo | 0 | 코드만 존재 |
| `H-12` | 삼천인등 (천관사) | H12IndungHero | 1 | |
| `H-13` | 오백인등형 | FiveHundredLanternHeroBlock | 1 | |
| `H-14` | 초파일연등형 | CheopaIlYeongDeungHeroBlock | 1 | |
| `H-15` | 봉축장엄등행진 | H15ParadeBlock | 0 | 코드만 존재 |
| `H-*` | 캐치올 | HeroBlock | — | 위에 해당 안 되면 기본 처리 |

---

## SEC 계열 — 섹션 블록 (9종)

| 코드 | 명칭 | 컴포넌트 | DB 수량 | 비고 |
|------|------|----------|---------|------|
| `SEC03-*` | 법회·행사 | EventBlock | 1 | `E-*`와 동일 렌더링 |
| ~~`SEC04-04`~~ | ~~_(미정의)_~~ | ~~없음~~ | ~~1~~ | ✅ **2026-04-15 삭제 완료** |
| `SEC05-01` | 우리절 연혁 | HistoryTimelineBlock | 1,087 | `TL-01`과 동일 |
| `SEC05-04` | 국보·보물 | HeritageBlock | 2 | `HT-01`과 동일 |
| `SEC06-*` | 주지스님 인사말 | AbbotGreetingBlock | 1,087 | `AB-01`과 동일 |
| `SEC07-*` | 갤러리 | GalleryBlock | 1 | `G-*`와 동일 |
| `SEC08-*` | 인등불사·기도 동참 | OfferingBlock / BorimsaOfferingBlock | 2 | 보림사 전용 분기 |
| `SEC11-*` | 통계 바 | StatsBlock | 2 | `ST-01`과 동일 |
| `SEC13-*` | 템플스테이 | TemplestayBlock / BorimsaTemplestayBlock | 1 | 보림사 전용 분기 |

---

## 기본 블록 (필수 9종 — MANDATORY_BLOCKS)

| 코드 | 명칭 | 컴포넌트 | DB 수량 | order |
|------|------|----------|---------|-------|
| `GNB-01` | GNB 네비게이션 | GNBBlock | 1,103 | 0 |
| `T-01` | 공지 티커 배너 | TickerBlock | 1,087 | 1 |
| `WISDOM-01` | 오늘의 부처님말씀 | DailyWisdomBlock | 1,087 | 2 |
| `SEC06-01` | 주지스님 인사말 | AbbotGreetingBlock | 1,087 | 3 |
| `E-01` | 기도법회행사 | EventBlock | 1,103 | 4 |
| `NS-01` | 공지사항 스와이프 | NoticeSwipeBlock | 1,086 | 5 |
| `SEC05-01` | 우리절 연혁 | HistoryTimelineBlock | 1,087 | 7 |
| `G-01` | 우리절 갤러리 | GalleryBlock | 1,103 | 8 |
| `V-01` | 오시는 길 | LocationBlock | 1,088 | 9 |

---

## 기능 블록 (선택)

| 코드 | 명칭 | 컴포넌트 | DB 수량 |
|------|------|----------|---------|
| `N-01` | GNB (하위호환) | GNBBlock | 1,085 |
| `I-01` | 공지사항 | NoticeBlock | 1,101 |
| `D-01` | 법문 | DharmaBlock | 1,084 |
| `B-01` | 짬짜미 부처님말씀 | DailyWisdomBlock | 16 |
| `AB-01` | 주지스님 인사말 | AbbotGreetingBlock | 16 |
| `ST-01` | 통계 바 | StatsBlock | 16 |
| `TL-01` | 역사 타임라인 | HistoryTimelineBlock | 16 |
| `HT-01` | 국보·보물 | HeritageBlock | 16 |
| `DO-01` | 오시는 길 | LocationBlock | 18 |
| `F-01` | 하단 푸터 | null (page.tsx 별도) | 16 |
| `QA-01` | FAQ·퀴즈 | QABlock | 20 |
| `QB-01` | 인용구 배너 | QuoteBannerBlock | 1 |
| `L-01` | 인등불사 (천관사) | L01IndungBlock | 2 |

---

## 시리즈 블록 (접두어 기반 캐치올)

| 접두어 | 명칭 | 컴포넌트 | DB 수량 |
|--------|------|----------|---------|
| `BH-*` | 법회 시리즈 | CeremonyBlock | 2 |
| `PR-*` | 기도·불공 시리즈 | PrayerBlock | 10 |
| `EV-*` | 행사 배너 시리즈 | EventBannerBlock | 1 |
| `TS-*` | 템플스테이 카드 | TSBlock | 21 |
| `DR-*` | 사찰자료관 | ArchiveBlock | 5 |
| `E-*` | 법회·행사 | EventBlock | 1,103+ |
| `G-*` | 갤러리 | GalleryBlock | 1,103+ |
| `L-*` | 인등 (L-01 이후) | EventBlock | 4 |

---

## 코드명 별칭 매핑 (하위호환)

| 구 코드 | 신 코드 | 동일 컴포넌트 |
|---------|---------|-------------|
| `N-01` | `GNB-01` | GNBBlock |
| `AB-01` | `SEC06-*` | AbbotGreetingBlock |
| `TL-01` | `SEC05-01` | HistoryTimelineBlock |
| `HT-01` | `SEC05-04` | HeritageBlock |
| `ST-01` | `SEC11-*` | StatsBlock |
| `DO-01` | `V-01` | LocationBlock |
| `B-01` | `WISDOM-01` | DailyWisdomBlock |
| `I-01` | `NS-01` | NoticeBlock / NoticeSwipeBlock |

---

## 보호 사찰 (일괄 스크립트 제외)

| 코드 | 사찰명 | 사유 |
|------|--------|------|
| `munsusa` | 문수사 | 단독 홈피 + 사용권한 이전 |
| `borimsa` | 보림사 | 사용권한 이전 |

정의 파일: `scripts/constants.ts` → `EXCLUDED_SLUGS`

---

_이 문서는 시스템 변경 시 반드시 동기화할 것._
_블록 추가/삭제 시 이 규격서와 BlockRenderer.tsx를 동시에 업데이트할 것._
