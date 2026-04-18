# 선결 2 완료: RLS SQL 파일 ↔ 실제 DB 테이블 전수 대조

> 2026-04-18 오전 | feature/rls-poc
> 근거: 대표님이 main DB SQL Editor에서 실행한 테이블 목록

## 실제 DB 테이블 14개 (대표님 확인)

### PascalCase (6개)
| 테이블명 | 컬럼 수 |
|---------|---------|
| BlockCatalog | 14 |
| BlockConfig | 9 |
| DailyWisdom | 7 |
| DharmaQuote | 8 |
| Temple | 39 |
| TempleWisdomOverride | 5 |

### snake_case (8개)
| 테이블명 | 컬럼 수 |
|---------|---------|
| believers | 32 |
| believers_family | 12 |
| believers_haenghyo | 10 |
| believers_offerings | 12 |
| believers_youngga | 11 |
| cyber_offerings | 14 |
| families | 9 |
| indung_donors | 10 |

## 전수 대조 결과

| # | RLS SQL 파일 | SQL 내부 테이블명 | 실제 DB 테이블 | 일치 | 조치 |
|---|-------------|------------------|---------------|------|------|
| 1 | believer.sql | `believers` | `believers` | ✅ | 없음 |
| 2 | believer_family.sql | `believers_family` | `believers_family` | ✅ | 없음 |
| 3 | believer_haenghyo.sql | `believers_haenghyo` | `believers_haenghyo` | ✅ | 없음 |
| 4 | believer_youngga.sql | `believers_youngga` | `believers_youngga` | ✅ | 없음 |
| 5 | believer_offering.sql | `believers_offerings` | `believers_offerings` | ✅ | 없음 |
| 6 | cyber_offering.sql | `cyber_offerings` | `cyber_offerings` | ✅ | 없음 |
| 7 | family.sql | `families` | `families` | ✅ | 없음 |
| 8 | indung_donor.sql | `indung_donors` | `indung_donors` | ✅ | 없음 |
| 9 | temple.sql | `"Temple"` | `Temple` | ✅ | 없음 |
| 10 | block_config.sql | `"BlockConfig"` | `BlockConfig` | ✅ | 없음 |
| 11 | temple_wisdom_override.sql | `"TempleWisdomOverride"` | `TempleWisdomOverride` | ✅ | 없음 |
| 12 | block_catalog.sql | — (RLS 미적용) | `BlockCatalog` | — | TYPE-4 |
| 13 | dharma_quote.sql | — (RLS 미적용) | `DharmaQuote` | — | TYPE-4 |
| 14 | daily_wisdom.sql | — (RLS 미적용) | `DailyWisdom` | — | TYPE-4 |

## 결론

- **RLS 적용 대상 11개 파일**: 전량 테이블명 정확 ✅
- **RLS 제외 대상 3개 (TYPE-4 GLOBAL)**: 테이블 존재 확인, 정책 미적용 정상
- **수정 필요: 0개**
- **전면 재작성 필요: 0개**
- **누락 테이블: 0개** (14개 전량 대응)

## 컬럼 수 불일치 참고

Prisma 스키마와 실제 DB의 컬럼 수에 차이가 있음:
- Temple: Prisma 32개 필드 vs DB 39개 컬럼 → Prisma에 정의되지 않은 DB 컬럼 7개 존재 (레거시 또는 Supabase 자동 생성)
- believers: Prisma 27개 필드 vs DB 32개 컬럼 → 5개 차이
- 이 차이는 RLS 정책에 영향 없음 (WHERE 조건만 사용)
- Phase 2에서 정밀 조사 예정
