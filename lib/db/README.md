# lib/db — Database Helpers

## withTempleContext(templeSlug, callback)

RLS가 적용된 테이블에 사찰 컨텍스트를 자동 주입하는 헬퍼.
`$transaction` 내에서 `set_config('app.current_temple_slug', ...)` 실행.

### 사용 예

```typescript
import { withTempleContext } from '@/lib/db/with-temple-context'

// admin: RLS 적용
const believers = await withTempleContext(auth.temple_slug, async (tx) => {
  return tx.believer.findMany()  // where 불필요 — RLS 자동 필터링
})

// super: RLS bypass — prisma 직접 사용
import { prisma } from '@/lib/prisma'
const allBelievers = await prisma.believer.findMany()
```

### 주의사항

- EXCLUDED_SLUGS(munsusa, borimsa) 접근 시 경고 로그 출력
- super admin은 이 함수를 사용하지 않음 (BYPASSRLS 경로)
- PgBouncer Transaction Mode 호환 (set_config 트랜잭션 로컬)
