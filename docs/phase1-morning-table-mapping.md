# 선결 2: Prisma 모델 → PostgreSQL 테이블 매핑

> 2026-04-18 오전 | feature/rls-poc

## 매핑 표

| # | Prisma 모델 | @@map | 예상 테이블명 | RLS SQL 파일 테이블명 | 일치 |
|---|------------|-------|-------------|---------------------|------|
| 1 | Temple | — | `"Temple"` | `"Temple"` | ✅ |
| 2 | BlockConfig | — | `"BlockConfig"` | `"BlockConfig"` | ✅ |
| 3 | DharmaQuote | — | `"DharmaQuote"` | — (TYPE-4) | — |
| 4 | DailyWisdom | — | `"DailyWisdom"` | — (TYPE-4) | — |
| 5 | TempleWisdomOverride | — | `"TempleWisdomOverride"` | `"TempleWisdomOverride"` | ✅ |
| 6 | BlockCatalog | — | `"BlockCatalog"` | — (TYPE-4) | — |
| 7 | IndungDonor | `indung_donors` | `indung_donors` | `indung_donors` | ✅ |
| 8 | CyberOffering | `cyber_offerings` | `cyber_offerings` | `cyber_offerings` | ✅ |
| 9 | Family | `families` | `families` | `families` | ✅ |
| 10 | Believer | `believers` | `believers` | `believers` | ✅ |
| 11 | BelieverFamily | `believers_family` | `believers_family` | `believers_family` | ✅ |
| 12 | BelieverHaenghyo | `believers_haenghyo` | `believers_haenghyo` | `believers_haenghyo` | ✅ |
| 13 | BelieverYoungga | `believers_youngga` | `believers_youngga` | `believers_youngga` | ✅ |
| 14 | BelieverOffering | `believers_offerings` | `believers_offerings` | `believers_offerings` | ✅ |

**결론**: 11개 RLS 적용 대상 SQL 파일 모두 테이블명 정확. 교정 불필요.

## 대표님 검증 요청

`tmp/for-daepyonim-verify-tables.sql` 내용을 Supabase main DB SQL Editor에서 실행.

### 예상 결과 (14개 테이블)

```
table_name              | column_count
------------------------|-------------
BlockCatalog            | 12
BlockConfig             | 8
DailyWisdom             | 6
DharmaQuote             | 7
Temple                  | 32
TempleWisdomOverride    | 5
believers               | 27
believers_family        | 10
believers_haenghyo      | 9
believers_offerings     | 10
believers_youngga       | 10
cyber_offerings         | 12
families                | 8
indung_donors           | 9
```

실제 결과와 위 예상이 일치하면 RLS SQL 전량 검증 완료.
불일치 시 해당 테이블의 SQL 파일 교정 필요.
