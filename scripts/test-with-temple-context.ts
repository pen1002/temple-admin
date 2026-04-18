/**
 * withTempleContext RLS 검증 스크립트
 *
 * 실행 전: DATABASE_URL을 rls-poc Preview Branch DB로 설정
 * 실행: npx tsx scripts/test-with-temple-context.ts
 *
 * ⚠️ 절대 main DB에서 실행하지 말 것
 */
import { withTempleContext } from '../lib/db/with-temple-context'

async function test() {
  console.log('=== withTempleContext 검증 시작 ===\n')

  // 테스트 1: 미래사 컨텍스트
  console.log('[Test 1] 미래사 컨텍스트로 조회')
  try {
    const result = await withTempleContext('miraesa', async (tx) => {
      return tx.$queryRaw<Array<{ full_name: string }>>`
        SELECT full_name FROM believers ORDER BY full_name
      `
    })
    console.log(`  결과: ${result.length}개`)
    console.log(`  이름: ${result.map(b => b.full_name).join(', ') || '(없음)'}`)
  } catch (e) {
    console.log(`  에러: ${e instanceof Error ? e.message : e}`)
  }
  console.log('')

  // 테스트 2: 다른사찰 컨텍스트
  console.log('[Test 2] other-temple 컨텍스트로 조회')
  try {
    const result = await withTempleContext('other-temple', async (tx) => {
      return tx.$queryRaw<Array<{ full_name: string }>>`
        SELECT full_name FROM believers ORDER BY full_name
      `
    })
    console.log(`  결과: ${result.length}개`)
    console.log(`  이름: ${result.map(b => b.full_name).join(', ') || '(없음)'}`)
  } catch (e) {
    console.log(`  에러: ${e instanceof Error ? e.message : e}`)
  }
  console.log('')

  // 테스트 3: 존재하지 않는 사찰
  console.log('[Test 3] nonexistent 컨텍스트로 조회')
  try {
    const result = await withTempleContext('nonexistent', async (tx) => {
      return tx.$queryRaw<Array<{ full_name: string }>>`
        SELECT full_name FROM believers
      `
    })
    console.log(`  결과: ${result.length}개 (0 기대)`)
  } catch (e) {
    console.log(`  에러: ${e instanceof Error ? e.message : e}`)
  }
  console.log('')

  // 테스트 4: 빈 slug 거부
  console.log('[Test 4] 빈 slug → 에러 기대')
  try {
    await withTempleContext('', async (tx) => {
      return tx.$queryRaw`SELECT 1`
    })
    console.log('  ❌ 에러가 발생해야 하는데 통과됨')
  } catch (e) {
    console.log(`  ✅ 정상 거부: ${e instanceof Error ? e.message : e}`)
  }
  console.log('')

  // 테스트 5: EXCLUDED_SLUGS 경고
  console.log('[Test 5] munsusa (EXCLUDED_SLUG) → 경고 로그 확인')
  try {
    await withTempleContext('munsusa', async (tx) => {
      return tx.$queryRaw`SELECT 1`
    })
    console.log('  ✅ 실행됨 (경고 로그는 콘솔에서 확인)')
  } catch (e) {
    console.log(`  에러: ${e instanceof Error ? e.message : e}`)
  }

  console.log('\n=== 검증 완료 ===')
}

test()
  .catch(console.error)
  .finally(() => process.exit(0))
